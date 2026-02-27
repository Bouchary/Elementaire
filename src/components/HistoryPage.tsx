import { useStore } from '../store/useStore'
import { CheckCircle, Calendar } from 'lucide-react'
import ElanBadge from './ElanBadge'

export default function HistoryPage() {
  const { tasks } = useStore()

  const done = tasks
    .filter((t) => t.done)
    .sort((a, b) => (b.completedAt ?? b.createdAt) - (a.completedAt ?? a.createdAt))

  const grouped = done.reduce<Record<string, typeof done>>((acc, task) => {
    const date = task.completedAt
      ? new Date(task.completedAt).toISOString().slice(0, 10)
      : new Date(task.createdAt).toISOString().slice(0, 10)
    if (!acc[date]) acc[date] = []
    acc[date].push(task)
    return acc
  }, {})

  const formatDate = (iso: string) => {
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (iso === today) return "Aujourd'hui"
    if (iso === yesterday) return 'Hier'
    return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <div className="w-full pb-10 animate-fade-up">
      <div className="w-full py-8 border-b border-white/8 mb-6">
        <h1 className="text-3xl font-semibold text-white">Historique</h1>
        <p className="text-sm text-white/55 mt-1">Ce que tu as accompli.</p>
      </div>

      {done.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
            <CheckCircle size={20} className="text-white/20" />
          </div>
          <p className="text-white/35 text-sm">Aucune tâche terminée pour l'instant.</p>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, dateTasks]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-white/25" />
              <span className="text-xs font-semibold text-white/35 uppercase tracking-widest">
                {formatDate(date)}
              </span>
              <span className="text-xs text-white/20">· {dateTasks.length}</span>
            </div>
            {dateTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/4 border border-white/8 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={10} className="text-emerald-400" />
                </div>
                <span className="text-sm text-white/55 line-through flex-1">{task.title}</span>
                <ElanBadge context={task.context} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}