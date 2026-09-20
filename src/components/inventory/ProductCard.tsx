import { useState, useEffect } from 'react'
import type { Product } from '@/types/Product.interface'
import { Trash, SquarePen, X } from 'lucide-react'
import { useNotification } from '../utils/notification-modal/useNotification'
import NotificationModal from '../utils/notification-modal/Modal'

// Interfaz para la respuesta de /api/categories/getAll
interface Category {
  id: string
  name: string
  description?: string
}

interface ProductCardProps {
  product: Product
  onProductSelected: (product: Product) => void
  onProductUpdated?: (updatedProduct: Product) => void
}

export default function ProductCard({
  product,
  onProductSelected,
  onProductUpdated,
}: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Product>({ ...product })

  // Estado para almacenar y gestionar las categorías
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  // notificaciones
  const { notification, notify, closeNotification } = useNotification()

  // Cargar las categorías cuando se abre el modal de edición
  useEffect(() => {
    if (isEditing) {
      fetchCategories()
    }
  }, [isEditing])

  const fetchCategories = async () => {
    setLoadingCategories(true)
    try {
      const response = await fetch('/api/categories/getAll')
      if (!response.ok) {
        throw new Error('Error al obtener categorías')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error cargando categorías:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  // Manejador actualizado para soportar HTMLSelectElement
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/products/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el producto')
      }

      setIsEditing(false)

      // Notificamos al componente padre enviándole el producto actualizado
      if (onProductUpdated) {
        onProductUpdated(result.data || formData)
      }

      notify('Producto actualizado con éxito', 'success')
    } catch (error) {
      console.error('Error al actualizar:', error)
      notify(
        error instanceof Error
          ? error.message
          : 'Error al actualizar el producto',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <article className="flex flex-col justify-between border-4 border-black bg-white p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <div className="mb-3 flex justify-between border-b-4 border-black pb-2">
            <span className="self-center border-2 border-black bg-cyan-400 px-2 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {product.location || 'Sin ubicación'}
            </span>
            <div id="action-buttons" className="flex gap-2">
              <button
                id={`edit-${product.id}`}
                type="button"
                onClick={() => {
                  setFormData({ ...product })
                  setIsEditing(true)
                }}
                className="cursor-pointer border-2 border-black bg-blue-400 p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <SquarePen className="h-5 w-5" />
              </button>
              <button
                id={`remove-${product.id}`}
                type="button"
                className="cursor-pointer border-2 border-black bg-red-500 p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
          <h3 className="mb-4 text-xl font-black tracking-tight uppercase">
            {product.name}
          </h3>

          <div className="mb-4 flex gap-2">
            <div className="flex-1 border-2 border-black bg-lime-300 p-2 text-center text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="block font-bold">DISPONIBLE</span>
              <span className="text-xl font-black">
                {product.available_stock}
              </span>
            </div>
            <div className="flex-1 border-2 border-black bg-slate-200 p-2 text-center text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="block font-bold">TOTAL</span>
              <span className="text-xl font-black">{product.total_stock}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onProductSelected(product)}
          className="w-full cursor-pointer border-2 border-black bg-pink-400 py-2 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-pink-500 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          REGISTRAR MOVIMIENTO
        </button>
      </article>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-4 border-black bg-white font-mono text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <header className="flex justify-between border-b-4 border-black bg-yellow-300 p-4">
              <h2 className="text-lg font-black uppercase">
                EDITAR COMPONENTE
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center border-2 border-black bg-red-500 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <X />
              </button>
            </header>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 p-6">
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
                    className="w-full border-2 border-black bg-white p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase">
                    Nº de Parte
                  </label>
                  <input
                    type="text"
                    name="part_number"
                    value={formData.part_number || ''}
                    onChange={handleChange}
                    className="w-full border-2 border-black bg-white p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-black uppercase">
                  Descripción
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
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
                    value={formData.available_stock}
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
                    value={formData.total_stock}
                    onChange={handleChange}
                    className="w-full border-2 border-black bg-white p-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  />
                </div>
              </div>

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
      )}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  )
}
