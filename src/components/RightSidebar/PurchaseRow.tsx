"use client"

import { DotsVertical } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"
import { IconButton } from "@/components/IconButton"
import { ContentTypeTag } from "@/components/ContentCard/ContentTypeTag"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"

export type PurchaseRowProps = {
  contentType: ContentType
  purchaseState: "free" | "locked" | "owned"
  onShareAndEarn?: () => void
  onUnlock?: () => void
  onOptions?: () => void
}

export function PurchaseRow({
  contentType,
  purchaseState,
  onShareAndEarn,
  onUnlock,
  onOptions,
}: PurchaseRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 shrink-0">
      <ContentTypeTag type={contentType} />

      <div className="flex items-center gap-2 shrink-0">
        {purchaseState === "owned" && (
          <button
            type="button"
            onClick={onShareAndEarn}
            className={cx(
              "flex items-center justify-center px-3 py-2 rounded-md shrink-0",
              "bg-green-700 border-2 border-white/12",
              "text-sm font-semibold text-white cursor-pointer",
              "hover:bg-green-800 transition-colors duration-150",
              "shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
            )}>
            Share &amp; Earn
          </button>
        )}
        {purchaseState === "locked" && (
          <Button variant="primary" size="sm" onClick={onUnlock}>
            Unlock
          </Button>
        )}
        <IconButton
          icon={DotsVertical}
          label="More options"
          variant="ghost"
          size="sm"
          iconSize={24}
          onClick={onOptions}
        />
      </div>
    </div>
  )
}
