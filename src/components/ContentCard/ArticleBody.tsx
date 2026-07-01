"use client"

import { Lock02 } from "@untitledui/icons"
import { cx } from "@/utils/cx"

export type ArticleBodyProps = {
  type: "article" | "note"
  excerpt: string
  isLocked: boolean
}

/** Body for `content.type === "article" | "note"` — excerpt panel with optional lock fade. */
export function ArticleBody({ excerpt, isLocked }: ArticleBodyProps) {
  return (
    <div
      className={cx(
        "relative rounded-xl overflow-hidden p-4",
        "bg-app-card border border-app-border"
      )}>
      <p
        className={cx(
          "text-sm leading-relaxed",
          isLocked
            ? "line-clamp-2 text-text-tertiary"
            : "line-clamp-5 text-text-secondary"
        )}>
        {excerpt}
      </p>
      {isLocked && (
        <div className="absolute inset-x-0 bottom-0 h-12 flex items-end px-4 pb-3 bg-linear-to-t from-app-bg to-transparent">
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Lock02 size={11} color="currentColor" aria-hidden="true" />
            Unlock to read
          </div>
        </div>
      )}
    </div>
  )
}
