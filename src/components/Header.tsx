import { Zap, RefreshCw, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import NotificationSettings from './NotificationSettings'

export default function Header() {
  const elan = useStore((s) => s.elan)
  const tasks = useStore((s) => s.tasks)
  const resetCheckIn = useStore((s) => s.resetCheckIn)
  const setUrgencyMode = useStore((s) => s.setUrgencyMode)
  const checkIn = useStore((s) => s.checkIn)
  const active = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)
  const today = new Date().toISOString().slice(0, 10)
  const hasCheckedInToday = checkIn?.date === today

  return (
    <header className="w-full py-8 border-b border-white/8 mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Élémentaire</h1>
          <p className="text-sm text-white/55 mt-1">Un pas. Puis le suivant.</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setUrgencyMode(true)}
            title="Mode Urgence"
            className="p-2 rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
          >
            <AlertTriangle size={16} />
          </button>
          {hasCheckedInToday && (
            <button
              onClick={resetCheckIn}
              title="Refaire le check-in"
              className="p-2 rounded-xl text-white/25 hover:text-white/55 hover:bg-white/8 transition-all"
            >
              <RefreshCw size={15} />
            </button>
          )}
          <NotificationSettings />
          <div className="flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-4 py-2 rounded-full">
            <Zap size={14} className="text-amber-400" />
            <span className="text-base font-bold text-amber-300 tabular-nums">{elan}</span>
            <span className="text-xs text-amber-200/60">élan</span>
          </div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="flex items-center gap-6 mt-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-white tabular-nums">{active.length}</p>
            <p className="text-xs text-white/45 mt-0.5">en cours</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400 tabular-nums">{done.length}</p>
            <p className="text-xs text-white/45 mt-0.5">terminées</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white/45 mb-1.5">
              <span>Progression</span>
              <span>{tasks.length > 0 ? Math.round((done.length / tasks.length) * 100) : 0}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${tasks.length > 0 ? (done.length / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}