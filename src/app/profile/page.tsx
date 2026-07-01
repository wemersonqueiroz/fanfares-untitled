"use client"

import { AppPage, useProfileDemo } from "@/components/AppShell"
import { ProfilePage } from "@/components/Profile"

export default function ProfileRoute() {
  const demo = useProfileDemo()
  return (
    <AppPage
      center={
        <ProfilePage
          isOwnProfile={false}
          isFollowing={false}
          {...demo}
        />
      }
    />
  )
}
