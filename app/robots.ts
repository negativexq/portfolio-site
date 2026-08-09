import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Bingbot",
        ],
        allow: "/",
      },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://omerfkoc.dev/sitemap.xml",
  };
}
