"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"

const hourlyData = [
  { hour: "10h", revenue: 120 },
  { hour: "11h", revenue: 85 },
  { hour: "12h", revenue: 210 },
  { hour: "13h", revenue: 340 },
  { hour: "14h", revenue: 180 },
  { hour: "15h", revenue: 90 },
  { hour: "16h", revenue: 65 },
  { hour: "17h", revenue: 120 },
  { hour: "18h", revenue: 250 },
  { hour: "19h", revenue: 380 },
  { hour: "20h", revenue: 290 },
  { hour: "21h", revenue: 150 },
  { hour: "22h", revenue: 60 }
]

const productSales = [
  { name: "Classic Bowl", emoji: "🥗", sales: 8, percentage: 80 },
  { name: "Boisson", emoji: "🥤", sales: 6, percentage: 60 },
  { name: "Spicy Bowl", emoji: "🌶️", sales: 5, percentage: 50 },
  { name: "Veggie Bowl", emoji: "🥬", sales: 3, percentage: 30 }
]

const paymentMethods = [
  { name: "Espèces", percentage: 45, color: "#C9A84C" },
  { name: "Carte", percentage: 35, color: "#A89968" },
  { name: "CMI", percentage: 20, color: "#6B5B3D" }
]

type DateFilter = "aujourdhui" | "7jours" | "30jours"

export function StatistiquesPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("aujourdhui")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#C9A84C]">Statistiques</h1>
        <div className="flex items-center gap-2 bg-[#1A160E] p-1 rounded-lg">
          {[
            { id: "aujourdhui" as const, label: "Aujourd'hui" },
            { id: "7jours" as const, label: "7 jours" },
            { id: "30jours" as const, label: "30 jours" }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setDateFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                dateFilter === filter.id
                  ? "bg-[#C9A84C] text-[#0E0C08]"
                  : "text-[#A89968] hover:text-[#F5EDD8]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
          <p className="text-[#A89968] text-sm uppercase tracking-wide mb-2">Chiffre d&apos;affaires</p>
          <p className="text-[#C9A84C] text-5xl font-bold">1.240 DH</p>
          <p className="text-[#4CAF50] text-sm mt-2 flex items-center gap-1">
            <span>↑</span> +12% vs hier
          </p>
        </div>
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
          <p className="text-[#A89968] text-sm uppercase tracking-wide mb-2">Total commandes</p>
          <p className="text-[#C9A84C] text-5xl font-bold">18</p>
          <p className="text-[#A89968] text-sm mt-2">moy. 69 DH/cmd</p>
        </div>
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
          <p className="text-[#A89968] text-sm uppercase tracking-wide mb-2">Best seller</p>
          <p className="text-[#C9A84C] text-4xl font-bold flex items-center gap-3">
            <span>Classic Bowl</span>
            <span className="text-4xl">🥗</span>
          </p>
          <p className="text-[#A89968] text-sm mt-2">8 vendus</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
        <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">{"Chiffre d'affaires par heure"}</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#A89968', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#A89968', fontSize: 12 }}
                tickFormatter={(value) => `${value} DH`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(201,168,76,0.1)' }}
                contentStyle={{ 
                  backgroundColor: '#1A160E', 
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '8px',
                  color: '#F5EDD8'
                }}
                formatter={(value: number) => [`${value} DH`, 'Revenus']}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.revenue > 300 ? '#C9A84C' : 'rgba(201,168,76,0.5)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales by Product */}
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
          <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">Ventes par produit</h3>
          <div className="space-y-4">
            {productSales.map((product) => (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{product.emoji}</span>
                    <span className="text-[#F5EDD8]">{product.name}</span>
                  </div>
                  <span className="text-[#A89968] text-sm">{product.sales} ventes</span>
                </div>
                <div className="h-2 bg-[#0E0C08] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
                    style={{ width: `${product.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-6">
          <h3 className="text-[#F5EDD8] text-sm uppercase tracking-wide mb-6">Modes de paiement</h3>
          
          {/* Visual Donut Representation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {paymentMethods.reduce((acc, method, index) => {
                  const previousTotal = paymentMethods.slice(0, index).reduce((sum, m) => sum + m.percentage, 0)
                  const circumference = 2 * Math.PI * 35
                  const strokeDasharray = (method.percentage / 100) * circumference
                  const strokeDashoffset = -(previousTotal / 100) * circumference
                  
                  acc.push(
                    <circle
                      key={method.name}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke={method.color}
                      strokeWidth="20"
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                    />
                  )
                  return acc
                }, [] as React.ReactNode[])}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#C9A84C] text-2xl font-bold">100%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods.map((method) => (
              <div 
                key={method.name}
                className="flex items-center gap-2 bg-[#0E0C08] px-4 py-2 rounded-full"
              >
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: method.color }}
                />
                <span className="text-[#F5EDD8] text-sm">{method.name}</span>
                <span className="text-[#C9A84C] text-sm font-bold">{method.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
