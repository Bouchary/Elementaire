import { useState, useRef, useEffect } from 'react'
import { Check, Trash2, Rocket, ChevronDown, ChevronUp, Maximize2, Pencil, X, CalendarDays, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Task, Context } from '../types'
import ElanBadge from './ElanBadge'
import MicroSteps from './MicroSteps'
import CandleTimer from './CandleTimer'
import StepSuggestions from './StepSuggestions'

type Props = {
  task: Task
  isFirst?: boolean
  isLast?: boolean
  totalActive?: number
}

const contexts: { value: Context; label: string; color: string }[] = [
  { value: 'perso', label: 'Perso', color: 'border-violet-400/50 text-violet-300 bg-violet-500/15' },
  { value: 'pro', label: 'Pro', color: 'border-sky-400/50 text-sky-300 bg-sky-500/15' },
  { value: 'urgent', label: 'Urgent', color: 'border-rose-400/50 text-rose-300 bg-rose-500/15' },
]

function DueDateBadge({ dueDate }: { dueDate: string }) {
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const isOverdue = dueDate < today
  const isToday = dueDate === today
  const isTomorrow = dueDate === tomorrow
  const label = isToday ? "Aujourd'hui" : isTomorrow ? 'Demain' : new Date(dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  const color = isOverdue
    ? 'text-rose-400 bg-rose-500/12 border-rose-400/30'
    : isToday
      ? 'text-amber-400 bg-amber-500/12 border-amber-400/30'
      : 'text-white/50 bg-white/6 border-white/12'
  return (
    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>
      {isOverdue && <AlertTriangle size={10} />}
      {!isOverdue && <CalendarDays size={10} />}
      {label}
    </span>
  )
}

export default function TaskCard({ task, isFirst = false, isLast = false, totalActive = 1 }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [justChecked, setJustChecked] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editContext, setEditContext] = useState<Context>(task.context)
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const { toggleDone, deleteTask, launchTask, setFocusTask, editTask, moveTaskUp, moveTaskDown } = useStore()

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleCheck = () => {
    if (!task.done) setJustChecked(true)
    setTimeout(() => setJustChecked(false), 600)
    toggleDone(task.id)
  }

  const handleEditStart = () => {
    setEditTitle(task.title)
    setEditContext(task.context)
    setEditDueDate(task.dueDate ?? '')
    setEditing(true)
  }

  const handleEditSave = () => {
    if (editTitle.trim()) {
      editTask(task.id, editTitle.trim(), editContext, editDueDate || null)
    }
    setEditing(false)
  }

  const handleEditCancel = () => setEditing(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditSave()
    if (e.key === 'Escape') handleEditCancel()
  }

  return (
    <div className={`rounded-2xl border p-4 transition-all duration-300 group relative overflow-hidden
      ${task.done
        ? 'border-white/10 bg-white/4'
        : editing
          ? 'border-indigo-400/50 bg-indigo-900/50'
          : 'border-indigo-400/25 bg-indigo-950/60 hover:border-indigo-400/45 hover:bg-indigo-900/50'}`}>

      {justChecked && (
        <div className="pointer-events-none absolute top-3 left-9 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{ animation: 'sparkle 0.65s ease both', animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
      )}

      <div className="flex items-start gap-3">
        {!editing && (
          <button
            onClick={handleCheck}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${justChecked ? 'animate-check-pop' : ''}
              ${task.done
                ? 'border-emerald-400 bg-emerald-400'
                : 'border-white/40 hover:border-emerald-400'}`}
          >
            {task.done && <Check size={10} className="text-black" strokeWidth={3} />}
          </button>
        )}

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-white/8 border border-white/20 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/60 transition-colors"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full bg-white/6 border border-white/15 rounded-xl px-3 py-2 text-sm text-white/80 outline-none focus:border-indigo-400/50 transition-colors [color-scheme:dark]"
              />
              <div className="flex items-center gap-2 flex-wrap">
                {contexts.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setEditContext(c.value)}
                    className={`text-xs px-3 py-1 rounded-full border font-medium transition-all
                      ${editContext === c.value
                        ? c.color
                        : 'border-white/15 text-white/40 hover:text-white/65 hover:border-white/30'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditSave}
                  className="flex-1 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold transition-all"
                >
                  Enregistrer
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-white/50 hover:text-white text-xs transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm transition-all ${task.done
                  ? 'line-through text-white/40 font-normal'
                  : 'text-white font-semibold'}`}>
                  {task.title}
                </span>
                <ElanBadge context={task.context} />
                {task.dueDate && !task.done && <DueDateBadge dueDate={task.dueDate} />}
              </div>
              {task.launched && !task.done && expanded && (
                <div className="animate-fade-up">
                  <StepSuggestions task={task} />
                  <MicroSteps task={task} />
                  <CandleTimer taskId={task.id} />
                </div>
              )}
            </>
          )}
        </div>

        {!editing && (
          <div className={`flex items-center gap-0.5 flex-shrink-0 transition-opacity duration-200
            ${task.done ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'}`}>

            {/* Reorder */}
            {!task.done && totalActive > 1 && (
              <>
                {!isFirst && (
                  <button
                    onClick={() => moveTaskUp(task.id)}
                    className="p-1.5 rounded-lg text-white/35 hover:text-white/70 hover:bg-white/8 transition-all"
                    title="Remonter"
                  >
                    <ArrowUp size={13} />
                  </button>
                )}
                {!isLast && (
                  <button
                    onClick={() => moveTaskDown(task.id)}
                    className="p-1.5 rounded-lg text-white/35 hover:text-white/70 hover:bg-white/8 transition-all"
                    title="Descendre"
                  >
                    <ArrowDown size={13} />
                  </button>
                )}
              </>
            )}

            {!task.done && (
              <button onClick={handleEditStart} className="p-1.5 rounded-lg text-white/50 hover:text-indigo-300 hover:bg-indigo-400/15 transition-all">
                <Pencil size={14} />
              </button>
            )}
            {!task.done && !task.launched && (
              <button
                onClick={() => { launchTask(task.id); setExpanded(true) }}
                className="p-1.5 rounded-lg text-white/50 hover:text-amber-400 hover:bg-amber-400/15 transition-all"
              >
                <Rocket size={14} />
              </button>
            )}
            {task.launched && !task.done && (
              <>
                <button
                  onClick={() => setFocusTask(task.id)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-violet-400 hover:bg-violet-400/15 transition-all"
                >
                  <Maximize2 size={14} />
                </button>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white transition-all"
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </>
            )}
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-400/15 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}