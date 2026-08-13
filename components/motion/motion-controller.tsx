"use client";

import { useEffect } from "react";

/**
 * Drives the `[data-reveal]` / `[data-hover-lift]` animations.
 *
 * Mounted per page rather than in the root layout, and GSAP is loaded through
 * a dynamic import so it becomes its own async chunk: /experience, /resume,
 * /graph and the project case studies render no animated elements and must
 * not pay for a ~60KB animation library. Add this to any page that renders
 * SectionHeading, ProjectCard, LearningCard or its own `data-reveal` markup —
 * without it those elements simply render in their natural state.
 */
export function MotionController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealContainers = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const liftTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-hover-lift]"));
    if (revealContainers.length === 0 && liftTargets.length === 0) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const cleanupFns: Array<() => void> = [];

      // `gsap.from({opacity: 0})` hides its target the moment it is created,
      // so it must only ever be applied to content we are confident is off
      // screen. If the viewport cannot be measured, animate nothing rather
      // than risk leaving content invisible.
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;

      const ctx = gsap.context(() => {
        for (const container of viewportHeight > 0 ? revealContainers : []) {
          // The library arrives after first paint, so anything already on
          // screen has been seen at its natural state. Animating it now would
          // blank it out and fade it back in — skip it and let the reveal
          // apply only to content the visitor scrolls down to.
          if (container.getBoundingClientRect().top < viewportHeight) continue;

          const children = Array.from(
            container.querySelectorAll<HTMLElement>(":scope > article, :scope > .project-card"),
          );
          const targets = children.length > 0 ? children : [container];

          gsap.from(targets, {
            opacity: 0,
            y: 12,
            duration: 0.4,
            ease: "power1.out",
            stagger: targets.length > 1 ? 0.08 : 0,
            clearProps: "transform",
            scrollTrigger: {
              trigger: container,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        }

        for (const el of liftTargets) {
          const yTo = gsap.quickTo(el, "y", { duration: 0.2, ease: "power2.out" });
          const onEnter = () => yTo(-3);
          const onLeave = () => yTo(0);
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          el.addEventListener("focusin", onEnter);
          el.addEventListener("focusout", onLeave);
          cleanupFns.push(() => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("focusin", onEnter);
            el.removeEventListener("focusout", onLeave);
          });
        }
      });

      dispose = () => {
        cleanupFns.forEach((fn) => fn());
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return null;
}
