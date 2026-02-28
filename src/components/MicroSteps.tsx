import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Task } from '../types'

type Props = {
  task: Task
  onStepChange?: () => void
}

export default function MicroSteps({ task, onStepChange }: Props) {
  const [input, setInput] = useState('')
  const { addMicroStep, toggleMicroStep, deleteMicroStep } = useStore()

  const handleAdd = () => {
    if (!input.trim()) return
    addMicroStep(task.id, input.trim())
    setInput('')
    setTimeout(() => onStepChange?.(), 50)
  }

  return (
    <div className="mt-3 space-y-2">
      {task.microSteps.map((step) => (
        <div key={step.id} className="flex items-center gap-2 group">
          <button
            onClick={() => { toggleMicroStep(task.id, step.id); setTimeout(() => onStepChange?.(), 50) }}
            className="flex items-center gap-2.5 flex-1 text-left"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
              ${step.done ? 'border-emerald-400 bg-emerald-400' : 'border-white/35 group-hover:border-white/65'}`}>
              {step.done && <Check size={9} className="text-black" strokeWidth={3} />}
            </div>
            <span className={`text-sm transition-all ${step.done ? 'text-white/35 line-through' : 'text-white/85'}`}>
              {step.label}
            </span>
          </button>
          <button
            onClick={() => { deleteMicroStep(task.id, step.id); setTimeout(() => onStepChange?.(), 50) }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
          >
            <X size={12} />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Ajouter une micro-étape..."
          className="flex-1 bg-transparent text-sm text-white/70 placeholder:text-white/30 outline-none"
        />
        <button onClick={handleAdd} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all">
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}