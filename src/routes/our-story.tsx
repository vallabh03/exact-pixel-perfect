import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ASSETS } from "@/lib/paani-assets";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — PAANI CLOTHING" },
      {
        name: "description",
        content:
          "Meet Pavani Tumukunta and discover the design philosophy behind PAANI CLOTHING.",
      },
      { property: "og:title", content: "Our Story — PAANI CLOTHING" },
      {
        property: "og:description",
        content:
          "Meet Pavani Tumukunta and discover the design philosophy behind PAANI CLOTHING.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OurStoryPage,
});

function OurStoryPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <p className="eyebrow text-muted-foreground">Our story</p>
        <h1 className="mt-2 font-display text-5xl font-medium text-foreground sm:text-6xl">
          Meet Pavani
        </h1>

        <div className="mt-14 grid items-start gap-12 md:grid-cols-2">
          <img
            src={ASSETS.paani_designer_jpg}
            alt="Pavani Tumukunta, designer of PAANI CLOTHING"
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <p className="font-display text-2xl italic leading-relaxed text-foreground/90">
              "With every silhouette, my intention was to create garments that
              feel confident, luxurious, and timeless — pieces that make a
              statement without saying a word."
            </p>
            <p className="mt-3 eyebrow text-muted-foreground">
              Pavani Tumukunta
            </p>
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Monochrome Muse is a celebration of timeless sophistication,
                where luxurious craftsmanship meets contemporary design. Each
                garment is thoughtfully created using rich suede fabric,
                elevated with delicate pearl and stone embellishments that add
                depth, texture, and refined elegance. The collection is
                presented in a classic palette of black, white, and emerald
                green — colours chosen for their enduring appeal and effortless
                versatility.
              </p>
              <p>
                Designed for the modern woman, these pieces transition
                seamlessly from graduation ceremonies and formal gatherings to
                conferences, evening soirées, and special celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="eyebrow text-muted-foreground">A note from the designers</p>
          <h2 className="mt-2 font-display text-4xl font-medium text-foreground">
            Architecture Meets Fashion
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              We come to this collection from different disciplines, but with a
              shared concern for the body. One of us is trained in designing
              spaces people inhabit, the other comes from fashion, where the
              body is always the starting point. Clothing, here, becomes a
              meeting ground and an intimate scale of the built environment
              that is worn.
            </p>
            <p>
              Our practices converge in a people-centric approach. Garments,
              like spaces, respond to movement, climate, and context. The
              pieces are designed to be inclusive, adaptable, and responsive to
              diverse body types, with a conscious focus on how women feel
              within what they wear.
            </p>
            <p>
              At its core, this project is about making women feel supported
              and seen. It is also a collective effort, shaped by women across
              every stage — from conception and design to production, styling,
              marketing, and the final image.
            </p>
            <p className="eyebrow text-foreground">
              Dr. Yeshashwini Kadiiri &amp; Pavani Tumukunta
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="eyebrow text-muted-foreground">The atelier</p>
        <h2 className="mt-2 font-display text-4xl font-medium text-foreground">
          {SITE.location}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Every PAANI piece is designed and crafted under one roof. Explore
          what the studio has been creating.
        </p>
        <Link
          to="/collections"
          className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Explore the Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
