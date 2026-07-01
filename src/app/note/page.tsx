"use client"

import { NotePage } from "@/components/ContentPage/NotePage"
import { MOCK_NOTE_PAGE } from "@/mocks/content-page"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"

export default function NoteDemoPage() {
  const demo = useContentPageDemo({ defaultTab: "comments" })
  return <NotePage {...MOCK_NOTE_PAGE} {...demo} />
}
