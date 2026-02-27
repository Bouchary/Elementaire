import { LayoutList, BarChart2, Clock } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function BottomNav() {
  const { currentView, setCurrentView } = useStore()

  const tabs = [
    { id: 'app' as const, label: 'Tâches', icon: <LayoutList size={20} /> },
    { id: 'history' as const, label: 'Historique', icon: <Clock size={20} /> },
    { id: 'stats' as const, label: 'Stats', icon: <BarChart2 size={20} /> },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d0d1a]/95 backdrop-blur border-t border-white/8">
      <div className="max-w-xl mx-auto flex items-center justify-around px-4 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-all
              ${currentView === tab.id
                ? 'text-indigo-400'
                : 'text-white/30 hover:text-white/60'}`}
          >
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}