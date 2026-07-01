import type { BrowseCardProps } from "@/components/BrowseCard"

// `av` here historically returned 200×200, which is now `avLg` in the shared module.
import { sq, wide, book, avLg as av } from "./picsum"

// ── Category pills ─────────────────────────────────────────────────────────────

export const EXPLORE_CATEGORIES = [
  "All",
  "Music",
  "Podcasts",
  "Audiobooks",
  "Books",
  "Articles",
  "Collections",
  "Video",
  "Favourites",
] as const

export type ExploreCategory = (typeof EXPLORE_CATEGORIES)[number]

// ── Time period filter ─────────────────────────────────────────────────────────

export const EXPLORE_TIME_PERIODS = [
  "12 months",
  "30 days",
  "7 days",
  "24 hours",
] as const
export type ExploreTimePeriod = (typeof EXPLORE_TIME_PERIODS)[number]

// ── Section data ──────────────────────────────────────────────────────────────

export type ExploreSectionData = {
  id: string
  title: string
  cards: BrowseCardProps[]
}

export const EXPLORE_SECTIONS: ExploreSectionData[] = [
  {
    id: "trending",
    title: "Trending",
    cards: [
      {
        variant: "album",
        title: "Midnight Echoes",
        subtitle: "The Velvet Dreams",
        isLocked: true,
        coverUrl: sq("midnight-echoes"),
      },
      {
        variant: "article",
        title: "The Future of Sound Engineering",
        subtitle: "Tech Weekly",
        isLocked: true,
        coverUrl: wide("sound-engineering"),
      },
      {
        variant: "audiobook",
        title: "Anatomy of the Stars",
        subtitle: "Emma Richardson",
        isLocked: true,
        coverUrl: sq("anatomy-stars"),
      },
      {
        variant: "book",
        title: "The Architecture of Thought",
        subtitle: "James Farrow",
        isLocked: true,
        coverUrl: book("arch-thought"),
      },
      {
        variant: "podcast-episode",
        title: "The Rich Gervais Show — Episode 42",
        subtitle: "Ricky Gervais",
        isLocked: true,
        coverUrl: wide("rich-gervais-42"),
      },
      {
        variant: "audiobook",
        title: "Sovereign Money",
        subtitle: "Mark Carney",
        isLocked: true,
        coverUrl: sq("sovereign-money"),
      },
      {
        variant: "song",
        title: "Electric Soul",
        subtitle: "Prism Wave",
        isLocked: true,
        coverUrl: sq("electric-soul"),
      },
    ],
  },
  {
    id: "best-sellers",
    title: "Best Sellers",
    cards: [
      {
        variant: "audiobook",
        title: "Deep Ocean Drifts",
        subtitle: "Nadia Thornton",
        isLocked: true,
        coverUrl: sq("deep-ocean"),
      },
      {
        variant: "book",
        title: "Anatomy of the Stars",
        subtitle: "Emma Richardson",
        isLocked: true,
        coverUrl: book("anatomy-book"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "Sovereign Money Needs — Episode 9",
        subtitle: "Mark Carney",
        isLocked: true,
        coverUrl: sq("sovereign-ep9"),
      },
      {
        variant: "album",
        title: "Pulse & Rhythm",
        subtitle: "The Velvet Dreams",
        isLocked: true,
        coverUrl: sq("pulse-rhythm"),
      },
      {
        variant: "song",
        title: "Morning Light",
        subtitle: "Celestine",
        isLocked: true,
        coverUrl: sq("morning-light"),
      },
      {
        variant: "audiobook",
        title: "Beyond the Horizon",
        subtitle: "Lara Marsh",
        isLocked: true,
        coverUrl: sq("beyond-horizon"),
      },
      {
        variant: "article",
        title: "How AI is Reshaping Creative Industries",
        subtitle: "Future Weekly",
        isLocked: true,
        coverUrl: wide("ai-creative"),
      },
    ],
  },
  {
    id: "recently-added",
    title: "Recently Added",
    cards: [
      {
        variant: "book",
        title: "The Architecture of Thought",
        subtitle: "James Farrow",
        isLocked: true,
        coverUrl: book("arch-thought-2"),
      },
      {
        variant: "album",
        title: "Nightfall Sessions",
        subtitle: "Echo Division",
        isLocked: true,
        coverUrl: sq("nightfall-sessions"),
      },
      {
        variant: "audiobook",
        title: "Quantum Mind",
        subtitle: "Dr. Philip Moore",
        isLocked: true,
        coverUrl: sq("quantum-mind"),
      },
      {
        variant: "article",
        title: "Inside the Climate Summit: A Closer Look",
        subtitle: "World Report",
        isLocked: true,
        coverUrl: wide("climate-summit"),
      },
      {
        variant: "podcast-episode",
        title: "The Rich Gervais Show — Episode 38",
        subtitle: "Ricky Gervais",
        isLocked: true,
        coverUrl: wide("rich-gervais-38"),
      },
      {
        variant: "audiobook",
        title: "Sovereign Money",
        subtitle: "Mark Carney",
        isLocked: true,
        coverUrl: sq("sovereign-money-2"),
      },
      {
        variant: "song",
        title: "Amber Dusk",
        subtitle: "Prism Wave",
        isLocked: true,
        coverUrl: sq("amber-dusk"),
      },
    ],
  },
  {
    id: "featured",
    title: "Featured",
    cards: [
      {
        variant: "album",
        title: "Pulse & Rhythm",
        subtitle: "The Velvet Dreams",
        isLocked: true,
        coverUrl: sq("pulse-rhythm-2"),
      },
      {
        variant: "audiobook",
        title: "Anatomy of the Stars",
        subtitle: "Emma Richardson",
        isLocked: true,
        coverUrl: sq("anatomy-stars-2"),
      },
      {
        variant: "song",
        title: "Electric Soul",
        subtitle: "Prism Wave",
        isLocked: true,
        coverUrl: sq("electric-soul-2"),
      },
      {
        variant: "podcast-episode-no-video",
        title: "Money & Power — Episode 14",
        subtitle: "Mark Carney",
        isLocked: true,
        coverUrl: sq("money-power-14"),
      },
      {
        variant: "audiobook",
        title: "Beyond the Horizon",
        subtitle: "Lara Marsh",
        isLocked: true,
        coverUrl: sq("beyond-horizon-2"),
      },
      {
        variant: "book",
        title: "The Architecture of Thought",
        subtitle: "James Farrow",
        isLocked: true,
        coverUrl: book("arch-thought-3"),
      },
      {
        variant: "article",
        title: "Design Systems That Scale",
        subtitle: "UX Collective",
        isLocked: true,
        coverUrl: wide("design-systems"),
      },
    ],
  },
  {
    id: "popular",
    title: "Popular",
    cards: [
      {
        variant: "podcast-episode-no-video",
        title: "The Rich Gervais Show — Episode 42",
        subtitle: "Ricky Gervais",
        isLocked: true,
        coverUrl: sq("rich-gervais-sq"),
      },
      {
        variant: "album",
        title: "Midnight Echoes",
        subtitle: "The Velvet Dreams",
        isLocked: true,
        coverUrl: sq("midnight-echoes-2"),
      },
      {
        variant: "audiobook",
        title: "Deep Ocean Drifts",
        subtitle: "Nadia Thornton",
        isLocked: true,
        coverUrl: sq("deep-ocean-2"),
      },
      {
        variant: "book",
        title: "Anatomy of the Stars",
        subtitle: "Emma Richardson",
        isLocked: true,
        coverUrl: book("anatomy-stars-book"),
      },
      {
        variant: "song",
        title: "Amber Dusk",
        subtitle: "Prism Wave",
        isLocked: true,
        coverUrl: sq("amber-dusk-2"),
      },
      {
        variant: "audiobook",
        title: "Quantum Mind",
        subtitle: "Dr. Philip Moore",
        isLocked: true,
        coverUrl: sq("quantum-mind-2"),
      },
      {
        variant: "article",
        title: "The Future of Sound Engineering",
        subtitle: "Tech Weekly",
        isLocked: true,
        coverUrl: wide("sound-eng-pop"),
      },
    ],
  },
  {
    id: "popular-creators",
    title: "Popular Creators",
    cards: [
      {
        variant: "creator",
        title: "Ricky Gervais",
        subtitle: "Comedy, Podcasts",
        coverUrl: av("ricky-gervais"),
      },
      {
        variant: "creator",
        title: "Emma Richardson",
        subtitle: "Audiobooks, Fiction",
        coverUrl: av("emma-richardson"),
      },
      {
        variant: "creator",
        title: "The Velvet Dreams",
        subtitle: "Music, Albums",
        coverUrl: av("velvet-dreams"),
      },
      {
        variant: "creator",
        title: "Mark Carney",
        subtitle: "Finance, Podcasts",
        coverUrl: av("mark-carney"),
      },
      {
        variant: "creator",
        title: "Dr. Philip Moore",
        subtitle: "Science, Audiobooks",
        coverUrl: av("philip-moore"),
      },
      {
        variant: "creator",
        title: "Prism Wave",
        subtitle: "Music, Songs",
        coverUrl: av("prism-wave"),
      },
      {
        variant: "creator",
        title: "Nadia Thornton",
        subtitle: "Literature, Fiction",
        coverUrl: av("nadia-thornton"),
      },
    ],
  },
]
