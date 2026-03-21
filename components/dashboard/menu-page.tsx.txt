"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Pencil, ChevronDown, Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Product = Database['public']['Tables']['products']['Row']
type Brand = Database['public']['Tables']['brands']['Row']
type Category = "bowls" | "boissons" | "extras"

export function MenuPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>("bowls")
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    if (activeBrand) fetchProducts(activeBrand.id)
  }, [activeBrand])

  const fetchBrands = async () => {
    const { data } = await supabase
      .from('brands')
      .select('*')
      .order('created_at')

    if (data && data.length > 0) {
      setBrands(data)
      setActiveBrand(data[0])
    }
    setLoading(false)
  }

  const fetchProducts = async (brandId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brandId)
      .order('category')
      .order('name')

    if (data) setProducts(data)
  }

  const toggleAvailability = async (productId: string, currentValue: boolean) => {
    setToggling(productId)
    // Optimistic update
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, available: !currentValue } : p
    ))
    const { error } = await supabase
      .from('products')
      .update({ available: !currentValue })
      .eq('id', productId)

    if (error) {
      // Revert on error
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, available: currentValue } : p
      ))
    }
    setToggling(null)
  }

  const categories: { id: Category; label: string }[] = [
    { id: "bowls", label: "Bowls" },
    { id: "boissons", label: "Boissons" },
    { id: "extras", label: "Extras" },
  ]

  const filteredProducts = products.filter(p => p.category === activeCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-[#C9A84C]">Gestion du Menu</h1>

        {/* Brand Selector */}
        <div className="relative">
          <button
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex items-center gap-3 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] px-4 py-2.5 rounded-lg hover:border-[#C9A84C] transition-colors"
          >
            <span className="text-xl">{activeBrand?.emoji}</span>
            <span className="text-[#C9A84C] font-medium">{activeBrand?.name}</span>
            <ChevronDown className={cn(
              "w-4 h-4 text-[#A89968] transition-transform",
              brandDropdownOpen && "rotate-180"
            )} />
          </button>

          {brandDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-full bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg overflow-hidden z-10">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => { setActiveBrand(brand); setBrandDropdownOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(201,168,76,0.1)] transition-colors"
                >
                  <span className="text-xl">{brand.emoji}</span>
                  <span className="text-[#F5EDD8]">{brand.name}</span>
                  {brand.status === 'coming_soon' && (
                    <span className="ml-auto text-xs text-[#A89968] bg-[rgba(201,168,76,0.1)] px-2 py-0.5 rounded">Bientôt</span>
                  )}
                </button>
              ))}
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
              "px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wide transition-all",
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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-[#A89968]">
            <p>Aucun produit dans cette catégorie</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 hover:border-[rgba(201,168,76,0.3)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[rgba(201,168,76,0.15)] rounded-full flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                  {product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#F5EDD8] font-bold text-base md:text-lg">{product.name}</h3>
                  <p className="text-[#A89968] text-xs md:text-sm truncate">{product.description}</p>
                </div>
                <button
                  onClick={() => toggleAvailability(product.id, product.available)}
                  disabled={toggling === product.id}
                  className={cn(
                    "w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors relative flex-shrink-0",
                    product.available ? "bg-[#C9A84C]" : "bg-[#333]",
                    toggling === product.id && "opacity-50"
                  )}
                >
                  {toggling === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin absolute inset-0 m-auto text-white" />
                  ) : (
                    <span
                      className={cn(
                        "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow",
                        product.available ? "left-6 md:left-8" : "left-0.5 md:left-1"
                      )}
                    />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(201,168,76,0.08)]">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#C9A84C] text-lg font-bold">{product.price} DH</span>
                  {product.weight_grams && (
                    <span className="text-[#A89968] text-sm">{product.weight_grams}g</span>
                  )}
                  {!product.available && (
                    <span className="text-[#E84A5F] text-xs font-bold uppercase bg-[#E84A5F]/20 px-2 py-0.5 rounded">
                      Rupture de stock
                    </span>
                  )}
                </div>
                <button className="p-2 bg-[rgba(201,168,76,0.15)] text-[#C9A84C] rounded-lg hover:bg-[rgba(201,168,76,0.25)] transition-colors flex-shrink-0">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product */}
      <button className="w-full py-4 border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-xl text-[#C9A84C] font-medium flex items-center justify-center gap-2 hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.05)] transition-all">
        <Plus className="w-5 h-5" />
        <span>Ajouter un produit</span>
      </button>
    </div>
  )
}
