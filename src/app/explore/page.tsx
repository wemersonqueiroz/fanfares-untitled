"use client"

import { AppPage, useBrowseDemo } from "@/components/AppShell"
import { ExplorePage } from "@/components/Explore"

export default function ExploreRoute() {
  const demo = useBrowseDemo()
  return (
    <AppPage center={<ExplorePage {...demo} />} />
  )
}
