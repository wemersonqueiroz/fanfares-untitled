"use client"

/**
 * Demo callbacks for the Store route. Only covers the two genuinely demo
 * handlers — the real interactivity (`mode`, `collections`, `onEditStore`,
 * `onSave`) lives in the route file as actual state.
 */
export function useStoreDemo() {
  return {
    onAddItems: (id: string) => console.log("→ add items to collection", id),
    onShowAll:  (id: string) => console.log("→ show all for collection", id),
  }
}
