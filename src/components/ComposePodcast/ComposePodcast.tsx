"use client"

import { useState, useId, type Dispatch, type SetStateAction } from "react"
import { cx } from "@/utils/cx"
import {
  FieldLabel,
  FieldRow,
  RichTextArea,
  ImageDropzone,
  TagsInput,
  AccordionPanel,
  TextInput,
  CreatorsField,
  RssFeedField,
  type Creator,
} from "@/components/Compose"

// ── Public types ──────────────────────────────────────────────────────────────

export type PodcastCreator = Creator

export type ComposePodcastValues = {
  // Show section (only used when mode === "new-show")
  showTitle: string
  showArtworkFile: File | null
  showDescription: string
  showTags: string[]
  showRssFeed: string

  // Episode section
  episodeTitle: string
  episodeThumbnailFile: File | null
  episodeDescription: string
  episodeCreators: Creator[]
  episodeTags: string[]

  // Returning user: assign to existing show
  assignedPodcastId: string
}

export type ComposePodcastProps = {
  /** "new-show" = first-time creator; "existing-show" = returning user with existing podcasts */
  mode: "new-show" | "existing-show"
  values: ComposePodcastValues
  onChange: Dispatch<SetStateAction<ComposePodcastValues>>
  /** Available shows for the "Assign To Podcast" dropdown (existing-show mode) */
  existingShows?: Array<{ id: string; title: string }>
  className?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PODCAST_ROLES = ["Author", "Narrator", "Producer", "Host", "Co-host"]

// ── Component ─────────────────────────────────────────────────────────────────

export function ComposePodcast({
  mode,
  values,
  onChange,
  existingShows = [],
  className,
}: ComposePodcastProps) {
  const [showOpen, setShowOpen] = useState(true)
  const [episodeOpen, setEpisodeOpen] = useState(true)

  const showDropdownId = useId()
  const episodeTitleId = useId()
  const showTitleId = useId()

  function patch(partial: Partial<ComposePodcastValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  function makeTagAdder(key: "showTags" | "episodeTags") {
    return (raw: string) => {
      const tag = raw.trim().replace(/^#/, "")
      if (!tag) return
      onChange(prev => {
        if (prev[key].includes(tag)) return prev
        return { ...prev, [key]: [...prev[key], tag] }
      })
    }
  }

  function makeTagRemover(key: "showTags" | "episodeTags") {
    return (tag: string) =>
      onChange(prev => ({ ...prev, [key]: prev[key].filter(t => t !== tag) }))
  }

  // ── Existing show mode ─────────────────────────────────────────────────────
  if (mode === "existing-show") {
    return (
      <div className={cx("flex flex-col gap-5", className)}>
        <div>
          <FieldLabel htmlFor={showDropdownId} required>Assign To Podcast</FieldLabel>
          <FieldRow>
            <select
              id={showDropdownId}
              value={values.assignedPodcastId}
              onChange={e => patch({ assignedPodcastId: e.target.value })}
              className="flex-1 bg-transparent text-sm text-text-primary outline-none cursor-pointer">
              <option value="">Select a podcast…</option>
              {existingShows.map(show => (
                <option key={show.id} value={show.id}>{show.title}</option>
              ))}
            </select>
          </FieldRow>
        </div>

        <div>
          <FieldLabel htmlFor={episodeTitleId} required>Episode Title</FieldLabel>
          <div className="flex flex-col gap-1">
            <TextInput
              id={episodeTitleId}
              value={values.episodeTitle}
              onChange={e => patch({ episodeTitle: e.target.value })}
              placeholder="Enter a title…"
            />
            <p className="text-xs text-text-tertiary">Include episode number in the Title</p>
          </div>
        </div>

        <div>
          <FieldLabel>Episode Thumbnail</FieldLabel>
          <p className="text-xs text-text-tertiary mb-2">
            If no image is uploaded the podcast art or first frame of video will be used as a thumbnail.
          </p>
          <ImageDropzone
            file={values.episodeThumbnailFile}
            onFile={f => patch({ episodeThumbnailFile: f })}
            hint="SVG, PNG, JPG or GIF (max. 800×400px)"
            label="Upload episode thumbnail"
          />
        </div>

        <div>
          <FieldLabel required>Episode Description</FieldLabel>
          <RichTextArea
            onChange={html => patch({ episodeDescription: html })}
            placeholder="Write a description…"
            charLimit={1024}
          />
        </div>

        <CreatorsField
          creators={values.episodeCreators}
          onChange={episodeCreators => patch({ episodeCreators })}
          defaultRole="Author"
          rolePlaceholder="Role (Host, Co-host…)"
          hint="Name or Npub"
          idPrefix="pc"
          roleOptions={PODCAST_ROLES}
        />

        <div>
          <FieldLabel>Tags / Metadata</FieldLabel>
          <TagsInput
            tags={values.episodeTags}
            onAdd={makeTagAdder("episodeTags")}
            onRemove={makeTagRemover("episodeTags")}
            placeholder="Add a tag…"
          />
        </div>
      </div>
    )
  }

  // ── New show mode ──────────────────────────────────────────────────────────
  return (
    <div className={cx("flex flex-col gap-4", className)}>
      <AccordionPanel
        number={1}
        title="Create New Show"
        open={showOpen}
        onToggle={() => setShowOpen(v => !v)}>
        <div>
          <FieldLabel htmlFor={showTitleId} required>Podcast Title</FieldLabel>
          <div className="flex flex-col gap-1">
            <TextInput
              id={showTitleId}
              value={values.showTitle}
              onChange={e => patch({ showTitle: e.target.value })}
              placeholder="Enter a title…"
            />
            <p className="text-xs text-text-tertiary">Include episode number in the Title</p>
          </div>
        </div>

        <div>
          <FieldLabel>Podcast Artwork</FieldLabel>
          <ImageDropzone
            file={values.showArtworkFile}
            onFile={f => patch({ showArtworkFile: f })}
            hint="SVG, PNG, JPG or GIF (max. 800×400px)"
            label="Upload podcast artwork"
          />
        </div>

        <div>
          <FieldLabel required>Podcast Description</FieldLabel>
          <RichTextArea
            onChange={html => patch({ showDescription: html })}
            placeholder="Write a description…"
            charLimit={1024}
          />
        </div>

        <div>
          <FieldLabel>Tags / Metadata</FieldLabel>
          <TagsInput
            tags={values.showTags}
            onAdd={makeTagAdder("showTags")}
            onRemove={makeTagRemover("showTags")}
            placeholder="Add a tag…"
          />
        </div>

        <RssFeedField
          value={values.showRssFeed}
          onChange={v => patch({ showRssFeed: v })}
          label="Rss Feed"
          placeholder="https://"
        />
      </AccordionPanel>

      <AccordionPanel
        number={2}
        title="Create New Episode"
        open={episodeOpen}
        onToggle={() => setEpisodeOpen(v => !v)}>
        <div>
          <FieldLabel htmlFor={episodeTitleId}>Episode Title</FieldLabel>
          <div className="flex flex-col gap-1">
            <TextInput
              id={episodeTitleId}
              value={values.episodeTitle}
              onChange={e => patch({ episodeTitle: e.target.value })}
              placeholder="Enter a title…"
            />
            <p className="text-xs text-text-tertiary">Include episode number in the Title</p>
          </div>
        </div>

        <div>
          <FieldLabel>Episode Thumbnail</FieldLabel>
          <ImageDropzone
            file={values.episodeThumbnailFile}
            onFile={f => patch({ episodeThumbnailFile: f })}
            hint="SVG, PNG, JPG or GIF (max. 800×400px)"
            label="Upload episode thumbnail"
          />
        </div>

        <div>
          <FieldLabel required>Episode Description</FieldLabel>
          <RichTextArea
            onChange={html => patch({ episodeDescription: html })}
            placeholder="Write a description…"
            charLimit={1024}
          />
        </div>

        <div>
          <FieldLabel>Tags / Metadata</FieldLabel>
          <TagsInput
            tags={values.episodeTags}
            onAdd={makeTagAdder("episodeTags")}
            onRemove={makeTagRemover("episodeTags")}
            placeholder="Add a tag…"
          />
        </div>
      </AccordionPanel>
    </div>
  )
}
