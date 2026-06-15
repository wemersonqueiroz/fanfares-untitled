"use client"

import { type ReactNode } from "react"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import {
  Heart,
  Lightning01,
  Share07,
  ChevronDown,
  ChevronUp,
  Lock01,
  Download01,
} from "@untitledui/icons"
import { ChapterRow } from "./ChapterRow"
import type { ChapterRowProps } from "./ChapterRow"
import { SeriesEpisodeGrid } from "./SeriesEpisodeGrid"
import type { SeriesSeason } from "./SeriesEpisodeGrid"
import { CommentsSection } from "./CommentsSection"
import type { SidebarCreator, SidebarInfoItem } from "@/components/RightSidebar"

// ── Public types ──────────────────────────────────────────────────────────────

/** A chapter/episode entry — data only (callbacks come from the parent) */
export type ChapterData = Omit<
  ChapterRowProps,
  "onPlay" | "onDownload" | "className"
>

export type ContentPageTab = "chapters" | "episodes" | "comments" | "info"

export type TabDefinition = {
  id: ContentPageTab
  label: string
  count?: number
}

export type CommentAuthor = {
  name: string
  /** e.g. "rebecca@fanfares.io" or "@handle" */
  handle?: string
  avatarUrl?: string
}

export type CommentData = {
  id: string
  author: CommentAuthor
  content: string
  /** Formatted relative time — e.g. "7 hours", "2 days ago" */
  timestamp: string
  reactions: {
    replies: number
    shares: number
    likes: number
    boosts: number
  }
  /** Nested replies — one level deep */
  replies?: CommentData[]
}

export type ContentPageBottomProps = {
  tabs: TabDefinition[]
  activeTab: ContentPageTab
  chapters?: ChapterData[]
  social: {
    likes: number
    boosts: number
    shares: number
  }
  // ── Comments tab data ──────────────────────────────────────────────────────
  comments?: CommentData[]
  /** Avatar URL for the logged-in user shown in the reply input */
  currentUserAvatarUrl?: string
  // ── Info tab data ──────────────────────────────────────────────────────────
  creators?: SidebarCreator[]
  tags?: string[]
  infoItems?: SidebarInfoItem[]
  // ── Series (episodes tab) data ────────────────────────────────────────────
  episodes?: SeriesSeason[]
  // ── Callbacks ─────────────────────────────────────────────────────────────
  onTabChange?: (tab: ContentPageTab) => void
  onChapterPlay?: (id: string) => void
  onChapterDownload?: (id: string) => void
  onDownloadAll?: () => void
  onPlayEpisode?: (episodeId: string) => void
  onUnlockSeason?: (seasonId: string) => void
  onLike?: () => void
  onBoost?: () => void
  onPostReply?: (content: string) => void
  onCommentReply?: (commentId: string) => void
  onCommentShare?: (commentId: string) => void
  onCommentLike?: (commentId: string) => void
  onCommentBoost?: (commentId: string) => void
  onCommentOptions?: (commentId: string) => void
  className?: string
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm text-text-tertiary">{message}</p>
    </div>
  )
}


// ── Info tab helpers ───────────────────────────────────────────────────────────

// InfoCreatorAvatar replaced by Avatar from @/components/Avatar

function InfoHeading({ children }: { children: ReactNode }) {
  return <p className="text-subhead text-text-primary">{children}</p>
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ContentPageBottom({
  tabs,
  activeTab,
  chapters = [],
  episodes = [],
  social,
  comments = [],
  currentUserAvatarUrl,
  creators = [],
  tags = [],
  infoItems = [],
  onTabChange,
  onChapterPlay,
  onChapterDownload,
  onDownloadAll,
  onPlayEpisode,
  onUnlockSeason,
  onLike,
  onBoost,
  onPostReply,
  onCommentReply,
  onCommentShare,
  onCommentLike,
  onCommentBoost,
  onCommentOptions,
  className,
}: ContentPageBottomProps) {
  return (
    <div className={cx("flex flex-col gap-10", className)}>
      {/* ── Tab bar + social icons ────────────────────────────────────────── */}
      {/* Mobile: counts row first (order-1), tabs row second (order-2)     */}
      {/* Desktop: single flex row — tabs left (sm:order-1), counts right (sm:order-2) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 pb-0">
        {/* Tabs */}
        <div className="order-2 sm:order-1 flex items-center gap-8 sm:gap-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className={cx(
                "pb-1 text-base sm:text-lg leading-7 whitespace-nowrap cursor-pointer",
                "transition-colors duration-150 focus-visible:outline-none",
                activeTab === tab.id
                  ? "text-text-primary border-b border-text-primary"
                  : "text-text-tertiary hover:text-text-primary"
              )}>
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-text-tertiary ml-1 font-normal">
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Social counts */}
        <div className="order-1 sm:order-2 flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={onLike}
            aria-label={`Like — ${social.likes}`}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer focus-visible:outline-none">
            <Heart size={20} color="var(--color-text-tertiary)" aria-hidden="true" />
            <span className="text-sm sm:text-base font-medium text-text-primary">{fmt(social.likes)}</span>
          </button>
          <button
            type="button"
            onClick={onBoost}
            aria-label={`Boost — ${social.boosts}`}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer focus-visible:outline-none">
            <Lightning01 size={20} color="var(--color-text-tertiary)" aria-hidden="true" />
            <span className="text-sm sm:text-base font-medium text-text-primary">{fmt(social.boosts)}</span>
          </button>
          <button
            type="button"
            aria-label={`Share — ${social.shares}`}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer focus-visible:outline-none">
            <Share07 size={20} color="var(--color-text-tertiary)" aria-hidden="true" />
            <span className="text-sm sm:text-base font-medium text-text-primary">{fmt(social.shares)}</span>
          </button>
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────── */}

      {activeTab === "chapters" &&
        (() => {
          if (chapters.length === 0) {
            return <EmptyState message="No chapters available." />
          }

          const owned = chapters.filter(ch => ch.isOwned)
          const locked = chapters.filter(ch => !ch.isOwned)
          const hasSplit = owned.length > 0 && locked.length > 0

          return (
            <div className="flex flex-col gap-3">
              {/* ── Owned chapters ──────────────────────────────────────────── */}
              {owned.map(ch => (
                <ChapterRow
                  key={ch.id}
                  {...ch}
                  onPlay={onChapterPlay}
                  onDownload={onChapterDownload}
                />
              ))}

              {/* ── Premium content divider ─────────────────────────────────── */}
              {hasSplit && (
                <div className="flex items-center gap-4 py-3">
                  <div className="flex-1 h-px bg-text-warning-primary/30" />
                  <div
                    className={cx(
                      "flex items-center gap-2 px-4 py-1.5 rounded-full shrink-0",
                      "border border-text-warning-primary text-text-warning-primary"
                    )}>
                    <Lock01 size={14} color="currentColor" aria-hidden="true" />
                    <span className="text-sm font-semibold">
                      Premium content
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-text-warning-primary/30" />
                </div>
              )}

              {/* ── Download All (owned items exist and there are locked items) */}
              {hasSplit && (
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    iconRight={Download01}
                    onClick={onDownloadAll}>
                    Download All
                  </Button>
                </div>
              )}

              {/* ── Locked chapters ─────────────────────────────────────────── */}
              {locked.map(ch => (
                <ChapterRow
                  key={ch.id}
                  {...ch}
                  onPlay={onChapterPlay}
                  onDownload={onChapterDownload}
                />
              ))}
            </div>
          )
        })()}

      {activeTab === "episodes" && (
        episodes.length === 0
          ? <EmptyState message="No episodes available." />
          : <SeriesEpisodeGrid
              seasons={episodes}
              onPlayEpisode={onPlayEpisode}
              onUnlockSeason={onUnlockSeason}
            />
      )}

      {activeTab === "comments" && (
        <CommentsSection
          comments={comments}
          currentUserAvatarUrl={currentUserAvatarUrl}
          onPostReply={onPostReply}
          onCommentReply={onCommentReply}
          onCommentShare={onCommentShare}
          onCommentLike={onCommentLike}
          onCommentBoost={onCommentBoost}
          onCommentOptions={onCommentOptions}
        />
      )}

      {activeTab === "info" && (
        <div className="flex flex-col gap-8">
          {creators.length > 0 && (
            <div className="flex flex-col gap-4">
              <InfoHeading>Creators</InfoHeading>
              <div className="flex flex-col gap-4">
                {creators.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar
                      name={c.name}
                      src={c.avatarUrl}
                      size="sm"
                      className="border border-black/10"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-text-secondary truncate">
                        {c.role}
                      </span>
                      <span className="text-sm text-text-tertiary truncate">
                        {c.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-col gap-3">
              <InfoHeading>Tags/Metadata</InfoHeading>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-sm text-text-tertiary border border-app-border bg-app-card">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {infoItems.length > 0 && (
            <div className="flex flex-col gap-4">
              {infoItems.map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-text-secondary leading-6">
                    {item.label}
                  </span>
                  <span className="text-sm text-text-tertiary leading-5">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {creators.length === 0 &&
            tags.length === 0 &&
            infoItems.length === 0 && (
              <EmptyState message="No info available." />
            )}
        </div>
      )}
    </div>
  )
}
