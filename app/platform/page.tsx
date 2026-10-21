import type { Metadata } from "next";
import { JsonLd } from "@/components/content/json-ld";
import { PlatformPage } from "@/components/content/platform-page";
import { platformNodes } from "@/data/platform";
import { profile } from "@/data/profile";
import { buildCollectionPage } from "@/lib/seo/collection";

const PLATFORM_TITLE = "AI Platform Architecture | Ömer Faruk Koç";
const PLATFORM_DESCRIPTION =
  "Implemented AI subsystems, their engineering evidence, and the architecture they are evolving toward.";

export const metadata: Metadata = {
  title: { absolute: PLATFORM_TITLE },
  description: PLATFORM_DESCRIPTION,
  alternates: { canonical: "/platform" },
  openGraph: {
    type: "website",
    title: PLATFORM_TITLE,
    description: PLATFORM_DESCRIPTION,
    url: "/platform",
    images: [{ url: "/opengraph-image", alt: "Ömer Faruk Koç" }],
  },
  twitter: {
    card: "summary_large_image",
    title: PLATFORM_TITLE,
    description: PLATFORM_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function PlatformRoute() {
  return (
    <>
      <JsonLd
        data={buildCollectionPage(profile, {
          path: "/platform",
          name: "AI Platform Architecture",
          description: PLATFORM_DESCRIPTION,
          items: platformNodes.map((node) => ({ name: node.title })),
        })}
      />
      <PlatformPage />
    </>
  );
}
