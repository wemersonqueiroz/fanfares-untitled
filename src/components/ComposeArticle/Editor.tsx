"use client"

import {
  useState,
  useRef,
  useEffect,
  useId,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  UploadCloud01,
  XClose,
  UserPlus01,
  Tag01,
  Rss01,
  Bold01,
  Italic01,
  Underline01,
  Strikethrough01,
  List,
  Link01,
  Code01,
  Heading01,
  Heading02,
  Image01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { FieldLabel, type Creator } from "@/components/Compose"
import { createId } from "@/utils/createId"

// ── Public types ──────────────────────────────────────────────────────────────

export type ArticleValues = {
  summary: string
  coverFile: File | null
  /** JPEG Blob produced by the crop screen — null until user has cropped */
  coverCroppedBlob: Blob | null
  title: string
  body: string
  creators: Creator[]
  tags: string[]
  rssFeed: string
}

export type ArticleEditorProps = {
  values: ArticleValues
  onChange: Dispatch<SetStateAction<ArticleValues>>
  /**
   * Fired when the user selects (or re-selects) a cover image file.
   * The parent should open the crop screen with this file.
   */
  onCoverCropRequest: (file: File) => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

const SUMMARY_CHAR_LIMIT = 964

function ToolbarBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card-active transition-colors duration-150 focus-visible:outline-none">
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return (
    <div
      className="w-px h-4 bg-app-border mx-0.5 shrink-0"
      aria-hidden="true"
    />
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticleEditor({
  values,
  onChange,
  onCoverCropRequest,
  className,
}: ArticleEditorProps) {
  const rssId = useId()
  const summaryRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [tagInput, setTagInput] = useState("")
  const [creatorNpub, setCreatorNpub] = useState("")
  const [creatorRole, setCreatorRole] = useState("")
  const [summaryChars, setSummaryChars] = useState(0)
  const [coverDragging, setCoverDragging] = useState(false)

  // Object URL for the cropped blob preview — managed to avoid memory leaks
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!values.coverCroppedBlob) {
      setCoverPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(values.coverCroppedBlob)
    setCoverPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [values.coverCroppedBlob])

  function patch(partial: Partial<ArticleValues>) {
    onChange(prev => ({ ...prev, ...partial }))
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  function execSummary(cmd: string) {
    document.execCommand(cmd, false)
    summaryRef.current?.focus()
    setSummaryChars(summaryRef.current?.innerText.length ?? 0)
  }

  function handleSummaryInput() {
    setSummaryChars(summaryRef.current?.innerText.length ?? 0)
    patch({ summary: summaryRef.current?.innerHTML ?? "" })
  }

  // ── Cover image ───────────────────────────────────────────────────────────

  function handleCoverFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    patch({ coverFile: file, coverCroppedBlob: null })
    onCoverCropRequest(file)
  }

  // ── Body ──────────────────────────────────────────────────────────────────

  function execBody(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg)
    bodyRef.current?.focus()
    patch({ body: bodyRef.current?.innerHTML ?? "" })
  }

  function handleBodyInput() {
    patch({ body: bodyRef.current?.innerHTML ?? "" })
  }

  function handleLinkInsert() {
    const url = window.prompt("Enter URL:")
    if (url) execBody("createLink", url)
  }

  // ── Tags ──────────────────────────────────────────────────────────────────

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#/, "")
    if (!tag) return
    onChange(prev => {
      if (prev.tags.includes(tag)) return prev
      return { ...prev, tags: [...prev.tags, tag] }
    })
  }

  function removeTag(tag: string) {
    onChange(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  // ── Creators ──────────────────────────────────────────────────────────────

  function addCreator() {
    const npub = creatorNpub.trim()
    if (!npub) return
    const newCreator = {
      id: createId("article-creator"),
      npub,
      role: creatorRole.trim() || "Author",
    }
    onChange(prev => ({ ...prev, creators: [...prev.creators, newCreator] }))
    setCreatorNpub("")
    setCreatorRole("")
  }

  function removeCreator(id: string) {
    onChange(prev => ({
      ...prev,
      creators: prev.creators.filter(c => c.id !== id),
    }))
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={cx("flex flex-col gap-5", className)}>
      {/* ── Summary ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-text-secondary">
            Summary<span className="text-brand-500 ml-0.5">*</span>
          </label>
          <span
            className={cx(
              "text-xs tabular-nums",
              summaryChars > SUMMARY_CHAR_LIMIT
                ? "text-text-error-primary"
                : "text-text-tertiary"
            )}>
            {summaryChars}/{SUMMARY_CHAR_LIMIT}
          </span>
        </div>

        {/* Summary toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-1 border border-app-border border-b-0 rounded-t-lg bg-app-surface">
          <ToolbarBtn label="Bold" onClick={() => execSummary("bold")}>
            <Bold01 size={14} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn label="Italic" onClick={() => execSummary("italic")}>
            <Italic01 size={14} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn
            label="Underline"
            onClick={() => execSummary("underline")}>
            <Underline01 size={14} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
        </div>

        <div
          ref={summaryRef}
          role="textbox"
          aria-multiline="true"
          aria-label="Article summary"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Write a short summary of your article…"
          onInput={handleSummaryInput}
          className={cx(
            "min-h-[80px] w-full px-3 py-2.5 rounded-b-lg border border-app-border bg-app-surface",
            "text-sm text-text-primary leading-relaxed outline-none",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-text-placeholder empty:before:pointer-events-none",
            "focus-visible:ring-2 focus-visible:ring-brand-500/50 transition-colors duration-150",
            summaryChars > SUMMARY_CHAR_LIMIT && "border-text-error-primary"
          )}
        />
      </div>

      {/* ── Cover Image ──────────────────────────────────────────────────── */}
      <div>
        <FieldLabel>Cover Image</FieldLabel>

        {coverPreviewUrl ? (
          /* Cropped preview — maintains 5:2 article aspect ratio */
          <div className="relative rounded-xl overflow-hidden border border-app-border bg-app-card aspect-[5/2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPreviewUrl}
              alt="Article cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  values.coverFile && onCoverCropRequest(values.coverFile)
                }>
                Recrop
              </Button>
              <IconButton
                icon={XClose}
                label="Remove cover"
                variant="ghost"
                size="sm"
                onClick={() =>
                  patch({ coverFile: null, coverCroppedBlob: null })
                }
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            onDragOver={e => {
              e.preventDefault()
              setCoverDragging(true)
            }}
            onDragLeave={() => setCoverDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setCoverDragging(false)
              handleCoverFiles(e.dataTransfer.files)
            }}
            className={cx(
              "flex flex-col items-center justify-center gap-2 w-full py-8 px-4 rounded-xl",
              "border-2 border-dashed cursor-pointer transition-colors duration-150",
              coverDragging
                ? "border-brand-600 bg-brand-600/5"
                : "border-app-border bg-app-card hover:bg-app-card-active hover:border-app-border-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            )}
            aria-label="Upload cover image">
            <div className="flex items-center justify-center size-10 rounded-lg bg-brand-600/10">
              <Image01
                size={20}
                color="var(--color-brand-600)"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm text-center text-text-tertiary">
              <span className="font-semibold text-text-secondary">
                Click to upload
              </span>{" "}
              or drag and drop
            </span>
            <span className="text-xs text-text-tertiary">PNG, JPG, WEBP</span>
          </button>
        )}

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-hidden="true"
          onChange={e => handleCoverFiles(e.target.files)}
        />
      </div>

      {/* ── Title ────────────────────────────────────────────────────────── */}
      <div>
        <input
          type="text"
          value={values.title}
          onChange={e => patch({ title: e.target.value })}
          placeholder="Add a title"
          aria-label="Article title"
          className={cx(
            "w-full px-0 py-1 bg-transparent outline-none",
            "border-0 border-b border-app-border",
            "text-heading-list-item text-text-primary placeholder:text-text-quaternary",
            "focus-visible:border-brand-500 transition-colors duration-150"
          )}
        />
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel>Body</FieldLabel>

        {/* Body toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 border border-app-border border-b-0 rounded-t-lg bg-app-surface">
          <ToolbarBtn
            label="Heading 1"
            onClick={() => execBody("formatBlock", "H1")}>
            <Heading01 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn
            label="Heading 2"
            onClick={() => execBody("formatBlock", "H2")}>
            <Heading02 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarDivider />
          <ToolbarBtn label="Bold" onClick={() => execBody("bold")}>
            <Bold01 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn label="Italic" onClick={() => execBody("italic")}>
            <Italic01 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn label="Underline" onClick={() => execBody("underline")}>
            <Underline01 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn
            label="Strikethrough"
            onClick={() => execBody("strikeThrough")}>
            <Strikethrough01
              size={16}
              color="currentColor"
              aria-hidden="true"
            />
          </ToolbarBtn>
          <ToolbarDivider />
          <ToolbarBtn
            label="Bullet list"
            onClick={() => execBody("insertUnorderedList")}>
            <List size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn label="Insert link" onClick={handleLinkInsert}>
            <Link01 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
          <ToolbarBtn
            label="Code block"
            onClick={() => execBody("formatBlock", "PRE")}>
            <Code01 size={16} color="currentColor" aria-hidden="true" />
          </ToolbarBtn>
        </div>

        <div
          ref={bodyRef}
          role="textbox"
          aria-multiline="true"
          aria-label="Article body"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Write your article…"
          onInput={handleBodyInput}
          className={cx(
            "min-h-[200px] w-full px-3 py-2.5 rounded-b-lg border border-app-border bg-app-surface",
            "text-sm text-text-primary leading-relaxed outline-none",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-text-placeholder empty:before:pointer-events-none",
            "[&_h1]:text-heading-section [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1",
            "[&_h2]:text-heading-card [&_h2]:font-semibold [&_h2]:mt-2.5 [&_h2]:mb-1",
            "[&_pre]:bg-app-card [&_pre]:rounded-md [&_pre]:px-3 [&_pre]:py-2 [&_pre]:text-xs [&_pre]:font-mono [&_pre]:my-1.5",
            "[&_a]:text-brand-500 [&_a]:underline [&_a]:underline-offset-2",
            "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1",
            "focus-visible:ring-2 focus-visible:ring-brand-500/50 transition-colors duration-150"
          )}
        />
      </div>

      {/* ── Creators ─────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel required>Creators</FieldLabel>

        {values.creators.length > 0 && (
          <div className="flex flex-col gap-2 mb-2">
            {values.creators.map(creator => (
              <div
                key={creator.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-app-surface border border-app-border">
                <Avatar
                  src={creator.avatarUrl}
                  name={creator.name || creator.npub}
                  size="xs"
                  className="border border-black/10 shrink-0"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-text-primary truncate">
                    {creator.name || `${creator.npub.slice(0, 16)}…`}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {creator.role}
                  </span>
                </div>
                <IconButton
                  icon={XClose}
                  label="Remove creator"
                  variant="ghost"
                  size="xs"
                  onClick={() => removeCreator(creator.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
            <UserPlus01
              size={14}
              color="var(--color-text-tertiary)"
              aria-hidden="true"
              className="shrink-0"
            />
            <input
              type="text"
              value={creatorNpub}
              onChange={e => setCreatorNpub(e.target.value)}
              placeholder="npub or pubkey…"
              className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 h-9 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
              <input
                type="text"
                value={creatorRole}
                onChange={e => setCreatorRole(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCreator()
                  }
                }}
                placeholder="Role (Author, Editor…)"
                className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={addCreator}>
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tags ─────────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel>Tags</FieldLabel>

        {values.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {values.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-app-surface border border-app-border text-xs text-text-secondary">
                #{tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => removeTag(tag)}
                  className="flex items-center justify-center size-3.5 rounded-full text-text-tertiary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none">
                  <XClose size={10} color="currentColor" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 px-3 h-9 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
            <Tag01
              size={14}
              color="var(--color-text-tertiary)"
              aria-hidden="true"
              className="shrink-0"
            />
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault()
                  addTag(tagInput)
                  setTagInput("")
                }
              }}
              placeholder="Add a tag…"
              className="flex-1 bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              addTag(tagInput)
              setTagInput("")
            }}>
            Add
          </Button>
        </div>
      </div>

      {/* ── RSS Feed ─────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel htmlFor={rssId}>
          RSS Feed{" "}
          <span className="text-text-tertiary font-normal">(optional)</span>
        </FieldLabel>
        <div className="flex items-center gap-2 px-3 h-10 rounded-lg border border-app-border bg-app-surface focus-within:ring-2 focus-within:ring-brand-500/50 transition-colors duration-150">
          <Rss01
            size={16}
            color="var(--color-text-tertiary)"
            aria-hidden="true"
            className="shrink-0"
          />
          <input
            id={rssId}
            type="url"
            value={values.rssFeed}
            onChange={e => patch({ rssFeed: e.target.value })}
            placeholder="https://your-feed.com/rss"
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-placeholder"
          />
        </div>
      </div>
    </div>
  )
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function defaultArticleValues(): ArticleValues {
  return {
    summary: "",
    coverFile: null,
    coverCroppedBlob: null,
    title: "",
    body: "",
    creators: [],
    tags: [],
    rssFeed: "",
  }
}
