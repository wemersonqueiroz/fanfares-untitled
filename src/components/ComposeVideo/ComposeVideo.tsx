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

export type VideoCreator = Creator

export type ComposeVideoValues = {
  title: string
  thumbnailFile: File | null
  /** JPEG blob produced by the crop screen — null until the user has cropped. */
  thumbnailCroppedBlob: Blob | null
  description: string
  creators: Creator[]
  tags: string[]
  rssFeed: string
}

export type ComposeVideoProps = {
  values: ComposeVideoValues
  onChange: Dispatch<SetStateAction<ComposeVideoValues>>
  /** Fires when the user picks a thumbnail file; parent should open the cropper. */
  onThumbnailCropRequest: (file: File) => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ComposeVideo({
  values,
  onChange,
  onThumbnailCropRequest,
  className,
}: ComposeVideoProps) {
  const titleId = useId()

  function patch(partial: Partial<ComposeVideoValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  const { addTag, removeTag } = useTagsField(onChange, "tags")

  return (
    <div className={cx("flex flex-col gap-5", className)}>
      <div>
        <FieldLabel htmlFor={titleId} required>Video Title</FieldLabel>
        <TextInput
          id={titleId}
          value={values.title}
          onChange={e => patch({ title: e.target.value })}
          placeholder="Enter a title…"
        />
        <p className="text-xs text-text-tertiary mt-1">
          Give your video a descriptive title.
        </p>
      </div>

      <div>
        <FieldLabel>Thumbnail</FieldLabel>
        <p className="text-xs text-text-tertiary mb-2">
          If none is uploaded, the first frame of the video will be used.
        </p>
        <ImageDropzone
          file={values.thumbnailFile}
          onFile={f => patch({ thumbnailFile: f, thumbnailCroppedBlob: f ? values.thumbnailCroppedBlob : null })}
          onCropRequest={onThumbnailCropRequest}
          croppedBlob={values.thumbnailCroppedBlob}
          previewAspectClass="aspect-video"
          hint="PNG, JPG, WEBP (locked to 16:9)"
          label="Upload thumbnail"
        />
      </div>

      <div>
        <FieldLabel required>Description</FieldLabel>
        <RichTextArea
          onChange={html => patch({ description: html })}
          placeholder="Write a description for your video…"
        />
      </div>

      <CreatorsField
        creators={values.creators}
        onChange={creators => patch({ creators })}
        defaultRole="Director"
        rolePlaceholder="Role (Director, Producer…)"
        hint="Add everyone involved in creating this video."
        idPrefix="vc"
      />

      <div>
        <FieldLabel>Tags</FieldLabel>
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

// ── Factory ───────────────────────────────────────────────────────────────────

export function defaultComposeVideoValues(): ComposeVideoValues {
  return {
    title: "",
    thumbnailFile: null,
    thumbnailCroppedBlob: null,
    description: "",
    creators: [],
    tags: [],
    rssFeed: "",
  }
}
