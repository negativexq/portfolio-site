import type { Metadata } from "next";
import { ExperienceStory } from "@/components/content/experience-story";
import { JsonLd } from "@/components/content/json-ld";
import { MetricGrid } from "@/components/content/metric-grid";
import { experiences } from "@/data/experience";
import { metrics } from "@/data/metrics";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Experience",
  description: "Production AI/ML, data platform and Generative AI engineering experience.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  const experience = experiences[0];
  // Occupation only: the role ended in Mar 2026, so a present-tense
  // `worksFor` would assert an employer relationship that no longer holds.
  const occupationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${profile.links.website}/#person`,
    name: profile.name,
    url: profile.links.website,
    jobTitle: profile.title,
    hasOccupation: {
      "@type": "Occupation",
      name: experience.role,
      occupationLocation: { "@type": "Place", name: experience.location },
      skills: experience.impacts.flatMap((impact) => impact.topics),
    },
  };

  return (
    <main>
      <JsonLd data={occupationJsonLd} />
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

      <section className="section-shell metric-section" aria-label="Career experience metrics">
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
