"use client"

import { ArticlePage } from "@/components/ContentPage/ArticlePage"
import { MOCK_ARTICLE_PAGE } from "@/mocks/content-page"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function ArticleDemoPage() {
  const demo = useContentPageDemo({ defaultTab: "comments", withPlayer: false })
  return <ArticlePage {...MOCK_ARTICLE_PAGE} {...demo} />
}
