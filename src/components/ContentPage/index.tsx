"use client"

import { useState, useCallback, type ReactNode } from "react"
import {
  ArrowNarrowLeft,
  Download01,
  DotsVertical,
  Star01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { CreatorByline } from "@/components/CreatorByline"
import { FadingDescription } from "@/components/FadingDescription"
import { HeroTitle } from "@/components/HeroTitle"
import { IconButton } from "@/components/IconButton"
import { FanfaresMenu } from "@/components/FanfaresMenu"
import type { FanfaresMenuUser } from "@/components/FanfaresMenu"
import { ContentTypeTag } from "@/components/ContentCard/ContentTypeTag"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"
import { ContentPageBottom } from "./ContentPageBottom"
import type {
  ChapterData,
  CommentData,
  ContentPageTab,
  TabDefinition,
} from "./ContentPageBottom"
import type { SeriesSeason } from "./SeriesEpisodeGrid"
import type { SidebarCreator, SidebarEpisode, SidebarInfoItem } from "@/components/RightSidebar"
import { ContentRightAside } from "./ContentRightAside"
import { PageColumns } from "@/components/PageColumns"
import { AudioActionsBar } from "./AudioActionsBar"
import { MobileBottomNav } from "./MobileBottomNav"
import { CommentModal } from "@/components/CommentModal"
import type { ParentComment } from "@/components/CommentModal"

// ── Public types ──────────────────────────────────────────────────────────────

export type ContentPageCreator = {
  name: string
  /** Nostr pubkey, @handle, or any short identifier */
  handle?: string
  avatarUrl?: string
  /** Displayed as a third line under the handle */
  publishedAt?: string
}

export type ContentPagePurchase =
  | { state: "free" }
  | { state: "locked"; price?: string }
  | { state: "owned" }

export type AudioPlayerState = {
  isPlaying: boolean
  currentTime: string
  totalTime: string
  /** Remaining time string — displayed as "-XX:XX" next to progress bar */
  remainingTime?: string
  progressPercent: number
  playbackSpeed: number
  volume: number
}

// Re-export sub-component types so consumers can import from one place
export type {
  ChapterData,
  CommentData,
  ContentPageTab,
  TabDefinition,
  SidebarCreator,
  SidebarInfoItem,
  SeriesSeason,
}

export type ContentPageProps = {
  // ── Identification ────────────────────────────────────────────────────────
  contentType: ContentType
  creator: ContentPageCreator
  title: string
  /** Square cover / artwork URL */
  coverUrl?: string
  description: string

  topContent?: ReactNode
  /**
   * Whether to show the "Chapters" tab in ContentPageBottom.
   * Set to false for Note, Article, and other non-chapter content types.
   * @default true
   */
  showChaptersTab?: boolean

  // ── Purchase ──────────────────────────────────────────────────────────────
  purchase: ContentPagePurchase

  // ── Bottom section ────────────────────────────────────────────────────────
  activeTab?: ContentPageTab
  chapters?: ChapterData[]
  /** Series seasons — when provided the Episodes tab is shown instead of Chapters */
  episodes?: SeriesSeason[]
  commentCount?: number
  comments?: CommentData[]
  /** Avatar for the logged-in user shown in the comment reply input */
  currentUserAvatarUrl?: string

  // ── Right sidebar ─────────────────────────────────────────────────────────
  sidebarCreators?: SidebarCreator[]
  /** Chapter/episode list rendered in the right sidebar (between title and Creators). */
  sidebarEpisodes?: SidebarEpisode[]
  about?: string
  infoItems?: SidebarInfoItem[]

  // ── Info tab (center column) ───────────────────────────────────────────────
  /** Tag/genre pills shown in the Info tab */
  tags?: string[]

  // ── Social counts ─────────────────────────────────────────────────────────
  social: {
    comments: number
    shares: number
    likes: number
    zaps: number
  }

  // ── Audio player state (optional — omit to hide the player bar) ───────────
  player?: AudioPlayerState

  // ── Shell / nav ───────────────────────────────────────────────────────────
  activeHref: string
  user: FanfaresMenuUser

  // ── Callbacks — all optional, inject your logic externally ───────────────
  onPlay?: () => void
  onPause?: () => void
  onSkipBack?: () => void
  onSkipForward?: () => void
  onSeek?: (percent: number) => void
  onSpeedToggle?: () => void
  onVolumeToggle?: () => void
  onVolumeChange?: (volume: number) => void
  onExpandPlayer?: () => void
  onDownload?: () => void
  onWishlist?: () => void
  onOptions?: () => void
  onShareAndEarn?: () => void
  onUnlock?: () => void
  onFollowCreator?: (name: string) => void
  onChapterPlay?: (id: string) => void
  onChapterDownload?: (id: string) => void
  onDownloadAll?: () => void
  onPlayEpisode?: (episodeId: string) => void
  onUnlockSeason?: (seasonId: string) => void
  onTabChange?: (tab: ContentPageTab) => void
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onZap?: () => void
  onPostReply?: (content: string) => void
  onCommentReply?: (commentId: string) => void
  onCommentShare?: (commentId: string) => void
  onCommentLike?: (commentId: string) => void
  onCommentZap?: (commentId: string) => void
  onCommentOptions?: (commentId: string) => void
  onBack?: () => void
  onViewProfile?: () => void
  onSettingsClick?: () => void
  onLogOut?: () => void
}

// ── Internal sub-components ───────────────────────────────────────────────────

// Avatar imported from @/components/Avatar

/** The centered play circle overlaid on artwork */
function ArtworkPlayOverlay({ onClick }: { onClick?: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
      <button
        type="button"
        onClick={onClick}
        aria-label="Play"
        className={cx(
          "flex items-center justify-center size-12 rounded-full cursor-pointer",
          "bg-[rgba(91,90,87,0.4)] backdrop-blur-sm",
          "hover:bg-[rgba(91,90,87,0.65)] transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        )}>
        <span className="text-white text-xl ml-0.5" aria-hidden="true">
          ▶
        </span>
      </button>
    </div>
  )
}

function MediaContentHero({
  title,
  creator,
  coverUrl,
  description,
  onPlay,
}: {
  title: string
  creator: ContentPageCreator
  coverUrl?: string
  description: string
  onPlay?: () => void
}) {
  return (
    <div className="flex flex-wrap gap-8 items-start">
      {/* Square artwork — scales down gracefully on narrow viewports */}
      <div className="relative aspect-square w-full sm:w-auto sm:min-w-36 sm:flex-1 sm:max-w-content-cover rounded-md overflow-hidden border border-black/10">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="size-full object-cover" />
        ) : (
          <div className="size-full bg-gradient-to-br from-[#27115f] to-[#1a0a40]" />
        )}
        <ArtworkPlayOverlay onClick={onPlay} />
      </div>

      {/* Title + creator + description */}
      <div className="flex flex-col gap-2 flex-1 min-w-0 sm:min-w-60 overflow-hidden pb-2">
        <HeroTitle title={title} subtitle={creator.name} />
        <FadingDescription text={description} className="mt-2" />
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ContentPage({
  contentType,
  creator,
  title,
  coverUrl,
  description,
  topContent,
  showChaptersTab = true,
  purchase,
  activeTab,
  chapters = [],
  episodes = [],
  commentCount,
  comments = [],
  currentUserAvatarUrl,
  sidebarCreators = [],
  sidebarEpisodes,
  about,
  infoItems = [],
  tags = [],
  social,
  player,
  activeHref,
  user,
  onPlay,
  onPause,
  onSkipBack,
  onSkipForward,
  onSeek,
  onSpeedToggle,
  onVolumeToggle,
  onVolumeChange,
  onExpandPlayer,
  onDownload,
  onWishlist,
  onOptions,
  onShareAndEarn,
  onUnlock,
  onFollowCreator,
  onChapterPlay,
  onChapterDownload,
  onDownloadAll,
  onPlayEpisode,
  onUnlockSeason,
  onTabChange,
  onComment,
  onShare,
  onLike,
  onZap,
  onPostReply,
  onCommentReply,
  onCommentShare,
  onCommentLike,
  onCommentZap,
  onCommentOptions,
  onBack,
  onViewProfile,
  onSettingsClick,
  onLogOut,
}: ContentPageProps) {
  // ── Comment modal state ───────────────────────────────────────────────────
  const [commentModal, setCommentModal] = useState<{
    open: boolean
    parent: ParentComment | null
    /** "comment" = posting on content itself; "reply" = replying to a comment */
    mode: "comment" | "reply"
  }>({ open: false, parent: null, mode: "comment" })

  /** Build a ParentComment from a CommentData entry */
  const buildParent = useCallback(
    (c: CommentData): ParentComment => ({
      name: c.author.name,
      handle: c.author.handle ?? c.author.name,
      timestamp: c.timestamp,
      body: c.content,
      avatarUrl: c.author.avatarUrl,
      social: {
        comments: c.reactions.replies,
        shares: c.reactions.shares,
        likes: c.reactions.likes,
        zaps: c.reactions.zaps,
      },
    }),
    []
  )

  const contentParent = useCallback(
    (): ParentComment => ({
      name: creator.name,
      handle: creator.handle ?? creator.name,
      timestamp: creator.publishedAt ?? "",
      body: title,
      avatarUrl: creator.avatarUrl,
      social: {
        comments: social.comments,
        shares: social.shares,
        likes: social.likes,
        zaps: social.zaps,
      },
    }),
    [creator, title, social]
  )

  const closeCommentModal = useCallback(
    () => setCommentModal(prev => ({ ...prev, open: false })),
    []
  )

  // Derive tab definitions
  const totalEpisodes = episodes.reduce((n, s) => n + s.episodes.length, 0)
  const tabs: TabDefinition[] = [
    ...(episodes.length > 0
      ? [{ id: "episodes" as ContentPageTab, label: "Episodes", count: totalEpisodes }]
      : showChaptersTab
        ? [{ id: "chapters" as ContentPageTab, label: "Chapters", count: chapters.length }]
        : []),
    { id: "comments" as ContentPageTab, label: "Comments", count: commentCount },
    { id: "info" as ContentPageTab, label: "Info" },
  ]

  // Default active tab: first tab
  const resolvedActiveTab = activeTab ?? tabs[0]?.id ?? "comments"

  const purchaseStateForSidebar =
    purchase.state === "owned"
      ? "owned"
      : purchase.state === "locked"
        ? "locked"
        : "free"

  const isPlaying = player?.isPlaying ?? false
  const handlePlayPause = isPlaying ? onPause : onPlay

  /**
   * Sidebar / feed comment button — commenting ON the content itself.
   * Shows the content (creator + title + social) as the context item.
   */
  const handleComment = useCallback(() => {
    onComment?.()
    setCommentModal({ open: true, parent: contentParent(), mode: "comment" })
  }, [onComment, contentParent])

  /**
   * "Reply" button on a specific comment — replying TO that comment.
   * Shows the comment author + body as the parent context.
   */
  const handleCommentReply = useCallback(
    (commentId: string) => {
      onCommentReply?.(commentId)
      const target = comments.find(c => c.id === commentId)
      if (target) {
        setCommentModal({
          open: true,
          parent: buildParent(target),
          mode: "reply",
        })
      }
    },
    [onCommentReply, comments, buildParent]
  )

  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">
      <PageColumns
        left={
          <FanfaresMenu
            activeHref={activeHref}
            user={user}
            onViewProfile={onViewProfile}
            onSettingsClick={onSettingsClick}
            onLogOut={onLogOut}
          />
        }
        center={
          <div className="flex flex-col gap-6">
            {/* ── Back navigation ─────────────────────────────────────────── */}
            {onBack && (
              <div className="flex items-center">
                <IconButton
                  icon={ArrowNarrowLeft}
                  label="Go back"
                  variant="ghost-primary"
                  size="md"
                  onClick={onBack}
                />
              </div>
            )}

            {/* ── Top card: creator header + hero content ─────────────────── */}
            <section
              className={cx(
                "bg-bg-primary sm:border sm:border-app-border rounded-xl",
                "flex flex-col gap-6 pt-4 pb-8 px-4"
              )}>
              {/* ── Creator header — responsive 2-row on mobile ──────────── */}
              <div className="flex flex-col gap-3">
                {/* Row 1: avatar + info | mobile: star+dots only / desktop: all actions */}
                <div className="flex items-center justify-between gap-3">
                  <CreatorByline
                    name={creator.name}
                    handle={creator.handle}
                    meta={creator.publishedAt}
                    avatarUrl={creator.avatarUrl}
                    size="lg"
                  />

                  {/* Desktop: full actions */}
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                    <ContentTypeTag type={contentType} />
                    <IconButton icon={Download01} label="Download" variant="ghost" size="sm" iconSize={24} onClick={onDownload} />
                    <IconButton icon={Star01} label="Wishlist" variant="ghost" size="sm" iconSize={24} onClick={onWishlist} />
                    {purchase.state === "owned" && (
                      <button
                        type="button"
                        onClick={onShareAndEarn}
                        className={cx(
                          "flex items-center justify-center px-3 py-2 rounded-md",
                          "bg-green-700 border-2 border-white/12",
                          "text-sm font-semibold text-white cursor-pointer",
                          "hover:bg-green-800 transition-colors duration-150",
                          "shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]",
                          "focus-visible:outline-none"
                        )}>
                        Share &amp; Earn
                      </button>
                    )}
                    {purchase.state === "locked" && (
                      <Button variant="primary" size="sm" onClick={onUnlock}>
                        Unlock
                        {purchase.price && <span className="ml-1 opacity-70">— {purchase.price}</span>}
                      </Button>
                    )}
                    <IconButton icon={DotsVertical} label="More options" variant="ghost" size="sm" iconSize={24} onClick={onOptions} />
                  </div>

                  {/* Mobile: wishlist + dots only */}
                  <div className="flex sm:hidden items-center gap-1 shrink-0">
                    <IconButton icon={Star01} label="Wishlist" variant="ghost" size="sm" iconSize={24} onClick={onWishlist} />
                    <IconButton icon={DotsVertical} label="More options" variant="ghost" size="sm" iconSize={24} onClick={onOptions} />
                  </div>
                </div>

                {/* Row 2 (mobile only): content type tag + CTA */}
                <div className="flex sm:hidden items-center justify-between gap-3">
                  <ContentTypeTag type={contentType} />
                  {purchase.state === "owned" && (
                    <button
                      type="button"
                      onClick={onShareAndEarn}
                      className={cx(
                        "flex items-center justify-center px-3 py-1.5 rounded-md",
                        "bg-green-700 border-2 border-white/12",
                        "text-sm font-semibold text-white cursor-pointer",
                        "hover:bg-green-800 transition-colors duration-150",
                        "shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]",
                        "focus-visible:outline-none"
                      )}>
                      Share &amp; Earn
                    </button>
                  )}
                  {purchase.state === "locked" && (
                    <Button variant="primary" size="sm" onClick={onUnlock}>
                      Unlock
                      {purchase.price && <span className="ml-1 opacity-70">— {purchase.price}</span>}
                    </Button>
                  )}
                </div>
              </div>

              {/* Top content — default media hero or custom topContent */}
              {topContent === undefined ? (
                <MediaContentHero
                  title={title}
                  creator={creator}
                  coverUrl={coverUrl}
                  description={description}
                  onPlay={onPlay}
                />
              ) : topContent !== null ? (
                topContent
              ) : null}
            </section>

            {/* ── Bottom card: tab bar + content ──────────────────────────── */}
            <section
              className={cx(
                "bg-bg-primary sm:border sm:border-app-border rounded-xl",
                "pt-2 pb-6 px-4"
              )}>
              <ContentPageBottom
                tabs={tabs}
                activeTab={resolvedActiveTab}
                chapters={chapters}
                comments={comments}
                currentUserAvatarUrl={currentUserAvatarUrl}
                creators={sidebarCreators}
                tags={tags}
                infoItems={infoItems}
                social={{ likes: social.likes, zaps: social.zaps, shares: social.shares }}
                episodes={episodes}
                onTabChange={onTabChange}
                onChapterPlay={onChapterPlay}
                onChapterDownload={onChapterDownload}
                onDownloadAll={onDownloadAll}
                onPlayEpisode={onPlayEpisode}
                onUnlockSeason={onUnlockSeason}
                onLike={onLike}
                onZap={onZap}
                onPostReply={onPostReply}
                onCommentReply={handleCommentReply}
                onCommentShare={onCommentShare}
                onCommentLike={onCommentLike}
                onCommentZap={onCommentZap}
                onCommentOptions={onCommentOptions}
              />
            </section>
          </div>
        }
        right={
          <ContentRightAside
            contentType={contentType}
            coverUrl={coverUrl}
            title={title}
            creatorName={creator.name}
            purchaseState={purchaseStateForSidebar}
            creators={sidebarCreators}
            episodes={sidebarEpisodes}
            about={about}
            infoItems={infoItems}
            social={social}
            onPlay={onPlay}
            onDownload={onDownload}
            onWishlist={onWishlist}
            onOptions={onOptions}
            onShareAndEarn={onShareAndEarn}
            onUnlock={onUnlock}
            onFollow={onFollowCreator}
            onComment={handleComment}
            onShare={onShare}
            onLike={onLike}
            onZap={onZap}
          />
        }
      />

      {/* ── Player bar — shrink-0 row, never overlaps content ─────────────── */}
      {player && (
        <AudioActionsBar
          title={title}
          creatorName={creator.name}
          coverUrl={coverUrl}
          isPlaying={player.isPlaying}
          currentTime={player.currentTime}
          totalTime={player.totalTime}
          remainingTime={player.remainingTime}
          progressPercent={player.progressPercent}
          playbackSpeed={player.playbackSpeed}
          volume={player.volume}
          onPlayPause={handlePlayPause}
          onSkipBack={onSkipBack}
          onSkipForward={onSkipForward}
          onSeek={onSeek}
          onSpeedToggle={onSpeedToggle}
          onVolumeToggle={onVolumeToggle}
          onVolumeChange={onVolumeChange}
          onExpand={onExpandPlayer}
        />
      )}

      {/* ── Mobile bottom nav — visible only below lg breakpoint ──────────── */}
      <MobileBottomNav activeHref={activeHref} className="flex lg:hidden" />

      {/* ── Comment / Reply modal ─────────────────────────────────────────────── */}
      {commentModal.open && commentModal.parent && (
        <CommentModal
          isOpen={commentModal.open}
          onClose={closeCommentModal}
          parentComment={commentModal.parent}
          currentUser={{ avatarUrl: currentUserAvatarUrl }}
          placeholder={
            commentModal.mode === "comment"
              ? "Post Your Comment"
              : "Post Your Reply"
          }
          submitLabel={commentModal.mode === "comment" ? "Comment" : "Reply"}
          onSubmitReply={text => {
            onPostReply?.(text)
            closeCommentModal()
          }}
        />
      )}
    </div>
  )
}
