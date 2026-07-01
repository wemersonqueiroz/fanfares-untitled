/**
 * Picsum URL helpers shared by every mock file.
 *
 * Picsum.photos serves seeded random images at any size — we use it instead
 * of bundling demo assets. The seed determines the image; same seed = same
 * image. The size determines the dimensions Picsum returns; the browser
 * scales as needed.
 */

const url = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

/** Square thumbnail (400×400) — songs, audiobooks, podcasts, collection covers. */
export const sq = (seed: string) => url(seed, 400, 400)

/** 16:9 thumbnail (640×360) — video previews, article hero, podcast banners. */
export const wide = (seed: string) => url(seed, 640, 360)

/** Wider hero banner (900×400) — ContentPage hero illustration. */
export const wideHero = (seed: string) => url(seed, 900, 400)

/** HD video frame (1280×720) — full-bleed video player thumbnails. */
export const vid = (seed: string) => url(seed, 1280, 720)

/** Portrait book cover (240×300) — books. */
export const book = (seed: string) => url(seed, 240, 300)

/** Small avatar (100×100) — cards, comment authors, sidebar creators. */
export const av = (seed: string) => url(seed, 100, 100)

/** Larger avatar (200×200) — profile pages, hero blocks. */
export const avLg = (seed: string) => url(seed, 200, 200)
