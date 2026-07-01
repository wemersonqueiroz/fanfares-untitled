"use client"

import { useRouter } from "next/navigation"

/**
 * Demo callbacks for the Profile route. Bundles every ProfilePage handler —
 * profile header actions, browse-card callbacks, and content-card social
 * actions — and wires `onBack` to `router.back()`.
 */
export function useProfileDemo() {
  const router = useRouter()

  return {
    // ── Profile header actions ─────────────────────────────────────────────
    onBack:            () => router.back(),
    onOptions:         () => console.log("→ options"),
    onQrCode:          () => console.log("→ show QR"),
    onZapProfile:      () => console.log("→ zap profile"),
    onFollow:          () => console.log("→ follow / unfollow"),
    onEditProfile:     () => console.log("→ edit profile"),
    onFollowingClick:  () => console.log("→ following list"),
    onFollowersClick:  () => console.log("→ followers list"),
    onWebsiteClick:    () => console.log("→ open website"),

    // ── Browse-card callbacks ──────────────────────────────────────────────
    onShowAll:         (id: string) => console.log("→ show all", id),
    onCardClick:       (title: string) => console.log("→ card click", title),
    onCardPlay:        (title: string) => console.log("→ play", title),
    onCardOptions:     (title: string) => console.log("→ card options", title),
    onCardShare:       (title: string) => console.log("→ share", title),
    onCardFavourite:   (title: string) => console.log("→ favourite", title),
    onCardDownload:    (title: string) => console.log("→ download", title),

    // ── Content-card social actions ────────────────────────────────────────
    onUnlock:          (id: string) => console.log("→ unlock", id),
    onWishlistToggle:  (id: string) => console.log("→ wishlist toggle", id),
    onComment:         (id: string) => console.log("→ comment", id),
    onShare:           (id: string) => console.log("→ share", id),
    onLike:            (id: string) => console.log("→ like", id),
    onZap:           (id: string) => console.log("→ zap", id),
  }
}
