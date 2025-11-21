"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Trade {
    id: string
    date: string
    pair: string
    strike?: string
    type: "Long" | "Short"
    entry: number
    exit: number
    capital?: number
    lots?: number
    pnl: number
    status: "Win" | "Loss" | "Breakeven"
    notes?: string
}

interface TradeContextType {
    trades: Trade[]
    addTrade: (trade: Omit<Trade, "id" | "date">) => void
    updateTrade: (id: string, updatedTrade: Partial<Trade>) => void
    deleteTrade: (id: string) => void
    clearAllTrades: () => void
}

const TradeContext = createContext<TradeContextType | undefined>(undefined)

const initialTrades: Trade[] = []

import { useAuth } from "./AuthContext"

// ... (interfaces remain the same)

export function TradeProvider({ children }: { children: React.ReactNode }) {
    const { currentUser } = useAuth()
    const [trades, setTrades] = useState<Trade[]>([])
    const [isInitialized, setIsInitialized] = useState(false)

    // Load trades from localStorage on mount or when user changes
    useEffect(() => {
        if (!currentUser) {
            setTrades([])
            setIsInitialized(false)
            return
        }

        const storageKey = `trades_${currentUser.username}`
        const savedTrades = localStorage.getItem(storageKey)
        if (savedTrades) {
            try {
                setTrades(JSON.parse(savedTrades))
            } catch (e) {
                console.error("Failed to parse trades from localStorage", e)
                setTrades([])
            }
        } else {
            setTrades([])
        }
        setIsInitialized(true)
    }, [currentUser])

    // Save trades to localStorage whenever they change, but only after initialization and if user exists
    useEffect(() => {
        if (isInitialized && currentUser) {
            const storageKey = `trades_${currentUser.username}`
            localStorage.setItem(storageKey, JSON.stringify(trades))
        }
    }, [trades, isInitialized, currentUser])

    // ... (addTrade, updateTrade, deleteTrade remain the same)

    const clearAllTrades = () => {
        if (currentUser) {
            const storageKey = `trades_${currentUser.username}`
            localStorage.setItem(storageKey, "[]")
            setTrades([])
        }
    }

    const addTrade = (newTradeData: Omit<Trade, "id" | "date">) => {
        const newTrade: Trade = {
            ...newTradeData,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
        }
        setTrades((prevTrades) => [newTrade, ...prevTrades])
    }

    const updateTrade = (id: string, updatedTrade: Partial<Trade>) => {
        setTrades((prevTrades) =>
            prevTrades.map((trade) => (trade.id === id ? { ...trade, ...updatedTrade } : trade))
        )
    }

    const deleteTrade = (id: string) => {
        setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== id))
    }



    return (
        <TradeContext.Provider value={{ trades, addTrade, updateTrade, deleteTrade, clearAllTrades }}>
            {children}
        </TradeContext.Provider>
    )
}

export function useTrades() {
    const context = useContext(TradeContext)
    if (context === undefined) {
        throw new Error("useTrades must be used within a TradeProvider")
    }
    return context
}
