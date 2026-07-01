"use client"

import { RoutePageTitle } from "@/components/RoutePageTitle"

// ── Public types ──────────────────────────────────────────────────────────────

export type PlaceholderSectionProps = {
  title: string
  onBack: () => void
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Settings01Icon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-quaternary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

/** "Coming soon" panel rendered for settings sections that aren't built yet. */
export function PlaceholderSection({ title, onBack }: PlaceholderSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <RoutePageTitle title={title} onBack={onBack} />
      <div className="w-full bg-app-card border border-app-border rounded-xl py-16 flex flex-col items-center gap-3 text-center">
        <div className="size-12 rounded-full bg-app-surface flex items-center justify-center">
          <Settings01Icon />
        </div>
        <p className="text-sm font-medium text-text-secondary">{title} settings coming soon</p>
        <p className="text-xs text-text-tertiary max-w-xs">
          This section is under development and will be available in a future update.
        </p>
      </div>
    </div>
  )
}
