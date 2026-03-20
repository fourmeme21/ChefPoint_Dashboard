"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { CommandesPage } from "@/components/dashboard/commandes-page"
import { StatistiquesPage } from "@/components/dashboard/statistiques-page"
import { MenuPage } from "@/components/dashboard/menu-page"
import { ClientsPage } from "@/components/dashboard/clients-page"

type NavItem = "commandes" | "statistiques" | "menu" | "clients"

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>("commandes")

  const renderPage = () => {
    switch (activeNav) {
      case "commandes": return <CommandesPage />
      case "statistiques": return <StatistiquesPage />
      case "menu": return <MenuPage />
      case "clients": return <ClientsPage />
      default: return <CommandesPage />
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0C08]">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        pendingOrders={3}
      />
      {/* Desktop: ml-[240px] | Mobile: mt-14 mb-16 mx-0 */}
      <main className="md:ml-[240px] mt-14 md:mt-0 mb-16 md:mb-0 p-4 md:p-6 min-h-screen">
        {renderPage()}
      </main>
    </div>
  )
}
