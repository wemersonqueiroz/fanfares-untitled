"use client"

import {
  Heart,
  Lightning01,
  MessageTextSquare02,
  Share07,
} from "@untitledui/icons"
import { fmtCount } from "@/utils/fmtCount"

// ── Public types ──────────────────────────────────────────────────────────────

export type RightSidebarSocial = {
  comments: number
  shares: number
  likes: number
  zaps: number
}

export type SocialFooterProps = {
  social: RightSidebarSocial
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onZap?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SocialFooter({
  social,
  onComment,
  onShare,
  onLike,
  onZap,
}: SocialFooterProps) {
  return (
    <div className="shrink-0 border-t border-app-border px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onComment}
          aria-label={`Comments — ${social.comments}`}
          className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
          <MessageTextSquare02 size={24} color="currentColor" aria-hidden="true" />
          <span className="text-base font-medium">{fmtCount(social.comments)}</span>
        </button>
        <button
          type="button"
          onClick={onShare}
          aria-label={`Share — ${social.shares}`}
          className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
          <Share07 size={24} color="currentColor" aria-hidden="true" />
          <span className="text-base font-medium">{fmtCount(social.shares)}</span>
        </button>
        <button
          type="button"
          onClick={onLike}
          aria-label={`Like — ${social.likes}`}
          className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
          <Heart size={24} color="currentColor" aria-hidden="true" />
          <span className="text-base font-medium">{fmtCount(social.likes)}</span>
        </button>
        <button
          type="button"
          onClick={onZap}
          aria-label={`Zap — ${social.zaps}`}
          className="flex items-center gap-2 cursor-pointer text-text-primary hover:opacity-80 transition-opacity focus-visible:outline-none">
          <Lightning01 size={24} color="currentColor" aria-hidden="true" />
          <span className="text-base font-medium">{fmtCount(social.zaps)}</span>
        </button>
      </div>
    </div>
  )
}
