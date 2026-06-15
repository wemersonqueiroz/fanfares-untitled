"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { FanfaresMenu } from "@/components/FanfaresMenu"
import type { FanfaresMenuUser } from "@/components/FanfaresMenu"
import { MobileBottomNav } from "@/components/ContentPage/MobileBottomNav"
import { PageColumns } from "@/components/PageColumns"
import { ContentRightAside } from "@/components/ContentPage/ContentRightAside"
import type { ContentType } from "@/components/ContentCard/ContentTypeTag"
import type {
  ContentPageCreator,
  ContentPagePurchase,
} from "@/components/ContentPage"
import type {
  SidebarCreator,
  SidebarInfoItem,
  RightSidebarSocial,
} from "@/components/RightSidebar"

// ── Shared demo user ──────────────────────────────────────────────────────────

const DEMO_USER: FanfaresMenuUser = {
  name: "Short Fiat",
  email: "shortfiat@fanfares.io",
}

// ── DemoFanfaresMenu ──────────────────────────────────────────────────────────

export type DemoFanfaresMenuProps = {
  activeHref: string
  user?: FanfaresMenuUser
}

/** FanfaresMenu pre-wired with demo callbacks. */
export function DemoFanfaresMenu({ activeHref, user = DEMO_USER }: DemoFanfaresMenuProps) {
  return (
    <FanfaresMenu
      activeHref={activeHref}
      user={user}
      onViewProfile={() => console.log("→ navigate to /profile")}
      onSettingsClick={() => console.log("→ navigate to /settings")}
      onLogOut={() => console.log("→ sign out")}
      onPublish={(kind, content) => console.log("→ publish", kind, content)}
      onShareAndEarn={() => console.log("→ share & earn")}
      onViewPost={() => console.log("→ view post")}
      onAddMedia={() => console.log("→ add media")}
    />
  )
}

// ── DemoMobileBottomNav ───────────────────────────────────────────────────────

export type DemoMobileBottomNavProps = {
  activeHref: string
  user?: FanfaresMenuUser
  className?: string
}

/** MobileBottomNav pre-wired with demo callbacks. */
export function DemoMobileBottomNav({
  activeHref,
  user = DEMO_USER,
  className,
}: DemoMobileBottomNavProps) {
  return (
    <MobileBottomNav
      activeHref={activeHref}
      currentUser={user}
      onPublish={(kind, content) => console.log("→ publish", kind, content)}
      onShareAndEarn={() => console.log("→ share & earn")}
      onViewPost={() => console.log("→ view post")}
      onAddMedia={() => console.log("→ add media")}
      className={className ?? "flex lg:hidden"}
    />
  )
}

// ── DemoContentRightAside ─────────────────────────────────────────────────────

/** Shape of a content-page mock that DemoContentRightAside can render from. */
export type DemoContentMock = {
  title: string
  creator: ContentPageCreator
  purchase: ContentPagePurchase
  social: RightSidebarSocial
  sidebarCreators?: SidebarCreator[]
  about?: string
  infoItems?: SidebarInfoItem[]
}

export type DemoContentRightAsideProps = {
  contentType: ContentType
  mock: DemoContentMock
}

/** ContentRightAside pre-wired with demo callbacks, filled from a mock. */
export function DemoContentRightAside({ contentType, mock }: DemoContentRightAsideProps) {
  const { title, creator, purchase, social, sidebarCreators, about, infoItems } = mock
  return (
    <ContentRightAside
      contentType={contentType}
      title={title}
      creatorName={creator.name}
      purchaseState={purchase.state}
      price={"price" in purchase ? purchase.price : undefined}
      social={social}
      creators={sidebarCreators}
      about={about}
      infoItems={infoItems}
      onPlay={() => console.log("→ play")}
      onDownload={() => console.log("→ download")}
      onWishlist={() => console.log("→ wishlist")}
      onOptions={() => console.log("→ options")}
      onShareAndEarn={() => console.log("→ share & earn")}
      onUnlock={() => console.log("→ unlock")}
      onFollow={name => console.log("→ follow", name)}
      onComment={() => console.log("→ comment")}
      onShare={() => console.log("→ share")}
      onLike={() => console.log("→ like")}
      onBoost={() => console.log("→ boost")}
    />
  )
}

// ── AppPage ───────────────────────────────────────────────────────────────────

export type AppPageProps = {
  /** Center column content. */
  center: ReactNode
  /** Optional right sidebar (e.g. ContentRightAside). */
  right?: ReactNode
  /** Optional left override. Defaults to DemoFanfaresMenu. */
  left?: ReactNode
  /** Override active route path. Defaults to current pathname. */
  activeHref?: string
}

/**
 * Standard non-content page shell: full-screen flex column with bg-app-bg,
 * 3-column PageColumns layout, and the mobile bottom nav pinned at the
 * bottom. Demo callbacks for the menu/mobile-nav are baked in.
 */
export function AppPage({ center, right, left, activeHref }: AppPageProps) {
  const pathname = usePathname()
  const href = activeHref ?? pathname

  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">
      <PageColumns
        left={left ?? <DemoFanfaresMenu activeHref={href} />}
        center={center}
        right={right}
      />
      <DemoMobileBottomNav activeHref={href} />
    </div>
  )
}
