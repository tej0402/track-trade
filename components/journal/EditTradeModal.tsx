"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Trade } from "@/context/TradeContext"

interface EditTradeModalProps {
    trade: Trade
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateTrade: (id: string, trade: Partial<Trade>) => void
}

export function EditTradeModal({ trade, open, onOpenChange, onUpdateTrade }: EditTradeModalProps) {
    const [formData, setFormData] = useState({
        pair: "",
        strike: "",
        type: "",
        entry: "",
        exit: "",
        capital: "",
        lots: "",
        pnl: "",
        status: "",
        notes: "",
    })

    useEffect(() => {
        if (trade) {
            setFormData({
                pair: trade.pair,
                strike: trade.strike || "",
                type: trade.type,
                entry: trade.entry.toString(),
                exit: trade.exit.toString(),
                capital: trade.capital?.toString() || "",
                lots: trade.lots?.toString() || "",
                pnl: trade.pnl.toString(),
                status: trade.status,
                notes: trade.notes || "",
            })
        }
    }, [trade])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdateTrade(trade.id, {
            pair: formData.pair,
            strike: formData.strike,
            type: formData.type as "Long" | "Short",
            entry: Number(formData.entry),
            exit: Number(formData.exit),
            capital: formData.capital ? Number(formData.capital) : undefined,
            lots: formData.lots ? Number(formData.lots) : undefined,
            pnl: formData.status === "Loss" ? -Math.abs(Number(formData.pnl)) : Math.abs(Number(formData.pnl)),
            status: formData.status as "Win" | "Loss" | "Breakeven",
            notes: formData.notes,
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass border-0 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Trade</DialogTitle>
                        <DialogDescription className="text-zinc-300">
                            Update the details of your trade here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-pair" className="text-right text-zinc-300">
                                Pair
                            </Label>
                            <Input
                                id="edit-pair"
                                placeholder="NIFTY 50"
                                className="col-span-3 glass-input text-white placeholder:text-zinc-500"
                                value={formData.pair}
                                onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-strike" className="text-right text-zinc-300">
                                Strike
                            </Label>
                            <Input
                                id="edit-strike"
                                placeholder="25600 PE"
                                className="col-span-3 glass-input text-white placeholder:text-zinc-500"
                                value={formData.strike}
                                onChange={(e) => setFormData({ ...formData, strike: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right text-zinc-300">
                                Type
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                                required
                            >
                                <SelectTrigger className="col-span-3 glass-input text-white border-white/10">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                    <SelectItem value="Long">Long</SelectItem>
                                    <SelectItem value="Short">Short</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-entry" className="text-right text-zinc-300">
                                Entry
                            </Label>
                            <Input
                                id="edit-entry"
                                type="number"
                                step="any"
                                className="col-span-3 glass-input text-white"
                                value={formData.entry}
                                onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-exit" className="text-right text-zinc-300">
                                Exit
                            </Label>
                            <Input
                                id="edit-exit"
                                type="number"
                                step="any"
                                className="col-span-3 glass-input text-white"
                                value={formData.exit}
                                onChange={(e) => setFormData({ ...formData, exit: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-capital" className="text-right text-zinc-300">
                                Capital
                            </Label>
                            <Input
                                id="edit-capital"
                                type="number"
                                step="any"
                                className="col-span-3 glass-input text-white"
                                value={formData.capital}
                                onChange={(e) => setFormData({ ...formData, capital: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-lots" className="text-right text-zinc-300">
                                Lots
                            </Label>
                            <Input
                                id="edit-lots"
                                type="number"
                                step="any"
                                className="col-span-3 glass-input text-white"
                                value={formData.lots}
                                onChange={(e) => setFormData({ ...formData, lots: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-pnl" className="text-right text-zinc-300">
                                P&L
                            </Label>
                            <Input
                                id="edit-pnl"
                                type="number"
                                step="any"
                                className="col-span-3 glass-input text-white"
                                value={formData.pnl}
                                onChange={(e) => setFormData({ ...formData, pnl: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-status" className="text-right text-zinc-300">
                                Status
                            </Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                required
                            >
                                <SelectTrigger className="col-span-3 glass-input text-white border-white/10">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                    <SelectItem value="Win">Win</SelectItem>
                                    <SelectItem value="Loss">Loss</SelectItem>
                                    <SelectItem value="Breakeven">Breakeven</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-notes" className="text-right text-zinc-300">
                                Notes
                            </Label>
                            <textarea
                                id="edit-notes"
                                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
                                placeholder="What did you learn from this trade?"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
