"use client"

import { useState } from "react"
import {
  ArrowNarrowLeft,
  DotsHorizontal,
  Edit01,
  QrCode01,
  Zap,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { ContentCard } from "@/components/ContentCard"
import { BrowseCard, BrowseSection } from "@/components/BrowseCard"
import {
  MOCK_ACTIVITY,
  MOCK_PROFILE,
  MOCK_STORE_SECTIONS,
  MOCK_WISHLIST_SECTIONS,
  PROFILE_TABS,
  type MutualFollowers,
  type ProfileSectionData,
  type ProfileTab,
  type ProfileUser,
} from "./mock-data"

// ── Public types ──────────────────────────────────────────────────────────────

export type ProfilePageProps = {
  user?: ProfileUser
  /**
   * `true`  → viewing your own profile (shows "Edit Profile", hides "Follows you" badge & mutual followers)
   * `false` → viewing someone else's profile (shows "Follow", "Follows you" badge, mutual followers)
   */
  isOwnProfile?: boolean
  /** Whether the logged-in user is already following this person */
  isFollowing?: boolean
  // ── Header callbacks ───────────────────────────────────────────────────────
  onBack?: () => void
  onOptions?: () => void
  onQrCode?: () => void
  onZap?: () => void
  onFollow?: () => void
  onEditProfile?: () => void
  onFollowingClick?: () => void
  onFollowersClick?: () => void
  onWebsiteClick?: () => void
  // ── Content callbacks ──────────────────────────────────────────────────────
  onShowAll?: (sectionId: string) => void
  onCardClick?: (title: string) => void
  onCardPlay?: (title: string) => void
  onCardOptions?: (title: string) => void
  onCardShare?: (title: string) => void
  onCardFavourite?: (title: string) => void
  onCardDownload?: (title: string) => void
  // ── Feed card callbacks ────────────────────────────────────────────────────
  onUnlock?: (id: string) => void
  onWishlistToggle?: (id: string) => void
  onComment?: (id: string) => void
  onShare?: (id: string) => void
  onLike?: (id: string) => void
  onBoost?: (id: string) => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

/** fmt large numbers as "54", "312", "1.2K", etc. */
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/** Overlapping avatar stack used in the mutual followers row */
function MutualAvatarStack({ data }: { data: MutualFollowers }) {
  // Visible will be replaced with actual call of followers.
  const visible = data.avatarUrls.slice(0, 4)
  return (
    <div className="flex items-center gap-2 py-1 shrink-0">
      {/* Avatar stack — ring shadow creates the page-bg separation gap between overlapping circles */}
      <div className="flex items-center shrink-0">
        {visible.map((url, i) => (
          <Avatar
            key={i}
            src={url ?? undefined}
            size="xs"
            className={cx(
              "shadow-[0px_0px_0px_1.5px_var(--color-app-bg)]",
              i > 0 && "-ml-2"
            )}
          />
        ))}
        {data.overflow && data.overflow > 0 && (
          <div
            className={cx(
              "size-6 rounded-full -ml-2 shrink-0",
              "bg-app-card border border-app-border",
              "shadow-[0px_0px_0px_1.5px_var(--color-app-bg)]",
              "flex items-center justify-center"
            )}>
            <span className="text-2xs font-semibold text-text-quaternary">
              +{data.overflow}
            </span>
          </div>
        )}
      </div>
      <p className="text-sm text-text-tertiary leading-6 truncate">
        {data.text}
      </p>
    </div>
  )
}

/** "Follows you" badge shown next to the handle on else's profile */
function FollowsYouBadge() {
  return (
    <span
      className={cx(
        "inline-flex items-center px-2 py-0.5 rounded-md",
        "bg-app-surface border border-app-border",
        "text-xs font-medium text-text-tertiary",
        "whitespace-nowrap shrink-0"
      )}>
      Follows you
    </span>
  )
}

/** Tab bar — Activity / Store / Wishlist */
function ProfileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
}) {
  return (
    <div className="px-6 py-4 bg-app-bg border-t border-app-border shrink-0">
      <div
        className={cx(
          "flex gap-1 p-1.5 w-full",
          "bg-app-surface border border-app-border rounded-xl"
        )}>
        {PROFILE_TABS.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            aria-pressed={activeTab === tab}
            className={cx(
              "flex-1 h-11 flex items-center justify-center px-3 py-2 rounded-md",
              "text-base font-semibold cursor-pointer transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
              activeTab === tab
                ? "bg-brand-600 text-white shadow-sm"
                : "text-text-quaternary hover:bg-app-card hover:text-text-tertiary"
            )}>
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Store or Wishlist BrowseSection grid */
function BrowseTabContent({
  sections,
  onShowAll,
  onCardClick,
  onCardPlay,
  onCardOptions,
  onCardShare,
  onCardFavourite,
  onCardDownload,
}: {
  sections: ProfileSectionData[]
  onShowAll?: (id: string) => void
  onCardClick?: (title: string) => void
  onCardPlay?: (title: string) => void
  onCardOptions?: (title: string) => void
  onCardShare?: (title: string) => void
  onCardFavourite?: (title: string) => void
  onCardDownload?: (title: string) => void
}) {
  return (
    <div className="flex flex-col gap-14 p-6">
      {sections.map(section => (
        <BrowseSection
          key={section.id}
          title={section.title}
          onShowAll={() => onShowAll?.(section.id)}>
          {section.cards.map((card, i) => (
            <BrowseCard
              key={`${section.id}-${i}`}
              {...card}
              onClick={() => onCardClick?.(card.title)}
              onPlay={() => onCardPlay?.(card.title)}
              onOptions={() => onCardOptions?.(card.title)}
              onShare={() => onCardShare?.(card.title)}
              onFavourite={() => onCardFavourite?.(card.title)}
              onDownload={() => onCardDownload?.(card.title)}
            />
          ))}
        </BrowseSection>
      ))}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProfilePage({
  user = MOCK_PROFILE,
  isOwnProfile = false,
  isFollowing = false,
  onBack,
  onOptions,
  onQrCode,
  onZap,
  onFollow,
  onEditProfile,
  onFollowingClick,
  onFollowersClick,
  onWebsiteClick,
  onShowAll,
  onCardClick,
  onCardPlay,
  onCardOptions,
  onCardShare,
  onCardFavourite,
  onCardDownload,
  onUnlock,
  onWishlistToggle,
  onComment,
  onShare,
  onLike,
  onBoost,
  className,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Activity")

  return (
    <div className={cx("flex flex-col", className)}>
      {/* ── Back arrow — its own row above the banner ───────────────────── */}
      <div className="flex items-center p-4 shrink-0">
        <IconButton
          icon={ArrowNarrowLeft}
          label="Go back"
          variant="ghost-primary"
          size="md"
          onClick={onBack}
        />
      </div>

      {/* ── Banner + avatar overlap ───────────────────────────────────────── */}
      {/*
       * The banner is `relative`. The avatar is absolutely positioned to
       * `bottom-0 translate-y-1/2` so exactly half of it (64 px) hangs
       * below the banner edge. The thick `border-app-bg` ring creates the
       * clean punch-out cut through both the banner and the identity section.
       */}
      <div className="relative shrink-0">
        {/* Cover image */}
        <div className="h-profile-banner w-full overflow-hidden bg-brand-700">
          {user.coverUrl && (
            <img
              src={user.coverUrl}
              alt=""
              aria-hidden="true"
              className="size-full object-cover"
            />
          )}
        </div>

        {/* Avatar — pinned to banner bottom, half hanging below */}
        <Avatar
          src={user.avatarUrl}
          name={user.name}
          size="2xl"
          className="absolute bottom-0 left-6 translate-y-1/2 z-10 border-[6px] border-app-bg"
        />
      </div>

      {/* ── Identity section ─────────────────────────────────────────────── */}
      <div className="bg-app-bg px-6 pb-0 shrink-0">
        {/*
         * Avatar zone — height matches the half of the avatar (64 px) that
         * hangs below the banner, plus a small gap. The action buttons sit
         * right-aligned inside this zone, vertically centred.
         */}
        <div className="flex items-center justify-end gap-2 min-h-[76px]">
          <IconButton
            icon={DotsHorizontal}
            label="More options"
            variant="card"
            size="lg"
            onClick={onOptions}
          />
          <IconButton
            icon={QrCode01}
            label="Show QR code"
            variant="card"
            size="lg"
            onClick={onQrCode}
          />
          <IconButton
            icon={Zap}
            label="Zap"
            variant="card"
            size="lg"
            onClick={onZap}
          />
          {isOwnProfile ? (
            <Button
              variant="secondary"
              size="sm"
              iconLeft={Edit01}
              onClick={onEditProfile}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onFollow}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* Name + handle + badge */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-display-md font-bold text-text-primary">
              {user.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-base text-text-tertiary leading-6">
                {user.handle}
              </span>
              {!isOwnProfile && user.followsYou && <FollowsYouBadge />}
            </div>
          </div>

          {/* Bio */}
          <p className="text-lg text-text-primary leading-7 max-w-xl">
            {user.bio}
          </p>

          {/* Meta row — joined, following, followers, website */}
          <div className="flex flex-col gap-px">
            <p className="text-base text-text-tertiary leading-6 py-1">
              Joined Nostr on {user.joinedDate}
            </p>
            <div className="flex items-center gap-2 flex-wrap py-1">
              {/* Following */}
              <button
                type="button"
                onClick={onFollowingClick}
                className="flex items-center gap-2 text-base cursor-pointer hover:underline focus-visible:outline-none">
                <span className="font-bold text-text-primary">
                  {fmt(user.following)}
                </span>
                <span className="text-text-tertiary">Following</span>
              </button>
              {/* Followers */}
              <button
                type="button"
                onClick={onFollowersClick}
                className="flex items-center gap-2 text-base cursor-pointer hover:underline focus-visible:outline-none">
                <span className="font-bold text-text-primary">
                  {fmt(user.followers)}
                </span>
                <span className="text-text-tertiary">Followers</span>
              </button>
              {/* Website */}
              {user.website && (
                <button
                  type="button"
                  onClick={onWebsiteClick}
                  className={cx(
                    "text-base text-utility-blue-500 cursor-pointer",
                    "hover:underline focus-visible:outline-none"
                  )}>
                  {user.website}
                </button>
              )}
            </div>

            {/* Mutual followers — only on else's profile */}
            {!isOwnProfile && user.mutualFollowers && (
              <MutualAvatarStack data={user.mutualFollowers} />
            )}
          </div>
        </div>
      </div>

      {/* ── Tab bar — sticky feel, no bottom padding yet ──────────────────── */}
      <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      {activeTab === "Activity" && (
        <div className="flex flex-col gap-4 p-6">
          {MOCK_ACTIVITY.map(card => (
            <ContentCard
              key={card.id}
              {...card}
              onUnlock={() => onUnlock?.(card.id)}
              onWishlist={() => onWishlistToggle?.(card.id)}
              onComment={() => onComment?.(card.id)}
              onShare={() => onShare?.(card.id)}
              onLike={() => onLike?.(card.id)}
              onBoost={() => onBoost?.(card.id)}
            />
          ))}
        </div>
      )}

      {activeTab === "Store" && (
        <BrowseTabContent
          sections={MOCK_STORE_SECTIONS}
          onShowAll={onShowAll}
          onCardClick={onCardClick}
          onCardPlay={onCardPlay}
          onCardOptions={onCardOptions}
          onCardShare={onCardShare}
          onCardFavourite={onCardFavourite}
          onCardDownload={onCardDownload}
        />
      )}

      {activeTab === "Wishlist" && (
        <BrowseTabContent
          sections={MOCK_WISHLIST_SECTIONS}
          onShowAll={onShowAll}
          onCardClick={onCardClick}
          onCardPlay={onCardPlay}
          onCardOptions={onCardOptions}
          onCardShare={onCardShare}
          onCardFavourite={onCardFavourite}
          onCardDownload={onCardDownload}
        />
      )}
    </div>
  )
}
