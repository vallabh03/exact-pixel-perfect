// Photo library for the PAANI lookbook. Files live in public/images and are
// served from the site itself (no dependency on Lovable's asset host).

const LOVABLE_ASSET_PREFIX = /^\/__l5e\/assets-v1\/[0-9a-f-]{36}\//;

/**
 * Maps a stored image URL to a local one. Database rows seeded in Lovable still
 * hold `/__l5e/assets-v1/<id>/<file>` pointers, which only resolve inside Lovable;
 * every such file is also shipped in public/images, so rewrite them to `/images/<file>`.
 * Any other URL (absolute, already local) is returned unchanged.
 */
export function assetUrl(url: string | null | undefined): string {
  if (!url) return "";
  return LOVABLE_ASSET_PREFIX.test(url) ? url.replace(LOVABLE_ASSET_PREFIX, "/images/") : url;
}

export const ASSETS = {
  paani_designer_jpg: "/images/paani-designer.jpg",
  paani_muse_01_jpg: "/images/paani-muse-01.jpg",
  paani_muse_02_jpg: "/images/paani-muse-02.jpg",
  paani_muse_03_jpg: "/images/paani-muse-03.jpg",
  paani_muse_07_jpg: "/images/paani-muse-07.jpg",
  paani_muse_08_jpg: "/images/paani-muse-08.jpg",
  paani_muse_09_jpg: "/images/paani-muse-09.jpg",
  paani_muse_10_jpg: "/images/paani-muse-10.jpg",
  paani_muse_11_jpg: "/images/paani-muse-11.jpg",
  paani_muse_12_jpg: "/images/paani-muse-12.jpg",
  paani_muse_13_jpg: "/images/paani-muse-13.jpg",
  paani_muse_14_jpg: "/images/paani-muse-14.jpg",
  paani_muse_15_jpg: "/images/paani-muse-15.jpg",
  paani_muse_16_jpg: "/images/paani-muse-16.jpg",
  paani_muse_17_jpg: "/images/paani-muse-17.jpg",
  paani_muse_18_jpg: "/images/paani-muse-18.jpg",
  paani_muse_19_jpg: "/images/paani-muse-19.jpg",
  paani_muse_20_jpg: "/images/paani-muse-20.jpg",
  paani_muse_21_jpg: "/images/paani-muse-21.jpg",
  paani_muse_23_jpg: "/images/paani-muse-23.jpg",
  paani_muse_24_jpg: "/images/paani-muse-24.jpg",
  paani_yk_03_jpg: "/images/paani-yk-03.jpg",
  paani_yk_04_jpg: "/images/paani-yk-04.jpg",
  paani_yk_05_png: "/images/paani-yk-05.png",
  paani_yk_06_jpg: "/images/paani-yk-06.jpg",
  paani_yk_07_jpg: "/images/paani-yk-07.jpg",
  paani_yk_08_jpg: "/images/paani-yk-08.jpg",
  paani_yk_09_jpg: "/images/paani-yk-09.jpg",
  paani_yk_10_jpg: "/images/paani-yk-10.jpg",
  paani_yk_11_jpg: "/images/paani-yk-11.jpg",
  paani_yk_12_jpg: "/images/paani-yk-12.jpg",
  paani_yk_13_png: "/images/paani-yk-13.png",
  paani_yk_14_jpg: "/images/paani-yk-14.jpg",
  paani_yk_15_jpg: "/images/paani-yk-15.jpg",
  paani_yk_16_png: "/images/paani-yk-16.png",
  paani_yk_17_jpg: "/images/paani-yk-17.jpg",
  paani_yk_18_jpg: "/images/paani-yk-18.jpg",
  paani_yk_19_jpg: "/images/paani-yk-19.jpg",
  paani_yk_20_jpg: "/images/paani-yk-20.jpg",
  paani_yk_21_jpg: "/images/paani-yk-21.jpg",
  paani_yk_22_jpg: "/images/paani-yk-22.jpg",
  paani_yk_23_jpg: "/images/paani-yk-23.jpg",
  paani_yk_24_jpg: "/images/paani-yk-24.jpg",
  paani_yk_25_jpg: "/images/paani-yk-25.jpg",
  paani_yk_26_jpg: "/images/paani-yk-26.jpg",
  paani_yk_27_jpg: "/images/paani-yk-27.jpg",
  paani_yk_28_jpg: "/images/paani-yk-28.jpg",
  paani_yk_29_jpg: "/images/paani-yk-29.jpg",
  paani_yk_30_png: "/images/paani-yk-30.png",
  paani_yk_31_jpg: "/images/paani-yk-31.jpg",
  paani_yk_32_jpg: "/images/paani-yk-32.jpg",
  paani_yk_33_jpg: "/images/paani-yk-33.jpg",
  paani_yk_34_jpg: "/images/paani-yk-34.jpg",
} as const;
