import { convert } from "html-to-text";

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, 
];

export async function parseUrl(
  url: string
): Promise<{ text: string; title: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http(s) URLs are supported");
  }

  if (PRIVATE_HOST_PATTERNS.some((p) => p.test(parsed.hostname))) {
    throw new Error("This host is not allowed");
  }

  const res = await fetch(parsed.toString(), {
    headers: {
      "User-Agent": "ChatWithDocsBot/1.0",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }
  const MAX_HTML_BYTES = 5 * 1024 * 1024; 
  const html = await res.text();
  if (Buffer.byteLength(html, "utf-8") > MAX_HTML_BYTES) {
    throw new Error("Page is too large to import");
  }

  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  const title = titleMatch ? titleMatch[1].trim() : parsed.hostname;

  const text = convert(html, {
    wordwrap: false,
    selectors: [
      { selector: "script", format: "skip" },
      { selector: "style", format: "skip" },
      { selector: "nav", format: "skip" },
      { selector: "footer", format: "skip" },
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ],
  });

  return { text: text.trim(), title };
}