import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { publicCollectionsQuery } from "@/lib/paani-data";
import { LoadError, MissingPage } from "@/components/route-states";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — PAANI CLOTHING" },
      {
        name: "description",
        content:
          "Browse every PAANI CLOTHING collection — an editorial gallery of elevated occasionwear.",
      },
      { property: "og:title", content: "Collections — PAANI CLOTHING" },
      {
        property: "og:description",
        content:
          "Browse every PAANI CLOTHING collection — an editorial gallery of elevated occasionwear.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicCollectionsQuery),
  errorComponent: LoadError,
  notFoundComponent: MissingPage,
  component: CollectionsPage,
});

// Editorial asymmetric widths, cycling through the grid columns.
const WIDTHS = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

function CollectionsPage() {
  const { data: collections } = useSuspenseQuery(publicCollectionsQuery);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <p className="eyebrow text-muted-foreground">The lookbook</p>
      <h1 className="mt-2 font-display text-5xl font-medium text-foreground sm:text-6xl">
        Collections
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Each collection is a complete story — every look photographed and
        presented as it was designed to be worn.
      </p>

      {collections.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">
          No collections have been published yet. Please visit again soon.
        </p>
      ) : (
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          {collections.map((collection, i) => (
            <Link
              key={collection.id}
              to="/collections/$slug"
              params={{ slug: collection.slug }}
              className={`group block ${WIDTHS[i % WIDTHS.length]}`}
            >
              <div className="overflow-hidden">
                <img
                  src={collection.cover_image_url}
                  alt={collection.title}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4">
                {collection.featured && (
                  <span className="eyebrow mr-3 bg-champagne px-2 py-1 text-foreground">
                    New Drop
                  </span>
                )}
                <h2 className="mt-2 inline font-display text-3xl text-foreground">
                  {collection.title}
                </h2>
                <p className="eyebrow mt-1 text-muted-foreground">
                  {collection.season_label}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {collection.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  View the looks{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
