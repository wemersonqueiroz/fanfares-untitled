"use client"

import { useState } from "react"
import { cx } from "@/utils/cx"
import { Toggle } from "@/components/Compose"
import { RoutePageTitle } from "@/components/RoutePageTitle"
import { SectionFooter } from "./SectionFooter"

// ── Public types ──────────────────────────────────────────────────────────────

export type CommentsLevel = "none" | "mentions" | "all"
export type RemindersLevel = "none" | "important" | "all"
export type ActivityLevel = "all" | "none"

export type NotificationsValues = {
  newsAndUpdates: boolean
  userActivity: boolean
  commentsLevel: CommentsLevel
  remindersLevel: RemindersLevel
  activityLevel: ActivityLevel
}

export type NotificationsSectionProps = {
  onBack: () => void
  onSave: (v: NotificationsValues) => void
  onReset: () => void
  onCancel: () => void
}

// ── Defaults ──────────────────────────────────────────────────────────────────

function defaultNotificationsValues(): NotificationsValues {
  return {
    newsAndUpdates: true,
    userActivity: true,
    commentsLevel: "mentions",
    remindersLevel: "important",
    activityLevel: "all",
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RadioItem({
  name,
  value,
  checked,
  label,
  description,
  onChange,
}: {
  name: string
  value: string
  checked: boolean
  label: string
  description?: string
  onChange: () => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={cx(
            "size-4 rounded-full border-2 transition-colors duration-150",
            "group-hover:border-brand-500",
            checked ? "border-brand-600" : "border-app-border"
          )}>
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-2 rounded-full bg-brand-600" />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <span className="text-xs text-text-tertiary">{description}</span>
        )}
      </div>
    </label>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NotificationsSection({
  onBack,
  onSave,
  onReset,
  onCancel,
}: NotificationsSectionProps) {
  const [values, setValues] = useState<NotificationsValues>(defaultNotificationsValues)

  function patch(partial: Partial<NotificationsValues>) {
    setValues(prev => ({ ...prev, ...partial }))
  }

  return (
    <div className="flex flex-col gap-8">
      <RoutePageTitle title="Notifications" onBack={onBack} />
      <div className="flex flex-col gap-0 divide-y divide-app-border">
        {/* News & Updates */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">News &amp; Updates</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              Announcements, feature updates, and platform news.
            </p>
          </div>
          <Toggle
            checked={values.newsAndUpdates}
            onChange={v => patch({ newsAndUpdates: v })}
            label="Toggle news and updates notifications"
          />
        </div>

        {/* User Activity */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">User Activity</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              New followers, zaps, and reactions to your content.
            </p>
          </div>
          <Toggle
            checked={values.userActivity}
            onChange={v => patch({ userActivity: v })}
            label="Toggle user activity notifications"
          />
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Comments</p>
            <p className="text-xs text-text-tertiary mt-0.5">When someone comments on your posts.</p>
          </div>
          <div className="flex flex-col gap-3">
            <RadioItem
              name="comments"
              value="none"
              checked={values.commentsLevel === "none"}
              label="None"
              description="No comment notifications."
              onChange={() => patch({ commentsLevel: "none" })}
            />
            <RadioItem
              name="comments"
              value="mentions"
              checked={values.commentsLevel === "mentions"}
              label="Mentions only"
              description="Only when you're directly mentioned."
              onChange={() => patch({ commentsLevel: "mentions" })}
            />
            <RadioItem
              name="comments"
              value="all"
              checked={values.commentsLevel === "all"}
              label="All comments"
              description="Every comment on your posts."
              onChange={() => patch({ commentsLevel: "all" })}
            />
          </div>
        </div>

        {/* Reminders */}
        <div className="flex flex-col gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Reminders</p>
            <p className="text-xs text-text-tertiary mt-0.5">Reminders about unfinished actions and events.</p>
          </div>
          <div className="flex flex-col gap-3">
            <RadioItem
              name="reminders"
              value="none"
              checked={values.remindersLevel === "none"}
              label="None"
              description="No reminder notifications."
              onChange={() => patch({ remindersLevel: "none" })}
            />
            <RadioItem
              name="reminders"
              value="important"
              checked={values.remindersLevel === "important"}
              label="Important only"
              description="High-priority reminders only."
              onChange={() => patch({ remindersLevel: "important" })}
            />
            <RadioItem
              name="reminders"
              value="all"
              checked={values.remindersLevel === "all"}
              label="All reminders"
              onChange={() => patch({ remindersLevel: "all" })}
            />
          </div>
        </div>

        {/* Activity About You */}
        <div className="flex flex-col gap-4 py-5">
          <div>
            <p className="text-sm font-semibold text-text-primary">Activity About You</p>
            <p className="text-xs text-text-tertiary mt-0.5">When others interact with your profile or content.</p>
          </div>
          <div className="flex flex-col gap-3">
            <RadioItem
              name="activity"
              value="all"
              checked={values.activityLevel === "all"}
              label="All activity"
              onChange={() => patch({ activityLevel: "all" })}
            />
            <RadioItem
              name="activity"
              value="none"
              checked={values.activityLevel === "none"}
              label="None"
              onChange={() => patch({ activityLevel: "none" })}
            />
          </div>
        </div>
      </div>

      <SectionFooter onReset={onReset} onCancel={onCancel} onSave={() => onSave(values)} />
    </div>
  )
}
