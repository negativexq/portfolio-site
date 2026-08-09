import type { ProofPoint } from "@/lib/content/types";

type ProjectProofProps = {
  proof: ProofPoint;
  compact?: boolean;
};

export function ProjectProof({ proof, compact = false }: ProjectProofProps) {
  return (
    <div className={`project-proof${compact ? " project-proof-compact" : ""}`}>
      <p className="proof-label">{proof.label}</p>
      <p className="proof-value">{proof.value}</p>
      {proof.scope ? <p className="proof-scope">{proof.scope}</p> : null}
      {proof.qualifier ? (
        <p className={`proof-qualifier${compact ? " proof-qualifier-compact" : ""}`}>
          {proof.qualifier}
        </p>
      ) : null}
    </div>
  );
}
