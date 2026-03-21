"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Pencil, ChevronDown, Plus, Loader2, X, Check, Trash2, ImagePlus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Product = Database['public']['Tables']['products']['Row'] & { image_url?: string }
type Brand = Database['public']['Tables']['brands']['Row']
type Category = "bowls" | "boissons" | "extras"

const EMOJIS = ["🥗","🌶️","🥬","👑","🍔","🍕","🌯","🍰","🥤","💧","🍊","🥫","🍗","🥙","🧆"]

// Fotoğrafı 1080x1080 kare olarak kırpar ve sıkıştırır
async function resizeAndCrop(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const size = 1080
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas error'))
      // Merkez kırpma
      const srcSize = Math.min(img.width, img.height)
      const srcX = (img.width - srcSize) / 2
      const srcY = (img.height - srcSize) / 2
      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, size, size)
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Blob error'))
        resolve(new File([blob], 'photo.jpg', { type: 'image/jpeg', lastModified: Date.now() }))
      }, 'image/jpeg', 0.85)
    }
    img.onerror = reject
    img.src = url
  })
}

export function MenuPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>("bowls")
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const emptyForm = { name: "", description: "", emoji: "🥗", price: "", weight_grams: "", category: activeCategory as Category, available: true }
  const [form, setForm] = useState(emptyForm)

  const categories: { id: Category; label: string }[] = [
    { id: "bowls", label: "Bowls" },
    { id: "boissons", label: "Boissons" },
    { id: "extras", label: "Extras" },
  ]

  useEffect(() => { fetchBrands() }, [])
  useEffect(() => { if (activeBrand) fetchProducts(activeBrand.id) }, [activeBrand])

  const fetchBrands = async () => {
    const { data } = await supabase.from('brands').select('*').order('created_at')
    if (data && data.length > 0) { setBrands(data); setActiveBrand(data[0]) }
    setLoading(false)
  }

  const fetchProducts = async (brandId: string) => {
    const { data } = await supabase.from('products').select('*').eq('brand_id', brandId).order('category').order('name')
    if (data) setProducts(data)
  }

  const toggleAvailability = async (productId: string, currentValue: boolean) => {
    setToggling(productId)
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: !currentValue } : p))
    const { error } = await supabase.from('products').update({ available: !currentValue }).eq('id', productId)
    if (error) setProducts(prev => prev.map(p => p.id === productId ? { ...p, available: currentValue } : p))
    setToggling(null)
  }

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ ...emptyForm, category: activeCategory })
    setImagePreview(null)
    setImageFile(null)
    setShowAddModal(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description || "",
      emoji: product.emoji,
      price: product.price.toString(),
      weight_grams: product.weight_grams?.toString() || "",
      category: product.category as Category,
      available: product.available
    })
    setImagePreview(product.image_url || null)
    setImageFile(null)
    setShowAddModal(true)
  }

  // Fotoğraf seçilince 1080x1080 kırpma uygula
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const resized = await resizeAndCrop(file)
      setImageFile(resized)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(resized)
    } catch {
      // Hata olursa orijinal dosyayı kullan
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
    setUploadingImage(false)
  }

  const uploadImage = async (productId: string): Promise<string | null> => {
    if (!imageFile) return null
    const path = `products/${productId}.jpg`
    const { error } = await supabase.storage.from('menu-images').upload(path, imageFile, { upsert: true, contentType: 'image/jpeg' })
    if (error) return null
    const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
    return data.publicUrl
  }

  const saveProduct = async () => {
    if (!form.name || !form.price || !activeBrand) return
    setSaving(true)

    const payload: any = {
      name: form.name,
      description: form.description,
      emoji: form.emoji,
      price: parseFloat(form.price),
      weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
      category: form.category,
      available: form.available,
      brand_id: activeBrand.id
    }

    if (editingProduct) {
      const { data } = await supabase.from('products').update(payload).eq('id', editingProduct.id).select().single()
      if (data) {
        if (imageFile) {
          const url = await uploadImage(data.id)
          if (url) {
            await supabase.from('products').update({ image_url: url } as any).eq('id', data.id)
            data.image_url = url
          }
        }
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p))
      }
    } else {
      const { data } = await supabase.from('products').insert(payload).select().single()
      if (data) {
        if (imageFile) {
          const url = await uploadImage(data.id)
          if (url) {
            await supabase.from('products').update({ image_url: url } as any).eq('id', data.id)
            data.image_url = url
          }
        }
        setProducts(prev => [...prev, data])
      }
    }

    setSaving(false)
    setShowAddModal(false)
  }

  const deleteProduct = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    await supabase.from('products').delete().eq('id', confirmDelete.id)
    setProducts(prev => prev.filter(p => p.id !== confirmDelete.id))
    setDeleting(false)
    setConfirmDelete(null)
  }

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
        <div className="relative">
          <button onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            className="flex items-center gap-3 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] px-4 py-2.5 rounded-lg hover:border-[#C9A84C] transition-colors">
            <span className="text-xl">{activeBrand?.emoji}</span>
            <span className="text-[#C9A84C] font-medium">{activeBrand?.name}</span>
            <ChevronDown className={cn("w-4 h-4 text-[#A89968] transition-transform", brandDropdownOpen && "rotate-180")} />
          </button>
          {brandDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-lg overflow-hidden z-10">
              {brands.map((brand) => (
                <button key={brand.id} onClick={() => { setActiveBrand(brand); setBrandDropdownOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[rgba(201,168,76,0.1)] transition-colors">
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
          <button key={category.id} onClick={() => setActiveCategory(category.id)}
            className={cn("px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wide transition-all",
              activeCategory === category.id ? "bg-[#C9A84C] text-[#0E0C08]" : "text-[#A89968] hover:text-[#F5EDD8]")}>
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
            <div key={product.id} className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-xl p-4 hover:border-[rgba(201,168,76,0.3)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center text-2xl md:text-3xl">
                      {product.emoji}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#F5EDD8] font-bold text-base md:text-lg">{product.name}</h3>
                  <p className="text-[#A89968] text-xs md:text-sm truncate">{product.description}</p>
                </div>
                <button onClick={() => toggleAvailability(product.id, product.available)} disabled={toggling === product.id}
                  className={cn("w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors relative flex-shrink-0",
                    product.available ? "bg-[#C9A84C]" : "bg-[#333]", toggling === product.id && "opacity-50")}>
                  {toggling === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin absolute inset-0 m-auto text-white" />
                  ) : (
                    <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow",
                      product.available ? "left-6 md:left-8" : "left-0.5 md:left-1")} />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(201,168,76,0.08)]">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[#C9A84C] text-lg font-bold">{product.price} DH</span>
                  {product.weight_grams && <span className="text-[#A89968] text-sm">{product.weight_grams}g</span>}
                  {!product.available && (
                    <span className="text-[#E84A5F] text-xs font-bold uppercase bg-[#E84A5F]/20 px-2 py-0.5 rounded">Rupture de stock</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setConfirmDelete(product)}
                    className="p-2 bg-[rgba(232,74,95,0.15)] text-[#E84A5F] rounded-lg hover:bg-[rgba(232,74,95,0.25)] transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEdit(product)}
                    className="p-2 bg-[rgba(201,168,76,0.15)] text-[#C9A84C] rounded-lg hover:bg-[rgba(201,168,76,0.25)] transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Button */}
      <button onClick={openAdd}
        className="w-full py-4 border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-xl text-[#C9A84C] font-medium flex items-center justify-center gap-2 hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.05)] transition-all">
        <Plus className="w-5 h-5" />
        <span>Ajouter un produit</span>
      </button>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A160E] border border-[rgba(201,168,76,0.15)] rounded-2xl w-full max-w-md space-y-5 p-6 my-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#C9A84C]">
                {editingProduct ? "Modifier le produit" : "Nouveau produit"}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#A89968] hover:text-[#F5EDD8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">
                Photo <span className="normal-case text-[#6B5B3D]">(auto 1080×1080)</span>
              </label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-[rgba(201,168,76,0.3)] rounded-xl overflow-hidden hover:border-[#C9A84C] transition-colors relative">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-[#A89968]">
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-sm">Ajouter une photo</span>
                    <span className="text-xs text-[#6B5B3D]">Sera recadrée en carré 1080×1080</span>
                  </div>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
                    <span className="text-[#C9A84C] text-xs">Recadrage en cours...</span>
                  </div>
                )}
              </button>
              {imagePreview && (
                <button onClick={() => { setImagePreview(null); setImageFile(null) }}
                  className="mt-2 text-[#E84A5F] text-xs flex items-center gap-1 hover:underline">
                  <X className="w-3 h-3" /> Supprimer la photo
                </button>
              )}
            </div>

            {/* Emoji Picker */}
            <div>
              <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Emoji (si pas de photo)</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    className={cn("w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all",
                      form.emoji === e ? "bg-[#C9A84C]" : "bg-[#0E0C08] hover:bg-[rgba(201,168,76,0.2)]")}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Nom *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Classic Bowl"
                className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-4 py-3 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C]" />
            </div>

            {/* Description */}
            <div>
              <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Poulet grillé, riz, légumes..."
                className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-4 py-3 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C]" />
            </div>

            {/* Price + Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Prix (DH) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="65"
                  className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-4 py-3 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Poids (g)</label>
                <input type="number" value={form.weight_grams} onChange={e => setForm(f => ({ ...f, weight_grams: e.target.value }))}
                  placeholder="580"
                  className="w-full bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] rounded-lg px-4 py-3 text-[#F5EDD8] placeholder-[#A89968] focus:outline-none focus:border-[#C9A84C]" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[#A89968] text-xs uppercase tracking-wide mb-2 block">Catégorie</label>
              <div className="flex gap-2">
                {categories.map(c => (
                  <button key={c.id} onClick={() => setForm(f => ({ ...f, category: c.id }))}
                    className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      form.category === c.id ? "bg-[#C9A84C] text-[#0E0C08]" : "bg-[#0E0C08] text-[#A89968] hover:text-[#F5EDD8]")}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button onClick={saveProduct} disabled={saving || !form.name || !form.price}
              className="w-full py-3 bg-[#C9A84C] text-[#0E0C08] font-bold rounded-xl hover:bg-[#B8973B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {saving ? "Enregistrement..." : editingProduct ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A160E] border border-[rgba(232,74,95,0.3)] rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#E84A5F]">Supprimer le produit ?</h2>
            <p className="text-[#A89968]">
              <span className="text-[#F5EDD8] font-medium">{confirmDelete.name}</span> sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 bg-[#0E0C08] border border-[rgba(201,168,76,0.15)] text-[#A89968] rounded-xl hover:text-[#F5EDD8] transition-colors">
                Annuler
              </button>
              <button onClick={deleteProduct} disabled={deleting}
                className="flex-1 py-3 bg-[#E84A5F] text-white font-bold rounded-xl hover:bg-[#D03A4F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
