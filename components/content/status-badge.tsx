import type { ProjectStatus } from "@/lib/content/types";

type StatusBadgeProps = {
  status: ProjectStatus;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{label ?? status}</span>;
}
