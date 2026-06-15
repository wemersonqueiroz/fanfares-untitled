"use client"

import { Check } from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type StepperStep = {
  label: string
}

export type ProgressStepperProps = {
  steps: StepperStep[]
  /** 0-indexed active step */
  activeStep: number
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProgressStepper({ steps, activeStep, className }: ProgressStepperProps) {
  return (
    <div className={cx("flex items-center w-full", className)}>
      {steps.map((step, i) => {
        const isCompleted = i < activeStep
        const isActive = i === activeStep

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={cx(
                  "flex items-center justify-center size-8 rounded-full shrink-0 transition-colors duration-150",
                  isCompleted
                    ? "bg-utility-green-600 border-2 border-utility-green-600"
                    : isActive
                      ? "bg-brand-600 border-2 border-brand-600"
                      : "bg-transparent border-2 border-app-border"
                )}>
                {isCompleted ? (
                  <Check size={16} color="white" aria-hidden="true" />
                ) : (
                  <span
                    className={cx(
                      "text-xs font-semibold",
                      isActive ? "text-white" : "text-text-tertiary"
                    )}>
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Label — hidden on mobile, visible sm+ */}
              <span
                className={cx(
                  "hidden sm:block text-xs font-medium whitespace-nowrap",
                  isCompleted
                    ? "text-utility-green-600"
                    : isActive
                      ? "text-brand-500"
                      : "text-text-tertiary"
                )}>
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {i < steps.length - 1 && (
              <div
                className={cx(
                  "flex-1 h-px mx-2 mb-5",
                  "border-t-2 border-dashed",
                  i < activeStep ? "border-utility-green-600" : "border-app-border"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
