import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Web3Provider } from "@/components/web3-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Highway SOS Finder",
  description: "Web3-powered emergency roadside assistance for India",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}
