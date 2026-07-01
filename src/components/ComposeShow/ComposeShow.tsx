"use client"

import { useState, useId, type Dispatch, type SetStateAction } from "react"
import { cx } from "@/utils/cx"
import {
  FieldLabel,
  RichTextArea,
  ImageDropzone,
  TagsInput,
  AccordionPanel,
  TextInput,
  CreatorsField,
  RssFeedField,
  useTagsField,
  type Creator,
} from "@/components/Compose"

// ── Public types ──────────────────────────────────────────────────────────────

export type ShowCreator = Creator

export type ComposeShowValues = {
  // Show details
  showTitle: string
  showArtworkFile: File | null
  /** Cropped show artwork (16:9). */
  showArtworkCroppedBlob: Blob | null
  showDescription: string
  showTags: string[]
  showRssFeed: string
  // First episode
  episodeTitle: string
  episodeThumbnailFile: File | null
  /** Cropped episode thumbnail (16:9). */
  episodeThumbnailCroppedBlob: Blob | null
  episodeDescription: string
  episodeCreators: Creator[]
  episodeTags: string[]
}

export type ComposeShowProps = {
  values: ComposeShowValues
  onChange: Dispatch<SetStateAction<ComposeShowValues>>
  /** Fires when the user picks show artwork; parent should open the cropper. */
  onShowArtworkCropRequest: (file: File) => void
  /** Fires when the user picks an episode thumbnail; parent should open the cropper. */
  onEpisodeThumbnailCropRequest: (file: File) => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ComposeShow({
  values,
  onChange,
  onShowArtworkCropRequest,
  onEpisodeThumbnailCropRequest,
  className,
}: ComposeShowProps) {
  const [showOpen, setShowOpen] = useState(true)
  const [episodeOpen, setEpisodeOpen] = useState(true)

  const showTitleId = useId()
  const epTitleId = useId()

  function patch(partial: Partial<ComposeShowValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  const showTags = useTagsField(onChange, "showTags")
  const episodeTags = useTagsField(onChange, "episodeTags")

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {/* ── Section 1: Show details ─────────────────────────────────────── */}
      <AccordionPanel
        number={1}
        title="Create New Show"
        open={showOpen}
        onToggle={() => setShowOpen(v => !v)}>
        <div>
          <FieldLabel htmlFor={showTitleId} required>Show Title</FieldLabel>
          <TextInput
            id={showTitleId}
            value={values.showTitle}
            onChange={e => patch({ showTitle: e.target.value })}
            placeholder="Enter a show title…"
          />
        </div>

        <div>
          <FieldLabel>Show Artwork</FieldLabel>
          <ImageDropzone
            file={values.showArtworkFile}
            onFile={f =>
              patch({
                showArtworkFile: f,
                showArtworkCroppedBlob: f ? values.showArtworkCroppedBlob : null,
              })
            }
            onCropRequest={onShowArtworkCropRequest}
            croppedBlob={values.showArtworkCroppedBlob}
            previewAspectClass="aspect-video"
            hint="PNG, JPG, WEBP (locked to 16:9)"
            label="Upload show artwork"
          />
        </div>

        <div>
          <FieldLabel required>Show Description</FieldLabel>
          <RichTextArea
            onChange={html => patch({ showDescription: html })}
            placeholder="Write a description for your show…"
          />
        </div>

        <div>
          <FieldLabel>Tags</FieldLabel>
          <TagsInput
            tags={values.showTags}
            onAdd={showTags.addTag}
            onRemove={showTags.removeTag}
            placeholder="Add a tag…"
          />
        </div>

        <RssFeedField
          value={values.showRssFeed}
          onChange={v => patch({ showRssFeed: v })}
          placeholder="https://"
        />
      </AccordionPanel>

      {/* ── Section 2: First episode ────────────────────────────────────── */}
      <AccordionPanel
        number={2}
        title="Create First Episode"
        open={episodeOpen}
        onToggle={() => setEpisodeOpen(v => !v)}>
        <div>
          <FieldLabel htmlFor={epTitleId} required>Episode Title</FieldLabel>
          <div className="flex flex-col gap-1">
            <TextInput
              id={epTitleId}
              value={values.episodeTitle}
              onChange={e => patch({ episodeTitle: e.target.value })}
              placeholder="Enter a title…"
            />
            <p className="text-xs text-text-tertiary">
              Include episode number in the title.
            </p>
          </div>
        </div>

        <div>
          <FieldLabel>Episode Thumbnail</FieldLabel>
          <p className="text-xs text-text-tertiary mb-2">
            If none is uploaded, the show artwork or first frame of the video
            will be used.
          </p>
          <ImageDropzone
            file={values.episodeThumbnailFile}
            onFile={f =>
              patch({
                episodeThumbnailFile: f,
                episodeThumbnailCroppedBlob: f
                  ? values.episodeThumbnailCroppedBlob
                  : null,
              })
            }
            onCropRequest={onEpisodeThumbnailCropRequest}
            croppedBlob={values.episodeThumbnailCroppedBlob}
            previewAspectClass="aspect-video"
            hint="PNG, JPG, WEBP (locked to 16:9)"
            label="Upload episode thumbnail"
          />
        </div>

        <div>
          <FieldLabel required>Episode Description</FieldLabel>
          <RichTextArea
            onChange={html => patch({ episodeDescription: html })}
            placeholder="Write a description for this episode…"
          />
        </div>

        <CreatorsField
          creators={values.episodeCreators}
          onChange={episodeCreators => patch({ episodeCreators })}
          defaultRole="Director"
          rolePlaceholder="Role (Director, Producer…)"
          idPrefix="sc"
        />

        <div>
          <FieldLabel>Tags</FieldLabel>
          <TagsInput
            tags={values.episodeTags}
            onAdd={episodeTags.addTag}
            onRemove={episodeTags.removeTag}
            placeholder="Add a tag…"
          />
        </div>
      </AccordionPanel>
    </div>
  )
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function defaultComposeShowValues(): ComposeShowValues {
  return {
    showTitle: "",
    showArtworkFile: null,
    showArtworkCroppedBlob: null,
    showDescription: "",
    showTags: [],
    showRssFeed: "",
    episodeTitle: "",
    episodeThumbnailFile: null,
    episodeThumbnailCroppedBlob: null,
    episodeDescription: "",
    episodeCreators: [],
    episodeTags: [],
  }
}
