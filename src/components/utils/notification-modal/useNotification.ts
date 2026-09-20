import { useState } from 'react'
import type { NotificationType } from '@/components/utils/notification-modal/Modal'

interface NotificationState {
  isOpen: boolean
  message: string
  title?: string
  type: NotificationType
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    title: undefined,
    type: 'info',
  })

  const notify = (
    message: string,
    type: NotificationType = 'info',
    title?: string
  ) => {
    setNotification({
      isOpen: true,
      message,
      type,
      title,
    })
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }))
  }

  return {
    notification,
    notify,
    closeNotification,
  }
}
