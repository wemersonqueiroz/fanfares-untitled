"use client"

import { useId, type Dispatch, type SetStateAction } from "react"
import { cx } from "@/utils/cx"
import {
  FieldLabel,
  RichTextArea,
  ImageDropzone,
  TagsInput,
  TextInput,
  CreatorsField,
  RssFeedField,
  type Creator,
} from "@/components/Compose"

// ── Public types ──────────────────────────────────────────────────────────────

export type { Creator }

export type ComposeAudiobookValues = {
  title: string
  coverFile: File | null
  description: string
  creators: Creator[]
  tags: string[]
  rssFeed: string
}

export type ComposeAudiobookProps = {
  values: ComposeAudiobookValues
  onChange: Dispatch<SetStateAction<ComposeAudiobookValues>>
  /** "book" | "audiobook" (affects labels) */
  kind: "book" | "audiobook"
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ComposeAudiobook({
  values,
  onChange,
  kind,
  className,
}: ComposeAudiobookProps) {
  const titleId = useId()

  const coverLabel = kind === "audiobook" ? "Artwork" : "Book Cover Image"

  function patch(partial: Partial<ComposeAudiobookValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#/, "")
    if (!tag) return
    onChange(prev => {
      if (prev.tags.includes(tag)) return prev
      return { ...prev, tags: [...prev.tags, tag] }
    })
  }

  function removeTag(tag: string) {
    onChange(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  return (
    <div className={cx("flex flex-col gap-5", className)}>
      <div>
        <FieldLabel htmlFor={titleId} required>Title</FieldLabel>
        <TextInput
          id={titleId}
          value={values.title}
          onChange={e => patch({ title: e.target.value })}
          placeholder={kind === "audiobook" ? "Audiobook title…" : "Book title…"}
        />
      </div>

      <div>
        <FieldLabel>{coverLabel}</FieldLabel>
        <ImageDropzone
          file={values.coverFile}
          onFile={f => patch({ coverFile: f })}
          hint="SVG, PNG, JPG or GIF (recommended 1:1 square)"
          label={`Upload ${coverLabel}`}
        />
      </div>

      <div>
        <FieldLabel required>Description</FieldLabel>
        <RichTextArea
          onChange={html => patch({ description: html })}
          placeholder="Write a description…"
          minHeight="100px"
        />
      </div>

      <CreatorsField
        creators={values.creators}
        onChange={creators => patch({ creators })}
        defaultRole="Author"
        rolePlaceholder="Role (Author, Narrator…)"
      />

      <div>
        <FieldLabel>Tags / Metadata</FieldLabel>
        <TagsInput
          tags={values.tags}
          onAdd={addTag}
          onRemove={removeTag}
          placeholder="Add a tag…"
        />
      </div>

      <RssFeedField
        value={values.rssFeed}
        onChange={v => patch({ rssFeed: v })}
      />
    </div>
  )
}
