import { useEffect } from 'react'
import { useStore } from '../store/useStore'

export function useCheckInNotification() {
  const { notifEnabled, checkInTime, checkIn } = useStore()

  useEffect(() => {
    if (!notifEnabled) return
    if (Notification.permission !== 'granted') return

    const schedule = () => {
      const now = new Date()
      const [h, m] = checkInTime.split(':').map(Number)
      const target = new Date()
      target.setHours(h, m, 0, 0)

      if (target <= now) target.setDate(target.getDate() + 1)

      const delay = target.getTime() - now.getTime()
      const today = new Date().toISOString().slice(0, 10)
      const alreadyDone = checkIn?.date === today

      if (alreadyDone) return

      const timeout = setTimeout(() => {
        new Notification('Élémentaire', {
          body: 'Bonjour — qu\'est-ce que tu veux accomplir aujourd\'hui ?',
          icon: '/icon.svg',
          silent: false,
        })
        schedule()
      }, delay)

      return () => clearTimeout(timeout)
    }

    return schedule()
  }, [notifEnabled, checkInTime, checkIn])
}