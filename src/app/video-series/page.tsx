"use client"

import { ContentPage } from "@/components/ContentPage"
import { MOCK_VIDEO_SERIES_PAGE } from "@/components/ContentPage/mock-data"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function VideoSeriesPage() {
  const demo = useContentPageDemo({ defaultTab: "episodes", withPlayer: false })
  return <ContentPage {...MOCK_VIDEO_SERIES_PAGE} {...demo} />
}
