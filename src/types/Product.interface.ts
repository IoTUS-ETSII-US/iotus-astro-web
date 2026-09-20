export interface Product {
  id: string
  name: string
  description: string
  part_number: string
  location: string
  total_stock: number
  available_stock: number
  category_id: string
  created_at?: string
  updated_at?: string
}
