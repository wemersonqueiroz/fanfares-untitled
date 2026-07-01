"use client"

import { VideoPage } from "@/components/ContentPage/VideoPage"
import { MOCK_VIDEO_PAGE } from "@/mocks/content-page"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function VideoDemoPage() {
  const demo = useContentPageDemo({ defaultTab: "comments", withPlayer: false })
  return <VideoPage {...MOCK_VIDEO_PAGE} {...demo} />
}
