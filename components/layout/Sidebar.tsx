"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Journal",
        icon: BookOpen,
        href: "/journal",
        color: "text-emerald-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "text-purple-500",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col glass border-r-0">
            <div className="flex h-14 items-center border-b border-zinc-800 px-6">
                <div className="flex items-center gap-2 font-semibold text-white">
                    <div className="h-8 w-8 overflow-hidden rounded-lg bg-indigo-600/20 p-1">
                        <img src="/logo.png" alt="TrackTrade" className="h-full w-full object-contain" />
                    </div>
                    TrackTrade
                </div>
            </div>
            <div className="flex-1 px-4 py-6">
                <nav className="space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                pathname === route.href
                                    ? "bg-white/10 text-white shadow-lg shadow-indigo-500/10 border border-white/5"
                                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <route.icon className={cn("h-4 w-4", route.color)} />
                            {route.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="p-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 border border-white/5">
                    <h4 className="mb-2 text-sm font-medium text-white">Pro Plan</h4>
                    <p className="mb-4 text-xs text-zinc-300">
                        Unlock advanced analytics and AI insights.
                    </p>
                    <button className="w-full rounded-lg bg-white py-2 text-xs font-medium text-black hover:bg-zinc-200 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    )
}
