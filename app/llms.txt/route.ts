import { profile } from "@/data/profile";
import { renderLlmsTxt } from "@/lib/markdown/llms";
import { getPublishedArticles } from "@/lib/writing/articles";

export const dynamic = "force-static";

export function GET() {
  const body = renderLlmsTxt(profile, getPublishedArticles());

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
