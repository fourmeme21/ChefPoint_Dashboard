"use client"

import { useState } from "react"
import { Search, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface Client {
  id: string
  name: string
  initials: string
  phone: string
  orders: number
  totalSpent: number
  loyaltyStamps: number
  lastOrder: string
}

const clients: Client[] = [
  {
    id: "1",
    name: "Mohammed Alaoui",
    initials: "MA",
    phone: "+212 6 12 34 56 78",
    orders: 12,
    totalSpent: 1560,
    loyaltyStamps: 5,
    lastOrder: "Il y a 2 jours"
  },
  {
    id: "2",
    name: "Sara Bennani",
    initials: "SB",
    phone: "+212 6 23 45 67 89",
    orders: 8,
    totalSpent: 890,
    loyaltyStamps: 3,
    lastOrder: "Il y a 1 semaine"
  },
  {
    id: "3",
    name: "Youssef Karimi",
    initials: "YK",
    phone: "+212 6 34 56 78 90",
    orders: 5,
    totalSpent: 520,
    loyaltyStamps: 2,
    lastOrder: "Aujourd'hui"
  },
  {
    id: "4",
    name: "Fatima Zahra",
    initials: "FZ",
    phone: "+212 6 45 67 89 01",
    orders: 15,
    totalSpent: 2340,
    loyaltyStamps: 5,
    lastOrder: "Il y a 3 jours"
  },
  {
    id: "5",
    name: "Ahmed Tazi",
    initials: "AT",
    phone: "+212 6 56 78 90 12",
    orders: 3,
    totalSpent: 285,
    loyaltyStamps: 1,
    lastOrder: "Il y a 2 semaines"
  }
]

export function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="font-serif text-3xl text-[#C9A84C]">Base Clients</h1>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A84C]" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl py-4 pl-12 pr-4 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C] transition-colors"
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 text-center">
          <p className="text-[#C9A84C] text-3xl font-bold">124</p>
          <p className="text-[#A89968] text-sm uppercase tracking-wide mt-1">Clients</p>
        </div>
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 text-center">
          <p className="text-[#C9A84C] text-3xl font-bold">89</p>
          <p className="text-[#A89968] text-sm uppercase tracking-wide mt-1">Actifs ce mois</p>
        </div>
        <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 text-center">
          <p className="text-[#C9A84C] text-3xl font-bold">23</p>
          <p className="text-[#A89968] text-sm uppercase tracking-wide mt-1">Fidèles (3+ cmd)</p>
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_100px_120px_140px_120px_60px] gap-4 p-4 border-b border-[rgba(201,168,76,0.15)] text-[#A89968] text-sm uppercase tracking-wide">
          <span>Nom</span>
          <span>Téléphone</span>
          <span className="text-center">Commandes</span>
          <span className="text-center">Dépensé</span>
          <span className="text-center">Fidélité</span>
          <span className="text-center">Dernière cmd</span>
          <span></span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[rgba(201,168,76,0.08)]">
          {filteredClients.map((client) => (
            <div 
              key={client.id}
              className="grid grid-cols-[1fr_1fr_100px_120px_140px_120px_60px] gap-4 p-4 items-center hover:bg-[rgba(201,168,76,0.05)] transition-colors"
            >
              {/* Name with Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center text-[#0E0C08] font-bold text-sm">
                  {client.initials}
                </div>
                <span className="text-[#F5EDD8] font-medium">{client.name}</span>
              </div>

              {/* Phone */}
              <span className="text-[#A89968]">{client.phone}</span>

              {/* Orders */}
              <span className="text-[#C9A84C] font-bold text-center">{client.orders}</span>

              {/* Total Spent */}
              <span className="text-[#C9A84C] font-bold text-center">{client.totalSpent} DH</span>

              {/* Loyalty Stamps */}
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((stamp) => (
                  <div
                    key={stamp}
                    className={`w-5 h-5 rounded-full border-2 ${
                      stamp <= client.loyaltyStamps
                        ? "bg-[#C9A84C] border-[#C9A84C]"
                        : "border-[rgba(201,168,76,0.3)]"
                    }`}
                  />
                ))}
              </div>

              {/* Last Order */}
              <span className="text-[#A89968] text-sm text-center">{client.lastOrder}</span>

              {/* WhatsApp Button */}
              <button className="p-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1DA851] transition-colors mx-auto">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-[#A89968] text-sm">1-5 sur 124</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-2 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg text-[#C9A84C] hover:bg-[rgba(201,168,76,0.1)] transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-2 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg text-[#C9A84C] hover:bg-[rgba(201,168,76,0.1)] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
