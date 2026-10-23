"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";

export type ProjectIndexItem = {
  title: string;
  category: string;
  href: string;
  purpose: string;
  image: { src: string; alt: string } | null;
};

// Rows of projects; pointing at a row (or tabbing to it) opens one preview
// frame level with that row. The frame follows the row, never the pointer,
// and only exists on fine pointers. Every row reads fully without it.
export function ProjectIndex({ items }: { items: ProjectIndexItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  function show(index: number, row: HTMLElement) {
    if (!items[index].image || !root.current || !frame.current) return setActive(null);
    const y = row.offsetTop + row.offsetHeight / 2 - frame.current.offsetHeight / 2;
    const max = root.current.offsetHeight - frame.current.offsetHeight;
    setOffset(Math.min(max, Math.max(0, y)));
    setActive(index);
  }

  const current = active === null ? null : items[active];

  return (
    <div
      className="brief-index"
      ref={root}
      onPointerLeave={() => setActive(null)}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setActive(null);
      }}
    >
      <ul>
        {items.map((item, index) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onPointerEnter={(event) => show(index, event.currentTarget)}
              onFocus={(event) => show(index, event.currentTarget)}
            >
              <span className="brief-index-title">
                {item.title}
                <ArrowUpRight aria-hidden="true" size={22} />
              </span>
              <span className="brief-index-category">{item.category}</span>
              <span className="brief-index-purpose">{item.purpose}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className={`brief-index-frame${current?.image ? " is-open" : ""}`}
        ref={frame}
        style={{ transform: `translateY(${offset}px)` }}
      >
        {items.map((item) =>
          item.image ? (
            <Image
              alt=""
              className={current === item ? "is-current" : undefined}
              fill
              key={item.href}
              sizes="30vw"
              src={item.image.src}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
