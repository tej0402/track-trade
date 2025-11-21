"use client"

import { Bell, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const { currentUser, logout } = useAuth()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("query", term)
        } else {
            params.delete("query")
        }
        replace(`${pathname}?${params.toString()}`)
    }

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/50 px-6 backdrop-blur-md">
            <div className="flex flex-1 items-center gap-4">
                {pathname === "/journal" && (
                    <>
                        <Search className="h-4 w-4 text-zinc-400" />
                        <Input
                            type="search"
                            placeholder="Search trades..."
                            className="h-9 w-[200px] md:w-[300px] bg-zinc-900 text-white placeholder:text-zinc-400 border-zinc-800 focus-visible:ring-zinc-700"
                            onChange={(e) => handleSearch(e.target.value)}
                            defaultValue={searchParams.get("query")?.toString()}
                        />
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10">
                    <Bell className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700">
                            {currentUser?.username ? (
                                <span className="font-medium text-zinc-300">
                                    {currentUser.username.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <User className="h-4 w-4 text-zinc-300" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{currentUser?.username}</p>
                                <p className="text-xs leading-none text-zinc-500">User Account</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
