import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Fanfares Components",
  description: "UI component library powered by Untitled UI + Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}>
      <head>
        {/*
         * Runs synchronously before first paint — sets the correct theme
         * class before any content is rendered, preventing a flash.
         * `suppressHydrationWarning` on <html> is required because this
         * script mutates the className that React also manages; without it
         * React throws a hydration mismatch when the DOM class differs from
         * the server-rendered HTML (e.g. user saved "light" mode).
         * Default: dark-mode. Only deviates when localStorage says "light".
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fanfares-theme');if(t==='light')document.documentElement.classList.remove('dark-mode');else document.documentElement.classList.add('dark-mode');}catch(e){document.documentElement.classList.add('dark-mode');}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-app-bg scrollbar-hide">
        <div className="max-w-[1728px] mx-auto min-h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
