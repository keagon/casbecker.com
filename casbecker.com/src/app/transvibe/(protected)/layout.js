import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getAllowedKeys() {
  const raw = process.env.TRANSVIBE_API_KEYS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export default function ProtectedLayout({ children }) {
  const allowed = getAllowedKeys();
  if (!allowed.length) {
    redirect("/transvibe/login");
  }

  const cookieName = process.env.TRANSVIBE_COOKIE_NAME || "transvibe_session";
  const cookie = cookies().get(cookieName)?.value || "";
  let ok = false;
  if (cookie.startsWith("v1::")) {
    const given = cookie.slice(4);
    for (const key of allowed) {
      if (sha256Hex(key) === given) {
        ok = true;
        break;
      }
    }
  }

  if (!ok) {
    redirect("/transvibe/login");
  }

  return children;
}


