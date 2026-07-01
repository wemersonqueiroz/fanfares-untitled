import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type HeroTitleProps = {
  title: string
  /** Optional one-line subtitle underneath, typically a creator name. */
  subtitle?: string
  /**
   * Size of the title. `lg` is the standard content-page hero. `sm` is used
   * by notes (slightly smaller because note bodies follow immediately).
   * @default "lg"
   */
  size?: "sm" | "lg"
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Standardized hero title used on every content page (audiobook, podcast,
 * video, article, note). One source of truth for the heading scale so titles
 * stay consistent regardless of which page or column width.
 */
export function HeroTitle({
  title,
  subtitle,
  size = "lg",
  className,
}: HeroTitleProps) {
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <h1
        className={cx(
          "text-text-primary font-bold leading-tight tracking-tight break-words",
          size === "sm"
            ? "text-2xl sm:text-3xl"
            : "text-3xl sm:text-4xl"
        )}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-text-tertiary leading-6">{subtitle}</p>
      )}
    </div>
  )
}
