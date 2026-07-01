"use client"

import { useState, useCallback } from "react"
import { Modal } from "@/components/Modal"
import { ArticleFlow } from "./ArticleFlow"
import { AudiobookFlow } from "./AudiobookFlow"
import { KindPickerScreen, type PostKind } from "./KindPickerScreen"
import { NoteFlow } from "./NoteFlow"
import { PodcastFlow } from "./PodcastFlow"
import { PublishedScreen } from "./PublishedScreen"
import { VideoFlow } from "./VideoFlow"

// Re-export the public types so external consumers keep working.
export type { PostKind } from "./KindPickerScreen"
export type { VideoMode } from "./VideoTypeSelectScreen"

// ── Public types ──────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Modal orchestrator for the create-post flow.
 * Owns:
 *   - the active kind (which flow component is rendered)
 *   - the "published" notification (which flow just finished)
 *   - the Modal chrome (and its full-bleed swap when the Article flow enters cropping)
 *
 * Each flow component (NoteFlow, AudiobookFlow, PodcastFlow, ArticleFlow,
 * VideoFlow) owns its own values, internal screen state, and step transitions.
 */
export function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPublish,
  onShareAndEarn,
  onViewPost,
  onAddMedia,
}: CreatePostModalProps) {
  const [kind, setKind] = useState<PostKind | null>(null)
  const [publishedKind, setPublishedKind] = useState<PostKind | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const handleClose = useCallback(() => {
    onClose()
    // Reset after the close animation finishes so the user doesn't see the
    // form revert before it's gone.
    setTimeout(() => {
      setKind(null)
      setPublishedKind(null)
      setIsCropping(false)
    }, 200)
  }, [onClose])

  const handleBackToKindPicker = useCallback(() => {
    setKind(null)
  }, [])

  const handlePublished = useCallback(() => {
    if (kind) setPublishedKind(kind)
  }, [kind])

  function renderContent() {
    if (publishedKind) {
      return (
        <PublishedScreen
          kind={publishedKind}
          onClose={handleClose}
          onShareAndEarn={() => {
            onShareAndEarn?.()
            handleClose()
          }}
          onViewPost={() => {
            onViewPost?.()
            handleClose()
          }}
        />
      )
    }

    if (kind === null) {
      return <KindPickerScreen onClose={handleClose} onSelect={setKind} />
    }

    switch (kind) {
      case "note":
      case "image":
        return (
          <NoteFlow
            kind={kind}
            currentUser={currentUser}
            onClose={handleClose}
            onBack={handleBackToKindPicker}
            onPublish={onPublish}
            onPublished={handlePublished}
            onAddMedia={onAddMedia}
          />
        )
      case "audiobook":
      case "book":
        return (
          <AudiobookFlow
            kind={kind}
            onClose={handleClose}
            onBack={handleBackToKindPicker}
            onPublish={onPublish}
            onPublished={handlePublished}
            onCroppingChange={setIsCropping}
          />
        )
      case "podcast":
        return (
          <PodcastFlow
            onClose={handleClose}
            onBack={handleBackToKindPicker}
            onPublish={onPublish}
            onPublished={handlePublished}
            onCroppingChange={setIsCropping}
          />
        )
      case "video":
        return (
          <VideoFlow
            onClose={handleClose}
            onBack={handleBackToKindPicker}
            onPublish={onPublish}
            onPublished={handlePublished}
            onCroppingChange={setIsCropping}
          />
        )
      case "article":
        return (
          <ArticleFlow
            onClose={handleClose}
            onBack={handleBackToKindPicker}
            onPublish={onPublish}
            onPublished={handlePublished}
            onCroppingChange={setIsCropping}
          />
        )
      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={isCropping ? "Crop media" : "Create a post"}
      showClose={false}
      maxWidth="max-w-[640px]"
      className={
        isCropping
          ? "!p-0 overflow-hidden"
          : "overflow-y-auto max-h-[90vh] scrollbar-hide"
      }>
      {renderContent()}
    </Modal>
  )
}
