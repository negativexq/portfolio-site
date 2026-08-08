import type { EngineeringArea } from "@/lib/content/types";
import { TagList } from "./tag-list";

type EngineeringAreaCardProps = {
  area: EngineeringArea;
  index: number;
};

export function EngineeringAreaCard({ area, index }: EngineeringAreaCardProps) {
  return (
    <article className="area-card">
      <span className="area-index">{String(index).padStart(2, "0")}</span>
      <div>
        <h3>{area.title}</h3>
        <p>{area.description}</p>
        <TagList items={area.technologies} label={`${area.title} technologies`} />
      </div>
    </article>
  );
}
