"use client"

import { useState } from "react"
import { MonetisationStep, defaultMonetisationState, type MonetisationState } from "./MonetisationStep"
import { NoteEditorScreen } from "./NoteEditorScreen"
import type { PostKind } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type NoteFlowProps = {
  /** The picked content kind (note / image / etc with the "simple" flow). */
  kind: PostKind
  currentUser?: { avatarUrl?: string; name?: string }
  onClose: () => void
  /** Go back to kind picker. */
  onBack: () => void
  /** Called with (kind, content) once a post is published. */
  onPublish?: (kind: PostKind, content: string) => void
  /** Called after publish — orchestrator shows the Published screen. */
  onPublished: () => void
  onAddMedia?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

type Screen = "editor" | "price-splits"

/**
 * Simple "note-like" flow:
 *   editor → (if paid) price-splits → published
 */
export function NoteFlow({
  kind,
  currentUser,
  onClose,
  onBack,
  onPublish,
  onPublished,
  onAddMedia,
}: NoteFlowProps) {
  const [screen, setScreen] = useState<Screen>("editor")
  const [content, setContent] = useState("")
  const [paid, setPaid] = useState(false)
  const [monetisation, setMonetisation] = useState<MonetisationState>(defaultMonetisationState())

  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1)

  function publish() {
    onPublish?.(kind, content)
    onPublished()
  }

  if (screen === "price-splits") {
    return (
      <MonetisationStep
        flow="simple"
        kindLabel={kindLabel}
        state={monetisation}
        onChange={setMonetisation}
        onClose={onClose}
        onBack={() => setScreen("editor")}
        onPublish={publish}
      />
    )
  }

  return (
    <NoteEditorScreen
      currentUser={currentUser}
      paidContent={paid}
      onPaidContentChange={setPaid}
      onBack={onBack}
      onClose={onClose}
      onPost={text => {
        setContent(text)
        onPublish?.(kind, text)
        onPublished()
      }}
      onContinueToPay={text => {
        setContent(text)
        setScreen("price-splits")
      }}
      onAddMedia={onAddMedia}
    />
  )
}
