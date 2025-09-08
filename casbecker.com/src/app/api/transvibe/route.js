import { NextResponse } from "next/server";
import OpenAI from "openai";
import crypto from "crypto";
import { cookies as nextCookies } from "next/headers";
import path from "path";
import os from "os";
import fs from "fs";
import fsp from "fs/promises";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = ["iad1"]; // optional: pin to a single region if your host supports it
export const maxDuration = 300; // allow up to 5 minutes for large files on Vercel

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function writeUploadedFileToTemp(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), "transvibe-upload-"));
  const inputPath = path.join(tempDir, file.name || `upload-${Date.now()}`);
  await fsp.writeFile(inputPath, buffer);
  return { tempDir, inputPath };
}

async function transcodeAndSegmentToOpus(inputPath, segmentSeconds = 600) {
  const outputDir = await fsp.mkdtemp(path.join(os.tmpdir(), "transvibe-chunks-"));
  const outputPattern = path.join(outputDir, "part-%03d.ogg");

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libopus")
      .audioChannels(1)
      .audioBitrate("64k")
      .format("ogg")
      .outputOptions([
        "-f segment",
        `-segment_time ${segmentSeconds}`,
        "-reset_timestamps 1",
      ])
      .on("error", (err) => reject(err))
      .on("end", () => resolve())
      .save(outputPattern);
  });

  const files = (await fsp.readdir(outputDir))
    .filter((n) => n.startsWith("part-") && n.endsWith(".ogg"))
    .sort();
  const filePaths = files.map((n) => path.join(outputDir, n));
  return { outputDir, chunkPaths: filePaths };
}

async function transcribeChunksWithOpenAI(chunkPaths, languageHint) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in environment.");
  }
  const model = process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1";

  const openai = new OpenAI({ apiKey });
  const segments = [];

  for (const chunkPath of chunkPaths) {
    const stream = fs.createReadStream(chunkPath);
    const params = {
      file: stream,
      model,
      response_format: "json",
      temperature: 0,
    };
    if (languageHint && languageHint !== "auto") {
      params.language = languageHint;
    }
    const result = await openai.audio.transcriptions.create(params);
    // The SDK returns an object which typically has a `.text` field
    const text = result?.text || "";
    segments.push(text);
  }

  const merged = segments.join(" ").replace(/\s+/g, " ").trim();
  return { merged, segments, model };
}

function getAllowedKeys() {
  const raw = process.env.TRANSVIBE_API_KEYS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function hashSha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function isAuthorized(request) {
  const allowed = getAllowedKeys();
  if (!allowed.length) return false;
  // header key
  const headerKey = request.headers.get("x-transvibe-key");
  if (headerKey && allowed.includes(headerKey)) return true;
  // cookie key
  const cookieName = process.env.TRANSVIBE_COOKIE_NAME || "transvibe_session";
  const cookie = nextCookies().get(cookieName)?.value || "";
  if (cookie.startsWith("v1::")) {
    const given = cookie.slice(4);
    for (const k of allowed) {
      if (hashSha256Hex(k) === given) return true;
    }
  }
  return false;
}

function getCorsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const raw = process.env.TRANSVIBE_ALLOWED_ORIGINS || "*";
  const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
  let allowOrigin = "";
  if (allowed.includes("*")) {
    allowOrigin = "*";
  } else if (origin && allowed.includes(origin)) {
    allowOrigin = origin;
  }
  const headers = {
    ...(allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin } : {}),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-transvibe-key",
  };
  return headers;
}

export async function OPTIONS(request) {
  const headers = getCorsHeaders(request);
  return new Response(null, { status: 204, headers });
}

export async function POST(request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start: async (controller) => {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      let tempDir = null;
      let outputDir = null;
      try {
        // Authorization check (defense-in-depth in addition to middleware)
        const ok = await isAuthorized(request);
        if (!ok) {
          send({ type: "error", message: "Unauthorized" });
          controller.close();
          return;
        }
        const formData = await request.formData();
        const file = formData.get("file");
        const language = (formData.get("language") || "auto").toString().toLowerCase();
        const languageHint = ["auto", "en", "nl"].includes(language) ? language : "auto";

        if (!file || typeof file === "string") {
          send({ type: "error", message: "No audio file provided under field 'file'." });
          controller.close();
          return;
        }

        send({ type: "status", step: "received", message: "File received", progress: 0.05, language: languageHint });

        const writeRes = await writeUploadedFileToTemp(file);
        tempDir = writeRes.tempDir;
        const inputPath = writeRes.inputPath;

        send({ type: "status", step: "transcoding", message: "Transcoding and segmenting to Opus", progress: 0.1 });

        const segmentRes = await transcodeAndSegmentToOpus(inputPath, 600);
        outputDir = segmentRes.outputDir;
        const chunkPaths = segmentRes.chunkPaths;
        const totalChunks = chunkPaths.length;
        send({
          type: "status",
          step: "segmented",
          totalChunks,
          message: `Segmented into ${totalChunks} part${totalChunks === 1 ? '' : 's'}. Will send ${totalChunks} transcription request${totalChunks === 1 ? '' : 's'}.`,
          progress: 0.2,
        });

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error("Missing OPENAI_API_KEY in environment.");
        }
        const model = process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1";
        const openai = new OpenAI({ apiKey });

        const segments = [];
        let index = 0;
        for (const chunkPath of chunkPaths) {
          index += 1;
          const transcribeProgress = 0.2 + 0.75 * (index - 1) / Math.max(totalChunks, 1);
          send({
            type: "status",
            step: "transcribing",
            chunkIndex: index,
            totalChunks,
            message: `Transcribing segment ${index} of ${totalChunks}`,
            progress: transcribeProgress,
          });
          const streamFile = fs.createReadStream(chunkPath);
          const params = { file: streamFile, model, response_format: "json", temperature: 0 };
          if (languageHint && languageHint !== "auto") params.language = languageHint;
          const result = await openai.audio.transcriptions.create(params);
          const text = result?.text || "";
          segments.push(text);
        }

        send({ type: "status", step: "merging", progress: 0.98 });
        const merged = segments.join(" ").replace(/\s+/g, " ").trim();
        send({ type: "done", model, language: languageHint, text: merged, segments, progress: 1 });
      } catch (err) {
        send({ type: "error", message: err?.message || "Unknown error" });
      } finally {
        try {
          if (tempDir) await fsp.rm(tempDir, { recursive: true, force: true });
        } catch {}
        try {
          if (outputDir) await fsp.rm(outputDir, { recursive: true, force: true });
        } catch {}
        controller.close();
      }
    }
  });

  const cors = getCorsHeaders(request);
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      ...cors,
    }
  });
}


