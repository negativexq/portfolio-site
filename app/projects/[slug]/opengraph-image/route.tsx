import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { getProjectBySlug, projects } from "@/data/projects";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return new Response("Project not found", { status: 404 });

  const fontSize = project.title.length > 55 ? 60 : project.title.length > 35 ? 68 : 76;
  const description = project.metaDescription ?? project.summary;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 76px",
          background: "#101210",
          color: "#f0f0e8",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <div style={{ color: "#a3d65a" }}>{project.category}</div>
          <div style={{ color: "#a7afa6" }}>Project</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1048 }}>
          <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            {project.title}
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 26, lineHeight: 1.35, color: "#cdd2ca" }}>
            {description}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 23, color: "#a3d65a" }}>
            {project.technologies.slice(0, 3).join(" · ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #303630",
            paddingTop: 24,
            fontSize: 24,
          }}
        >
          <div style={{ color: "#cdd2ca" }}>{profile.name}</div>
          <div style={{ color: "#a7afa6" }}>omerfkoc.dev</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
