"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ChevronRight, Bell, Search, Home, User, ShoppingCart, Share2, Star, Plus, Minus, Trash2, MapPin, Phone, MessageCircle, Check } from "lucide-react"

// Design tokens
const colors = {
  obsidian: "#0E0C08",
  charcoal: "#1A160E",
  gold: "#C9A84C",
  cream: "#F5EDD8",
  muted: "#A89968",
  border: "rgba(201,168,76,0.15)",
}

// Brand Data
const brands = [
  { name: "Chicken Bowl", emoji: "🥗", accent: "#C9A84C", status: "ACTIVE", price: 65, time: "25–35 min" },
  { name: "Paşa Wrap", emoji: "🌯", accent: "#E8935A", status: "COMING SOON", price: 55, time: "20–30 min" },
  { name: "Crema Medina", emoji: "🍦", accent: "#E84A5F", status: "COMING SOON", price: 30, time: "15–25 min" },
  { name: "Smash Rabat", emoji: "🍔", accent: "#4ECDC4", status: "COMING SOON", price: 70, time: "25–35 min" },
  { name: "Sweet Rabat", emoji: "🍮", accent: "#B57BEA", status: "COMING SOON", price: 40, time: "20–30 min" },
]

type Screen = "splash" | "onboarding" | "auth" | "home" | "menu" | "detail" | "panier" | "confirm" | "suivi" | "profil" | "notifs"

export default function ChefPointApp() {
  const [activeScreen, setActiveScreen] = useState<Screen>("splash")

  return (
    <div className="min-h-screen bg-[#0a0908] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Screen Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center max-w-3xl">
        {(["splash", "onboarding", "auth", "home", "menu", "detail", "panier", "confirm", "suivi", "profil", "notifs"] as Screen[]).map((screen) => (
          <button
            key={screen}
            onClick={() => setActiveScreen(screen)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
              activeScreen === screen
                ? "bg-[#C9A84C] text-[#0E0C08]"
                : "bg-[#1A160E] text-[#A89968] hover:text-[#F5EDD8] border border-[rgba(201,168,76,0.15)]"
            }`}
          >
            {screen === "splash" && "1. Splash"}
            {screen === "onboarding" && "2. Onboarding"}
            {screen === "auth" && "3. Auth"}
            {screen === "home" && "4. Home"}
            {screen === "menu" && "5. Menu"}
            {screen === "detail" && "6. Detail"}
            {screen === "panier" && "7. Panier"}
            {screen === "confirm" && "8. Confirm"}
            {screen === "suivi" && "9. Suivi"}
            {screen === "profil" && "10. Profil"}
            {screen === "notifs" && "11. Notifs"}
          </button>
        ))}
      </div>

      {/* Phone Frame */}
      <div className="relative">
        {/* Phone Border */}
        <div className="w-[410px] h-[864px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-[50px] p-[10px] shadow-2xl shadow-black/50">
          {/* Phone Screen */}
          <div className="w-[390px] h-[844px] bg-[#0E0C08] rounded-[40px] overflow-hidden relative">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50" />

            {/* Screen Content */}
            {activeScreen === "splash" && <SplashScreen />}
            {activeScreen === "onboarding" && <OnboardingScreen />}
            {activeScreen === "auth" && <AuthScreen />}
            {activeScreen === "home" && <HomeScreen />}
            {activeScreen === "menu" && <MenuScreen />}
            {activeScreen === "detail" && <DetailScreen />}
            {activeScreen === "panier" && <PanierScreen />}
            {activeScreen === "confirm" && <ConfirmScreen />}
            {activeScreen === "suivi" && <SuiviScreen />}
            {activeScreen === "profil" && <ProfilScreen />}
            {activeScreen === "notifs" && <NotifsScreen />}
          </div>
        </div>
      </div>
    </div>
  )
}

function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-8"
      style={{ backgroundColor: colors.obsidian }}
    >
      {/* Moroccan Arch Decorative Element */}
      <div className="absolute top-1/4 w-48 h-48 opacity-10">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 10 C140 10, 180 50, 180 100 L180 190 L20 190 L20 100 C20 50, 60 10, 100 10Z"
            stroke={colors.gold}
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M100 30 C130 30, 160 60, 160 100 L160 170 L40 170 L40 100 C40 60, 70 30, 100 30Z"
            stroke={colors.gold}
            strokeWidth="1"
            fill="none"
          />
          <circle cx="100" cy="80" r="15" stroke={colors.gold} strokeWidth="1" fill="none" />
          <path d="M85 80 L115 80 M100 65 L100 95" stroke={colors.gold} strokeWidth="1" />
        </svg>
      </div>

      {/* Brand Name */}
      <h1
        className="font-serif text-5xl tracking-wide"
        style={{ color: colors.gold, fontFamily: "Playfair Display, Georgia, serif" }}
      >
        ChefPoint
      </h1>

      {/* Moroccan Arch Below */}
      <div className="mt-8 w-20 h-12 opacity-60">
        <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 50 L5 25 Q5 5 40 5 Q75 5 75 25 L75 50"
            stroke={colors.gold}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M15 50 L15 28 Q15 12 40 12 Q65 12 65 28 L65 50"
            stroke={colors.gold}
            strokeWidth="1"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Loading Bar */}
      <div className="absolute bottom-20 w-48">
        <div
          className="h-0.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(201,168,76,0.2)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              backgroundColor: colors.gold,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Une Cuisine. Cinq Univers.",
      description:
        "Découvrez 5 marques premium livrées depuis un seul dark kitchen au cœur de Rabat.",
    },
    {
      title: "Fraîcheur Garantie",
      description: "Des ingrédients locaux sélectionnés avec soin, préparés à la commande.",
    },
    {
      title: "Livraison Express",
      description: "Recevez vos plats chauds en moins de 30 minutes, où que vous soyez à Rabat.",
    },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Food Image Area with Gold Gradient */}
      <div className="h-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${colors.charcoal} 0%, ${colors.obsidian} 50%, transparent 100%)`,
          }}
        />
        {/* Decorative food placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Plate circle */}
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle, ${colors.charcoal} 0%, ${colors.obsidian} 70%)`,
                border: `1px solid ${colors.border}`,
              }}
            />
            {/* Gold accent rings */}
            <div
              className="absolute inset-4 rounded-full"
              style={{ border: `1px solid ${colors.border}` }}
            />
            <div
              className="absolute inset-12 rounded-full"
              style={{ border: `1px solid ${colors.border}` }}
            />
            {/* Center emblem */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(201,168,76,0.1)", border: `1px solid ${colors.gold}` }}
              >
                <span className="text-3xl" style={{ color: colors.gold }}>
                  ✦
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Gold gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: `linear-gradient(to top, ${colors.charcoal}, transparent)`,
          }}
        />
      </div>

      {/* Content Card */}
      <div
        className="flex-1 rounded-t-[32px] px-6 pt-8 pb-6 flex flex-col"
        style={{ backgroundColor: colors.charcoal }}
      >
        {/* Slide Indicators */}
        <div className="flex gap-2 justify-center mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: currentSlide === index ? "24px" : "8px",
                backgroundColor: currentSlide === index ? colors.gold : colors.muted,
                opacity: currentSlide === index ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        {/* Heading */}
        <h2
          className="text-2xl text-center mb-4 font-serif"
          style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          {slides[currentSlide].title}
        </h2>

        {/* Description */}
        <p className="text-center text-sm leading-relaxed mb-8" style={{ color: colors.muted }}>
          {slides[currentSlide].description}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev < 2 ? prev + 1 : prev))}
          className="w-full py-4 rounded-full flex items-center justify-center gap-2 font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:opacity-90"
          style={{ backgroundColor: colors.gold, color: colors.obsidian }}
        >
          Suivant
          <ChevronRight size={18} />
        </button>

        {/* Login Link */}
        <p className="text-center mt-4 text-sm" style={{ color: colors.muted }}>
          Déjà un compte?{" "}
          <span className="underline cursor-pointer" style={{ color: colors.cream }}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  )
}

function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState("")

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Header */}
      <div className="pt-16 px-6 flex items-center justify-between">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <ArrowLeft size={20} style={{ color: colors.cream }} />
        </button>
        <h1
          className="font-serif text-xl"
          style={{ color: colors.gold, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          ChefPoint
        </h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-12">
        {/* Heading */}
        <h2
          className="text-3xl mb-3 font-serif"
          style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Entrez votre numéro
        </h2>
        <p className="text-sm mb-8" style={{ color: colors.muted }}>
          Nous vous enverrons un code de vérification
        </p>

        {/* Phone Input */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3 mb-3"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <div
            className="flex items-center gap-2 pr-3"
            style={{ borderRight: `1px solid ${colors.border}` }}
          >
            <span className="text-lg">🇲🇦</span>
            <span className="font-semibold" style={{ color: colors.gold }}>
              +212
            </span>
          </div>
          <input
            type="tel"
            placeholder="6XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1 bg-transparent outline-none text-lg"
            style={{ color: colors.cream }}
          />
        </div>

        {/* Country Selector */}
        <p className="text-sm mb-8 text-center" style={{ color: colors.muted }}>
          Maroc ·{" "}
          <span className="underline cursor-pointer" style={{ color: colors.cream }}>
            تغيير البلد
          </span>
        </p>

        {/* CTA Button */}
        <button
          className="w-full py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:opacity-90"
          style={{ backgroundColor: colors.gold, color: colors.obsidian }}
        >
          Recevoir le code
        </button>
      </div>

      {/* Terms */}
      <div className="px-6 pb-4">
        <p className="text-xs text-center leading-relaxed" style={{ color: colors.muted }}>
          En continuant, vous acceptez nos{" "}
          <span className="underline cursor-pointer">Conditions d&apos;utilisation</span>
        </p>
      </div>

      {/* Keyboard Simulation */}
      <div
        className="h-20 rounded-t-2xl"
        style={{
          backgroundColor: "#2a2520",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex justify-center gap-2 pt-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <div
              key={num}
              className="w-7 h-10 rounded-lg flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: colors.charcoal, color: colors.cream }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HomeScreen() {
  const popularItems = [
    { name: "Classic Bowl", description: "Poulet grillé, légumes frais, sauce tahini", price: 65, emoji: "🥗" },
    { name: "Spicy Bowl", description: "Poulet épicé, avocat, sauce harissa", price: 70, emoji: "🌶️" },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Top Bar */}
      <div className="pt-14 px-5 flex items-center justify-between">
        <h1
          className="font-serif text-2xl"
          style={{ color: colors.gold, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          ChefPoint
        </h1>
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
          >
            <Bell size={18} style={{ color: colors.cream }} />
          </button>
          <div
            className="w-10 h-10 rounded-full"
            style={{ 
              backgroundColor: colors.charcoal, 
              border: `2px solid ${colors.gold}`,
              backgroundImage: "linear-gradient(135deg, #C9A84C33 0%, #1A160E 100%)"
            }}
          />
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-5">
        <h2 className="text-2xl mb-1" style={{ color: colors.cream }}>
          Bonjour 👋
        </h2>
        <p className="text-sm" style={{ color: colors.muted }}>
          Que souhaitez-vous aujourd&apos;hui?
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-5 pt-5">
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <Search size={18} style={{ color: colors.gold }} />
          <span className="text-sm" style={{ color: colors.muted }}>
            Rechercher un plat...
          </span>
        </div>
      </div>

      {/* Brands Section */}
      <div className="pt-6 px-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: colors.cream }}>
          Nos Marques
        </h3>
      </div>

      {/* Horizontal Scroll Brands */}
      <div className="px-5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {brands.map((brand, index) => (
            <div
              key={index}
              className="w-40 h-44 rounded-2xl p-4 flex flex-col relative overflow-hidden"
              style={{
                backgroundColor: colors.charcoal,
                border: brand.status === "ACTIVE" ? `2px solid ${colors.gold}` : `1px solid ${colors.border}`,
                opacity: brand.status === "COMING SOON" ? 0.6 : 1,
                filter: brand.status === "COMING SOON" ? "grayscale(50%)" : "none",
              }}
            >
              {/* Badge */}
              <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                style={{
                  backgroundColor: brand.status === "ACTIVE" ? "#22c55e" : colors.muted,
                  color: brand.status === "ACTIVE" ? "#fff" : colors.obsidian,
                }}
              >
                {brand.status === "ACTIVE" ? "Ouvert" : "Bientôt"}
              </div>

              {/* Emoji Circle */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto"
                style={{ backgroundColor: `${brand.accent}20` }}
              >
                <span className="text-3xl">{brand.emoji}</span>
              </div>

              {/* Brand Info */}
              <h4 className="font-serif text-sm text-center mb-1" style={{ color: colors.cream }}>
                {brand.name}
              </h4>
              <p className="text-[10px] text-center" style={{ color: colors.muted }}>
                À partir de {brand.price} DH
              </p>
              <p className="text-[10px] text-center mt-auto" style={{ color: colors.gold }}>
                {brand.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Section */}
      <div className="pt-6 px-5 flex-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: colors.cream }}>
          Populaire
        </h3>

        <div className="flex flex-col gap-3">
          {popularItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
            >
              {/* Emoji Circle */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${colors.gold}20`, border: `1px solid ${colors.gold}33` }}
              >
                <span className="text-2xl">{item.emoji}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1" style={{ color: colors.cream }}>
                  {item.name}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: colors.muted }}>
                  {item.description}
                </p>
                <p className="text-sm font-bold mt-1" style={{ color: colors.gold }}>
                  {item.price} DH
                </p>
              </div>

              {/* Add Button */}
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.gold }}
              >
                <Plus size={16} style={{ color: colors.obsidian }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="h-20 px-8 flex items-center justify-between"
        style={{ backgroundColor: colors.charcoal, borderTop: `1px solid ${colors.border}` }}
      >
        {[
          { icon: Home, label: "Accueil", active: true },
          { icon: Search, label: "Chercher", active: false },
          { icon: ShoppingCart, label: "Commandes", active: false },
          { icon: User, label: "Profil", active: false },
        ].map((item, index) => (
          <button key={index} className="flex flex-col items-center gap-1">
            <item.icon size={22} style={{ color: item.active ? colors.gold : colors.muted }} />
            <span className="text-[10px]" style={{ color: item.active ? colors.gold : colors.muted }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("Tous")
  const categories = ["Tous", "Bowls", "Boissons", "Extras"]

  const menuItems = [
    { name: "Classic Bowl", description: "Poulet grillé, riz basmati, légumes de saison, sauce tahini maison", price: 65, weight: "580g", emoji: "🥗" },
    { name: "Spicy Bowl", description: "Poulet épicé, quinoa, avocat frais, sauce harissa", price: 70, weight: "550g", emoji: "🌶️" },
    { name: "Veggie Bowl", description: "Falafel maison, houmous, légumes grillés, sauce citron", price: 60, weight: "520g", emoji: "🥬" },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Header */}
      <div className="pt-14 px-5 flex items-center justify-between">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <ArrowLeft size={20} style={{ color: colors.cream }} />
        </button>
        <h1
          className="font-serif text-xl"
          style={{ color: colors.gold, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Chicken Bowl
        </h1>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center relative"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <ShoppingCart size={18} style={{ color: colors.cream }} />
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: colors.gold, color: colors.obsidian }}
          >
            1
          </div>
        </button>
      </div>

      {/* Hero Area */}
      <div
        className="h-48 relative flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(180deg, ${colors.charcoal} 0%, ${colors.obsidian} 100%)` }}
      >
        <span className="text-6xl mb-3">🥗</span>
        <h2 className="font-serif text-2xl mb-2" style={{ color: colors.cream }}>
          Chicken Bowl
        </h2>
        <p className="text-xs" style={{ color: colors.muted }}>
          Ouvert · 25–35 min · Min 65 DH
        </p>
        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ backgroundColor: colors.gold, opacity: 0.3 }}
        />
      </div>

      {/* Category Tabs */}
      <div className="px-5 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeCategory === cat ? colors.gold : "transparent",
              color: activeCategory === cat ? colors.obsidian : colors.muted,
              border: activeCategory === cat ? "none" : `1px solid ${colors.border}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-5 overflow-y-auto pb-24">
        <div className="flex flex-col gap-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 flex gap-4"
              style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
            >
              {/* Image Placeholder */}
              <div
                className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${colors.gold}15`, border: `2px solid ${colors.gold}33` }}
              >
                <span className="text-3xl">{item.emoji}</span>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <h4 className="font-semibold text-sm mb-1" style={{ color: colors.cream }}>
                  {item.name}
                </h4>
                <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: colors.muted }}>
                  {item.description}
                </p>
                <p className="text-xs" style={{ color: colors.gold }}>
                  {item.weight}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-base font-bold" style={{ color: colors.gold }}>
                    {item.price} DH
                  </p>
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.gold }}
                  >
                    <Plus size={16} style={{ color: colors.obsidian }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <div className="absolute bottom-6 left-5 right-5">
        <button
          className="w-full py-4 rounded-full flex items-center justify-center gap-2 font-semibold text-sm"
          style={{ backgroundColor: colors.gold, color: colors.obsidian }}
        >
          Voir le panier (1) · 65 DH
        </button>
      </div>
    </div>
  )
}

function DetailScreen() {
  const [quantity, setQuantity] = useState(1)
  const [selectedProtein, setSelectedProtein] = useState("Poulet")
  const [selectedSauce, setSelectedSauce] = useState("Tahini")

  const proteins = ["Poulet", "Boeuf", "Falafel"]
  const sauces = ["Tahini", "Harissa", "Citron"]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Hero Area */}
      <div
        className="h-[40%] relative flex items-center justify-center"
        style={{ background: `linear-gradient(180deg, ${colors.charcoal} 0%, ${colors.obsidian} 100%)` }}
      >
        {/* Back Button */}
        <button
          className="absolute top-14 left-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}
        >
          <ArrowLeft size={20} style={{ color: colors.cream }} />
        </button>

        {/* Share Button */}
        <button
          className="absolute top-14 right-5 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}
        >
          <Share2 size={18} style={{ color: colors.cream }} />
        </button>

        {/* Food Image with Gold Ring */}
        <div className="relative">
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${colors.charcoal} 0%, ${colors.obsidian} 70%)`,
              border: `3px solid ${colors.gold}`,
              boxShadow: `0 0 40px ${colors.gold}33`,
            }}
          >
            <span className="text-7xl">🥗</span>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div
        className="flex-1 rounded-t-[32px] px-6 pt-6 pb-6 flex flex-col overflow-y-auto"
        style={{ backgroundColor: colors.charcoal, marginTop: -32 }}
      >
        {/* Brand Badge */}
        <div
          className="self-start px-3 py-1 rounded-full mb-3 flex items-center gap-1"
          style={{ backgroundColor: `${colors.gold}20`, border: `1px solid ${colors.gold}33` }}
        >
          <span className="text-sm">🥗</span>
          <span className="text-xs font-medium" style={{ color: colors.gold }}>
            Chicken Bowl
          </span>
        </div>

        {/* Product Name */}
        <h1
          className="text-3xl mb-2 font-serif"
          style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Classic Bowl
        </h1>

        {/* Rating Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star size={14} fill={colors.gold} style={{ color: colors.gold }} />
            <span className="text-sm font-semibold" style={{ color: colors.gold }}>
              4.8
            </span>
          </div>
          <span className="text-xs" style={{ color: colors.muted }}>
            (124 avis)
          </span>
          <div
            className="px-2 py-0.5 rounded-full text-xs"
            style={{ backgroundColor: `${colors.gold}20`, color: colors.gold }}
          >
            580g
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold" style={{ color: colors.gold }}>
            65 DH
          </span>
          <span className="text-sm line-through" style={{ color: colors.muted }}>
            75 DH
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: colors.muted }}>
          Un bol généreux de poulet grillé mariné aux épices marocaines, accompagné de riz basmati parfumé, légumes de saison et notre sauce tahini maison.
        </p>

        {/* Customize Section */}
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: colors.cream }}>
          Personnaliser
        </h3>

        {/* Protein Options */}
        <div className="mb-4">
          <p className="text-sm mb-2" style={{ color: colors.muted }}>
            Protéine
          </p>
          <div className="flex gap-2">
            {proteins.map((protein) => (
              <button
                key={protein}
                onClick={() => setSelectedProtein(protein)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: selectedProtein === protein ? colors.gold : "transparent",
                  color: selectedProtein === protein ? colors.obsidian : colors.muted,
                  border: selectedProtein === protein ? "none" : `1px solid ${colors.border}`,
                }}
              >
                {protein}
              </button>
            ))}
          </div>
        </div>

        {/* Sauce Options */}
        <div className="mb-6">
          <p className="text-sm mb-2" style={{ color: colors.muted }}>
            Sauce
          </p>
          <div className="flex gap-2">
            {sauces.map((sauce) => (
              <button
                key={sauce}
                onClick={() => setSelectedSauce(sauce)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: selectedSauce === sauce ? colors.gold : "transparent",
                  color: selectedSauce === sauce ? colors.obsidian : colors.muted,
                  border: selectedSauce === sauce ? "none" : `1px solid ${colors.border}`,
                }}
              >
                {sauce}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.obsidian, border: `1px solid ${colors.border}` }}
          >
            <Minus size={18} style={{ color: colors.cream }} />
          </button>
          <span className="text-xl font-semibold" style={{ color: colors.cream }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.gold }}
          >
            <Plus size={18} style={{ color: colors.obsidian }} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          className="w-full py-4 rounded-full font-semibold text-sm uppercase tracking-wider mt-auto"
          style={{ backgroundColor: colors.gold, color: colors.obsidian }}
        >
          Ajouter au panier · {65 * quantity} DH
        </button>
      </div>
    </div>
  )
}

function PanierScreen() {
  const [quantities, setQuantities] = useState({ classic: 1, spicy: 1 })
  const [selectedPayment, setSelectedPayment] = useState("cash")

  const classicPrice = 65
  const spicyPrice = 70
  const deliveryFee = 15
  const subtotal = classicPrice * quantities.classic + spicyPrice * quantities.spicy
  const total = subtotal + deliveryFee

  const paymentMethods = [
    { id: "cash", label: "Especes", icon: "💵" },
    { id: "card", label: "Carte", icon: "💳" },
    { id: "cmi", label: "CMI Online", icon: "📱" },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Header */}
      <div className="pt-14 px-5 flex items-center justify-between">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <ArrowLeft size={20} style={{ color: colors.cream }} />
        </button>
        <h1
          className="font-serif text-xl"
          style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Mon Panier
        </h1>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <Trash2 size={18} style={{ color: colors.cream }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-6 pb-4 overflow-y-auto">
        {/* Order Summary Card */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          {/* Brand Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🥗</span>
            <span className="text-sm font-medium" style={{ color: colors.gold }}>
              Chicken Bowl
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs" style={{ color: "#22c55e" }}>
                Ouvert
              </span>
            </div>
          </div>

          {/* Item 1 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: colors.cream }}>
                Classic Bowl
              </p>
              <p className="text-xs" style={{ color: colors.muted }}>
                Poulet · Tahini · 580g
              </p>
            </div>
            <p className="font-semibold" style={{ color: colors.gold }}>
              {classicPrice} DH
            </p>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setQuantities((q) => ({ ...q, classic: Math.max(1, q.classic - 1) }))}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.obsidian, border: `1px solid ${colors.border}` }}
            >
              <Minus size={14} style={{ color: colors.cream }} />
            </button>
            <span className="text-sm font-semibold" style={{ color: colors.cream }}>
              {quantities.classic}
            </span>
            <button
              onClick={() => setQuantities((q) => ({ ...q, classic: q.classic + 1 }))}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.gold }}
            >
              <Plus size={14} style={{ color: colors.obsidian }} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px mb-4" style={{ backgroundColor: colors.border }} />

          {/* Item 2 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: colors.cream }}>
                Spicy Bowl
              </p>
              <p className="text-xs" style={{ color: colors.muted }}>
                Poulet epice · Harissa · 550g
              </p>
            </div>
            <p className="font-semibold" style={{ color: colors.gold }}>
              {spicyPrice} DH
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantities((q) => ({ ...q, spicy: Math.max(1, q.spicy - 1) }))}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.obsidian, border: `1px solid ${colors.border}` }}
            >
              <Minus size={14} style={{ color: colors.cream }} />
            </button>
            <span className="text-sm font-semibold" style={{ color: colors.cream }}>
              {quantities.spicy}
            </span>
            <button
              onClick={() => setQuantities((q) => ({ ...q, spicy: q.spicy + 1 }))}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.gold }}
            >
              <Plus size={14} style={{ color: colors.obsidian }} />
            </button>
          </div>
        </div>

        {/* Order Total Card */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: colors.muted }}>
              Sous-total
            </span>
            <span className="text-sm" style={{ color: colors.cream }}>
              {subtotal} DH
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: colors.muted }}>
              Livraison
            </span>
            <span className="text-sm" style={{ color: colors.cream }}>
              {deliveryFee} DH
            </span>
          </div>
          <div className="h-px mb-3" style={{ backgroundColor: colors.gold, opacity: 0.3 }} />
          <div className="flex items-center justify-between">
            <span className="text-base font-bold" style={{ color: colors.cream }}>
              Total
            </span>
            <span className="text-lg font-bold" style={{ color: colors.gold }}>
              {total} DH
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: colors.muted }}
          >
            Adresse de livraison
          </p>
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
          >
            <MapPin size={18} style={{ color: colors.gold }} />
            <span className="flex-1 text-sm" style={{ color: colors.cream }}>
              Bab el Had, Rabat
            </span>
            <span className="text-xs" style={{ color: colors.gold }}>
              Modifier
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: colors.muted }}
          >
            Paiement
          </p>
          <div className="flex gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className="flex-1 py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                style={{
                  backgroundColor: selectedPayment === method.id ? `${colors.gold}20` : colors.charcoal,
                  border: selectedPayment === method.id ? `2px solid ${colors.gold}` : `1px solid ${colors.border}`,
                  color: selectedPayment === method.id ? colors.gold : colors.muted,
                }}
              >
                <span>{method.icon}</span>
                <span className="text-xs">{method.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-8">
        <button
          className="w-full py-4 rounded-full font-semibold text-sm"
          style={{ backgroundColor: colors.gold, color: colors.obsidian }}
        >
          Confirmer la commande · {total} DH
        </button>
      </div>
    </div>
  )
}

function ConfirmScreen() {
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const steps = [
    { label: "Commande recue", time: "14:32", status: "done" },
    { label: "En preparation", time: "", status: "current" },
    { label: "En route", time: "", status: "pending" },
    { label: "Livre", time: "", status: "pending" },
  ]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6" style={{ backgroundColor: colors.obsidian }}>
      {/* Animated Checkmark */}
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
          showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        style={{
          border: `3px solid ${colors.gold}`,
          boxShadow: `0 0 30px ${colors.gold}40`,
        }}
      >
        <Check size={40} style={{ color: colors.gold }} />
      </div>

      {/* Title */}
      <h1
        className="text-2xl mb-2 font-serif text-center"
        style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
      >
        Commande confirmee !
      </h1>

      {/* Order Number */}
      <p className="text-2xl font-bold mb-3" style={{ color: colors.gold }}>
        #01042
      </p>

      {/* Subtitle */}
      <p className="text-sm text-center mb-6" style={{ color: colors.muted }}>
        Votre commande a ete recue et est en preparation
      </p>

      {/* Estimated Time Card */}
      <div
        className="rounded-2xl px-8 py-4 mb-8 text-center"
        style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
      >
        <p className="text-xs mb-1" style={{ color: colors.muted }}>
          ⏱ Temps estime
        </p>
        <p className="text-xl font-bold" style={{ color: colors.gold }}>
          25-35 min
        </p>
      </div>

      {/* Status Timeline */}
      <div className="w-full max-w-xs mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 relative">
            {/* Vertical Line */}
            {index < steps.length - 1 && (
              <div
                className="absolute left-[9px] top-5 w-0.5 h-10"
                style={{
                  backgroundColor: step.status === "done" || step.status === "current" ? colors.gold : colors.border,
                }}
              />
            )}
            {/* Dot */}
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                step.status === "current" ? "animate-pulse" : ""
              }`}
              style={{
                backgroundColor:
                  step.status === "done"
                    ? colors.gold
                    : step.status === "current"
                    ? colors.gold
                    : "transparent",
                border:
                  step.status === "pending"
                    ? `2px solid ${colors.muted}`
                    : `2px solid ${colors.gold}`,
              }}
            >
              {step.status === "done" && <Check size={12} style={{ color: colors.obsidian }} />}
            </div>
            {/* Label */}
            <div className="flex-1 pb-6">
              <p
                className="text-sm"
                style={{
                  color:
                    step.status === "done" || step.status === "current"
                      ? step.status === "current"
                        ? colors.gold
                        : colors.cream
                      : colors.muted,
                }}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="text-xs" style={{ color: colors.muted }}>
                  {step.time}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3">
        <button
          className="w-full py-4 rounded-full font-semibold text-sm"
          style={{ backgroundColor: colors.gold, color: colors.obsidian }}
        >
          Suivre ma commande
        </button>
        <button
          className="w-full py-4 rounded-full font-semibold text-sm"
          style={{ backgroundColor: "transparent", border: `1px solid ${colors.border}`, color: colors.cream }}
        >
          Retour a l&apos;accueil
        </button>
      </div>
    </div>
  )
}

function SuiviScreen() {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Header */}
      <div className="pt-14 px-5">
        <div className="flex items-center gap-4">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
          >
            <ArrowLeft size={20} style={{ color: colors.cream }} />
          </button>
          <div>
            <h1
              className="font-serif text-xl"
              style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
            >
              Suivi de commande
            </h1>
            <p className="text-xs" style={{ color: colors.muted }}>
              #01042
            </p>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div
        className="flex-1 relative mx-5 mt-4 rounded-2xl overflow-hidden"
        style={{ backgroundColor: colors.charcoal }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px"
              style={{ top: `${i * 10}%`, backgroundColor: colors.gold }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px"
              style={{ left: `${i * 10}%`, backgroundColor: colors.gold }}
            />
          ))}
        </div>

        {/* Moroccan Arch Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <svg width="120" height="150" viewBox="0 0 80 100" fill="none">
            <path
              d="M5 100 L5 50 Q5 10 40 10 Q75 10 75 50 L75 100"
              stroke={colors.gold}
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 80 120 Q 120 100, 160 130 Q 200 160, 280 100"
            stroke={colors.gold}
            strokeWidth="2"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.6"
          />
        </svg>

        {/* Restaurant Pin */}
        <div className="absolute top-1/3 left-1/5 flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
            style={{ backgroundColor: `${colors.gold}30`, border: `2px solid ${colors.gold}` }}
          >
            <span className="text-lg">🥗</span>
          </div>
        </div>

        {/* Delivery Pin */}
        <div className="absolute top-1/2 left-1/2 flex flex-col items-center -translate-x-1/2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.gold }}
          >
            <span className="text-lg">🛵</span>
          </div>
        </div>

        {/* Customer Pin */}
        <div className="absolute top-1/3 right-1/5 flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.cream }}
          >
            <MapPin size={20} style={{ color: colors.obsidian }} />
          </div>
        </div>
      </div>

      {/* Bottom Card */}
      <div
        className="rounded-t-[32px] px-5 pt-5 pb-8 mt-4"
        style={{ backgroundColor: colors.charcoal }}
      >
        {/* Status Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛵</span>
            <span className="font-semibold" style={{ color: colors.gold }}>
              En route vers vous
            </span>
          </div>
          <span className="font-semibold" style={{ color: colors.gold }}>
            ~12 min
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 rounded-full mb-4" style={{ backgroundColor: colors.border }}>
          <div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.gold, width: "60%" }}
          />
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-5">
          {["Recue", "Preparation", "En route", "Livre"].map((label, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: index < 3 ? colors.gold : "transparent",
                  border: index >= 3 ? `2px solid ${colors.muted}` : "none",
                }}
              />
              <span className="text-[10px]" style={{ color: index < 3 ? colors.cream : colors.muted }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ backgroundColor: colors.border }} />

        {/* Driver Info */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
            style={{ backgroundColor: `${colors.gold}30`, color: colors.gold }}
          >
            KA
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: colors.cream }}>
              Karim A.
            </p>
            <div className="flex items-center gap-1">
              <Star size={12} fill={colors.gold} style={{ color: colors.gold }} />
              <span className="text-xs" style={{ color: colors.gold }}>
                4.9
              </span>
            </div>
          </div>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.gold }}
          >
            <Phone size={18} style={{ color: colors.obsidian }} />
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.obsidian, border: `1px solid ${colors.border}` }}
          >
            <MessageCircle size={18} style={{ color: colors.cream }} />
          </button>
        </div>

        {/* Order Summary */}
        <p className="text-xs text-center mb-4" style={{ color: colors.muted }}>
          Classic Bowl + Spicy Bowl · 150 DH
        </p>

        {/* Support Button */}
        <button
          className="w-full py-4 rounded-full font-semibold text-sm"
          style={{ backgroundColor: "transparent", border: `1px solid ${colors.border}`, color: colors.cream }}
        >
          Contacter le support
        </button>
      </div>
    </div>
  )
}

function ProfilScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const stats = [
    { value: "12", label: "Commandes" },
    { value: "780 DH", label: "Depense" },
    { value: "4.8", label: "Note moy.", icon: true },
  ]

  const settingsItems = [
    { icon: "🔔", label: "Notifications", hasToggle: true },
    { icon: "🌍", label: "Langue", value: "Francais" },
    { icon: "❓", label: "Aide & Support" },
    { icon: "🚪", label: "Se deconnecter", isLogout: true },
  ]

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Header */}
      <div className="pt-14 px-5">
        <h1
          className="font-serif text-xl text-center"
          style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Mon Profil
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-6 pb-4 overflow-y-auto">
        {/* Profile Card */}
        <div
          className="rounded-2xl p-4 mb-4 flex items-center gap-4"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg"
            style={{ backgroundColor: colors.gold, color: colors.obsidian }}
          >
            MA
          </div>
          <div className="flex-1">
            <p className="font-bold" style={{ color: colors.cream }}>
              Mohammed A.
            </p>
            <p className="text-sm" style={{ color: colors.muted }}>
              +212 6XX XXX XXX
            </p>
          </div>
          <span className="text-sm underline" style={{ color: colors.gold }}>
            Modifier le profil
          </span>
        </div>

        {/* Loyalty Card */}
        <div
          className="rounded-2xl p-4 mb-4 relative overflow-hidden"
          style={{
            backgroundColor: colors.charcoal,
            border: `2px solid ${colors.gold}`,
          }}
        >
          {/* Moroccan Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[0, 25, 50, 75].map((y) =>
                [0, 25, 50, 75].map((x) => (
                  <path
                    key={`${x}-${y}`}
                    d="M12.5 0 L25 12.5 L12.5 25 L0 12.5 Z"
                    transform={`translate(${x}, ${y})`}
                    stroke={colors.gold}
                    strokeWidth="0.5"
                    fill="none"
                  />
                ))
              )}
            </svg>
          </div>

          {/* Card Header */}
          <div className="flex items-center justify-between mb-4 relative">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: colors.gold }}
            >
              ChefPoint Card
            </span>
            <span className="text-lg">🥗</span>
          </div>

          {/* Stamps Row */}
          <div className="flex items-center justify-center gap-3 mb-3 relative">
            {[1, 2, 3, 4, 5].map((stamp) => (
              <div
                key={stamp}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: stamp <= 3 ? colors.gold : "transparent",
                  border: stamp <= 3 ? "none" : `2px dashed ${colors.gold}`,
                }}
              >
                {stamp <= 3 && <Check size={18} style={{ color: colors.obsidian }} />}
              </div>
            ))}
          </div>

          {/* Stamps Text */}
          <p className="text-xs text-center mb-3 relative" style={{ color: colors.muted }}>
            3 / 5 tampons - 2 restants pour un bowl offert
          </p>

          {/* Separator */}
          <div className="h-px mb-2 relative" style={{ backgroundColor: `${colors.gold}40` }} />

          {/* Valid Text */}
          <p className="text-[10px] text-center relative" style={{ color: colors.muted }}>
            Valable chez Chicken Bowl
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex gap-2 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex-1 rounded-2xl p-3 text-center"
              style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
            >
              <p className="font-bold text-lg flex items-center justify-center gap-1" style={{ color: colors.gold }}>
                {stat.value}
                {stat.icon && <Star size={14} fill={colors.gold} style={{ color: colors.gold }} />}
              </p>
              <p className="text-[10px]" style={{ color: colors.muted }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Addresses Section */}
        <div className="mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: colors.muted }}
          >
            Mes adresses
          </p>
          <div
            className="rounded-2xl p-4 flex items-center gap-3 mb-2"
            style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
          >
            <MapPin size={18} style={{ color: colors.gold }} />
            <span className="flex-1 text-sm" style={{ color: colors.cream }}>
              Bab el Had, Rabat
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#22c55e20", color: "#22c55e" }}
            >
              Par defaut
            </span>
            <ChevronRight size={16} style={{ color: colors.muted }} />
          </div>
          <p className="text-sm" style={{ color: colors.gold }}>
            + Ajouter une adresse
          </p>
        </div>

        {/* Settings List */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          {settingsItems.map((item, index) => (
            <div key={index}>
              <div className="px-4 py-3 flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span
                  className="flex-1 text-sm"
                  style={{ color: item.isLogout ? "#ef4444" : colors.cream }}
                >
                  {item.label}
                </span>
                {item.hasToggle ? (
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="w-12 h-6 rounded-full p-1 transition-all duration-200"
                    style={{
                      backgroundColor: notificationsEnabled ? colors.gold : colors.muted,
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: colors.obsidian,
                        transform: notificationsEnabled ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </button>
                ) : item.value ? (
                  <>
                    <span className="text-sm" style={{ color: colors.muted }}>
                      {item.value}
                    </span>
                    <ChevronRight size={16} style={{ color: colors.muted }} />
                  </>
                ) : !item.isLogout ? (
                  <ChevronRight size={16} style={{ color: colors.muted }} />
                ) : null}
              </div>
              {index < settingsItems.length - 1 && (
                <div className="h-px mx-4" style={{ backgroundColor: colors.border }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="h-20 px-8 flex items-center justify-between"
        style={{ backgroundColor: colors.charcoal, borderTop: `1px solid ${colors.border}` }}
      >
        <button className="flex flex-col items-center gap-1">
          <Home size={22} style={{ color: colors.muted }} />
          <span className="text-[10px]" style={{ color: colors.muted }}>
            Accueil
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Search size={22} style={{ color: colors.muted }} />
          <span className="text-[10px]" style={{ color: colors.muted }}>
            Recherche
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 relative">
          <ShoppingCart size={22} style={{ color: colors.muted }} />
          <span className="text-[10px]" style={{ color: colors.muted }}>
            Panier
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <User size={22} style={{ color: colors.gold }} />
          <span className="text-[10px]" style={{ color: colors.gold }}>
            Profil
          </span>
        </button>
      </div>
    </div>
  )
}

function NotifsScreen() {
  const [activeFilter, setActiveFilter] = useState<"tout" | "commandes" | "offres">("tout")

  const filters = [
    { id: "tout", label: "Tout" },
    { id: "commandes", label: "Commandes" },
    { id: "offres", label: "Offres" },
  ] as const

  const notifications = [
    {
      id: 1,
      icon: "🛵",
      title: "Commande livree !",
      description: "Votre commande #01042 a ete livree",
      time: "Il y a 2h",
      unread: true,
      type: "commandes",
      group: "Aujourd'hui",
    },
    {
      id: 2,
      icon: "🎁",
      title: "Offre speciale",
      description: "-10 DH sur votre prochain bowl ce weekend",
      time: "Il y a 4h",
      unread: true,
      type: "offres",
      group: "Aujourd'hui",
    },
    {
      id: 3,
      icon: "⭐",
      title: "Tampon gagne !",
      description: "3/5 tampons - encore 2 pour un bowl gratuit !",
      time: "Il y a 6h",
      unread: true,
      type: "commandes",
      group: "Aujourd'hui",
    },
    {
      id: 4,
      icon: "🛵",
      title: "Commande en route",
      description: "Karim A. est en chemin",
      time: "Hier 19:45",
      unread: false,
      type: "commandes",
      group: "Hier",
    },
    {
      id: 5,
      icon: "🥗",
      title: "Nouvelle marque bientot !",
      description: "Pasa Wrap arrive en Mai 2026",
      time: "Hier 10:00",
      unread: false,
      type: "commandes",
      group: "Hier",
    },
  ]

  const filteredNotifications = notifications.filter(
    (n) => activeFilter === "tout" || n.type === activeFilter
  )

  const groupedNotifications = filteredNotifications.reduce(
    (acc, n) => {
      if (!acc[n.group]) acc[n.group] = []
      acc[n.group].push(n)
      return acc
    },
    {} as Record<string, typeof notifications>
  )

  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: colors.obsidian }}>
      {/* Header */}
      <div className="pt-14 px-5 flex items-center justify-between">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.charcoal, border: `1px solid ${colors.border}` }}
        >
          <ArrowLeft size={20} style={{ color: colors.cream }} />
        </button>
        <h1
          className="font-serif text-xl"
          style={{ color: colors.cream, fontFamily: "Playfair Display, Georgia, serif" }}
        >
          Notifications
        </h1>
        <span className="text-sm" style={{ color: colors.gold }}>
          Tout lire
        </span>
      </div>

      {/* Filter Pills */}
      <div className="px-5 pt-5 flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className="px-4 py-2 rounded-full text-sm transition-all"
            style={{
              backgroundColor: activeFilter === filter.id ? colors.gold : colors.charcoal,
              color: activeFilter === filter.id ? colors.obsidian : colors.muted,
              border: activeFilter === filter.id ? "none" : `1px solid ${colors.border}`,
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex-1 px-5 pt-5 pb-4 overflow-y-auto">
        {activeFilter === "offres" && filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${colors.gold}20` }}
            >
              <span className="text-3xl">🎁</span>
            </div>
            <p style={{ color: colors.muted }}>Aucune offre pour le moment</p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([group, items]) => (
            <div key={group}>
              {/* Group Label */}
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: colors.muted }}
              >
                {group}
              </p>

              {/* Notification Items */}
              <div className="flex flex-col gap-3 mb-5">
                {items.map((notif) => (
                  <div
                    key={notif.id}
                    className="rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden"
                    style={{
                      backgroundColor: colors.charcoal,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {/* Unread Indicator */}
                    {notif.unread && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: colors.gold }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${colors.gold}20` }}
                    >
                      <span className="text-lg">{notif.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-1" style={{ color: colors.cream }}>
                        {notif.title}
                      </p>
                      <p className="text-xs mb-1" style={{ color: colors.muted }}>
                        {notif.description}
                      </p>
                      <p className="text-[10px]" style={{ color: colors.muted }}>
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
