import type { ReactNode } from "react";

type SectionHeadingProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeading({
  id,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <header className="section-heading" data-reveal>
      <div>
        <h2 id={id}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </header>
  );
}
