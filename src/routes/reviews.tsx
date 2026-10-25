import { createFileRoute, Link } from "@tanstack/react-router";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — PAANI CLOTHING" },
      {
        name: "description",
        content:
          "Client notes for PAANI CLOTHING — only genuine words written to us are published here.",
      },
      { property: "og:title", content: "Reviews — PAANI CLOTHING" },
      {
        property: "og:description",
        content:
          "Client notes for PAANI CLOTHING — only genuine words written to us are published here.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
      <p className="eyebrow text-muted-foreground">Client notes</p>
      <h1 className="mt-2 font-display text-5xl font-medium text-foreground sm:text-6xl">
        Words from the Atelier
      </h1>

      <div className="mt-14 border border-border bg-card px-8 py-16">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          We publish only words our clients have written to us — nothing is
          invented or embellished. No client notes have been shared for
          publication yet.
        </p>
        <p className="mt-6 font-display text-2xl italic text-foreground/80">
          Perhaps yours will be the first.
        </p>
      </div>

      <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
        If you have worn a PAANI piece, we would love to hear from you. Write
        to{" "}
        <a
          href={SITE.mailto}
          className="text-foreground underline decoration-champagne underline-offset-4"
        >
          {SITE.email}
        </a>{" "}
        or reach us on Instagram{" "}
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline decoration-champagne underline-offset-4"
        >
          {SITE.instagramHandle}
        </a>
        .
      </p>

      <Link
        to="/contact"
        className="mt-10 inline-flex items-center justify-center border border-foreground/30 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Get in touch
      </Link>
    </div>
  );
}
