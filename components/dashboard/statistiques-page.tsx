"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight } from "lucide-react"

type QuickFilter = "aujourdhui" | "semaine" | "mois" | "mois_dernier" | "annee"

interface ChartData { label: string; revenue: number }
interface ProductSale { name: string; emoji: string; sales: number; percentage: number }
interface PayMethod { name: string; percentage: number; color: string }
interface Stats {
  revenue: number; orders: number; avgOrder: number
  bestSeller: string; bestSellerEmoji: string; bestSellerCount: number
  revenueChange: number | null
}

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const MONTHS_SHORT = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"]
const DAYS_SHORT = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]
const PAY_COLORS: Record<string,string> = { cash:"#C9A84C", card:"#A89968", cmi:"#6B5B3D", marocpay:"#4ECDC4" }
const PAY_LABELS: Record<string,string> = { cash:"Espèces", card:"Carte", cmi:"CMI", marocpay:"MarocPay" }

function getRange(filter: QuickFilter, year: number, month: number) {
  const now = new Date()
  if (filter === "aujourdhui") {
    const s = new Date(now); s.setHours(0,0,0,0)
    const ps = new Date(s); ps.setDate(ps.getDate()-1)
    const pe = new Date(s); pe.setMilliseconds(-1)
    return { start: s, end: now, prevStart: ps, prevEnd: pe }
  }
  if (filter === "semaine") {
    const s = new Date(now)
    const d = s.getDay() === 0 ? 6 : s.getDay()-1
    s.setDate(s.getDate()-d); s.setHours(0,0,0,0)
    const ps = new Date(s); ps.setDate(ps.getDate()-7)
    const pe = new Date(s); pe.setMilliseconds(-1)
    return { start: s, end: now, prevStart: ps, prevEnd: pe }
  }
  if (filter === "mois") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1)
    const ps = new Date(now.getFullYear(), now.getMonth()-1, 1)
    const pe = new Date(s); pe.setMilliseconds(-1)
    return { start: s, end: now, prevStart: ps, prevEnd: pe }
  }
  if (filter === "mois_dernier") {
    const s = new Date(now.getFullYear(), now.getMonth()-1, 1)
    const e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const ps = new Date(now.getFullYear(), now.getMonth()-2, 1)
    const pe = new Date(s); pe.setMilliseconds(-1)
    return { start: s, end: e, prevStart: ps, prevEnd: pe }
  }
  // annee
  if (month === -1) {
    const s = new Date(year, 0, 1)
    const e = new Date(year, 11, 31, 23, 59, 59)
    const ps = new Date(year-1, 0, 1)
    const pe = new Date(year-1, 11, 31, 23, 59, 59)
    return { start: s, end: e, prevStart: ps, prevEnd: pe }
  } else {
    const s = new Date(year, month, 1)
    const e = new Date(year, month+1, 0, 23, 59, 59)
    const ps = new Date(year, month-1, 1)
    const pe = new Date(year, month, 0, 23, 59, 59)
    return { start: s, end: e, prevStart: ps, prevEnd: pe }
  }
}

export function StatistiquesPage() {
  const now = new Date()
  const currentYear = now.getFullYear()

  const [filter, setFilter] = useState<QuickFilter>("aujourdhui")
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(-1)
  const [stats, setStats] = useState<Stats>({ revenue:0, orders:0, avgOrder:0, bestSeller:"-", bestSellerEmoji:"🥗", bestSellerCount:0, revenueChange:null })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [productSales, setProductSales] = useState<ProductSale[]>([])
  const [payMethods, setPayMethods] = useState<PayMethod[]>([])
  const [loading, setLoading] = useState(true)

  const startYear = 2026
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)

  useEffect(() => { fetchStats() }, [filter, selectedYear, selectedMonth])

  const fetchStats = async () => {
    setLoading(true)
    const { start, end, prevStart, prevEnd } = getRange(filter, selectedYear, selectedMonth)

    const [{ data: orders }, { data: prevOrders }, { data: items }] = await Promise.all([
      supabase.from("orders").select("total_amount, created_at, payment_method").gte("created_at", start.toISOString()).lte("created_at", end.toISOString()),
      supabase.from("orders").select("total_amount").gte("created_at", prevStart.toISOString()).lte("created_at", prevEnd.toISOString()),
      supabase.from("order_items").select("product_name, quantity, created_at").gte("created_at", start.toISOString()).lte("created_at", end.toISOString()),
    ])

    if (orders) {
      const revenue = orders.reduce((s, o) => s + Number(o.total_amount), 0)
      const orderCount = orders.length
      const avgOrder = orderCount > 0 ? Math.round(revenue / orderCount) : 0
      const prevRevenue = prevOrders?.reduce((s, o) => s + Number(o.total_amount), 0) || 0
      const revenueChange = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : null

      // Chart
      if (filter === "aujourdhui") {
        const m: Record<number, number> = {}
        orders.forEach(o => { const h = new Date(o.created_at).getHours(); m[h] = (m[h]||0) + Number(o.total_amount) })
        setChartData(Array.from({length:13}, (_,i) => i+10).map(h => ({ label:`${h}h`, revenue: m[h]||0 })))
      } else if (filter === "semaine") {
        const m: Record<number, number> = {}
        orders.forEach(o => { const d = new Date(o.created_at).getDay(); const idx = d===0?6:d-1; m[idx]=(m[idx]||0)+Number(o.total_amount) })
        setChartData(DAYS_SHORT.map((label,i) => ({ label, revenue: m[i]||0 })))
      } else if (filter === "mois" || filter === "mois_dernier") {
        const m: Record<number, number> = {}
        orders.forEach(o => { const d = new Date(o.created_at).getDate(); m[d]=(m[d]||0)+Number(o.total_amount) })
        const daysInMonth = new Date(start.getFullYear(), start.getMonth()+1, 0).getDate()
        setChartData(Array.from({length:daysInMonth}, (_,i) => ({ label:`${i+1}`, revenue: m[i+1]||0 })))
      } else if (filter === "annee") {
        if (selectedMonth === -1) {
          // Tüm yıl - aylık
          const m: Record<number, number> = {}
          orders.forEach(o => { const mo = new Date(o.created_at).getMonth(); m[mo]=(m[mo]||0)+Number(o.total_amount) })
          setChartData(MONTHS_SHORT.map((label,i) => ({ label, revenue: m[i]||0 })))
        } else {
          // Belirli ay - günlük
          const m: Record<number, number> = {}
          orders.forEach(o => { const d = new Date(o.created_at).getDate(); m[d]=(m[d]||0)+Number(o.total_amount) })
          const daysInMonth = new Date(selectedYear, selectedMonth+1, 0).getDate()
          setChartData(Array.from({length:daysInMonth}, (_,i) => ({ label:`${i+1}`, revenue: m[i+1]||0 })))
        }
      }

      // Ödeme
      const pm: Record<string, number> = {}
      orders.forEach(o => { pm[o.payment_method]=(pm[o.payment_method]||0)+1 })
      const total = orders.length || 1
      setPayMethods(Object.entries(pm).map(([k,v]) => ({ name: PAY_LABELS[k]||k, percentage: Math.round((v/total)*100), color: PAY_COLORS[k]||"#A89968" })))

      setStats({ revenue, orders: orderCount, avgOrder, bestSeller:"-", bestSellerEmoji:"🥗", bestSellerCount:0, revenueChange })
    }

    // Ürünler
    if (items && items.length > 0) {
      const pm: Record<string, number> = {}
      items.forEach(i => { pm[i.product_name]=(pm[i.product_name]||0)+i.quantity })
      const sorted = Object.entries(pm).sort((a,b) => b[1]-a[1])
      const max = sorted[0]?.[1] || 1
      setProductSales(sorted.slice(0,5).map(([name,count]) => ({ name, emoji:"🥗", sales:count, percentage:Math.round((count/max)*100) })))
      if (sorted[0]) setStats(p => ({ ...p, bestSeller: sorted[0][0], bestSellerCount: sorted[0][1] }))
    } else {
      setProductSales([])
    }

    setLoading(false)
  }

  const chartTitle = () => {
    if (filter === "aujourdhui") return "Revenus par heure"
    if (filter === "semaine") return "Revenus par jour"
    if (filter === "mois" || filter === "mois_dernier") return "Revenus par jour"
    if (filter === "annee" && selectedMonth === -1) return `Revenus par mois — ${selectedYear}`
    if (filter === "annee") return `${MONTHS_FR[selectedMonth]} ${selectedYear} — par jour`
    return ""
  }

  const periodLabel = () => {
    if (filter !== "annee") return ""
    if (selectedMonth === -1) return selectedYear.toString()
    return `${MONTHS_FR[selectedMonth]} ${selectedYear}`
  }

  return (
    <div className="space-y-6">
      {/* Header + Filtreler */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#C9A84C]">Statistiques</h1>
        <div className="flex flex-wrap gap-1 bg-[#1A160E] p-1 rounded-lg">
          {([
            { id: "aujourdhui" as const, label: "Aujourd'hui" },
            { id: "semaine" as const, label: "Semaine" },
            { id: "mois" as const, label: "Ce mois" },
            { id: "mois_dernier" as const, label: "Mois préc." },
            { id: "annee" as const, label: "Année" },
          ]).map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                filter === f.id ? "bg-[#C9A84C] text-[#0E0C08]" : "text-[#A89968] hover:text-[#F5EDD8]")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Yıl & Ay seçici */}
      {filter === "annee" && (
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 space-y-3">
          {/* Yıl seçici */}
          <div className="flex items-center gap-3">
            <span className="text-[#A89968] text-xs uppercase tracking-wide">Année</span>
            <div className="flex items-center gap-2">
              <button onClick={() => { setSelectedYear(y => Math.max(startYear, y-1)); setSelectedMonth(-1) }}
                disabled={selectedYear <= startYear}
                className="p-1.5 rounded-lg bg-[#0E0C08] text-[#A89968] hover:text-[#C9A84C] transition-colors disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[#C9A84C] font-bold text-xl w-14 text-center">{selectedYear}</span>
              <button onClick={() => { setSelectedYear(y => Math.min(currentYear, y+1)); setSelectedMonth(-1) }}
                disabled={selectedYear >= currentYear}
                className="p-1.5 rounded-lg bg-[#0E0C08] text-[#A89968] hover:text-[#C9A84C] transition-colors disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ay seçici - 12 ay + Tous */}
          <div>
            <span className="text-[#A89968] text-xs uppercase tracking-wide block mb-2">Mois</span>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setSelectedMonth(-1)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  selectedMonth === -1 ? "bg-[#C9A84C] text-[#0E0C08]" : "bg-[#0E0C08] text-[#A89968] hover:text-[#F5EDD8]")}>
                Tous
              </button>
              {MONTHS_SHORT.map((m, i) => {
                const isDisabled = selectedYear === currentYear && i > now.getMonth()
                return (
                  <button key={i} onClick={() => !isDisabled && setSelectedMonth(i)}
                    disabled={isDisabled}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedMonth === i ? "bg-[#C9A84C] text-[#0E0C08]" :
                      isDisabled ? "bg-[#0E0C08] text-[#333] cursor-not-allowed" :
                      "bg-[#0E0C08] text-[#A89968] hover:text-[#F5EDD8]")}>
                    {m}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Kartlar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <p className="text-[#A89968] text-sm uppercase tracking-wide mb-1">{"Chiffre d'affaires"}</p>
              {filter === "annee" && <p className="text-[#6B5B3D] text-xs mb-2">{periodLabel()}</p>}
              <p className="text-[#C9A84C] text-4xl md:text-5xl font-bold">{stats.revenue.toLocaleString()} DH</p>
              {stats.revenueChange !== null && (
                <p className={cn("text-sm mt-2 flex items-center gap-1", stats.revenueChange >= 0 ? "text-[#4CAF50]" : "text-[#E84A5F]")}>
                  {stats.revenueChange >= 0 ? "↑" : "↓"} {Math.abs(stats.revenueChange)}% vs période précédente
                </p>
              )}
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

          {/* Chart */}
          {chartData.some(d => d.revenue > 0) && (
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">{chartTitle()}</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top:5, right:5, left:-15, bottom:0 }}>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill:"#A89968", fontSize:11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill:"#A89968", fontSize:11 }} tickFormatter={v => v > 0 ? `${v}` : ""} />
                    <Tooltip cursor={{ fill:"rgba(201,168,76,0.1)" }}
                      contentStyle={{ backgroundColor:"#1A160E", border:"1px solid rgba(201,168,76,0.3)", borderRadius:"8px", color:"#F5EDD8" }}
                      formatter={(v: number) => [`${v} DH`, "Revenus"]} />
                    <Bar dataKey="revenue" radius={[4,4,0,0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.revenue === Math.max(...chartData.map(d => d.revenue)) && entry.revenue > 0 ? "#C9A84C" : "rgba(201,168,76,0.35)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Ürün + Ödeme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">Ventes par produit</h3>
              {productSales.length === 0 ? (
                <p className="text-[#A89968] text-sm text-center py-8">Aucune donnée pour cette période</p>
              ) : (
                <div className="space-y-4">
                  {productSales.map(p => (
                    <div key={p.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{p.emoji}</span>
                          <span className="text-[#F5EDD8] text-sm">{p.name}</span>
                        </div>
                        <span className="text-[#A89968] text-sm">{p.sales} ventes</span>
                      </div>
                      <div className="h-2 bg-[#0E0C08] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A84C] rounded-full" style={{ width:`${p.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
              <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">Modes de paiement</h3>
              {payMethods.length === 0 ? (
                <p className="text-[#A89968] text-sm text-center py-8">Aucune donnée pour cette période</p>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {payMethods.reduce((acc: React.ReactNode[], m, i) => {
                          const prev = payMethods.slice(0,i).reduce((s,x) => s+x.percentage, 0)
                          const circ = 2 * Math.PI * 35
                          const dash = (m.percentage/100) * circ
                          const offset = -(prev/100) * circ
                          acc.push(<circle key={m.name} cx="50" cy="50" r="35" fill="none" stroke={m.color} strokeWidth="20"
                            strokeDasharray={`${dash} ${circ}`} strokeDashoffset={offset} />)
                          return acc
                        }, [])}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[#C9A84C] text-2xl font-bold">{stats.orders}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {payMethods.map(m => (
                      <div key={m.name} className="flex items-center gap-2 bg-[#0E0C08] px-3 py-2 rounded-full">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className="text-[#F5EDD8] text-sm">{m.name}</span>
                        <span className="text-[#C9A84C] text-sm font-bold">{m.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
