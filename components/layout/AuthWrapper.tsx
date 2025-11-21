"use client"

import { useAuth } from "@/context/AuthContext"
import LoginPage from "@/app/login/page"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth()

    if (!currentUser) {
        return <LoginPage />
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <Header />
                {children}
            </main>
        </div>
    )
}
