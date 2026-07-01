"use client"

import { useRef, useCallback } from "react"
import {
  DotsHorizontal,
  MessageTextSquare02,
  Share07,
  Heart,
  Lightning01,
  Bold01,
  Italic01,
  Underline01,
  FaceSmile,
  Image01,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { fmtCount } from "@/utils/fmtCount"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { Modal } from "@/components/Modal"

// ── Public types ──────────────────────────────────────────────────────────────

export type CommentSocial = {
  comments: number
  shares: number
  likes: number
  zaps: number
}

export type ParentComment = {
  /** Display name — e.g. "Simon" */
  name: string
  /** Handle — e.g. "Simon@fanfares.io" */
  handle: string
  /** Human-readable  — e.g. "7 hours" */
  timestamp: string
  body: string
  avatarUrl?: string
  social: CommentSocial
}

export type CommentModalProps = {
  isOpen: boolean
  onClose: () => void
  parentComment: ParentComment
  currentUser?: {
    avatarUrl?: string
    name?: string
  }
  /**
   * Placeholder text inside the composer.
   * @default "Post Your Reply"
   */
  placeholder?: string
  /**
   * Submit button label.
   * @default "Reply"
   */
  submitLabel?: string
  onSubmitReply?: (text: string) => void
  onOptions?: () => void
  onComment?: () => void
  onShare?: () => void
  onLike?: () => void
  onZap?: () => void
}

// ── Internals ─────────────────────────────────────────────────────────────────

// Avatar imported from @/components/Avatar

/** Social action button: icon + count */
function SocialBtn({
  icon: Icon,
  count,
  label,
  onClick,
}: {
  icon: typeof Heart
  count: number
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} — ${count}`}
      className="flex items-center gap-1 cursor-pointer text-text-tertiary hover:text-text-secondary transition-colors focus-visible:outline-none">
      <Icon size={20} color="currentColor" aria-hidden="true" />
      <span className="text-sm font-medium leading-6">{fmtCount(count)}</span>
    </button>
  )
}

function FormatBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Bold01
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card transition-colors focus-visible:outline-none">
      <Icon size={20} color="currentColor" aria-hidden="true" />
    </button>
  )
}

/**
 * GIF icon — styled as a boxed "GIF" label to match the Figma mage:gif icon
 * (no equivalent in @untitledui/icons).
 */
function GifBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Insert GIF"
      onClick={onClick}
      className="flex items-center justify-center p-1.5 rounded-md cursor-pointer text-text-tertiary hover:text-text-primary hover:bg-app-card transition-colors focus-visible:outline-none">
      {/* 22×22 container matching Figma size */}
      <span className="flex items-center justify-center size-overlay-btn">
        <span className="flex items-center justify-center border border-current rounded px-0.5 text-2xs font-bold tracking-wide leading-none h-3.5">
          GIF
        </span>
      </span>
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CommentModal({
  isOpen,
  onClose,
  parentComment,
  currentUser,
  placeholder = "Post Your Reply",
  submitLabel = "Reply",
  onSubmitReply,
  onOptions,
  onComment,
  onShare,
  onLike,
  onZap,
}: CommentModalProps) {
  const editorRef = useRef<HTMLParagraphElement>(null)

  const handleReply = useCallback(() => {
    const text = editorRef.current?.innerText?.trim() ?? ""
    if (!text) return
    onSubmitReply?.(text)
    if (editorRef.current) editorRef.current.innerText = ""
  }, [onSubmitReply])

  const execFormat = (command: string) => {
    document.execCommand(command, false)
    editorRef.current?.focus()
  }

  const { name, handle, timestamp, body, avatarUrl, social } = parentComment

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Post a reply">
      <div className="flex flex-col gap-8">
        <div className="flex items-start px-2 bg-app-surface">
          {/* Left column: 24px avatar + connector line */}
          <div className="flex flex-col items-center shrink-0 pt-2">
            <Avatar name={name} src={avatarUrl} size="xs" className="border border-black/[0.08]" />
            {/* Connector line — runs down to the reply avatar */}
            <div className="w-px flex-1 mt-2 bg-app-border rounded-full min-h-8" />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-2 flex-1 min-w-0 pl-2 pb-4 pt-2">
            {/* Header row: name/handle + dots */}
            <div className="flex items-start justify-between h-10">
              <div className="flex flex-col justify-center shrink-0">
                {/* Name */}
                <p className="text-base font-medium text-text-primary leading-5 whitespace-nowrap">
                  {name}
                </p>
                {/* Handle · timestamp */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-normal text-text-tertiary leading-5 whitespace-nowrap">
                    {handle}
                  </span>
                  {/* Vertical divider */}
                  <span
                    className="block w-px h-3 bg-text-tertiary/40 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-normal text-text-tertiary leading-5 whitespace-nowrap">
                    {timestamp}
                  </span>
                </div>
              </div>

              {/* ⋯ options */}
              <IconButton
                icon={DotsHorizontal}
                label="More options"
                variant="ghost"
                size="sm"
                iconSize={24}
                onClick={onOptions}
              />
            </div>

            {/* Body text */}
            <p className="text-base font-normal text-text-primary leading-6 w-full">
              {body}
            </p>

            {/* Social row */}
            <div className="flex items-center gap-4 h-7">
              <SocialBtn
                icon={MessageTextSquare02}
                count={social.comments}
                label="Comments"
                onClick={onComment}
              />
              <SocialBtn
                icon={Share07}
                count={social.shares}
                label="Share"
                onClick={onShare}
              />
              <SocialBtn
                icon={Heart}
                count={social.likes}
                label="Like"
                onClick={onLike}
              />
              <SocialBtn
                icon={Lightning01}
                count={social.zaps}
                label="Zap"
                onClick={onZap}
              />
            </div>
          </div>
        </div>

        {/* ── Reply input section ──────────────────────────────────────────── */}
        <div className="flex items-start gap-4 pl-2">
          {/* Current user avatar (40px) */}
          <div className="flex flex-col items-center shrink-0">
            <Avatar
              name={currentUser?.name}
              src={currentUser?.avatarUrl}
              size="md"
              className="border border-black/[0.08]"
            />
          </div>

          {/* Input + toolbar — fixed height, justify-between pins toolbar to bottom */}
          <div className="flex flex-col flex-1 min-w-0 h-comment-input justify-between pt-2">
            {/* ContentEditable reply area with placeholder */}
            <p
              ref={editorRef}
              role="textbox"
              aria-multiline="true"
              aria-label="Write your reply"
              contentEditable
              suppressContentEditableWarning
              data-placeholder={placeholder}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault()
                  handleReply()
                }
              }}
              className={cx(
                "w-full outline-none focus:outline-none",
                "text-xl font-normal text-text-primary",
                "overflow-y-auto scrollbar-hide",
                "empty:before:content-[attr(data-placeholder)]",
                "empty:before:text-text-quaternary",
                "empty:before:pointer-events-none"
              )}
            />

            {/* Toolbar row */}
            <div className="flex items-center justify-end gap-4">
              {/* Format + media buttons group */}
              <div className="flex flex-wrap items-center gap-0">
                <FormatBtn
                  icon={Bold01}
                  label="Bold"
                  onClick={() => execFormat("bold")}
                />
                <FormatBtn
                  icon={Italic01}
                  label="Italic"
                  onClick={() => execFormat("italic")}
                />
                <FormatBtn
                  icon={Underline01}
                  label="Underline"
                  onClick={() => execFormat("underline")}
                />
                <FormatBtn icon={FaceSmile} label="Insert emoji" />
                <FormatBtn icon={Image01} label="Insert image" />
                <GifBtn />

                {/* Vertical divider */}
                <div className="flex items-center justify-center w-3 h-8">
                  <div
                    className="w-px h-full bg-app-border"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Reply button */}
              <Button variant="primary" size="md" onClick={handleReply}>
                {submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
