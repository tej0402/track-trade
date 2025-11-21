"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Trade, useTrades } from "@/context/TradeContext"
import { EditTradeModal } from "./EditTradeModal"
import { useState } from "react"

interface TradeTableProps {
    trades: Trade[]
}

export function TradeTable({ trades }: TradeTableProps) {
    const { deleteTrade, updateTrade } = useTrades()
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null)

    return (
        <>
            <div className="rounded-xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-white/5">
                            <TableHead className="w-[100px] text-zinc-300">Date</TableHead>
                            <TableHead className="text-zinc-300">Pair</TableHead>
                            <TableHead className="text-zinc-300">Strike</TableHead>
                            <TableHead className="text-zinc-300">Type</TableHead>
                            <TableHead className="text-right text-zinc-300">Entry</TableHead>
                            <TableHead className="text-right text-zinc-300">Exit</TableHead>
                            <TableHead className="text-right text-zinc-300">Capital</TableHead>
                            <TableHead className="text-right text-zinc-300">Lots</TableHead>
                            <TableHead className="text-right text-zinc-300">P&L</TableHead>
                            <TableHead className="text-zinc-300">Status</TableHead>
                            <TableHead className="text-zinc-300 max-w-[200px]">Notes</TableHead>
                            <TableHead className="text-right text-zinc-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.map((trade) => (
                            <TableRow key={trade.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="font-medium text-zinc-200">
                                    {new Date(trade.date).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).replace(/ /g, '-')}
                                </TableCell>
                                <TableCell className="text-zinc-200">{trade.pair}</TableCell>
                                <TableCell className="text-zinc-200">{trade.strike}</TableCell>
                                <TableCell>
                                    <Badge variant={trade.type === "Long" ? "default" : "secondary"}>
                                        {trade.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-zinc-200">{trade.entry}</TableCell>
                                <TableCell className="text-right text-zinc-200">{trade.exit}</TableCell>
                                <TableCell className="text-right text-zinc-200">{trade.capital ? `₹${trade.capital}` : '-'}</TableCell>
                                <TableCell className="text-right text-zinc-200">{trade.lots || '-'}</TableCell>
                                <TableCell className={`text-right font-medium ${trade.pnl > 0 ? "text-green-500" : trade.pnl < 0 ? "text-red-500" : "text-zinc-400"}`}>
                                    {trade.pnl > 0 ? "+₹" : trade.pnl < 0 ? "-₹" : "₹"}{Math.abs(trade.pnl)}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={trade.status === "Win" ? "success" : trade.status === "Loss" ? "destructive" : "outline"}>
                                        {trade.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-400 max-w-[200px] truncate" title={trade.notes}>
                                    {trade.notes || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="border-zinc-800 bg-zinc-950 text-zinc-200">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                className="focus:bg-zinc-900 focus:text-white cursor-pointer"
                                                onClick={() => setEditingTrade(trade)}
                                            >
                                                Edit trade
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer">View details</DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-zinc-800" />
                                            <DropdownMenuItem
                                                className="text-red-500 focus:bg-red-950/20 focus:text-red-400 cursor-pointer"
                                                onClick={() => deleteTrade(trade.id)}
                                            >
                                                Delete trade
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {editingTrade && (
                <EditTradeModal
                    trade={editingTrade}
                    open={!!editingTrade}
                    onOpenChange={(open) => !open && setEditingTrade(null)}
                    onUpdateTrade={updateTrade}
                />
            )}
        </>
    )
}
