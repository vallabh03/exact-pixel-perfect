import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { ASSETS } from "@/lib/paani-assets";
import { SITE } from "@/lib/site";
import { publicCollectionsQuery } from "@/lib/paani-data";
import { Lightbox, type LightboxImage } from "@/components/lightbox";
import { Reveal } from "@/components/reveal";
import { LoadError } from "@/components/route-states";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Every Outfit Tells a Story — PAANI CLOTHING" },
      {
        name: "description",
        content:
          "Explore the PAANI CLOTHING lookbook: new drops, signature designs, and the story behind every outfit.",
      },
      {
        property: "og:title",
        content: "Every Outfit Tells a Story — PAANI CLOTHING",
      },
      {
        property: "og:description",
        content:
          "Explore the PAANI CLOTHING lookbook: new drops, signature designs, and the story behind every outfit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicCollectionsQuery),
  errorComponent: LoadError,
  component: Index,
});

const SIGNATURE_IMAGES: LightboxImage[] = [
  ASSETS.paani_muse_02_jpg,
  ASSETS.paani_muse_03_jpg,
  ASSETS.paani_muse_07_jpg,
  ASSETS.paani_muse_08_jpg,
  ASSETS.paani_muse_09_jpg,
  ASSETS.paani_muse_10_jpg,
  ASSETS.paani_muse_11_jpg,
  ASSETS.paani_muse_12_jpg,
].map((url, i) => ({ url, title: `Signature Look ${i + 1}` }));

const INSTAGRAM_IMAGES = [
  ASSETS.paani_muse_13_jpg,
  ASSETS.paani_muse_14_jpg,
  ASSETS.paani_muse_15_jpg,
  ASSETS.paani_muse_16_jpg,
  ASSETS.paani_muse_17_jpg,
  ASSETS.paani_muse_18_jpg,
  ASSETS.paani_muse_19_jpg,
  ASSETS.paani_muse_20_jpg,
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-10">
      <p className="eyebrow text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl font-medium text-foreground sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}

function Index() {
  const { data: collections } = useSuspenseQuery(publicCollectionsQuery);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const featured = collections.find((c) => c.featured) ?? collections[0];
  const rest = collections.filter((c) => c.id !== featured?.id);

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative flex min-h-[82vh] items-end overflow-hidden">
        <img
          src={ASSETS.paani_muse_01_jpg}
          alt="PAANI CLOTHING editorial hero"
          className="absolute inset-0 h-full w-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/10" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20">
          <p className="eyebrow animate-fade-up text-foreground/70">
            Elevated occasionwear · Hyderabad
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-tight text-foreground animate-fade-up sm:text-7xl" style={{ animationDelay: "180ms" }}>
            Every Outfit Tells a Story.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 animate-fade-up" style={{ animationDelay: "360ms" }}>
            Discover the collections of PAANI CLOTHING — pieces crafted to feel
            confident, luxurious, and timeless.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "540ms" }}>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore the Collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/our-story"
              className="inline-flex items-center gap-2 border border-foreground/30 bg-transparent px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/60"
            >
              Meet the Designer
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured new drop */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeading eyebrow="Featured new drop" title={featured.title} />
          <Reveal>
            <div className="grid items-center gap-10 md:grid-cols-2">
              <Link
                to="/collections/$slug"
                params={{ slug: featured.slug }}
                className="group block overflow-hidden"
              >
                <img
                  src={featured.cover_image_url}
                  alt={featured.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <div>
                <span className="eyebrow bg-champagne px-3 py-1 text-foreground">
                  New Drop
                </span>
                <p className="mt-5 font-display text-xl text-muted-foreground">
                  {featured.season_label}
                </p>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {featured.description}
                </p>
                <Link
                  to="/collections/$slug"
                  params={{ slug: featured.slug }}
                  className="mt-8 inline-flex items-center gap-2 border border-foreground/30 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Discover the New Drop <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* 3. Explore our collections */}
      <section className="border-t border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading eyebrow="The lookbook" title="Explore Our Collections" />
          <div className="grid gap-8 sm:grid-cols-2">
            {(rest.length > 0 ? rest : collections).slice(0, 4).map((collection, i) => (
              <Reveal key={collection.id} delay={(i % 2) * 140}>
                <Link
                  to="/collections/$slug"
                  params={{ slug: collection.slug }}
                  className="group block"
                >
                  <div className="overflow-hidden">
                    <img
                      src={collection.cover_image_url}
                      alt={collection.title}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-foreground">
                    {collection.title}
                  </h3>
                  <p className="eyebrow mt-1 text-muted-foreground">
                    {collection.season_label}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link
            to="/collections"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-champagne underline-offset-8"
          >
            View all collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. Signature designs */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading eyebrow="Customer favourites" title="Signature Designs" />
        <div className="columns-2 gap-3 md:columns-4">
          {SIGNATURE_IMAGES.map((image, i) => (
            <button
              key={image.url}
              onClick={() => setLightboxIndex(i)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.title ?? "Signature design"}
                className="w-full object-cover transition-opacity hover:opacity-85"
              />
            </button>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Select any look to view it full screen.
        </p>
      </section>

      {/* 5. Meet Pavani */}
      <section className="border-t border-border bg-secondary/40 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
          <img
            src={ASSETS.paani_designer_jpg}
            alt="Pavani Tumukunta, designer of PAANI CLOTHING"
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <p className="eyebrow text-muted-foreground">The designer</p>
            <h2 className="mt-2 font-display text-4xl font-medium text-foreground sm:text-5xl">
              Meet Pavani
            </h2>
            <blockquote className="mt-6 border-l-2 border-champagne pl-5 font-display text-xl italic leading-relaxed text-foreground/90">
              "With every silhouette, my intention was to create garments that
              feel confident, luxurious, and timeless — pieces that make a
              statement without saying a word."
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              — Pavani Tumukunta
            </p>
            <Link
              to="/our-story"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-champagne underline-offset-8"
            >
              Discover her design philosophy <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Client notes */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="eyebrow text-muted-foreground">Client notes</p>
        <h2 className="mt-2 font-display text-4xl font-medium text-foreground sm:text-5xl">
          Words from the Atelier
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          We publish only words our clients have written to us. No client notes
          have been shared for publication yet — perhaps yours will be the
          first.
        </p>
        <Link
          to="/reviews"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-champagne underline-offset-8"
        >
          Read client notes <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* 7. Instagram gallery */}
      <section className="border-t border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted-foreground">Follow the atelier</p>
              <h2 className="mt-2 font-display text-4xl font-medium text-foreground">
                On Instagram
              </h2>
            </div>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-foreground underline decoration-champagne underline-offset-8"
            >
              {SITE.instagramHandle}
            </a>
          </div>
          <div className="columns-2 gap-3 md:columns-4">
            {INSTAGRAM_IMAGES.map((url) => (
              <a
                key={url}
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="mb-3 block break-inside-avoid overflow-hidden"
              >
                <img
                  src={url}
                  alt="PAANI CLOTHING on Instagram"
                  className="w-full object-cover transition-opacity hover:opacity-85"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact and custom-design enquiries */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="eyebrow text-muted-foreground">Custom design enquiries</p>
        <h2 className="mt-2 font-display text-4xl font-medium text-foreground sm:text-5xl">
          Let's Create Something Yours
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Write to us at{" "}
          <a href={SITE.mailto} className="text-foreground underline decoration-champagne underline-offset-4">
            {SITE.email}
          </a>{" "}
          — {SITE.whatsappNote}
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Get in touch <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <Lightbox
        images={SIGNATURE_IMAGES}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onNavigate={setLightboxIndex}
        contextLabel="Signature Designs"
      />
    </div>
  );
}
