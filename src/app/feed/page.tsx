"use client"

import { AppPage, DemoContentRightAside } from "@/components/AppShell"
import { Feed } from "@/components/Feed"
import { MOCK_CARDS } from "@/components/Feed/mock-data"
import { MOCK_VIDEO_PAGE } from "@/components/ContentPage/mock-data"

export default function FeedPage() {
  return (
    <AppPage
      center={
        <Feed
          cards={MOCK_CARDS}
          onUnlock={id => console.log("→ unlock", id)}
          onWishlist={id => console.log("→ wishlist", id)}
          onOptions={id => console.log("→ options", id)}
          onComment={id => console.log("→ comment", id)}
          onShare={id => console.log("→ share", id)}
          onLike={id => console.log("→ like", id)}
          onBoost={id => console.log("→ boost", id)}
        />
      }
      right={<DemoContentRightAside contentType="video" mock={MOCK_VIDEO_PAGE} />}
    />
  )
}
