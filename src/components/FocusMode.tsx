import { X, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Task } from '../types'
import MicroSteps from './MicroSteps'
import CandleTimer from './CandleTimer'
import ElanBadge from './ElanBadge'

type Props = { task: Task; onClose: () => void }

export default function FocusMode({ task, onClose }: Props) {
  const { toggleDone } = useStore()

  const handleDone = () => {
    toggleDone(task.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d1a] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">Mode Focus</span>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div
        className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)' }}
      />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-3">
            <ElanBadge context={task.context} />
            <h2 className="text-3xl font-light text-white leading-snug">{task.title}</h2>
          </div>
          <div className="bg-white/8 border border-white/15 rounded-2xl p-5">
            <MicroSteps task={task} />
          </div>
          <CandleTimer taskId={task.id} />
          <button
            onClick={handleDone}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 hover:text-white transition-all text-base font-semibold"
          >
            <Check size={18} />
            Marquer comme terminé
          </button>
        </div>
      </div>
    </div>
  )
}