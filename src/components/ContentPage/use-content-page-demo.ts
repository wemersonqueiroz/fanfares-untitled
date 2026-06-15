"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MOCK_PLAYER_STATE } from "./mock-data"
import type { ContentPageTab } from "./ContentPageBottom"

// ── Public types ──────────────────────────────────────────────────────────────

export type ContentPageDemoOptions = {
  /** Initial tab. Defaults to "chapters". */
  defaultTab?: ContentPageTab
  /** Include audio-player handlers + state. Defaults to true. */
  withPlayer?: boolean
  /** Noun used in chapter/episode log messages. Defaults to "chapter". */
  chapterNoun?: "chapter" | "episode"
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Bundles every demo callback + state a `<ContentPage />` route needs.
 * Spread the return value into ContentPage — no per-route plumbing.
 */
export function useContentPageDemo(opts: ContentPageDemoOptions = {}) {
  const { defaultTab = "chapters", withPlayer = true, chapterNoun = "chapter" } = opts

  const pathname = usePathname()
  const router = useRouter()
  const [playerState, setPlayerState] = useState(MOCK_PLAYER_STATE)
  const [activeTab, setActiveTab] = useState<ContentPageTab>(defaultTab)

  const playerHandlers = withPlayer
    ? {
        player: playerState,
        onPlay: () => setPlayerState(s => ({ ...s, isPlaying: true })),
        onPause: () => setPlayerState(s => ({ ...s, isPlaying: false })),
        onSkipBack: () => console.log("→ skip back 15s"),
        onSkipForward: () => console.log("→ skip forward 15s"),
        onSeek: (percent: number) =>
          setPlayerState(s => ({ ...s, progressPercent: percent })),
        onSpeedToggle: () =>
          setPlayerState(s => ({
            ...s,
            playbackSpeed:
              s.playbackSpeed === 2 ? 1 : +(s.playbackSpeed + 0.25).toFixed(2),
          })),
        onVolumeToggle: () =>
          setPlayerState(s => ({ ...s, volume: s.volume === 0 ? 75 : 0 })),
        onVolumeChange: (volume: number) =>
          setPlayerState(s => ({ ...s, volume })),
        onExpandPlayer: () => console.log("→ expand player"),
      }
    : {}

  return {
    activeHref: pathname,
    onBack: () => router.back(),
    user: {
      name: "Short Fiat",
      email: "shortfiat@fanfares.io",
    },
    activeTab,
    onTabChange: setActiveTab,

    ...playerHandlers,

    // ── Content actions ──────────────────────────────────────────────────────
    onDownload: () => console.log("→ download"),
    onWishlist: () => console.log("→ toggle wishlist"),
    onOptions: () => console.log("→ options menu"),
    onShareAndEarn: () => console.log("→ share & earn"),
    onUnlock: () => console.log("→ unlock"),
    onFollowCreator: (name: string) => console.log("→ follow", name),

    // ── Chapters / Episodes (linear playable units) ──────────────────────────
    onChapterPlay: (id: string) => console.log(`→ play ${chapterNoun}`, id),
    onChapterDownload: (id: string) =>
      console.log(`→ download ${chapterNoun}`, id),
    onDownloadAll: () =>
      console.log(`→ download all owned ${chapterNoun}s`),

    // ── Series (episodes inside seasons) ─────────────────────────────────────
    onPlayEpisode: (id: string) => console.log("→ play episode", id),
    onUnlockSeason: (id: string) => console.log("→ unlock season", id),

    // ── Social ───────────────────────────────────────────────────────────────
    onComment: () => console.log("→ comment"),
    onShare: () => console.log("→ share"),
    onLike: () => console.log("→ like"),
    onBoost: () => console.log("→ boost"),

    // ── Comments tab ─────────────────────────────────────────────────────────
    onPostReply: (content: string) => console.log("→ post reply", content),
    onCommentReply: (id: string) => console.log("→ reply to comment", id),
    onCommentShare: (id: string) => console.log("→ share comment", id),
    onCommentLike: (id: string) => console.log("→ like comment", id),
    onCommentBoost: (id: string) => console.log("→ boost comment", id),
    onCommentOptions: (id: string) => console.log("→ comment options", id),

    // ── Shell nav ────────────────────────────────────────────────────────────
    onViewProfile: () => console.log("→ navigate to /profile"),
    onSettingsClick: () => console.log("→ navigate to /settings"),
    onLogOut: () => console.log("→ sign out"),
  }
}
