"use client"

import { cx } from "@/utils/cx"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"
import { AboutPanel } from "./AboutPanel"
import { CoverArt } from "./CoverArt"
import { CreatorsPanel } from "./CreatorsPanel"
import { EpisodesPanel } from "./EpisodesPanel"
import { InfoPanel } from "./InfoPanel"
import { isBoldRole } from "./internals"
import { PurchaseRow } from "./PurchaseRow"
import { SocialFooter } from "./SocialFooter"

// ── Re-exports (preserve external API) ────────────────────────────────────────

export type { SidebarCreator } from "./CreatorsPanel"
export type { SidebarInfoItem } from "./InfoPanel"
export type { RightSidebarSocial } from "./SocialFooter"
export type { SidebarEpisode } from "./EpisodesPanel"

import type { SidebarCreator } from "./CreatorsPanel"
import type { SidebarInfoItem } from "./InfoPanel"
import type { RightSidebarSocial } from "./SocialFooter"
import type { SidebarEpisode } from "./EpisodesPanel"

// ── Public types ──────────────────────────────────────────────────────────────

export type RightSidebarProps = {
  contentType: ContentType
  /** Cover art URL — aspect derived from contentType (video/podcast → 16:9; else 1:1). */
  coverUrl?: string
  title: string
  creatorName: string
  /** "owned" shows Share & Earn; "locked" shows Unlock button. */
  purchaseState: "free" | "locked" | "owned"
  /** Override the cover aspect ratio (rarely needed — defaults from contentType). */
  coverAspect?: "square" | "wide"
  creators?: SidebarCreator[]
  /** When provided, renders a chapter/episode list between the title and Creators panel. */
  episodes?: SidebarEpisode[]
  about?: string
  infoItems?: SidebarInfoItem[]
  social: RightSidebarSocial
  isWishlisted?: boolean
  // ── Callbacks ─────────────────────────────────────────────────────────────
  onPlay?: () => void
  onDownload?: () => void
  onWishlist?: () => void
  onOptions?: () => void
  onShareAndEarn?: () => void
  onUnlock?: () => void
  onFollow?: (creatorName: string) => void
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onZap?: () => void
  className?: string
}

// ── Main export ───────────────────────────────────────────────────────────────

export function RightSidebar({
  contentType,
  coverUrl,
  title,
  creatorName,
  purchaseState,
  coverAspect,
  creators = [],
  episodes = [],
  about,
  infoItems = [],
  social,
  isWishlisted,
  onPlay,
  onDownload,
  onWishlist,
  onOptions,
  onShareAndEarn,
  onUnlock,
  onFollow,
  onComment,
  onShare,
  onLike,
  onZap,
  className,
}: RightSidebarProps) {
  return (
    <aside
      className={cx(
        "flex flex-col",
        "bg-bg-primary border border-app-border rounded-xl",
        "w-right-sidebar shrink-0 h-full overflow-hidden",
        className
      )}
      aria-label="Content details">
      {/* ── Scrollable zone ───────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col gap-6 p-4">
        <PurchaseRow
          contentType={contentType}
          purchaseState={purchaseState}
          onShareAndEarn={onShareAndEarn}
          onUnlock={onUnlock}
          onOptions={onOptions}
        />

        <CoverArt
          contentType={contentType}
          coverUrl={coverUrl}
          title={title}
          aspect={coverAspect}
          isWishlisted={isWishlisted}
          onPlay={onPlay}
          onWishlist={onWishlist}
          onDownload={onDownload}
        />

        {/* Title + creator name */}
        <div className="flex flex-col gap-1 shrink-0">
          <p className="text-display-xs font-bold text-text-primary leading-8 line-clamp-2">
            {title}
          </p>
          <p className="text-base text-text-tertiary leading-6">{creatorName}</p>
        </div>

        {episodes.length > 0 && <EpisodesPanel episodes={episodes} />}

        {creators.length > 0 && (
          <CreatorsPanel
            creators={creators}
            boldRole={isBoldRole(contentType)}
            onFollow={onFollow}
          />
        )}

        {about && <AboutPanel text={about} />}

        {infoItems.length > 0 && <InfoPanel items={infoItems} />}
      </div>

      <SocialFooter
        social={social}
        onComment={onComment}
        onShare={onShare}
        onLike={onLike}
        onZap={onZap}
      />
    </aside>
  )
}
