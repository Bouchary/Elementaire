import { useStore } from '../store/useStore'
import { Zap, CheckCircle, Timer, Trophy } from 'lucide-react'

export default function StatsPage() {
  const { elan, history, sessionCount, tasks } = useStore()
  const totalDone = tasks.filter((t) => t.done).length
  const last14 = [...history].sort((a, b) => a.date.localeCompare(b.date)).slice(-14)
  const maxElan = Math.max(...last14.map((d) => d.elan), 1)
  const bestDay = [...history].sort((a, b) => b.elan - a.elan)[0]

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
  }

  return (
    <div className="w-full pb-10 animate-fade-up">

      <div className="w-full py-8 border-b border-white/8 mb-6">
        <h1 className="text-3xl font-semibold text-white">Statistiques</h1>
        <p className="text-sm text-white/55 mt-1">Ton élan au fil du temps.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-amber-500/10 border border-amber-400/25 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <span className="text-xs text-amber-300/70 font-medium uppercase tracking-wider">Élan total</span>
          </div>
          <p className="text-3xl font-bold text-amber-300 tabular-nums">{elan}</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-400/25 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-xs text-emerald-300/70 font-medium uppercase tracking-wider">Terminées</span>
          </div>
          <p className="text-3xl font-bold text-emerald-300 tabular-nums">{totalDone}</p>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-400/25 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-indigo-400" />
            <span className="text-xs text-indigo-300/70 font-medium uppercase tracking-wider">Sessions</span>
          </div>
          <p className="text-3xl font-bold text-indigo-300 tabular-nums">{sessionCount}</p>
        </div>

        <div className="bg-violet-500/10 border border-violet-400/25 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-violet-400" />
            <span className="text-xs text-violet-300/70 font-medium uppercase tracking-wider">Meilleur jour</span>
          </div>
          <p className="text-3xl font-bold text-violet-300 tabular-nums">
            {bestDay ? bestDay.elan : 0}
          </p>
          {bestDay && (
            <p className="text-xs text-violet-300/50">{formatDate(bestDay.date)}</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Élan — 14 derniers jours</h2>
          <span className="text-xs text-white/35">{last14.length} jours</span>
        </div>

        {last14.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/35 text-sm">Pas encore de données.</p>
            <p className="text-white/20 text-xs mt-1">Complete tes premières tâches pour voir ton élan.</p>
          </div>
        )}

        {last14.length > 0 && (
          <div className="flex items-end gap-1.5 h-32">
            {last14.map((day) => {
              const pct = Math.max((day.elan / maxElan) * 100, 4)
              const isToday = day.date === new Date().toISOString().slice(0, 10)
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex items-end" style={{ height: '100px' }}>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${isToday
                        ? 'bg-amber-400'
                        : 'bg-indigo-500/60 group-hover:bg-indigo-400/80'}`}
                      style={{ height: `${pct}%` }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white/10 text-white text-xs px-1.5 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {day.elan} élan
                    </div>
                  </div>
                  <span className={`text-[9px] transition-colors ${isToday ? 'text-amber-400 font-semibold' : 'text-white/25'}`}>
                    {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 2)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* History list */}
      {history.length > 0 && (
        <div className="bg-white/4 border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white">Historique</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[...history]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((day) => (
                <div key={day.date} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/70">{formatDate(day.date)}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">{day.tasksDone} tâche{day.tasksDone > 1 ? 's' : ''}</span>
                    <div className="flex items-center gap-1">
                      <Zap size={11} className="text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300 tabular-nums">{day.elan}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}