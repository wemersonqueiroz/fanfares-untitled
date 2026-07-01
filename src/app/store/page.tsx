"use client"

import { useState } from "react"
import { AppPage, useStoreDemo } from "@/components/AppShell"
import { MyStore } from "@/components/MyStore"
import { MOCK_STORE_COLLECTIONS, type StoreCollection } from "@/mocks/store"

export default function StorePage() {
  const [collections, setCollections] = useState<StoreCollection[]>(MOCK_STORE_COLLECTIONS)
  const [mode, setMode] = useState<"view" | "manage">("view")
  const demo = useStoreDemo()

  return (
    <AppPage
      center={
        <MyStore
          mode={mode}
          collections={collections}
          onChange={setCollections}
          onEditStore={() => setMode("manage")}
          onSave={() => setMode("view")}
          {...demo}
        />
      }
    />
  )
}
