"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Rows01,
  Compass03,
  BookOpen01,
  User01,
  Edit05,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { CreatePostModal, type PostKind } from "@/components/CreatePostModal"

// ── Types ─────────────────────────────────────────────────────────────────────

export type MobileBottomNavProps = {
  activeHref: string
  className?: string
  /** Current user for the compose modal. */
  currentUser?: { avatarUrl?: string; name?: string }
  /** Fired when the user submits a post — receives kind + plain-text body. */
  onPublish?: (kind: PostKind, content: string) => void
  /** Fired when "Share & Earn" is clicked after publishing. */
  onShareAndEarn?: () => void
  /** Fired when "View Your Note / …" is clicked after publishing. */
  onViewPost?: () => void
  /** Fired when the image button in the compose toolbar is clicked. */
  onAddMedia?: () => void
}

// ── Nav tabs ──────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { label: "Feed",    href: "/feed",    Icon: Rows01 },
  { label: "Explore", href: "/explore", Icon: Compass03 },
  { label: "Library", href: "/library", Icon: BookOpen01 },
  { label: "Profile", href: "/profile", Icon: User01 },
] as const

// ── Component ─────────────────────────────────────────────────────────────────

export function MobileBottomNav({
  activeHref,
  className,
  currentUser,
  onPublish,
  onShareAndEarn,
  onViewPost,
  onAddMedia,
}: MobileBottomNavProps) {
  const [postModalOpen, setPostModalOpen] = useState(false)

  return (
    <>
      <nav
        className={cx(
          "flex items-center justify-around",
          "h-mobile-nav w-full shrink-0 px-1",
          "bg-app-surface border-t border-app-border",
          /* Safe-area padding for iPhone home indicator */
          "pb-[env(safe-area-inset-bottom,0px)]",
          className
        )}
        aria-label="Mobile navigation">

        {/* Regular tabs */}
        {NAV_TABS.map(({ label, href, Icon }) => {
          const isActive = activeHref === href
          return (
            <Link
              key={href}
              href={href}
              className={cx(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-md",
                "transition-colors duration-150",
                isActive
                  ? "text-brand-500"
                  : "text-text-tertiary hover:text-text-primary"
              )}>
              <Icon size={22} color="currentColor" aria-hidden="true" />
              <span className="text-2xs font-medium leading-none">{label}</span>
            </Link>
          )
        })}

        {/* Post button — branded pill */}
        <button
          type="button"
          onClick={() => setPostModalOpen(true)}
          aria-label="Create post"
          className={cx(
            "flex flex-col items-center justify-center gap-0.5 flex-1 py-2",
            "text-text-tertiary hover:text-text-primary transition-colors"
          )}>
          <div className={cx(
            "flex items-center justify-center size-8 rounded-full shrink-0",
            "bg-brand-600 hover:bg-brand-700 transition-colors cursor-pointer"
          )}>
            <Edit05 size={15} color="white" aria-hidden="true" />
          </div>
          <span className="text-2xs font-medium leading-none text-text-tertiary">Post</span>
        </button>
      </nav>

      <CreatePostModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        currentUser={currentUser}
        onPublish={onPublish}
        onShareAndEarn={onShareAndEarn}
        onViewPost={onViewPost}
        onAddMedia={onAddMedia}
      />
    </>
  )
}
