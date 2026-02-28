import { useState } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const DELAYS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 heure', value: 60 },
  { label: '2 heures', value: 120 },
]

type Props = { onSave?: () => void }

export default function NotificationSettings({ onSave }: Props) {
  const [open, setOpen] = useState(false)
  const { notifEnabled, notifDelay, checkInTime, setNotifEnabled, setNotifDelay, setCheckInTime } = useStore()

  const handleToggle = async () => {
    if (!notifEnabled) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
    }
    setNotifEnabled(!notifEnabled)
    onSave?.()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-xl transition-all ${notifEnabled
          ? 'text-amber-400 bg-amber-400/10'
          : 'text-white/50 hover:text-white/80 hover:bg-white/8'}`}
      >
        {notifEnabled ? <Bell size={16} /> : <BellOff size={16} />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 w-72 bg-[#111125] border border-white/15 rounded-2xl p-4 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">Notifications</span>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80">Activer</span>
            <button
              onClick={handleToggle}
              className={`w-10 h-5 rounded-full border transition-all relative ${notifEnabled
                ? 'bg-amber-500/30 border-amber-500/50'
                : 'bg-white/8 border-white/15'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${notifEnabled
                ? 'left-5 bg-amber-400'
                : 'left-0.5 bg-white/40'}`}
              />
            </button>
          </div>

          {notifEnabled && (
            <>
              <div className="space-y-1.5">
                <span className="text-xs text-white/50">Check-in du matin</span>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => { setCheckInTime(e.target.value); onSave?.() }}
                  className="w-full bg-white/6 border border-white/15 rounded-xl px-3 py-2 text-sm text-white/80 outline-none focus:border-indigo-400/50 transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-white/50">Rappel si inactif depuis</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {DELAYS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => { setNotifDelay(d.value); onSave?.() }}
                      className={`text-xs px-2 py-1.5 rounded-lg border transition-all
                        ${notifDelay === d.value
                          ? 'border-amber-500/40 text-amber-300 bg-amber-500/10'
                          : 'border-white/10 text-white/45 hover:border-white/30 hover:text-white/70'}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {!notifEnabled && (
            <p className="text-xs text-white/35 leading-relaxed">
              Active les notifications pour recevoir un check-in chaque matin et des rappels doux.
            </p>
          )}
        </div>
      )}
    </div>
  )
}