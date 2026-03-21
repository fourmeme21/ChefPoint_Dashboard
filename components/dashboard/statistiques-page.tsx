"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { supabase } from "@/lib/supabase"

type DateFilter = "aujourdhui" | "7jours" | "30jours"

interface HourlyData { hour: string; revenue: number }
interface ProductSale { name: string; emoji: string; sales: number; percentage: number }
interface PaymentBreakdown { name: string; percentage: number; color: string }
interface Stats { revenue: number; orders: number; avgOrder: number; bestSeller: string; bestSellerEmoji: string; bestSellerCount: number }

export function StatistiquesPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("aujourdhui")
  const [stats, setStats] = useState<Stats>({ revenue: 0, orders: 0, avgOrder: 0, bestSeller: '-', bestSellerEmoji: '🥗', bestSellerCount: 0 })
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([])
  const [productSales, setProductSales] = useState<ProductSale[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentBreakdown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [dateFilter])

  const getDateRange = () => {
    const now = new Date()
    if (dateFilter === "aujourdhui") {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      return { start: start.toISOString(), end: now.toISOString() }
    }
    if (dateFilter === "7jours") {
      const start = new Date(now)
      start.setDate(start.getDate() - 7)
      return { start: start.toISOString(), end: now.toISOString() }
    }
    const start = new Date(now)
    start.setDate(start.getDate() - 30)
    return { start: start.toISOString(), end: now.toISOString() }
  }

  const fetchStats = async () => {
    setLoading(true)
    const { start, end } = getDateRange()

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at, status, items_summary, payment_method')
      .gte('created_at', start)
      .lte('created_at', end)
      .eq('status', 'livre')

    if (orders) {
      const revenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
      const orderCount = orders.length
      const avgOrder = orderCount > 0 ? Math.round(revenue / orderCount) : 0

      // Hourly breakdown (only for today)
      if (dateFilter === "aujourdhui") {
        const hourMap: Record<string, number> = {}
        orders.forEach(o => {
          const h = new Date(o.created_at).getHours()
          const key = `${h}h`
          hourMap[key] = (hourMap[key] || 0) + o.total_amount
        })
        const hours = Array.from({ length: 13 }, (_, i) => i + 10).map(h => ({
          hour: `${h}h`,
          revenue: hourMap[`${h}h`] || 0
        }))
        setHourlyData(hours)
      }

      // Payment methods
      const payMap: Record<string, number> = {}
      orders.forEach(o => { payMap[o.payment_method] = (payMap[o.payment_method] || 0) + 1 })
      const total = orders.length || 1
      const colors: Record<string, string> = { cash: '#C9A84C', card: '#A89968', cmi: '#6B5B3D', marocpay: '#4ECDC4' }
      const labels: Record<string, string> = { cash: 'Espèces', card: 'Carte', cmi: 'CMI', marocpay: 'MarocPay' }
      setPaymentMethods(
        Object.entries(payMap).map(([k, v]) => ({
          name: labels[k] || k,
          percentage: Math.round((v / total) * 100),
          color: colors[k] || '#A89968'
        }))
      )

      setStats({ revenue, orders: orderCount, avgOrder, bestSeller: '-', bestSellerEmoji: '🥗', bestSellerCount: 0 })
    }

    // Product sales from order_items
    const { data: items } = await supabase
      .from('order_items')
      .select('product_name, quantity')
      .gte('created_at' as any, start)
      .lte('created_at' as any, end)

    if (items && items.length > 0) {
      const productMap: Record<string, number> = {}
      items.forEach(i => { productMap[i.product_name] = (productMap[i.product_name] || 0) + i.quantity })
      const sorted = Object.entries(productMap).sort((a, b) => b[1] - a[1])
      const maxSales = sorted[0]?.[1] || 1
      const sales: ProductSale[] = sorted.slice(0, 5).map(([name, count]) => ({
        name,
        emoji: '🥗',
        sales: count,
        percentage: Math.round((count / maxSales) * 100)
      }))
      setProductSales(sales)
      if (sorted[0]) {
        setStats(prev => ({ ...prev, bestSeller: sorted[0][0], bestSellerCount: sorted[0][1] }))
      }
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#C9A84C]">Statistiques</h1>
        <div className="flex items-center gap-2 bg-[#1A160E] p-1 rounded-lg">
          {[
            { id: "aujourdhui" as const, label: "Aujourd'hui" },
            { id: "7jours" as const, label: "7 jours" },
            { id: "30jours" as const, label: "30 jours" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setDateFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                dateFilter === filter.id ? "bg-[#C9A84C] text-[#0E0C08]" : "text-[#A89968] hover:text-[#F5EDD8]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <p className="text-[#A89968] text-sm uppercase tracking-wide mb-2">{"Chiffre d'affaires"}</p>
              <p className="text-[#C9A84C] text-4xl md:text-5xl font-bold">{stats.revenue.toLocaleString()} DH</p>
            </div>
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <p className="text-[#A89968] text-sm uppercase tracking-wide mb-2">Total commandes</p>
              <p className="text-[#C9A84C] text-4xl md:text-5xl font-bold">{stats.orders}</p>
              <p className="text-[#A89968] text-sm mt-2">moy. {stats.avgOrder} DH/cmd</p>
            </div>
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <p className="text-[#A89968] text-sm uppercase tracking-wide mb-2">Best seller</p>
              <p className="text-[#C9A84C] text-2xl font-bold">{stats.bestSeller} {stats.bestSellerEmoji}</p>
              {stats.bestSellerCount > 0 && <p className="text-[#A89968] text-sm mt-2">{stats.bestSellerCount} vendus</p>}
            </div>
          </div>

          {/* Hourly Chart */}
          {dateFilter === "aujourdhui" && hourlyData.length > 0 && (
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">{"Chiffre d'affaires par heure"}</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#A89968', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A89968', fontSize: 12 }} tickFormatter={(v) => `${v} DH`} />
                    <Tooltip
                      cursor={{ fill: 'rgba(201,168,76,0.1)' }}
                      contentStyle={{ backgroundColor: '#1A160E', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', color: '#F5EDD8' }}
                      formatter={(value: number) => [`${value} DH`, 'Revenus']}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {hourlyData.map((entry, index) => (
                        <Cell key={index} fill={entry.revenue > 200 ? '#C9A84C' : 'rgba(201,168,76,0.5)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Product Sales + Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">Ventes par produit</h3>
              {productSales.length === 0 ? (
                <p className="text-[#A89968] text-sm text-center py-8">Aucune donnée</p>
              ) : (
                <div className="space-y-4">
                  {productSales.map((p) => (
                    <div key={p.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p.emoji}</span>
                          <span className="text-[#F5EDD8]">{p.name}</span>
                        </div>
                        <span className="text-[#A89968] text-sm">{p.sales} ventes</span>
                      </div>
                      <div className="h-2 bg-[#0E0C08] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A84C] rounded-full transition-all duration-500" style={{ width: `${p.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">Modes de paiement</h3>
              {paymentMethods.length === 0 ? (
                <p className="text-[#A89968] text-sm text-center py-8">Aucune donnée</p>
              ) : (
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {paymentMethods.map((m) => (
                    <div key={m.name} className="flex items-center gap-2 bg-[#0E0C08] px-4 py-2 rounded-full">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                      <span className="text-[#F5EDD8] text-sm">{m.name}</span>
                      <span className="text-[#C9A84C] text-sm font-bold">{m.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
