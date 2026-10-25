import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { publicCollectionsQuery } from "@/lib/paani-data";
import { LoadError, MissingPage } from "@/components/route-states";

export const Route = createFileRoute("/new-drops")({
  head: () => ({
    meta: [
      { title: "New Drops — PAANI CLOTHING" },
      {
        name: "description",
        content:
          "The latest drop from PAANI CLOTHING, plus an archive of earlier collections to revisit.",
      },
      { property: "og:title", content: "New Drops — PAANI CLOTHING" },
      {
        property: "og:description",
        content:
          "The latest drop from PAANI CLOTHING, plus an archive of earlier collections to revisit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicCollectionsQuery),
  errorComponent: LoadError,
  notFoundComponent: MissingPage,
  component: NewDropsPage,
});

function NewDropsPage() {
  const { data: collections } = useSuspenseQuery(publicCollectionsQuery);
  const latest = collections.find((c) => c.featured) ?? collections[0];
  const archive = collections.filter((c) => c.id !== latest?.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow text-muted-foreground">Just landed</p>
      <h1 className="mt-2 font-display text-5xl font-medium text-foreground sm:text-6xl">
        New Drops
      </h1>

      {latest ? (
        <>
          <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
            <Link
              to="/collections/$slug"
              params={{ slug: latest.slug }}
              className="group block overflow-hidden"
            >
              <img
                src={latest.cover_image_url}
                alt={latest.title}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </Link>
            <div>
              <span className="eyebrow bg-champagne px-3 py-1 text-foreground">
                New Drop
              </span>
              <h2 className="mt-5 font-display text-4xl text-foreground">
                {latest.title}
              </h2>
              <p className="mt-2 eyebrow text-muted-foreground">
                {latest.season_label}
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                {latest.description}
              </p>
              <Link
                to="/collections/$slug"
                params={{ slug: latest.slug }}
                className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Open the lookbook <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {archive.length > 0 && (
            <section className="mt-24 border-t border-border pt-16">
              <p className="eyebrow text-muted-foreground">The archive</p>
              <h3 className="mt-2 font-display text-3xl font-medium text-foreground">
                Earlier Collections
              </h3>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Previous collections remain here to revisit, look by look.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {archive.map((collection) => (
                  <Link
                    key={collection.id}
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
                    <h4 className="mt-4 font-display text-2xl text-foreground">
                      {collection.title}
                    </h4>
                    <p className="eyebrow mt-1 text-muted-foreground">
                      {collection.season_label}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="mt-16 text-sm text-muted-foreground">
          No drops have been published yet. Please visit again soon.
        </p>
      )}
    </div>
  );
}
