"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowNarrowRight } from "@untitledui/icons"
import { ComposeAudiobook, type ComposeAudiobookValues } from "@/components/ComposeAudiobook"
import { ContentUpload } from "@/components/ComposeAudiobook/ContentUpload"
import { coverAspectRatio } from "@/utils/coverAspect"
import { ImageCropper } from "./ImageCropper"
import { MonetisationStep, defaultMonetisationState, type MonetisationState } from "./MonetisationStep"
import { StructuredStepShell } from "./StructuredStepShell"
import type { PostKind } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type AudiobookFlowProps = {
  /** "audiobook" or "book" — controls label + accepted file types. */
  kind: Extract<PostKind, "audiobook" | "book">
  onClose: () => void
  /** Go back to kind picker. */
  onBack: () => void
  onPublish?: (kind: PostKind, content: string) => void
  /** Called after publish — orchestrator shows the Published screen. */
  onPublished: () => void
  /** Notifies the orchestrator when the flow enters/leaves the crop sub-screen. */
  onCroppingChange?: (cropping: boolean) => void
}

// ── Defaults ──────────────────────────────────────────────────────────────────

function defaultSetupValues(): ComposeAudiobookValues {
  return {
    title: "",
    coverFile: null,
    coverCroppedBlob: null,
    description: "",
    creators: [],
    tags: [],
    rssFeed: "",
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

type Screen = "setup" | "crop" | "content-upload" | "price-splits"

/**
 * Audiobook / Book structured flow:
 *   setup → [crop?] → content-upload → price-splits → published
 *
 * Cover crop aspect: audiobook = 1:1 square, book = 4:5 portrait.
 */
export function AudiobookFlow({
  kind,
  onClose,
  onBack,
  onPublish,
  onPublished,
  onCroppingChange,
}: AudiobookFlowProps) {
  const [screen, setScreen] = useState<Screen>("setup")
  const [setupValues, setSetupValues] = useState<ComposeAudiobookValues>(defaultSetupValues())
  const [contentFile, setContentFile] = useState<File | null>(null)
  const [monetisation, setMonetisation] = useState<MonetisationState>(defaultMonetisationState())
  const [cropSrc, setCropSrc] = useState<string | null>(null)

  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1)
  const cropRatio = coverAspectRatio(kind === "audiobook" ? "audiobook" : "book")

  useEffect(() => {
    onCroppingChange?.(screen === "crop")
  }, [screen, onCroppingChange])

  const handleCropRequest = useCallback((file: File) => {
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setSetupValues(v => ({ ...v, coverFile: file, coverCroppedBlob: null }))
    setScreen("crop")
  }, [])

  const handleCropSave = useCallback((blob: Blob) => {
    setSetupValues(v => ({ ...v, coverCroppedBlob: blob }))
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setScreen("setup")
  }, [])

  const handleCropCancel = useCallback(() => {
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setScreen("setup")
  }, [])

  function publish() {
    onPublish?.(kind, setupValues.title)
    onPublished()
  }

  if (screen === "crop" && cropSrc) {
    return (
      <ImageCropper
        imageSrc={cropSrc}
        aspectRatio={cropRatio}
        onSave={handleCropSave}
        onCancel={handleCropCancel}
      />
    )
  }

  if (screen === "price-splits") {
    return (
      <MonetisationStep
        flow="structured"
        kindLabel={kindLabel}
        state={monetisation}
        onChange={setMonetisation}
        onClose={onClose}
        onBack={() => setScreen("content-upload")}
        onPublish={publish}
      />
    )
  }

  if (screen === "content-upload") {
    return (
      <StructuredStepShell
        title={`Create New ${kindLabel}`}
        subtitle="Upload the content file for your publication."
        activeStep={1}
        onClose={onClose}
        onBack={() => setScreen("setup")}
        onNext={() => setScreen("price-splits")}
        nextLabel="Save & Continue"
        nextIcon={ArrowNarrowRight}>
        <ContentUpload
          accept={kind === "audiobook" ? "audio/*" : "application/epub+zip,.pdf,.mobi"}
          fileLabel={kind === "audiobook" ? "audio file" : "ebook file"}
          value={contentFile}
          onChange={setContentFile}
        />
      </StructuredStepShell>
    )
  }

  return (
    <StructuredStepShell
      title={`Create New ${kindLabel}`}
      subtitle="Fill in the details for your publication."
      activeStep={0}
      onClose={onClose}
      onBack={onBack}
      onNext={() => setScreen("content-upload")}
      nextLabel="Save & Continue"
      nextIcon={ArrowNarrowRight}>
      <ComposeAudiobook
        values={setupValues}
        onChange={setSetupValues}
        kind={kind}
        onCoverCropRequest={handleCropRequest}
      />
    </StructuredStepShell>
  )
}
