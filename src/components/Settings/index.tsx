"use client"

import { useState, type FC, type SVGProps } from "react"
import {
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
import { RoutePageTitle } from "@/components/RoutePageTitle"
import { AppearanceSection } from "./AppearanceSection"
import { NotificationsSection } from "./NotificationsSection"
import { PlaceholderSection } from "./PlaceholderSection"

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

// Re-export the section value types for any consumer wiring real callbacks.
export type {
  ColorScheme,
  DisplayMode,
  BannerStyle,
  AppearanceValues,
} from "./AppearanceSection"
export type {
  CommentsLevel,
  RemindersLevel,
  ActivityLevel,
  NotificationsValues,
} from "./NotificationsSection"

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
  { id: "Appearance",         icon: Colors,     label: "Appearance"         },
  { id: "Feeds",              icon: Rss01,      label: "Feeds"              },
  { id: "Reads Feeds",        icon: BookOpen01, label: "Reads Feeds"        },
  { id: "Media Uploads",      icon: Upload01,   label: "Media Uploads"      },
  { id: "Muted Content",      icon: VolumeX,    label: "Muted Content"      },
  { id: "Content Moderation", icon: Shield01,   label: "Content Moderation" },
  { id: "Connected Wallets",  icon: Wallet01,   label: "Connected Wallets"  },
  { id: "Notifications",      icon: Bell01,     label: "Notifications"      },
  { id: "Dev Tools",          icon: Tool01,     label: "Dev Tools"          },
  { id: "Network",            icon: Wifi,       label: "Network"            },
  { id: "Zaps",               icon: Zap,        label: "Zaps"               },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function SettingsPage({
  defaultSection = null,
  onSave,
  onReset,
  onCancel,
  className,
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(defaultSection)

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
    return (
      <div className={cx("flex flex-col w-full", className)}>
        {renderSection()}
      </div>
    )
  }

  return (
    <div className={cx("flex flex-col gap-8 w-full", className)}>
      <RoutePageTitle
        title="Settings"
        action={
          <div
            className={cx(
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
        }
      />

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
