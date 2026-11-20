import type { ExperienceImpact } from "@/lib/content/types";
import { ProjectProof } from "./project-proof";
import { TagList } from "./tag-list";

type ExperienceStoryProps = {
  impact: ExperienceImpact;
};

export function ExperienceStory({ impact }: ExperienceStoryProps) {
  return (
    <article id={impact.id} className="experience-story">
      <p className="story-index">{impact.area}</p>
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
