import { useState } from 'react'
import { ArrowRight, SkipForward, Sun, Sunset, Moon } from 'lucide-react'
import { useStore } from '../store/useStore'

function getTimeIcon() {
  const h = new Date().getHours()
  if (h < 12) return <Sun size={22} className="text-amber-400" />
  if (h < 19) return <Sunset size={22} className="text-orange-400" />
  return <Moon size={22} className="text-indigo-400" />
}

function getPrompt() {
  const h = new Date().getHours()
  if (h < 12) return 'Quelle est ta priorité de ce matin ?'
  if (h < 19) return 'Qu\'est-ce que tu veux finir aujourd\'hui ?'
  return 'Une dernière chose à accomplir ce soir ?'
}

export default function CheckInScreen() {
  const [intention, setIntention] = useState('')
  const { submitCheckIn, skipCheckIn, elan } = useStore()

  const handleSubmit = () => {
    if (!intention.trim()) return
    submitCheckIn(intention.trim())
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="animate-pulse-glow absolute top-[-15%] left-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
        />
        <div
          className="animate-pulse-glow absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-8 animate-welcome">

        {/* Icon + greeting */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white/6 border border-white/12 flex items-center justify-center mx-auto">
            {getTimeIcon()}
          </div>
          <h1 className="text-3xl font-light text-white">{getPrompt()}</h1>
          <p className="text-white/40 text-sm">Une seule chose. Celle qui compte vraiment.</p>
        </div>

        {/* Elan reminder */}
        {elan > 0 && (
          <div className="bg-amber-500/8 border border-amber-400/20 rounded-xl px-4 py-2.5 text-center">
            <p className="text-amber-300/70 text-xs">
              Tu as <span className="text-amber-300 font-semibold">{elan} points d'élan</span> — continue sur ta lancée.
            </p>
          </div>
        )}

        {/* Input */}
        <div className="bg-white/6 border border-white/15 rounded-2xl p-4 space-y-3">
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ex : Finir la proposition client..."
            className="w-full bg-transparent text-white placeholder:text-white/25 outline-none text-base font-light"
            autoFocus
          />
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!intention.trim()}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:bg-white/10 active:scale-95 text-white font-semibold text-base transition-all shadow-2xl shadow-indigo-900/50"
          >
            C'est parti
            <ArrowRight size={18} />
          </button>

          <button
            onClick={skipCheckIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-white/25 hover:text-white/50 transition-colors text-sm"
          >
            <SkipForward size={14} />
            Passer pour aujourd'hui
          </button>
        </div>
      </div>
    </div>
  )
}