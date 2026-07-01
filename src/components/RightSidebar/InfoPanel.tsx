"use client"

import { useState } from "react"
import { ChevronUp } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"
import { Panel, PanelHeading } from "./internals"

// ── Public types ──────────────────────────────────────────────────────────────

export type SidebarInfoItem = {
  label: string
  value: string
}

export type InfoPanelProps = {
  items: SidebarInfoItem[]
  defaultOpen?: boolean
}

// ── Component ─────────────────────────────────────────────────────────────────

export function InfoPanel({ items, defaultOpen = true }: InfoPanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Panel className="shrink-0">
      <div className="flex items-center justify-between">
        <PanelHeading>Info</PanelHeading>
        <IconButton
          icon={ChevronUp}
          label={open ? "Collapse info" : "Expand info"}
          variant="ghost"
          size="xs"
          iconSize={20}
          onClick={() => setOpen(v => !v)}
          className={cx(
            "transform transition-transform duration-200",
            open ? "rotate-0" : "rotate-180"
          )}
        />
      </div>
      <div
        className={cx(
          "grid transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4">
            {items.map((item, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-base font-semibold text-text-secondary leading-6">
                  {item.label}
                </span>
                <span className="text-sm text-text-tertiary leading-5 truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}
