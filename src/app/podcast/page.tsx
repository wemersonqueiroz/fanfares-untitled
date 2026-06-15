"use client"

import { ContentPage } from "@/components/ContentPage"
import { MOCK_PODCAST_PAGE } from "@/components/ContentPage/mock-data"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function PodcastPage() {
  const demo = useContentPageDemo({ defaultTab: "chapters", chapterNoun: "episode" })
  return <ContentPage {...MOCK_PODCAST_PAGE} {...demo} />
}
