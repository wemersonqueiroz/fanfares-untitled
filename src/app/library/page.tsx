"use client"

import { AppPage, useBrowseDemo } from "@/components/AppShell"
import { LibraryPage } from "@/components/Library"

export default function LibraryRoute() {
  const demo = useBrowseDemo()
  return (
    <AppPage center={<LibraryPage {...demo} />} />
  )
}
