import type { BrowseCardProps } from "@/components/BrowseCard"

// Picsum helpers — deterministic images by seed
const sq = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`
const wide = (seed: string) => `https://picsum.photos/seed/${seed}/640/360`
const book = (seed: string) => `https://picsum.photos/seed/${seed}/240/300`

// ── Types ─────────────────────────────────────────────────────────────────────

export type LibraryCategory =
  | "All"
  | "Music"
  | "Podcasts"
  | "Audiobooks"
  | "Books"
  | "Articles"
  | "Collections"
  | "Video"
  | "Favourites"

export type LibraryViewFilter = "View all" | "Created By Me"

export type LibrarySectionData = {
  id: string
  title: string
  cards: BrowseCardProps[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  "All",
  "Music",
  "Podcasts",
  "Audiobooks",
  "Books",
  "Articles",
  "Collections",
  "Video",
  "Favourites",
]

export const LIBRARY_VIEW_FILTERS: LibraryViewFilter[] = [
  "View all",
  "Created By Me",
]

// ── Mock data ─────────────────────────────────────────────────────────────────

export const LIBRARY_SECTIONS: LibrarySectionData[] = [
  {
    id: "music",
    title: "Music",
    cards: [
      {
        variant: "album",
        title: "Midnight Pulse",
        subtitle: "Neon Drifter",
        coverUrl: sq("midnight-pulse"),
      },
      {
        variant: "song",
        title: "Echoes in Rain",
        subtitle: "Lyra Voss",
        coverUrl: sq("echoes-rain"),
      },
      {
        variant: "album",
        title: "Solar Drift",
        subtitle: "Cosmo Wave",
        coverUrl: sq("solar-drift"),
      },
      {
        variant: "song",
        title: "Glass Horizon",
        subtitle: "Petra Sol",
        coverUrl: sq("glass-horizon"),
      },
      {
        variant: "album",
        title: "Velvet Static",
        subtitle: "The Fades",
        coverUrl: sq("velvet-static"),
      },
      {
        variant: "song",
        title: "Orbit",
        subtitle: "Kael Frost",
        coverUrl: sq("orbit-song"),
      },
      {
        variant: "album",
        title: "Deep Indigo",
        subtitle: "Mirror Coast",
        coverUrl: sq("deep-indigo"),
      },
    ],
  },
  {
    id: "books",
    title: "Books",
    cards: [
      {
        variant: "book",
        title: "The Folded Map",
        subtitle: "Selena Holt",
        coverUrl: book("folded-map"),
      },
      {
        variant: "book",
        title: "Quiet Machines",
        subtitle: "Dr. Arjun Mehta",
        coverUrl: book("quiet-machines"),
      },
      {
        variant: "book",
        title: "Salt & Signal",
        subtitle: "Mara Winters",
        coverUrl: book("salt-signal"),
      },
      {
        variant: "book",
        title: "Between Clocks",
        subtitle: "Felix Osei",
        coverUrl: book("between-clocks"),
      },
      {
        variant: "book",
        title: "The Last Frequency",
        subtitle: "Cora Delaney",
        coverUrl: book("last-frequency"),
      },
      {
        variant: "book",
        title: "Iron Meridian",
        subtitle: "Blaine Xu",
        coverUrl: book("iron-meridian"),
      },
    ],
  },
  {
    id: "podcast-episodes",
    title: "Podcast Episodes",
    cards: [
      {
        variant: "podcast-episode",
        title: "The Future of Decentralised Media",
        subtitle: "Tech Horizons",
        coverUrl: wide("decentral-media"),
      },
      {
        variant: "podcast-episode",
        title: "Building in Public",
        subtitle: "Founder Stories",
        coverUrl: wide("building-public"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "Mindful Productivity",
        subtitle: "Deep Focus",
        coverUrl: sq("mindful-prod"),
      },
      {
        variant: "podcast-episode",
        title: "Crypto Native UX",
        subtitle: "Design Decoded",
        coverUrl: wide("crypto-ux"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "The Sound Economy",
        subtitle: "Audio Money",
        coverUrl: sq("sound-economy"),
      },
    ],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    cards: [
      {
        variant: "podcast-show",
        title: "Tech Horizons",
        subtitle: "Weekly · 312 episodes",
        coverUrl: sq("tech-horizons-show"),
      },
      {
        variant: "podcast-show",
        title: "Founder Stories",
        subtitle: "Bi-weekly · 87 episodes",
        coverUrl: sq("founder-stories"),
      },
      {
        variant: "podcast-show",
        title: "Deep Focus",
        subtitle: "Daily · 520 episodes",
        coverUrl: sq("deep-focus-show"),
      },
      {
        variant: "podcast-show",
        title: "Design Decoded",
        subtitle: "Weekly · 143 episodes",
        coverUrl: sq("design-decoded"),
      },
      {
        variant: "podcast-show",
        title: "Audio Money",
        subtitle: "Weekly · 58 episodes",
        coverUrl: sq("audio-money"),
      },
      {
        variant: "podcast-show",
        title: "The Indie Shelf",
        subtitle: "Monthly · 24 episodes",
        coverUrl: sq("indie-shelf"),
      },
    ],
  },
  {
    id: "articles",
    title: "Articles",
    cards: [
      {
        variant: "article",
        title: "Why Attention is the New Currency",
        subtitle: "Naomi Park",
        coverUrl: wide("attention-currency"),
      },
      {
        variant: "article",
        title: "The Rise of Audio-First Platforms",
        subtitle: "Luke Braxton",
        coverUrl: wide("audio-first"),
      },
      {
        variant: "article",
        title: "Ownership in the Creator Economy",
        subtitle: "Dina Vance",
        coverUrl: wide("creator-economy"),
      },
      {
        variant: "article",
        title: "Designing for Trust",
        subtitle: "Yara Molina",
        coverUrl: wide("designing-trust"),
      },
      {
        variant: "article",
        title: "Slow Media and the Case for Less",
        subtitle: "Remy St. Claire",
        coverUrl: wide("slow-media"),
      },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    cards: [
      {
        variant: "collection",
        title: "Late Night Studying",
        subtitle: "12 items",
        coverUrl: sq("late-night-study"),
      },
      {
        variant: "collection",
        title: "Morning Reads",
        subtitle: "8 items",
        coverUrl: sq("morning-reads"),
      },
      {
        variant: "collection",
        title: "Crypto Deep Dives",
        subtitle: "15 items",
        coverUrl: sq("crypto-dives"),
      },
      {
        variant: "collection",
        title: "Workout Playlist",
        subtitle: "9 items",
        coverUrl: sq("workout-playlist"),
      },
      {
        variant: "collection",
        title: "Saved for Later",
        subtitle: "23 items",
        coverUrl: sq("saved-later"),
      },
      {
        variant: "collection",
        title: "Best of 2025",
        subtitle: "18 items",
        coverUrl: sq("best-2025"),
      },
      {
        variant: "collection",
        title: "Favourites",
        subtitle: "41 items",
        coverUrl: sq("favourites-col"),
      },
    ],
  },
]
