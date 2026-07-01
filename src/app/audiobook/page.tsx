"use client"

import { ContentPage } from "@/components/ContentPage"
import { MOCK_AUDIOBOOK_PAGE } from "@/mocks/content-page"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function AudiobookPage() {
  const demo = useContentPageDemo({ defaultTab: "chapters" })
  return <ContentPage {...MOCK_AUDIOBOOK_PAGE} {...demo} />
}
