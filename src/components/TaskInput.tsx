import { useState } from 'react'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Context } from '../types'

const contexts: { value: Context; label: string; color: string }[] = [
  { value: 'perso', label: 'Perso', color: 'border-violet-400/50 text-violet-300 bg-violet-500/15' },
  { value: 'pro', label: 'Pro', color: 'border-sky-400/50 text-sky-300 bg-sky-500/15' },
  { value: 'urgent', label: 'Urgent', color: 'border-rose-400/50 text-rose-300 bg-rose-500/15' },
]

export default function TaskInput() {
  const [title, setTitle] = useState('')
  const [context, setContext] = useState<Context>('perso')
  const [dueDate, setDueDate] = useState('')
  const [showDate, setShowDate] = useState(false)
  const addTask = useStore((s) => s.addTask)

  const handleSubmit = () => {
    if (!title.trim()) return
    addTask(title.trim(), context, dueDate || null)
    setTitle('')
    setDueDate('')
    setShowDate(false)
  }

  return (
    <div className="bg-white/8 border border-white/20 rounded-2xl p-5 space-y-4 shadow-xl shadow-black/30">
      <p className="text-xs font-semibold text-white/60 uppercase tracking-[0.18em]">
        Qu'est-ce qui compte là, maintenant ?
      </p>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Une seule chose..."
          className="flex-1 bg-transparent text-white placeholder:text-white/35 outline-none text-base font-light"
          autoFocus
        />
        <button
          onClick={() => setShowDate(!showDate)}
          title="Ajouter une échéance"
          className={`p-2 rounded-xl transition-all ${showDate || dueDate
            ? 'text-indigo-300 bg-indigo-500/15'
            : 'text-white/30 hover:text-white/60 hover:bg-white/8'}`}
        >
          <CalendarDays size={16} />
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-30 disabled:bg-white/10 transition-all"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {showDate && (
        <div className="animate-fade-in">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full bg-white/6 border border-white/15 rounded-xl px-3 py-2 text-sm text-white/80 outline-none focus:border-indigo-400/50 transition-colors [color-scheme:dark]"
          />
        </div>
      )}

      <div className="flex gap-2 pt-1 border-t border-white/8">
        {contexts.map((c) => (
          <button
            key={c.value}
            onClick={() => setContext(c.value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all
              ${context === c.value
                ? c.color
                : 'border-white/15 text-white/45 hover:text-white/70 hover:border-white/30'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}