"use client"

import { useState } from "react"
import { cx } from "@/utils/cx"
import { HeroTitle } from "@/components/HeroTitle"
import { ContentPage } from "./index"
import type { ContentPageProps } from "./index"

// ── Public types ──────────────────────────────────────────────────────────────

export type NotePageProps = Omit<
  ContentPageProps,
  | "contentType"
  | "coverUrl" // notes don't have a cover image
  | "topContent" // controlled internally
  | "showChaptersTab" // notes never have chapters
> & {
  /** Full note body text — shown in the top section with expand/collapse */
  noteBody: string
  /** Number of lines shown before "Read More" (default: 4) */
  previewLines?: number
}

// ── Note body internals ───────────────────────────────────────────────────────

/**
 * Expandable note body — collapses long text behind a "Read More" toggle.
 * Clamp is done via CSS `line-clamp-*` so it's purely presentational.
 */
function NoteBody({
  body,
  previewLines = 4,
}: {
  body: string
  previewLines?: number
}) {
  const [expanded, setExpanded] = useState(false)

  // line-clamp utilities — Tailwind generates these when the class strings are static
  const clampClass =
    previewLines === 3
      ? "line-clamp-3"
      : previewLines === 4
        ? "line-clamp-4"
        : previewLines === 5
          ? "line-clamp-5"
          : previewLines === 6
            ? "line-clamp-6"
            : "line-clamp-4"

  return (
    <div className="flex flex-col gap-3">
      <p
        className={cx(
          "text-base text-text-primary leading-[1.65] whitespace-pre-wrap",
          !expanded && clampClass
        )}>
        {body}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className={cx(
          "text-sm font-semibold text-brand-500",
          "hover:text-brand-600 transition-colors duration-150",
          "w-fit cursor-pointer focus-visible:outline-none",
          "focus-visible:underline"
        )}>
        {expanded ? "Show less" : "Read More"}
      </button>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotePage({
  noteBody,
  previewLines,
  activeTab = "comments",
  description,
  title,
  ...rest
}: NotePageProps) {
  return (
    <ContentPage
      {...rest}
      contentType="note"
      title={title}
      description={description ?? noteBody}
      activeTab={activeTab}
      showChaptersTab={false}
      chapters={[]}
      topContent={
        <div className="flex flex-col gap-3">
          {title && <HeroTitle title={title} size="sm" />}
          <NoteBody body={noteBody} previewLines={previewLines} />
        </div>
      }
    />
  )
}
