CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.assign_paani_owner_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(coalesce(NEW.email, '')) = 'vallabhneelkant01@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.assign_paani_owner_role() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER assign_paani_owner_role_after_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_paani_owner_role();

CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  season_label text NOT NULL DEFAULT '',
  published_at timestamptz,
  launch_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean NOT NULL DEFAULT false,
  cover_image_url text NOT NULL DEFAULT '',
  outfits jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(outfits) = 'array'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT ALL ON public.collections TO service_role;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can read published collections" ON public.collections FOR SELECT TO anon USING (status = 'published' AND (launch_at IS NULL OR launch_at <= now()));
CREATE POLICY "Visitors can read published collections as signed in users" ON public.collections FOR SELECT TO authenticated USING ((status = 'published' AND (launch_at IS NULL OR launch_at <= now())) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner manages collections" ON public.collections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX collections_public_sort_idx ON public.collections (status, featured, published_at DESC);

CREATE OR REPLACE FUNCTION public.keep_one_featured_collection()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.featured THEN
    UPDATE public.collections SET featured = false, updated_at = now() WHERE id <> NEW.id AND featured;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER keep_one_featured_collection_trigger
BEFORE INSERT OR UPDATE OF featured ON public.collections
FOR EACH ROW WHEN (NEW.featured = true)
EXECUTE FUNCTION public.keep_one_featured_collection();

CREATE TABLE public.collection_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.collection_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collection_assets TO authenticated;
GRANT ALL ON public.collection_assets TO service_role;
ALTER TABLE public.collection_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can read published collection images" ON public.collection_assets FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.collections c WHERE c.id = collection_id AND c.status = 'published' AND (c.launch_at IS NULL OR c.launch_at <= now())));
CREATE POLICY "Users can read visible or owned collection images" ON public.collection_assets FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.collections c WHERE c.id = collection_id AND ((c.status = 'published' AND (c.launch_at IS NULL OR c.launch_at <= now())) OR public.has_role(auth.uid(), 'admin'))));
CREATE POLICY "Owner manages collection images" ON public.collection_assets FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX collection_assets_collection_idx ON public.collection_assets (collection_id, created_at);

CREATE POLICY "Visitors can view PAANI collection photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'paani-collections');
CREATE POLICY "Owner uploads PAANI collection photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'paani-collections' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner updates PAANI collection photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'paani-collections' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'paani-collections' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner deletes PAANI collection photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'paani-collections' AND public.has_role(auth.uid(), 'admin'));