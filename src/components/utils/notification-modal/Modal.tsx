import React from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  type?: NotificationType
  buttonText?: string
}

const typeStyles: Record<
  NotificationType,
  { bgHeader: string; icon: React.ReactNode; defaultTitle: string }
> = {
  success: {
    bgHeader: 'bg-lime-300',
    icon: <CheckCircle2 className="h-6 w-6 text-black" />,
    defaultTitle: 'ÉXITO',
  },
  error: {
    bgHeader: 'bg-red-500',
    icon: <AlertCircle className="h-6 w-6 text-white" />,
    defaultTitle: 'ERROR',
  },
  warning: {
    bgHeader: 'bg-yellow-300',
    icon: <AlertTriangle className="h-6 w-6 text-black" />,
    defaultTitle: 'ADVERTENCIA',
  },
  info: {
    bgHeader: 'bg-cyan-400',
    icon: <Info className="h-6 w-6 text-black" />,
    defaultTitle: 'INFORMACIÓN',
  },
}

export default function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'ENTENDIDO',
}: NotificationModalProps) {
  if (!isOpen) return null

  const config = typeStyles[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      {/* Overlay para cerrar al hacer clic fuera */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* CContenedor del Modal */}
      <div className="relative z-10 w-full max-w-md border-4 border-black bg-white font-mono text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        {/* Cabecera dinámica según el tipo */}
        <header
          className={`flex items-center justify-between border-b-4 border-black p-4 ${config.bgHeader}`}
        >
          <div className="flex items-center gap-2">
            {config.icon}
            <h3 className="text-base font-black tracking-wider text-black uppercase">
              {title || config.defaultTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1"
          >
            <X className="h-4 w-4 stroke-[3]" />
          </button>
        </header>

        {/* Cuerpo del Mensaje */}
        <div className="p-6">
          <p className="text-sm leading-relaxed font-bold break-words uppercase">
            {message}
          </p>
        </div>

        {/* Botón de Acción Principal */}
        <footer className="border-t-4 border-black p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer border-3 border-black bg-black py-2.5 text-center text-sm font-black text-white uppercase shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] transition-all hover:bg-yellow-300 hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {buttonText} ➔
          </button>
        </footer>
      </div>
    </div>
  )
}
