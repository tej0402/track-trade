"use client"

import { Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="fixed bottom-4 right-6 z-50 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors">
            <span>Made with</span>
            <Heart className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
            <span>by Tej</span>
        </footer>
    )
}
