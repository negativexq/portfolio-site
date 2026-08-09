"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MotionController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealContainers = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const liftTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-hover-lift]"));

    if (reducedMotion) {
      revealContainers.forEach((el) => el.style.removeProperty("opacity"));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      revealContainers.forEach((container) => {
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
      });

      liftTargets.forEach((el) => {
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
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
