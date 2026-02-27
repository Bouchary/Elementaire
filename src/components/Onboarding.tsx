import { useState } from 'react'
import { ArrowRight, Rocket, Zap, Focus } from 'lucide-react'
import { useStore } from '../store/useStore'

const slides = [
  {
    icon: <Rocket size={36} className="text-amber-400" />,
    color: 'from-amber-500/20 to-transparent',
    border: 'border-amber-400/20',
    title: 'Démarrer, c\'est le plus dur.',
    body: 'Élémentaire ne te demande pas de tout planifier. Juste une chose. Celle qui compte maintenant.',
  },
  {
    icon: <Focus size={36} className="text-indigo-400" />,
    color: 'from-indigo-500/20 to-transparent',
    border: 'border-indigo-400/20',
    title: 'Un pas à la fois.',
    body: 'Chaque tâche se découpe en micro-étapes de 2 à 5 minutes. Le premier geste suffit pour lancer l\'élan.',
  },
  {
    icon: <Zap size={36} className="text-emerald-400" />,
    color: 'from-emerald-500/20 to-transparent',
    border: 'border-emerald-400/20',
    title: 'Pas de streak. De l\'élan.',
    body: 'Ici, on ne te punit pas si tu rates une journée. Chaque action accomplie booste ton élan. Tu repars toujours de là où tu es.',
  },
]

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const isLast = current === slides.length - 1
  const slide = slides[current]

  const handleNext = () => {
    if (isLast) {
      completeOnboarding()
    } else {
      setCurrent((c) => c + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Orb */}
      <div
        className="pointer-events-none fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
      />

      <div className="relative z-10 max-w-sm w-full space-y-10 animate-welcome">

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === current
                ? 'w-6 h-2 bg-indigo-400'
                : 'w-2 h-2 bg-white/15'}`}
            />
          ))}
        </div>

        {/* Card */}
        <div className={`rounded-3xl border ${slide.border} bg-gradient-to-b ${slide.color} p-8 space-y-6 backdrop-blur-sm`}>
          <div className="w-16 h-16 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-center">
            {slide.icon}
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white leading-snug">
              {slide.title}
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              {slide.body}
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all shadow-lg shadow-indigo-900/40 active:scale-95"
        >
          {isLast ? 'Je commence' : 'Suivant'}
          <ArrowRight size={18} />
        </button>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={completeOnboarding}
            className="w-full text-center text-sm text-white/25 hover:text-white/50 transition-colors"
          >
            Passer
          </button>
        )}
      </div>
    </div>
  )
}