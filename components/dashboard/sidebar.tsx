"use client"

import { UtensilsCrossed, BarChart2, BookOpen, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = "commandes" | "statistiques" | "menu" | "clients"

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
  pendingOrders?: number
}

const navItems = [
  { id: "commandes" as const, label: "Commandes", icon: UtensilsCrossed },
  { id: "statistiques" as const, label: "Statistiques", icon: BarChart2 },
  { id: "menu" as const, label: "Menu", icon: BookOpen },
  { id: "clients" as const, label: "Clients", icon: Users },
]

export function Sidebar({ activeNav, onNavChange, pendingOrders = 0 }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#1A160E] border-r border-[rgba(201,168,76,0.15)] hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-[rgba(201,168,76,0.15)]">
          <h1 className="font-serif text-2xl text-[#C9A84C]">ChefPoint</h1>
          <p className="text-[#A89968] text-xs mt-1 uppercase tracking-widest">Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#C9A84C] text-[#0E0C08]"
                    : "text-[#A89968] hover:text-[#F5EDD8] hover:bg-[rgba(201,168,76,0.1)]"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
                {item.id === "commandes" && pendingOrders > 0 && (
                  <span className={cn(
                    "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-[#0E0C08] text-[#C9A84C]" : "bg-[#E84A5F] text-white"
                  )}>
                    {pendingOrders}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[rgba(201,168,76,0.15)]">
          <p className="text-[#A89968] text-xs text-center">Bab el Had · Rabat</p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#1A160E] border-b border-[rgba(201,168,76,0.15)] flex items-center px-4 z-20 md:hidden">
        <h1 className="font-serif text-xl text-[#C9A84C]">ChefPoint</h1>
        {pendingOrders > 0 && (
          <span className="ml-auto bg-[#E84A5F] text-white text-xs font-bold px-2 py-1 rounded-full">
            {pendingOrders} en attente
          </span>
        )}
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#1A160E] border-t border-[rgba(201,168,76,0.15)] flex items-center justify-around z-20 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                isActive ? "text-[#C9A84C]" : "text-[#A89968]"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.id === "commandes" && pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E84A5F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingOrders}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
