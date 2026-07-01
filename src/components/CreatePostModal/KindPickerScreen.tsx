"use client"

import type { FC, SVGProps } from "react"
import {
  AlignLeft,
  BookOpen01,
  Headphones01,
  Image01,
  MessageTextSquare02,
  Microphone01,
  VideoRecorder,
  XClose,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { IconButton } from "@/components/IconButton"

// ── Public types ──────────────────────────────────────────────────────────────

/** Nostr-aligned content type the user is creating. */
export type PostKind =
  | "note"
  | "article"
  | "book"
  | "audiobook"
  | "podcast"
  | "video"
  | "image"

export type KindFlow = "simple" | "structured"

export type IconComponent = FC<
  SVGProps<SVGSVGElement> & {
    size?: number
    color?: string
    "aria-hidden"?: boolean | "true" | "false"
  }
>

export type KindDef = {
  id: PostKind
  label: string
  description: string
  icon: IconComponent
  available: boolean
  /** "simple" = kind-picker → note-editor → [priceSplits] → published
   *  "structured" = kind-picker → setup → content-upload → priceSplits → published */
  flow: KindFlow
}

export type KindPickerScreenProps = {
  onClose: () => void
  onSelect: (kind: PostKind) => void
}

// ── Static config ────────────────────────────────────────────────────────────

export const KINDS: KindDef[] = [
  { id: "note",      label: "Note",      description: "Share a short text post with the network", icon: MessageTextSquare02, available: true,  flow: "simple" },
  { id: "article",   label: "Article",   description: "Write a long-form article or blog post",   icon: AlignLeft,           available: true,  flow: "structured" },
  { id: "book",      label: "Book",      description: "Publish an ebook or written work",         icon: BookOpen01,          available: false, flow: "structured" },
  { id: "audiobook", label: "Audiobook", description: "Publish a narrated audio edition",         icon: Headphones01,        available: true,  flow: "structured" },
  { id: "podcast",   label: "Podcast",   description: "Create a podcast show and publish episodes", icon: Microphone01,      available: true,  flow: "structured" },
  { id: "video",     label: "Video",     description: "Upload and share a video",                 icon: VideoRecorder,       available: true,  flow: "structured" },
  { id: "image",     label: "Image",     description: "Share photos or illustrations",            icon: Image01,             available: false, flow: "simple" },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function KindCard({ kind, onClick }: { kind: KindDef; onClick: () => void }) {
  const { icon: Icon, label, description, available } = kind
  return (
    <button
      type="button"
      disabled={!available}
      onClick={available ? onClick : undefined}
      className={cx(
        "flex sm:flex-col items-center sm:items-start gap-3 p-4 rounded-xl text-left w-full",
        "border border-app-border bg-app-card",
        "transition-colors duration-150",
        available
          ? "cursor-pointer hover:bg-app-card-active hover:border-app-border-hover"
          : "cursor-default opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface"
      )}>
      <div className="flex items-center justify-center size-10 rounded-xl shrink-0 bg-brand-600/10">
        <Icon size={20} color="var(--color-brand-600)" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-0.5 flex-1 sm:flex-none min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-heading-card text-text-primary">{label}</span>
          {!available && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-app-surface-raised text-text-tertiary shrink-0">
              Soon
            </span>
          )}
        </div>
        <span className="text-body-small text-text-tertiary leading-5">{description}</span>
      </div>
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function KindPickerScreen({ onClose, onSelect }: KindPickerScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-list-item text-text-primary">Create a Post</h2>
          <p className="text-body-small text-text-tertiary">
            Choose the type of content you want to share.
          </p>
        </div>
        <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {KINDS.map(kind => (
          <KindCard key={kind.id} kind={kind} onClick={() => onSelect(kind.id)} />
        ))}
      </div>
    </div>
  )
}
