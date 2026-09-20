import { useState, useEffect } from 'react'
import ProductCard from '@/components/inventory/ProductCard'
import type { Product } from '@/types/Product.interface'
import ProductMovementPopUp from '@/components/inventory/ProductMovementPopUp'
import ActionButtons from '@/components/inventory/actionButtons/actionButtons'

export default function InventoryManager({ userId }: { userId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  function handleSelectedProduct(newProduct: Product | null) {
    setSelectedProduct(newProduct)
  }

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    )
  }

  async function fetchProducts() {
    setLoading(true)
    try {
      const response = await fetch('/api/products/getAllProducts')
      if (!response.ok)
        throw new Error('Fallo al obtener los productos del servidor')

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error cargando inventario:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="font-mono text-black">
      <div className="mb-10 flex gap-4">
        <div className="relative flex w-full items-center md:w-1/2">
          <input
            type="text"
            placeholder="BUSCAR COMPONENTES (EJ: ESP32, SENSOR...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-4 border-black bg-white p-4 text-sm font-black uppercase placeholder-slate-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          />
        </div>
        <div id='options-container' className='hidden md:flex md:w-1/2'>
          <ActionButtons />
        </div>
      </div>

      {loading ? (
        <div className="border-4 border-black bg-yellow-300 p-6 text-center font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          CARGANDO INVENTARIO...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full border-4 border-black bg-white p-6 text-center font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              NO SE ENCONTRARON COMPONENTES.
            </div>
          ) : (
            filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onProductSelected={handleSelectedProduct}
                onProductUpdated={handleProductUpdated}
              />
            ))
          )}
        </div>
      )}

      {selectedProduct && (
        <ProductMovementPopUp
          product={selectedProduct}
          userId={userId}
          onProductSelected={handleSelectedProduct}
          fetchProducts={fetchProducts}
        />
      )}
    </div>
  )
}
