"use client"

import { CheckCircle, Share07, XClose } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import type { PostKind } from "./KindPickerScreen"

// ── Public types ──────────────────────────────────────────────────────────────

export type PublishedScreenProps = {
  kind: PostKind
  onClose: () => void
  onShareAndEarn?: () => void
  onViewPost?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

/** Success screen shown after a post is published, regardless of flow. */
export function PublishedScreen({
  kind,
  onClose,
  onShareAndEarn,
  onViewPost,
}: PublishedScreenProps) {
  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1)

  return (
    <div className="flex flex-col gap-0">
      <div className="flex justify-end pb-2">
        <IconButton icon={XClose} label="Close" variant="ghost" size="sm" iconSize={24} onClick={onClose} />
      </div>
      <div className="flex flex-col gap-5 px-2 pb-2">
        <div className={cx("flex items-center justify-center size-14 rounded-full shrink-0", "bg-utility-green-100")}>
          <CheckCircle size={28} color="var(--color-utility-green-600)" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-heading-list-item text-text-primary">{kindLabel} Published!</h2>
          <p className="text-body-default text-text-tertiary">
            Your {kindLabel.toLowerCase()} is now live on the Nostr Network.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" iconRight={Share07} onClick={onShareAndEarn} className="w-full">
            Share &amp; Earn
          </Button>
          <Button variant="secondary" size="lg" onClick={onViewPost} className="w-full">
            View Your {kindLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
