import { useStore } from '../store/useStore'
import { Zap, ArrowRight, Clock, CheckCircle } from 'lucide-react'

function getGreeting(elan: number, activeTasks: number) {
  const h = new Date().getHours()

  let salut = ''
  if (h < 6)  salut = 'Encore debout ?'
  else if (h < 12) salut = 'Bonjour.'
  else if (h < 18) salut = 'Bon après-midi.'
  else salut = 'Bonsoir.'

  let message = ''
  if (elan === 0 && activeTasks === 0) {
    message = 'Commence par une seule chose. Une suffit.'
  } else if (elan === 0 && activeTasks > 0) {
    message = `Tu as ${activeTasks} tâche${activeTasks > 1 ? 's' : ''} qui attendent. Un pas.`
  } else if (h < 12 && elan > 0) {
    message = 'Belle matinée devant toi. Un pas à la fois.'
  } else if (h < 18 && activeTasks > 0) {
    message = `${activeTasks} tâche${activeTasks > 1 ? 's' : ''} en cours. Tu peux en finir une maintenant.`
  } else if (activeTasks === 0 && elan > 0) {
    message = 'Tout est fait. Bravo — c\'est rare et précieux.'
  } else if (elan >= 10) {
    message = `${elan} points d'élan. Tu construis quelque chose.`
  } else {
    message = 'Reprends là où tu t\'es arrêté.'
  }

  return { salut, message }
}

export default function WelcomeScreen() {
  const { elan, startSession, tasks } = useStore()
  const active = tasks.filter((t) => !t.done)
  const lastActive = active[0] ?? null
  const doneTasks = tasks.filter((t) => t.done)
  const { salut, message } = getGreeting(elan, active.length)

  return (
    <div className="min-h-screen bg-[#0d0d1a] relative overflow-hidden flex flex-col items-center justify-center px-6">

      {/* Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="animate-pulse-glow absolute top-[-15%] left-[5%] w-[650px] h-[650px] rounded-full"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
        />
        <div
          className="animate-pulse-glow absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animationDelay: '2s' }}
        />
        <div
          className="animate-pulse-glow absolute top-[60%] left-[-10%] w-[350px] h-[350px] rounded-full"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)', animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6 animate-welcome">

        {/* Greeting */}
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-light text-white tracking-tight">{salut}</h1>
          <p className="text-white/55 text-base leading-relaxed">{message}</p>
        </div>

        {/* Elan + done stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-500/12 border border-amber-400/25 rounded-2xl p-4 text-center space-y-1">
            <Zap size={18} className="text-amber-400 mx-auto" />
            <p className="text-3xl font-bold text-amber-300 tabular-nums">{elan}</p>
            <p className="text-xs text-amber-300/50">points d'élan</p>
          </div>
          <div className="bg-emerald-500/12 border border-emerald-400/25 rounded-2xl p-4 text-center space-y-1">
            <CheckCircle size={18} className="text-emerald-400 mx-auto" />
            <p className="text-3xl font-bold text-emerald-300 tabular-nums">{doneTasks.length}</p>
            <p className="text-xs text-emerald-300/50">terminées</p>
          </div>
        </div>

        {/* Last active task */}
        {lastActive && (
          <div className="bg-white/6 border border-white/12 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-white/40" />
              <span className="text-xs text-white/40 uppercase tracking-wider font-medium">En cours</span>
            </div>
            <p className="text-white font-semibold text-base leading-snug">{lastActive.title}</p>
            {active.length > 1 && (
              <p className="text-white/35 text-xs">
                + {active.length - 1} autre{active.length - 1 > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={startSession}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-base transition-all shadow-2xl shadow-indigo-900/50"
        >
          Commencer
          <ArrowRight size={18} />
        </button>

        <p className="text-center text-white/20 text-xs tracking-wide">
          Élémentaire · Un pas. Puis le suivant.
        </p>
      </div>
    </div>
  )
}