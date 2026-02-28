import { useState } from 'react'
import { X, Rocket, Check, AlertTriangle } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Task } from '../types'
import CandleTimer from './CandleTimer'

type Props = { onTaskChange?: (task: Task) => void }

function UrgencyCard({ task, onTaskChange }: { task: Task; onTaskChange?: (task: Task) => void }) {
  const { toggleDone, setUrgencyMode, launchTask, startTaskTimer } = useStore()
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    launchTask(task.id)
    startTaskTimer(task.id, 15 * 60)
    setStarted(true)
    setTimeout(() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === task.id)!), 50)
  }

  const handleDone = () => {
    toggleDone(task.id)
    setTimeout(() => onTaskChange?.(useStore.getState().tasks.find((t) => t.id === task.id)!), 50)
    setUrgencyMode(false)
  }

  return (
    <div className="w-full max-w-sm space-y-6 animate-welcome">
      <div className="flex items-center gap-2 justify-center">
        <AlertTriangle size={14} className="text-rose-400" />
        <span className="text-xs font-semibold text-rose-300/80 uppercase tracking-widest">Mode Urgence</span>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-white/40 text-sm">Une seule chose maintenant.</p>
        <h2 className="text-3xl font-light text-white leading-snug">{task.title}</h2>
      </div>
      {task.microSteps.length > 0 && (
        <div className="bg-white/6 border border-white/10 rounded-2xl p-4 space-y-2 text-left">
          {task.microSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full border flex-shrink-0 ${step.done ? 'bg-emerald-400 border-emerald-400' : 'border-white/30'}`} />
              <span className={`text-sm ${step.done ? 'text-white/30 line-through' : 'text-white/70'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      )}
      {started && <CandleTimer taskId={task.id} />}
      {!started && (
        <div className="space-y-3">
          <p className="text-center text-white/35 text-sm">Commence. Un seul geste suffit.</p>
          <button onClick={handleStart} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-base transition-all shadow-2xl shadow-rose-900/50">
            <Rocket size={18} />Je démarre
          </button>
        </div>
      )}
      {started && (
        <button onClick={handleDone} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/35 text-emerald-300 font-semibold text-base transition-all">
          <Check size={18} />C'est fait
        </button>
      )}
    </div>
  )
}

export default function UrgencyMode({ onTaskChange }: Props) {
  const { tasks, setUrgencyMode } = useStore()
  const urgentTask = tasks.find((t) => !t.done && t.context === 'urgent') ?? tasks.find((t) => !t.done)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0d0d1a] overflow-hidden">
      <div className="pointer-events-none fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full animate-pulse-glow" style={{ background: 'radial-gradient(circle, #be123c, transparent)' }} />
      <div className="pointer-events-none fixed bottom-[-20%] right-[5%] w-[400px] h-[400px] rounded-full animate-pulse-glow" style={{ background: 'radial-gradient(circle, #9f1239, transparent)', animationDelay: '1.5s' }} />
      <div className="relative z-10 flex justify-end px-6 py-4">
        <button onClick={() => setUrgencyMode(false)} className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm">
          <X size={16} />Quitter le mode urgence
        </button>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        {urgentTask
          ? <UrgencyCard task={urgentTask} onTaskChange={onTaskChange} />
          : (
            <div className="text-center space-y-4 animate-welcome">
              <p className="text-white/50 text-lg">Aucune tâche en cours.</p>
              <button onClick={() => setUrgencyMode(false)} className="text-sm text-white/30 hover:text-white/60">Retour</button>
            </div>
          )
        }
      </div>
    </div>
  )
}