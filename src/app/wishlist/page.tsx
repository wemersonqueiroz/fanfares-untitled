"use client"

import { AppPage } from "@/components/AppShell"
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
    />
  )
}
