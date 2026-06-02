import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function renderContent(source: string) {
  const trimmed = source.trim();
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  const html = looksLikeHtml ? trimmed : ((marked.parse(source, { async: false }) as string) ?? "");

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "video",
      "source",
      "figure",
      "figcaption",
      "hr",
      "span",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "loading"],
      video: ["src", "controls", "poster", "playsinline", "preload"],
      source: ["src", "type"],
      span: ["class"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer noopener", target: "_blank" }),
    },
  });
}
