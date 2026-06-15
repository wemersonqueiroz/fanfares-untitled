import type { BrowseCardProps } from "@/components/BrowseCard"

// Picsum helpers — deterministic images by seed
const sq = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`
const wide = (seed: string) => `https://picsum.photos/seed/${seed}/640/360`
const book = (seed: string) => `https://picsum.photos/seed/${seed}/240/300`

// ── Types ─────────────────────────────────────────────────────────────────────

export type WishlistCategory =
  | "All"
  | "Music"
  | "Podcasts"
  | "Audiobooks"
  | "Books"
  | "Articles"
  | "Collections"
  | "Video"

export type WishlistSectionData = {
  id: string
  title: string
  cards: BrowseCardProps[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const WISHLIST_CATEGORIES: WishlistCategory[] = [
  "All",
  "Music",
  "Podcasts",
  "Audiobooks",
  "Books",
  "Articles",
  "Collections",
  "Video",
]

// ── Mock data ─────────────────────────────────────────────────────────────────

export const WISHLIST_SECTIONS: WishlistSectionData[] = [
  {
    id: "music",
    title: "Music",
    cards: [
      {
        variant: "album",
        title: "Midnight Pulse",
        subtitle: "Neon Drifter",
        isLocked: true,
        coverUrl: sq("wl-midnight-pulse"),
      },
      {
        variant: "song",
        title: "Echoes in Rain",
        subtitle: "Lyra Voss",
        isLocked: true,
        coverUrl: sq("wl-echoes-rain"),
      },
      {
        variant: "album",
        title: "Solar Drift",
        subtitle: "Cosmo Wave",
        isLocked: true,
        coverUrl: sq("wl-solar-drift"),
      },
      {
        variant: "song",
        title: "Glass Horizon",
        subtitle: "Petra Sol",
        isLocked: true,
        coverUrl: sq("wl-glass-horizon"),
      },
      {
        variant: "album",
        title: "Velvet Static",
        subtitle: "The Fades",
        isLocked: true,
        coverUrl: sq("wl-velvet-static"),
      },
      {
        variant: "song",
        title: "Orbit",
        subtitle: "Kael Frost",
        isLocked: true,
        coverUrl: sq("wl-orbit"),
      },
      {
        variant: "album",
        title: "Deep Indigo",
        subtitle: "Mirror Coast",
        isLocked: true,
        coverUrl: sq("wl-deep-indigo"),
      },
    ],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    cards: [
      {
        variant: "podcast-episode",
        title: "The Future of Decentralised Media",
        subtitle: "Tech Horizons",
        isLocked: true,
        coverUrl: wide("wl-decentral-media"),
      },
      {
        variant: "podcast-episode",
        title: "Building in Public",
        subtitle: "Founder Stories",
        isLocked: true,
        coverUrl: wide("wl-building-public"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "Mindful Productivity",
        subtitle: "Deep Focus",
        isLocked: true,
        coverUrl: sq("wl-mindful-prod"),
      },
      {
        variant: "podcast-episode",
        title: "Crypto Native UX",
        subtitle: "Design Decoded",
        isLocked: true,
        coverUrl: wide("wl-crypto-ux"),
      },
      {
        variant: "podcast-show",
        title: "The Sound Economy",
        subtitle: "Audio Money",
        isLocked: true,
        coverUrl: sq("wl-sound-economy"),
      },
      {
        variant: "podcast-show",
        title: "Tech Horizons",
        subtitle: "312 episodes",
        isLocked: true,
        coverUrl: sq("wl-tech-horizons"),
      },
    ],
  },
  {
    id: "audiobooks",
    title: "Audiobooks",
    cards: [
      {
        variant: "audiobook",
        title: "Anatomy of the Stars",
        subtitle: "Emma Richardson",
        isLocked: true,
        coverUrl: sq("wl-anatomy-stars"),
      },
      {
        variant: "audiobook",
        title: "Sovereign Money",
        subtitle: "Mark Carney",
        isLocked: true,
        coverUrl: sq("wl-sovereign-money"),
      },
      {
        variant: "audiobook",
        title: "Deep Ocean Drifts",
        subtitle: "Nadia Thornton",
        isLocked: true,
        coverUrl: sq("wl-deep-ocean"),
      },
      {
        variant: "audiobook",
        title: "Beyond the Horizon",
        subtitle: "Lara Marsh",
        isLocked: true,
        coverUrl: sq("wl-beyond-horizon"),
      },
      {
        variant: "audiobook",
        title: "Quantum Mind",
        subtitle: "Dr. Philip Moore",
        isLocked: true,
        coverUrl: sq("wl-quantum-mind"),
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
        isLocked: true,
        coverUrl: book("wl-folded-map"),
      },
      {
        variant: "book",
        title: "Quiet Machines",
        subtitle: "Dr. Arjun Mehta",
        isLocked: true,
        coverUrl: book("wl-quiet-machines"),
      },
      {
        variant: "book",
        title: "Salt & Signal",
        subtitle: "Mara Winters",
        isLocked: true,
        coverUrl: book("wl-salt-signal"),
      },
      {
        variant: "book",
        title: "Between Clocks",
        subtitle: "Felix Osei",
        isLocked: true,
        coverUrl: book("wl-between-clocks"),
      },
      {
        variant: "book",
        title: "The Last Frequency",
        subtitle: "Cora Delaney",
        isLocked: true,
        coverUrl: book("wl-last-frequency"),
      },
      {
        variant: "book",
        title: "The Architecture of Thought",
        subtitle: "James Farrow",
        isLocked: true,
        coverUrl: book("wl-arch-thought"),
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
        isLocked: true,
        coverUrl: wide("wl-attention"),
      },
      {
        variant: "article",
        title: "The Rise of Audio-First Platforms",
        subtitle: "Luke Braxton",
        isLocked: true,
        coverUrl: wide("wl-audio-first"),
      },
      {
        variant: "article",
        title: "Ownership in the Creator Economy",
        subtitle: "Dina Vance",
        isLocked: true,
        coverUrl: wide("wl-ownership"),
      },
      {
        variant: "article",
        title: "Designing for Trust",
        subtitle: "Yara Molina",
        isLocked: true,
        coverUrl: wide("wl-trust"),
      },
      {
        variant: "article",
        title: "How AI is Reshaping Creative Industries",
        subtitle: "Future Weekly",
        isLocked: true,
        coverUrl: wide("wl-ai-creative"),
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
        isLocked: true,
        coverUrl: sq("wl-late-night"),
      },
      {
        variant: "collection",
        title: "Morning Reads",
        subtitle: "8 items",
        isLocked: true,
        coverUrl: sq("wl-morning-reads"),
      },
      {
        variant: "collection",
        title: "Crypto Deep Dives",
        subtitle: "15 items",
        isLocked: true,
        coverUrl: sq("wl-crypto-dives"),
      },
      {
        variant: "collection",
        title: "Workout Playlist",
        subtitle: "9 items",
        isLocked: true,
        coverUrl: sq("wl-workout"),
      },
      {
        variant: "collection",
        title: "Best of 2025",
        subtitle: "18 items",
        isLocked: true,
        coverUrl: sq("wl-best-2025"),
      },
    ],
  },
  {
    id: "videos",
    title: "Videos",
    cards: [
      {
        variant: "video",
        title: "Inside the Creative Process",
        subtitle: "Studio Collective",
        isLocked: true,
        coverUrl: wide("wl-creative-process"),
      },
      {
        variant: "video",
        title: "Sound Design Masterclass",
        subtitle: "Freq Lab",
        isLocked: true,
        coverUrl: wide("wl-sound-design"),
      },
      {
        variant: "video-show",
        title: "The Making Of: Midnight Echoes",
        subtitle: "Neon Drifter",
        isLocked: true,
        coverUrl: wide("wl-making-of"),
      },
      {
        variant: "video",
        title: "Crypto & Culture Episode 7",
        subtitle: "Web3 Today",
        isLocked: true,
        coverUrl: wide("wl-crypto-culture"),
      },
      {
        variant: "video-show",
        title: "Documentary: The Audio Economy",
        subtitle: "FanFares Studios",
        isLocked: true,
        coverUrl: wide("wl-audio-economy"),
      },
    ],
  },
]
