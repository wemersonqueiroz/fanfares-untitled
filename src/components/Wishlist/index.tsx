"use client"

import { useState } from "react"
import { cx } from "@/utils/cx"
import { BrowseCard, BrowseSection } from "@/components/BrowseCard"
import { CategoryPillsRow } from "@/components/CategoryPillsRow"
import { SearchInput } from "@/components/SearchInput"
import { SortDropdown, DEFAULT_BROWSE_SORT_OPTIONS } from "@/components/SortDropdown"
import {
  WISHLIST_CATEGORIES,
  WISHLIST_SECTIONS,
  type WishlistCategory,
} from "./mock-data"

// ── Public types ──────────────────────────────────────────────────────────────

export type WishlistPageCallbacks = {
  onCardClick?: (title: string) => void
  onShowAll?: (sectionId: string) => void
  onCardPlay?: (title: string) => void
  onCardOptions?: (title: string) => void
  onCardWishlist?: (title: string) => void
}

export type WishlistPageProps = WishlistPageCallbacks & {
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WishlistPage({
  onCardClick,
  onShowAll,
  onCardPlay,
  onCardOptions,
  onCardWishlist,
  className,
}: WishlistPageProps) {
  const [activeCategory, setActiveCategory] = useState<WishlistCategory>("All")
  const [sortBy, setSortBy] = useState("")
  const [search, setSearch] = useState("")

  return (
    <div className={cx("flex flex-col gap-8", className)}>
      <h1 className="text-heading-section-strong text-text-primary shrink-0">
        Wishlist
      </h1>

      <div className="flex flex-col gap-8 shrink-0">
        <CategoryPillsRow
          options={WISHLIST_CATEGORIES}
          value={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="flex gap-2 items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            ariaLabel="Search wishlist"
          />
          <SortDropdown
            options={DEFAULT_BROWSE_SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      <div className="flex flex-col gap-14">
        {WISHLIST_SECTIONS.map(section => (
          <BrowseSection
            key={section.id}
            title={section.title}
            onShowAll={() => onShowAll?.(section.id)}>
            {section.cards.map((card, i) => (
              <BrowseCard
                key={`${section.id}-${i}`}
                {...card}
                onClick={() => onCardClick?.(card.title)}
                onPlay={() => onCardPlay?.(card.title)}
                onOptions={() => onCardOptions?.(card.title)}
                onWishlist={() => onCardWishlist?.(card.title)}
              />
            ))}
          </BrowseSection>
        ))}
      </div>
    </div>
  )
}
