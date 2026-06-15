"use client"

import { useState, useRef, useCallback, type FC, type SVGProps } from "react"
import {
  XClose,
  Edit01,
  AlignLeft,
  MessageTextSquare02,
  Image01,
  VideoRecorder,
  Microphone01,
  Bold01,
  Italic01,
  Underline01,
  FaceSmile,
  Plus,
  CheckCircle,
  Share07,
  BookOpen01,
  Headphones01,
  ArrowNarrowRight,
  Send01,
  ArrowLeft,
  Film01,
  Tv01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { Modal } from "@/components/Modal"
import { ProgressStepper, type StepperStep } from "./ProgressStepper"
import type { PaymentSplit } from "./PriceSplits"
import { MonetisationStep, defaultMonetisationState, type MonetisationState } from "./MonetisationStep"
import { ImageCropper } from "./ImageCropper"
import { ComposeAudiobook, type ComposeAudiobookValues } from "@/components/ComposeAudiobook"
import { ContentUpload } from "@/components/ComposeAudiobook/ContentUpload"
import { ComposePodcast, type ComposePodcastValues } from "@/components/ComposePodcast"
import { PodcastContentStep, type PodcastContentValues } from "@/components/ComposePodcast/ContentStep"
import { ArticleEditor, defaultArticleValues, type ArticleValues } from "@/components/ComposeArticle/Editor"
import { ComposeVideo, defaultComposeVideoValues, type ComposeVideoValues } from "@/components/ComposeVideo"
import { VideoContentStep, defaultVideoContentValues, type VideoContentValues } from "@/components/ComposeVideo/ContentStep"
import { ComposeShow, defaultComposeShowValues, type ComposeShowValues } from "@/components/ComposeShow"
import { ShowContentStep, defaultShowContentValues, type ShowContentValues } from "@/components/ComposeShow/ContentStep"

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

/** Whether a video is standalone or belongs to a show series. */
export type VideoMode = "single" | "show"

export type CreatePostModalProps = {
  isOpen: boolean
  onClose: () => void
  /** Authenticated user shown in the composer */
  currentUser?: {
    avatarUrl?: string
    name?: string
  }
  /** Fired when the user submits a post — receives kind + plain-text body */
  onPublish?: (kind: PostKind, content: string) => void
  /** Fired when "Share & Earn" is clicked in the success screen */
  onShareAndEarn?: () => void
  /** Fired when "View Your Note / Article / …" is clicked in the success screen */
  onViewPost?: () => void
  /** Fired when the image button in the toolbar is clicked */
  onAddMedia?: () => void
}

// ── Internals ─────────────────────────────────────────────────────────────────

type IconComponent = FC<
  SVGProps<SVGSVGElement> & {
    size?: number
    color?: string
    "aria-hidden"?: boolean | "true" | "false"
  }
>

type KindDef = {
  id: PostKind
  label: string
  description: string
  icon: IconComponent
  available: boolean
  /** "simple" = kind-picker → note-editor → [priceSplits] → published
   *  "structured" = kind-picker → setup → content-upload → priceSplits → published */
  flow: "simple" | "structured"
}

const KINDS: KindDef[] = [
  {
    id: "note",
    label: "Note",
    description: "Share a short text post with the network",
    icon: MessageTextSquare02,
    available: true,
    flow: "simple",
  },
  {
    id: "article",
    label: "Article",
    description: "Write a long-form article or blog post",
    icon: AlignLeft,
    available: true,
    flow: "structured",
  },
  {
    id: "book",
    label: "Book",
    description: "Publish an ebook or written work",
    icon: BookOpen01,
    available: false,
    flow: "structured",
  },
  {
    id: "audiobook",
    label: "Audiobook",
    description: "Publish a narrated audio edition",
    icon: Headphones01,
    available: true,
    flow: "structured",
  },
  {
    id: "podcast",
    label: "Podcast",
    description: "Create a podcast show and publish episodes",
    icon: Microphone01,
    available: true,
    flow: "structured",
  },
  {
    id: "video",
    label: "Video",
    description: "Upload and share a video",
    icon: VideoRecorder,
    available: true,
    flow: "structured",
  },
  {
    id: "image",
    label: "Image",
    description: "Share photos or illustrations",
    icon: Image01,
    available: false,
    flow: "simple",
  },
]

/**
 * All possible screen IDs.
 *   note:       kind-picker → note-editor → [price-splits] → published
 *   article:    kind-picker → article-editor → [article-crop] → price-splits → published
 *   structured: kind-picker → setup → content-upload → price-splits → published
 *   video:      kind-picker → video-type → (single: video-setup → video-content → price-splits)
 *                                       → (show:   show-setup  → show-content  → price-splits)
 *                                       → published
 */
type Screen =
  | "kind-picker"
  | "note-editor"
  | "article-editor"
  | "article-crop"
  | "setup"
  | "content-upload"
  | "price-splits"
  | "published"
  // video-specific screens
  | "video-type"
  | "video-setup"
  | "video-content"
  | "show-setup"
  | "show-content"

const STRUCTURED_STEPS: StepperStep[] = [
  { label: "Setup" },
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

const ARTICLE_STEPS: StepperStep[] = [
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

const VIDEO_SINGLE_STEPS: StepperStep[] = [
  { label: "Setup" },
  { label: "Content" },
  { label: "Monetisation" },
  { label: "Publish" },
]

const VIDEO_SHOW_STEPS: StepperStep[] = [
  { label: "Show Info" },
  { label: "Upload" },
  { label: "Monetisation" },
  { label: "Publish" },
]

function structuredActiveStep(screen: Screen): number {
  switch (screen) {
    case "setup": return 0
    case "content-upload": return 1
    case "price-splits": return 2
    default: return 3
  }
}

// ── Shared atoms ──────────────────────────────────────────────────────────────

function FormatBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: IconComponent
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card transition-colors duration-150 focus-visible:outline-none">
      <Icon size={20} color="currentColor" aria-hidden="true" />
    </button>
  )
}

function GifBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Insert GIF"
      onClick={onClick}
      className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card transition-colors duration-150 focus-visible:outline-none">
      <span className="flex items-center justify-center size-overlay-btn">
        <span className="flex items-center justify-center border border-current rounded px-0.5 text-2xs font-bold tracking-wide leading-none h-3.5">
          GIF
        </span>
      </span>
    </button>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 border-transparent shrink-0",
        "transition-colors duration-200",
        checked ? "bg-brand-600" : "bg-app-border",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      )}>
      <span
        className={cx(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0",
          "transform transition duration-200",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

// ── VideoTypeSelectScreen ─────────────────────────────────────────────────────

function VideoTypeSelectScreen({
  onClose,
  onBack,
  onSelect,
}: {
  onClose: () => void
  onBack: () => void
  onSelect: (mode: VideoMode) => void
}) {
  const options: Array<{
    mode: VideoMode
    icon: IconComponent
    label: string
    description: string
  }> = [
    {
      mode: "single",
      icon: Film01,
      label: "Single Video",
      description: "Upload a standalone video — great for one-off releases or clips.",
    },
    {
      mode: "show",
      icon: Tv01,
      label: "Part of a Show",
      description: "Create a video series with seasons and episodes.",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-list-item text-text-primary">Create New Video</h2>
          <p className="text-body-small text-text-tertiary">
            Is this a standalone video or part of a show?
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton icon={ArrowLeft} label="Back" variant="ghost" size="sm" iconSize={20} onClick={onBack} />
          <IconButton icon={XClose}    label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(({ mode, icon: Icon, label, description }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onSelect(mode)}
            className={cx(
              "flex sm:flex-col items-center sm:items-start gap-3 p-4 rounded-xl text-left w-full",
              "border border-app-border bg-app-card",
              "cursor-pointer hover:bg-app-card-active hover:border-app-border-hover transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface"
            )}>
            <div className="flex items-center justify-center size-10 rounded-xl shrink-0 bg-brand-600/10">
              <Icon size={20} color="var(--color-brand-600)" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 sm:flex-none min-w-0">
              <span className="text-heading-card text-text-primary">{label}</span>
              <span className="text-body-small text-text-tertiary leading-5">{description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── KindCard ──────────────────────────────────────────────────────────────────

function KindCard({ kind, onClick }: { kind: KindDef; onClick: () => void }) {
  const { icon: Icon, label, description, available } = kind
  return (
    <button
      type="button"
      disabled={!available}
      onClick={available ? onClick : undefined}
      className={cx(
        // Mobile: single row — icon left, text right
        // sm+: vertical card — icon top, text below
        "flex sm:flex-col items-center sm:items-start gap-3 p-4 rounded-xl text-left w-full",
        "border border-app-border bg-app-card",
        "transition-colors duration-150",
        available
          ? "cursor-pointer hover:bg-app-card-active hover:border-app-border-hover"
          : "cursor-default opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface"
      )}>
      {/* Icon */}
      <div className="flex items-center justify-center size-10 rounded-xl shrink-0 bg-brand-600/10">
        <Icon size={20} color="var(--color-brand-600)" aria-hidden="true" />
      </div>

      {/* Text — flex-1 on mobile so it fills the row */}
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

// ── KindPickerScreen ──────────────────────────────────────────────────────────

function KindPickerScreen({
  onClose,
  onSelect,
}: {
  onClose: () => void
  onSelect: (kind: PostKind) => void
}) {
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

// ── NoteEditorScreen ──────────────────────────────────────────────────────────

function NoteEditorScreen({
  currentUser,
  paidContent,
  onPaidContentChange,
  onBack,
  onClose,
  onPost,
  onContinueToPay,
  onAddMedia,
}: {
  currentUser?: { avatarUrl?: string; name?: string }
  paidContent: boolean
  onPaidContentChange: (v: boolean) => void
  onBack: () => void
  onClose: () => void
  onPost: (text: string) => void
  onContinueToPay: (text: string) => void
  onAddMedia?: () => void
}) {
  const [tab, setTab] = useState<"write" | "drafts">("write")
  const editorRef = useRef<HTMLParagraphElement>(null)

  const getContent = () => editorRef.current?.innerText?.trim() ?? ""

  const execFormat = (command: string) => {
    document.execCommand(command, false)
    editorRef.current?.focus()
  }

  return (
    <div className="flex flex-col">
      {/* Header: tabs + nav */}
      <div className="flex items-center justify-between pb-5">
        <div className={cx("flex gap-1 p-1 rounded-lg", "bg-app-surface border border-app-border")}>
          {(["write", "drafts"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={cx(
                "flex items-center gap-2 px-3 py-1.5 rounded-md",
                "text-sm font-semibold cursor-pointer transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50",
                tab === t
                  ? "bg-app-card text-text-primary shadow-sm"
                  : "text-text-quaternary hover:text-text-tertiary"
              )}>
              {t === "write" && <Edit01 size={14} color="currentColor" aria-hidden="true" />}
              {t === "write" ? "Write" : "Drafts"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <IconButton icon={ArrowLeft} label="Back" variant="ghost" size="sm" iconSize={20} onClick={onBack} />
          <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
        </div>
      </div>

      {tab === "write" ? (
        <>
          {/* Composer */}
          <div className="flex items-start gap-3 min-h-[144px]">
            <Avatar
              src={currentUser?.avatarUrl}
              name={currentUser?.name}
              size="md"
              className="border border-black/10 shrink-0 mt-0.5"
            />
            <p
              ref={editorRef}
              role="textbox"
              aria-multiline="true"
              aria-label="Compose your note"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="What's on your mind?"
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault()
                  paidContent ? onContinueToPay(getContent()) : onPost(getContent())
                }
              }}
              className={cx(
                "flex-1 outline-none focus:outline-none pt-1",
                "text-xl font-normal text-text-primary",
                "empty:before:content-[attr(data-placeholder)]",
                "empty:before:text-text-quaternary",
                "empty:before:pointer-events-none"
              )}
            />
          </div>

          <div className="my-4 border-t border-app-border" />

          {/* Toolbar + action button
              Mobile: stacked (icons row → button row right-aligned)
              sm+:    side-by-side on one row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Formatting icons — scrollable in case viewport is very narrow */}
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              <FormatBtn icon={Bold01} label="Bold" onClick={() => execFormat("bold")} />
              <FormatBtn icon={Italic01} label="Italic" onClick={() => execFormat("italic")} />
              <FormatBtn icon={Underline01} label="Underline" onClick={() => execFormat("underline")} />
              <FormatBtn icon={FaceSmile} label="Insert emoji" />
              <FormatBtn icon={Image01} label="Insert image" onClick={onAddMedia} />
              <GifBtn />
              <div className="flex items-center justify-center w-5 h-8 shrink-0">
                <div className="w-px h-full bg-app-border" aria-hidden="true" />
              </div>
              <FormatBtn icon={Plus} label="Add content block" />
            </div>

            {/* Action button — right-aligned on both layouts */}
            <div className="flex justify-end shrink-0">
              {paidContent ? (
                <Button
                  variant="primary"
                  size="md"
                  iconRight={ArrowNarrowRight}
                  onClick={() => onContinueToPay(getContent())}>
                  Save &amp; Continue
                </Button>
              ) : (
                <Button variant="primary" size="md" onClick={() => onPost(getContent())}>
                  Post
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-app-border" />

          {/* Paid content toggle */}
          <div className="flex items-center justify-between pt-3">
            <span className={cx("text-sm font-semibold", paidContent ? "text-brand-500" : "text-text-tertiary")}>
              Add Paid Content
            </span>
            <Toggle checked={paidContent} onChange={onPaidContentChange} label="Toggle paid content" />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className={cx("flex items-center justify-center size-12 rounded-xl", "bg-app-card border border-app-border")}>
            <Edit01 size={20} color="var(--color-text-tertiary)" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-text-secondary">No drafts yet</p>
          <p className="text-sm text-text-tertiary max-w-[240px]">Your saved drafts will appear here.</p>
        </div>
      )}
    </div>
  )
}

// ── StructuredStepShell ───────────────────────────────────────────────────────

function StructuredStepShell({
  title,
  subtitle,
  steps = STRUCTURED_STEPS,
  activeStep,
  onClose,
  onBack,
  onNext,
  nextLabel,
  nextIcon,
  children,
}: {
  title: string
  subtitle?: string
  steps?: StepperStep[]
  activeStep: number
  onClose: () => void
  onBack?: () => void
  onNext: () => void
  nextLabel: string
  nextIcon?: IconComponent
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-5 max-h-[80vh]">
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-list-item text-text-primary">{title}</h2>
          {subtitle && <p className="text-body-small text-text-tertiary">{subtitle}</p>}
        </div>
        <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
      </div>

      {/* Stepper */}
      <ProgressStepper steps={steps} activeStep={activeStep} className="shrink-0" />

      {/* Scrollable body — px-1 -mx-1 gives focus rings room without clipping */}
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 px-1 -mx-1">
        {children}
      </div>

      {/* Footer
          Mobile:  stacked, full-width buttons (primary on top, secondary below)
          sm+:     side-by-side, auto-width */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-app-border shrink-0">
        {onBack ? (
          <Button variant="secondary" size="md" iconLeft={ArrowLeft} onClick={onBack} className="w-full sm:w-auto">
            Back
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}
        <Button variant="primary" size="md" iconRight={nextIcon} onClick={onNext} className="w-full sm:w-auto">
          {nextLabel}
        </Button>
      </div>
    </div>
  )
}

// ── PublishedScreen ───────────────────────────────────────────────────────────

function PublishedScreen({
  kind,
  onClose,
  onShareAndEarn,
  onViewPost,
}: {
  kind: PostKind
  onClose: () => void
  onShareAndEarn?: () => void
  onViewPost?: () => void
}) {
  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1)

  return (
    <div className="flex flex-col gap-0">
      <div className="flex justify-end pb-2">
        <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
      </div>
      <div className="flex flex-col gap-5 px-2 pb-2">
        <div className={cx("flex items-center justify-center size-14 rounded-full shrink-0", "bg-utility-green-100")}>
          <CheckCircle size={28} color="var(--color-utility-green-600)" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-heading-list-item text-text-primary">{kindLabel} Published!</h2>
          <p className="text-body-default text-text-tertiary">
            Your {kindLabel.toLowerCase()} is now live on the Nostr Network.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" iconRight={Share07} onClick={onShareAndEarn} className="w-full">
            Share &amp; Earn
          </Button>
          <Button variant="secondary" size="lg" onClick={onViewPost} className="w-full">
            View Your {kindLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Default state factories ───────────────────────────────────────────────────

function defaultSetupValues(): ComposeAudiobookValues {
  return { title: "", coverFile: null, description: "", creators: [], tags: [], rssFeed: "" }
}

function defaultPodcastSetupValues(): ComposePodcastValues {
  return {
    showTitle: "",
    showArtworkFile: null,
    showDescription: "",
    showTags: [],
    showRssFeed: "",
    episodeTitle: "",
    episodeThumbnailFile: null,
    episodeDescription: "",
    episodeCreators: [],
    episodeTags: [],
    assignedPodcastId: "",
  }
}

function defaultPodcastContentValues(): PodcastContentValues {
  return {
    contentFile: null,
    uploadProgress: -1,
    autoGeneratePreview: false,
    previewHours: 0,
    previewMinutes: 0,
    previewSeconds: 20,
    previewFile: null,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPublish,
  onShareAndEarn,
  onViewPost,
  onAddMedia,
}: CreatePostModalProps) {
  const [screen, setScreen] = useState<Screen>("kind-picker")
  const [selectedKind, setSelectedKind] = useState<PostKind>("note")

  // Simple flow state
  const [noteContent, setNoteContent] = useState("")
  const [paidContent, setPaidContent] = useState(false)

  // Book / Audiobook structured state
  const [setupValues, setSetupValues] = useState<ComposeAudiobookValues>(defaultSetupValues())
  const [contentFile, setContentFile] = useState<File | null>(null)

  // Podcast structured state
  const [podcastSetupValues, setPodcastSetupValues] = useState<ComposePodcastValues>(defaultPodcastSetupValues())
  const [podcastContentValues, setPodcastContentValues] = useState<PodcastContentValues>(defaultPodcastContentValues())

  // Article structured state
  const [articleValues, setArticleValues] = useState<ArticleValues>(defaultArticleValues())
  /** Object URL handed to <ImageCropper> — managed here to control revocation timing */
  const [articleCropSrc, setArticleCropSrc] = useState<string | null>(null)

  // Video structured state
  const [videoMode, setVideoMode] = useState<VideoMode>("single")
  const [videoSetupValues, setVideoSetupValues] = useState<ComposeVideoValues>(defaultComposeVideoValues())
  const [videoContentValues, setVideoContentValues] = useState<VideoContentValues>(defaultVideoContentValues())
  const [showSetupValues, setShowSetupValues] = useState<ComposeShowValues>(defaultComposeShowValues())
  const [showContentValues, setShowContentValues] = useState<ShowContentValues>(defaultShowContentValues())

  // Shared monetisation state
  const [monetisationState, setMonetisationState] = useState<MonetisationState>(defaultMonetisationState())

  const kindDef = KINDS.find(k => k.id === selectedKind)!
  const kindLabel = selectedKind.charAt(0).toUpperCase() + selectedKind.slice(1)

  // ── Reset + close ─────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    onClose()
    setTimeout(() => {
      setScreen("kind-picker")
      setSelectedKind("note")
      setNoteContent("")
      setPaidContent(false)
      setSetupValues(defaultSetupValues())
      setContentFile(null)
      setPodcastSetupValues(defaultPodcastSetupValues())
      setPodcastContentValues(defaultPodcastContentValues())
      setArticleValues(defaultArticleValues())
      setArticleCropSrc(null) // URL already revoked by handleCropSave / handleCropCancel
      setVideoMode("single")
      setVideoSetupValues(defaultComposeVideoValues())
      setVideoContentValues(defaultVideoContentValues())
      setShowSetupValues(defaultComposeShowValues())
      setShowContentValues(defaultShowContentValues())
      setMonetisationState(defaultMonetisationState())
    }, 200)
  }, [onClose])

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleKindSelect = useCallback((kind: PostKind) => {
    const def = KINDS.find(k => k.id === kind)!
    setSelectedKind(kind)
    if (kind === "article") {
      setScreen("article-editor")
    } else if (kind === "video") {
      setScreen("video-type")
    } else {
      setScreen(def.flow === "structured" ? "setup" : "note-editor")
    }
  }, [])

  const handleSimplePost = useCallback(
    (content: string) => {
      setNoteContent(content)
      if (paidContent) {
        setScreen("price-splits")
      } else {
        onPublish?.(selectedKind, content)
        setScreen("published")
      }
    },
    [paidContent, onPublish, selectedKind]
  )

  const handleContinueToPay = useCallback((content: string) => {
    setNoteContent(content)
    setScreen("price-splits")
  }, [])

  const handlePublish = useCallback(() => {
    onPublish?.(selectedKind, noteContent)
    setScreen("published")
  }, [onPublish, selectedKind, noteContent])

  // ── Article crop navigation ───────────────────────────────────────────────

  const handleCoverCropRequest = useCallback((file: File) => {
    // Revoke any previous crop object URL before creating a new one
    setArticleCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setArticleValues(v => ({ ...v, coverFile: file, coverCroppedBlob: null }))
    setScreen("article-crop")
  }, [])

  const handleCropSave = useCallback((blob: Blob) => {
    setArticleValues(v => ({ ...v, coverCroppedBlob: blob }))
    setArticleCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setScreen("article-editor")
  }, [])

  const handleCropCancel = useCallback(() => {
    setArticleCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setScreen("article-editor")
  }, [])

  // ── Back navigation per kind flow ─────────────────────────────────────────

  function backFromPriceSplits() {
    if (selectedKind === "article") {
      setScreen("article-editor")
    } else if (selectedKind === "video") {
      setScreen(videoMode === "single" ? "video-content" : "show-content")
    } else if (kindDef.flow === "structured") {
      setScreen("content-upload")
    } else {
      setScreen("note-editor")
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const isCropScreen = screen === "article-crop"

  return (
    <Modal
      isOpen={isOpen}
      onClose={isCropScreen ? handleCropCancel : handleClose}
      ariaLabel={isCropScreen ? "Crop media" : "Create a post"}
      showClose={false}
      maxWidth="max-w-[640px]"
      className={
        isCropScreen
          ? "!p-0 overflow-hidden"
          : "overflow-y-auto max-h-[90vh] scrollbar-hide"
      }>

      {/* ── Kind picker ──────────────────────────────────────────────────── */}
      {screen === "kind-picker" && (
        <KindPickerScreen onClose={handleClose} onSelect={handleKindSelect} />
      )}

      {/* ── Simple flow: note / article editor ───────────────────────────── */}
      {screen === "note-editor" && (
        <NoteEditorScreen
          currentUser={currentUser}
          paidContent={paidContent}
          onPaidContentChange={setPaidContent}
          onBack={() => setScreen("kind-picker")}
          onClose={handleClose}
          onPost={handleSimplePost}
          onContinueToPay={handleContinueToPay}
          onAddMedia={onAddMedia}
        />
      )}

      {/* ── Article: Content editor ──────────────────────────────────────── */}
      {screen === "article-editor" && (
        <StructuredStepShell
          title="Create New Article"
          subtitle="Write your article and add a cover image."
          steps={ARTICLE_STEPS}
          activeStep={0}
          onClose={handleClose}
          onBack={() => setScreen("kind-picker")}
          onNext={() => setScreen("price-splits")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          <ArticleEditor
            values={articleValues}
            onChange={setArticleValues}
            onCoverCropRequest={handleCoverCropRequest}
          />
        </StructuredStepShell>
      )}

      {/* ── Article: Crop cover image ─────────────────────────────────────── */}
      {screen === "article-crop" && articleCropSrc && (
        <ImageCropper
          imageSrc={articleCropSrc}
          aspectRatio={5 / 2}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}

      {/* ── Video: Type selector ─────────────────────────────────────────── */}
      {screen === "video-type" && (
        <VideoTypeSelectScreen
          onClose={handleClose}
          onBack={() => setScreen("kind-picker")}
          onSelect={mode => {
            setVideoMode(mode)
            setScreen(mode === "single" ? "video-setup" : "show-setup")
          }}
        />
      )}

      {/* ── Video: Single — Setup ─────────────────────────────────────────── */}
      {screen === "video-setup" && (
        <StructuredStepShell
          title="Create New Video"
          subtitle="Add a title, thumbnail, and description."
          steps={VIDEO_SINGLE_STEPS}
          activeStep={0}
          onClose={handleClose}
          onBack={() => setScreen("video-type")}
          onNext={() => setScreen("video-content")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          <ComposeVideo
            values={videoSetupValues}
            onChange={setVideoSetupValues}
          />
        </StructuredStepShell>
      )}

      {/* ── Video: Single — Content upload ───────────────────────────────── */}
      {screen === "video-content" && (
        <StructuredStepShell
          title="Create New Video"
          subtitle="Upload your video and configure preview content."
          steps={VIDEO_SINGLE_STEPS}
          activeStep={1}
          onClose={handleClose}
          onBack={() => setScreen("video-setup")}
          onNext={() => setScreen("price-splits")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          <VideoContentStep
            videoTitle={videoSetupValues.title || "Video Title"}
            onVideoTitleChange={title => setVideoSetupValues(v => ({ ...v, title }))}
            values={videoContentValues}
            onChange={setVideoContentValues}
          />
        </StructuredStepShell>
      )}

      {/* ── Video: Show — Show setup ──────────────────────────────────────── */}
      {screen === "show-setup" && (
        <StructuredStepShell
          title="Create New Show"
          subtitle="Set up your show and first episode details."
          steps={VIDEO_SHOW_STEPS}
          activeStep={0}
          onClose={handleClose}
          onBack={() => setScreen("video-type")}
          onNext={() => setScreen("show-content")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          <ComposeShow
            values={showSetupValues}
            onChange={setShowSetupValues}
          />
        </StructuredStepShell>
      )}

      {/* ── Video: Show — Season / episode upload ────────────────────────── */}
      {screen === "show-content" && (
        <StructuredStepShell
          title="Create New Show"
          subtitle="Upload your season and episode files."
          steps={VIDEO_SHOW_STEPS}
          activeStep={1}
          onClose={handleClose}
          onBack={() => setScreen("show-setup")}
          onNext={() => setScreen("price-splits")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          <ShowContentStep
            showTitle={showSetupValues.showTitle}
            values={showContentValues}
            onChange={setShowContentValues}
          />
        </StructuredStepShell>
      )}

      {/* ── Structured: Setup ─────────────────────────────────────────────── */}
      {screen === "setup" && (
        <StructuredStepShell
          title={`Create New ${kindLabel}`}
          subtitle={
            selectedKind === "podcast"
              ? "Set up your show and first episode."
              : "Fill in the details for your publication."
          }
          activeStep={0}
          onClose={handleClose}
          onBack={() => setScreen("kind-picker")}
          onNext={() => setScreen("content-upload")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          {selectedKind === "podcast" ? (
            <ComposePodcast
              mode="new-show"
              values={podcastSetupValues}
              onChange={setPodcastSetupValues}
            />
          ) : (
            <ComposeAudiobook
              values={setupValues}
              onChange={setSetupValues}
              kind={selectedKind as "book" | "audiobook"}
            />
          )}
        </StructuredStepShell>
      )}

      {/* ── Structured: Content upload / episode content ─────────────────── */}
      {screen === "content-upload" && (
        <StructuredStepShell
          title={`Create New ${kindLabel}`}
          subtitle={
            selectedKind === "podcast"
              ? "Upload your episode and configure preview content."
              : "Upload the content file for your publication."
          }
          activeStep={1}
          onClose={handleClose}
          onBack={() => setScreen("setup")}
          onNext={() => setScreen("price-splits")}
          nextLabel="Save & Continue"
          nextIcon={ArrowNarrowRight}>
          {selectedKind === "podcast" ? (
            <PodcastContentStep
              episodeTitle={podcastSetupValues.episodeTitle || "Episode Title"}
              onEpisodeTitleChange={title =>
                setPodcastSetupValues(v => ({ ...v, episodeTitle: title }))
              }
              values={podcastContentValues}
              onChange={setPodcastContentValues}
            />
          ) : (
            <ContentUpload
              accept={selectedKind === "audiobook" ? "audio/*" : "application/epub+zip,.pdf,.mobi"}
              fileLabel={selectedKind === "audiobook" ? "audio file" : "ebook file"}
              value={contentFile}
              onChange={setContentFile}
            />
          )}
        </StructuredStepShell>
      )}

      {/* ── Shared: Monetisation (Price & Payment Splits) ────────────────── */}
      {screen === "price-splits" && (
        <MonetisationStep
          flow={kindDef.flow}
          kindLabel={selectedKind === "video" && videoMode === "show" ? "Show" : kindLabel}
          state={monetisationState}
          onChange={setMonetisationState}
          onClose={handleClose}
          onBack={backFromPriceSplits}
          onPublish={handlePublish}
          steps={
            selectedKind === "article"
              ? ARTICLE_STEPS
              : selectedKind === "video"
                ? videoMode === "single" ? VIDEO_SINGLE_STEPS : VIDEO_SHOW_STEPS
                : undefined
          }
          monetisationStepIndex={
            selectedKind === "article" || selectedKind === "video" ? 2 : undefined
          }
        />
      )}

      {/* ── Published ────────────────────────────────────────────────────── */}
      {screen === "published" && (
        <PublishedScreen
          kind={selectedKind}
          onClose={handleClose}
          onShareAndEarn={() => { onShareAndEarn?.(); handleClose() }}
          onViewPost={() => { onViewPost?.(); handleClose() }}
        />
      )}
    </Modal>
  )
}
