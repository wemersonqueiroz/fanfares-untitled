"use client"

import { useState, type ReactNode } from "react"
import { UserPlus01, XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { createId } from "@/utils/createId"
import { FieldLabel } from "./FieldLabel"
import { FieldRow } from "./FieldRow"

// ── Public types ──────────────────────────────────────────────────────────────

export type Creator = {
  id: string
  npub: string
  role: string
  name?: string
  avatarUrl?: string
}

export type CreatorsFieldProps = {
  creators: Creator[]
  onChange: (creators: Creator[]) => void
  /**
   * Default role assigned when the user adds a creator without specifying one.
   * Also used as the "role placeholder hint" in the add row.
   * @example "Author", "Director", "Host"
   */
  defaultRole?: string
  /** Placeholder text in the role input on the add row. */
  rolePlaceholder?: string
  /** Optional helper text rendered under the label. */
  hint?: ReactNode
  /** Required marker on the label. Defaults to true. */
  required?: boolean
  /** Label text. Defaults to "Creators". */
  label?: string
  /** Prefix passed to `createId` for new creator ids. */
  idPrefix?: string
  /**
   * If provided, the role in each existing list item becomes a `<select>`
   * with these options (in-place edit). Otherwise the role is shown as
   * plain text and edits must happen via remove+re-add.
   */
  roleOptions?: string[]
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Creators block shared by every Compose* form: label + existing creator list
 * (with avatar, npub label, role, remove button) + an inline add row
 * (npub input + role input + Add button).
 *
 * Owns the npub/role draft state internally; the parent only sees the
 * persisted `Creator[]` array.
 */
export function CreatorsField({
  creators,
  onChange,
  defaultRole = "Author",
  rolePlaceholder,
  hint,
  required = true,
  label = "Creators",
  idPrefix = "creator",
  roleOptions,
  className,
}: CreatorsFieldProps) {
  const [draftNpub, setDraftNpub] = useState("")
  const [draftRole, setDraftRole] = useState("")

  function addCreator() {
    const npub = draftNpub.trim()
    if (!npub) return
    const role = draftRole.trim() || defaultRole
    onChange([...creators, { id: createId(idPrefix), npub, role }])
    setDraftNpub("")
    setDraftRole("")
  }

  function removeCreator(id: string) {
    onChange(creators.filter(c => c.id !== id))
  }

  function updateCreator(id: string, partial: Partial<Creator>) {
    onChange(creators.map(c => (c.id === id ? { ...c, ...partial } : c)))
  }

  return (
    <div className={cx(className)}>
      <FieldLabel required={required}>{label}</FieldLabel>
      {hint && <p className="text-xs text-text-tertiary mb-2">{hint}</p>}

      {/* Existing creators list */}
      {creators.length > 0 && (
        <div className="flex flex-col gap-2 mb-2">
          {creators.map(creator => (
            <div
              key={creator.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-app-surface border border-app-border">
              <Avatar
                src={creator.avatarUrl}
                name={creator.name || creator.npub}
                size="xs"
                className="border border-black/10 shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {creator.name || `${creator.npub.slice(0, 16)}…`}
                </span>
                {!roleOptions && (
                  <span className="text-xs text-text-tertiary">
                    {creator.role}
                  </span>
                )}
              </div>
              {roleOptions && (
                <select
                  value={creator.role}
                  onChange={e => updateCreator(creator.id, { role: e.target.value })}
                  className="bg-transparent text-xs text-text-tertiary outline-none cursor-pointer shrink-0">
                  {roleOptions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              )}
              <IconButton
                icon={XClose}
                label="Remove creator"
                variant="ghost"
                size="xs"
                onClick={() => removeCreator(creator.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add row */}
      <div className="flex flex-col gap-2">
        <FieldRow size="sm">
          <UserPlus01
            size={14}
            color="var(--color-text-tertiary)"
            aria-hidden="true"
            className="shrink-0"
          />
          <input
            type="text"
            value={draftNpub}
            onChange={e => setDraftNpub(e.target.value)}
            placeholder="npub or pubkey…"
            className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </FieldRow>
        <div className="flex items-center gap-2">
          <FieldRow size="sm" className="flex-1">
            <input
              type="text"
              value={draftRole}
              onChange={e => setDraftRole(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addCreator()
                }
              }}
              placeholder={rolePlaceholder ?? `Role (${defaultRole}…)`}
              className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
            />
          </FieldRow>
          <Button variant="secondary" size="sm" onClick={addCreator}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
