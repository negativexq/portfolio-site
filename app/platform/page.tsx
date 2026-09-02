import type { Metadata } from "next";
import { PlatformPage } from "@/components/content/platform-page";

export const metadata: Metadata = {
  title: { absolute: "AI Platform Architecture | Ömer Faruk Koç" },
  description:
    "Implemented AI subsystems, their engineering evidence, and the architecture they are evolving toward.",
  alternates: { canonical: "/platform" },
  openGraph: {
    title: "AI Platform Architecture | Ömer Faruk Koç",
    description:
      "Implemented AI subsystems, their engineering evidence, and the architecture they are evolving toward.",
    url: "/platform",
  },
};

export default function PlatformRoute() {
  return <PlatformPage />;
}
