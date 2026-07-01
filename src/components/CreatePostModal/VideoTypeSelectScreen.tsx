"use client"

import { ArrowLeft, Film01, Tv01, XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"
import type { IconComponent } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

/** Whether a video is standalone or belongs to a show series. */
export type VideoMode = "single" | "show"

export type VideoTypeSelectScreenProps = {
  onClose: () => void
  onBack: () => void
  onSelect: (mode: VideoMode) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VideoTypeSelectScreen({
  onClose,
  onBack,
  onSelect,
}: VideoTypeSelectScreenProps) {
  const options: Array<{
    mode: VideoMode
    icon: IconComponent
    label: string
    description: string
  }> = [
    {
      mode: "single",
      icon: Film01,
      label: "Single Video",
      description: "Upload a standalone video — great for one-off releases or clips.",
    },
    {
      mode: "show",
      icon: Tv01,
      label: "Part of a Show",
      description: "Create a video series with seasons and episodes.",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-list-item text-text-primary">Create New Video</h2>
          <p className="text-body-small text-text-tertiary">
            Is this a standalone video or part of a show?
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton icon={ArrowLeft} label="Back" variant="ghost" size="sm" iconSize={20} onClick={onBack} />
          <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(({ mode, icon: Icon, label, description }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSelect(mode)}
            className={cx(
              "flex sm:flex-col items-center sm:items-start gap-3 p-4 rounded-xl text-left w-full",
              "border border-app-border bg-app-card",
              "cursor-pointer hover:bg-app-card-active hover:border-app-border-hover transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface"
            )}>
            <div className="flex items-center justify-center size-10 rounded-xl shrink-0 bg-brand-600/10">
              <Icon size={20} color="var(--color-brand-600)" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 sm:flex-none min-w-0">
              <span className="text-heading-card text-text-primary">{label}</span>
              <span className="text-body-small text-text-tertiary leading-5">{description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
