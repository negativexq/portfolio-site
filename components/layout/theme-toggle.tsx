"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

type Theme = "system" | "light" | "dark";

const order: readonly Theme[] = ["system", "light", "dark"];
const labels: Record<Theme, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" ? value : "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") delete root.dataset.theme;
  else root.dataset.theme = theme;
  try {
    if (theme === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the choice still holds for this page view.
  }
}

/** Cycles System → Light → Dark. The icon shows the current setting. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the theme the head script applied
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const next = order[(order.indexOf(theme) + 1) % order.length];
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={`${labels[theme]}. Switch to ${labels[next].toLowerCase()}`}
      title={`${labels[theme]}, switch to ${next}`}
      data-mounted={mounted || undefined}
    >
      <Icon aria-hidden="true" size={16} />
    </button>
  );
}
