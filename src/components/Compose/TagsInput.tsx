"use client"

import { useState } from "react"
import { Tag01, XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"

// ── Public types ──────────────────────────────────────────────────────────────

export type TagsInputProps = {
  tags: string[]
  /** Called with the stripped tag string (no leading #) when the user adds a tag. */
  onAdd: (tag: string) => void
  /** Called with the tag string to remove. */
  onRemove: (tag: string) => void
  placeholder?: string
  /** Optional hint text shown below the input row. */
  hint?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TagsInput({
  tags,
  onAdd,
  onRemove,
  placeholder = "Add a tag…",
  hint,
}: TagsInputProps) {
  const [input, setInput] = useState("")

  function handleAdd() {
    const tag = input.trim().replace(/^#/, "")
    if (!tag) return
    onAdd(tag)
    setInput("")
  }

  return (
    <div className="flex flex-col gap-2">

      {/* Existing chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-app-surface border border-app-border text-xs text-text-secondary">
              #{tag}
              <button
                type="button"
                aria-label={`Remove tag ${tag}`}
                onClick={() => onRemove(tag)}
                className="flex items-center justify-center size-3.5 rounded-full text-text-tertiary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none">
                <XClose size={10} color="currentColor" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 px-3 h-9 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
          <Tag01 size={14} color="var(--color-text-tertiary)" aria-hidden="true" className="shrink-0" />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                handleAdd()
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleAdd}>
          Add
        </Button>
      </div>

      {hint && <p className="text-xs text-text-tertiary">{hint}</p>}
    </div>
  )
}
