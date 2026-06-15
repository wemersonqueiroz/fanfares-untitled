"use client"

import { cx } from "@/utils/cx"
import { HeroTitle } from "@/components/HeroTitle"
import { ContentPage } from "./index"
import type { ContentPageProps } from "./index"

// ── Public types ──────────────────────────────────────────────────────────────

export type ArticleSection = {
  /** Optional section heading */
  heading?: string
  /** Body text (supports newlines) */
  body: string
  /** Optional inline image URL */
  imageUrl?: string
  /** Alt text for the inline image */
  imageAlt?: string
}

export type ArticlePageProps = Omit<
  ContentPageProps,
  | "contentType"
  | "topContent" // controlled internally
  | "showChaptersTab" // articles don't have chapters
> & {
  /** Large banner / hero image for the article */
  heroImageUrl?: string
  /**
   * Article body sections — each section can have a heading, body text,
   * and an optional inline image.
   */
  sections?: ArticleSection[]
}

// ── Article top content ───────────────────────────────────────────────────────

function ArticleHero({
  title,
  heroImageUrl,
  sections = [],
}: {
  title: string
  heroImageUrl?: string
  sections: ArticleSection[]
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner image */}
      {heroImageUrl && (
        <div className="w-full aspect-[16/7] rounded-md overflow-hidden border border-black/10">
          <img src={heroImageUrl} alt="" className="size-full object-cover" />
        </div>
      )}

      <HeroTitle title={title} />

      {/* Article body sections */}
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-3">
          {section.heading && (
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">
              {section.heading}
            </h2>
          )}
          <p
            className={cx(
              "text-base text-text-tertiary leading-[1.7] whitespace-pre-wrap"
            )}>
            {section.body}
          </p>
          {section.imageUrl && (
            <div className="w-full rounded-md overflow-hidden border border-app-border mt-2">
              <img
                src={section.imageUrl}
                alt={section.imageAlt ?? ""}
                className="w-full object-cover max-h-article-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticlePage({
  title,
  heroImageUrl,
  sections = [],
  description,
  activeTab = "comments",
  ...rest
}: ArticlePageProps) {
  return (
    <ContentPage
      {...rest}
      contentType="article"
      title={title}
      description={description}
      activeTab={activeTab}
      showChaptersTab={false}
      chapters={[]}
      topContent={
        <ArticleHero
          title={title}
          heroImageUrl={heroImageUrl}
          sections={sections}
        />
      }
    />
  )
}
