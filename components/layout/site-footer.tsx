import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p>© 2026 Ömer Faruk Koç</p>
          <p className="footer-note">AI, data and distributed systems—built with evidence.</p>
        </div>
        <nav className="footer-links" aria-label="Social links">
          <a href={profile.links.email}>Email</a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight aria-hidden="true" size={12} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href="/llms.txt">llms.txt</a>
        </nav>
      </div>
    </footer>
  );
}
