import { ImageResponse } from "next/og";

export const alt = "Ömer Faruk Koç — MLOps & AI Platform Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          background: "#101210",
          color: "#f0f0e8",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 54, height: 2, background: "#b8f36b" }} />
          <div style={{ fontSize: 20, letterSpacing: 3.5, color: "#a7afa6" }}>
            ENGINEERING PORTFOLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 990 }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1.2, color: "#b8f36b" }}>
            ÖMER FARUK KOÇ
          </div>
          <div style={{ marginTop: 24, fontSize: 72, fontWeight: 700, letterSpacing: -3.8, lineHeight: 1.02 }}>
            MLOps &amp; AI Platform Engineer
          </div>
          <div style={{ marginTop: 30, maxWidth: 880, fontSize: 28, lineHeight: 1.42, color: "#cdd2ca" }}>
            Building production ML platforms, RAG systems, data pipelines and event-driven applications.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #303630",
            paddingTop: 24,
            color: "#939b93",
            fontSize: 19,
            letterSpacing: 1.5,
          }}
        >
          <div>ML PLATFORMS · RAG · DATA · DISTRIBUTED SYSTEMS</div>
          <div style={{ color: "#f0f0e8", fontWeight: 700 }}>omerfkoc.dev</div>
        </div>
      </div>
    ),
    size,
  );
}
