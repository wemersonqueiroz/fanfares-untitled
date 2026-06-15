"use client"

import { useState, useRef, type Dispatch, type SetStateAction } from "react"
import {
  UploadCloud01,
  XClose,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Trash01,
  ArrowRight,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { Toggle, TimeSegment } from "@/components/Compose"
import { createId } from "@/utils/createId"

// ── Public types ──────────────────────────────────────────────────────────────

export type ShowEpisodeContent = {
  id: string
  title: string
  videoFile: File | null
  audioFile: File | null
  uploadProgress: number // -1 = not started, 0-100
}

export type ShowSeasonContent = {
  id: string
  number: number
  open: boolean
  episodes: ShowEpisodeContent[]
}

export type ShowContentValues = {
  seasons: ShowSeasonContent[]
  autoGeneratePreview: boolean
  previewHours: number
  previewMinutes: number
  previewSeconds: number
  previewFile: File | null
}

export type ShowContentStepProps = {
  showTitle: string
  values: ShowContentValues
  onChange: Dispatch<SetStateAction<ShowContentValues>>
  className?: string
}

// ── EpisodeRow ────────────────────────────────────────────────────────────────

function EpisodeRow({
  episode,
  index,
  onVideoFile,
  onAudioFile,
  onTitleChange,
  onRemove,
}: {
  episode: ShowEpisodeContent
  index: number
  onVideoFile: (f: File) => void
  onAudioFile: (f: File) => void
  onTitleChange: (title: string) => void
  onRemove: () => void
}) {
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const [videoDrag, setVideoDrag] = useState(false)
  const [audioDrag, setAudioDrag] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [draft, setDraft] = useState(episode.title)

  function commitTitle() {
    setEditingTitle(false)
    onTitleChange(draft.trim() || episode.title)
  }

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border border-app-border bg-app-surface">
      {/* Episode header */}
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center size-6 rounded-full bg-app-card text-xs font-semibold text-text-tertiary shrink-0">
          {index + 1}
        </span>
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={e => {
              if (e.key === "Enter") commitTitle()
            }}
            className="flex-1 text-sm font-semibold text-text-primary bg-transparent outline-none border-b border-brand-500"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(episode.title)
              setEditingTitle(true)
            }}
            className="flex-1 text-sm font-semibold text-text-primary text-left hover:text-brand-500 transition-colors duration-150 focus-visible:outline-none truncate">
            {episode.title}
          </button>
        )}
        <IconButton
          icon={Trash01}
          label="Remove episode"
          variant="ghost"
          size="xs"
          onClick={onRemove}
        />
      </div>

      {/* Two-column upload zones */}
      <div className="grid grid-cols-2 gap-2">
        {/* Video upload */}
        {episode.videoFile ? (
          <div className="flex items-center gap-2 p-2 rounded-lg border border-app-border bg-app-card">
            <div className="flex items-center justify-center size-8 rounded-md bg-brand-600/10 shrink-0">
              <span className="text-[10px] font-bold text-brand-500 uppercase">
                {episode.videoFile.name.split(".").pop() ?? "mp4"}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-xs font-medium text-text-primary truncate">
                {episode.videoFile.name}
              </span>
              {episode.uploadProgress === 100 && (
                <div className="flex items-center gap-1">
                  <CheckCircle
                    size={10}
                    color="var(--color-utility-green-600)"
                    aria-hidden="true"
                  />
                  <span className="text-xs text-utility-green-600">Ready</span>
                </div>
              )}
            </div>
            <IconButton
              icon={XClose}
              label="Remove video"
              variant="ghost"
              size="xs"
              onClick={() => {
                /* handled by parent via onVideoFile(null) — skip for now */
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            onDragOver={e => {
              e.preventDefault()
              setVideoDrag(true)
            }}
            onDragLeave={() => setVideoDrag(false)}
            onDrop={e => {
              e.preventDefault()
              setVideoDrag(false)
              if (e.dataTransfer.files[0]) onVideoFile(e.dataTransfer.files[0])
            }}
            className={cx(
              "flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-lg",
              "border-2 border-dashed cursor-pointer transition-colors duration-150 text-center",
              videoDrag
                ? "border-brand-600 bg-brand-600/5"
                : "border-app-border bg-app-card hover:border-app-border-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}
            aria-label="Upload video">
            <UploadCloud01
              size={16}
              color="var(--color-brand-500)"
              aria-hidden="true"
            />
            <span className="text-xs text-text-tertiary font-medium">
              Upload Video
            </span>
            <span className="text-[11px] text-text-quaternary">
              MP4, MOV, WebM
            </span>
          </button>
        )}

        {/* Audio upload */}
        {episode.audioFile ? (
          <div className="flex items-center gap-2 p-2 rounded-lg border border-app-border bg-app-card">
            <div className="flex items-center justify-center size-8 rounded-md bg-brand-600/10 shrink-0">
              <span className="text-[10px] font-bold text-brand-500 uppercase">
                {episode.audioFile.name.split(".").pop() ?? "mp3"}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
              <span className="text-xs font-medium text-text-primary truncate">
                {episode.audioFile.name}
              </span>
              <CheckCircle
                size={10}
                color="var(--color-utility-green-600)"
                aria-hidden="true"
              />
            </div>
            <IconButton
              icon={XClose}
              label="Remove audio"
              variant="ghost"
              size="xs"
              onClick={() => {
                /* no-op for now */
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            onDragOver={e => {
              e.preventDefault()
              setAudioDrag(true)
            }}
            onDragLeave={() => setAudioDrag(false)}
            onDrop={e => {
              e.preventDefault()
              setAudioDrag(false)
              if (e.dataTransfer.files[0]) onAudioFile(e.dataTransfer.files[0])
            }}
            className={cx(
              "flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-lg",
              "border-2 border-dashed cursor-pointer transition-colors duration-150 text-center",
              audioDrag
                ? "border-brand-600 bg-brand-600/5"
                : "border-app-border bg-app-card hover:border-app-border-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}
            aria-label="Upload audio">
            <UploadCloud01
              size={16}
              color="var(--color-brand-500)"
              aria-hidden="true"
            />
            <span className="text-xs text-text-tertiary font-medium">
              Upload Audio
            </span>
            <span className="text-[11px] text-text-quaternary">
              MP3, WAV, AAC
            </span>
          </button>
        )}
      </div>

      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="sr-only"
        aria-hidden="true"
        onChange={e => {
          if (e.target.files?.[0]) onVideoFile(e.target.files[0])
        }}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="sr-only"
        aria-hidden="true"
        onChange={e => {
          if (e.target.files?.[0]) onAudioFile(e.target.files[0])
        }}
      />
    </div>
  )
}

// ── SeasonBlock ───────────────────────────────────────────────────────────────

function SeasonBlock({
  season,
  onToggle,
  onAddEpisode,
  onRemoveEpisode,
  onEpisodeVideoFile,
  onEpisodeAudioFile,
  onEpisodeTitleChange,
}: {
  season: ShowSeasonContent
  onToggle: () => void
  onAddEpisode: () => void
  onRemoveEpisode: (episodeId: string) => void
  onEpisodeVideoFile: (episodeId: string, file: File) => void
  onEpisodeAudioFile: (episodeId: string, file: File) => void
  onEpisodeTitleChange: (episodeId: string, title: string) => void
}) {
  return (
    <div className="flex flex-col rounded-xl border border-app-border bg-app-card overflow-hidden">
      {/* Season header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between px-4 py-3.5 text-left cursor-pointer hover:bg-app-card-active transition-colors duration-150 focus-visible:outline-none">
        <div className="flex flex-col gap-0.5">
          <span className="text-heading-card text-text-primary">
            Upload Season {season.number}
          </span>
          <span className="text-xs text-text-tertiary">
            {season.episodes.length} episode
            {season.episodes.length !== 1 ? "s" : ""}
          </span>
        </div>
        {season.open ? (
          <ChevronUp
            size={20}
            color="var(--color-text-tertiary)"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            size={20}
            color="var(--color-text-tertiary)"
            aria-hidden="true"
          />
        )}
      </button>

      {season.open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="border-t border-app-border -mx-4 mb-1" />

          {/* Episode rows */}
          {season.episodes.map((ep, i) => (
            <EpisodeRow
              key={ep.id}
              episode={ep}
              index={i}
              onVideoFile={f => onEpisodeVideoFile(ep.id, f)}
              onAudioFile={f => onEpisodeAudioFile(ep.id, f)}
              onTitleChange={title => onEpisodeTitleChange(ep.id, title)}
              onRemove={() => onRemoveEpisode(ep.id)}
            />
          ))}

          {/* Add episode */}
          <button
            type="button"
            onClick={onAddEpisode}
            className={cx(
              "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg",
              "border border-dashed border-app-border text-text-tertiary text-sm font-medium",
              "hover:border-app-border-hover hover:text-text-secondary transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}>
            <Plus size={16} color="currentColor" aria-hidden="true" />
            Add Episode
          </button>
        </div>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ShowContentStep({
  showTitle,
  values,
  onChange,
  className,
}: ShowContentStepProps) {
  const previewInputRef = useRef<HTMLInputElement>(null)
  const [previewDragging, setPreviewDragging] = useState(false)

  function patch(partial: Partial<ShowContentValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  // ── Season helpers ────────────────────────────────────────────────────────

  function toggleSeason(seasonId: string) {
    onChange(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId ? { ...s, open: !s.open } : s
      ),
    }))
  }

  function addSeason() {
    onChange(prev => {
      const number = prev.seasons.length + 1
      const newSeason: ShowSeasonContent = {
        id: createId("season"),
        number,
        open: true,
        episodes: [
          {
            id: createId("ep"),
            title: `Episode 1`,
            videoFile: null,
            audioFile: null,
            uploadProgress: -1,
          },
        ],
      }
      return { ...prev, seasons: [...prev.seasons, newSeason] }
    })
  }

  function addEpisode(seasonId: string) {
    onChange(prev => ({
      ...prev,
      seasons: prev.seasons.map(s => {
        if (s.id !== seasonId) return s
        const num = s.episodes.length + 1
        return {
          ...s,
          episodes: [
            ...s.episodes,
            {
              id: createId("ep"),
              title: `Episode ${num}`,
              videoFile: null,
              audioFile: null,
              uploadProgress: -1,
            },
          ],
        }
      }),
    }))
  }

  function removeEpisode(seasonId: string, episodeId: string) {
    onChange(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId
          ? { ...s, episodes: s.episodes.filter(e => e.id !== episodeId) }
          : s
      ),
    }))
  }

  function setEpisodeVideoFile(
    seasonId: string,
    episodeId: string,
    file: File
  ) {
    onChange(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId
          ? {
              ...s,
              episodes: s.episodes.map(e =>
                e.id === episodeId
                  ? { ...e, videoFile: file, uploadProgress: 100 }
                  : e
              ),
            }
          : s
      ),
    }))
  }

  function setEpisodeAudioFile(
    seasonId: string,
    episodeId: string,
    file: File
  ) {
    onChange(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId
          ? {
              ...s,
              episodes: s.episodes.map(e =>
                e.id === episodeId ? { ...e, audioFile: file } : e
              ),
            }
          : s
      ),
    }))
  }

  function setEpisodeTitle(seasonId: string, episodeId: string, title: string) {
    onChange(prev => ({
      ...prev,
      seasons: prev.seasons.map(s =>
        s.id === seasonId
          ? {
              ...s,
              episodes: s.episodes.map(e =>
                e.id === episodeId ? { ...e, title } : e
              ),
            }
          : s
      ),
    }))
  }

  const totalSecs =
    values.previewHours * 3600 +
    values.previewMinutes * 60 +
    values.previewSeconds

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {/* Show title badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-app-card border border-app-border">
        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
          Show
        </span>
        <span className="text-sm font-semibold text-text-primary">
          {showTitle || "Untitled Show"}
        </span>
      </div>

      {/* ── Season blocks ───────────────────────────────────────────────── */}
      {values.seasons.map(season => (
        <SeasonBlock
          key={season.id}
          season={season}
          onToggle={() => toggleSeason(season.id)}
          onAddEpisode={() => addEpisode(season.id)}
          onRemoveEpisode={epId => removeEpisode(season.id, epId)}
          onEpisodeVideoFile={(epId, f) =>
            setEpisodeVideoFile(season.id, epId, f)
          }
          onEpisodeAudioFile={(epId, f) =>
            setEpisodeAudioFile(season.id, epId, f)
          }
          onEpisodeTitleChange={(epId, title) =>
            setEpisodeTitle(season.id, epId, title)
          }
        />
      ))}

      {/* Add Season */}
      <button
        type="button"
        onClick={addSeason}
        className={cx(
          "flex items-center justify-center gap-2 w-full py-3 rounded-xl",
          "border border-dashed border-app-border text-text-tertiary text-sm font-semibold",
          "hover:border-app-border-hover hover:text-text-secondary transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
        )}>
        <Plus size={16} color="currentColor" aria-hidden="true" />
        Add Season
      </button>

      {/* ── Auto-Generate Preview ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-app-border bg-app-card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-heading-card text-text-primary">
              Auto-Generate Preview Content
            </h3>
            <p className="text-body-small text-text-tertiary">
              Auto-create previews by showing the opening portion of each
              episode.
            </p>
          </div>
          <Toggle
            checked={values.autoGeneratePreview}
            onChange={v => patch({ autoGeneratePreview: v })}
            label="Toggle auto-generate preview"
          />
        </div>

        {values.autoGeneratePreview && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-text-secondary">
              Preview length:
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <TimeSegment
                value={values.previewHours}
                max={23}
                label="Hours"
                onChange={v => patch({ previewHours: v })}
              />
              <span className="text-text-tertiary font-semibold">:</span>
              <TimeSegment
                value={values.previewMinutes}
                max={59}
                label="Minutes"
                onChange={v => patch({ previewMinutes: v })}
              />
              <span className="text-text-tertiary font-semibold">:</span>
              <TimeSegment
                value={values.previewSeconds}
                max={59}
                label="Seconds"
                onChange={v => patch({ previewSeconds: v })}
              />
              <span className="text-sm text-text-tertiary ml-1">
                = {totalSecs} second{totalSecs !== 1 ? "s" : ""}
              </span>
              <Button
                variant="primary"
                size="sm"
                iconRight={ArrowRight}
                className="ml-auto">
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Upload Preview Content ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-app-border bg-app-card">
        <div>
          <h3 className="text-heading-card text-text-primary mb-1">
            Upload Preview Clip
          </h3>
          <p className="text-body-small text-text-tertiary">
            Already have a preview video for the show? Upload it here.
          </p>
        </div>

        {values.previewFile ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-surface">
            <div className="flex items-center justify-center size-10 rounded-lg bg-brand-600/10 shrink-0">
              <UploadCloud01
                size={18}
                color="var(--color-brand-600)"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-text-primary truncate">
                {values.previewFile.name}
              </span>
              <span className="text-xs text-text-tertiary">
                {(values.previewFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <IconButton
              icon={XClose}
              label="Remove preview"
              variant="ghost"
              size="sm"
              onClick={() => patch({ previewFile: null })}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => previewInputRef.current?.click()}
            onDragOver={e => {
              e.preventDefault()
              setPreviewDragging(true)
            }}
            onDragLeave={() => setPreviewDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setPreviewDragging(false)
              if (e.dataTransfer.files[0])
                patch({ previewFile: e.dataTransfer.files[0] })
            }}
            className={cx(
              "flex flex-col items-center justify-center gap-3 w-full py-8 px-6 rounded-xl",
              "border-2 border-dashed cursor-pointer transition-colors duration-150",
              previewDragging
                ? "border-brand-600 bg-brand-600/5"
                : "border-app-border hover:bg-app-surface hover:border-app-border-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}
            aria-label="Upload preview clip">
            <div className="flex items-center justify-center size-10 rounded-lg bg-brand-600/10">
              <UploadCloud01
                size={20}
                color="var(--color-brand-600)"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-sm text-text-primary">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </span>
              <span className="text-xs text-text-tertiary">MP4, MOV, WebM</span>
            </div>
          </button>
        )}

        <input
          ref={previewInputRef}
          type="file"
          accept="video/*"
          className="sr-only"
          aria-hidden="true"
          onChange={e => {
            if (e.target.files?.[0]) patch({ previewFile: e.target.files[0] })
          }}
        />
      </div>
    </div>
  )
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function defaultShowContentValues(): ShowContentValues {
  return {
    seasons: [
      {
        id: createId("season"),
        number: 1,
        open: true,
        episodes: [
          {
            id: createId("ep"),
            title: "Episode 1",
            videoFile: null,
            audioFile: null,
            uploadProgress: -1,
          },
        ],
      },
    ],
    autoGeneratePreview: false,
    previewHours: 0,
    previewMinutes: 0,
    previewSeconds: 20,
    previewFile: null,
  }
}
