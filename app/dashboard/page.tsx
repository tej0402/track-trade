import { StatsGrid } from "@/components/dashboard/StatsGrid"
import { EquityChart } from "@/components/dashboard/EquityChart"
import { RecentTrades } from "@/components/dashboard/RecentTrades"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <StatsGrid />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <EquityChart />
                <RecentTrades />
            </div>
        </div>
    )
}
