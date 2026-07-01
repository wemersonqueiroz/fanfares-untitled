"use client"

import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { FollowBtn, Panel, PanelHeading } from "./internals"

// ── Public types ──────────────────────────────────────────────────────────────

export type SidebarCreator = {
  /** Role label — e.g. "Artist", "Narrator", "Composer" */
  role: string
  name: string
  avatarUrl?: string
  isFollowing?: boolean
}

export type CreatorsPanelProps = {
  creators: SidebarCreator[]
  /** When true, render the role label in bold (matches video/podcast variants). */
  boldRole?: boolean
  onFollow?: (creatorName: string) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CreatorsPanel({ creators, boldRole, onFollow }: CreatorsPanelProps) {
  return (
    <Panel className="shrink-0">
      <PanelHeading>Creators</PanelHeading>
      <div className="flex flex-col gap-4">
        {creators.map((c, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                name={c.name}
                src={c.avatarUrl}
                size="md"
                className="border border-black/10"
              />
              <div className="flex flex-col min-w-0">
                <span
                  className={cx(
                    "text-sm text-text-secondary truncate",
                    boldRole ? "font-bold" : "font-normal"
                  )}>
                  {c.role}
                </span>
                <span className="text-sm text-text-tertiary truncate">
                  {c.name}
                </span>
              </div>
            </div>
            <FollowBtn onClick={() => onFollow?.(c.name)} />
          </div>
        ))}
      </div>
    </Panel>
  )
}
