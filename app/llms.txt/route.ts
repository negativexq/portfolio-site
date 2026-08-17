import { profile } from "@/data/profile";
import { renderLlmsTxt } from "@/lib/markdown/llms";

export const dynamic = "force-static";

export function GET() {
  const body = renderLlmsTxt(profile);

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
