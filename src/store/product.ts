import type { Product } from '@/types/Product.interface'
import { persistentAtom } from '@nanostores/persistent'

export const $product = persistentAtom<Product>(
  'product',
  {} as Product,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
)


