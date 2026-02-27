import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

const DURATIONS = [
  { label: '5 min', value: 5 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '25 min', value: 25 * 60 },
]

type Props = {
  taskId: string
  autoStart?: boolean
}

export default function CandleTimer({ taskId, autoStart = false }: Props) {
  const { tasks, startTaskTimer, pauseTaskTimer, resumeTaskTimer, resetTaskTimer } = useStore()
  const [, setTick] = useState(0)

  const task = tasks.find((t) => t.id === taskId)
  if (!task) return null

  const liveElapsed = task.timerRunning && task.timerStartedAt
    ? task.timerElapsed + Math.floor((Date.now() - task.timerStartedAt) / 1000)
    : task.timerElapsed

  const timeLeft = Math.max(task.timerDuration - liveElapsed, 0)
  const progress = timeLeft / task.timerDuration
  const finished = timeLeft === 0
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const candleHeight = 120
  const fillHeight = Math.round(candleHeight * progress)
  const glowSize = task.timerRunning ? Math.round(8 + 6 * progress) : 4

  useEffect(() => {
    if (!task.timerRunning) return
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [task.timerRunning])

  useEffect(() => {
    if (autoStart && !task.timerRunning && liveElapsed === 0) {
      startTaskTimer(taskId, task.timerDuration)
    }
  }, [autoStart])

  return (
    <div className="flex items-center gap-5 mt-4 p-3 rounded-xl bg-white/3 border border-white/8">

      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div
          className="rounded-full transition-all duration-1000"
          style={{
            width: glowSize,
            height: glowSize,
            background: task.timerRunning ? 'radial-gradient(circle, #fde68a, #f59e0b)' : '#3a3a4a',
            boxShadow: task.timerRunning ? `0 0 ${glowSize * 2}px ${glowSize}px rgba(245,158,11,0.35)` : 'none',
            opacity: task.timerRunning ? 1 : 0.25,
          }}
        />
        <div className="relative rounded-sm overflow-hidden bg-white/8" style={{ width: 14, height: candleHeight }}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-1000"
            style={{
              height: fillHeight,
              background: task.timerRunning
                ? 'linear-gradient(to top, #92400e, #fbbf24)'
                : 'linear-gradient(to top, #1e1e2e, #3a3a5a)',
            }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex gap-1.5">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => resetTaskTimer(taskId, d.value)}
              disabled={task.timerRunning}
              className={`text-xs px-2 py-0.5 rounded-full border transition-all
                ${task.timerDuration === d.value && !finished
                  ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                  : 'border-white/10 text-white/25 hover:border-white/25 disabled:opacity-30'}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="text-2xl font-light tabular-nums tracking-tight text-white/70">
          {finished
            ? <span className="text-emerald-400 text-sm font-medium">Temps écoulé</span>
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          }
        </div>

        <div className="flex gap-2">
          {!task.timerRunning && !finished && (
            <button
              onClick={() => liveElapsed === 0
                ? startTaskTimer(taskId, task.timerDuration)
                : resumeTaskTimer(taskId)}
              className="text-xs px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-all border border-amber-500/20"
            >
              {liveElapsed === 0 ? 'Démarrer' : 'Reprendre'}
            </button>
          )}
          {task.timerRunning && (
            <button
              onClick={() => pauseTaskTimer(taskId)}
              className="text-xs px-3 py-1 rounded-lg bg-white/8 text-white/50 hover:bg-white/15 transition-all border border-white/10"
            >
              Pause
            </button>
          )}
          {(task.timerRunning || liveElapsed > 0) && (
            <button
              onClick={() => resetTaskTimer(taskId, task.timerDuration)}
              className="text-xs px-3 py-1 rounded-lg bg-white/5 text-white/25 hover:text-white/40 hover:bg-white/10 transition-all border border-white/8"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    </div>
  )
}