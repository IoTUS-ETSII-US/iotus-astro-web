import { Plus } from 'lucide-react'

/**
 *  Este componente contiene los botones de accion para CRUD de componentes
 */

export default function ActionButtons() {

  function createNewProduct () {
    
  }

  return (
    <div id="buttons-container" className="flex w-full gap-4">
      <button
        type="button"
        onClick={createNewProduct}
        className="cursor-pointer border-4 hover:bg-green-400 bg-green-500 px-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
      >
        <Plus className='size-6'/>
      </button>
    </div>
  )
}
