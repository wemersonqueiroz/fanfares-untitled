"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Toggle } from "@/components/Compose"
import { RoutePageTitle } from "@/components/RoutePageTitle"
import { getTheme, applyTheme, saveTheme } from "@/utils/theme"
import { SectionFooter } from "./SectionFooter"

// ── Public types ──────────────────────────────────────────────────────────────

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

export type AppearanceSectionProps = {
  onBack: () => void
  onSave: (v: AppearanceValues) => void
  onReset: () => void
  onCancel: () => void
}

// ── Static config ────────────────────────────────────────────────────────────

const COLOR_SWATCHES: { id: ColorScheme; hex: string; label: string }[] = [
  { id: "purple", hex: "#7C3AED", label: "Purple" },
  { id: "blue",   hex: "#2563EB", label: "Blue"   },
  { id: "teal",   hex: "#0D9488", label: "Teal"   },
  { id: "green",  hex: "#16A34A", label: "Green"  },
  { id: "orange", hex: "#EA580C", label: "Orange" },
  { id: "red",    hex: "#DC2626", label: "Red"    },
  { id: "pink",   hex: "#DB2777", label: "Pink"   },
  { id: "gold",   hex: "#D97706", label: "Gold"   },
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

// ── Sub-components ────────────────────────────────────────────────────────────

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
      <div
        className={cx(
          "w-full h-16 rounded-lg overflow-hidden border border-black/10",
          isDark ? "bg-[#0c0e12]" : "bg-[#f9fafb]"
        )}>
        <div className={cx("h-4 w-1/3 m-2 rounded", isDark ? "bg-[#22262f]" : "bg-[#e5e7eb]")} />
        <div className={cx("h-2 w-2/3 mx-2 rounded", isDark ? "bg-[#373a41]" : "bg-[#d1d5db]")} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary capitalize">{mode}</span>
        {isSelected && (
          <span className="size-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </button>
  )
}

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
        <span className="text-sm font-medium text-text-primary capitalize">{style}</span>
        {isSelected && (
          <span className="size-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden="true">
              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AppearanceSection({
  onBack,
  onSave,
  onReset,
  onCancel,
}: AppearanceSectionProps) {
  const [values, setValues] = useState<AppearanceValues>(defaultAppearanceValues)
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
    applyTheme(mode)
  }

  function handleSave() {
    saveTheme(values.displayMode)
    setOriginalTheme(values.displayMode)
    onSave(values)
  }

  function handleCancel() {
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
    <div className="flex flex-col gap-8">
      <RoutePageTitle title="Appearance" onBack={onBack} />
      <div className="flex flex-col gap-8">
        {/* Color Scheme */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-body-emphasis text-text-primary">Color Scheme</h3>
            <p className="text-sm text-text-tertiary mt-0.5">Choose your preferred accent color.</p>
          </div>
          <div className="flex flex-wrap gap-3 px-2">
            {COLOR_SWATCHES.map(sw => (
              <ColorSwatch
                key={sw.id}
                hex={sw.hex}
                label={sw.label}
                isSelected={values.colorScheme === sw.id}
                onClick={() => patch({ colorScheme: sw.id, customHex: "" })}
              />
            ))}
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
          {values.colorScheme === "custom" && (
            <div className="flex items-center gap-2">
              <div
                className="size-8 rounded-full border border-app-border shrink-0"
                style={{ backgroundColor: values.customHex || "transparent" }}
              />
              <div className="flex items-center gap-2 flex-1 px-3 h-9 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
                <span className="text-sm text-text-tertiary">#</span>
                <input
                  type="text"
                  value={values.customHex.replace(/^#/, "")}
                  onChange={e =>
                    patch({ customHex: `#${e.target.value.replace(/^#/, "")}` })
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
            <h3 className="text-body-emphasis text-text-primary">Display Preferences</h3>
            <p className="text-sm text-text-tertiary mt-0.5">Select light or dark interface.</p>
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
            <h3 className="text-body-emphasis text-text-primary">Transparent Sidebar</h3>
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
            <p className="text-sm text-text-tertiary mt-0.5">Choose the display language for the interface.</p>
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
                <option key={lang} value={lang}>{lang}</option>
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
            <h3 className="text-body-emphasis text-text-primary">Banner Appearance</h3>
            <p className="text-sm text-text-tertiary mt-0.5">Choose how profile and page banners are displayed.</p>
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

      <SectionFooter onReset={handleReset} onCancel={handleCancel} onSave={handleSave} />
    </div>
  )
}
