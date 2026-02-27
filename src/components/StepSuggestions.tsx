import { useEffect, useRef } from 'react'
import { Plus, Sparkles, Loader, AlertCircle, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAISuggestions } from '../hooks/useAISuggestions'
import type { Task } from '../types'

type Props = { task: Task }

export default function StepSuggestions({ task }: Props) {
  const { addMicroStep } = useStore()
  const { suggestions, status, generate } = useAISuggestions()
  const hasGenerated = useRef(false)

  useEffect(() => {
    if (!hasGenerated.current) {
      hasGenerated.current = true
      generate(task.title, task.context)
    }
  }, [task.id])

  const alreadyAdded = task.microSteps.map((s) => s.label)
  const remaining = suggestions.filter((s) => !alreadyAdded.includes(s))

  return (
    <div className="mt-3 rounded-xl border border-indigo-400/15 bg-indigo-500/8 p-3 space-y-2">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-300/80 uppercase tracking-widest">
            Suggestions IA
          </span>
        </div>
        {status === 'done' && (
          <button
            onClick={() => generate(task.title, task.context)}
            className="text-indigo-400/50 hover:text-indigo-300 transition-colors"
            title="Regénérer"
          >
            <RefreshCw size={11} />
          </button>
        )}
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 py-2">
          <Loader size={13} className="text-indigo-400 animate-spin" />
          <span className="text-xs text-indigo-300/60">Génération en cours...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <AlertCircle size={13} className="text-rose-400" />
            <span className="text-xs text-rose-300/70">Limite atteinte, réessaie dans 1 minute.</span>
          </div>
          <button
            onClick={() => generate(task.title, task.context)}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {status === 'done' && remaining.length === 0 && (
        <p className="text-xs text-indigo-300/40 py-1">Toutes les suggestions ont été ajoutées.</p>
      )}

      {status === 'done' && remaining.length > 0 && (
        <div className="space-y-1.5">
          {remaining.map((step) => (
            <button
              key={step}
              onClick={() => addMicroStep(task.id, step)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <div className="w-5 h-5 rounded-full border border-dashed border-indigo-400/25 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-400/70 group-hover:bg-indigo-400/10 transition-all">
                <Plus size={10} className="text-indigo-400/40 group-hover:text-indigo-300 transition-colors" />
              </div>
              <span className="text-xs text-indigo-200/60 group-hover:text-indigo-100 transition-colors leading-relaxed">
                {step}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}