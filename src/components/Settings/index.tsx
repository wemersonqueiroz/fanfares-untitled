"use client"

import { useState, useEffect, type FC, type SVGProps } from "react"
import {
  ArrowNarrowLeft,
  Bell01,
  BookOpen01,
  ChevronRight,
  Colors,
  Rss01,
  SearchMd,
  Shield01,
  Tool01,
  Upload01,
  VolumeX,
  Wallet01,
  Wifi,
  Zap,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Toggle } from "@/components/Compose"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { getTheme, applyTheme, saveTheme } from "@/utils/theme"

// ── Public types ──────────────────────────────────────────────────────────────

export type SettingsSection =
  | "Appearance"
  | "Feeds"
  | "Reads Feeds"
  | "Media Uploads"
  | "Muted Content"
  | "Content Moderation"
  | "Connected Wallets"
  | "Notifications"
  | "Dev Tools"
  | "Network"
  | "Zaps"

export type SettingsPageProps = {
  /** Override which section is initially open. `null` = show list */
  defaultSection?: SettingsSection | null
  // ── Callbacks ──────────────────────────────────────────────────────────────
  onSave?: (section: SettingsSection, values: unknown) => void
  onReset?: (section: SettingsSection) => void
  onCancel?: (section: SettingsSection) => void
  className?: string
}

// ── Appearance values ─────────────────────────────────────────────────────────

export type ColorScheme =
  | "purple"
  | "blue"
  | "teal"
  | "green"
  | "orange"
  | "red"
  | "pink"
  | "gold"
  | "custom"

export type DisplayMode = "light" | "dark"
export type BannerStyle = "default" | "simplified"

export type AppearanceValues = {
  colorScheme: ColorScheme
  customHex: string
  displayMode: DisplayMode
  transparentSidebar: boolean
  language: string
  bannerStyle: BannerStyle
}

// ── Notifications values ──────────────────────────────────────────────────────

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

// ── Internal types ────────────────────────────────────────────────────────────

type IconComponent = FC<
  SVGProps<SVGSVGElement> & {
    size?: number
    color?: string
    "aria-hidden"?: boolean | "true" | "false"
  }
>

type NavItem = {
  id: SettingsSection
  icon: IconComponent
  label: string
}

// ── Static config ─────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "Appearance", icon: Colors, label: "Appearance" },
  { id: "Feeds", icon: Rss01, label: "Feeds" },
  { id: "Reads Feeds", icon: BookOpen01, label: "Reads Feeds" },
  { id: "Media Uploads", icon: Upload01, label: "Media Uploads" },
  { id: "Muted Content", icon: VolumeX, label: "Muted Content" },
  { id: "Content Moderation", icon: Shield01, label: "Content Moderation" },
  { id: "Connected Wallets", icon: Wallet01, label: "Connected Wallets" },
  { id: "Notifications", icon: Bell01, label: "Notifications" },
  { id: "Dev Tools", icon: Tool01, label: "Dev Tools" },
  { id: "Network", icon: Wifi, label: "Network" },
  { id: "Zaps", icon: Zap, label: "Zaps" },
]

const COLOR_SWATCHES: { id: ColorScheme; hex: string; label: string }[] = [
  { id: "purple", hex: "#7C3AED", label: "Purple" },
  { id: "blue", hex: "#2563EB", label: "Blue" },
  { id: "teal", hex: "#0D9488", label: "Teal" },
  { id: "green", hex: "#16A34A", label: "Green" },
  { id: "orange", hex: "#EA580C", label: "Orange" },
  { id: "red", hex: "#DC2626", label: "Red" },
  { id: "pink", hex: "#DB2777", label: "Pink" },
  { id: "gold", hex: "#D97706", label: "Gold" },
]

const LANGUAGES = [
  "English",
  "Español",
  "Português",
  "Français",
  "Deutsch",
  "日本語",
  "中文",
]

function defaultAppearanceValues(): AppearanceValues {
  return {
    colorScheme: "purple",
    customHex: "",
    displayMode: "dark",
    transparentSidebar: false,
    language: "English",
    bannerStyle: "default",
  }
}

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

/** Left nav list — shown on desktop always, on mobile when no section active */
function SettingsNavList({
  activeSection,
  onSelect,
}: {
  activeSection: SettingsSection | null
  onSelect: (s: SettingsSection) => void
}) {
  return (
    <nav aria-label="Settings navigation">
      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={cx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "text-sm font-medium cursor-pointer transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                  isActive
                    ? "bg-app-card text-text-primary"
                    : "text-text-tertiary hover:bg-app-card hover:text-text-secondary"
                )}>
                <Icon
                  size={18}
                  color="currentColor"
                  aria-hidden="true"
                  className="shrink-0"
                />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight
                  size={16}
                  color="currentColor"
                  aria-hidden="true"
                  className={cx(
                    "shrink-0 transition-colors",
                    isActive ? "text-text-tertiary" : "text-text-quaternary"
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Section header with back arrow — used on mobile and desktop */
function SectionHeader({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-app-border shrink-0">
      <IconButton
        icon={ArrowNarrowLeft}
        label="Back to settings"
        variant="ghost-primary"
        size="md"
        onClick={onBack}
      />
      <h2 className="text-heading-card text-text-primary">{title}</h2>
    </div>
  )
}

/** Color swatch button */
function ColorSwatch({
  hex,
  label,
  isSelected,
  onClick,
}: {
  hex: string
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isSelected}
      onClick={onClick}
      className={cx(
        "size-8 rounded-full cursor-pointer shrink-0 transition-transform duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
        isSelected && "scale-110"
      )}
      style={{
        backgroundColor: hex,
        boxShadow: isSelected
          ? `0 0 0 2px var(--color-app-card), 0 0 0 4px ${hex}`
          : undefined,
      }}
    />
  )
}

/** Display mode card (Light / Dark) */
function DisplayModeCard({
  mode,
  isSelected,
  onClick,
}: {
  mode: DisplayMode
  isSelected: boolean
  onClick: () => void
}) {
  const isDark = mode === "dark"
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cx(
        "flex-1 flex flex-col gap-2 p-3 rounded-xl border cursor-pointer",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
        isSelected
          ? "border-brand-500 bg-app-card"
          : "border-app-border bg-app-surface hover:border-app-border-hover"
      )}>
      {/* Mini UI preview */}
      <div
        className={cx(
          "w-full h-16 rounded-lg overflow-hidden border border-black/10",
          isDark ? "bg-[#0c0e12]" : "bg-[#f9fafb]"
        )}>
        <div
          className={cx(
            "h-4 w-1/3 m-2 rounded",
            isDark ? "bg-[#22262f]" : "bg-[#e5e7eb]"
          )}
        />
        <div
          className={cx(
            "h-2 w-2/3 mx-2 rounded",
            isDark ? "bg-[#373a41]" : "bg-[#d1d5db]"
          )}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary capitalize">
          {mode}
        </span>
        {isSelected && (
          <span className="size-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
            <svg
              width="8"
              height="6"
              viewBox="0 0 8 6"
              fill="none"
              aria-hidden="true">
              <path
                d="M1 3L3 5L7 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </button>
  )
}

/** Banner style card (Default / Simplified) */
function BannerStyleCard({
  style,
  isSelected,
  onClick,
}: {
  style: BannerStyle
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cx(
        "flex-1 flex flex-col gap-2 p-3 rounded-xl border cursor-pointer",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
        isSelected
          ? "border-brand-500 bg-app-card"
          : "border-app-border bg-app-surface hover:border-app-border-hover"
      )}>
      {/* Mini banner preview */}
      <div className="w-full h-16 rounded-lg overflow-hidden bg-app-card border border-black/10 relative">
        {style === "default" ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-700/40 to-transparent" />
            <div className="absolute bottom-2 left-2 h-2 w-14 bg-white/30 rounded" />
            <div className="absolute bottom-5 left-2 h-2 w-8 bg-white/20 rounded" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-16 bg-app-border rounded" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary capitalize">
          {style}
        </span>
        {isSelected && (
          <span className="size-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
            <svg
              width="8"
              height="6"
              viewBox="0 0 8 6"
              fill="none"
              aria-hidden="true">
              <path
                d="M1 3L3 5L7 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </button>
  )
}

/** Radio group item for Notifications */
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

/** Section footer — Reset / Cancel / Save */
function SectionFooter({
  onReset,
  onCancel,
  onSave,
}: {
  onReset: () => void
  onCancel: () => void
  onSave: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-app-border shrink-0">
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

// ── Section: Appearance ───────────────────────────────────────────────────────

function AppearanceSection({
  onBack,
  onSave,
  onReset,
  onCancel,
}: {
  onBack: () => void
  onSave: (v: AppearanceValues) => void
  onReset: () => void
  onCancel: () => void
}) {
  const [values, setValues] = useState<AppearanceValues>(
    defaultAppearanceValues
  )
  // Track the theme that was active when the section was opened so we can
  // revert to it on Cancel without touching other appearance values.
  const [originalTheme, setOriginalTheme] = useState<DisplayMode>("dark")

  // Sync displayMode from the real DOM on first render (client-side only).
  useEffect(() => {
    const current = getTheme()
    setOriginalTheme(current)
    setValues(prev => ({ ...prev, displayMode: current }))
  }, [])

  function patch(partial: Partial<AppearanceValues>) {
    setValues(prev => ({ ...prev, ...partial }))
  }

  function handleDisplayModeChange(mode: DisplayMode) {
    patch({ displayMode: mode })
    // Live-preview: apply immediately without persisting
    applyTheme(mode)
  }

  function handleSave() {
    // Persist the chosen theme to localStorage and keep it applied
    saveTheme(values.displayMode)
    setOriginalTheme(values.displayMode)
    onSave(values)
  }

  function handleCancel() {
    // Revert DOM to the theme that was active before the user started editing
    applyTheme(originalTheme)
    setValues(prev => ({ ...prev, displayMode: originalTheme }))
    onCancel()
  }

  function handleReset() {
    const defaults = defaultAppearanceValues()
    setValues(defaults)
    applyTheme(defaults.displayMode)
    onReset()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SectionHeader title="Appearance" onBack={onBack} />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-8 p-6">
          {/* Color Scheme */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-body-emphasis text-text-primary">
                Color Scheme
              </h3>
              <p className="text-sm text-text-tertiary mt-0.5">
                Choose your preferred accent color.
              </p>
            </div>
            {/* Preset swatches */}
            <div className="flex flex-wrap gap-3">
              {COLOR_SWATCHES.map(sw => (
                <ColorSwatch
                  key={sw.id}
                  hex={sw.hex}
                  label={sw.label}
                  isSelected={values.colorScheme === sw.id}
                  onClick={() => patch({ colorScheme: sw.id, customHex: "" })}
                />
              ))}
              {/* Custom swatch */}
              <button
                type="button"
                aria-label="Custom color"
                aria-pressed={values.colorScheme === "custom"}
                onClick={() => patch({ colorScheme: "custom" })}
                className={cx(
                  "size-8 rounded-full cursor-pointer shrink-0",
                  "border-2 border-dashed transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                  values.colorScheme === "custom"
                    ? "border-brand-500 bg-app-card"
                    : "border-app-border bg-app-surface hover:border-app-border-hover"
                )}>
                <span className="text-xs text-text-tertiary">+</span>
              </button>
            </div>
            {/* Custom hex input — shown when "custom" selected */}
            {values.colorScheme === "custom" && (
              <div className="flex items-center gap-2">
                <div
                  className="size-8 rounded-full border border-app-border shrink-0"
                  style={{
                    backgroundColor: values.customHex || "transparent",
                  }}
                />
                <div className="flex items-center gap-2 flex-1 px-3 h-9 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
                  <span className="text-sm text-text-tertiary">#</span>
                  <input
                    type="text"
                    value={values.customHex.replace(/^#/, "")}
                    onChange={e =>
                      patch({
                        customHex: `#${e.target.value.replace(/^#/, "")}`,
                      })
                    }
                    placeholder="7C3AED"
                    maxLength={6}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-placeholder font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Display Preferences */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-body-emphasis text-text-primary">
                Display Preferences
              </h3>
              <p className="text-sm text-text-tertiary mt-0.5">
                Select light or dark interface.
              </p>
            </div>
            <div className="flex items-stretch gap-3">
              <DisplayModeCard
                mode="dark"
                isSelected={values.displayMode === "dark"}
                onClick={() => handleDisplayModeChange("dark")}
              />
              <DisplayModeCard
                mode="light"
                isSelected={values.displayMode === "light"}
                onClick={() => handleDisplayModeChange("light")}
              />
            </div>
          </div>

          {/* Transparent Sidebar */}
          <div className="flex items-center justify-between gap-4 py-1">
            <div>
              <h3 className="text-body-emphasis text-text-primary">
                Transparent Sidebar
              </h3>
              <p className="text-sm text-text-tertiary mt-0.5">
                Makes the left sidebar semi-transparent over the background.
              </p>
            </div>
            <Toggle
              checked={values.transparentSidebar}
              onChange={v => patch({ transparentSidebar: v })}
              label="Toggle transparent sidebar"
            />
          </div>

          {/* Language */}
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-body-emphasis text-text-primary">Language</h3>
              <p className="text-sm text-text-tertiary mt-0.5">
                Choose the display language for the interface.
              </p>
            </div>
            <div className="relative">
              <select
                value={values.language}
                onChange={e => patch({ language: e.target.value })}
                className={cx(
                  "w-full px-3 h-10 pr-8 rounded-lg border border-app-border bg-app-surface",
                  "text-sm text-text-primary outline-none appearance-none",
                  "focus-visible:ring-2 focus-visible:ring-brand-500/50 transition-colors duration-150",
                  "cursor-pointer"
                )}>
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronRight
                size={14}
                color="var(--color-text-tertiary)"
                aria-hidden="true"
                className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none shrink-0"
              />
            </div>
          </div>

          {/* Banner Appearance */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-body-emphasis text-text-primary">
                Banner Appearance
              </h3>
              <p className="text-sm text-text-tertiary mt-0.5">
                Choose how profile and page banners are displayed.
              </p>
            </div>
            <div className="flex items-stretch gap-3">
              <BannerStyleCard
                style="default"
                isSelected={values.bannerStyle === "default"}
                onClick={() => patch({ bannerStyle: "default" })}
              />
              <BannerStyleCard
                style="simplified"
                isSelected={values.bannerStyle === "simplified"}
                onClick={() => patch({ bannerStyle: "simplified" })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <SectionFooter
        onReset={handleReset}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  )
}

// ── Section: Notifications ────────────────────────────────────────────────────

function NotificationsSection({
  onBack,
  onSave,
  onReset,
  onCancel,
}: {
  onBack: () => void
  onSave: (v: NotificationsValues) => void
  onReset: () => void
  onCancel: () => void
}) {
  const [values, setValues] = useState<NotificationsValues>(
    defaultNotificationsValues
  )

  function patch(partial: Partial<NotificationsValues>) {
    setValues(prev => ({ ...prev, ...partial }))
  }

  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Notifications" onBack={onBack} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-0 divide-y divide-app-border">
          {/* News & Updates */}
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                News &amp; Updates
              </p>
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
          <div className="flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                User Activity
              </p>
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
          <div className="flex flex-col gap-4 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Comments
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                When someone comments on your posts.
              </p>
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
          <div className="flex flex-col gap-4 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Reminders
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                Reminders about unfinished actions and events.
              </p>
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
          <div className="flex flex-col gap-4 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Activity About You
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                When others interact with your profile or content.
              </p>
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
      </div>

      <SectionFooter
        onReset={onReset}
        onCancel={onCancel}
        onSave={() => onSave(values)}
      />
    </div>
  )
}

// ── Placeholder section ───────────────────────────────────────────────────────

function PlaceholderSection({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <SectionHeader title={title} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-12 rounded-full bg-app-card flex items-center justify-center">
            <Settings01Icon />
          </div>
          <p className="text-sm font-medium text-text-secondary">
            {title} settings coming soon
          </p>
          <p className="text-xs text-text-tertiary max-w-xs">
            This section is under development and will be available in a future
            update.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Tiny gear icon used in placeholder */
function Settings01Icon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-text-quaternary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SettingsPage({
  defaultSection = null,
  onSave,
  onReset,
  onCancel,
  className,
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(
    defaultSection
  )

  function handleBack() {
    setActiveSection(null)
  }

  function renderSection() {
    switch (activeSection) {
      case "Appearance":
        return (
          <AppearanceSection
            onBack={handleBack}
            onSave={v => onSave?.("Appearance", v)}
            onReset={() => onReset?.("Appearance")}
            onCancel={() => onCancel?.("Appearance")}
          />
        )
      case "Notifications":
        return (
          <NotificationsSection
            onBack={handleBack}
            onSave={v => onSave?.("Notifications", v)}
            onReset={() => onReset?.("Notifications")}
            onCancel={() => onCancel?.("Notifications")}
          />
        )
      default:
        return <PlaceholderSection title={activeSection!} onBack={handleBack} />
    }
  }

  if (activeSection) {
    return <div className={cx("flex flex-col h-full", className)}>{renderSection()}</div>
  }

  return (
    <div className={cx("flex flex-col gap-8 pr-6", className)}>
      {/* ── Heading row ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-heading-cover font-bold text-text-primary">
          Settings
        </h1>

        {/* Search bar */}
        <div className={cx(
          "flex items-center gap-2 px-3 h-10 rounded-lg",
          "border border-app-border bg-app-card",
          "w-[280px] shrink-0"
        )}>
          <SearchMd size={16} color="var(--color-text-tertiary)" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary min-w-0"
          />
          <span className="text-xs text-text-tertiary border border-app-border rounded px-1 py-0.5 shrink-0 font-mono">
            ⌘K
          </span>
        </div>
      </div>

      {/* ── Settings list ─────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        {NAV_ITEMS.map((item, i) => (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={cx(
                "w-full flex items-center justify-between py-4",
                "text-base text-text-secondary hover:text-text-primary",
                "transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-inset"
              )}>
              <span>{item.label}</span>
              <ChevronRight
                size={20}
                color="currentColor"
                aria-hidden="true"
                className="shrink-0 text-text-quaternary"
              />
            </button>
            {i < NAV_ITEMS.length - 1 && (
              <div className="h-px bg-app-border" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
