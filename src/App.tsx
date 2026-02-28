import Header from './components/Header'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import FocusMode from './components/FocusMode'
import WelcomeScreen from './components/WelcomeScreen'
import SessionBar from './components/SessionBar'
import Onboarding from './components/Onboarding'
import BottomNav from './components/BottomNav'
import StatsPage from './components/StatsPage'
import UrgencyMode from './components/UrgencyMode'
import CheckInScreen from './components/CheckInScreen'
import EndSessionScreen from './components/EndSessionScreen'
import HistoryPage from './components/HistoryPage'
import AuthScreen from './components/AuthScreen'
import ProfilePage from './components/ProfilePage'
import { useStore } from './store/useStore'
import { useNotifications } from './hooks/useNotifications'
import { useCheckInNotification } from './hooks/useCheckInNotification'
import { useAuth } from './hooks/useAuth'
import { useSync } from './hooks/useSync'

export default function App() {
  const {
    focusTaskId, setFocusTask, tasks,
    sessionActive, hasSeenOnboarding,
    currentView, urgencyMode, checkIn,
    showEndSession,
  } = useStore()

  const { user, loading } = useAuth()
  const { syncTask, deleteTask: syncDelete, syncHistory, syncProfile } = useSync(user)

  const focusTask = tasks.find((t) => t.id === focusTaskId)
  const todayKey = new Date().toISOString().slice(0, 10)
  const needsCheckIn = !checkIn || checkIn.date !== todayKey

  useNotifications()
  useCheckInNotification()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin" />
      </div>
    )
  }

  if (!user) return <AuthScreen />
  if (!hasSeenOnboarding) return <Onboarding />
  if (!sessionActive) return <WelcomeScreen />
  if (needsCheckIn) return <CheckInScreen />

  return (
    <div className="min-h-screen bg-[#0d0d1a] relative overflow-hidden">

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="animate-pulse-glow absolute top-[-10%] left-[15%] w-[550px] h-[550px] rounded-full"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }}
        />
        <div
          className="animate-pulse-glow absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <SessionBar />
        <div className="flex-1 flex flex-col items-center justify-start w-full px-4 pb-24">
          <div className="w-full max-w-lg">

            {currentView === 'app' && (
              <div className="animate-fade-up">
                <Header user={user} onSyncProfile={() => syncProfile(user.id)} />
                <div className="space-y-4">
                  <TaskInput onAdd={(task) => syncTask(task, user.id)} />
                  <TaskList
                    onTaskChange={(task) => syncTask(task, user.id)}
                    onTaskDelete={(id) => syncDelete(id)}
                  />
                </div>
              </div>
            )}

            {currentView === 'history' && <HistoryPage />}
            {currentView === 'stats' && <StatsPage />}
            {currentView === 'profile' && (
              <ProfilePage
                user={user}
                onSyncProfile={() => syncProfile(user.id)}
              />
            )}
          </div>
        </div>
      </div>

      <BottomNav />

      {focusTask && (
        <FocusMode
          task={focusTask}
          onClose={() => setFocusTask(null)}
          onTaskChange={(task) => syncTask(task, user.id)}
        />
      )}

      {urgencyMode && <UrgencyMode onTaskChange={(task) => syncTask(task, user.id)} />}
      {showEndSession && <EndSessionScreen onClose={() => syncHistory(user.id)} />}
    </div>
  )
}