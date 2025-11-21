import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { TradeProvider } from "@/context/TradeContext"
import { SettingsProvider } from "@/context/SettingsContext"
import { AuthProvider } from "@/context/AuthContext"
import { AuthWrapper } from "@/components/layout/AuthWrapper"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrackTrade - Premium Trading Journal",
  description: "Track your trades, analyze performance, and master the markets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased selection:bg-indigo-500/30`}>
        <AuthProvider>
          <SettingsProvider>
            <TradeProvider>
              <AuthWrapper>
                {children}
              </AuthWrapper>
            </TradeProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
