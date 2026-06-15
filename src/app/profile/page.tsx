"use client"

import { useRouter } from "next/navigation"
import { AppPage } from "@/components/AppShell"
import { ProfilePage } from "@/components/Profile"

export default function ProfileRoute() {
  const router = useRouter()
  return (
    <AppPage
      center={
        <ProfilePage
          isOwnProfile={false}
          isFollowing={false}
          onBack={() => router.back()}
          onOptions={() => console.log("→ options")}
          onQrCode={() => console.log("→ show QR")}
          onZap={() => console.log("→ zap")}
          onFollow={() => console.log("→ follow / unfollow")}
          onEditProfile={() => console.log("→ edit profile")}
          onFollowingClick={() => console.log("→ following list")}
          onFollowersClick={() => console.log("→ followers list")}
          onWebsiteClick={() => console.log("→ open website")}
          onShowAll={id => console.log("→ show all", id)}
          onCardClick={title => console.log("→ card click", title)}
          onCardPlay={title => console.log("→ play", title)}
          onCardOptions={title => console.log("→ card options", title)}
          onCardShare={title => console.log("→ share", title)}
          onCardFavourite={title => console.log("→ favourite", title)}
          onCardDownload={title => console.log("→ download", title)}
          onUnlock={id => console.log("→ unlock", id)}
          onWishlistToggle={id => console.log("→ wishlist toggle", id)}
          onComment={id => console.log("→ comment", id)}
          onShare={id => console.log("→ share", id)}
          onLike={id => console.log("→ like", id)}
          onBoost={id => console.log("→ boost", id)}
        />
      }
    />
  )
}
