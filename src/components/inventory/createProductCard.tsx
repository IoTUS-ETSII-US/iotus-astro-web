import React, {
  useState,
  useEffect,
  type FormEventHandler,
  type ChangeEvent,
} from 'react'
import { $product } from '@/store/product'
import type { Product } from '@/types/Product.interface'
import { useStore } from '@nanostores/react'
import { X } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface Props {
  openCreateProductCard: (isOpen: boolean) => void
  onProductCreated?: (newProduct: Product) => void
}

export default function CreateProductCard({
  openCreateProductCard,
  onProductCreated,
}: Props) {
  const storeProduct = useStore($product)

  // Estado local para los campos del formulario
  const [formData, setFormData] = useState<Partial<Product>>({
    name: storeProduct?.name || '',
    category_id: storeProduct?.category_id || '',
    location: storeProduct?.location || '',
    part_number: storeProduct?.part_number || '',
    description: storeProduct?.description || '',
    available_stock: storeProduct?.available_stock ?? 0,
    total_stock: storeProduct?.total_stock ?? 0,
  })

  // Estado para la carga de categorías y envío
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Cargar categorías al montar el modal
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories/getAll')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (err) {
        console.error('Error cargando categorías:', err)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Manejador genérico de inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  // Envío del formulario
  const handleCreateSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el producto')
      }

      if (onProductCreated) onProductCreated($product.get())
      // Limpiar store global si aplica
      if ($product.set) {
        $product.set({} as Product)
      }

      openCreateProductCard(false)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al guardar producto'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-4 border-black bg-white font-mono text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Cabecera */}
        <header className="flex items-center justify-between border-b-4 border-black bg-yellow-300 p-4">
          <h2 className="text-lg font-black uppercase">CREAR COMPONENTE</h2>
          <button
            type="button"
            onClick={() => openCreateProductCard(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center border-2 border-black bg-red-500 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleCreateSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-black uppercase">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              placeholder="EJ: ESP 32"
              className="w-full border-2 border-black bg-white p-2 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase">
              Categoría
            </label>
            <select
              name="category_id"
              value={formData.category_id || ''}
              onChange={handleChange}
              disabled={loadingCategories}
              className="w-full cursor-pointer border-2 border-black bg-white p-2 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-200"
            >
              <option value="">
                {loadingCategories
                  ? 'CARGANDO CATEGORÍAS...'
                  : 'SELECCIONAR CATEGORÍA...'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-black uppercase">
                Ubicación
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="EJ: CAJA 2"
                className="w-full border-2 border-black bg-white p-2 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-black uppercase">
                Nº de Parte (opcional)
              </label>
              <input
                type="text"
                name="part_number"
                value={formData.part_number || ''}
                onChange={handleChange}
                placeholder=""
                className="w-full border-2 border-black bg-white p-2 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Especificaciones o datos adicionales..."
              className="w-full border-2 border-black bg-white p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-black uppercase">
                Stock Disponible
              </label>
              <input
                type="number"
                name="available_stock"
                min="0"
                value={formData.available_stock ?? 0}
                onChange={handleChange}
                className="w-full border-2 border-black bg-white p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-black uppercase">
                Stock Total
              </label>
              <input
                type="number"
                name="total_stock"
                min="0"
                value={formData.total_stock ?? 0}
                onChange={handleChange}
                className="w-full border-2 border-black bg-white p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              />
            </div>
          </div>

          {/* Banner de error si falla la API */}
          {errorMessage && (
            <div className="border-2 border-black bg-red-400 p-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer border-4 border-black bg-lime-300 py-3 text-sm font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-lime-400 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
