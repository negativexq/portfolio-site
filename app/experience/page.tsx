import type { Metadata } from "next";
import { ExperienceStory } from "@/components/content/experience-story";
import { MetricGrid } from "@/components/content/metric-grid";
import { experiences } from "@/data/experience";
import { metrics } from "@/data/metrics";

export const metadata: Metadata = {
  title: "Experience — Ömer Faruk Koç",
  description: "Production AI/ML, data platform and Generative AI engineering experience.",
};

export default function ExperiencePage() {
  const experience = experiences[0];

  return (
    <main>
      <header className="page-hero container experience-hero">
        <p className="eyebrow">Professional experience</p>
        <div className="experience-title-row">
          <div>
            <h1>{experience.role}</h1>
            <p>{experience.summary}</p>
          </div>
          <dl>
            <div><dt>Company</dt><dd>{experience.company}</dd></div>
            <div><dt>Team</dt><dd>{experience.team}</dd></div>
            <div><dt>Period</dt><dd>{experience.period}</dd></div>
            <div><dt>Location</dt><dd>{experience.location}</dd></div>
          </dl>
        </div>
      </header>

      <section className="section-shell metric-section" aria-label="Verified experience metrics">
        <div className="container"><MetricGrid metrics={metrics} /></div>
      </section>

      <section className="section-shell" aria-labelledby="impact-stories">
        <div className="container">
          <header className="editorial-heading">
            <p className="eyebrow">Selected impact</p>
            <h2 id="impact-stories">Platform work through outcomes.</h2>
            <p>Stories are organized around engineering changes and measurable effects rather than a conventional responsibility list.</p>
          </header>
          <div className="experience-story-grid">
            {experience.impacts.map((impact, index) => (
              <ExperienceStory key={impact.id} impact={impact} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-tinted">
        <div className="container separation-block">
          <p className="eyebrow">Clear separation</p>
          <h2>Professional work shaped the engineering problems explored in public projects.</h2>
          <p>The portfolio projects are independent public engineering work. They are not Fibabanka source code or representations of internal systems.</p>
        </div>
      </section>
    </main>
  );
}
