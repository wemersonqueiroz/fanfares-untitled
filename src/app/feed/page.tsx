"use client"

import { AppPage, useFeedDemo } from "@/components/AppShell"
import { Feed } from "@/components/Feed"
import { MOCK_CARDS } from "@/mocks/feed"

export default function FeedPage() {
  const demo = useFeedDemo()
  return (
    <AppPage center={<Feed cards={MOCK_CARDS} {...demo} />} />
  )
}
