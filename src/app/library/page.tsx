"use client"

import { AppPage } from "@/components/AppShell"
import { LibraryPage } from "@/components/Library"

export default function LibraryRoute() {
  return (
    <AppPage
      center={
        <LibraryPage
          onCardClick={title => console.log("→ open content", title)}
          onShowAll={sectionId => console.log("→ show all", sectionId)}
          onCardPlay={title => console.log("→ play", title)}
          onCardOptions={title => console.log("→ options", title)}
          onCardShare={title => console.log("→ share", title)}
          onCardFavourite={title => console.log("→ favourite", title)}
          onCardDownload={title => console.log("→ download", title)}
        />
      }
    />
  )
}
