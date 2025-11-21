"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, User } from "lucide-react"

export default function LoginPage() {
    const { login, register } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!username || !password) {
            setError("Please fill in all fields")
            return
        }
        const success = login(username, password)
        if (!success) {
            setError("Invalid username or password")
        }
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (!username || !password) {
            setError("Please fill in all fields")
            return
        }
        const success = register(username, password)
        if (!success) {
            setError("Username already exists")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950 p-4">
            <Card className="w-full max-w-md glass-card border-0">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 overflow-hidden rounded-xl bg-indigo-600/20 p-2">
                        <img src="/logo.png" alt="TrackTrade" className="h-full w-full object-contain" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">TrackTrade</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your credentials to access your journal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 p-1">
                            <TabsTrigger
                                value="login"
                                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="register"
                                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-300"
                            >
                                Register
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username-login" className="text-zinc-300">Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="username-login"
                                            placeholder="Enter your username"
                                            className="pl-10 glass-input text-white"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-login" className="text-zinc-300">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="password-login"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="pl-10 glass-input text-white"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-sm text-red-400">{error}</p>}
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username-register" className="text-zinc-300">Username</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="username-register"
                                            placeholder="Choose a username"
                                            className="pl-10 glass-input text-white"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-register" className="text-zinc-300">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="password-register"
                                            type="password"
                                            placeholder="Choose a password"
                                            className="pl-10 glass-input text-white"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-sm text-red-400">{error}</p>}
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
