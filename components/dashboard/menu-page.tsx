"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Pencil, ChevronDown, Plus } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  emoji: string
  price: number
  weight: string
  available: boolean
  category: "bowls" | "boissons" | "extras"
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Classic Bowl",
    description: "Poulet grillé, riz, légumes frais, sauce signature",
    emoji: "🥗",
    price: 65,
    weight: "580g",
    available: true,
    category: "bowls"
  },
  {
    id: "2",
    name: "Spicy Bowl",
    description: "Poulet épicé, riz au safran, piments, sauce piquante",
    emoji: "🌶️",
    price: 70,
    weight: "580g",
    available: true,
    category: "bowls"
  },
  {
    id: "3",
    name: "Veggie Bowl",
    description: "Légumes grillés, quinoa, avocat, sauce tahini",
    emoji: "🥬",
    price: 55,
    weight: "520g",
    available: false,
    category: "bowls"
  },
  {
    id: "4",
    name: "Premium Bowl",
    description: "Double portion poulet, légumes premium, sauce spéciale",
    emoji: "👑",
    price: 95,
    weight: "750g",
    available: true,
    category: "bowls"
  }
]

type Category = "bowls" | "boissons" | "extras"

export function MenuPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [activeCategory, setActiveCategory] = useState<Category>("bowls")
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)

  const categories: { id: Category; label: string }[] = [
    { id: "bowls", label: "Bowls" },
    { id: "boissons", label: "Boissons" },
    { id: "extras", label: "Extras" }
  ]

  const toggleAvailability = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, available: !product.available }
        : product
    ))
  }

  const filteredProducts = products.filter(p => p.category === activeCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[#C9A84C]">Gestion du Menu</h1>
        
        {/* Brand Selector */}
        <div className="relative">
          <button 
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex items-center gap-3 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] px-4 py-2.5 rounded-lg hover:border-[#C9A84C] transition-colors"
          >
            <span className="text-xl">🥗</span>
            <span className="text-[#C9A84C] font-medium">Chicken Bowl</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-[#A89968] transition-transform",
              brandDropdownOpen && "rotate-180"
            )} />
          </button>
          
          {brandDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg overflow-hidden z-10">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(201,168,76,0.1)] transition-colors">
                <span className="text-xl">🥗</span>
                <span className="text-[#F5EDD8]">Chicken Bowl</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(201,168,76,0.1)] transition-colors">
                <span className="text-xl">🍔</span>
                <span className="text-[#F5EDD8]">Burger House</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 bg-[#1A160E] p-1 rounded-lg w-fit">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wide transition-all",
              activeCategory === category.id
                ? "bg-[#C9A84C] text-[#0E0C08]"
                : "text-[#A89968] hover:text-[#F5EDD8]"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 flex items-center gap-4 hover:border-[rgba(201,168,76,0.3)] transition-colors"
          >
            {/* Emoji Avatar */}
            <div className="w-16 h-16 bg-[rgba(201,168,76,0.15)] rounded-full flex items-center justify-center text-3xl flex-shrink-0">
              {product.emoji}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[#F5EDD8] font-bold text-lg">{product.name}</h3>
              <p className="text-[#A89968] text-sm truncate">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-[#C9A84C] text-xl font-bold">{product.price} DH</span>
              <button className="p-1.5 text-[#A89968] hover:text-[#C9A84C] transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {/* Weight */}
            <span className="text-[#A89968] text-sm w-16 text-center">{product.weight}</span>

            {/* Availability Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleAvailability(product.id)}
                className={cn(
                  "w-14 h-7 rounded-full transition-colors relative",
                  product.available ? "bg-[#C9A84C]" : "bg-[#333]"
                )}
              >
                <span 
                  className={cn(
                    "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow",
                    product.available ? "left-8" : "left-1"
                  )}
                />
              </button>
              {!product.available && (
                <span className="text-[#E84A5F] text-xs font-bold uppercase bg-[#E84A5F]/20 px-2 py-1 rounded">
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Edit Button */}
            <button className="p-2.5 bg-[rgba(201,168,76,0.15)] text-[#C9A84C] rounded-lg hover:bg-[rgba(201,168,76,0.25)] transition-colors">
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Product Button */}
      <button className="w-full py-4 border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-xl text-[#C9A84C] font-medium flex items-center justify-center gap-2 hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.05)] transition-all">
        <Plus className="w-5 h-5" />
        <span>Ajouter un produit</span>
      </button>
    </div>
  )
}
