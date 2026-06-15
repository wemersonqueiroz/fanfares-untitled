"use client"

import { ArrowLeft, Send01, XClose } from "@untitledui/icons"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { ProgressStepper, type StepperStep } from "./ProgressStepper"
import { PriceSplits, type PaymentSplit } from "./PriceSplits"

// ── Public types ──────────────────────────────────────────────────────────────

export type MonetisationState = {
  priceSats: number
  splits: PaymentSplit[]
  hasReferrer: boolean
  referrerNpub: string
  referrerPercent: number
}

export function defaultMonetisationState(): MonetisationState {
  return {
    priceSats: 0,
    splits: [],
    hasReferrer: false,
    referrerNpub: "",
    referrerPercent: 2,
  }
}

export type MonetisationStepProps = {
  /** Label for the kind being created, e.g. "Podcast" */
  kindLabel: string
  /**
   * "structured" — renders inside the progress shell with stepper.
   * "simple"     — standalone card layout with no stepper.
   */
  flow: "simple" | "structured"
  state: MonetisationState
  onChange: (state: MonetisationState) => void
  onClose: () => void
  onBack: () => void
  onPublish: () => void
  /**
   * Override the stepper steps shown in "structured" mode.
   * Defaults to the 4-step Setup / Content / Monetisation / Publish flow.
   */
  steps?: StepperStep[]
  /**
   * 0-indexed position of the Monetisation step in the provided `steps` array.
   * Defaults to 2 (third step in the 4-step default).
   */
  monetisationStepIndex?: number
}

// ── Internals ─────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Setup" },
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function MonetisationStep({
  kindLabel,
  flow,
  state,
  onChange,
  onClose,
  onBack,
  onPublish,
  steps = STEPS,
  monetisationStepIndex = 2,
}: MonetisationStepProps) {
  const form = (
    <PriceSplits
      priceSats={state.priceSats}
      splits={state.splits}
      hasReferrer={state.hasReferrer}
      referrerNpub={state.referrerNpub}
      referrerPercent={state.referrerPercent}
      onPriceChange={priceSats => onChange({ ...state, priceSats })}
      onSplitsChange={splits => onChange({ ...state, splits })}
      onReferrerToggle={hasReferrer => onChange({ ...state, hasReferrer })}
      onReferrerNpubChange={referrerNpub => onChange({ ...state, referrerNpub })}
      onReferrerPercentChange={referrerPercent => onChange({ ...state, referrerPercent })}
    />
  )

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-app-border shrink-0">
      <Button variant="secondary" size="md" iconLeft={ArrowLeft} onClick={onBack} className="w-full sm:w-auto">
        Back
      </Button>
      <Button variant="primary" size="md" iconRight={Send01} onClick={onPublish} className="w-full sm:w-auto">
        Publish
      </Button>
    </div>
  )

  // ── Structured: inside 4-step shell ───────────────────────────────────────
  if (flow === "structured") {
    return (
      <div className="flex flex-col gap-5 max-h-[80vh]">
        {/* Header */}
        <div className="flex items-start justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-heading-list-item text-text-primary">
              Create New {kindLabel}
            </h2>
            <p className="text-body-small text-text-tertiary">
              Set a price and configure payment splits.
            </p>
          </div>
          <IconButton
            icon={XClose}
            label="Close"
            variant="ghost"
            size="sm"
            iconSize={24}
            onClick={onClose}
          />
        </div>

        {/* Stepper */}
        <ProgressStepper steps={steps} activeStep={monetisationStepIndex} className="shrink-0" />

        {/* Scrollable form — px-1 -mx-1 gives focus rings room without clipping */}
        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-1 -mx-1">
          {form}
        </div>

        {footer}
      </div>
    )
  }

  // ── Simple: standalone card layout ────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-list-item text-text-primary">
            Price &amp; Payment Splits
          </h2>
          <p className="text-body-small text-text-tertiary">
            Set a price and configure how payments are distributed.
          </p>
        </div>
        <IconButton
          icon={XClose}
          label="Close"
          variant="ghost"
          size="sm"
          iconSize={24}
          onClick={onClose}
        />
      </div>

      {form}

      {footer}
    </div>
  )
}
