import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { collectionDetailQuery, type CollectionDetailData } from "@/lib/paani-data";
import { Lightbox } from "@/components/lightbox";
import { LoadError } from "@/components/route-states";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ loaderData }) => {
    const collection = (
      loaderData as CollectionDetailData | null | undefined
    )?.collection;
    return {
      meta: [
        {
          title: collection
            ? `${collection.title} — PAANI CLOTHING`
            : "Collection — PAANI CLOTHING",
        },
        {
          name: "description",
          content:
            collection?.description.slice(0, 180) ||
            "An editorial lookbook collection by PAANI CLOTHING.",
        },
        {
          property: "og:title",
          content: collection
            ? `${collection.title} — PAANI CLOTHING`
            : "Collection — PAANI CLOTHING",
        },
        {
          property: "og:description",
          content:
            collection?.description.slice(0, 180) ||
            "An editorial lookbook collection by PAANI CLOTHING.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: async ({ context, params }): Promise<CollectionDetailData> => {
    const data = await context.queryClient.ensureQueryData(
      collectionDetailQuery(params.slug),
    );
    if (!data) throw notFound();
    return data;
  },
  errorComponent: LoadError,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      <p className="font-display text-3xl text-foreground">
        Collection not found
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        This collection may not be published yet.
      </p>
      <Link
        to="/collections"
        className="mt-6 inline-flex items-center justify-center border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        All collections
      </Link>
    </div>
  ),
  component: CollectionDetail,
});

function CollectionDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(collectionDetailQuery(slug));
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  if (!data) throw notFound();
  const { collection, assets } = data;

  return (
    <div>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <img
          src={collection.cover_image_url}
          alt={collection.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14">
          <Link
            to="/collections"
            className="eyebrow inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All collections
          </Link>
          <h1 className="mt-4 font-display text-5xl font-medium text-foreground sm:text-7xl">
            {collection.title}
          </h1>
          <p className="mt-3 eyebrow text-muted-foreground">
            {collection.season_label}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {collection.description}
        </p>
      </section>

      {assets.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <p className="eyebrow mb-8 text-muted-foreground">
            {assets.length} looks
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {assets.map((asset, i) => (
              <button
                key={asset.id}
                onClick={() => setLightboxIndex(i)}
                className="group block text-left"
              >
                <div className="overflow-hidden">
                  <img
                    src={asset.image_url}
                    alt={asset.title}
                    className="aspect-[3/4] w-full object-cover transition-opacity duration-500 group-hover:opacity-85"
                  />
                </div>
                <p className="mt-3 font-display text-lg text-foreground">
                  {asset.title}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      <Lightbox
        images={assets.map((asset) => ({
          url: asset.image_url,
          title: asset.title,
          description: collection.title,
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onNavigate={setLightboxIndex}
        contextLabel={collection.title}
      />
    </div>
  );
}
