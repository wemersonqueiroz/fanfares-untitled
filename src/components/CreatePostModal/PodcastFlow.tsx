"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowNarrowRight } from "@untitledui/icons"
import { ComposePodcast, type ComposePodcastValues } from "@/components/ComposePodcast"
import { PodcastContentStep, type PodcastContentValues } from "@/components/ComposePodcast/ContentStep"
import { coverAspectRatio } from "@/utils/coverAspect"
import { ImageCropper } from "./ImageCropper"
import { MonetisationStep, defaultMonetisationState, type MonetisationState } from "./MonetisationStep"
import { StructuredStepShell } from "./StructuredStepShell"
import type { PostKind } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type PodcastFlowProps = {
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

function defaultPodcastSetupValues(): ComposePodcastValues {
  return {
    showTitle: "",
    showArtworkFile: null,
    showArtworkCroppedBlob: null,
    showDescription: "",
    showTags: [],
    showRssFeed: "",
    episodeTitle: "",
    episodeThumbnailFile: null,
    episodeThumbnailCroppedBlob: null,
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

type Screen = "setup" | "crop" | "content-upload" | "price-splits"

/**
 * Podcast structured flow:
 *   setup → [crop?] → content-upload (episode + preview) → price-splits → published
 *
 * Both show artwork and episode thumbnail crop to 16:9 (podcast / podcast-show).
 */
export function PodcastFlow({
  onClose,
  onBack,
  onPublish,
  onPublished,
  onCroppingChange,
}: PodcastFlowProps) {
  const [screen, setScreen] = useState<Screen>("setup")
  const [setupValues, setSetupValues] = useState<ComposePodcastValues>(defaultPodcastSetupValues())
  const [contentValues, setContentValues] = useState<PodcastContentValues>(defaultPodcastContentValues())
  const [monetisation, setMonetisation] = useState<MonetisationState>(defaultMonetisationState())

  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropTarget, setCropTarget] = useState<"show-artwork" | "episode-thumbnail" | null>(null)

  useEffect(() => {
    onCroppingChange?.(screen === "crop")
  }, [screen, onCroppingChange])

  const openCropper = useCallback(
    (target: NonNullable<typeof cropTarget>) => (file: File) => {
      setCropSrc(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(file)
      })
      setCropTarget(target)
      if (target === "show-artwork") {
        setSetupValues(v => ({ ...v, showArtworkFile: file, showArtworkCroppedBlob: null }))
      } else {
        setSetupValues(v => ({
          ...v,
          episodeThumbnailFile: file,
          episodeThumbnailCroppedBlob: null,
        }))
      }
      setScreen("crop")
    },
    []
  )

  const handleCropSave = useCallback((blob: Blob) => {
    if (cropTarget === "show-artwork") {
      setSetupValues(v => ({ ...v, showArtworkCroppedBlob: blob }))
    } else if (cropTarget === "episode-thumbnail") {
      setSetupValues(v => ({ ...v, episodeThumbnailCroppedBlob: blob }))
    }
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setCropTarget(null)
    setScreen("setup")
  }, [cropTarget])

  const handleCropCancel = useCallback(() => {
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setCropTarget(null)
    setScreen("setup")
  }, [])

  function publish() {
    onPublish?.("podcast", setupValues.episodeTitle)
    onPublished()
  }

  if (screen === "crop" && cropSrc) {
    return (
      <ImageCropper
        imageSrc={cropSrc}
        aspectRatio={coverAspectRatio("podcast")}
        onSave={handleCropSave}
        onCancel={handleCropCancel}
      />
    )
  }

  if (screen === "price-splits") {
    return (
      <MonetisationStep
        flow="structured"
        kindLabel="Podcast"
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
        title="Create New Podcast"
        subtitle="Upload your episode and configure preview content."
        activeStep={1}
        onClose={onClose}
        onBack={() => setScreen("setup")}
        onNext={() => setScreen("price-splits")}
        nextLabel="Save & Continue"
        nextIcon={ArrowNarrowRight}>
        <PodcastContentStep
          episodeTitle={setupValues.episodeTitle || "Episode Title"}
          onEpisodeTitleChange={title =>
            setSetupValues(v => ({ ...v, episodeTitle: title }))
          }
          values={contentValues}
          onChange={setContentValues}
        />
      </StructuredStepShell>
    )
  }

  return (
    <StructuredStepShell
      title="Create New Podcast"
      subtitle="Set up your show and first episode."
      activeStep={0}
      onClose={onClose}
      onBack={onBack}
      onNext={() => setScreen("content-upload")}
      nextLabel="Save & Continue"
      nextIcon={ArrowNarrowRight}>
      <ComposePodcast
        mode="new-show"
        values={setupValues}
        onChange={setSetupValues}
        onShowArtworkCropRequest={openCropper("show-artwork")}
        onEpisodeThumbnailCropRequest={openCropper("episode-thumbnail")}
      />
    </StructuredStepShell>
  )
}
