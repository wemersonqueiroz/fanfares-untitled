"use client"

import { AppPage, DemoContentRightAside } from "@/components/AppShell"
import { SettingsPage } from "@/components/Settings"
import { MOCK_AUDIOBOOK_PAGE } from "@/components/ContentPage/mock-data"

export default function SettingsRoute() {
  return (
    <AppPage
      center={<SettingsPage />}
      right={<DemoContentRightAside contentType="audiobook" mock={MOCK_AUDIOBOOK_PAGE} />}
    />
  )
}
