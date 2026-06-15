"use client"

import { useRef, useState, useEffect } from "react"
import { ArrowLeft, ZoomIn, ZoomOut } from "@untitledui/icons"
import { Button } from "@/components/Button"

// ── Public types ──────────────────────────────────────────────────────────────

export type ImageCropperProps = {
  /** Object URL or data URL of the source image */
  imageSrc: string
  /** Width ÷ height ratio, e.g. 5/2 for article (2.5:1), 1 for square */
  aspectRatio: number
  /** Called with a JPEG Blob after the user clicks Save */
  onSave: (blob: Blob) => void
  /** Called when the user clicks the back arrow (cancel) */
  onCancel: () => void
}

// ── Internals ─────────────────────────────────────────────────────────────────

/** Fixed pixel height of the drag/crop area */
const CROP_AREA_HEIGHT = 280

// ── Component ─────────────────────────────────────────────────────────────────

export function ImageCropper({ imageSrc, aspectRatio, onSave, onCancel }: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)           // 1 = cover-fit, up to 5×
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef  = useRef({ sx: 0, sy: 0, px: 0, py: 0 })
  const touchRef = useRef({ sx: 0, sy: 0, px: 0, py: 0 })

  // ── Geometry (derived from state) ─────────────────────────────────────────

  // Crop box: full width OR full height — whichever is smaller
  const cropBoxW = containerW > 0
    ? Math.min(containerW, CROP_AREA_HEIGHT * aspectRatio)
    : 0
  const cropBoxH    = cropBoxW > 0 ? cropBoxW / aspectRatio : 0
  const cropBoxLeft = containerW > 0 ? (containerW - cropBoxW) / 2 : 0
  const cropBoxTop  = (CROP_AREA_HEIGHT - cropBoxH) / 2

  // Scale & image dimensions
  const baseScale = naturalSize.w > 0 && cropBoxW > 0
    ? Math.max(cropBoxW / naturalSize.w, cropBoxH / naturalSize.h)
    : 1
  const totalScale = baseScale * zoom
  const imgW = naturalSize.w * totalScale
  const imgH = naturalSize.h * totalScale

  // Image top-left so it starts centred on the crop box, then offset by pan
  const imgLeft = cropBoxLeft + cropBoxW / 2 - imgW / 2 + pan.x
  const imgTop  = cropBoxTop  + cropBoxH / 2 - imgH / 2 + pan.y

  // ── Helpers ───────────────────────────────────────────────────────────────

  function clamp(px: number, py: number) {
    const maxX = Math.max(0, imgW / 2 - cropBoxW / 2)
    const maxY = Math.max(0, imgH / 2 - cropBoxH / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, px)),
      y: Math.max(-maxY, Math.min(maxY, py)),
    }
  }

  // ── Effects ───────────────────────────────────────────────────────────────

  // Measure container width and watch for resizes
  useEffect(() => {
    function measure() {
      if (containerRef.current) setContainerW(containerRef.current.offsetWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Decode image natural dimensions
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = imageSrc
  }, [imageSrc])

  // Re-clamp pan whenever zoom or geometry changes (prevent the image from sliding off)
  useEffect(() => {
    setPan(p => clamp(p.x, p.y))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, imgW, imgH, cropBoxW, cropBoxH])

  // ── Pointer handlers ──────────────────────────────────────────────────────

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setDragging(true)
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return
    setPan(clamp(
      dragRef.current.px + e.clientX - dragRef.current.sx,
      dragRef.current.py + e.clientY - dragRef.current.sy,
    ))
  }

  function handleMouseUp() { setDragging(false) }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchRef.current = { sx: t.clientX, sy: t.clientY, px: pan.x, py: pan.y }
  }

  function handleTouchMove(e: React.TouchEvent) {
    const t = e.touches[0]
    setPan(clamp(
      touchRef.current.px + t.clientX - touchRef.current.sx,
      touchRef.current.py + t.clientY - touchRef.current.sy,
    ))
  }

  // ── Save to canvas ────────────────────────────────────────────────────────

  function handleSave() {
    // Convert crop box screen coords → source image coords
    const srcX = (cropBoxLeft - imgLeft) / totalScale
    const srcY = (cropBoxTop  - imgTop)  / totalScale
    const srcW = cropBoxW / totalScale
    const srcH = cropBoxH / totalScale

    const canvas = document.createElement("canvas")
    // 2× resolution for retina quality
    canvas.width  = Math.round(cropBoxW * 2)
    canvas.height = Math.round(cropBoxH * 2)

    const img = document.createElement("img")
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => { if (blob) onSave(blob) }, "image/jpeg", 0.92)
    }
    img.src = imageSrc
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">

      {/* Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-app-border shrink-0 bg-app-surface">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded-md px-1 -ml-1">
          <ArrowLeft size={16} color="currentColor" aria-hidden="true" />
          Crop Media
        </button>
        <Button variant="primary" size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>

      {/* Crop / drag area ────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative select-none overflow-hidden"
        style={{
          height: CROP_AREA_HEIGHT,
          background: "#000",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}>

        {/* Source image */}
        {naturalSize.w > 0 && containerW > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{
              position: "absolute",
              left: imgLeft,
              top: imgTop,
              width: imgW,
              height: imgH,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        )}

        {/* Dark overlay — 4 rects outside the crop box */}
        {cropBoxW > 0 && (
          <>
            {/* Top strip */}
            {cropBoxTop > 1 && (
              <div
                className="absolute inset-x-0 bg-black/60 pointer-events-none"
                style={{ top: 0, height: cropBoxTop }}
                aria-hidden="true"
              />
            )}
            {/* Bottom strip */}
            {cropBoxTop > 1 && (
              <div
                className="absolute inset-x-0 bg-black/60 pointer-events-none"
                style={{ top: cropBoxTop + cropBoxH, bottom: 0 }}
                aria-hidden="true"
              />
            )}
            {/* Left strip */}
            {cropBoxLeft > 1 && (
              <div
                className="absolute bg-black/60 pointer-events-none"
                style={{ left: 0, width: cropBoxLeft, top: cropBoxTop, height: cropBoxH }}
                aria-hidden="true"
              />
            )}
            {/* Right strip */}
            {cropBoxLeft > 1 && (
              <div
                className="absolute bg-black/60 pointer-events-none"
                style={{ left: cropBoxLeft + cropBoxW, right: 0, top: cropBoxTop, height: cropBoxH }}
                aria-hidden="true"
              />
            )}
            {/* Crop box border */}
            <div
              className="absolute pointer-events-none border-2 border-brand-500"
              style={{ left: cropBoxLeft, top: cropBoxTop, width: cropBoxW, height: cropBoxH }}
              aria-hidden="true"
            />
          </>
        )}
      </div>

      {/* Zoom controls ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-app-border bg-app-surface shrink-0">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => setZoom(z => Math.max(1, parseFloat((z - 0.25).toFixed(2))))}
          className="text-text-tertiary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded shrink-0">
          <ZoomOut size={18} color="currentColor" aria-hidden="true" />
        </button>

        <input
          type="range"
          min={1}
          max={5}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          aria-label="Zoom level"
          className="flex-1 accent-brand-600 cursor-pointer"
        />

        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => setZoom(z => Math.min(5, parseFloat((z + 0.25).toFixed(2))))}
          className="text-text-tertiary hover:text-text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 rounded shrink-0">
          <ZoomIn size={18} color="currentColor" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
