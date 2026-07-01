"use client"

import type { Dispatch, SetStateAction } from "react"

// ── Public types ──────────────────────────────────────────────────────────────

export type UseTagsFieldResult = {
  addTag: (raw: string) => void
  removeTag: (tag: string) => void
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Binds a `TagsInput` to a string-array field on a form-values object.
 *
 * Returns add/remove handlers that:
 *   - trim whitespace and strip a leading `#`
 *   - silently no-op on empty or duplicate values
 *   - filter by exact-match on remove
 *
 * Tags themselves should be read directly from `values[key]` at the call
 * site — this hook only owns the mutation, not the source of truth.
 *
 * @example
 * ```tsx
 * const { addTag, removeTag } = useTagsField(onChange, "tags")
 * <TagsInput tags={values.tags} onAdd={addTag} onRemove={removeTag} />
 * ```
 */
export function useTagsField<T, K extends keyof T>(
  onChange: Dispatch<SetStateAction<T>>,
  key: K
): UseTagsFieldResult {
  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#/, "")
    if (!tag) return
    onChange(prev => {
      const arr = prev[key] as unknown as string[]
      if (arr.includes(tag)) return prev
      return { ...prev, [key]: [...arr, tag] }
    })
  }

  function removeTag(tag: string) {
    onChange(prev => {
      const arr = prev[key] as unknown as string[]
      return { ...prev, [key]: arr.filter(t => t !== tag) }
    })
  }

  return { addTag, removeTag }
}
