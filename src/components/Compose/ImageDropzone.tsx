"use client"

import { useRef, useState } from "react"
import { UploadCloud01, XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

export type ImageDropzoneProps = {
  file: File | null
  onFile: (f: File | null) => void
  /** Short hint shown below "Click to upload", e.g. "PNG, JPG (max 800×400px)" */
  hint: string
  /** Accessible label for the dropzone button */
  label: string
  /** File accept attribute. Default: "image/*" */
  accept?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ImageDropzone({ file, onFile, hint, label, accept = "image/*" }: ImageDropzoneProps) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="size-10 rounded-md object-cover shrink-0"
          />
          <span className="flex-1 text-sm text-text-primary truncate min-w-0">{file.name}</span>
          <IconButton
            icon={XClose}
            label="Remove"
            variant="ghost"
            size="xs"
            onClick={() => onFile(null)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0])
          }}
          className={cx(
            "flex flex-col items-center justify-center gap-2 w-full py-7 px-4 rounded-xl",
            "border-2 border-dashed cursor-pointer transition-colors duration-150",
            dragging
              ? "border-brand-600 bg-brand-600/5"
              : "border-app-border bg-app-card hover:bg-app-card-active hover:border-app-border-hover",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          )}
          aria-label={label}>
          <div className="flex items-center justify-center size-10 rounded-lg bg-brand-600/10">
            <UploadCloud01 size={20} color="var(--color-brand-600)" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-sm text-text-secondary">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </span>
            <span className="text-xs text-text-tertiary">{hint}</span>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        aria-hidden="true"
        onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]) }}
      />
    </div>
  )
}
