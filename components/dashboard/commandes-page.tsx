"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Printer, MessageCircle, Plus, X, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type OrderStatus = "nouveau" | "en_preparation" | "pret" | "en_route"
type Order = Database['public']['Tables']['orders']['Row']
type Product = Database['public']['Tables']['products']['Row']
type Brand = Database['public']['Tables']['brands']['Row']

interface OrderItem { product: Product; quantity: number }

export function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [livrees, setLivrees] = useState(0)

  // Manuel sipariş
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    payment_method: "cash",
    notes: ""
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchOrders()
    fetchLivrees()
    const channel = subscribeToOrders()
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (selectedBrand) fetchProducts(selectedBrand.id)
  }, [selectedBrand])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['nouveau', 'en_preparation', 'pret', 'en_route'])
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  const fetchLivrees = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'livre')
      .gte('created_at', today.toISOString())
    setLivrees(count || 0)
  }

  const fetchProducts = async (brandId: string) => {
    const { data } = await supabase.from('products').select('*').eq('brand_id', brandId).eq('available', true).order('category')
    if (data) setProducts(data)
  }

  const subscribeToOrders = () => {
    return supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(prev => [payload.new as Order, ...prev])
          if (soundEnabled) playSound()
        }
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Order
          if (updated.status === 'livre') {
            setOrders(prev => prev.filter(o => o.id !== updated.id))
            setLivrees(prev => prev + 1)
          } else {
            setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, ...updated } : o))
          }
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
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId)
    await supabase.from('order_status_log').insert({ order_id: orderId, order_status: newStatus })
  }

  const openModal = async () => {
    const { data } = await supabase.from('brands').select('*').order('created_at')
    if (data && data.length > 0) {
      setBrands(data)
      setSelectedBrand(data[0])
    }
    setOrderItems([])
    setForm({ customer_name: "", customer_phone: "", delivery_address: "", payment_method: "cash", notes: "" })
    setShowModal(true)
  }

  const addItem = (product: Product) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.product.id === productId)
      if (existing && existing.quantity > 1) return prev.map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
      return prev.filter(i => i.product.id !== productId)
    })
  }

  const totalAmount = orderItems.reduce((sum, i) => sum + parseFloat(String(i.product.price)) * i.quantity, 0)

  const saveOrder = async () => {
    if (!form.customer_name || !form.customer_phone || !selectedBrand || orderItems.length === 0) return
    setSaving(true)

    const itemsSummary = orderItems.map(i => `${i.quantity}x ${i.product.name}`).join(' · ')

    const { data: order } = await supabase.from('orders').insert({
      brand_id: selectedBrand.id,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      delivery_address: form.delivery_address || 'À définir',
      items_summary: itemsSummary,
      total_amount: totalAmount,
      status: 'nouveau',
      payment_method: form.payment_method as any,
      platform: 'whatsapp',
      notes: form.notes || null,
      order_number: ''
    }).select().single()

    if (order) {
      // Order items kaydet
      await supabase.from('order_items').insert(
        orderItems.map(i => ({
          order_id: order.id,
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          unit_price: parseFloat(String(i.product.price)),
          subtotal: parseFloat(String(i.product.price)) * i.quantity
        }))
      )
    }

    setSaving(false)
    setShowModal(false)
  }

  const stats = {
    enAttente: orders.filter(o => o.status === "nouveau").length,
    enPreparation: orders.filter(o => o.status === "en_preparation").length,
    enRoute: orders.filter(o => o.status === "en_route").length,
    livrees
  }

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (diff < 1) return "À l'instant"
    if (diff < 60) return `Il y a ${diff} min`
    return `Il y a ${Math.floor(diff / 60)}h`
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      nouveau: { label: "Nouveau", color: "#E84A5F" },
      en_preparation: { label: "En préparation", color: "#E8935A" },
      pret: { label: "Prêt", color: "#3B82F6" },
      en_route: { label: "En route", color: "#4CAF50" },
    }
    const s = map[status]
    if (!s) return null
    return <span className="px-3 py-1 text-white text-xs font-bold uppercase rounded-full" style={{ backgroundColor: s.color }}>{s.label}</span>
  }

  const getActionButton = (order: Order) => {
    switch (order.status) {
      case "nouveau":
        return <button onClick={() => updateOrderStatus(order.id, "en_preparation")} className="flex-1 py-2.5 bg-[#C9A84C] text-[#0E0C08] font-bold uppercase text-sm rounded-lg hover:bg-[#B8973B] transition-colors">Accepter</button>
      case "en_preparation":
        return <button onClick={() => updateOrderStatus(order.id, "pret")} className="flex-1 py-2.5 bg-[#E8935A] text-white font-bold uppercase text-sm rounded-lg hover:bg-[#D7824A] transition-colors">Prêt</button>
      case "pret":
        return <button onClick={() => updateOrderStatus(order.id, "en_route")} className="flex-1 py-2.5 bg-[#3B82F6] text-white font-bold uppercase text-sm rounded-lg hover:bg-[#2563EB] transition-colors">En route</button>
      case "en_route":
        return <button onClick={() => updateOrderStatus(order.id, "livre" as any)} className="flex-1 py-2.5 bg-[#4CAF50] text-white font-bold uppercase text-sm rounded-lg hover:bg-[#3D9140] transition-colors">Livré ✓</button>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>
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
              <div key={order.id} className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9A84C] font-bold">{order.order_number}</span>
                    {order.platform === 'whatsapp' && <span className="text-xs bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-full">WhatsApp</span>}
                  </div>
                  <span className="text-[#A89968] text-sm">{formatTime(order.created_at)}</span>
                </div>
                <div>
                  <p className="text-[#F5EDD8] font-medium">{order.customer_name}</p>
                  <p className="text-[#A89968] text-sm flex items-center gap-1">
                    <span>📍</span> {order.delivery_address}
                  </p>
                </div>
                <p className="text-[#F5EDD8] text-sm">{order.items_summary}</p>
                {order.notes && <p className="text-[#A89968] text-xs italic">📝 {order.notes}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A84C] text-xl font-bold">{order.total_amount} DH</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-2">
                  {getActionButton(order)}
                  <a href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#1DA851] transition-colors">
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
      <div className="hidden md:flex w-[280px] flex-col gap-4">
        {/* Sound toggle */}
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#F5EDD8] font-medium">Notifications</h3>
            <button onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn("p-2 rounded-lg transition-colors", soundEnabled ? "bg-[#C9A84C] text-[#0E0C08]" : "bg-[rgba(201,168,76,0.15)] text-[#A89968]")}>
              {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>
          </div>
          <div className="border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-4 text-center">
            <p className="text-[#A89968] text-xs">Les nouvelles commandes apparaîtront automatiquement</p>
          </div>
          <p className="text-[#A89968] text-xs text-center mt-3">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} active{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Manuel sipariş butonu */}
        <button onClick={openModal}
          className="w-full py-4 bg-[#C9A84C] text-[#0E0C08] font-bold rounded-xl hover:bg-[#B8973B] transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Saisir une commande
        </button>
      </div>

      {/* Mobile: Manuel sipariş floating button */}
      <button onClick={openModal}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-[#C9A84C] text-[#0E0C08] rounded-full shadow-lg flex items-center justify-center z-30">
        <Plus className="w-6 h-6" />
      </button>

      {/* Manuel Sipariş Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center">
          <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1A160E] flex items-center justify-between p-5 border-b border-[rgba(201,168,76,0.1)]">
              <h2 className="font-serif text-xl text-[#C9A84C]">Nouvelle commande</h2>
              <button onClick={() => setShowModal(false)} className="text-[#A89968] hover:text-[#F5EDD8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Marka seçimi */}
              {brands.length > 1 && (
                <div>
                  <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Marque</label>
                  <div className="flex gap-2 flex-wrap">
                    {brands.filter(b => b.status === 'active').map(b => (
                      <button key={b.id} onClick={() => setSelectedBrand(b)}
                        className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                          selectedBrand?.id === b.id ? "bg-[#C9A84C] text-[#0E0C08]" : "bg-[#0E0C08] text-[#A89968]")}>
                        <span>{b.emoji}</span> {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ürünler */}
              <div>
                <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Produits</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {products.map(p => {
                    const item = orderItems.find(i => i.product.id === p.id)
                    return (
                      <div key={p.id} className="flex items-center justify-between bg-[#0E0C08] rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span>{p.emoji}</span>
                          <span className="text-[#F5EDD8] text-sm">{p.name}</span>
                          <span className="text-[#A89968] text-xs">{p.price} DH</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item && (
                            <>
                              <button onClick={() => removeItem(p.id)}
                                className="w-6 h-6 rounded-full bg-[rgba(201,168,76,0.2)] text-[#C9A84C] flex items-center justify-center text-sm font-bold">−</button>
                              <span className="text-[#F5EDD8] text-sm w-4 text-center">{item.quantity}</span>
                            </>
                          )}
                          <button onClick={() => addItem(p)}
                            className="w-6 h-6 rounded-full bg-[#C9A84C] text-[#0E0C08] flex items-center justify-center text-sm font-bold">+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {orderItems.length > 0 && (
                  <div className="mt-2 p-3 bg-[rgba(201,168,76,0.1)] rounded-lg">
                    <p className="text-[#A89968] text-xs">{orderItems.map(i => `${i.quantity}x ${i.product.name}`).join(' · ')}</p>
                    <p className="text-[#C9A84C] font-bold mt-1">Total: {totalAmount} DH</p>
                  </div>
                )}
              </div>

              {/* Müşteri bilgileri */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Nom *</label>
                  <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                    placeholder="Mohammed A."
                    className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-3 py-2.5 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C] text-sm" />
                </div>
                <div>
                  <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Téléphone *</label>
                  <input value={form.customer_phone} onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                    placeholder="+212 6..."
                    className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-3 py-2.5 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C] text-sm" />
                </div>
              </div>

              <div>
                <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Adresse</label>
                <input value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
                  placeholder="Bab el Had, Rue..."
                  className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-3 py-2.5 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C] text-sm" />
              </div>

              {/* Ödeme yöntemi */}
              <div>
                <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Paiement</label>
                <div className="flex gap-2">
                  {[
                    { id: "cash", label: "💵 Espèces" },
                    { id: "card", label: "💳 Carte" },
                    { id: "cmi", label: "📱 CMI" },
                  ].map(p => (
                    <button key={p.id} onClick={() => setForm(f => ({ ...f, payment_method: p.id }))}
                      className={cn("flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                        form.payment_method === p.id ? "bg-[#C9A84C] text-[#0E0C08]" : "bg-[#0E0C08] text-[#A89968]")}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Not */}
              <div>
                <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Note (optionnel)</label>
                <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Sans piment, étage 3..."
                  className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-3 py-2.5 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C] text-sm" />
              </div>

              {/* Kaydet */}
              <button onClick={saveOrder}
                disabled={saving || !form.customer_name || !form.customer_phone || orderItems.length === 0}
                className="w-full py-3 bg-[#C9A84C] text-[#0E0C08] font-bold rounded-xl hover:bg-[#B8973B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {saving ? "Enregistrement..." : `Confirmer — ${totalAmount} DH`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
