"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { Ref } from "react";
import { profile } from "@/data/profile";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/graph", label: "Graph" },
  { href: "/learning", label: "Learning" },
  { href: "/resume", label: "Resume" },
];

function NavigationLinks({
  listRef,
  onLinkClick,
}: {
  listRef?: Ref<HTMLUListElement>;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul ref={listRef}>
      {navigation.map((item) => {
        const isCurrent =
          item.href === "/projects"
            ? pathname.startsWith("/projects")
            : pathname === item.href;

        return (
        <li key={item.href}>
          <Link
            className={`nav-link${isCurrent ? " nav-link-current" : ""}`}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            onClick={onLinkClick}
          >
            {item.label}
          </Link>
        </li>
        );
      })}
      <li>
        <a
          className="nav-link"
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
          onClick={onLinkClick}
        >
          GitHub <ArrowUpRight aria-hidden="true" size={14} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = useCallback(() => {
    const details = detailsRef.current;
    if (details && details.open) details.open = false;
  }, []);

  // Route changed (link click already navigated, or browser back/forward) —
  // make sure a stale open menu never survives into the next page.
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !details.open) return;
      details.open = false;
      details.querySelector("summary")?.focus();
    };

    details.addEventListener("keydown", onKeyDown);
    return () => details.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Ömer Faruk Koç — Home">
          ÖFK
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavigationLinks />
        </nav>

        <details className="mobile-nav" ref={detailsRef}>
          <summary>
            <Menu aria-hidden="true" size={18} /> <span>Menu</span>
          </summary>
          <nav aria-label="Mobile navigation">
            <NavigationLinks onLinkClick={closeMenu} />
          </nav>
        </details>
      </div>
    </header>
  );
}
