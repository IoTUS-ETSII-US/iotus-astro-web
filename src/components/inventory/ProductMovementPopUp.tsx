import { X } from 'lucide-react'
import type { Product } from '@/types/Product.interface'
import { useState } from 'react'

interface Props {
  userId: string
  product: Product
  onProductSelected: (product: Product | null) => void
  fetchProducts: () => void
}

export default function ProductMovementPopUp({
  userId,
  product,
  onProductSelected,
  fetchProducts
}: Props) {
  const [movementType, setMovementType] = useState<
    'loan' | 'return' | 'restock'
  >('loan')
  const [quantity, setQuantity] = useState(1)

  // para pedir un prestamo
  async function handleMovement(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return

    try {
      const response = await fetch('/api/products/movement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          userId: userId,
          type: movementType,
          quantity: quantity,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar la solicitud')
      }

      onProductSelected(null)
      setQuantity(1)
      fetchProducts()
      alert('Movimiento registrado con éxito')
    } catch (error) {
      console.error('Error al registrar movimiento:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Hubo un error al registrar el movimiento'
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <header className="flex justify-between border-b-4 border-black bg-yellow-300 p-4">
          <h2 className="text-lg font-black uppercase">
            GESTIÓN: {product.name}
          </h2>
          <button
            onClick={() => onProductSelected(null)}
            className="h-8 w-8 border-2 border-black bg-red-500 font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <X />
          </button>
        </header>

        <form onSubmit={handleMovement} className="p-6">
          <label className="mb-2 block text-xs font-black uppercase">
            TIPO DE MOVIMIENTO
          </label>
          <select
            value={movementType}
            onChange={(e) => setMovementType(e.target.value as any)}
            className="mb-6 w-full cursor-pointer border-4 border-black p-2 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          >
            <option value="loan">PRESTAR (-)</option>
            <option value="return">DEVOLVER (+)</option>
            <option value="restock">NUEVO STOCK (+)</option>
          </select>

          <label className="mb-2 block text-xs font-black uppercase">
            CANTIDAD
          </label>
          <input
            type="number"
            min="1"
            max={
              movementType === 'loan'
                ? product.available_stock
                : undefined
            }
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mb-8 w-full border-4 border-black p-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          />

          <button
            type="submit"
            disabled={
              movementType === 'loan' &&
              quantity > product.available_stock
            }
            className="w-full cursor-pointer border-4 border-black bg-lime-300 py-3 text-sm font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-lime-400 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            CONFIRMAR ACCIÓN
          </button>
        </form>
      </div>
    </div>
  )
}
