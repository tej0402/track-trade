"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Settings {
    brokerage: {
        enabled: boolean
        type: "fixed" | "percentage"
        amount: number
    }
    risk: {
        maxDailyLoss: number
        dailyTarget: number
    }
    preferences: {
        defaultPair: string
        defaultLots: number
    }
    account: {
        initialCapital: number
    }
}

const defaultSettings: Settings = {
    brokerage: {
        enabled: false,
        type: "fixed",
        amount: 20,
    },
    risk: {
        maxDailyLoss: 5000,
        dailyTarget: 2000,
    },
    preferences: {
        defaultPair: "NIFTY 50",
        defaultLots: 1,
    },
    account: {
        initialCapital: 100000,
    },
}

interface SettingsContextType {
    settings: Settings
    updateSettings: (newSettings: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

import { useAuth } from "./AuthContext"

// ... (interfaces and defaultSettings remain the same)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth()
    const [settings, setSettings] = useState<Settings>(defaultSettings)

    // Load settings from localStorage on mount or when user changes
    useEffect(() => {
        if (!currentUser) {
            setSettings(defaultSettings)
            return
        }

        const storageKey = `settings_${currentUser.username}`
        const savedSettings = localStorage.getItem(storageKey)
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                setSettings((prev) => ({
                    ...prev,
                    ...parsed,
                    brokerage: { ...prev.brokerage, ...parsed.brokerage },
                    risk: { ...prev.risk, ...parsed.risk },
                    preferences: { ...prev.preferences, ...parsed.preferences },
                    account: { ...prev.account, ...parsed.account },
                }))
            } catch (e) {
                console.error("Failed to parse settings from localStorage", e)
            }
        } else {
            // Reset to defaults for new user if no settings exist
            setSettings(defaultSettings)
        }
    }, [currentUser])

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (currentUser) {
            const storageKey = `settings_${currentUser.username}`
            localStorage.setItem(storageKey, JSON.stringify(settings))
        }
    }, [settings, currentUser])

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({
            ...prev,
            ...newSettings,
        }))
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider")
    }
    return context
}
