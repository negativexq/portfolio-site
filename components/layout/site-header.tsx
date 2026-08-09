"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Ref } from "react";
import gsap from "gsap";
import { profile } from "@/data/profile";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/graph", label: "Graph" },
  { href: "/learning", label: "Learning" },
  { href: "/resume", label: "Resume" },
];

function NavigationLinks({ listRef }: { listRef?: Ref<HTMLUListElement> }) {
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
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const menuListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    const menuList = menuListRef.current;
    if (!details || !menuList) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const onToggle = () => {
      if (details.open) {
        // Animate the ul itself (already position:absolute), not an ancestor:
        // a lingering GSAP transform on the <nav> wrapper would make it the
        // new containing block for this absolutely-positioned list and break
        // its left:0/right:0 sizing.
        gsap.from(menuList, {
          opacity: 0,
          y: -6,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "transform",
        });
      }
    };

    details.addEventListener("toggle", onToggle);
    return () => details.removeEventListener("toggle", onToggle);
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
            <NavigationLinks listRef={menuListRef} />
          </nav>
        </details>
      </div>
    </header>
  );
}
