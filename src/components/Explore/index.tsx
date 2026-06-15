"use client"

import { useState } from "react"
import { ChevronDown } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { BrowseCard, BrowseSection } from "@/components/BrowseCard"
import { Button } from "@/components/Button"
import { CategoryPillsRow } from "@/components/CategoryPillsRow"
import { SearchInput } from "@/components/SearchInput"
import { SegmentedControl } from "@/components/SegmentedControl"
import { SortDropdown, DEFAULT_BROWSE_SORT_OPTIONS } from "@/components/SortDropdown"
import {
  EXPLORE_CATEGORIES,
  EXPLORE_SECTIONS,
  EXPLORE_TIME_PERIODS,
  type ExploreCategory,
  type ExploreTimePeriod,
} from "./mock-data"

// ── Public types ──────────────────────────────────────────────────────────────

export type ExplorePageCallbacks = {
  onCardClick?: (title: string) => void
  onShowAll?: (sectionId: string) => void
  onCardPlay?: (title: string) => void
  onCardOptions?: (title: string) => void
  onCardWishlist?: (title: string) => void
}

export type ExplorePageProps = ExplorePageCallbacks & {
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ExplorePage({
  onCardClick,
  onShowAll,
  onCardPlay,
  onCardOptions,
  onCardWishlist,
  className,
}: ExplorePageProps) {
  const [activeCategory, setActiveCategory] = useState<ExploreCategory>("All")
  const [timePeriod, setTimePeriod] = useState<ExploreTimePeriod>("12 months")
  const [sortBy, setSortBy] = useState("")
  const [search, setSearch] = useState("")

  return (
    <div className={cx("flex flex-col gap-8", className)}>
      <h1 className="text-heading-section-strong text-text-primary shrink-0">
        Explore
      </h1>

      <div className="flex flex-col gap-8 shrink-0">
        <CategoryPillsRow
          options={EXPLORE_CATEGORIES}
          value={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="flex gap-2 items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            ariaLabel="Search content"
          />
          <Button
            variant="secondary"
            size="sm"
            iconRight={ChevronDown}
            aria-label="Filter by content type"
            className="px-3.5 py-2.5">
            All
          </Button>
          <SortDropdown
            options={DEFAULT_BROWSE_SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>

        <SegmentedControl
          options={EXPLORE_TIME_PERIODS}
          value={timePeriod}
          onChange={setTimePeriod}
          className="w-fit"
        />
      </div>

      <div className="flex flex-col gap-6">
        {EXPLORE_SECTIONS.map(section => (
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
