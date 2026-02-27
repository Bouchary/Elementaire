import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function useNotifications() {
  const { tasks, notifEnabled, notifDelay } = useStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const schedule = () => {
    if (!notifEnabled) return
    if (Notification.permission !== 'granted') return

    const activeTasks = tasks.filter((t) => !t.done)
    if (activeTasks.length === 0) return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      new Notification('Élémentaire', {
        body: `Tu as ${activeTasks.length} tâche${activeTasks.length > 1 ? 's' : ''} en cours. Un pas suffit.`,
        icon: '/favicon.ico',
        silent: false,
      })
      schedule()
    }, notifDelay * 60 * 1000)
  }

  useEffect(() => {
    schedule()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [notifEnabled, notifDelay, tasks])
}