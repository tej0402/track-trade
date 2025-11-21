"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
    username: string
    password: string // In a real app, this should be hashed!
}

interface AuthContextType {
    currentUser: User | null
    login: (username: string, password: string) => boolean
    register: (username: string, password: string) => boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [users, setUsers] = useState<User[]>([])

    // Load users and session from localStorage on mount
    useEffect(() => {
        const savedUsers = localStorage.getItem("users")
        if (savedUsers) {
            try {
                setUsers(JSON.parse(savedUsers))
            } catch (e) {
                console.error("Failed to parse users", e)
            }
        }

        const savedSession = localStorage.getItem("currentUser")
        if (savedSession) {
            try {
                setCurrentUser(JSON.parse(savedSession))
            } catch (e) {
                console.error("Failed to parse session", e)
            }
        }
    }, [])

    const login = (username: string, password: string) => {
        const user = users.find(u => u.username === username && u.password === password)
        if (user) {
            setCurrentUser(user)
            localStorage.setItem("currentUser", JSON.stringify(user))
            return true
        }
        return false
    }

    const register = (username: string, password: string) => {
        if (users.some(u => u.username === username)) {
            return false // Username already exists
        }
        const newUser = { username, password }
        const updatedUsers = [...users, newUser]
        setUsers(updatedUsers)
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        // Auto login after register
        setCurrentUser(newUser)
        localStorage.setItem("currentUser", JSON.stringify(newUser))
        return true
    }

    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem("currentUser")
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
