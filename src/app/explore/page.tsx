"use client"

import { AppPage } from "@/components/AppShell"
import { ExplorePage } from "@/components/Explore"

export default function ExploreRoute() {
  return (
    <AppPage
      center={
        <ExplorePage
          onCardClick={title => console.log("→ open content", title)}
          onShowAll={sectionId => console.log("→ show all", sectionId)}
          onCardPlay={title => console.log("→ play", title)}
          onCardOptions={title => console.log("→ options", title)}
          onCardWishlist={title => console.log("→ wishlist", title)}
        />
      }
    />
  )
}
