"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { FanfaresMenu } from "@/components/FanfaresMenu"
import type { FanfaresMenuUser } from "@/components/FanfaresMenu"
import { MobileBottomNav } from "@/components/ContentPage/MobileBottomNav"
import { PageColumns } from "@/components/PageColumns"
import { ContentRightAside } from "@/components/ContentPage/ContentRightAside"
import { MOCK_VIDEO_PAGE } from "@/mocks/content-page"
import type { PostKind } from "@/components/CreatePostModal"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"
import type {
  ContentPageCreator,
  ContentPagePurchase,
} from "@/components/ContentPage"
import type {
  SidebarCreator,
  SidebarEpisode,
  SidebarInfoItem,
  RightSidebarSocial,
} from "@/components/RightSidebar"

// Re-export the demo-handler hooks so routes only need one import path.
export { useBrowseDemo } from "./use-browse-demo"
export { useFeedDemo } from "./use-feed-demo"
export { useProfileDemo } from "./use-profile-demo"
export { useStoreDemo } from "./use-store-demo"

// ── Shared demo user ──────────────────────────────────────────────────────────

const DEMO_USER: FanfaresMenuUser = {
  name: "Short Fiat",
  email: "shortfiat@fanfares.io",
}

// ── useFanfaresMenuDemo ───────────────────────────────────────────────────────

export type FanfaresMenuDemoOpts = {
  activeHref: string
  user?: FanfaresMenuUser
}

/** Demo props for `FanfaresMenu` — spread into the component. */
export function useFanfaresMenuDemo({ activeHref, user = DEMO_USER }: FanfaresMenuDemoOpts) {
  return {
    activeHref,
    user,
    onViewProfile: () => console.log("→ navigate to /profile"),
    onSettingsClick: () => console.log("→ navigate to /settings"),
    onLogOut: () => console.log("→ sign out"),
    onPublish: (kind: PostKind, content: string) =>
      console.log("→ publish", kind, content),
    onShareAndEarn: () => console.log("→ share & earn"),
    onViewPost: () => console.log("→ view post"),
    onAddMedia: () => console.log("→ add media"),
  }
}

// ── useMobileBottomNavDemo ────────────────────────────────────────────────────

export type MobileBottomNavDemoOpts = {
  activeHref: string
  user?: FanfaresMenuUser
  className?: string
}

/** Demo props for `MobileBottomNav` — spread into the component. */
export function useMobileBottomNavDemo({
  activeHref,
  user = DEMO_USER,
  className = "flex lg:hidden",
}: MobileBottomNavDemoOpts) {
  return {
    activeHref,
    currentUser: user,
    onPublish: (kind: PostKind, content: string) =>
      console.log("→ publish", kind, content),
    onShareAndEarn: () => console.log("→ share & earn"),
    onViewPost: () => console.log("→ view post"),
    onAddMedia: () => console.log("→ add media"),
    className,
  }
}

// ── useContentRightAsideDemo ──────────────────────────────────────────────────

/** Shape of a content-page mock that feeds `ContentRightAside`. */
export type DemoContentMock = {
  title: string
  creator: ContentPageCreator
  purchase: ContentPagePurchase
  social: RightSidebarSocial
  sidebarCreators?: SidebarCreator[]
  /** Chapters/episodes rendered between the title and Creators panel (video/podcast variants). */
  sidebarEpisodes?: SidebarEpisode[]
  about?: string
  infoItems?: SidebarInfoItem[]
}

export type ContentRightAsideDemoOpts = {
  contentType: ContentType
  mock: DemoContentMock
}

/** Demo props for `ContentRightAside` — flattens a content mock + console.log callbacks. */
export function useContentRightAsideDemo({
  contentType,
  mock,
}: ContentRightAsideDemoOpts) {
  return {
    contentType,
    title: mock.title,
    creatorName: mock.creator.name,
    purchaseState: mock.purchase.state,
    social: mock.social,
    creators: mock.sidebarCreators,
    episodes: mock.sidebarEpisodes,
    about: mock.about,
    infoItems: mock.infoItems,
    onPlay: () => console.log("→ play"),
    onDownload: () => console.log("→ download"),
    onWishlist: () => console.log("→ wishlist"),
    onOptions: () => console.log("→ options"),
    onShareAndEarn: () => console.log("→ share & earn"),
    onUnlock: () => console.log("→ unlock"),
    onFollow: (name: string) => console.log("→ follow", name),
    onComment: () => console.log("→ comment"),
    onShare: () => console.log("→ share"),
    onLike: () => console.log("→ like"),
    onZap: () => console.log("→ zap"),
  }
}

// ── AppPage ───────────────────────────────────────────────────────────────────

export type AppPageProps = {
  /** Center column content. */
  center: ReactNode
  /**
   * Right sidebar slot.
   * - `undefined` (default) → renders the standard video `ContentRightAside`
   * - `null` → suppress the right sidebar entirely
   * - any ReactNode → custom override
   */
  right?: ReactNode | null
  /** Optional left override. Defaults to `FanfaresMenu` with demo handlers. */
  left?: ReactNode
  /** Override active route path. Defaults to current pathname. */
  activeHref?: string
}

/**
 * Standard non-content page shell: full-screen flex column with bg-app-bg,
 * 3-column PageColumns layout, and the mobile bottom nav pinned at the
 * bottom. Renders the real `FanfaresMenu`, `MobileBottomNav`, and
 * `ContentRightAside` components pre-filled with their `useXxxDemo()` hooks.
 */
export function AppPage({ center, right, left, activeHref }: AppPageProps) {
  const pathname = usePathname()
  const href = activeHref ?? pathname

  // Hooks must be called unconditionally — even if `left`/`right` overrides
  // mean the default props are unused this render, the call order has to
  // stay stable. The demo hooks are stateless so the extra calls are free.
  const fanfaresMenuProps = useFanfaresMenuDemo({ activeHref: href })
  const mobileBottomNavProps = useMobileBottomNavDemo({ activeHref: href })
  const defaultRightAsideProps = useContentRightAsideDemo({
    contentType: "video",
    mock: MOCK_VIDEO_PAGE,
  })

  const resolvedRight =
    right === undefined ? (
      <ContentRightAside {...defaultRightAsideProps} />
    ) : right === null ? undefined : (
      right
    )

  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">
      <PageColumns
        left={left ?? <FanfaresMenu {...fanfaresMenuProps} />}
        center={center}
        right={resolvedRight}
      />
      <MobileBottomNav {...mobileBottomNavProps} />
    </div>
  )
}
