import { LayoutList, BarChart2, Clock, User, FolderOpen } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function BottomNav() {
  const { currentView, setCurrentView } = useStore()

  const tabs = [
    { id: 'app' as const, label: 'Tâches', icon: <LayoutList size={19} /> },
    { id: 'projects' as const, label: 'Projets', icon: <FolderOpen size={19} /> },
    { id: 'history' as const, label: 'Historique', icon: <Clock size={19} /> },
    { id: 'stats' as const, label: 'Stats', icon: <BarChart2 size={19} /> },
    { id: 'profile' as const, label: 'Profil', icon: <User size={19} /> },
  ]

  const activeTab = currentView === 'project-detail' ? 'projects' : currentView

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d0d1a]/95 backdrop-blur border-t border-white/8">
      <div className="max-w-xl mx-auto flex items-center justify-around px-1 py-2.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all
              ${activeTab === tab.id ? 'text-indigo-400' : 'text-white/28 hover:text-white/60'}`}
          >
            {tab.icon}
            <span className="text-[0.65rem] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}