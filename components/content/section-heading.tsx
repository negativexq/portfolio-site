import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <header className="section-heading" data-reveal>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </header>
  );
}
