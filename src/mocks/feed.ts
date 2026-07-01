import type { ContentCardProps } from "@/components/ContentCard"

// `vid` here historically returned 640×360, which is `wide` in the shared module.
import { sq, wide as vid, av } from "./picsum"

/**
 * Mock feed cards — one of each supported content type.
 * Replace with real API data in production.
 */
export const MOCK_CARDS: ContentCardProps[] = [
  // ── 1. Video (locked) ────────────────────────────────────────────────────
  {
    id: "card-1",
    href: "/video",
    creator: {
      name: "Tech Horizons",
      handle: "@techhorizons",
      avatarUrl: av("techhorizons"),
    },
    content: {
      type: "video",
      title: "The Future of Web Development: WebAssembly, Edge Computing & AI",
      subtitle:
        "A deep dive into what the next 5 years of the web will look like.",
      thumbnailUrl: vid("webdev-future"),
      duration: "42:18",
    },
    purchase: {
      state: "locked",
      price: "1,200 sats",
    },
    social: { comments: 128, shares: 47, likes: 3200, zaps: 89 },
    topZapper: { name: "Alex K.", amount: 50000, avatarUrl: av("alexk") },
    supporterAvatarUrls: [
      av("sup1"),
      av("sup2"),
      av("sup3"),
      av("sup4"),
      av("sup5"),
    ],
  },

  // ── 2. Article (unlocked) ─────────────────────────────────────────────────
  {
    id: "card-2",
    href: "/article",
    creator: {
      name: "Satoshi Report",
      handle: "@satoshireport",
      avatarUrl: av("satoshireport"),
    },
    content: {
      type: "article",
      title: "Understanding the Bitcoin Lightning Network — A Visual Guide",
      subtitle: "Published · 12 min read",
      excerpt:
        "The Lightning Network is a second-layer payment protocol that operates on top of Bitcoin. " +
        "It enables instant, low-fee transactions between participating nodes by opening off-chain payment channels. " +
        "When two parties want to transact repeatedly, they lock up some bitcoin in a 2-of-2 multisig address on-chain, " +
        "then freely exchange signed commitment transactions off-chain — only settling on the base layer when either party decides to close the channel. " +
        "This architecture allows the network to handle millions of transactions per second while inheriting Bitcoin's security guarantees.",
    },
    purchase: { state: "unlocked" },
    social: { comments: 56, shares: 142, likes: 891, zaps: 34 },
    topZapper: {
      name: "B. Nakamoto",
      amount: 25000,
      avatarUrl: av("nakamoto"),
    },
    supporterAvatarUrls: [av("sup6"), av("sup7"), av("sup8")],
  },

  // ── 3. Podcast Episode (free) ─────────────────────────────────────────────
  {
    id: "card-3",
    href: "/audiobook", // placeholder — /podcast not built yet
    creator: {
      name: "Wanderlust Weekly",
      handle: "@wanderlustweekly",
      avatarUrl: av("wanderlust"),
    },
    content: {
      type: "podcast",
      title: "Ep. 42 — The Art of Solo Travel: Stories from the Road",
      subtitle: "Season 3 · 58 min",
      thumbnailUrl: vid("solo-travel"),
      duration: "58:03",
    },
    purchase: { state: "free" },
    social: { comments: 72, shares: 28, likes: 540, zaps: 12 },
    supporterAvatarUrls: [av("sup9"), av("sup10")],
  },

  // ── 4. Audiobook (locked) ─────────────────────────────────────────────────
  {
    id: "card-4",
    href: "/audiobook",
    creator: {
      name: "Mindful Reads",
      handle: "@mindfulreads",
      avatarUrl: av("mindfulreads"),
    },
    content: {
      type: "audiobook",
      title: "Thinking, Fast and Slow",
      subtitle: "By Daniel Kahneman",
      coverUrl: sq("thinking-fast-slow"),
      duration: "20h 2m",
      narrator: "Patrick Egan",
    },
    purchase: {
      state: "locked",
      price: "3,500 sats",
    },
    social: { comments: 204, shares: 89, likes: 4700, zaps: 156 },
    topZapper: { name: "Maria L.", amount: 75000, avatarUrl: av("marial") },
    supporterAvatarUrls: [
      av("sup11"),
      av("sup12"),
      av("sup13"),
      av("sup14"),
      av("sup15"),
      av("sup16"),
    ],
  },

  // ── 5. Note (free) ───────────────────────────────────────────────────────
  {
    id: "card-5",
    href: "/note",
    creator: {
      name: "Alice Web3",
      handle: "@aliceweb3",
      avatarUrl: av("aliceweb3"),
    },
    content: {
      type: "note",
      title: "My thoughts on decentralized social media after 6 months",
      excerpt:
        "Six months ago I deleted every centralized social account and went full nostr + fediverse. " +
        "Here's what I actually miss (spoiler: almost nothing) and what surprised me most about the experience. " +
        "The biggest revelation wasn't the censorship resistance — it was discovering a community that actually " +
        "cares about the technology rather than the clout.",
    },
    purchase: { state: "free" },
    social: { comments: 33, shares: 19, likes: 287, zaps: 8 },
  },

  // ── 6. Book (locked) ─────────────────────────────────────────────────────
  {
    id: "card-6",
    href: "/audiobook", // placeholder — /book not built yet
    creator: {
      name: "Open Library DAO",
      handle: "@openlibrydao",
      avatarUrl: av("openlibrary"),
    },
    content: {
      type: "book",
      title:
        "The Bitcoin Standard: The Decentralized Alternative to Central Banking",
      subtitle: "By Saifedean Ammous",
      coverUrl: sq("bitcoin-standard"),
      pageCount: 286,
    },
    purchase: {
      state: "locked",
      price: "2,100 sats",
    },
    social: { comments: 98, shares: 63, likes: 2100, zaps: 77 },
    topZapper: {
      name: "S. Ammous Fan",
      amount: 100000,
      avatarUrl: av("sammous"),
    },
    supporterAvatarUrls: [av("sup17"), av("sup18"), av("sup19"), av("sup20")],
  },

  // ── 7. Song (unlocked) ───────────────────────────────────────────────────
  {
    id: "card-7",
    href: "/audiobook", // placeholder — /song not built yet
    creator: {
      name: "Luna Wave",
      handle: "@lunawave",
      avatarUrl: av("lunawave"),
    },
    content: {
      type: "song",
      title: "Midnight Rain",
      subtitle: "Indie Electronic · 2024",
      coverUrl: sq("midnight-rain"),
      duration: "3:47",
      album: "Neon Solstice",
    },
    purchase: { state: "unlocked" },
    social: { comments: 14, shares: 31, likes: 623, zaps: 22 },
    topZapper: { name: "DJ Helix", amount: 15000, avatarUrl: av("djhelix") },
    supporterAvatarUrls: [av("sup21"), av("sup22")],
  },

  // ── 8. Album (locked) ────────────────────────────────────────────────────
  {
    id: "card-8",
    href: "/audiobook", // placeholder — /album not built yet
    creator: {
      name: "Cipher Sound",
      handle: "@ciphersound",
      avatarUrl: av("ciphersound"),
    },
    content: {
      type: "album",
      title: "Proof of Work",
      subtitle: "12 tracks · Electronic / Ambient",
      coverUrl: sq("proof-of-work"),
      trackCount: 12,
    },
    purchase: {
      state: "locked",
      price: "5,000 sats",
    },
    social: { comments: 41, shares: 18, likes: 934, zaps: 51 },
    topZapper: { name: "BitBeats", amount: 30000, avatarUrl: av("bitbeats") },
    supporterAvatarUrls: [av("sup23"), av("sup24"), av("sup25")],
  },

  // ── 9. Collection (free) ─────────────────────────────────────────────────
  {
    id: "card-9",
    href: "/audiobook", // placeholder — /collection not built yet
    creator: {
      name: "Crypto Curators",
      handle: "@cryptocurators",
      avatarUrl: av("cryptocurators"),
    },
    content: {
      type: "collection",
      title: "Bitcoin History: Essential Reading for 2025",
      subtitle: "Curated collection of 18 articles, books and podcasts",
      coverUrls: [
        sq("btc-hist-1"),
        sq("btc-hist-2"),
        sq("btc-hist-3"),
        sq("btc-hist-4"),
      ],
      itemCount: 18,
    },
    purchase: { state: "free" },
    social: { comments: 67, shares: 210, likes: 1540, zaps: 43 },
    supporterAvatarUrls: [av("sup26"), av("sup27"), av("sup28"), av("sup29")],
  },

  // ── 10. Podcast Show (free) ──────────────────────────────────────────────
  {
    id: "card-10",
    href: "/audiobook", // placeholder — /podcast-show not built yet
    creator: {
      name: "Zero Knowledge FM",
      handle: "@zeroknowledgefm",
      avatarUrl: av("zeroknowledge"),
    },
    content: {
      type: "podcast-show",
      title: "Zero Knowledge Podcast",
      subtitle:
        "Weekly deep-dives on cryptography, ZK proofs and the future of privacy.",
      thumbnailUrl: sq("zk-podcast"),
      episodeCount: 312,
    },
    purchase: { state: "free" },
    social: { comments: 189, shares: 94, likes: 5600, zaps: 228 },
    topZapper: { name: "zk Maxi", amount: 200000, avatarUrl: av("zkmaxi") },
    supporterAvatarUrls: [
      av("sup30"),
      av("sup31"),
      av("sup32"),
      av("sup33"),
      av("sup34"),
    ],
  },
]
