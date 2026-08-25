import { SectionIndex } from "./section-index";

type Section = readonly [string, string];

type AgenticSectionIndexProps = {
  sections: readonly Section[];
};

export function AgenticSectionIndex({ sections }: AgenticSectionIndexProps) {
  return <SectionIndex sections={sections} label="Case study" />;
}
