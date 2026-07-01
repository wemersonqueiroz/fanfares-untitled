import type { ContentPageProps } from "@/components/ContentPage"
import type { CommentData } from "@/components/ContentPage/ContentPageBottom"
import type { NotePageProps } from "@/components/ContentPage/NotePage"
import type { ArticlePageProps } from "@/components/ContentPage/ArticlePage"
import type { VideoPageProps } from "@/components/ContentPage/VideoPage"
import type { SeriesSeason } from "@/components/ContentPage/SeriesEpisodeGrid"
// `wide` here historically returned 900×400, which is now `wideHero` in the shared module.
import { sq, wideHero as wide, vid, av } from "./picsum"

/**
 * Mock player state — simulates active playback at chapter 2.
 */
export const MOCK_PLAYER_STATE = {
  isPlaying: true,
  currentTime: "12:34",
  totalTime: "38:55",
  remainingTime: "26:21",
  progressPercent: 32,
  playbackSpeed: 1,
  volume: 75,
}

/**
 * Mock comments — simulates a live thread with nested replies.
 * Declared before MOCK_AUDIOBOOK_PAGE so it can be referenced inline.
 */
export const MOCK_COMMENTS: CommentData[] = [
  {
    id: "c-1",
    author: {
      name: "Rebecca Moore",
      handle: "rebecca@fanfares.io",
      avatarUrl: av("rebecca-moore"),
    },
    content:
      "Chapter 1 absolutely blew me away — the production quality is on another level. " +
      "Simon's pacing keeps you hooked from the very first minute. Highly recommend!",
    timestamp: "7 hours ago",
    reactions: { replies: 3, shares: 12, likes: 48, zaps: 9 },
    replies: [
      {
        id: "c-1-r1",
        author: {
          name: "Daniel Park",
          handle: "danielp@fanfares.io",
          avatarUrl: av("daniel-park"),
        },
        content: "Completely agree — the sound design in the intro alone is worth the price.",
        timestamp: "5 hours ago",
        reactions: { replies: 0, shares: 2, likes: 17, zaps: 3 },
      },
      {
        id: "c-1-r2",
        author: {
          name: "Aisha Nkosi",
          handle: "aisha@fanfares.io",
          avatarUrl: av("aisha-nkosi"),
        },
        content:
          "I listened to it twice on my commute. Simon's voice is so calming yet engaging. " +
          "Can't wait for chapter 3 to unlock!",
        timestamp: "3 hours ago",
        reactions: { replies: 0, shares: 4, likes: 22, zaps: 5 },
      },
      {
        id: "c-1-r3",
        author: {
          name: "Tom Eriksen",
          avatarUrl: av("tom-eriksen"),
        },
        content: "Zapped this one — deserves way more attention 🔥",
        timestamp: "1 hour ago",
        reactions: { replies: 0, shares: 1, likes: 8, zaps: 2 },
      },
    ],
  },
  {
    id: "c-2",
    author: {
      name: "Lucas Ferreira",
      handle: "lucas@fanfares.io",
      avatarUrl: av("lucas-ferreira"),
    },
    content:
      "Anyone else notice how each chapter title perfectly hints at the arc inside? " +
      "\"Tonic & Maximalism\" felt like an overture for the whole book.",
    timestamp: "1 day ago",
    reactions: { replies: 1, shares: 7, likes: 31, zaps: 6 },
    replies: [
      {
        id: "c-2-r1",
        author: {
          name: "Sara Quinn",
          handle: "saraquinn@fanfares.io",
          avatarUrl: av("sara-quinn"),
        },
        content:
          "Yes! The naming is intentional — Simon explained in an interview that each title is a " +
          "musical metaphor for the emotional journey of that chapter.",
        timestamp: "20 hours ago",
        reactions: { replies: 0, shares: 3, likes: 14, zaps: 1 },
      },
    ],
  },
  {
    id: "c-3",
    author: {
      name: "Nina Vogel",
      handle: "nina_v@fanfares.io",
      avatarUrl: av("nina-vogel"),
    },
    content:
      "Just unlocked all six chapters — the bundle deal is insane value. " +
      "\"The Silence Between Notes\" is going to be my weekend listen.",
    timestamp: "2 days ago",
    reactions: { replies: 0, shares: 5, likes: 19, zaps: 4 },
  },
  {
    id: "c-4",
    author: {
      name: "Marcus Webb",
      avatarUrl: av("marcus-webb"),
    },
    content:
      "The immersive audio mixing really shines on headphones. " +
      "I closed my eyes during chapter 2 and felt like I was inside the story.",
    timestamp: "3 days ago",
    reactions: { replies: 2, shares: 9, likes: 63, zaps: 14 },
    replies: [
      {
        id: "c-4-r1",
        author: {
          name: "Priya Sharma",
          handle: "priya@fanfares.io",
          avatarUrl: av("priya-sharma"),
        },
        content: "Same! The binaural effect on the dialogue is something else entirely.",
        timestamp: "2 days ago",
        reactions: { replies: 0, shares: 2, likes: 11, zaps: 2 },
      },
      {
        id: "c-4-r2",
        author: {
          name: "Oliver Braun",
          handle: "oliverb@fanfares.io",
          avatarUrl: av("oliver-braun"),
        },
        content:
          "For anyone wondering — AirPods Pro in transparency mode is the move. " +
          "Absolutely cinematic.",
        timestamp: "1 day ago",
        reactions: { replies: 0, shares: 4, likes: 27, zaps: 5 },
      },
    ],
  },
]

/**
 * Mock audiobook content page — mirrors the Figma design at node 19110:353770.
 * Replace every field with real API data in production.
 */
export const MOCK_AUDIOBOOK_PAGE: Omit<
  ContentPageProps,
  | "activeHref"
  | "user"
  | "activeTab"
  | "player"
  | "onPlay"
  | "onPause"
  | "onSkipBack"
  | "onSkipForward"
  | "onSeek"
  | "onSpeedToggle"
  | "onVolumeToggle"
  | "onExpandPlayer"
  | "onDownload"
  | "onWishlist"
  | "onOptions"
  | "onShareAndEarn"
  | "onUnlock"
  | "onFollowCreator"
  | "onChapterPlay"
  | "onChapterDownload"
  | "onDownloadAll"
  | "onTabChange"
  | "onComment"
  | "onShare"
  | "onLike"
  | "onZap"
  | "onPostClick"
  | "onViewProfile"
  | "onSettingsClick"
  | "onLogOut"
  | "onPostReply"
  | "onCommentReply"
  | "onCommentShare"
  | "onCommentLike"
  | "onCommentZap"
  | "onCommentOptions"
> = {
  contentType: "audiobook",

  creator: {
    name: "Simon",
    handle: "npub3jk5648ohsfdf",
    publishedAt: "23 Jan 2023",
  },

  title: "Simon's Audiobook",

  description:
    "Dive into the captivating world of audiobooks with our latest release! " +
    "This immersive experience brings stories to life through the power of narration, " +
    "allowing you to enjoy your favorite tales while on the go. Perfect for commutes, " +
    "workouts, or relaxing at home, our audiobooks are designed to engage your imagination " +
    "and transport you to new realms.\n\n" +
    "Discover the joy of storytelling like never before. Each chapter is carefully " +
    "produced with professional voice acting, sound design, and immersive audio mixing " +
    "that puts you right in the middle of the story.",

  purchase: { state: "owned" },

  social: {
    comments: 64,
    shares: 31,
    likes: 4200,
    zaps: 156,
  },

  chapters: [
    {
      id: "ch-1",
      title: "Tonic & Maximalism",
      label: "Chapter 1",
      duration: "42:18",
      progressPercent: 100,
      isOwned: true,
    },
    {
      id: "ch-2",
      title: "The Philosophy of Sound",
      label: "Chapter 2",
      duration: "38:55",
      progressPercent: 72,
      isOwned: true,
    },
    {
      id: "ch-3",
      title: "Rhythms of the Cosmos",
      label: "Chapter 3",
      duration: "51:04",
      progressPercent: 0,
      isOwned: true,
    },
    {
      id: "ch-4",
      title: "Digital Dreamscapes",
      label: "Chapter 4",
      duration: "44:29",
      isOwned: false,
    },
    {
      id: "ch-5",
      title: "Harmonic Convergence",
      label: "Chapter 5",
      duration: "39:17",
      isOwned: false,
    },
    {
      id: "ch-6",
      title: "The Silence Between Notes",
      label: "Chapter 6",
      duration: "47:33",
      isOwned: false,
    },
  ],

  commentCount: 64,

  comments: MOCK_COMMENTS,

  sidebarCreators: [
    { role: "Artist", name: "John Malkovic" },
    { role: "Featured Artist", name: "Sarah Chen" },
    { role: "Composer", name: "Marco Vitelli" },
  ],

  about:
    "Dive into the captivating world of audiobooks with our latest release! " +
    "This immersive experience brings stories to life through the power of narration, " +
    "allowing you to enjoy your favorite tales while on the go. Perfect for commutes, " +
    "workouts, or relaxing at home, our audiobooks are designed to engage your imagination " +
    "and transport you to new realms.",

  tags: ["Fiction", "Drama", "Science"],

  infoItems: [
    { label: "RSS Feed", value: "https://fanfares.io/simon-audiobook/rss" },
    { label: "Published Date", value: "2023-01-23" },
    { label: "Duration", value: "4h 3m 36s" },
    { label: "File Types", value: "MP3, m4b" },
  ],
}

export const MOCK_PODCAST_PAGE: Omit<
  ContentPageProps,
  | "activeHref"
  | "user"
  | "activeTab"
  | "player"
  | "onPlay"
  | "onPause"
  | "onSkipBack"
  | "onSkipForward"
  | "onSeek"
  | "onSpeedToggle"
  | "onVolumeToggle"
  | "onVolumeChange"
  | "onExpandPlayer"
  | "onDownload"
  | "onWishlist"
  | "onOptions"
  | "onShareAndEarn"
  | "onUnlock"
  | "onFollowCreator"
  | "onChapterPlay"
  | "onChapterDownload"
  | "onDownloadAll"
  | "onTabChange"
  | "onComment"
  | "onShare"
  | "onLike"
  | "onZap"
  | "onPostClick"
  | "onPostReply"
  | "onCommentReply"
  | "onCommentShare"
  | "onCommentLike"
  | "onCommentZap"
  | "onCommentOptions"
  | "onViewProfile"
  | "onSettingsClick"
  | "onLogOut"
> = {
  contentType: "podcast",

  creator: {
    name: "Fud Fighters",
    handle: "npub1fudfighters",
    publishedAt: "14 Mar 2024",
  },

  title: "Bitcoin vs. The State — Episode 24",

  description:
    "In this episode we sit down with regulators, lawyers, and Bitcoiners to unpack " +
    "the growing tension between sovereign monetary networks and nation-state compliance frameworks.\n\n" +
    "We cover CBDCs, self-custody rights, Lightning channel privacy, and what the next " +
    "legislative cycle means for permissionless money. Strap in.",

  purchase: { state: "owned" },

  social: {
    comments: 312,
    shares: 89,
    likes: 5800,
    zaps: 241,
  },

  chapters: [
    {
      id: "ep-1",
      title: "Opening & Context",
      label: "Segment 1",
      duration: "08:12",
      progressPercent: 100,
      isOwned: true,
    },
    {
      id: "ep-2",
      title: "CBDCs — Trojan Horse or Damp Squib?",
      label: "Segment 2",
      duration: "21:47",
      progressPercent: 60,
      isOwned: true,
    },
    {
      id: "ep-3",
      title: "Self-Custody Under the Law",
      label: "Segment 3",
      duration: "18:33",
      isOwned: true,
    },
    {
      id: "ep-4",
      title: "Lightning Privacy Deep-Dive",
      label: "Segment 4",
      duration: "24:05",
      isOwned: false,
    },
    {
      id: "ep-5",
      title: "Roundtable — What Comes Next",
      label: "Segment 5",
      duration: "19:58",
      isOwned: false,
    },
  ],

  commentCount: 312,

  comments: MOCK_COMMENTS,

  sidebarCreators: [
    { role: "Host", name: "Alex Rivera" },
    { role: "Guest", name: "Dr. Sarah Bloom" },
    { role: "Producer", name: "Kai Nakamura" },
  ],

  about:
    "Fud Fighters is a weekly podcast tearing apart Bitcoin misinformation and exploring " +
    "the real-world policy battles shaping the future of open money. New episodes every Thursday.",

  tags: ["Bitcoin", "Policy", "Privacy", "Lightning"],

  infoItems: [
    { label: "RSS Feed", value: "https://fanfares.io/fud-fighters/rss" },
    { label: "Published Date", value: "2024-03-14" },
    { label: "Duration", value: "1h 32m 35s" },
    { label: "File Types", value: "MP3" },
  ],
}

// ── Shared callback keys omitted from page-level mocks ────────────────────────

type SharedCallbackKeys =
  | "activeHref"
  | "user"
  | "activeTab"
  | "player"
  | "onPlay"
  | "onPause"
  | "onSkipBack"
  | "onSkipForward"
  | "onSeek"
  | "onSpeedToggle"
  | "onVolumeToggle"
  | "onExpandPlayer"
  | "onVolumeChange"
  | "onDownload"
  | "onWishlist"
  | "onOptions"
  | "onShareAndEarn"
  | "onUnlock"
  | "onFollowCreator"
  | "onChapterPlay"
  | "onChapterDownload"
  | "onDownloadAll"
  | "onTabChange"
  | "onComment"
  | "onShare"
  | "onLike"
  | "onZap"
  | "onPostClick"
  | "onViewProfile"
  | "onSettingsClick"
  | "onLogOut"
  | "onPostReply"
  | "onCommentReply"
  | "onCommentShare"
  | "onCommentLike"
  | "onCommentZap"
  | "onCommentOptions"

/**
 * Mock note page data — short-form Nostr-style note with no artwork.
 */
export const MOCK_NOTE_PAGE: Omit<NotePageProps, SharedCallbackKeys> = {
  creator: {
    name: "Simon",
    handle: "npub3jk5648ohsfdf",
    publishedAt: "23 Jan 2023",
  },

  title: "Thoughts on Decentralised Audio",

  noteBody:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud " +
    "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
    "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud " +
    "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu " +
    "fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa " +
    "qui officia deserunt mollit anim id est laborum.",

  description:
    "Short-form note about the state of decentralised audio and where things are heading.",

  purchase: { state: "free" },

  social: {
    comments: 64,
    shares: 15,
    likes: 24,
    zaps: 67000,
  },

  commentCount: 64,
  comments: MOCK_COMMENTS,

  sidebarCreators: [
    { role: "Artist", name: "John Malkovic" },
    { role: "Featured Artist", name: "Sarah Chen" },
  ],

  about:
    "Dive into the captivating world of audiobooks with our latest release! " +
    "This immersive experience brings stories to life through the power of narration.",

  tags: ["Nostr", "Audio", "Web3"],

  infoItems: [
    { label: "Published Date", value: "2023-01-23" },
    { label: "Duration", value: "45m 32s" },
    { label: "File Types", value: "MP3" },
  ],
}

/**
 * Mock article page data — long-form article with hero image and body sections.
 */
export const MOCK_ARTICLE_PAGE: Omit<ArticlePageProps, SharedCallbackKeys> = {
  creator: {
    name: "Casey Blair",
    handle: "npub1cas3yblair",
    publishedAt: "15 Mar 2024",
  },

  title: "Enjoy the new world order",

  description:
    "An in-depth look at how decentralised media is reshaping content ownership, " +
    "creator monetisation, and the future of audio storytelling.",

  heroImageUrl: wide("article-hero"),

  sections: [
    {
      heading: "Introduction",
      body:
        "The media landscape is undergoing a seismic shift. For decades, a handful of " +
        "platforms held near-total control over how content was distributed, monetised, " +
        "and discovered. But the emergence of decentralised protocols is fundamentally " +
        "changing this equation.\n\n" +
        "Creators now have tools that let them publish directly to their audiences, " +
        "retain ownership of their work, and earn revenue without surrendering to " +
        "platform intermediaries.",
    },
    {
      heading: "The creator economy matures",
      body:
        "What started as a niche movement — Bitcoin podcasters, Nostr developers, " +
        "and early Lightning adopters — has grown into a broad ecosystem of tools " +
        "and communities. Platforms like Fanfares are bringing these primitives to " +
        "mainstream creators who care about independence and fair compensation.\n\n" +
        "The numbers tell the story: creator payouts via Lightning have grown 400% " +
        "year-on-year as more listeners adopt value-for-value streaming.",
      imageUrl: wide("article-section-creators"),
      imageAlt: "A group of creators collaborating around a table",
    },
    {
      heading: "What comes next",
      body:
        "The next chapter will be defined by interoperability. Nostr's open identity " +
        "layer means a creator's audience is portable across apps — no more platform " +
        "lock-in. Combined with instant micropayments, this creates the conditions for " +
        "an entirely new media economy built on direct, voluntary support.",
    },
  ],

  purchase: { state: "free" },

  social: {
    comments: 42,
    shares: 28,
    likes: 1_340,
    zaps: 89,
  },

  commentCount: 42,
  comments: MOCK_COMMENTS,

  sidebarCreators: [
    { role: "Author", name: "Casey Blair" },
    { role: "Editor", name: "Morgan Lee" },
  ],

  about:
    "Casey Blair writes about the intersection of open protocols, creator economics, " +
    "and audio media. Based in Berlin.",

  tags: ["Media", "Nostr", "Bitcoin", "Creators"],

  infoItems: [
    { label: "Published Date", value: "2024-03-15" },
    { label: "Reading Time", value: "~6 min" },
    { label: "Word Count", value: "1,240" },
  ],
}

/** Helper — build N episodes for a given season seed */
function makeEpisodes(
  seasonNum: number,
  count: number,
  isOwned: boolean,
  creatorName: string
): SeriesSeason["episodes"] {
  return Array.from({ length: count }, (_, i) => ({
    id: `s${seasonNum}-ep${i + 1}`,
    title: `Episode ${i + 1}`,
    creatorName,
    thumbnailUrl: vid(`s${seasonNum}ep${i + 1}-${creatorName}`),
    isOwned,
  }))
}

/**
 * Mock video series page — multi-season show with episode grid.
 */
export const MOCK_VIDEO_SERIES_PAGE: Omit<ContentPageProps, SharedCallbackKeys> = {
  contentType: "video",

  creator: {
    name: "Simon",
    handle: "npub3jk5648ohsfdf",
    publishedAt: "23 Jan 2023",
  },

  title: "Trailer Park Boys",

  description:
    "Get ready for a wild ride with the Trailer Park Boys! " +
    "This hilarious series follows the misadventures of Julian, Ricky, and Bubbles as they navigate life in " +
    "Sunnyvale Trailer Park. Packed with outrageous schemes, unforgettable characters, and plenty of laughs, " +
    "it's a show that brings the chaos of trailer park living to life.",

  purchase: { state: "owned" },

  episodes: [
    {
      id: "s1",
      title: "Season 1",
      isOwned: false,
      price: "4,200 sats",
      episodes: makeEpisodes(1, 4, false, "Creator"),
    },
    {
      id: "s2",
      title: "Season 2",
      isOwned: false,
      price: "4,200 sats",
      episodes: makeEpisodes(2, 4, false, "Creator"),
    },
    {
      id: "s3",
      title: "Season 3",
      isOwned: false,
      price: "4,200 sats",
      episodes: makeEpisodes(3, 4, false, "Creator"),
    },
  ] satisfies SeriesSeason[],

  showChaptersTab: false,

  social: {
    comments: 0,
    shares: 15,
    likes: 24,
    zaps: 67000,
  },

  sidebarCreators: [
    { role: "Artist", name: "John Malkovic" },
    { role: "Featured Artist", name: "Sarah Chen" },
    { role: "Composer", name: "Marco Vitelli" },
  ],

  about:
    "Dive into the captivating world of audiobooks with our latest release! " +
    "This immersive experience brings stories to life through the power of narration.",

  infoItems: [
    { label: "RSS Feed", value: "https://fanfares.io" },
    { label: "Published Date", value: "2026-03-23" },
    { label: "Duration", value: "8h 45m 32s" },
    { label: "File Types", value: "MP3" },
  ],
}

/**
 * Mock video page data — 16:9 embedded player with comments.
 */
export const MOCK_VIDEO_PAGE: Omit<VideoPageProps, SharedCallbackKeys> = {
  creator: {
    name: "Tech Horizons",
    handle: "npub1techhorizons",
    publishedAt: "18 Apr 2025",
  },

  title: "The Future of Web Development: WebAssembly, Edge Computing & AI",

  description:
    "A deep dive into what the next 5 years of the web will look like. " +
    "We cover WebAssembly beyond the basics, edge runtimes replacing traditional servers, " +
    "and how AI is reshaping the developer experience from IDE to deployment.\n\n" +
    "Whether you're a frontend engineer, fullstack developer, or engineering leader, " +
    "this video gives you a framework for thinking about the architectural choices that " +
    "will matter most in the next half-decade.",

  thumbnailUrl: vid("webdev-future-hero"),

  purchase: { state: "locked", price: "1,200 sats" },

  social: {
    comments: 128,
    shares: 47,
    likes: 3200,
    zaps: 89,
  },

  commentCount: 128,
  comments: MOCK_COMMENTS,

  sidebarCreators: [
    { role: "Host", name: "Alex Chen" },
    { role: "Guest", name: "Priya Kumar" },
    { role: "Editor", name: "James Wright" },
  ],

  sidebarEpisodes: [
    {
      id: "trailer",
      title: "Free Trailer",
      chapterLabel: "Chapter 1",
      duration: "08:23",
      state: "free-trailer",
    },
    {
      id: "ep-1",
      title: "TPB - Episode 1",
      chapterLabel: "Chapter 2",
      duration: "08:23",
      state: "locked",
    },
  ],

  about:
    "Tech Horizons is a video series exploring the cutting edge of software engineering, " +
    "distributed systems, and developer tooling. New episodes every Thursday.",

  tags: ["WebAssembly", "Edge Computing", "AI", "Web Dev"],

  infoItems: [
    { label: "Published Date", value: "2025-04-18" },
    { label: "Duration", value: "42:18" },
    { label: "Format", value: "MP4 / 1080p" },
    { label: "Language", value: "English" },
  ],
}
