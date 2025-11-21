"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTrades } from "@/context/TradeContext"

export function RecentTrades() {
    const { trades } = useTrades()
    const recentTrades = trades.slice(0, 5)

    return (
        <Card className="col-span-3 glass-card border-0">
            <CardHeader>
                <CardTitle className="text-white">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {recentTrades.map((trade, index) => (
                        <div key={index} className="flex items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none text-zinc-200 group-hover:text-white transition-colors">
                                    {trade.pair} <span className={trade.type === "Long" ? "text-green-400" : "text-red-400"}>{trade.type}</span>
                                </p>
                                <p className="text-xs text-zinc-300">
                                    {new Date(trade.date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).replace(/ /g, '-')}
                                </p>
                            </div>
                            <div className={`ml-auto font-medium ${trade.pnl > 0 ? "text-green-400" : "text-red-400"}`}>
                                {trade.pnl > 0 ? "+₹" : trade.pnl < 0 ? "-₹" : "₹"}{Math.abs(trade.pnl)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
