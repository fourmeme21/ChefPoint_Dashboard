"use client"

import { useState, useEffect } from "react"
import { Search, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Customer = Database['public']['Tables']['customers']['Row']

const PAGE_SIZE = 10

export function ClientsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [currentPage, searchQuery])

  const fetchCustomers = async () => {
    setLoading(true)
    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order('total_orders', { ascending: false })
      .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)

    if (searchQuery) {
      query = query.or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
    }

    const { data, count } = await query

    if (data) setCustomers(data)
    if (count !== null) setTotalCount(count)
    setLoading(false)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const activeThisMonth = customers.filter(c => {
    if (!c.last_order_at) return false
    const lastOrder = new Date(c.last_order_at)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    return lastOrder > oneMonthAgo
  }).length

  const loyalCount = customers.filter(c => c.total_orders >= 3).length

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatLastOrder = (date: string | null) => {
    if (!date) return 'Jamais'
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return "Aujourd'hui"
    if (diff === 1) return 'Hier'
    if (diff < 7) return `Il y a ${diff} jours`
    if (diff < 30) return `Il y a ${Math.floor(diff / 7)} sem.`
    return `Il y a ${Math.floor(diff / 30)} mois`
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-[#C9A84C]">Base Clients</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
        <input
          type="text"
          placeholder="Rechercher par nom ou téléphone..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl py-4 pl-12 pr-4 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C] transition-colors"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 text-center">
          <p className="text-[#C9A84C] text-3xl font-bold">{totalCount}</p>
          <p className="text-[#A89968] text-sm uppercase tracking-wide mt-1">Clients</p>
        </div>
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 text-center">
          <p className="text-[#C9A84C] text-3xl font-bold">{activeThisMonth}</p>
          <p className="text-[#A89968] text-sm uppercase tracking-wide mt-1">Actifs ce mois</p>
        </div>
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 text-center">
          <p className="text-[#C9A84C] text-3xl font-bold">{loyalCount}</p>
          <p className="text-[#A89968] text-sm uppercase tracking-wide mt-1">Fidèles (3+ cmd)</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_1fr_100px_120px_140px_120px_60px] gap-4 p-4 border-b border-[rgba(201,168,76,0.15)] text-[#A89968] text-sm uppercase tracking-wide">
          <span>Nom</span>
          <span>Téléphone</span>
          <span className="text-center">Commandes</span>
          <span className="text-center">Dépensé</span>
          <span className="text-center">Fidélité</span>
          <span className="text-center">Dernière cmd</span>
          <span></span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-[#A89968]">
            <p>Aucun client trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_1fr_100px_120px_140px_120px_60px] gap-4 p-4 items-center hover:bg-[rgba(201,168,76,0.05)] transition-colors"
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center text-[#0E0C08] font-bold text-sm flex-shrink-0">
                    {getInitials(customer.full_name)}
                  </div>
                  <div>
                    <span className="text-[#F5EDD8] font-medium block">{customer.full_name || 'Anonyme'}</span>
                    <span className="text-[#A89968] text-xs md:hidden">{customer.phone}</span>
                  </div>
                </div>

                {/* Phone (desktop) */}
                <span className="text-[#A89968] hidden md:block">{customer.phone}</span>

                {/* Orders */}
                <span className="text-[#C9A84C] font-bold text-center hidden md:block">{customer.total_orders}</span>

                {/* Spent */}
                <span className="text-[#C9A84C] font-bold text-center hidden md:block">{customer.total_spent} DH</span>

                {/* Loyalty */}
                <div className="hidden md:flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((stamp) => (
                    <div
                      key={stamp}
                      className={`w-5 h-5 rounded-full border-2 ${
                        stamp <= (customer.loyalty_points % 5 || (customer.loyalty_points > 0 ? 5 : 0))
                          ? "bg-[#C9A84C] border-[#C9A84C]"
                          : "border-[rgba(201,168,76,0.3)]"
                      }`}
                    />
                  ))}
                </div>

                {/* Last order */}
                <span className="text-[#A89968] text-sm text-center hidden md:block">
                  {formatLastOrder(customer.last_order_at)}
                </span>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1DA851] transition-colors mx-auto block"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[#A89968] text-sm">
          {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} sur {totalCount}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg text-[#C9A84C] hover:bg-[rgba(201,168,76,0.1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-[#A89968] text-sm px-2">{currentPage} / {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-2 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg text-[#C9A84C] hover:bg-[rgba(201,168,76,0.1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
