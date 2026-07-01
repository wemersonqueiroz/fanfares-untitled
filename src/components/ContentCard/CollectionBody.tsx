"use client"

import { cx } from "@/utils/cx"
import { LockedPricePill } from "./internals"

export type CollectionBodyProps = {
  coverUrls?: string[]
  isLocked: boolean
  /** Unlock price — when locked, displayed in a centered pill instead of a lock icon. */
  price?: string
}

const CELL_GRADIENTS = [
  "from-[#27115f] to-[#1a0a40]",
  "from-[#102a56] to-[#091a38]",
  "from-[#102a18] to-[#081710]",
  "from-[#2a1f10] to-[#170f08]",
]

/** Body for `content.type === "collection"` — 2×2 cover mosaic with optional lock overlay. */
export function CollectionBody({ coverUrls, isLocked, price }: CollectionBodyProps) {
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 grid-rows-2 size-full gap-px bg-app-border">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={cx(
              "overflow-hidden bg-gradient-to-br",
              CELL_GRADIENTS[i]
            )}>
            {coverUrls?.[i] && (
              <img
                src={coverUrls[i]}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
          <LockedPricePill price={price} />
        </div>
      )}
    </div>
  )
}
