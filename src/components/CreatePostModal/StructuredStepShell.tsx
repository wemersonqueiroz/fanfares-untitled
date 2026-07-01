"use client"

import type { ReactNode } from "react"
import { ArrowLeft, XClose } from "@untitledui/icons"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { ProgressStepper, type StepperStep } from "./ProgressStepper"
import type { IconComponent } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type StructuredStepShellProps = {
  title: string
  subtitle?: string
  /** Overrides the default 4-step stepper. */
  steps?: StepperStep[]
  activeStep: number
  onClose: () => void
  onBack?: () => void
  onNext: () => void
  nextLabel: string
  nextIcon?: IconComponent
  children: ReactNode
}

// ── Stepper presets ──────────────────────────────────────────────────────────

export const STRUCTURED_STEPS: StepperStep[] = [
  { label: "Setup" },
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

export const ARTICLE_STEPS: StepperStep[] = [
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

export const VIDEO_SINGLE_STEPS: StepperStep[] = [
  { label: "Setup" },
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

export const VIDEO_SHOW_STEPS: StepperStep[] = [
  { label: "Show Info" },
  { label: "Upload" },
  { label: "Monetisation" },
  { label: "Publish" },
]

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Shared chrome for structured-flow steps: title bar, stepper, scrollable body,
 * Back/Next footer. Used by Audiobook/Book, Podcast, Video, Show, Article flows.
 */
export function StructuredStepShell({
  title,
  subtitle,
  steps = STRUCTURED_STEPS,
  activeStep,
  onClose,
  onBack,
  onNext,
  nextLabel,
  nextIcon,
  children,
}: StructuredStepShellProps) {
  return (
    <div className="flex flex-col gap-5 max-h-[80vh]">
      <div className="flex items-start justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-list-item text-text-primary">{title}</h2>
          {subtitle && <p className="text-body-small text-text-tertiary">{subtitle}</p>}
        </div>
        <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
      </div>

      <ProgressStepper steps={steps} activeStep={activeStep} className="shrink-0" />

      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-1 -mx-1">
        {children}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-app-border shrink-0">
        {onBack ? (
          <Button variant="secondary" size="md" iconLeft={ArrowLeft} onClick={onBack} className="w-full sm:w-auto">
            Back
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}
        <Button variant="primary" size="md" iconRight={nextIcon} onClick={onNext} className="w-full sm:w-auto">
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}
