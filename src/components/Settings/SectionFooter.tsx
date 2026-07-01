"use client"

import { Button } from "@/components/Button"

// ── Public types ──────────────────────────────────────────────────────────────

export type SectionFooterProps = {
  onReset: () => void
  onCancel: () => void
  onSave: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

/** Reset / Cancel / Save button row shown at the bottom of editable settings sections. */
export function SectionFooter({ onReset, onCancel, onSave }: SectionFooterProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-4 border-t border-app-border shrink-0">
      <Button variant="tertiary" size="sm" onClick={onReset}>
        Reset
      </Button>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={onSave}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
