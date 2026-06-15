"use client"

import {
  type ButtonHTMLAttributes,
  type ComponentType,
} from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

/**
 * `ghost`         — transparent bg, text-tertiary → hover:text-primary.
 *                   Use for options menus, close buttons, chevrons, downloads.
 *
 * `ghost-primary` — transparent bg, text-primary → hover:opacity-80.
 *                   Use for audio/video transport controls and nav back arrows.
 *
 * `card`          — app-card bg, rounded-full, hover:bg-app-card-active.
 *                   Use for toolbar action clusters (Profile ⋯ / QR / Zap row).
 */
export type IconButtonVariant = "ghost" | "ghost-primary" | "card"

/**
 * Controls the size of the button container.
 * The default icon size scales accordingly but can be overridden with `iconSize`.
 *
 * xs → 20 px  |  sm → 24 px  |  md → 32 px  |  lg → 40 px
 */
export type IconButtonSize = "xs" | "sm" | "md" | "lg"

export type IconButtonIconComponent = ComponentType<{
  size?: number
  color?: string
  "aria-hidden"?: boolean | "true" | "false"
}>

export type IconButtonProps = {
  /** The icon to render — any @untitledui/icons-compatible component */
  icon: IconButtonIconComponent
  /** Accessible label — rendered as aria-label on the button */
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  /** Override the rendered icon pixel size. Defaults to the size-appropriate value. */
  iconSize?: number
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

// ── Style maps ────────────────────────────────────────────────────────────────

const CONTAINER_SIZE: Record<IconButtonSize, string> = {
  xs: "size-5",
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
}

const DEFAULT_ICON_SIZE: Record<IconButtonSize, number> = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 20,
}

const VARIANT_STYLES: Record<IconButtonVariant, string> = {
  ghost: cx(
    "text-text-tertiary",
    "hover:text-text-primary transition-colors duration-150",
    "focus-visible:ring-brand-500/50"
  ),
  "ghost-primary": cx(
    "text-text-primary",
    "hover:opacity-80 transition-opacity duration-150",
    "focus-visible:ring-brand-500/50"
  ),
  card: cx(
    "bg-app-card text-text-primary rounded-full",
    "hover:bg-app-card-active transition-colors duration-150",
    "focus-visible:ring-brand-500/50"
  ),
}

// ── Component ─────────────────────────────────────────────────────────────────

export function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  size = "sm",
  iconSize,
  className,
  ...props
}: IconButtonProps) {
  const resolvedIconSize = iconSize ?? DEFAULT_ICON_SIZE[size]

  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={cx(
        "flex items-center justify-center shrink-0",
        "cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        CONTAINER_SIZE[size],
        VARIANT_STYLES[variant],
        className
      )}>
      <Icon size={resolvedIconSize} color="currentColor" aria-hidden="true" />
    </button>
  )
}
