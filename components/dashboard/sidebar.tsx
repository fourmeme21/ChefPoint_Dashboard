"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ClipboardList, BarChart3, UtensilsCrossed, Users, X, Menu } from "lucide-react"

type NavItem = "commandes" | "statistiques" | "menu" | "clients"

interface SidebarProps {
  activeNav: NavItem
  onNavChange: (nav: NavItem) => void
  pendingOrders: number
}

export function Sidebar({ activeNav, onNavChange, pendingOrders }: SidebarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const navItems: { id: NavItem; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: "commandes",
      label: "Commandes",
      icon: <ClipboardList className="w-5 h-5" />,
      badge: pendingOrders > 0 ? pendingOrders : undefined
    },
    { id: "statistiques", label: "Statistiques", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "menu", label: "Menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: "clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
  ]

  const handleNavChange = (nav: NavItem) => {
    onNavChange(nav)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#C9A84C] tracking-wide">ChefPoint</h1>
          <p className="text-[#A89968] text-xs uppercase tracking-widest mt-1">Cuisine</p>
        </div>
        {/* Close button - mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-[#A89968]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
              activeNav === item.id
                ? "bg-[rgba(201,168,76,0.15)] text-[#C9A84C]"
                : "text-[#A89968] hover:text-[#F5EDD8] hover:bg-[rgba(201,168,76,0.08)]"
            )}
          >
            <span className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
              activeNav === item.id ? "bg-[#C9A84C] text-[#0E0C08]" : ""
            )}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-[#E84A5F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[rgba(201,168,76,0.15)] space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🥗</span>
          <div className="flex-1">
            <p className="text-[#C9A84C] text-sm font-medium">Chicken Bowl</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
              <span className="text-[#4CAF50] text-xs">Ouvert</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[#C9A84C] text-2xl font-mono">
            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#E84A5F] text-[#E84A5F] text-sm hover:bg-[#E84A5F] hover:text-white transition-colors">
          <X className="w-4 h-4" />
          <span>Fermer la cuisine</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── MOBILE TOP HEADER ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#0E0C08] border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-[#A89968]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-xl text-[#C9A84C]">ChefPoint</h1>
        <div className="w-10 flex items-center justify-center">
          {pendingOrders > 0 && (
            <span className="bg-[#E84A5F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingOrders}
            </span>
          )}
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside className={cn(
        "md:hidden fixed top-0 left-0 h-screen w-[280px] bg-[#0E0C08] border-r border-[rgba(201,168,76,0.15)] flex flex-col z-[60] transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#1A160E] border-t border-[rgba(201,168,76,0.15)] flex items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavChange(item.id)}
            className="relative flex flex-col items-center gap-1 px-3 py-2"
          >
            <span className={cn(
              "w-6 h-6 flex items-center justify-center",
              activeNav === item.id ? "text-[#C9A84C]" : "text-[#A89968]"
            )}>
              {item.icon}
            </span>
            <span className={cn(
              "text-[10px]",
              activeNav === item.id ? "text-[#C9A84C]" : "text-[#A89968]"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <span className="absolute -top-1 right-1 bg-[#E84A5F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] bg-[#0E0C08] border-r border-[rgba(201,168,76,0.15)] flex-col z-50">
        <SidebarContent />
      </aside>
    </>
  )
}
