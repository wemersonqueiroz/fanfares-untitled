"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowNarrowRight } from "@untitledui/icons"
import { ArticleEditor, defaultArticleValues, type ArticleValues } from "@/components/ComposeArticle/Editor"
import { ImageCropper } from "./ImageCropper"
import { MonetisationStep, defaultMonetisationState, type MonetisationState } from "./MonetisationStep"
import { StructuredStepShell, ARTICLE_STEPS } from "./StructuredStepShell"
import type { PostKind } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type ArticleFlowProps = {
  onClose: () => void
  /** Go back to kind picker. */
  onBack: () => void
  onPublish?: (kind: PostKind, content: string) => void
  /** Called after publish — orchestrator shows the Published screen. */
  onPublished: () => void
  /**
   * Notifies the orchestrator when the flow enters/leaves the image-cropper
   * sub-screen. The orchestrator uses this to swap the Modal chrome to a
   * full-bleed configuration while cropping.
   */
  onCroppingChange?: (cropping: boolean) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

type Screen = "editor" | "crop" | "price-splits"

/**
 * Article structured flow:
 *   editor → [crop?] → price-splits → published
 */
export function ArticleFlow({
  onClose,
  onBack,
  onPublish,
  onPublished,
  onCroppingChange,
}: ArticleFlowProps) {
  const [screen, setScreen] = useState<Screen>("editor")
  const [values, setValues] = useState<ArticleValues>(defaultArticleValues())
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [monetisation, setMonetisation] = useState<MonetisationState>(defaultMonetisationState())

  // Notify orchestrator on crop screen transitions so it can swap Modal chrome.
  useEffect(() => {
    onCroppingChange?.(screen === "crop")
  }, [screen, onCroppingChange])

  const handleCropRequest = useCallback((file: File) => {
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setValues(v => ({ ...v, coverFile: file, coverCroppedBlob: null }))
    setScreen("crop")
  }, [])

  const handleCropSave = useCallback((blob: Blob) => {
    setValues(v => ({ ...v, coverCroppedBlob: blob }))
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setScreen("editor")
  }, [])

  const handleCropCancel = useCallback(() => {
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setScreen("editor")
  }, [])

  function publish() {
    onPublish?.("article", values.title ?? "")
    onPublished()
  }

  if (screen === "crop" && cropSrc) {
    return (
      <ImageCropper
        imageSrc={cropSrc}
        aspectRatio={5 / 2}
        onSave={handleCropSave}
        onCancel={handleCropCancel}
      />
    )
  }

  if (screen === "price-splits") {
    return (
      <MonetisationStep
        flow="structured"
        kindLabel="Article"
        state={monetisation}
        onChange={setMonetisation}
        onClose={onClose}
        onBack={() => setScreen("editor")}
        onPublish={publish}
        steps={ARTICLE_STEPS}
        monetisationStepIndex={1}
      />
    )
  }

  return (
    <StructuredStepShell
      title="Create New Article"
      subtitle="Write your article and add a cover image."
      steps={ARTICLE_STEPS}
      activeStep={0}
      onClose={onClose}
      onBack={onBack}
      onNext={() => setScreen("price-splits")}
      nextLabel="Save & Continue"
      nextIcon={ArrowNarrowRight}>
      <ArticleEditor
        values={values}
        onChange={setValues}
        onCoverCropRequest={handleCropRequest}
      />
    </StructuredStepShell>
  )
}
