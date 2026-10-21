import type { EngineeringArea } from "@/lib/content/types";
import { TagList } from "./tag-list";

type EngineeringAreaCardProps = {
  area: EngineeringArea;
};

export function EngineeringAreaCard({ area }: EngineeringAreaCardProps) {
  return (
    <article className="area-card">
      <div>
        <h3>{area.title}</h3>
        <p>{area.description}</p>
        <TagList items={area.technologies} label={`${area.title} technologies`} />
      </div>
    </article>
  );
}
