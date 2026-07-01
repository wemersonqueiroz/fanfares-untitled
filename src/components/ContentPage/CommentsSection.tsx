"use client"

import { useState } from "react"
import {
  Heart,
  Lightning01,
  MessageTextSquare02,
  Share07,
  DotsVertical,
  Bold01,
  Italic01,
  Underline01,
  FaceSmile,
  Image01,
  Paperclip,
  ChevronDown,
  ChevronUp,
} from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { fmtCount } from "@/utils/fmtCount"
import { Avatar } from "@/components/Avatar"
import { IconButton } from "@/components/IconButton"
import type { CommentData } from "./ContentPageBottom"

// ── Public types ──────────────────────────────────────────────────────────────

export type CommentsSectionProps = {
  comments?: CommentData[]
  /** Avatar URL for the logged-in user shown in the reply input */
  currentUserAvatarUrl?: string
  onPostReply?: (content: string) => void
  onCommentReply?: (commentId: string) => void
  onCommentShare?: (commentId: string) => void
  onCommentLike?: (commentId: string) => void
  onCommentZap?: (commentId: string) => void
  onCommentOptions?: (commentId: string) => void
  className?: string
}

// ── Internals ─────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-sm text-text-tertiary">
        No comments yet. Be the first to reply!
      </p>
    </div>
  )
}

function ReplyInput({
  avatarUrl,
  onPost,
}: {
  avatarUrl?: string
  onPost?: (content: string) => void
}) {
  const [text, setText] = useState("")

  const handlePost = () => {
    if (!text.trim()) return
    onPost?.(text.trim())
    setText("")
  }

  return (
    <div
      className={cx(
        "flex flex-col gap-3",
        "rounded-xl border border-app-border bg-app-card",
        "px-4 pt-3 pb-3"
      )}>
      {/* Row 1: avatar + textarea */}
      <div className="flex items-start gap-3">
        <Avatar
          name="You"
          src={avatarUrl}
          size="md"
          className="border border-black/10 shrink-0"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Post Your Reply"
          rows={text ? 3 : 1}
          className={cx(
            "flex-1 bg-transparent resize-none outline-none",
            "text-sm text-text-primary placeholder:text-text-tertiary leading-[1.5]"
          )}
        />
      </div>

      {/* Row 2: formatting toolbar + Reply button */}
      <div className="flex items-center gap-1">
        {[
          { icon: Bold01,       label: "Bold" },
          { icon: Italic01,     label: "Italic" },
          { icon: Underline01,  label: "Underline" },
          { icon: FaceSmile,    label: "Emoji" },
          { icon: Image01,      label: "Image" },
          { icon: Paperclip,    label: "Attachment" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            className="flex items-center justify-center size-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-app-card-active transition-colors cursor-pointer focus-visible:outline-none">
            <Icon size={14} color="currentColor" aria-hidden="true" />
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-4 bg-app-border mx-1 shrink-0" aria-hidden="true" />

        <button
          type="button"
          onClick={handlePost}
          className={cx(
            "ml-auto px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer shrink-0",
            "bg-brand-600 text-white",
            "hover:bg-brand-700 transition-colors duration-150",
            "focus-visible:outline-none"
          )}>
          Reply
        </button>
      </div>
    </div>
  )
}

function CommentRow({
  comment,
  isNested = false,
  onReply,
  onShare,
  onLike,
  onZap,
  onOptions,
}: {
  comment: CommentData
  isNested?: boolean
  onReply?: (id: string) => void
  onShare?: (id: string) => void
  onLike?: (id: string) => void
  onZap?: (id: string) => void
  onOptions?: (id: string) => void
}) {
  const [repliesOpen, setRepliesOpen] = useState(false)
  const hasReplies = !isNested && (comment.replies?.length ?? 0) > 0
  const colWidth = isNested ? "grid-cols-[32px_1fr]" : "grid-cols-[40px_1fr]"

  return (
    <div className={cx("grid gap-x-3", colWidth)}>
      <div className="flex justify-center items-start pt-0.5">
        <Avatar
          name={comment.author.name}
          src={comment.author.avatarUrl}
          size={isNested ? "sm" : "md"}
          className="border border-black/10"
        />
      </div>

      <div className="flex flex-col gap-2 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-bold text-text-primary truncate">
              {comment.author.name}
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              {comment.author.handle && (
                <span className="text-xs text-text-tertiary truncate min-w-0">
                  {comment.author.handle}
                </span>
              )}
              {comment.author.handle && (
                <span className="text-xs text-text-tertiary shrink-0">·</span>
              )}
              <span className="text-xs text-text-tertiary shrink-0 whitespace-nowrap">
                {comment.timestamp}
              </span>
            </div>
          </div>
          <IconButton
            icon={DotsVertical}
            label="Comment options"
            variant="ghost"
            size="xs"
            iconSize={16}
            onClick={() => onOptions?.(comment.id)}
          />
        </div>

        <p className="text-sm text-text-primary leading-[1.6]">{comment.content}</p>

        <div className="flex items-center gap-4">
          {[
            { icon: MessageTextSquare02, count: comment.reactions.replies, label: "Reply", cb: () => onReply?.(comment.id) },
            { icon: Share07,             count: comment.reactions.shares,  label: "Share", cb: () => onShare?.(comment.id) },
            { icon: Heart,               count: comment.reactions.likes,   label: "Like",  cb: () => onLike?.(comment.id) },
            { icon: Lightning01,         count: comment.reactions.zaps,  label: "Zap", cb: () => onZap?.(comment.id) },
          ].map(({ icon: Icon, count, label, cb }) => (
            <button
              key={label}
              type="button"
              onClick={cb}
              aria-label={`${label} — ${count}`}
              className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-none">
              <Icon size={14} color="currentColor" aria-hidden="true" />
              <span className="text-xs">{fmtCount(count)}</span>
            </button>
          ))}
        </div>

        {hasReplies && (
          <button
            type="button"
            onClick={() => setRepliesOpen(v => !v)}
            className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-none w-fit mt-0.5">
            {repliesOpen
              ? <ChevronUp size={14} color="currentColor" aria-hidden="true" />
              : <ChevronDown size={14} color="currentColor" aria-hidden="true" />}
            {repliesOpen ? "Hide" : "Show"} replies ({comment.replies!.length})
          </button>
        )}
      </div>

      {hasReplies && repliesOpen && (
        <div className="flex justify-center py-2">
          <div className="w-px bg-app-border" />
        </div>
      )}

      {hasReplies && repliesOpen && (
        <div className="flex flex-col gap-4 pt-2 pb-2">
          {comment.replies!.map(reply => (
            <CommentRow
              key={reply.id}
              comment={reply}
              isNested
              onReply={onReply}
              onShare={onShare}
              onLike={onLike}
              onZap={onZap}
              onOptions={onOptions}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CommentsSection({
  comments = [],
  currentUserAvatarUrl,
  onPostReply,
  onCommentReply,
  onCommentShare,
  onCommentLike,
  onCommentZap,
  onCommentOptions,
  className,
}: CommentsSectionProps) {
  return (
    <div className={cx("flex flex-col gap-6", className)}>
      <ReplyInput avatarUrl={currentUserAvatarUrl} onPost={onPostReply} />

      <div className="h-px bg-app-border" />

      {comments.length > 0 ? (
        <div className="flex flex-col gap-6">
          {comments.map(comment => (
            <CommentRow
              key={comment.id}
              comment={comment}
              onReply={onCommentReply}
              onShare={onCommentShare}
              onLike={onCommentLike}
              onZap={onCommentZap}
              onOptions={onCommentOptions}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
