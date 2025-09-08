import { NextResponse } from "next/server";

// Simple in-memory rate limiter (per-IP) for login attempts
// If >5 failed attempts, lock for 60 seconds
const attemptsByIp = new Map();

function getClientIp(request) {
  const xfwd = request.headers.get("x-forwarded-for");
  if (xfwd) return xfwd.split(",")[0].trim();
  const xreal = request.headers.get("x-real-ip");
  if (xreal) return xreal.trim();
  return "unknown";
}

const COOKIE_NAME = process.env.TRANSVIBE_COOKIE_NAME || "transvibe_session";

async function sha256Hex(input) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getAllowedKeys() {
  const raw = process.env.TRANSVIBE_API_KEYS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export async function POST(request) {
  try {
    const { key } = await request.json();

    // Rate limiting and lockout handling
    const ip = getClientIp(request);
    const now = Date.now();
    const state = attemptsByIp.get(ip) || { failures: 0, lockedUntil: 0 };
    if (state.lockedUntil && state.lockedUntil > now) {
      const seconds = Math.ceil((state.lockedUntil - now) / 1000);
      return new NextResponse(JSON.stringify({ error: "Too many attempts. Try again later." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(seconds),
        },
      });
    }

    const allowed = getAllowedKeys();
    if (!allowed.length) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }
    if (!key || !allowed.includes(key)) {
      const failures = (state.failures || 0) + 1;
      if (failures >= 5) {
        const lockedUntil = Date.now() + 60 * 1000;
        attemptsByIp.set(ip, { failures: 0, lockedUntil });
        return new NextResponse(JSON.stringify({ error: "Too many attempts. Try again in 60s." }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        });
      }
      attemptsByIp.set(ip, { failures, lockedUntil: 0 });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Success: clear failures/lock
    attemptsByIp.delete(ip);

    const hash = await sha256Hex(key);
    const cookieValue = `v1::${hash}`;

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}


