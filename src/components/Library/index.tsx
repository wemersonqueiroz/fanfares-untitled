"use client"

import { useState } from "react"
import { cx } from "@/utils/cx"
import { BrowseCard, BrowseSection } from "@/components/BrowseCard"
import { CategoryPillsRow } from "@/components/CategoryPillsRow"
import { SearchInput } from "@/components/SearchInput"
import { SegmentedControl } from "@/components/SegmentedControl"
import { SortDropdown, DEFAULT_BROWSE_SORT_OPTIONS } from "@/components/SortDropdown"
import {
  LIBRARY_CATEGORIES,
  LIBRARY_SECTIONS,
  LIBRARY_VIEW_FILTERS,
  type LibraryCategory,
  type LibraryViewFilter,
} from "./mock-data"

// ── Public types ──────────────────────────────────────────────────────────────

export type LibraryPageCallbacks = {
  onCardClick?: (title: string) => void
  onShowAll?: (sectionId: string) => void
  onCardPlay?: (title: string) => void
  onCardOptions?: (title: string) => void
  onCardShare?: (title: string) => void
  onCardFavourite?: (title: string) => void
  onCardDownload?: (title: string) => void
}

export type LibraryPageProps = LibraryPageCallbacks & {
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LibraryPage({
  onCardClick,
  onShowAll,
  onCardPlay,
  onCardOptions,
  onCardShare,
  onCardFavourite,
  onCardDownload,
  className,
}: LibraryPageProps) {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>("All")
  const [viewFilter, setViewFilter] = useState<LibraryViewFilter>("View all")
  const [sortBy, setSortBy] = useState("")
  const [search, setSearch] = useState("")

  return (
    <div className={cx("flex flex-col gap-8", className)}>
      <h1 className="text-heading-section-strong text-text-primary shrink-0">
        My Library
      </h1>

      <div className="flex flex-col gap-8 shrink-0">
        <CategoryPillsRow
          options={LIBRARY_CATEGORIES}
          value={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="flex gap-2 items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            ariaLabel="Search library"
          />
          <SegmentedControl
            options={LIBRARY_VIEW_FILTERS}
            value={viewFilter}
            onChange={setViewFilter}
          />
          <SortDropdown
            options={DEFAULT_BROWSE_SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      <div className="flex flex-col gap-14">
        {LIBRARY_SECTIONS.map(section => (
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
                onShare={() => onCardShare?.(card.title)}
                onFavourite={() => onCardFavourite?.(card.title)}
                onDownload={() => onCardDownload?.(card.title)}
              />
            ))}
          </BrowseSection>
        ))}
      </div>
    </div>
  )
}
