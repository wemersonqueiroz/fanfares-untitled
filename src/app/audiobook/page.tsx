"use client"

import { ContentPage } from "@/components/ContentPage"
import { MOCK_AUDIOBOOK_PAGE } from "@/components/ContentPage/mock-data"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function AudiobookPage() {
  const demo = useContentPageDemo({ defaultTab: "chapters" })
  return <ContentPage {...MOCK_AUDIOBOOK_PAGE} {...demo} />
}
