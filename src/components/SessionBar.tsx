import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { Circle, LogOut } from 'lucide-react'

export default function SessionBar() {
  const { sessionStart, setShowEndSession } = useStore()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionStart) setElapsed(Math.floor((Date.now() - sessionStart) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStart])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const display = h > 0
    ? `${h}h ${String(m).padStart(2, '0')}m`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return (
    <div className="animate-slide-down w-full bg-indigo-600/25 border-b border-indigo-400/30 px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Circle size={8} className="text-indigo-300 fill-indigo-300 animate-pulse" />
        <span className="text-sm font-medium text-indigo-100">Session en cours</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-white tabular-nums">{display}</span>
        <button
          onClick={() => setShowEndSession(true)}
          className="flex items-center gap-1.5 text-xs text-indigo-200/70 hover:text-white transition-colors"
        >
          <LogOut size={13} />
          Terminer
        </button>
      </div>
    </div>
  )
}