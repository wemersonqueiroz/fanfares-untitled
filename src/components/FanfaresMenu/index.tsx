"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  BarChartSquare02,
  Bell01,
  BookOpen01,
  Box,
  ChevronSelectorVertical,
  Compass03,
  FileHeart02,
  HomeSmile,
  LogOut01,
  Rows01,
  Settings03,
  User01,
  UserCircle,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { CreatePostModal, type PostKind } from "@/components/CreatePostModal"
import type { FC, ReactNode, SVGProps } from "react"

// ─── Public types (export everything a consumer needs) ────────────────────────

export type FanfaresMenuUser = {
  name: string
  email: string
  /** Optional avatar URL. Falls back to initials when omitted. */
  avatarUrl?: string
}

export type FanfaresMenuProps = {
  /**
   * The href that should render as active.
   * In a Next.js app: pass `usePathname()` from the parent.
   */
  activeHref: string

  /** Authenticated user shown in the account card and dropdown header. */
  user: FanfaresMenuUser

  // ── Account dropdown callbacks ─────────────────────────────────────────────

  /** Fired when "View profile" is clicked in the account dropdown. */
  onViewProfile?: () => void

  /** Fired when "Settings" is clicked in the account dropdown. */
  onSettingsClick?: () => void

  /** Fired when "Log out" is clicked in the account dropdown. */
  onLogOut?: () => void

  // ── Post modal callbacks ───────────────────────────────────────────────────

  /** Fired when the user submits a post — receives kind + plain-text body. */
  onPublish?: (kind: PostKind, content: string) => void

  /** Fired when "Share & Earn" is clicked in the post-published screen. */
  onShareAndEarn?: () => void

  /** Fired when "View Your Note / Article / …" is clicked after publishing. */
  onViewPost?: () => void

  /** Fired when the image button in the compose toolbar is clicked. */
  onAddMedia?: () => void
}

// ─── Internal types ───────────────────────────────────────────────────────────

type IconComponent = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>

type NavItem = {
  label: string
  href: string
  Icon: IconComponent
}

// ─── Static nav structure ─────────────────────────────────────────────────────
// Items use Next.js <Link> for navigation.
// Active state is driven entirely by the `activeHref` prop from the parent.

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Activity",
    items: [
      { label: "Feed", href: "/feed", Icon: Rows01 },
      { label: "Explore", href: "/explore", Icon: Compass03 },
      { label: "Notifications", href: "/notifications", Icon: Bell01 },
    ],
  },
  {
    label: "My Fanfares",
    items: [
      { label: "Library", href: "/library", Icon: BookOpen01 },
      { label: "Profile", href: "/profile", Icon: User01 },
      { label: "Wishlist", href: "/wishlist", Icon: FileHeart02 },
      { label: "My Store", href: "/store", Icon: Box },
    ],
  },
  {
    label: "General",
    items: [
      { label: "Home", href: "/", Icon: HomeSmile },
      { label: "Settings", href: "/settings", Icon: Settings03 },
      { label: "Analytics", href: "/analytics", Icon: BarChartSquare02 },
    ],
  },
]

// ─── Internal sub-components (not exported — implementation details) ───────────

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { Icon, label, href } = item
  return (
    <Link
      href={href}
      className={cx(
        "flex items-center gap-3 py-2 px-3 my-0.5 rounded-md",
        "text-md font-semibold whitespace-nowrap",
        "transition-colors duration-150",
        isActive
          ? "bg-app-border text-text-primary"
          : "text-text-secondary hover:bg-app-border/60 hover:text-text-primary"
      )}>
      <Icon
        size={20}
        color="currentColor"
        className="shrink-0"
        aria-hidden="true"
      />
      {label}
    </Link>
  )
}

function NavSection({
  label,
  items,
  activeHref,
}: {
  label: string
  items: NavItem[]
  activeHref: string
}) {
  return (
    <div className="flex flex-col w-full">
      <div className="px-5 pb-1">
        <p className="text-xs font-bold uppercase text-text-tertiary">
          {label}
        </p>
      </div>
      <div className="flex flex-col w-full px-4 pb-5">
        {items.map(item => (
          <NavLink
            key={item.href}
            item={item}
            isActive={activeHref === item.href}
          />
        ))}
      </div>
    </div>
  )
}

function FanfaresLogo() {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cx(
          "flex items-center justify-center size-8 rounded-lg shrink-0",
          "bg-brand-600 border border-white/10",
          "shadow-[0px_1px_1px_-0.5px_rgba(10,13,18,0.13),0px_1px_3px_0px_rgba(10,13,18,0.10)]"
        )}
        aria-hidden="true">
        <span className="text-white text-sm font-bold leading-none select-none">
          F
        </span>
      </div>
      <span className="text-text-primary text-lg font-semibold tracking-tight">
        Fanfares
      </span>
    </div>
  )
}

// Avatar imported from @/components/Avatar

function AccountMenuButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cx(
        "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left",
        "text-sm font-medium text-text-secondary cursor-pointer select-none",
        "transition-colors duration-100",
        "hover:bg-app-border focus-visible:bg-app-border focus-visible:outline-none"
      )}>
      {children}
    </button>
  )
}

// ─── Account card ─────────────────────────────────────────────────────────────
// Open/close state is pure UI — it lives here intentionally.
// Business callbacks (onViewProfile, onSettingsClick, onLogOut) come from props.

function AccountCard({
  user,
  onViewProfile,
  onSettingsClick,
  onLogOut,
}: Pick<
  FanfaresMenuProps,
  "user" | "onViewProfile" | "onSettingsClick" | "onLogOut"
>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {/* ── Dropdown (renders above the trigger) ── */}
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className={cx(
            "absolute bottom-full left-0 right-0 mb-2 overflow-hidden",
            "bg-bg-primary border border-app-border rounded-xl",
            "shadow-[0px_-8px_32px_rgba(0,0,0,0.55),0px_0px_0px_1px_rgba(255,255,255,0.04)]",
            "animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out"
          )}>
          {/* User header — display only, not a button */}
          <div className="flex items-center gap-3 px-3.5 py-3 border-b border-app-border">
            <Avatar
              src={user.avatarUrl}
              name={user.name}
              size="sm"
              className="border border-black/10"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-text-primary truncate leading-snug">
                {user.name}
              </span>
              <span className="text-xs text-text-tertiary truncate leading-snug">
                {user.email}
              </span>
            </div>
          </div>

          {/* Regular actions */}
          <div className="p-1.5 flex flex-col gap-0.5">
            <AccountMenuButton
              onClick={() => {
                setOpen(false)
                onViewProfile?.()
              }}>
              <UserCircle
                size={16}
                color="currentColor"
                className="shrink-0"
                aria-hidden="true"
              />
              View profile
            </AccountMenuButton>

            <AccountMenuButton
              onClick={() => {
                setOpen(false)
                onSettingsClick?.()
              }}>
              <Settings03
                size={16}
                color="currentColor"
                className="shrink-0"
                aria-hidden="true"
              />
              Settings
            </AccountMenuButton>
          </div>

          {/* Separator */}
          <div className="mx-1.5 border-t border-app-border" />

          {/* Log out — destructive */}
          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                onLogOut?.()
              }}
              className={cx(
                "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left",
                "text-sm font-medium text-text-error-primary cursor-pointer select-none",
                "transition-colors duration-100",
                "hover:bg-red-500/[0.08] focus-visible:bg-red-500/[0.08] focus-visible:outline-none"
              )}>
              <span
                className="flex items-center justify-center size-badge-icon rounded-md bg-red-500/10 shrink-0"
                aria-hidden="true">
                <LogOut01 size={14} color="currentColor" />
              </span>
              Log out
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account options for ${user.name}`}
        className={cx(
          "w-full flex items-center gap-3 p-3 text-left",
          "bg-app-card border border-app-border rounded-xl",
          "transition-colors duration-150 cursor-pointer",
          open ? "bg-app-card-active" : "hover:bg-app-card-active",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-brand-500 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface"
        )}>
        <Avatar
          src={user.avatarUrl}
          name={user.name}
          size="md"
          className="border border-black/10"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold text-text-primary truncate">
            {user.name}
          </span>
          <span className="text-sm text-text-tertiary truncate">
            {user.email}
          </span>
        </div>
        <ChevronSelectorVertical
          size={16}
          color="var(--color-text-tertiary)"
          className={cx(
            "shrink-0 transition-transform duration-150",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

export function FanfaresMenu({
  activeHref,
  user,
  onViewProfile,
  onSettingsClick,
  onLogOut,
  onPublish,
  onShareAndEarn,
  onViewPost,
  onAddMedia,
}: FanfaresMenuProps) {
  const [postModalOpen, setPostModalOpen] = useState(false)

  return (
    <>
      <nav
        className="flex w-fanfares-menu h-full bg-bg-primary"
        aria-label="Fanfares sidebar navigation">
        <div
          className={cx(
            "flex flex-1 flex-col justify-between",
            "bg-bg-primary border border-app-border rounded-xl"
          )}>
          {/* ── Top: logo + nav ── */}
          <div className="flex flex-col gap-8 pt-5 overflow-y-auto scrollbar-hide">
            <div className="px-5 shrink-0">
              <FanfaresLogo />
            </div>

            <div className="flex flex-col">
              {SECTIONS.map(section => (
                <NavSection
                  key={section.label}
                  label={section.label}
                  items={section.items}
                  activeHref={activeHref}
                />
              ))}

              {/* Post CTA */}
              <div className="px-4 pb-5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setPostModalOpen(true)}
                  className="w-full rounded-lg">
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* ── Footer: account card ── */}
          <div className="px-4 pb-4 shrink-0">
            <AccountCard
              user={user}
              onViewProfile={onViewProfile}
              onSettingsClick={onSettingsClick}
              onLogOut={onLogOut}
            />
          </div>
        </div>
      </nav>

      <CreatePostModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        currentUser={{ avatarUrl: user.avatarUrl, name: user.name }}
        onPublish={onPublish}
        onShareAndEarn={onShareAndEarn}
        onViewPost={onViewPost}
        onAddMedia={onAddMedia}
      />
    </>
  )
}
