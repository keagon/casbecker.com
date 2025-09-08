"use client";

import { useState } from "react";

export default function TransvibePage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("auto");
  const [uploadProgress, setUploadProgress] = useState(0); // 0..100
  const [processProgress, setProcessProgress] = useState(0); // 0..100
  const [currentStep, setCurrentStep] = useState("");
  const [logs, setLogs] = useState([]);
  const [model, setModel] = useState("");
  const [usedLanguage, setUsedLanguage] = useState("");
  const [totalChunks, setTotalChunks] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    setResult("");
    setLogs([]);
    setUploadProgress(0);
    setProcessProgress(0);
    setModel("");
    setUsedLanguage("");

    if (!file) {
      setError("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    setIsLoading(true);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/transvibe", true);
    xhr.responseType = "text";

    let buffer = "";

    const handleMessage = (msg) => {
      if (msg?.type === "status") {
        if (typeof msg.progress === "number") {
          setProcessProgress(Math.min(100, Math.max(0, Math.round(msg.progress * 100))));
        }
        if (msg.step) setCurrentStep(msg.step);
        if (typeof msg.totalChunks === "number") setTotalChunks(msg.totalChunks);
        if (typeof msg.chunkIndex === "number") setCurrentChunk(msg.chunkIndex);
        setLogs((l) => [...l, msg.message || msg.step || "status update"]);
      } else if (msg?.type === "done") {
        setProcessProgress(100);
        if (msg.model) setModel(msg.model);
        if (msg.language) setUsedLanguage(msg.language);
        setResult(msg.text || "");
      } else if (msg?.type === "error") {
        setError(msg.message || "Unknown error");
      }
    };

    const processChunk = (text) => {
      buffer += text;
      let idx;
      while ((idx = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          handleMessage(msg);
        } catch (e) {
          // ignore malformed lines
        }
      }
    };

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    };

    xhr.onprogress = () => {
      processChunk(xhr.responseText.substring(processChunk.lastIndex || 0));
      processChunk.lastIndex = xhr.responseText.length;
    };

    xhr.onload = () => {
      // Process any remaining buffered data
      processChunk(xhr.responseText.substring(processChunk.lastIndex || 0));
      setIsLoading(false);
    };

    xhr.onerror = () => {
      setIsLoading(false);
      setError("Network error");
    };

    xhr.send(formData);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Transvibe</h1>
      <p style={{ marginBottom: 16 }}>Upload an audio file to transcribe.</p>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div style={{ height: 12 }} />
        <label style={{ marginRight: 8, fontWeight: 600 }}>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: 6, border: "1px solid #ccc" }}
        >
          <option value="auto">Auto-detect</option>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>
        <div style={{ height: 12 }} />
        <button type="submit" disabled={isLoading} style={{ padding: "8px 16px", fontWeight: 600 }}>
          {isLoading ? "Working..." : "Transcribe"}
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600 }}>Upload progress: {uploadProgress}%</div>
        <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${uploadProgress}%`, height: 8, background: "#4f46e5" }} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600 }}>
          Processing progress: {processProgress}% {currentStep && `(step: ${currentStep})`}
          {totalChunks > 0 && (
            <span> — Segment {Math.max(currentChunk, 0)} / {totalChunks}</span>
          )}
        </div>
        <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${processProgress}%`, height: 8, background: "#10b981" }} />
        </div>
      </div>

      {logs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Steps</div>
          <ul style={{ lineHeight: 1.6 }}>
            {logs.map((line, i) => (
              <li key={i}>• {line}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div style={{ color: "#b00020", marginTop: 16 }}>{error}</div>
      )}

      {result && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Transcription</h2>
          <div style={{ color: "#666", marginBottom: 8 }}>
            {model && `Model: ${model}`} {usedLanguage && `• Language: ${usedLanguage}`}
          </div>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{result}</div>
        </div>
      )}
    </div>
  );
}



