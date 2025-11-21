"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTrades } from "@/context/TradeContext"
import { useSettings } from "@/context/SettingsContext"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity, DollarSign, BarChart3, Target } from "lucide-react"

export function StatsGrid() {
    const { trades } = useTrades()
    const { settings } = useSettings()

    const totalProfit = trades.reduce((acc, trade) => acc + trade.pnl, 0)
    const totalTrades = trades.length
    const winningTrades = trades.filter(t => t.status === "Win").length
    const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0

    // Calculate Average R:R (simplified as Average Win / Average Loss for now)
    const wins = trades.filter(t => t.pnl > 0)
    const losses = trades.filter(t => t.pnl < 0)
    const avgWin = wins.length > 0 ? wins.reduce((acc, t) => acc + t.pnl, 0) / wins.length : 0
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0) / losses.length) : 0
    const riskReward = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : "0"

    // Calculate Brokerage
    const totalBrokerage = trades.reduce((acc, trade) => {
        if (!settings.brokerage.enabled) return acc
        if (settings.brokerage.type === "fixed") {
            return acc + settings.brokerage.amount
        } else {
            // Percentage based on capital (if available) or 0
            return acc + ((trade.capital || 0) * (settings.brokerage.amount / 100))
        }
    }, 0)

    // Use initial capital from settings, default to 100000 if not set
    const initialCapital = settings.account.initialCapital || 100000
    const netProfit = totalProfit - totalBrokerage
    const roi = (netProfit / initialCapital) * 100

    const stats = [
        {
            title: "Net P&L",
            value: `${netProfit > 0 ? "+" : netProfit < 0 ? "-" : ""}₹${Math.abs(netProfit).toLocaleString()}`,
            change: `Gross: ₹${totalProfit.toLocaleString()}`,
            icon: DollarSign,
            trend: netProfit >= 0 ? "up" : "down",
        },
        {
            title: "Brokerage",
            value: `₹${totalBrokerage.toLocaleString()}`,
            change: settings.brokerage.enabled ? "Charges applied" : "Charges disabled",
            icon: Activity, // Using Activity for now, or could import another icon
            trend: "down", // Costs are always "down" in a sense, or neutral
        },
        {
            title: "Win Rate",
            value: `${winRate}%`,
            change: `${winningTrades} wins / ${totalTrades} trades`,
            icon: Target,
            trend: winRate >= 50 ? "up" : "down",
        },
        {
            title: "ROI",
            value: `${roi.toFixed(2)}%`,
            change: `on ₹${initialCapital.toLocaleString()} capital`,
            icon: TrendingUp,
            trend: roi >= 0 ? "up" : "down",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="glass-card border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-300">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <p className="text-xs text-zinc-300 mt-1">
                            {stat.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
