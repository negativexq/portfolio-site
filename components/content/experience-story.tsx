import type { ExperienceImpact } from "@/lib/content/types";
import { TagList } from "./tag-list";

type ExperienceStoryProps = {
  impact: ExperienceImpact;
  index: number;
};

export function ExperienceStory({ impact, index }: ExperienceStoryProps) {
  return (
    <article className="experience-story">
      <p className="story-index">Impact / {String(index).padStart(2, "0")}</p>
      <h3>{impact.title}</h3>
      <p className="story-summary">{impact.summary}</p>
      {impact.proof ? <p className="story-proof">{impact.proof}</p> : null}
      <TagList items={impact.topics} label={`${impact.title} topics`} />
    </article>
  );
}
