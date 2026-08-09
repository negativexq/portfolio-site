import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party skill packages (not app source, not gitignore-excludable
    // from lint since eslint can still be pointed at them explicitly):
    ".claude/**",
    ".agents/**",
    ".codex/**",
  ]),
]);

export default eslintConfig;
