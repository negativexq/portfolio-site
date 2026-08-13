import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

// Kept in sync with the site tokens in app/globals.css (dark theme).
const BACKGROUND = "#101210";
const FOREGROUND = "#f0f0e8";
const ACCENT = "#a3d65a";
const MUTED = "#a7afa6";
const BODY = "#cdd2ca";
const BORDER = "#303630";

export const alt = `${profile.name} — ${profile.title}`;
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
          background: BACKGROUND,
          color: FOREGROUND,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 54, height: 2, background: ACCENT }} />
          <div style={{ fontSize: 20, letterSpacing: 3.5, color: MUTED }}>
            ENGINEERING PORTFOLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 990 }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 1.2, color: ACCENT }}>
            {profile.name.toLocaleUpperCase("tr-TR")}
          </div>
          <div style={{ marginTop: 24, fontSize: 72, fontWeight: 700, letterSpacing: -3.8, lineHeight: 1.02 }}>
            {profile.title}
          </div>
          <div style={{ marginTop: 30, maxWidth: 880, fontSize: 28, lineHeight: 1.42, color: BODY }}>
            {profile.positioning}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 24,
            color: "#939b93",
            fontSize: 19,
            letterSpacing: 1.5,
          }}
        >
          <div>AI PLATFORMS · AGENT SYSTEMS · RETRIEVAL · DATA</div>
          <div style={{ color: FOREGROUND, fontWeight: 700 }}>omerfkoc.dev</div>
        </div>
      </div>
    ),
    size,
  );
}
