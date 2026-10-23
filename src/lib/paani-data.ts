import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  season_label: string;
  status: string;
  featured: boolean;
  cover_image_url: string;
  published_at: string | null;
  launch_at: string | null;
};

export type AssetRow = {
  id: string;
  collection_id: string;
  image_url: string;
  title: string;
  description: string;
  sort_order: number;
};

/** Public, visible collections: published and not scheduled for a future launch. */
export async function fetchPublicCollections(): Promise<CollectionRow[]> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("status", "published")
    .or(`launch_at.is.null,launch_at.lte.${nowIso}`)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as CollectionRow[];
}

export const publicCollectionsQuery = queryOptions({
  queryKey: ["collections", "public"],
  queryFn: fetchPublicCollections,
});

export function collectionDetailQuery(slug: string) {
  return queryOptions({
    queryKey: ["collections", "detail", slug],
    queryFn: async (): Promise<{
      collection: CollectionRow;
      assets: AssetRow[];
    } | null> => {
      const { data: collection, error } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!collection) return null;
      const { data: assets, error: assetsError } = await supabase
        .from("collection_assets")
        .select("*")
        .eq("collection_id", collection.id)
        .order("sort_order", { ascending: true });
      if (assetsError) throw new Error(assetsError.message);
      return {
        collection: collection as CollectionRow,
        assets: (assets ?? []) as AssetRow[],
      };
    },
  });
}

/** Studio listing: admin sees every row (drafts, scheduled, archived) via RLS. */
export const adminCollectionsQuery = queryOptions({
  queryKey: ["collections", "admin"],
  queryFn: async (): Promise<CollectionRow[]> => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as CollectionRow[];
  },
});
