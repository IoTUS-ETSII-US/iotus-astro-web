import { $product } from '@/store/product'
import { useStore } from '@nanostores/react'
import { Plus } from 'lucide-react'

interface Props {
  openCreateProductCard: (isOpen: boolean) => void
}

export default function ActionButtons({ openCreateProductCard }: Props) {
  return (
    <div id="buttons-container" className="flex w-full gap-4">
      <button
        type="button"
        onClick={() => {
          openCreateProductCard(true)
        }}
        className="cursor-pointer border-4 bg-green-500 px-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-green-400 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      >
        <Plus className="size-6" />
      </button>
    </div>
  )
}
