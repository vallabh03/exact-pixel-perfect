import { Link } from "@tanstack/react-router";

import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold tracking-[0.18em] text-foreground">
            PAANI
          </p>
          <p className="eyebrow mt-1 text-muted-foreground">Clothing</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A fashion lookbook of elevated occasionwear — designed and crafted
            in {SITE.location}.
          </p>
        </div>

        <div>
          <p className="eyebrow text-foreground">Explore</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/collections" className="transition-colors hover:text-foreground">
              Collections
            </Link>
            <Link to="/new-drops" className="transition-colors hover:text-foreground">
              New Drops
            </Link>
            <Link to="/our-story" className="transition-colors hover:text-foreground">
              Our Story
            </Link>
            <Link to="/reviews" className="transition-colors hover:text-foreground">
              Reviews
            </Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link to="/studio" className="transition-colors hover:text-foreground">
              Owner Studio
            </Link>
          </div>
        </div>

        <div>
          <p className="eyebrow text-foreground">Get in touch</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a
              href={SITE.mailto}
              className="transition-colors hover:text-foreground"
            >
              {SITE.email}
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Instagram {SITE.instagramHandle}
            </a>
            <p>{SITE.whatsappNote}</p>
            <p>{SITE.location}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PAANI CLOTHING · {SITE.location}
        </p>
      </div>
    </footer>
  );
}
