import { NextResponse } from "next/server";

const COOKIE_NAME = process.env.TRANSVIBE_COOKIE_NAME || "transvibe_session";

function getAllowedKeys() {
  const raw = process.env.TRANSVIBE_API_KEYS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function sha256Hex(input) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow the login page and the auth endpoint without a session
  if (pathname === "/transvibe/login" || pathname === "/api/transvibe/auth") {
    return NextResponse.next();
  }

  const allowedKeys = getAllowedKeys();
  const hasKeysConfigured = allowedKeys.length > 0;

  // If no keys are configured, deny all to avoid accidental public exposure
  if (!hasKeysConfigured) {
    if (pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/transvibe/login";
    return NextResponse.redirect(url);
  }

  // 1) Header-based access for programmatic API calls
  const headerKey = request.headers.get("x-transvibe-key");
  if (headerKey && allowedKeys.includes(headerKey)) {
    return NextResponse.next();
  }

  // 2) Cookie-based access for browser session
  const cookie = request.cookies.get(COOKIE_NAME)?.value || "";
  if (cookie.startsWith("v1::")) {
    const cookieHash = cookie.slice(4);
    // Compare to sha256 of any allowed key
    for (const key of allowedKeys) {
      const hash = await sha256Hex(key);
      if (hash === cookieHash) {
        return NextResponse.next();
      }
    }
  }

  // Not authorized
  if (pathname.startsWith("/api/")) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/transvibe/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/transvibe",
    "/transvibe/(.*)",
    "/api/transvibe",
    "/api/transvibe/(.*)",
  ],
};


