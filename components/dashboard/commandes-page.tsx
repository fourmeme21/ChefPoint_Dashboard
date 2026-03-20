"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Printer, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type OrderStatus = "nouveau" | "en_preparation" | "pret" | "en_route"

interface Order {
  id: string
  orderNumber: string
  brand: string
  brandEmoji: string
  timeReceived: string
  customerName: string
  customerLocation: string
  items: string
  total: number
  status: OrderStatus
  timer?: number
}

const initialOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#01045",
    brand: "Chicken Bowl",
    brandEmoji: "🥗",
    timeReceived: "Il y a 3 min",
    customerName: "Mohammed A.",
    customerLocation: "Bab el Had",
    items: "1x Classic Bowl · 1x Spicy Bowl",
    total: 135,
    status: "nouveau"
  },
  {
    id: "2",
    orderNumber: "#01044",
    brand: "Chicken Bowl",
    brandEmoji: "🥗",
    timeReceived: "Il y a 8 min",
    customerName: "Sara B.",
    customerLocation: "Agdal",
    items: "2x Veggie Bowl · 1x Boisson",
    total: 165,
    status: "en_preparation",
    timer: 12
  },
  {
    id: "3",
    orderNumber: "#01043",
    brand: "Chicken Bowl",
    brandEmoji: "🥗",
    timeReceived: "Il y a 15 min",
    customerName: "Youssef K.",
    customerLocation: "Hassan",
    items: "1x Classic Bowl",
    total: 65,
    status: "pret"
  },
  {
    id: "4",
    orderNumber: "#01042",
    brand: "Chicken Bowl",
    brandEmoji: "🥗",
    timeReceived: "Il y a 22 min",
    customerName: "Fatima Z.",
    customerLocation: "Souissi",
    items: "3x Spicy Bowl · 2x Boisson",
    total: 225,
    status: "en_preparation",
    timer: 5
  }
]

export function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = {
    enAttente: orders.filter(o => o.status === "nouveau").length,
    enPreparation: orders.filter(o => o.status === "en_preparation").length,
    enRoute: orders.filter(o => o.status === "en_route").length,
    livrees: 12
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, timer: newStatus === "en_preparation" ? 15 : undefined }
        : order
    ))
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "nouveau":
        return <span className="px-3 py-1 bg-[#E84A5F] text-white text-xs font-bold uppercase rounded-full">Nouveau</span>
      case "en_preparation":
        return <span className="px-3 py-1 bg-[#E8935A] text-white text-xs font-bold uppercase rounded-full">En préparation</span>
      case "pret":
        return <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-bold uppercase rounded-full">Prêt</span>
      case "en_route":
        return <span className="px-3 py-1 bg-[#4CAF50] text-white text-xs font-bold uppercase rounded-full">En route</span>
    }
  }

  const getActionButton = (order: Order) => {
    switch (order.status) {
      case "nouveau":
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, "en_preparation")}
            className="flex-1 py-2.5 bg-[#C9A84C] text-[#0E0C08] font-bold uppercase text-sm rounded-lg hover:bg-[#B8973B] transition-colors"
          >
            Accepter
          </button>
        )
      case "en_preparation":
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, "pret")}
            className="flex-1 py-2.5 bg-[#E8935A] text-white font-bold uppercase text-sm rounded-lg hover:bg-[#D7824A] transition-colors flex items-center justify-center gap-2"
          >
            Prêt
            {order.timer && (
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{order.timer}:00</span>
            )}
          </button>
        )
      case "pret":
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, "en_route")}
            className="flex-1 py-2.5 bg-[#3B82F6] text-white font-bold uppercase text-sm rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            En route
          </button>
        )
      case "en_route":
        return (
          <button 
            className="flex-1 py-2.5 bg-[#4CAF50] text-white font-bold uppercase text-sm rounded-lg cursor-default"
          >
            Livré
          </button>
        )
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-3xl text-[#C9A84C]">Commandes en Direct</h1>
            <div className="flex items-center gap-2 bg-[#4CAF50]/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
              <span className="text-[#4CAF50] text-sm font-medium uppercase">En Direct</span>
            </div>
          </div>
          <p className="text-[#A89968] text-lg">
            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4">
            <p className="text-[#A89968] text-sm uppercase tracking-wide">En attente</p>
            <p className="text-[#C9A84C] text-4xl font-bold mt-1">{stats.enAttente}</p>
          </div>
          <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4">
            <p className="text-[#A89968] text-sm uppercase tracking-wide">En préparation</p>
            <p className="text-[#E8935A] text-4xl font-bold mt-1">{stats.enPreparation}</p>
          </div>
          <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4">
            <p className="text-[#A89968] text-sm uppercase tracking-wide">En route</p>
            <p className="text-[#3B82F6] text-4xl font-bold mt-1">{stats.enRoute}</p>
          </div>
          <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4">
            <p className="text-[#A89968] text-sm uppercase tracking-wide">{"Livrées aujourd'hui"}</p>
            <p className="text-[#4CAF50] text-4xl font-bold mt-1">{stats.livrees}</p>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 space-y-4"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#C9A84C] font-bold">{order.orderNumber}</span>
                  <span className="text-xl">{order.brandEmoji}</span>
                </div>
                <span className="text-[#A89968] text-sm">{order.timeReceived}</span>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-[#F5EDD8] font-medium">{order.customerName}</p>
                <p className="text-[#A89968] text-sm flex items-center gap-1">
                  <span>📍</span> {order.customerLocation}
                </p>
              </div>

              {/* Items */}
              <p className="text-[#F5EDD8] text-sm">{order.items}</p>

              {/* Total & Status */}
              <div className="flex items-center justify-between">
                <span className="text-[#C9A84C] text-xl font-bold">{order.total} DH</span>
                {getStatusBadge(order.status)}
              </div>

              {/* Action Button & Icons */}
              <div className="flex items-center gap-2">
                {getActionButton(order)}
                <button className="p-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1DA851] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="p-2.5 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] text-[#A89968] rounded-lg hover:text-[#C9A84C] transition-colors">
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - New Order Alert */}
      <div className="w-[300px] bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 h-fit sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#F5EDD8] font-medium">Nouvelle commande</h3>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              soundEnabled 
                ? "bg-[#C9A84C] text-[#0E0C08]" 
                : "bg-[rgba(201,168,76,0.15)] text-[#A89968]"
            )}
          >
            {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
        </div>
        <div className="border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-8 text-center">
          <p className="text-[#A89968] text-sm">{"Les nouvelles commandes apparaîtront ici"}</p>
        </div>
      </div>
    </div>
  )
}
