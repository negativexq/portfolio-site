import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealObserver } from "@/components/motion/reveal-observer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://omerfkoc.dev"),
  title: {
    default: "Ömer Faruk Koç — MLOps & AI Platform Engineer",
    template: "%s — Ömer Faruk Koç",
  },
  description:
    "MLOps & AI Platform Engineer building production ML platforms, RAG systems, data pipelines and event-driven applications.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://omerfkoc.dev",
    siteName: "Ömer Faruk Koç",
    title: "Ömer Faruk Koç — MLOps & AI Platform Engineer",
    description:
      "MLOps & AI Platform Engineer building production ML platforms, RAG systems, data pipelines and event-driven applications.",
    images: [{ url: "/opengraph-image", alt: "Ömer Faruk Koç — MLOps & AI Platform Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ömer Faruk Koç — MLOps & AI Platform Engineer",
    description:
      "MLOps & AI Platform Engineer building production ML platforms, RAG systems, data pipelines and event-driven applications.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <RevealObserver />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="site-frame">
          <SiteHeader />
          <div className="site-content" id="main-content">
            {children}
          </div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
