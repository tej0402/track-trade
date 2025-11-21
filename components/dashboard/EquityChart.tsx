"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTrades } from "@/context/TradeContext"
import { useSettings } from "@/context/SettingsContext"
import { useMemo } from "react"

export function EquityChart() {
    const { trades } = useTrades()
    const { settings } = useSettings()

    const data = useMemo(() => {
        // Sort trades by date ascending
        const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        let currentPnl = 0 // Start at 0 for Cumulative P&L
        const chartData = []

        // Group by date to handle multiple trades per day
        const tradesByDate = sortedTrades.reduce((acc, trade) => {
            const date = new Date(trade.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
            if (!acc[date]) acc[date] = 0

            let pnl = trade.pnl

            // Apply brokerage if enabled
            if (settings.brokerage.enabled) {
                let brokerage = 0
                if (settings.brokerage.type === "fixed") {
                    brokerage = settings.brokerage.amount
                } else {
                    brokerage = (trade.capital || 0) * (settings.brokerage.amount / 100)
                }
                pnl -= brokerage
            }

            acc[date] += pnl
            return acc
        }, {} as Record<string, number>)

        for (const [date, pnl] of Object.entries(tradesByDate)) {
            currentPnl += pnl
            chartData.push({
                date,
                pnl: currentPnl
            })
        }

        return chartData
    }, [trades, settings])

    return (
        <Card className="col-span-4 glass-card border-0">
            <CardHeader>
                <CardTitle className="text-white">Cumulative Net P&L</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" opacity={0.5} vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#71717a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#ffffff05' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-white/10 bg-zinc-950/90 p-3 shadow-xl backdrop-blur-md">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-zinc-400">
                                                            Net P&L
                                                        </span>
                                                        <span className="font-bold text-zinc-100">
                                                            ₹{payload[0].value}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar
                                dataKey="pnl"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
