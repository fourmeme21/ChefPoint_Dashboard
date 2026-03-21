"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Printer, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type OrderStatus = "nouveau" | "en_preparation" | "pret" | "en_route"
type Order = Database['public']['Tables']['orders']['Row'] & {
  brandEmoji?: string
}

export function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  // Saat
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Siparişleri yükle
  useEffect(() => {
    fetchOrders()
    const channel = subscribeToOrders()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['nouveau', 'en_preparation', 'pret', 'en_route'])
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const subscribeToOrders = () => {
    return supabase
      .channel('orders-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new as Order, ...prev])
          if (soundEnabled) playSound()
        }
        if (payload.eventType === 'UPDATE') {
          setOrders(prev => prev.map(o =>
            o.id === payload.new.id ? { ...o, ...payload.new } : o
          ))
        }
      })
      .subscribe()
  }

  const playSound = () => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch {}
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    ))

    await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    // Log status change
    await supabase
      .from('order_status_log')
      .insert({ order_id: orderId, status: newStatus })
  }

  const stats = {
    enAttente: orders.filter(o => o.status === "nouveau").length,
    enPreparation: orders.filter(o => o.status === "en_preparation").length,
    enRoute: orders.filter(o => o.status === "en_route").length,
    livrees: 0 // bugün teslim edilenler için ayrı query gerekir
  }

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (diff < 1) return "À l'instant"
    if (diff < 60) return `Il y a ${diff} min`
    return `Il y a ${Math.floor(diff / 60)}h`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nouveau":
        return <span className="px-3 py-1 bg-[#E84A5F] text-white text-xs font-bold uppercase rounded-full">Nouveau</span>
      case "en_preparation":
        return <span className="px-3 py-1 bg-[#E8935A] text-white text-xs font-bold uppercase rounded-full">En préparation</span>
      case "pret":
        return <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-bold uppercase rounded-full">Prêt</span>
      case "en_route":
        return <span className="px-3 py-1 bg-[#4CAF50] text-white text-xs font-bold uppercase rounded-full">En route</span>
      default:
        return null
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
            className="flex-1 py-2.5 bg-[#E8935A] text-white font-bold uppercase text-sm rounded-lg hover:bg-[#D7824A] transition-colors"
          >
            Prêt
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
          <button className="flex-1 py-2.5 bg-[#4CAF50] text-white font-bold uppercase text-sm rounded-lg cursor-default">
            Livré
          </button>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "En attente", value: stats.enAttente, color: "#C9A84C" },
            { label: "En préparation", value: stats.enPreparation, color: "#E8935A" },
            { label: "En route", value: stats.enRoute, color: "#3B82F6" },
            { label: "Livrées aujourd'hui", value: stats.livrees, color: "#4CAF50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4">
              <p className="text-[#A89968] text-sm uppercase tracking-wide">{stat.label}</p>
              <p className="text-4xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#A89968]">
            <p className="text-lg">Aucune commande active</p>
            <p className="text-sm mt-1">Les nouvelles commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A84C] font-bold">{order.order_number}</span>
                  <span className="text-[#A89968] text-sm">{formatTime(order.created_at)}</span>
                </div>
                <div>
                  <p className="text-[#F5EDD8] font-medium">{order.customer_name}</p>
                  <p className="text-[#A89968] text-sm flex items-center gap-1">
                    <span>📍</span> {order.delivery_address}
                  </p>
                </div>
                <p className="text-[#F5EDD8] text-sm">{order.items_summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A84C] text-xl font-bold">{order.total_amount} DH</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-2">
                  {getActionButton(order)}
                  <a
                    href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1DA851] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                  <button className="p-2.5 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] text-[#A89968] rounded-lg hover:text-[#C9A84C] transition-colors">
                    <Printer className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-[300px] bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 h-fit sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#F5EDD8] font-medium">Nouvelle commande</h3>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              soundEnabled ? "bg-[#C9A84C] text-[#0E0C08]" : "bg-[rgba(201,168,76,0.15)] text-[#A89968]"
            )}
          >
            {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
        </div>
        <div className="border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-8 text-center">
          <p className="text-[#A89968] text-sm">Les nouvelles commandes apparaîtront ici automatiquement</p>
        </div>
        <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
          <p className="text-[#A89968] text-xs text-center">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} active{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
