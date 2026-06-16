"use client"

import { useState } from "react"
import { AppPage, DemoContentRightAside } from "@/components/AppShell"
import { MyStore } from "@/components/MyStore"
import { MOCK_STORE_COLLECTIONS, type StoreCollection } from "@/components/MyStore/mock-data"
import { MOCK_VIDEO_PAGE } from "@/components/ContentPage/mock-data"

export default function StorePage() {
  const [collections, setCollections] = useState<StoreCollection[]>(MOCK_STORE_COLLECTIONS)
  const [mode, setMode] = useState<"view" | "manage">("view")

  return (
    <AppPage
      center={
        <MyStore
          mode={mode}
          collections={collections}
          onChange={setCollections}
          onEditStore={() => setMode("manage")}
          onSave={() => setMode("view")}
          onAddItems={id => console.log("→ add items to collection", id)}
          onShowAll={id => console.log("→ show all for collection", id)}
        />
      }
      right={
        <DemoContentRightAside contentType="video" mock={MOCK_VIDEO_PAGE} />
      }
    />
  )
}
