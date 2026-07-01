"use client"

import { useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowNarrowRight,
  Bold01,
  Edit01,
  FaceSmile,
  Image01,
  Italic01,
  Plus,
  Underline01,
  XClose,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import type { IconComponent } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type NoteEditorScreenProps = {
  currentUser?: { avatarUrl?: string; name?: string }
  paidContent: boolean
  onPaidContentChange: (v: boolean) => void
  onBack: () => void
  onClose: () => void
  onPost: (text: string) => void
  onContinueToPay: (text: string) => void
  onAddMedia?: () => void
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function PaidToggle({
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

// ── Component ─────────────────────────────────────────────────────────────────

export function NoteEditorScreen({
  currentUser,
  paidContent,
  onPaidContentChange,
  onBack,
  onClose,
  onPost,
  onContinueToPay,
  onAddMedia,
}: NoteEditorScreenProps) {
  const [tab, setTab] = useState<"write" | "drafts">("write")
  const editorRef = useRef<HTMLParagraphElement>(null)

  const getContent = () => editorRef.current?.innerText?.trim() ?? ""

  const execFormat = (command: string) => {
    document.execCommand(command, false)
    editorRef.current?.focus()
  }

  return (
    <div className="flex flex-col">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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

          <div className="flex items-center justify-between pt-3">
            <span className={cx("text-sm font-semibold", paidContent ? "text-brand-500" : "text-text-tertiary")}>
              Add Paid Content
            </span>
            <PaidToggle checked={paidContent} onChange={onPaidContentChange} label="Toggle paid content" />
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
