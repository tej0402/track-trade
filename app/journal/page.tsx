"use client"

import { useState, useMemo } from "react"
import { TradeTable } from "@/components/journal/TradeTable"
import { AddTradeModal } from "@/components/journal/AddTradeModal"
import { useSearchParams } from "next/navigation"
import { useTrades } from "@/context/TradeContext"

export default function JournalPage() {
    const { trades, addTrade } = useTrades()
    const searchParams = useSearchParams()
    const query = searchParams.get("query")?.toLowerCase() || ""

    const filteredTrades = useMemo(() => {
        return trades.filter((trade) =>
            trade.pair.toLowerCase().includes(query) ||
            trade.strike?.toLowerCase().includes(query) ||
            trade.type.toLowerCase().includes(query) ||
            trade.status.toLowerCase().includes(query)
        )
    }, [trades, query])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Trade Journal</h1>
                <AddTradeModal onAddTrade={addTrade} />
            </div>
            <TradeTable trades={filteredTrades} />
        </div>
    )
}
