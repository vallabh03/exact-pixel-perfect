import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Images, Pencil, Plus, Star, Trash2 } from "lucide-react";

import { ASSETS } from "@/lib/paani-assets";
import {
  adminCollectionsQuery,
  type AssetRow,
  type CollectionRow,
} from "@/lib/paani-data";
import { useAuthSession } from "@/lib/auth-state";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadError } from "@/components/route-states";

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({
    meta: [
      { title: "Collection Studio — PAANI CLOTHING" },
      {
        name: "description",
        content: "Publish and manage PAANI CLOTHING collections.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminCollectionsQuery),
  errorComponent: LoadError,
  component: StudioPage,
});

const ASSET_OPTIONS = Object.entries(ASSETS).map(([key, url]) => ({
  url,
  label: key
    .replace(/^paani_/, "")
    .replace(/_(jpg|png)$/, "")
    .replace(/-/g, " "),
}));

type CollectionForm = {
  title: string;
  slug: string;
  season_label: string;
  description: string;
  status: string;
  featured: boolean;
  cover_image_url: string;
  launch_at: string; // datetime-local value, "" = none
};

function toLocalInput(iso: string | null): string {
  return iso ? iso.slice(0, 16) : "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function useInvalidateCollections() {
  const queryClient = Route.useRouteContext().queryClient;
  return () => queryClient.invalidateQueries({ queryKey: ["collections"] });
}

function StudioPage() {
  const { data: collections } = useSuspenseQuery(adminCollectionsQuery);
  const { user, ready } = useAuthSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<CollectionRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [managingLooks, setManagingLooks] = useState<CollectionRow | null>(null);
  const invalidate = useInvalidateCollections();

  useEffect(() => {
    if (!user) return;
    supabase
      .rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const patch: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (status === "published") patch.published_at = new Date().toISOString();
      const { error } = await supabase
        .from("collections")
        .update(patch)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Collection updated");
      await invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Update failed"),
  });

  const featuredMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from("collections")
        .update({ featured, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Featured collection updated");
      await invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Collection deleted");
      await invalidate();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Owner only</p>
          <h1 className="mt-2 font-display text-5xl font-medium text-foreground">
            Collection Studio
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Published collections appear on the public pages immediately.
            Drafts, scheduled launches, and archived collections stay hidden
            until you decide otherwise.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> New collection
        </Button>
      </div>

      {isAdmin === false && (
        <div className="mt-10 border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            This account doesn't have publishing rights. Sign in as the PAANI
            CLOTHING owner account to manage collections.
          </p>
        </div>
      )}

      <div className="mt-12 space-y-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:items-center"
          >
            <img
              src={collection.cover_image_url}
              alt={collection.title}
              className="aspect-[3/4] w-20 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl text-foreground">
                  {collection.title}
                </h2>
                <span className="eyebrow border border-border px-2 py-0.5 text-muted-foreground">
                  {collection.status}
                </span>
                {collection.featured && (
                  <span className="eyebrow bg-champagne px-2 py-0.5 text-foreground">
                    Featured
                  </span>
                )}
              </div>
              <p className="eyebrow mt-1 text-muted-foreground">
                /{collection.slug} · {collection.season_label || "no season"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Published:{" "}
                {collection.published_at
                  ? new Date(collection.published_at).toLocaleDateString()
                  : "—"}
                {collection.launch_at
                  ? ` · Launches: ${new Date(collection.launch_at).toLocaleString()}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {collection.status !== "published" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={statusMutation.isPending}
                  onClick={() =>
                    statusMutation.mutate({ id: collection.id, status: "published" })
                  }
                >
                  Publish
                </Button>
              )}
              {collection.status === "published" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={statusMutation.isPending}
                  onClick={() =>
                    statusMutation.mutate({ id: collection.id, status: "archived" })
                  }
                >
                  Archive
                </Button>
              )}
              {collection.status !== "draft" && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={statusMutation.isPending}
                  onClick={() =>
                    statusMutation.mutate({ id: collection.id, status: "draft" })
                  }
                >
                  Unpublish
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                aria-label="Toggle featured"
                disabled={featuredMutation.isPending}
                onClick={() =>
                  featuredMutation.mutate({
                    id: collection.id,
                    featured: !collection.featured,
                  })
                }
              >
                <Star
                  className={`h-4 w-4 ${collection.featured ? "fill-champagne text-champagne" : ""}`}
                />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setManagingLooks(collection)}
              >
                <Images className="mr-1 h-4 w-4" /> Looks
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(collection)}>
                <Pencil className="mr-1 h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                aria-label={`Delete ${collection.title}`}
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete "${collection.title}" and all of its looks? This cannot be undone.`,
                    )
                  )
                    deleteMutation.mutate(collection.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {collections.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No collections yet. Create your first one to get started.
          </p>
        )}
      </div>

      {creating && (
        <CollectionDialog
          onClose={() => setCreating(false)}
          invalidate={invalidate}
        />
      )}
      {editing && (
        <CollectionDialog
          collection={editing}
          onClose={() => setEditing(null)}
          invalidate={invalidate}
        />
      )}
      {managingLooks && (
        <LooksManager
          collection={managingLooks}
          onClose={() => setManagingLooks(null)}
        />
      )}
    </div>
  );
}

function CollectionDialog({
  collection,
  onClose,
  invalidate,
}: {
  collection?: CollectionRow;
  onClose: () => void;
  invalidate: () => Promise<void>;
}) {
  const [form, setForm] = useState<CollectionForm>(() => ({
    title: collection?.title ?? "",
    slug: collection?.slug ?? "",
    season_label: collection?.season_label ?? "",
    description: collection?.description ?? "",
    status: collection?.status ?? "draft",
    featured: collection?.featured ?? false,
    cover_image_url: collection?.cover_image_url ?? ASSET_OPTIONS[0]?.url ?? "",
    launch_at: toLocalInput(collection?.launch_at ?? null),
  }));
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof CollectionForm>(key: K, value: CollectionForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const values = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      season_label: form.season_label.trim(),
      description: form.description,
      status: form.status,
      featured: form.featured,
      cover_image_url: form.cover_image_url,
      launch_at: form.launch_at ? new Date(form.launch_at).toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    try {
      if (collection) {
        const { error } = await supabase
          .from("collections")
          .update(values)
          .eq("id", collection.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("collections").insert(values);
        if (error) throw new Error(error.message);
      }
      toast.success(collection ? "Collection saved" : "Collection created");
      await invalidate();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {collection ? "Edit collection" : "New collection"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="col-title">Title</Label>
            <Input
              id="col-title"
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col-slug">URL slug</Label>
            <Input
              id="col-slug"
              required
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="monochrome-muse"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col-season">Season label</Label>
            <Input
              id="col-season"
              value={form.season_label}
              onChange={(e) => set("season_label", e.target.value)}
              placeholder="July 2026 Edit"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col-description">Description</Label>
            <Textarea
              id="col-description"
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="col-status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger id="col-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (hidden)</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-launch">Scheduled launch (optional)</Label>
              <Input
                id="col-launch"
                type="datetime-local"
                value={form.launch_at}
                onChange={(e) => set("launch_at", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="col-featured">Featured (one at a time)</Label>
            <Switch
              id="col-featured"
              checked={form.featured}
              onCheckedChange={(checked) => set("featured", checked)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="col-cover">Cover photograph</Label>
            <Select
              value={form.cover_image_url}
              onValueChange={(v) => set("cover_image_url", v)}
            >
              <SelectTrigger id="col-cover">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {ASSET_OPTIONS.map((option) => (
                  <SelectItem key={option.url} value={option.url}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.cover_image_url && (
              <img
                src={form.cover_image_url}
                alt="Cover preview"
                className="mt-2 aspect-[3/4] w-32 object-cover"
              />
            )}
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Saving…" : collection ? "Save changes" : "Create collection"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LooksManager({
  collection,
  onClose,
}: {
  collection: CollectionRow;
  onClose: () => void;
}) {
  const [assets, setAssets] = useState<AssetRow[] | null>(null);
  const [newUrl, setNewUrl] = useState(ASSET_OPTIONS[0]?.url ?? "");
  const [newTitle, setNewTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useMemo(
    () => async () => {
      const { data, error } = await supabase
        .from("collection_assets")
        .select("*")
        .eq("collection_id", collection.id)
        .order("sort_order", { ascending: true });
      if (error) toast.error(error.message);
      setAssets((data ?? []) as AssetRow[]);
    },
    [collection.id],
  );

  useEffect(() => {
    load();
  }, [load]);

  async function addLook() {
    setBusy(true);
    const nextOrder =
      assets && assets.length > 0
        ? Math.max(...assets.map((a) => a.sort_order)) + 1
        : 1;
    const { error } = await supabase.from("collection_assets").insert({
      collection_id: collection.id,
      image_url: newUrl,
      title: newTitle.trim() || `Look ${nextOrder}`,
      description: "",
      sort_order: nextOrder,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      setNewTitle("");
      await load();
    }
  }

  async function removeLook(id: string) {
    const { error } = await supabase
      .from("collection_assets")
      .delete()
      .eq("id", id);
    if (error) toast.error(error.message);
    else await load();
  }

  async function renameLook(id: string, title: string) {
    const { error } = await supabase
      .from("collection_assets")
      .update({ title: title.trim() })
      .eq("id", id);
    if (error) toast.error(error.message);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Looks · {collection.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {assets === null && (
            <p className="text-sm text-muted-foreground">Loading looks…</p>
          )}
          {assets?.map((asset, i) => (
            <div key={asset.id} className="flex items-center gap-3">
              <img
                src={asset.image_url}
                alt={asset.title}
                className="aspect-[3/4] w-12 shrink-0 object-cover"
              />
              <span className="eyebrow w-8 shrink-0 text-muted-foreground">
                {i + 1}
              </span>
              <Input
                defaultValue={asset.title}
                onBlur={(e) => {
                  if (e.target.value.trim() && e.target.value !== asset.title)
                    renameLook(asset.id, e.target.value);
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Remove ${asset.title}`}
                onClick={() => removeLook(asset.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-4">
          <p className="eyebrow text-muted-foreground">Add a look</p>
          <div className="flex gap-2">
            <Select value={newUrl} onValueChange={setNewUrl}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {ASSET_OPTIONS.map((option) => (
                  <SelectItem key={option.url} value={option.url}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Look title"
              className="w-40"
            />
            <Button onClick={addLook} disabled={busy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Photographs come from the site's photo library; new photos can be
            added to the library on request.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
