"use client"

import { useState } from "react"
import type { FC, SVGProps } from "react"
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
} from "@/mocks/profile"

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
  /** Fires when the profile-header zap button is clicked (zaps this profile's owner). */
  onZapProfile?: () => void
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
  onZap?: (id: string) => void
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

/**
 * 32 × 32 frosted-glass circular button overlaid on the mobile banner.
 * Used for the back arrow + action icons that sit on top of the cover image.
 */
function BannerIconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: FC<SVGProps<SVGSVGElement> & { size?: number; color?: string }>
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx(
        "flex items-center justify-center size-8 rounded-full shrink-0 cursor-pointer",
        "bg-app-bg/50 backdrop-blur-sm",
        "hover:bg-app-bg/65 transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      )}>
      <Icon size={16} color="white" aria-hidden="true" />
    </button>
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
    <div className="py-4 bg-app-bg border-t border-app-border shrink-0">
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
    <div className="flex flex-col gap-14 py-6 sm:px-6">
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
  onZapProfile,
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
  onZap,
  className,
}: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("Activity")

  return (
    <div className={cx("flex flex-col", className)}>
      {/* ── Desktop-only back arrow row — sits above the banner ─────────── */}
      <div className="hidden sm:flex items-center p-4 shrink-0">
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
       * On mobile the back arrow + action icons overlay the banner with a
       * frosted-glass treatment; on desktop they sit in dedicated rows
       * above/below. The avatar `translate-y-1/2` overhang scales with its
       * own size: 32 px on mobile (size-16) and 64 px on desktop (size-32).
       *
       * `-mx-3 -mt-4 sm:mx-0 sm:mt-0` cancels the page wrapper's `py-4 px-3`
       * so the banner reaches edge-to-edge on mobile while the body content
       * keeps its own padding.
       */}
      <div className="relative shrink-0 -mx-3 -mt-4 sm:mx-0 sm:mt-0">
        {/* Cover image */}
        <div className="h-[102px] sm:h-profile-banner w-full overflow-hidden bg-brand-700">
          {user.coverUrl && (
            <img
              src={user.coverUrl}
              alt=""
              aria-hidden="true"
              className="size-full object-cover"
            />
          )}
        </div>

        {/* Mobile-only overlay — back arrow + action icons inside the banner */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-4 sm:hidden">
          <BannerIconButton
            icon={ArrowNarrowLeft}
            label="Go back"
            onClick={onBack}
          />
          <div className="flex items-center gap-2">
            <BannerIconButton
              icon={QrCode01}
              label="Show QR code"
              onClick={onQrCode}
            />
            <BannerIconButton icon={Zap} label="Zap" onClick={onZapProfile} />
            {isOwnProfile && (
              <BannerIconButton
                icon={Edit01}
                label="Edit profile"
                onClick={onEditProfile}
              />
            )}
            <BannerIconButton
              icon={DotsHorizontal}
              label="More options"
              onClick={onOptions}
            />
          </div>
        </div>

        {/* Avatar — pinned to banner bottom, half hanging below */}
        <Avatar
          src={user.avatarUrl}
          name={user.name}
          size="2xl"
          className={cx(
            "absolute bottom-0 left-4 sm:left-6 translate-y-1/2 z-10",
            "size-16 sm:size-32 border-4 sm:border-[6px] border-app-bg"
          )}
        />
      </div>

      {/* ── Identity section ─────────────────────────────────────────────── */}
      <div className="bg-app-bg pb-0 shrink-0 px-0">
        {/*
         * Avatar zone — height matches the half of the avatar that hangs
         * below the banner (32 px mobile, 64 px desktop) plus breathing room.
         * Desktop fills the row with action icons + Follow/Edit; mobile only
         * shows the Follow button for else's profile (action icons live in
         * the banner overlay above).
         */}
        <div className="flex items-center justify-end gap-2 min-h-12 sm:min-h-19">
          {/* Desktop action button row */}
          <div className="hidden sm:flex items-center gap-2">
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
              onClick={onZapProfile}
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
          {/* Mobile Follow button — only shown when viewing someone else's profile */}
          {!isOwnProfile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onFollow}
              className="sm:hidden">
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* Name + handle + badge */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-display-sm sm:text-display-md font-bold text-text-primary">
              {user.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base text-text-tertiary leading-6">
                {user.handle}
              </span>
              {!isOwnProfile && user.followsYou && <FollowsYouBadge />}
            </div>
          </div>

          {/* Bio */}
          <p className="text-base sm:text-lg text-text-primary leading-6 sm:leading-7 max-w-xl">
            {user.bio}
          </p>

          {/* Meta row — joined, following, followers, website */}
          <div className="flex flex-col gap-px">
            {/* Joined date — website joins this row on mobile */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0 py-1">
              <p className="text-sm sm:text-base text-text-tertiary leading-6">
                Joined Nostr on {user.joinedDate}
              </p>
              {user.website && (
                <button
                  type="button"
                  onClick={onWebsiteClick}
                  className="sm:hidden text-sm text-utility-blue-500 cursor-pointer hover:underline focus-visible:outline-none">
                  {user.website}
                </button>
              )}
            </div>
            {/* Stats — website joins this row on desktop */}
            <div className="flex items-center gap-2 flex-wrap py-1">
              <button
                type="button"
                onClick={onFollowingClick}
                className="flex items-center gap-2 text-sm sm:text-base cursor-pointer hover:underline focus-visible:outline-none">
                <span className="font-bold text-text-primary">
                  {fmt(user.following)}
                </span>
                <span className="text-text-tertiary">Following</span>
              </button>
              <button
                type="button"
                onClick={onFollowersClick}
                className="flex items-center gap-2 text-sm sm:text-base cursor-pointer hover:underline focus-visible:outline-none">
                <span className="font-bold text-text-primary">
                  {fmt(user.followers)}
                </span>
                <span className="text-text-tertiary">Followers</span>
              </button>
              {user.website && (
                <button
                  type="button"
                  onClick={onWebsiteClick}
                  className={cx(
                    "hidden sm:inline text-base text-utility-blue-500 cursor-pointer",
                    "hover:underline focus-visible:outline-none"
                  )}>
                  {user.website}
                </button>
              )}
            </div>

            {/* Mutual followers — only on else's profile, desktop only */}
            {!isOwnProfile && user.mutualFollowers && (
              <div className="hidden sm:block">
                <MutualAvatarStack data={user.mutualFollowers} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab bar — sticky feel, no bottom padding yet ──────────────────── */}
      <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      {activeTab === "Activity" && (
        <div className="flex flex-col gap-4">
          {MOCK_ACTIVITY.map(card => (
            <ContentCard
              key={card.id}
              {...card}
              onUnlock={() => onUnlock?.(card.id)}
              onWishlist={() => onWishlistToggle?.(card.id)}
              onComment={() => onComment?.(card.id)}
              onShare={() => onShare?.(card.id)}
              onLike={() => onLike?.(card.id)}
              onZap={() => onZap?.(card.id)}
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
