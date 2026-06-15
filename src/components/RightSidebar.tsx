"use client"

import { useState, type ReactNode } from "react"
import {
  ChevronUp,
  DotsVertical,
  Heart,
  Lightning01,
  MessageTextSquare02,
  Share07,
  Star01,
  Download01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { ContentTypeTag } from "@/components/ContentCard/ContentTypeTag"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"

// ── Public types ──────────────────────────────────────────────────────────────

export type SidebarCreator = {
  /** Role label — e.g. "Artist", "Narrator", "Composer" */
  role: string
  name: string
  avatarUrl?: string
  isFollowing?: boolean
}

export type SidebarInfoItem = {
  label: string
  value: string
}

export type RightSidebarSocial = {
  comments: number
  shares: number
  likes: number
  boosts: number
}

export type RightSidebarProps = {
  contentType: ContentType
  /** Cover art URL — square (320×320 display) */
  coverUrl?: string
  title: string
  creatorName: string
  /** "owned" shows Share & Earn; "locked" shows Unlock button */
  purchaseState: "free" | "locked" | "owned"
  price?: string
  creators?: SidebarCreator[]
  about?: string
  infoItems?: SidebarInfoItem[]
  social: RightSidebarSocial
  isWishlisted?: boolean
  // Callbacks
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
  onBoost?: () => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

/** Glass mini button (22×22) for cover art overlays */
function GlassBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Star01
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        "flex items-center justify-center size-overlay-btn rounded cursor-pointer shrink-0",
        "bg-overlay-btn backdrop-blur-sm",
        "hover:opacity-80 transition-opacity duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      )}>
      <Icon
        size={13}
        color={active ? "var(--color-brand-500)" : "var(--color-text-primary)"}
        aria-hidden="true"
      />
    </button>
  )
}

/** The 48px play overlay used on the cover art */
function PlayOverlay({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Play"
      className={cx(
        "flex items-center justify-center size-12 rounded-full cursor-pointer",
        "bg-overlay-btn backdrop-blur-sm",
        "hover:opacity-80 transition-opacity duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      )}>
      <span className="text-white text-lg ml-0.5" aria-hidden="true">
        ▶
      </span>
    </button>
  )
}

/** Shared panel wrapper used for Creators / About / Info sections */
function Panel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 px-4 py-3 rounded-md overflow-hidden",
        "bg-app-card",
        className
      )}>
      {children}
    </div>
  )
}

function PanelHeading({ children }: { children: ReactNode }) {
  return <p className="text-subhead text-text-primary">{children}</p>
}

/** Follow button — brand-bordered variant */
function FollowBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center shrink-0",
        "px-3 py-2 rounded-md text-sm font-semibold text-text-secondary",
        "border border-brand-500 bg-app-card",
        "hover:bg-utility-brand-50 transition-colors duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}>
      Follow
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RightSidebar({
  contentType,
  coverUrl,
  title,
  creatorName,
  purchaseState,
  price,
  creators = [],
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
  onBoost,
  className,
}: RightSidebarProps) {
  const [infoOpen, setInfoOpen] = useState(true)

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
        {/* Row 1: Purchase state row */}
        <div className="flex items-center justify-between gap-3 shrink-0">
          <ContentTypeTag type={contentType} />

          <div className="flex items-center gap-2 shrink-0">
            {purchaseState === "owned" && (
              <button
                type="button"
                onClick={onShareAndEarn}
                className={cx(
                  "flex items-center justify-center px-3 py-2 rounded-md shrink-0",
                  "bg-green-700 border-2 border-white/12",
                  "text-sm font-semibold text-white cursor-pointer",
                  "hover:bg-green-800 transition-colors duration-150",
                  "shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                )}>
                Share &amp; Earn
              </button>
            )}
            {purchaseState === "locked" && (
              <Button variant="primary" size="sm" onClick={onUnlock}>
                Unlock
                {price && <span className="ml-1 opacity-70">— {price}</span>}
              </Button>
            )}
            <IconButton
              icon={DotsVertical}
              label="More options"
              variant="ghost"
              size="sm"
              iconSize={24}
              onClick={onOptions}
            />
          </div>
        </div>

        {/* Row 2: Cover art */}
        <div className="relative shrink-0 w-full aspect-square rounded-md overflow-hidden border border-black/10">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-[#27115f] to-[#1a0a40]" />
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <PlayOverlay onClick={onPlay} />
          </div>

          <div className="absolute top-0 right-0 flex flex-col gap-0.5 p-0.5">
            <GlassBtn
              icon={Star01}
              label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              active={isWishlisted}
              onClick={onWishlist}
            />
            <GlassBtn icon={Download01} label="Download" onClick={onDownload} />
          </div>
        </div>

        {/* Row 3: Title + creator name */}
        <div className="flex flex-col gap-1 shrink-0">
          <p className="text-display-xs font-bold text-text-primary leading-8 line-clamp-2">
            {title}
          </p>
          <p className="text-base text-text-tertiary leading-6">
            {creatorName}
          </p>
        </div>

        {/* Row 4: Creators */}
        {creators.length > 0 && (
          <Panel className="shrink-0">
            <PanelHeading>Creators</PanelHeading>
            <div className="flex flex-col gap-4">
              {creators.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      name={c.name}
                      src={c.avatarUrl}
                      size="md"
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
                  <FollowBtn onClick={() => onFollow?.(c.name)} />
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* Row 5: About */}
        {about && (
          <Panel className="shrink-0">
            <PanelHeading>About</PanelHeading>
            <div className="h-sidebar-tracks min-h-0 overflow-y-auto scrollbar-hide">
              <p className="text-base font-medium text-text-primary leading-[1.5] whitespace-pre-wrap">
                {about}
              </p>
            </div>
          </Panel>
        )}

        {/* Row 6: Info (collapsible) */}
        {infoItems.length > 0 && (
          <Panel className="shrink-0">
            <div className="flex items-center justify-between">
              <PanelHeading>Info</PanelHeading>
              <IconButton
                icon={ChevronUp}
                label={infoOpen ? "Collapse info" : "Expand info"}
                variant="ghost"
                size="xs"
                iconSize={20}
                onClick={() => setInfoOpen(v => !v)}
                className={cx(
                  "transform transition-transform duration-200",
                  infoOpen ? "rotate-0" : "rotate-180"
                )}
              />
            </div>
            <div
              className={cx(
                "grid transition-all duration-200 ease-in-out",
                infoOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}>
              <div className="overflow-hidden">
                <div className="flex flex-col gap-4">
                  {infoItems.map((item, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-base font-semibold text-text-secondary leading-6">
                        {item.label}
                      </span>
                      <span className="text-sm text-text-tertiary leading-5 truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        )}
      </div>
      {/* /scrollable zone */}

      {/* ── Pinned social bar ─────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-app-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onComment}
            aria-label={`Comments — ${social.comments}`}
            className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
            <MessageTextSquare02
              size={24}
              color="currentColor"
              aria-hidden="true"
            />
            <span className="text-base font-medium">
              {fmt(social.comments)}
            </span>
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label={`Share — ${social.shares}`}
            className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
            <Share07 size={24} color="currentColor" aria-hidden="true" />
            <span className="text-base font-medium">{fmt(social.shares)}</span>
          </button>
          <button
            type="button"
            onClick={onLike}
            aria-label={`Like — ${social.likes}`}
            className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
            <Heart size={24} color="currentColor" aria-hidden="true" />
            <span className="text-base font-medium">{fmt(social.likes)}</span>
          </button>
          <button
            type="button"
            onClick={onBoost}
            aria-label={`Boost — ${social.boosts}`}
            className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
            <Lightning01 size={24} color="currentColor" aria-hidden="true" />
            <span className="text-base font-medium">{fmt(social.boosts)}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
