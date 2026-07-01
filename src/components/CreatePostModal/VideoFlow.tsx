"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowNarrowRight } from "@untitledui/icons"
import { ComposeShow, defaultComposeShowValues, type ComposeShowValues } from "@/components/ComposeShow"
import { ShowContentStep, defaultShowContentValues, type ShowContentValues } from "@/components/ComposeShow/ContentStep"
import { ComposeVideo, defaultComposeVideoValues, type ComposeVideoValues } from "@/components/ComposeVideo"
import { VideoContentStep, defaultVideoContentValues, type VideoContentValues } from "@/components/ComposeVideo/ContentStep"
import { coverAspectRatio } from "@/utils/coverAspect"
import { ImageCropper } from "./ImageCropper"
import { MonetisationStep, defaultMonetisationState, type MonetisationState } from "./MonetisationStep"
import {
  StructuredStepShell,
  VIDEO_SHOW_STEPS,
  VIDEO_SINGLE_STEPS,
} from "./StructuredStepShell"
import { VideoTypeSelectScreen, type VideoMode } from "./VideoTypeSelectScreen"
import type { PostKind } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type VideoFlowProps = {
  onClose: () => void
  /** Go back to kind picker. */
  onBack: () => void
  onPublish?: (kind: PostKind, content: string) => void
  /** Called after publish — orchestrator shows the Published screen. */
  onPublished: () => void
  /** Notifies the orchestrator when the flow enters/leaves the crop sub-screen. */
  onCroppingChange?: (cropping: boolean) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

type Screen =
  | "type-select"
  | "video-setup"
  | "video-content"
  | "show-setup"
  | "show-content"
  | "price-splits"
  | "crop"

/**
 * Video flow with two sub-flows:
 *   single: type-select → video-setup → [crop?] → video-content → price-splits → published
 *   show:   type-select → show-setup  → [crop?] → show-content  → price-splits → published
 *
 * Every cropped image is locked to 16:9 (video, video-show).
 */
export function VideoFlow({
  onClose,
  onBack,
  onPublish,
  onPublished,
  onCroppingChange,
}: VideoFlowProps) {
  const [screen, setScreen] = useState<Screen>("type-select")
  const [mode, setMode] = useState<VideoMode>("single")
  const [videoSetup, setVideoSetup] = useState<ComposeVideoValues>(defaultComposeVideoValues())
  const [videoContent, setVideoContent] = useState<VideoContentValues>(defaultVideoContentValues())
  const [showSetup, setShowSetup] = useState<ComposeShowValues>(defaultComposeShowValues())
  const [showContent, setShowContent] = useState<ShowContentValues>(defaultShowContentValues())
  const [monetisation, setMonetisation] = useState<MonetisationState>(defaultMonetisationState())

  // Crop state — a small state machine so we know which field to write the
  // resulting blob back into and which screen to return to after Save/Cancel.
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropTarget, setCropTarget] = useState<
    "video-thumbnail" | "show-artwork" | "show-episode-thumbnail" | null
  >(null)

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
      if (target === "video-thumbnail") {
        setVideoSetup(v => ({ ...v, thumbnailFile: file, thumbnailCroppedBlob: null }))
      } else if (target === "show-artwork") {
        setShowSetup(v => ({ ...v, showArtworkFile: file, showArtworkCroppedBlob: null }))
      } else {
        setShowSetup(v => ({
          ...v,
          episodeThumbnailFile: file,
          episodeThumbnailCroppedBlob: null,
        }))
      }
      setScreen("crop")
    },
    []
  )

  const returnScreen = (): Screen =>
    cropTarget === "video-thumbnail" ? "video-setup" : "show-setup"

  const handleCropSave = useCallback((blob: Blob) => {
    if (cropTarget === "video-thumbnail") {
      setVideoSetup(v => ({ ...v, thumbnailCroppedBlob: blob }))
    } else if (cropTarget === "show-artwork") {
      setShowSetup(v => ({ ...v, showArtworkCroppedBlob: blob }))
    } else if (cropTarget === "show-episode-thumbnail") {
      setShowSetup(v => ({ ...v, episodeThumbnailCroppedBlob: blob }))
    }
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    const back = returnScreen()
    setCropTarget(null)
    setScreen(back)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropTarget])

  const handleCropCancel = useCallback(() => {
    setCropSrc(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    const back = returnScreen()
    setCropTarget(null)
    setScreen(back)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropTarget])

  function publish() {
    const title = mode === "single" ? videoSetup.title : showSetup.showTitle
    onPublish?.("video", title)
    onPublished()
  }

  if (screen === "crop" && cropSrc) {
    // Every video/show image is 16:9.
    return (
      <ImageCropper
        imageSrc={cropSrc}
        aspectRatio={coverAspectRatio("video")}
        onSave={handleCropSave}
        onCancel={handleCropCancel}
      />
    )
  }

  if (screen === "type-select") {
    return (
      <VideoTypeSelectScreen
        onClose={onClose}
        onBack={onBack}
        onSelect={selectedMode => {
          setMode(selectedMode)
          setScreen(selectedMode === "single" ? "video-setup" : "show-setup")
        }}
      />
    )
  }

  if (screen === "price-splits") {
    return (
      <MonetisationStep
        flow="structured"
        kindLabel={mode === "show" ? "Show" : "Video"}
        state={monetisation}
        onChange={setMonetisation}
        onClose={onClose}
        onBack={() => setScreen(mode === "single" ? "video-content" : "show-content")}
        onPublish={publish}
        steps={mode === "single" ? VIDEO_SINGLE_STEPS : VIDEO_SHOW_STEPS}
        monetisationStepIndex={2}
      />
    )
  }

  if (screen === "video-content") {
    return (
      <StructuredStepShell
        title="Create New Video"
        subtitle="Upload your video and configure preview content."
        steps={VIDEO_SINGLE_STEPS}
        activeStep={1}
        onClose={onClose}
        onBack={() => setScreen("video-setup")}
        onNext={() => setScreen("price-splits")}
        nextLabel="Save & Continue"
        nextIcon={ArrowNarrowRight}>
        <VideoContentStep
          videoTitle={videoSetup.title || "Video Title"}
          onVideoTitleChange={title => setVideoSetup(v => ({ ...v, title }))}
          values={videoContent}
          onChange={setVideoContent}
        />
      </StructuredStepShell>
    )
  }

  if (screen === "video-setup") {
    return (
      <StructuredStepShell
        title="Create New Video"
        subtitle="Add a title, thumbnail, and description."
        steps={VIDEO_SINGLE_STEPS}
        activeStep={0}
        onClose={onClose}
        onBack={() => setScreen("type-select")}
        onNext={() => setScreen("video-content")}
        nextLabel="Save & Continue"
        nextIcon={ArrowNarrowRight}>
        <ComposeVideo
          values={videoSetup}
          onChange={setVideoSetup}
          onThumbnailCropRequest={openCropper("video-thumbnail")}
        />
      </StructuredStepShell>
    )
  }

  if (screen === "show-content") {
    return (
      <StructuredStepShell
        title="Create New Show"
        subtitle="Upload your season and episode files."
        steps={VIDEO_SHOW_STEPS}
        activeStep={1}
        onClose={onClose}
        onBack={() => setScreen("show-setup")}
        onNext={() => setScreen("price-splits")}
        nextLabel="Save & Continue"
        nextIcon={ArrowNarrowRight}>
        <ShowContentStep
          showTitle={showSetup.showTitle}
          values={showContent}
          onChange={setShowContent}
        />
      </StructuredStepShell>
    )
  }

  // screen === "show-setup"
  return (
    <StructuredStepShell
      title="Create New Show"
      subtitle="Set up your show and first episode details."
      steps={VIDEO_SHOW_STEPS}
      activeStep={0}
      onClose={onClose}
      onBack={() => setScreen("type-select")}
      onNext={() => setScreen("show-content")}
      nextLabel="Save & Continue"
      nextIcon={ArrowNarrowRight}>
      <ComposeShow
        values={showSetup}
        onChange={setShowSetup}
        onShowArtworkCropRequest={openCropper("show-artwork")}
        onEpisodeThumbnailCropRequest={openCropper("show-episode-thumbnail")}
      />
    </StructuredStepShell>
  )
}
