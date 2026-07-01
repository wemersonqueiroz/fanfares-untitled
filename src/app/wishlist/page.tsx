"use client"

import { AppPage, useBrowseDemo } from "@/components/AppShell"
import { WishlistPage } from "@/components/Wishlist"

export default function WishlistRoute() {
  const demo = useBrowseDemo()
  return (
    <AppPage center={<WishlistPage {...demo} />} />
  )
}
