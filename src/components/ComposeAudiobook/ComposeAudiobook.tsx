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
  useTagsField,
  type Creator,
} from "@/components/Compose"

// ── Public types ──────────────────────────────────────────────────────────────

export type { Creator }

export type ComposeAudiobookValues = {
  title: string
  coverFile: File | null
  /** JPEG blob produced by the crop screen — null until the user has cropped. */
  coverCroppedBlob: Blob | null
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
  /** Fires when the user picks a file and the parent should open the cropper. */
  onCoverCropRequest: (file: File) => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ComposeAudiobook({
  values,
  onChange,
  kind,
  onCoverCropRequest,
  className,
}: ComposeAudiobookProps) {
  const titleId = useId()

  const coverLabel = kind === "audiobook" ? "Artwork" : "Book Cover Image"
  const previewAspect = kind === "audiobook" ? "aspect-square" : "aspect-[4/5]"
  const hint =
    kind === "audiobook"
      ? "SVG, PNG, JPG or GIF (locked to 1:1 square)"
      : "SVG, PNG, JPG or GIF (locked to 4:5 portrait)"

  function patch(partial: Partial<ComposeAudiobookValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  const { addTag, removeTag } = useTagsField(onChange, "tags")

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
          onFile={f => patch({ coverFile: f, coverCroppedBlob: f ? values.coverCroppedBlob : null })}
          onCropRequest={onCoverCropRequest}
          croppedBlob={values.coverCroppedBlob}
          previewAspectClass={previewAspect}
          hint={hint}
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
