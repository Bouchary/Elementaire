import { useState } from 'react'
import { ArrowLeft, Plus, Rocket, Maximize2, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Task, Context } from '../types'
import ElanBadge from './ElanBadge'
import MicroSteps from './MicroSteps'
import CandleTimer from './CandleTimer'
import StepSuggestions from './StepSuggestions'

type Props = {
  onTaskChange?: (task: Task) => void
  onTaskDelete?: (id: string) => void
}

const contexts: { value: Context; label: string; color: string }[] = [
  { value: 'perso', label: 'Perso', color: 'border-violet-400/50 text-violet-300 bg-violet-500/15' },
  { value: 'pro', label: 'Pro', color: 'border-sky-400/50 text-sky-300 bg-sky-500/15' },
  { value: 'urgent', label: 'Urgent', color: 'border-rose-400/50 text-rose-300 bg-rose-500/15' },
]

function ProjectTaskCard({ task, onTaskChange, onTaskDelete }: {
  task: Task
  onTaskChange?: (task: Task) => void
  onTaskDelete?: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [justChecked, setJustChecked] = useState(false)
  const { toggleDone, deleteTask, launchTask, setFocusTask } = useStore()

  const handleCheck = () => {
    if (!task.done) setJustChecked(true)
    setTimeout(() => setJustChecked(false), 600)
    toggleDone(task.id)
    setTimeout(() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === task.id)!), 50)
  }

  return (
    <div className={`rounded-2xl border p-4 transition-all group relative overflow-hidden
      ${task.done
        ? 'border-white/8 bg-white/3'
        : 'border-white/12 bg-white/5 hover:border-white/20 hover:bg-white/7'}`}>

      {justChecked && (
        <div className="pointer-events-none absolute top-3 left-9 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{ animation: 'sparkle 0.65s ease both', animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      )}

      <div className="flex items-start gap-3">
        <button
          onClick={handleCheck}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${task.done ? 'border-emerald-400 bg-emerald-400' : 'border-white/35 hover:border-emerald-400'}`}
        >
          {task.done && <Check size={10} className="text-black" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm transition-all ${task.done ? 'line-through text-white/35' : 'text-white font-medium'}`}>
              {task.title}
            </span>
            <ElanBadge context={task.context} />
          </div>

          {task.launched && !task.done && expanded && (
            <div className="animate-fade-up">
              <StepSuggestions task={task} />
              <MicroSteps task={task} onStepChange={() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === task.id)!)} />
              <CandleTimer taskId={task.id} onTimerChange={() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === task.id)!)} />
            </div>
          )}
        </div>

        <div className={`flex items-center gap-0.5 flex-shrink-0 transition-opacity ${task.done ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'}`}>
          {!task.done && !task.launched && (
            <button onClick={() => { launchTask(task.id); setExpanded(true); setTimeout(() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === task.id)!), 50) }}
              className="p-1.5 rounded-lg text-white/50 hover:text-amber-400 hover:bg-amber-400/15 transition-all">
              <Rocket size={14} />
            </button>
          )}
          {task.launched && !task.done && (
            <>
              <button onClick={() => setFocusTask(task.id)} className="p-1.5 rounded-lg text-white/50 hover:text-violet-400 hover:bg-violet-400/15 transition-all">
                <Maximize2 size={14} />
              </button>
              <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-white/50 hover:text-white transition-all">
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </>
          )}
          <button onClick={() => { deleteTask(task.id); onTaskDelete?.(task.id) }}
            className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-400/15 transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProjectDetail({ onTaskChange, onTaskDelete }: Props) {
  const { projects, tasks, activeProjectId, setCurrentView, addTask } = useStore()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskContext, setNewTaskContext] = useState<Context>('pro')
  const [showInput, setShowInput] = useState(false)

  const project = projects.find((p) => p.id === activeProjectId)
  if (!project) return null

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const activeTasks = projectTasks.filter((t) => !t.done)
  const doneTasks = projectTasks.filter((t) => t.done)
  const progress = projectTasks.length > 0
    ? Math.round((doneTasks.length / projectTasks.length) * 100)
    : 0

  const nextTask = activeTasks.find((t) => !t.launched) ?? activeTasks[0]

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    const task = addTask(newTaskTitle.trim(), newTaskContext, null, project.id)
    onTaskChange?.(task)
    setNewTaskTitle('')
    setShowInput(false)
  }

  return (
    <div className="w-full pb-10 animate-fade-up">

      {/* Header */}
      <div className="pt-6 pb-5 border-b border-white/8 mb-6">
        <button
          onClick={() => setCurrentView('projects')}
          className="flex items-center gap-2 text-white/35 hover:text-white/70 transition-colors text-sm mb-4"
        >
          <ArrowLeft size={14} />
          Projets
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0" style={{ background: project.color }} />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-white leading-tight">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-white/40 mt-1 font-light">{project.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: project.color }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums" style={{ color: project.color }}>{progress}%</span>
          <span className="text-xs text-white/30">{doneTasks.length}/{projectTasks.length}</span>
        </div>
      </div>

      {/* Prochaine étape suggérée */}
      {nextTask && (
        <div
          className="rounded-2xl border p-4 mb-6 flex items-center justify-between gap-3"
          style={{ background: `${project.color}12`, borderColor: `${project.color}30` }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: `${project.color}99` }}>
              🎯 Prochaine étape
            </p>
            <p className="text-sm font-medium text-white">{nextTask.title}</p>
          </div>
          <button
            onClick={() => {
              useStore.getState().launchTask(nextTask.id)
              useStore.getState().setFocusTask(nextTask.id)
              setTimeout(() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === nextTask.id)!), 50)
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white flex-shrink-0 transition-all"
            style={{ background: `${project.color}30`, border: `1px solid ${project.color}50` }}
          >
            <Rocket size={13} />
            Lancer
          </button>
        </div>
      )}

      {/* Tâches actives */}
      {activeTasks.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
            À faire · {activeTasks.length}
          </p>
          {activeTasks.map((task) => (
            <ProjectTaskCard
              key={task.id}
              task={task}
              onTaskChange={onTaskChange}
              onTaskDelete={onTaskDelete}
            />
          ))}
        </div>
      )}

      {/* Ajouter une tâche */}
      {showInput ? (
        <div className="bg-white/5 border border-white/15 rounded-2xl p-4 space-y-3 mb-6">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') setShowInput(false) }}
            placeholder="Nouvelle tâche..."
            autoFocus
            className="w-full bg-transparent text-white placeholder:text-white/25 outline-none text-sm"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {contexts.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setNewTaskContext(c.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all
                    ${newTaskContext === c.value ? c.color : 'border-white/12 text-white/35 hover:text-white/55'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowInput(false)} className="text-xs text-white/30 hover:text-white/60 transition-colors px-2">
                Annuler
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500 transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full flex items-center gap-3 py-3.5 px-4 rounded-2xl border border-dashed border-white/12 text-white/30 hover:text-white/60 hover:border-white/25 hover:bg-white/3 transition-all text-sm mb-6"
        >
          <Plus size={15} />
          Ajouter une tâche à ce projet
        </button>
      )}

      {/* Tâches terminées */}
      {doneTasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-3">
            Terminées · {doneTasks.length}
          </p>
          {doneTasks.map((task) => (
            <ProjectTaskCard
              key={task.id}
              task={task}
              onTaskChange={onTaskChange}
              onTaskDelete={onTaskDelete}
            />
          ))}
        </div>
      )}

      {projectTasks.length === 0 && !showInput && (
        <div className="text-center py-10 space-y-2">
          <p className="text-white/40 text-sm">Ce projet n'a pas encore de tâches.</p>
        </div>
      )}
    </div>
  )
}