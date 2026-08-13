import type { ExperienceImpact } from "@/lib/content/types";
import { ProjectProof } from "./project-proof";
import { TagList } from "./tag-list";

type ExperienceStoryProps = {
  impact: ExperienceImpact;
  index: number;
};

export function ExperienceStory({ impact, index }: ExperienceStoryProps) {
  return (
    <article id={impact.id} className="experience-story">
      <p className="story-index">Impact / {String(index).padStart(2, "0")}</p>
      <h3>{impact.title}</h3>
      <div className="story-body">
        <p className="story-context">{impact.context}</p>
        <p className="story-summary">{impact.summary}</p>
        {impact.proof ? <ProjectProof proof={impact.proof} /> : null}
      </div>
      <TagList items={impact.topics} label={`${impact.title} topics`} />
    </article>
  );
}
