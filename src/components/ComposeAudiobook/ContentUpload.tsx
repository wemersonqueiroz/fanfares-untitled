"use client"

import { useState, useRef } from "react"
import { UploadCloud01, XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

export type ContentUploadProps = {
  /** File types to accept, e.g. "audio/*" or "application/epub+zip,.pdf" */
  accept?: string
  /** Label shown in the dropzone, e.g. "audio file" or "ebook file" */
  fileLabel?: string
  value?: File | null
  onChange: (file: File | null) => void
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ContentUpload({
  accept,
  fileLabel = "file",
  value,
  onChange,
  className,
}: ContentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) onChange(files[0])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {value ? (
        /* ── Selected file row ─────────────────────────────────────────── */
        <div className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-card">
          <div className="flex items-center justify-center size-10 rounded-lg bg-brand-600/10 shrink-0">
            <UploadCloud01 size={20} color="var(--color-brand-600)" aria-hidden="true" />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {value.name}
            </span>
            <span className="text-xs text-text-tertiary">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          <IconButton
            icon={XClose}
            label="Remove file"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
          />
        </div>
      ) : (
        /* ── Dropzone ────────────────────────────────────────────────────── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cx(
            "flex flex-col items-center justify-center gap-3 w-full py-10 px-6 rounded-xl",
            "border-2 border-dashed cursor-pointer",
            "transition-colors duration-150",
            dragging
              ? "border-brand-600 bg-brand-600/5"
              : "border-app-border bg-app-card hover:bg-app-card-active hover:border-app-border-hover",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          )}
          aria-label={`Upload ${fileLabel}`}>
          {/* Upload icon circle */}
          <div className="flex items-center justify-center size-12 rounded-xl bg-brand-600/10">
            <UploadCloud01 size={24} color="var(--color-brand-600)" aria-hidden="true" />
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-semibold text-text-primary">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-text-tertiary">
              Upload your {fileLabel} here
            </span>
          </div>
        </button>
      )}

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-hidden="true"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
