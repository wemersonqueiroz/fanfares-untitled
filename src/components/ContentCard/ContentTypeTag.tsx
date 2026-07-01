import type { FC, SVGProps } from "react"
import {
  BookOpen01,
  File06,
  Film01,
  Headphones01,
  LayersThree01,
  Microphone01,
  MusicNote01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"

// ── Public types ──────────────────────────────────────────────────────────────

export type ContentType =
  | "article"
  | "note"
  | "book"
  | "collection"
  | "podcast"
  | "podcast-show"
  | "audiobook"
  | "video"
  | "video-show"
  | "song"
  | "album"

export type ContentTypeTagProps = {
  type: ContentType
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number; color?: string }>

type TagConfig = {
  label: string
  Icon: IconComponent
  scheme: "blue" | "purple"
}

const CONFIG: Record<ContentType, TagConfig> = {
  article:          { label: "Article",      Icon: File06,        scheme: "blue"   },
  note:             { label: "Note",         Icon: File06,        scheme: "blue"   },
  book:             { label: "Book",         Icon: BookOpen01,    scheme: "blue"   },
  collection:       { label: "Collection",   Icon: LayersThree01, scheme: "blue"   },
  podcast:          { label: "Podcast",      Icon: Microphone01,  scheme: "purple" },
  "podcast-show":   { label: "Podcast Show", Icon: Microphone01,  scheme: "purple" },
  audiobook:        { label: "Audiobook",    Icon: Headphones01,  scheme: "purple" },
  video:            { label: "Video",        Icon: Film01,        scheme: "purple" },
  "video-show":     { label: "Video Show",   Icon: Film01,        scheme: "purple" },
  song:             { label: "Song",         Icon: MusicNote01,   scheme: "purple" },
  album:            { label: "Album",        Icon: MusicNote01,   scheme: "purple" },
}

/**
 * Uses Untitled UI `utility-*` semantic tokens which auto-flip light↔dark.
 * In dark mode: utility-*-50 → *-950 (dark bg), utility-*-200 → *-800 (border),
 * utility-*-700 → *-300 (light icon/text on dark bg).
 * In light mode: the 50/200/700 stops give a soft coloured pill on a white surface.
 */
const SCHEME: Record<"blue" | "purple", string> = {
  blue:   "bg-utility-blue-50  border-utility-blue-200  text-utility-blue-700",
  purple: "bg-utility-brand-50 border-utility-brand-200 text-utility-brand-700",
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ContentTypeTag({ type, className }: ContentTypeTagProps) {
  const { label, Icon, scheme } = CONFIG[type]
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5",
        "rounded-full border text-xs font-medium whitespace-nowrap shrink-0",
        SCHEME[scheme],
        className
      )}>
      <Icon size={12} color="currentColor" aria-hidden="true" />
      {label}
    </span>
  )
}
