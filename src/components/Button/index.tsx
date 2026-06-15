"use client"

import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type ComponentType,
} from "react"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive"
export type ButtonSize = "sm" | "md" | "lg"

/**
 * Shape accepted by @untitledui/icons and compatible icon libraries.
 * `aria-hidden` matches React's `Booleanish` (boolean | "true" | "false").
 */
export type ButtonIconComponent = ComponentType<{
  size?: number
  color?: string
  "aria-hidden"?: boolean | "true" | "false"
}>

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Icon rendered to the left of the label */
  iconLeft?: ButtonIconComponent
  /** Icon rendered to the right of the label */
  iconRight?: ButtonIconComponent
  /** Shows a spinner and disables the button */
  isLoading?: boolean
  children: ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

// ── Style maps ────────────────────────────────────────────────────────────────

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm gap-1.5 rounded-md",
  md: "px-4 py-2.5 text-base gap-1.5 rounded-md",
  lg: "px-5 py-3 text-base gap-2 rounded-md",
}

const ICON_SIZE: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 16,
}

/** Skeuomorphic inner shadow shared by primary / secondary / destructive */
const SKEU =
  "shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]"

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: cx(
    "bg-brand-600 border-2 border-white/10 text-white",
    "hover:bg-brand-700",
    SKEU,
    "focus-visible:ring-brand-500/50"
  ),
  secondary: cx(
    "bg-app-bg border border-app-border text-text-secondary",
    "hover:bg-app-card",
    SKEU,
    "focus-visible:ring-brand-500/50"
  ),
  tertiary: cx(
    "bg-transparent text-text-primary",
    "hover:text-text-secondary",
    "focus-visible:ring-brand-500/50"
  ),
  destructive: cx(
    "bg-red-600 border-2 border-white/10 text-white",
    "hover:bg-red-700",
    SKEU,
    "focus-visible:ring-red-500/50"
  ),
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Button({
  variant = "secondary",
  size = "sm",
  iconLeft: IconLeft,
  iconRight: IconRight,
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const iconSize = ICON_SIZE[size]
  const isDisabled = disabled || isLoading

  return (
    <button
      type="button"
      disabled={isDisabled}
      {...props}
      className={cx(
        "inline-flex items-center justify-center shrink-0",
        "font-semibold cursor-pointer transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        SIZE_STYLES[size],
        VARIANT_STYLES[variant],
        className
      )}>
      {isLoading ? (
        /* Spinner — inherits current text color */
        <span
          className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      ) : (
        IconLeft && (
          <IconLeft size={iconSize} color="currentColor" aria-hidden="true" />
        )
      )}
      {children}
      {!isLoading && IconRight && (
        <IconRight size={iconSize} color="currentColor" aria-hidden="true" />
      )}
    </button>
  )
}
