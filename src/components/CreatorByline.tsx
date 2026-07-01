import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"

// ── Public types ──────────────────────────────────────────────────────────────

export type CreatorBylineProps = {
  name: string
  /** Short identifier — e.g. "@handle" or an npub. */
  handle?: string
  /**
   * Extra metadata line under handle — e.g. published date, "7 hours ago",
   * "23 Jan 2023". Stacks below `handle` by default; with `inlineMeta`
   * appears inline next to it with a `·` separator.
   */
  meta?: string
  avatarUrl?: string
  /** Avatar size. Defaults to "md". */
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  /**
   * When true, renders `handle · meta` on a single line (used by comment
   * rows). Otherwise handle and meta stack vertically.
   */
  inlineMeta?: boolean
  /** Color of the name text. Defaults to "primary". */
  nameColor?: "primary" | "secondary"
  /** Font weight of the name. Defaults to "semibold". */
  nameWeight?: "semibold" | "bold"
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Standard creator identity block: circular avatar followed by stacked
 * name + handle (+ optional meta line). Used everywhere a content piece's
 * author is displayed — content page headers, content cards, comment rows.
 */
export function CreatorByline({
  name,
  handle,
  meta,
  avatarUrl,
  size = "md",
  inlineMeta = false,
  nameColor = "primary",
  nameWeight = "semibold",
  className,
}: CreatorBylineProps) {
  return (
    <div className={cx("flex items-center gap-3 min-w-0", className)}>
      <Avatar
        name={name}
        src={avatarUrl}
        size={size}
        className="border border-black/10 shrink-0"
      />
      <div className="flex flex-col min-w-0">
        <span
          className={cx(
            "text-sm truncate leading-5",
            nameWeight === "bold" ? "font-bold" : "font-semibold",
            nameColor === "secondary" ? "text-text-secondary" : "text-text-primary"
          )}>
          {name}
        </span>

        {inlineMeta ? (
          (handle || meta) && (
            <div className="flex items-center gap-1.5 min-w-0">
              {handle && (
                <span className="text-xs text-text-tertiary truncate min-w-0">
                  {handle}
                </span>
              )}
              {handle && meta && (
                <span className="text-xs text-text-tertiary shrink-0">·</span>
              )}
              {meta && (
                <span className="text-xs text-text-tertiary shrink-0 whitespace-nowrap">
                  {meta}
                </span>
              )}
            </div>
          )
        ) : (
          <>
            {handle && (
              <span className="text-xs text-text-tertiary truncate">{handle}</span>
            )}
            {meta && (
              <span className="text-xs text-text-tertiary whitespace-nowrap truncate">
                {meta}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
