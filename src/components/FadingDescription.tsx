import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type FadingDescriptionProps = {
  text: string
  /**
   * Tailwind class controlling the max-height of the clip area, e.g.
   * `"h-content-blurb"` (audiobook hero) or `"h-chapter-list"` (video hero).
   * Defaults to "h-content-blurb".
   */
  maxHeightClass?: string
  /**
   * Tailwind class controlling the gradient overlay height. Defaults to "h-16".
   */
  fadeHeightClass?: string
  /**
   * CSS color used as the end-stop of the gradient — should match the surface
   * the description sits on. Defaults to `var(--color-bg-primary)`.
   */
  fadeColor?: string
  className?: string
  textClassName?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Description text clipped to a max height with a bottom gradient that fades
 * out to the surface color. Used in content-page top sections so long
 * descriptions don't overflow.
 */
export function FadingDescription({
  text,
  maxHeightClass = "h-content-blurb",
  fadeHeightClass = "h-16",
  fadeColor = "var(--color-bg-primary)",
  className,
  textClassName,
}: FadingDescriptionProps) {
  return (
    <div className={cx("relative overflow-hidden", maxHeightClass, className)}>
      <p
        className={cx(
          "text-base font-medium text-text-primary leading-normal whitespace-pre-wrap pr-2",
          textClassName
        )}>
        {text}
      </p>
      <div
        className={cx(
          "absolute bottom-0 left-0 right-0 pointer-events-none",
          fadeHeightClass
        )}
        style={{
          background: `linear-gradient(to bottom, transparent, ${fadeColor})`,
        }}
      />
    </div>
  )
}
