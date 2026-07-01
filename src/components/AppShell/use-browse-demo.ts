"use client"

/**
 * Demo callbacks for the BrowseCard-driven list pages (Library, Wishlist,
 * Explore). Returns every card callback they could need; routes pass the
 * subset their inner component supports. Extras are simply ignored.
 */
export function useBrowseDemo() {
  return {
    onCardClick:     (title: string) => console.log("→ open content", title),
    onShowAll:       (sectionId: string) => console.log("→ show all", sectionId),
    onCardPlay:      (title: string) => console.log("→ play", title),
    onCardOptions:   (title: string) => console.log("→ options", title),
    onCardShare:     (title: string) => console.log("→ share", title),
    onCardFavourite: (title: string) => console.log("→ favourite", title),
    onCardDownload:  (title: string) => console.log("→ download", title),
    onCardWishlist:  (title: string) => console.log("→ wishlist", title),
  }
}
