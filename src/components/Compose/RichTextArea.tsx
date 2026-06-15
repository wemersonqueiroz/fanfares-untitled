"use client"

import { useRef } from "react"
import { Bold01, Italic01, Underline01, List } from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type RichTextAreaProps = {
  id?: string
  onChange: (html: string) => void
  placeholder: string
  /** When set, shows a character counter below the editor. */
  charLimit?: number
  /** Minimum height of the editable area (CSS value). Default: "120px" */
  minHeight?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

const TOOLBAR_ITEMS = [
  { label: "Bold",      cmd: "bold",      Icon: Bold01 },
  { label: "Italic",    cmd: "italic",    Icon: Italic01 },
  { label: "Underline", cmd: "underline", Icon: Underline01 },
] as const

// ── Component ─────────────────────────────────────────────────────────────────

export function RichTextArea({
  id,
  onChange,
  placeholder,
  charLimit,
  minHeight = "120px",
}: RichTextAreaProps) {
  const ref = useRef<HTMLDivElement>(null)

  function exec(cmd: string) {
    document.execCommand(cmd, false)
    ref.current?.focus()
  }

  function handleInput() {
    onChange(ref.current?.innerHTML ?? "")
  }

  // Character count is approximate (innerText strips tags)
  const remaining =
    charLimit !== undefined
      ? charLimit - (ref.current?.innerText?.length ?? 0)
      : undefined

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 border border-app-border border-b-0 rounded-t-lg bg-app-surface">
        {TOOLBAR_ITEMS.map(({ label, cmd, Icon }) => (
          <button
            key={cmd}
            type="button"
            aria-label={label}
            onClick={() => exec(cmd)}
            className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card-active transition-colors duration-150 focus-visible:outline-none">
            <Icon size={15} color="currentColor" aria-hidden="true" />
          </button>
        ))}
        <div className="w-px h-4 bg-app-border mx-1" aria-hidden="true" />
        <button
          type="button"
          aria-label="Bullet list"
          onClick={() => exec("insertUnorderedList")}
          className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card-active transition-colors duration-150 focus-visible:outline-none">
          <List size={15} color="currentColor" aria-hidden="true" />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={ref}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        style={{ minHeight }}
        className={cx(
          "w-full px-3 py-2.5 rounded-b-lg border border-app-border bg-app-surface",
          "text-sm text-text-primary outline-none",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-text-placeholder empty:before:pointer-events-none",
          "focus-visible:ring-2 focus-visible:ring-brand-500/50 transition-colors duration-150"
        )}
      />

      {charLimit !== undefined && (
        <p className="text-xs text-text-tertiary mt-1">{remaining} characters left</p>
      )}
    </div>
  )
}
