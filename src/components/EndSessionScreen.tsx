import { CheckCircle, Zap, RotateCcw } from 'lucide-react'
import { useStore } from '../store/useStore'

type Props = {
  onClose?: () => void
}

export default function EndSessionScreen({ onClose }: Props) {
  const { endSession, setShowEndSession, history, tasks } = useStore()
  const today = new Date().toISOString().slice(0, 10)
  const todayRecord = history.find((d) => d.date === today)
  const doneTodayCount = todayRecord?.tasksDone ?? 0
  const elanTodayCount = todayRecord?.elan ?? 0
  const remaining = tasks.filter((t) => !t.done).length

  function getMessage() {
    if (doneTodayCount === 0) return "Tu as ouvert l'app. C'est déjà quelque chose."
    if (doneTodayCount === 1) return "Une tâche accomplie. C'est exactement ce qu'il fallait."
    if (doneTodayCount < 4) return `${doneTodayCount} tâches finies. Belle session.`
    return `${doneTodayCount} tâches. Solide.`
  }

  const handleEnd = () => {
    onClose?.()
    endSession()
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d1a]/95 backdrop-blur flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6 animate-welcome">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center mx-auto">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-light text-white">Session terminée.</h2>
          <p className="text-white/50 text-sm leading-relaxed">{getMessage()}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-300 tabular-nums">{doneTodayCount}</p>
            <p className="text-xs text-emerald-300/50 mt-1">tâche{doneTodayCount > 1 ? 's' : ''} faite{doneTodayCount > 1 ? 's' : ''}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <Zap size={16} className="text-amber-400" />
              <p className="text-3xl font-bold text-amber-300 tabular-nums">+{elanTodayCount}</p>
            </div>
            <p className="text-xs text-amber-300/50 mt-1">élan aujourd'hui</p>
          </div>
        </div>

        {remaining > 0 && (
          <p className="text-center text-white/30 text-xs">
            {remaining} tâche{remaining > 1 ? 's' : ''} en attente pour la prochaine fois.
          </p>
        )}

        <div className="space-y-2">
          <button
            onClick={handleEnd}
            className="w-full py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white font-medium hover:bg-white/12 transition-all"
          >
            Terminer la session
          </button>
          <button
            onClick={() => setShowEndSession(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-white/30 hover:text-white/55 transition-colors text-sm"
          >
            <RotateCcw size={13} />
            Continuer la session
          </button>
        </div>
      </div>
    </div>
  )
}