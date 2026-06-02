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
    allowedStyles: {
      figure: {
        width: [/^\d+(\.\d+)?%$/],
      },
      img: {
        width: [/^\d+(\.\d+)?%$/],
      },
    },
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "loading", "style", "data-media-id"],
      video: ["src", "controls", "poster", "playsinline", "preload", "style", "data-media-id"],
      source: ["src", "type"],
      figure: ["class", "style", "data-media-id"],
      figcaption: ["class"],
      span: ["class"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer noopener", target: "_blank" }),
    },
  });
}
