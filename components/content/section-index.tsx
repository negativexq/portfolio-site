"use client";

import { useEffect, useState } from "react";

type Section = readonly [string, string];

type SectionIndexProps = {
  sections: readonly Section[];
  label: string;
};

export function SectionIndex({ sections, label }: SectionIndexProps) {
  const [activeId, setActiveId] = useState(sections[0]?.[0] ?? "");

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.28;
      let currentId = sections[0]?.[0] ?? "";

      for (const [id] of sections) {
        const section = document.getElementById(id);
        if (!section) continue;

        const bounds = section.getBoundingClientRect();
        if (bounds.top <= marker && bounds.bottom > marker) {
          currentId = id;
          break;
        }

        if (bounds.top < marker) currentId = id;
      }

      setActiveId((previousId) => previousId === currentId ? previousId : currentId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleSection) setActiveId(visibleSection.target.id);
      },
      { rootMargin: "-28% 0px -65% 0px", threshold: 0 },
    );

    for (const [id] of sections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      observer.disconnect();
    };
  }, [sections]);

  return (
    <aside className="detail-index" aria-label={label}>
      <span>{label}</span>
      {sections.map(([id, sectionLabel]) => (
        <a
          key={id}
          className={activeId === id ? "is-active" : undefined}
          href={`#${id}`}
          aria-current={activeId === id ? "location" : undefined}
          onClick={() => setActiveId(id)}
        >
          {sectionLabel}
        </a>
      ))}
    </aside>
  );
}
