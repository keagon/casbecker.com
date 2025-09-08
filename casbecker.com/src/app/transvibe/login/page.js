"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransvibeLoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!key) {
      setError("Please enter your API key.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/transvibe/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");
      router.replace("/transvibe");
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Transvibe Login</h1>
      <p style={{ marginBottom: 16 }}>Enter your API key to continue.</p>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          placeholder="API key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ width: "100%", padding: 8, border: "1px solid #ccc" }}
        />
        <div style={{ height: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: "8px 16px", fontWeight: 600 }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {error && <div style={{ color: "#b00020", marginTop: 16 }}>{error}</div>}
    </div>
  );
}
