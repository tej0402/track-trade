"use client"

import { useState, useEffect } from "react"
import { useSettings } from "@/context/SettingsContext"
import { useTrades } from "@/context/TradeContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Trash2, Save, FileText } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings()
    const { trades, deleteTrade, clearAllTrades } = useTrades()
    const [localSettings, setLocalSettings] = useState(settings)

    // Sync local state with context when context updates (e.g. initial load)
    // Sync local state with context when context updates (e.g. initial load)
    useEffect(() => {
        setLocalSettings(settings)
    }, [settings])

    const handleSave = () => {
        updateSettings(localSettings)
        // Optional: Show a toast notification here
        alert("Settings saved successfully!")
    }

    // ... (export functions remain the same)



    const handleExportCSV = () => {
        try {
            const headers = ["Date", "Pair", "Type", "Strike", "Entry", "Exit", "Lots", "Capital", "P&L", "Status", "Notes"]
            const csvContent = [
                headers.join(","),
                ...trades.map(t => [
                    t.date,
                    t.pair,
                    t.type,
                    t.strike || "",
                    t.entry,
                    t.exit,
                    t.lots || "",
                    t.capital || "",
                    t.pnl,
                    t.status,
                    `"${t.notes || ""}"` // Quote notes to handle commas
                ].join(","))
            ].join("\n")

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob)
                link.setAttribute("href", url)
                link.setAttribute("download", "trading_journal_export.csv")
                link.style.visibility = "hidden"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } catch (error) {
            console.error("Export CSV failed:", error)
            alert("Failed to export CSV. Please try again.")
        }
    }

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF()

            doc.setFontSize(18)
            doc.text("TrackTrade Export", 14, 22)

            doc.setFontSize(11)
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

            const tableColumn = ["Date", "Pair", "Type", "Strike", "P&L", "Status"]
            const tableRows = trades.map(trade => [
                trade.date,
                trade.pair,
                trade.type,
                trade.strike || "-",
                `₹${trade.pnl}`,
                trade.status
            ])

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                styles: { fontSize: 10 },
                headStyles: { fillColor: [79, 70, 229] } // Indigo-600
            })

            doc.save("trading_journal_export.pdf")
        } catch (error) {
            console.error("Export PDF failed:", error)
            alert("Failed to export PDF. Please try again.")
        }
    }

    const handleReset = () => {
        // Direct manipulation to ensure data is gone
        try {
            localStorage.removeItem("trades")
            localStorage.setItem("trades", "[]")
            clearAllTrades() // Also update context state
            window.location.reload()
        } catch (e) {
            console.error("Reset failed", e)
            alert("Reset failed. Please try again.")
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-zinc-400">Manage your trading preferences and account details.</p>
                </div>
                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Brokerage & Taxes */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-white">Brokerage & Taxes</CardTitle>
                        <CardDescription className="text-zinc-400">Configure automatic deductions for your trades.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="brokerage-enabled" className="text-zinc-300">Auto-Deduct Charges</Label>
                            <Switch
                                id="brokerage-enabled"
                                checked={localSettings.brokerage.enabled}
                                onCheckedChange={(checked) => setLocalSettings({
                                    ...localSettings,
                                    brokerage: { ...localSettings.brokerage, enabled: checked }
                                })}
                            />
                        </div>
                        {localSettings.brokerage.enabled && (
                            <>
                                <div className="grid gap-2">
                                    <Label className="text-zinc-300">Deduction Type</Label>
                                    <Select
                                        value={localSettings.brokerage.type}
                                        onValueChange={(value: "fixed" | "percentage") => setLocalSettings({
                                            ...localSettings,
                                            brokerage: { ...localSettings.brokerage, type: value }
                                        })}
                                    >
                                        <SelectTrigger className="glass-input text-white border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                            <SelectItem value="fixed">Fixed Amount (per trade)</SelectItem>
                                            <SelectItem value="percentage">Percentage (of capital)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brokerage-amount" className="text-zinc-300">Amount ({localSettings.brokerage.type === 'fixed' ? '₹' : '%'})</Label>
                                    <Input
                                        id="brokerage-amount"
                                        type="number"
                                        className="glass-input text-white"
                                        value={localSettings.brokerage.amount}
                                        onChange={(e) => setLocalSettings({
                                            ...localSettings,
                                            brokerage: { ...localSettings.brokerage, amount: Number(e.target.value) }
                                        })}
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Risk Management */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-white">Risk Management</CardTitle>
                        <CardDescription className="text-zinc-400">Set limits to keep your trading disciplined.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="max-daily-loss" className="text-zinc-300">Max Daily Loss Limit (₹)</Label>
                            <Input
                                id="max-daily-loss"
                                type="number"
                                className="glass-input text-white"
                                value={localSettings.risk.maxDailyLoss}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    risk: { ...localSettings.risk, maxDailyLoss: Number(e.target.value) }
                                })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="daily-target" className="text-zinc-300">Daily Profit Target (₹)</Label>
                            <Input
                                id="daily-target"
                                type="number"
                                className="glass-input text-white"
                                value={localSettings.risk.dailyTarget}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    risk: { ...localSettings.risk, dailyTarget: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Trading Preferences */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-white">Trading Preferences</CardTitle>
                        <CardDescription className="text-zinc-400">Set defaults to speed up your logging.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="default-pair" className="text-zinc-300">Default Pair</Label>
                            <Input
                                id="default-pair"
                                className="glass-input text-white"
                                placeholder="e.g. NIFTY 50"
                                value={localSettings.preferences.defaultPair}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    preferences: { ...localSettings.preferences, defaultPair: e.target.value }
                                })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="default-lots" className="text-zinc-300">Default Lot Size</Label>
                            <Input
                                id="default-lots"
                                type="number"
                                className="glass-input text-white"
                                value={localSettings.preferences.defaultLots}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    preferences: { ...localSettings.preferences, defaultLots: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details */}
                <Card className="glass-card border-0">
                    <CardHeader>
                        <CardTitle className="text-white">Account Details</CardTitle>
                        <CardDescription className="text-zinc-400">Update your capital for accurate ROI stats.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="initial-capital" className="text-zinc-300">Initial Capital (₹)</Label>
                            <Input
                                id="initial-capital"
                                type="number"
                                className="glass-input text-white"
                                value={localSettings.account.initialCapital}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    account: { ...localSettings.account, initialCapital: Number(e.target.value) }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="glass-card border-0 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Data Management</CardTitle>
                        <CardDescription className="text-zinc-400">Export your data or reset your journal.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4">
                        <Button variant="outline" onClick={handleExportCSV} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                            <Download className="mr-2 h-4 w-4" />
                            Export to CSV
                        </Button>
                        <Button variant="outline" onClick={handleExportPDF} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                            <FileText className="mr-2 h-4 w-4" />
                            Export to PDF
                        </Button>
                        <Button variant="destructive" onClick={handleReset} className="bg-red-900/50 text-red-200 hover:bg-red-900 hover:text-white border border-red-900">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Reset Journal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
