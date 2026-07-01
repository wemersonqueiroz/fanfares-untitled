"use client"

import { AppPage, useContentRightAsideDemo } from "@/components/AppShell"
import { ContentRightAside } from "@/components/ContentPage/ContentRightAside"
import { SettingsPage } from "@/components/Settings"
import { MOCK_AUDIOBOOK_PAGE } from "@/mocks/content-page"

export default function SettingsRoute() {
  return (
    <AppPage
      center={<SettingsPage />}
      right={
        <ContentRightAside
          {...useContentRightAsideDemo({ contentType: "audiobook", mock: MOCK_AUDIOBOOK_PAGE })}
        />
      }
    />
  )
}
