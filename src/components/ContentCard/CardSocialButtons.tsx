"use client"

import type { FC, SVGProps } from "react"
import { Heart, Lightning01, MessageTextSquare02, Share07 } from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type CardSocialButtonsProps = {
  comments: number
  shares: number
  likes: number
  boosts: number
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onBoost?: () => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

type IconComp = FC<SVGProps<SVGSVGElement> & { size?: number; color?: string }>

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

function SocialBtn({
  icon: Icon,
  count,
  label,
  onClick,
}: {
  icon: IconComp
  count: number
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} — ${count}`}
      className={cx(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
        "text-sm font-medium text-text-primary cursor-pointer",
        "transition-colors duration-150",
        "hover:bg-app-border focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}>
      <Icon size={18} color="currentColor" aria-hidden="true" />
      <span>{fmt(count)}</span>
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CardSocialButtons({
  comments,
  shares,
  likes,
  boosts,
  onComment,
  onShare,
  onLike,
  onBoost,
  className,
}: CardSocialButtonsProps) {
  return (
    <div className={cx("flex items-center gap-0.5", className)}>
      <SocialBtn icon={MessageTextSquare02} count={comments} label="Comments" onClick={onComment} />
      <SocialBtn icon={Share07} count={shares} label="Share" onClick={onShare} />
      <SocialBtn icon={Heart} count={likes} label="Like" onClick={onLike} />
      <SocialBtn icon={Lightning01} count={boosts} label="Boost" onClick={onBoost} />
    </div>
  )
}
