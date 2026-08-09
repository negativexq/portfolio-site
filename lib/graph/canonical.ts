const technologyAliases: Readonly<Record<string, string>> = {
  dbt: "dbt Core",
  otel: "OpenTelemetry",
  postgres: "PostgreSQL",
};

export function graphSlug(value: string) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function canonicalTechnologyLabel(value: string) {
  const normalized = value.trim();
  return technologyAliases[normalized.toLocaleLowerCase("en-US")] ?? normalized;
}

export function technologyNodeId(value: string) {
  return `technology:${graphSlug(canonicalTechnologyLabel(value))}`;
}

export function conceptNodeId(value: string) {
  return `concept:${graphSlug(value)}`;
}

export const intentionalTechnologyDistinctions = [
  ["Docker", "Docker Compose"],
  ["MCP", "FastMCP"],
] as const;
