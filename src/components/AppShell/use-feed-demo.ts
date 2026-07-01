"use client"

/**
 * Demo callbacks for the Feed route. Spread into the Feed component to wire
 * every ContentCard social action to console.log.
 */
export function useFeedDemo() {
  return {
    onPlay:      (id: string) => console.log("→ play", id),
    onUnlock:    (id: string) => console.log("→ unlock", id),
    onWishlist:  (id: string) => console.log("→ wishlist", id),
    onOptions:   (id: string) => console.log("→ options", id),
    onComment:   (id: string) => console.log("→ comment", id),
    onShare:     (id: string) => console.log("→ share", id),
    onLike:      (id: string) => console.log("→ like", id),
    onZap:     (id: string) => console.log("→ zap", id),
  }
}
