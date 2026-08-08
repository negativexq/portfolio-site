"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/graph", label: "Graph" },
  { href: "/learning", label: "Learning" },
  { href: "/resume", label: "Resume" },
];

function NavigationLinks() {
  const pathname = usePathname();

  return (
    <ul>
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
        >
          GitHub <ArrowUpRight aria-hidden="true" size={14} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="Ömer Faruk Koç — Home">
          ÖFK
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <NavigationLinks />
        </nav>

        <details className="mobile-nav">
          <summary>
            <Menu aria-hidden="true" size={18} /> <span>Menu</span>
          </summary>
          <nav aria-label="Mobile navigation">
            <NavigationLinks />
          </nav>
        </details>
      </div>
    </header>
  );
}
