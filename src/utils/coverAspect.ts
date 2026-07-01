import type { ContentType } from "@/components/ContentCard/ContentTypeTag"

/**
 * Tailwind aspect class for each content variant's cover art.
 *
 * Single source of truth shared by:
 *  - `BrowseCard` (Library / Wishlist / Explore)
 *  - `ContentCard` MediaThumbnail (Feed)
 *  - any future content surface that renders cover art
 *
 * A "Book" should look like a book everywhere — portrait. A video should look
 * 16:9 everywhere. Adding a new content type? Add it here, not in the consumers.
 */
const ASPECT_BY_TYPE: Record<ContentType, string> = {
  article:        "aspect-[5/2]",
  // Note hero is rare; keep square so a notes-with-image variant doesn't break layout.
  note:           "aspect-square",
  book:           "aspect-[4/5]",
  audiobook:      "aspect-square",
  song:           "aspect-square",
  album:          "aspect-square",
  collection:     "aspect-video",
  podcast:        "aspect-video",
  "podcast-show": "aspect-video",
  video:          "aspect-video",
  "video-show":   "aspect-video",
}

/** Numeric width÷height ratio per variant — mirrors `ASPECT_BY_TYPE`. */
const RATIO_BY_TYPE: Record<ContentType, number> = {
  article:        5 / 2,
  note:           1,
  book:           4 / 5,
  audiobook:      1,
  song:           1,
  album:          1,
  collection:     16 / 9,
  podcast:        16 / 9,
  "podcast-show": 16 / 9,
  video:          16 / 9,
  "video-show":   16 / 9,
}

export function coverAspectFor(type: ContentType): string {
  return ASPECT_BY_TYPE[type]
}

/**
 * Width ÷ height ratio for a content variant. Use this with `ImageCropper`'s
 * `aspectRatio` prop or any cropper that expects a numeric ratio — pairs
 * with `coverAspectFor` so the crop box and the eventual card render agree.
 */
export function coverAspectRatio(type: ContentType): number {
  return RATIO_BY_TYPE[type]
}
