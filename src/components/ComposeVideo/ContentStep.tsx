"use client"

import { useState, useRef, type Dispatch, type SetStateAction } from "react"
import {
  UploadCloud01,
  XClose,
  Edit03,
  CheckCircle,
  Trash01,
  ArrowRight,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { Toggle, TimeSegment } from "@/components/Compose"

// ── Public types ──────────────────────────────────────────────────────────────

export type VideoContentValues = {
  videoFile: File | null
  /** Upload progress 0–100. -1 = not started, 100 = complete */
  uploadProgress: number
  autoGeneratePreview: boolean
  previewHours: number
  previewMinutes: number
  previewSeconds: number
  previewFile: File | null
}

export type VideoContentStepProps = {
  videoTitle: string
  onVideoTitleChange: (title: string) => void
  values: VideoContentValues
  onChange: Dispatch<SetStateAction<VideoContentValues>>
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function VideoContentStep({
  videoTitle,
  onVideoTitleChange,
  values,
  onChange,
  className,
}: VideoContentStepProps) {
  const mainInputRef = useRef<HTMLInputElement>(null)
  const previewInputRef = useRef<HTMLInputElement>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(videoTitle)
  const [mainDragging, setMainDragging] = useState(false)
  const [previewDragging, setPreviewDragging] = useState(false)

  function patch(partial: Partial<VideoContentValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  function commitTitle() {
    setEditingTitle(false)
    onVideoTitleChange(titleDraft.trim() || videoTitle)
  }

  function handleVideoFile(files: FileList | null) {
    if (!files?.[0]) return
    patch({ videoFile: files[0], uploadProgress: 100 })
  }

  function handlePreviewFile(files: FileList | null) {
    if (!files?.[0]) return
    patch({ previewFile: files[0] })
  }

  const totalSecs =
    values.previewHours * 3600 +
    values.previewMinutes * 60 +
    values.previewSeconds

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {/* ── Video title (editable) ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-4 rounded-xl border border-app-border bg-app-card">
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={e => {
              if (e.key === "Enter") commitTitle()
            }}
            className="flex-1 text-heading-list-item text-text-primary bg-transparent outline-none border-b border-brand-500"
          />
        ) : (
          <span className="flex-1 text-heading-list-item text-text-primary">
            {videoTitle || "Video Title"}
          </span>
        )}
        <IconButton
          icon={Edit03}
          label="Edit title"
          variant="ghost"
          size="sm"
          iconSize={18}
          onClick={() => {
            setTitleDraft(videoTitle)
            setEditingTitle(true)
          }}
        />
      </div>

      {/* ── Upload Video ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-app-border bg-app-card">
        <div>
          <h3 className="text-heading-card text-text-primary mb-1">
            Upload Video
          </h3>
          <p className="text-body-small text-text-tertiary">
            Upload your video file.
          </p>
        </div>

        {values.videoFile && values.uploadProgress >= 0 ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-surface">
            <div className="flex items-center justify-center size-10 rounded-lg bg-brand-600/10 shrink-0">
              <span className="text-xs font-bold text-brand-500 uppercase">
                {values.videoFile.name.split(".").pop() ?? "mp4"}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <span className="text-sm font-semibold text-text-primary truncate">
                {values.videoFile.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span>
                  {(values.videoFile.size / 1024 / 1024).toFixed(0)} MB
                </span>
                {values.uploadProgress === 100 && (
                  <>
                    <span>·</span>
                    <CheckCircle
                      size={12}
                      color="var(--color-utility-green-600)"
                      aria-hidden="true"
                    />
                    <span className="text-utility-green-600">100%</span>
                  </>
                )}
              </div>
            </div>
            <IconButton
              icon={Trash01}
              label="Remove video"
              variant="ghost"
              size="sm"
              onClick={() => patch({ videoFile: null, uploadProgress: -1 })}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => mainInputRef.current?.click()}
            onDragOver={e => {
              e.preventDefault()
              setMainDragging(true)
            }}
            onDragLeave={() => setMainDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setMainDragging(false)
              handleVideoFile(e.dataTransfer.files)
            }}
            className={cx(
              "flex flex-col items-center justify-center gap-3 w-full py-10 px-6 rounded-xl",
              "border-2 border-dashed cursor-pointer transition-colors duration-150",
              mainDragging
                ? "border-brand-600 bg-brand-600/5"
                : "border-app-border hover:bg-app-surface hover:border-app-border-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}
            aria-label="Upload video file">
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
              <span className="text-xs text-text-tertiary">
                MP4, MOV, AVI, WebM
              </span>
            </div>
          </button>
        )}

        <input
          ref={mainInputRef}
          type="file"
          accept="video/*"
          className="sr-only"
          aria-hidden="true"
          onChange={e => handleVideoFile(e.target.files)}
        />
      </div>

      {/* ── Auto-Generate Preview ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border border-app-border bg-app-card">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-heading-card text-text-primary">
              Auto-Generate Preview Content
            </h3>
            <p className="text-body-small text-text-tertiary">
              Don't have a preview clip? Auto-create one by showing a portion of
              your video.
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
            Upload Preview Content
          </h3>
          <p className="text-body-small text-text-tertiary">
            Already have a preview clip? Upload it here.
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
              handlePreviewFile(e.dataTransfer.files)
            }}
            className={cx(
              "flex flex-col items-center justify-center gap-3 w-full py-10 px-6 rounded-xl",
              "border-2 border-dashed cursor-pointer transition-colors duration-150",
              previewDragging
                ? "border-brand-600 bg-brand-600/5"
                : "border-app-border hover:bg-app-surface hover:border-app-border-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}
            aria-label="Upload preview content">
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
          onChange={e => handlePreviewFile(e.target.files)}
        />
      </div>
    </div>
  )
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function defaultVideoContentValues(): VideoContentValues {
  return {
    videoFile: null,
    uploadProgress: -1,
    autoGeneratePreview: false,
    previewHours: 0,
    previewMinutes: 0,
    previewSeconds: 20,
    previewFile: null,
  }
}
