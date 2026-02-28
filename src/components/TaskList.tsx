import { useStore } from '../store/useStore'
import TaskCard from './TaskCard'
import { RotateCcw, Sparkles, AlertTriangle } from 'lucide-react'
import type { Task } from '../types'

type Props = {
  onTaskChange?: (task: Task) => void
  onTaskDelete?: (id: string) => void
}

export default function TaskList({ onTaskChange, onTaskDelete }: Props) {
  const { tasks, resetAll } = useStore()
  const today = new Date().toISOString().slice(0, 10)

  const active = tasks.filter((t) => !t.done)
  const overdue = active.filter((t) => t.dueDate && t.dueDate < today)
  const current = active.filter((t) => !t.dueDate || t.dueDate >= today)

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={12} className="text-rose-400" />
            <p className="text-xs font-semibold text-rose-400/80 uppercase tracking-widest">
              En retard · {overdue.length}
            </p>
          </div>
          {overdue.map((t, i) => (
            <div key={t.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <TaskCard
                task={t}
                isFirst={i === 0}
                isLast={i === overdue.length - 1}
                totalActive={overdue.length}
                onTaskChange={onTaskChange}
                onTaskDelete={onTaskDelete}
              />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {current.length === 0 && overdue.length === 0 && tasks.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-14 h-14 rounded-full bg-indigo-500/15 border border-indigo-400/25 flex items-center justify-center mx-auto">
              <Sparkles size={22} className="text-indigo-300" />
            </div>
            <p className="text-white/70 text-base font-medium">Commence par une chose.</p>
            <p className="text-white/35 text-sm">Une seule suffit pour démarrer.</p>
          </div>
        )}
        {current.length === 0 && tasks.filter((t) => t.done).length > 0 && overdue.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <p className="text-white/70 text-base font-medium">Tout est fait.</p>
            <p className="text-white/40 text-sm">Belle journée.</p>
          </div>
        )}
        {current.map((t, i) => (
          <div key={t.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <TaskCard
              task={t}
              isFirst={i === 0}
              isLast={i === current.length - 1}
              totalActive={current.length}
              onTaskChange={onTaskChange}
              onTaskDelete={onTaskDelete}
            />
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <button
          onClick={resetAll}
          className="flex items-center gap-2 text-sm text-white/25 hover:text-white/50 transition-colors mx-auto pt-2"
        >
          <RotateCcw size={13} />
          Tout recommencer
        </button>
      )}
    </div>
  )
}