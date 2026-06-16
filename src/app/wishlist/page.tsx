"use client"

import { AppPage, DemoContentRightAside } from "@/components/AppShell"
import { MOCK_VIDEO_PAGE } from "@/components/ContentPage/mock-data"
import { WishlistPage } from "@/components/Wishlist"

export default function WishlistRoute() {
  return (
    <AppPage
      center={
        <WishlistPage
          onCardClick={title => console.log("→ open content", title)}
          onShowAll={sectionId => console.log("→ show all", sectionId)}
          onCardPlay={title => console.log("→ play", title)}
          onCardOptions={title => console.log("→ options", title)}
          onCardWishlist={title => console.log("→ remove from wishlist", title)}
        />
      }
      right={
        <DemoContentRightAside contentType="video" mock={MOCK_VIDEO_PAGE} />
      }
    />
  )
}
