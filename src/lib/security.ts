export const sanitizeText = (value: string | null | undefined) =>
  (value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const blockedProtocols = ["javascript:", "data:", "vbscript:"];

export const isSafeUrl = (value: string) => {
  try {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();
    if (blockedProtocols.some((protocol) => lower.startsWith(protocol))) {
      return false;
    }
    const url = new URL(trimmed);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.includes("@") && !trimmed.includes("://") && !trimmed.startsWith("mailto:")) {
    return `mailto:${trimmed}`;
  }
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const getDevice = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|iphone|android/.test(ua)) return "mobile";
  if (/tablet|ipad/.test(ua)) return "tablet";
  return "desktop";
};

export const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/")) return "Safari";
  return "Other";
};

export const sha256 = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const createVisitorHash = async (profileId: string) => {
  const day = new Date().toISOString().slice(0, 10);
  return sha256(`${navigator.userAgent}|${day}|${profileId}`);
};
