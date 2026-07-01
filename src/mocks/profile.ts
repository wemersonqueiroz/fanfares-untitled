import type { ContentCardProps } from "@/components/ContentCard"
import type { BrowseCardProps } from "@/components/BrowseCard"

// `bav` here historically returned 200×200, which is `avLg` in the shared module.
import { sq, wide, book, av, avLg as bav } from "./picsum"

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProfileTab = "Activity" | "Store" | "Wishlist"

export type MutualFollowers = {
  /** Up to 4 avatar URLs to render in the overlapping stack */
  avatarUrls: (string | undefined)[]
  /** How many extras beyond the visible avatars (+N badge) */
  overflow?: number
  /** Free-text description, e.g. "Followed by rdct, Bitcoin Butlers and 36 people you follow" */
  text: string
}

export type ProfileUser = {
  name: string
  /** Including the "@" prefix — e.g. "@oliviarye" */
  handle: string
  bio: string
  coverUrl?: string
  avatarUrl?: string
  /** Human-readable join date — e.g. "Dec 3, 2025" */
  joinedDate: string
  following: number
  followers: number
  website?: string
  /** Whether this person follows the logged-in user back (shown on "else's profile" only) */
  followsYou?: boolean
  /** Mutual followers info — only shown on "else's profile" */
  mutualFollowers?: MutualFollowers
}

export type ProfileSectionData = {
  id: string
  title: string
  cards: BrowseCardProps[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const PROFILE_TABS: ProfileTab[] = ["Activity", "Store", "Wishlist"]

// ── Mock profile ──────────────────────────────────────────────────────────────

export const MOCK_PROFILE: ProfileUser = {
  name: "Olivia Rhye",
  handle: "@oliviarye",
  bio: "Bitcoin enthusiast and design aficionado, passionate about uncovering the truth in the world.",
  coverUrl: "https://picsum.photos/seed/olivia-cover/1200/400",
  avatarUrl: bav("olivia-avatar"),
  joinedDate: "Dec 3, 2025",
  following: 54,
  followers: 312,
  website: "www.oliviarye.com",
  followsYou: true,
  mutualFollowers: {
    avatarUrls: [av("mutual1"), av("mutual2"), av("mutual3"), av("mutual4")],
    overflow: 5,
    text: "Followed by rdct, Bitcoin Butlers and 36 people you follow",
  },
}

// ── Activity tab — a small selection of the user's published content ──────────

export const MOCK_ACTIVITY: ContentCardProps[] = [
  {
    id: "profile-a1",
    creator: {
      name: "Olivia Rhye",
      handle: "@oliviarye",
      avatarUrl: bav("olivia-avatar"),
    },
    content: {
      type: "article",
      title: "Why Sound Money Matters More Than Ever",
      subtitle: "Published · 8 min read",
      excerpt:
        "In a world of endless money printing and financial censorship, sound money principles " +
        "offer a path to true financial sovereignty. Bitcoin isn't just an asset — it's a " +
        "philosophical stance on the nature of value itself.",
    },
    purchase: { state: "unlocked" },
    social: { comments: 43, shares: 88, likes: 620, zaps: 21 },
    topZapper: { name: "Sats King", amount: 15000, avatarUrl: av("satsking") },
    supporterAvatarUrls: [av("pa1s1"), av("pa1s2"), av("pa1s3")],
  },
  {
    id: "profile-a2",
    creator: {
      name: "Olivia Rhye",
      handle: "@oliviarye",
      avatarUrl: bav("olivia-avatar"),
    },
    content: {
      type: "podcast-show",
      title: "The Bitcoin Design Podcast",
      subtitle: "Season 2 · 14 episodes",
      thumbnailUrl: sq("btc-design-podcast"),
      episodeCount: 14,
    },
    purchase: { state: "free" },
    social: { comments: 19, shares: 34, likes: 280, zaps: 8 },
    supporterAvatarUrls: [av("pa2s1"), av("pa2s2")],
  },
  {
    id: "profile-a3",
    creator: {
      name: "Olivia Rhye",
      handle: "@oliviarye",
      avatarUrl: bav("olivia-avatar"),
    },
    content: {
      type: "book",
      title: "Designing for the Decentralised Web",
      coverUrl: book("decentral-web-book"),
      pageCount: 312,
    },
    purchase: { state: "locked", price: "5,000 sats" },
    social: { comments: 67, shares: 110, likes: 1450, zaps: 55 },
    topZapper: {
      name: "V. Buterin",
      amount: 80000,
      avatarUrl: av("vbuterin"),
    },
    supporterAvatarUrls: [av("pa3s1"), av("pa3s2"), av("pa3s3"), av("pa3s4")],
  },
  {
    id: "profile-a4",
    creator: {
      name: "Olivia Rhye",
      handle: "@oliviarye",
      avatarUrl: bav("olivia-avatar"),
    },
    content: {
      type: "album",
      title: "Frequencies of Freedom",
      coverUrl: sq("freq-freedom"),
      trackCount: 9,
    },
    purchase: { state: "unlocked" },
    social: { comments: 31, shares: 57, likes: 810, zaps: 27 },
    supporterAvatarUrls: [av("pa4s1"), av("pa4s2"), av("pa4s3")],
  },
]

// ── Store tab — creator's published collections ───────────────────────────────

export const MOCK_STORE_SECTIONS: ProfileSectionData[] = [
  {
    id: "homesteading",
    title: "Homesteading for Beginners",
    cards: [
      {
        variant: "song",
        title: "Off-Grid Living",
        subtitle: "Olivia Rhye",
        isLocked: true,
        coverUrl: sq("off-grid-song"),
      },
      {
        variant: "book",
        title: "The Self-Sufficient Home",
        subtitle: "Olivia Rhye",
        coverUrl: book("self-sufficient"),
      },
      {
        variant: "article",
        title: "Building a Root Cellar",
        subtitle: "Olivia Rhye",
        coverUrl: wide("root-cellar"),
      },
      {
        variant: "audiobook",
        title: "Back to Basics",
        subtitle: "Olivia Rhye",
        coverUrl: sq("back-to-basics"),
      },
      {
        variant: "album",
        title: "Nature Sounds Vol. I",
        subtitle: "Olivia Rhye",
        coverUrl: sq("nature-sounds"),
      },
      {
        variant: "audiobook",
        title: "The Homesteader's Guide",
        subtitle: "Olivia Rhye",
        coverUrl: sq("homesteader-guide"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "First Year on the Land",
        subtitle: "Olivia Rhye",
        coverUrl: sq("first-year-land"),
      },
    ],
  },
  {
    id: "energy",
    title: "Become Energy Independent",
    cards: [
      {
        variant: "song",
        title: "Solar Horizon",
        subtitle: "Olivia Rhye",
        coverUrl: sq("solar-horizon"),
      },
      {
        variant: "book",
        title: "Off-Grid Power Systems",
        subtitle: "Olivia Rhye",
        coverUrl: book("offgrid-power"),
      },
      {
        variant: "article",
        title: "DIY Solar Install Guide",
        subtitle: "Olivia Rhye",
        coverUrl: wide("diy-solar"),
      },
      {
        variant: "audiobook",
        title: "The Wind Energy Bible",
        subtitle: "Olivia Rhye",
        isLocked: true,
        coverUrl: sq("wind-energy"),
      },
      {
        variant: "album",
        title: "Acoustic Energy",
        subtitle: "Olivia Rhye",
        coverUrl: sq("acoustic-energy"),
      },
      {
        variant: "audiobook",
        title: "Batteries & Storage",
        subtitle: "Olivia Rhye",
        coverUrl: sq("batteries-storage"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "Living Off the Grid Ep. 9",
        subtitle: "Olivia Rhye",
        coverUrl: sq("off-grid-ep9"),
      },
    ],
  },
  {
    id: "food",
    title: "Grow Your Own Food",
    cards: [
      {
        variant: "book",
        title: "The Market Gardener",
        subtitle: "Olivia Rhye",
        coverUrl: book("market-gardener"),
      },
      {
        variant: "article",
        title: "Companion Planting Secrets",
        subtitle: "Olivia Rhye",
        coverUrl: wide("companion-planting"),
      },
      {
        variant: "audiobook",
        title: "Permaculture Principles",
        subtitle: "Olivia Rhye",
        coverUrl: sq("permaculture"),
      },
      {
        variant: "song",
        title: "Garden Morning",
        subtitle: "Olivia Rhye",
        coverUrl: sq("garden-morning"),
      },
      {
        variant: "album",
        title: "Harvest Season",
        subtitle: "Olivia Rhye",
        coverUrl: sq("harvest-season"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "Seed Saving Masterclass",
        subtitle: "Olivia Rhye",
        coverUrl: sq("seed-saving"),
      },
      {
        variant: "audiobook",
        title: "Soil Science Made Simple",
        subtitle: "Olivia Rhye",
        coverUrl: sq("soil-science"),
      },
    ],
  },
  {
    id: "music",
    title: "Music for the Revolution",
    cards: [
      {
        variant: "album",
        title: "Frequencies of Freedom",
        subtitle: "Olivia Rhye",
        coverUrl: sq("freq-freedom"),
      },
      {
        variant: "song",
        title: "Signal & Noise",
        subtitle: "Olivia Rhye",
        coverUrl: sq("signal-noise"),
      },
      {
        variant: "song",
        title: "Decentralised",
        subtitle: "Olivia Rhye",
        coverUrl: sq("decentralised"),
      },
      {
        variant: "album",
        title: "Sound Money Sessions",
        subtitle: "Olivia Rhye",
        coverUrl: sq("sound-money-sess"),
      },
      {
        variant: "song",
        title: "Block by Block",
        subtitle: "Olivia Rhye",
        coverUrl: sq("block-by-block"),
      },
      {
        variant: "album",
        title: "The Genesis Album",
        subtitle: "Olivia Rhye",
        coverUrl: sq("genesis-album"),
      },
      {
        variant: "song",
        title: "Proof of Work",
        subtitle: "Olivia Rhye",
        coverUrl: sq("proof-work-song"),
      },
    ],
  },
]

// ── Wishlist tab — items this user has saved ──────────────────────────────────

export const MOCK_WISHLIST_SECTIONS: ProfileSectionData[] = [
  {
    id: "wishlist-music",
    title: "Music",
    cards: [
      {
        variant: "album",
        title: "Midnight Echoes",
        subtitle: "The Velvet Dreams",
        isLocked: true,
        coverUrl: sq("wl-midnight-echoes"),
      },
      {
        variant: "song",
        title: "Electric Soul",
        subtitle: "Prism Wave",
        isLocked: true,
        coverUrl: sq("wl-electric-soul"),
      },
      {
        variant: "album",
        title: "Pulse & Rhythm",
        subtitle: "The Velvet Dreams",
        coverUrl: sq("wl-pulse-rhythm"),
      },
      {
        variant: "song",
        title: "Morning Light",
        subtitle: "Celestine",
        coverUrl: sq("wl-morning-light"),
      },
      {
        variant: "song",
        title: "Amber Dusk",
        subtitle: "Prism Wave",
        coverUrl: sq("wl-amber-dusk"),
      },
      {
        variant: "album",
        title: "Nightfall Sessions",
        subtitle: "Echo Division",
        coverUrl: sq("wl-nightfall"),
      },
    ],
  },
  {
    id: "wishlist-books",
    title: "Books & Audiobooks",
    cards: [
      {
        variant: "book",
        title: "The Architecture of Thought",
        subtitle: "James Farrow",
        isLocked: true,
        coverUrl: book("wl-arch-thought"),
      },
      {
        variant: "audiobook",
        title: "Anatomy of the Stars",
        subtitle: "Emma Richardson",
        coverUrl: sq("wl-anatomy-stars"),
      },
      {
        variant: "book",
        title: "Quantum Mind",
        subtitle: "Dr. Philip Moore",
        coverUrl: book("wl-quantum-mind"),
      },
      {
        variant: "audiobook",
        title: "Beyond the Horizon",
        subtitle: "Lara Marsh",
        isLocked: true,
        coverUrl: sq("wl-beyond-horizon"),
      },
      {
        variant: "book",
        title: "Sovereign Money",
        subtitle: "Mark Carney",
        coverUrl: book("wl-sovereign"),
      },
    ],
  },
  {
    id: "wishlist-articles",
    title: "Articles",
    cards: [
      {
        variant: "article",
        title: "The Future of Sound Engineering",
        subtitle: "Tech Weekly",
        coverUrl: wide("wl-sound-eng"),
      },
      {
        variant: "article",
        title: "How AI is Reshaping Creative Industries",
        subtitle: "Future Weekly",
        coverUrl: wide("wl-ai-reshaping"),
      },
      {
        variant: "article",
        title: "Inside the Climate Summit",
        subtitle: "World Report",
        coverUrl: wide("wl-climate"),
      },
      {
        variant: "article",
        title: "Design Systems That Scale",
        subtitle: "UX Collective",
        coverUrl: wide("wl-design-systems"),
      },
      {
        variant: "article",
        title: "Ownership in the Creator Economy",
        subtitle: "Dina Vance",
        coverUrl: wide("wl-creator-economy"),
      },
    ],
  },
]
