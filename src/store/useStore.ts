import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, Context, MicroStep } from '../types'

type DayRecord = {
  date: string
  elan: number
  tasksDone: number
}

type CheckIn = {
  date: string
  intention: string
  done: boolean
}

type Store = {
  tasks: Task[]
  elan: number
  focusTaskId: string | null
  notifEnabled: boolean
  notifDelay: number
  sessionActive: boolean
  sessionStart: number | null
  sessionCount: number
  hasSeenOnboarding: boolean
  history: DayRecord[]
  currentView: 'app' | 'stats' | 'history' | 'profile'
  urgencyMode: boolean
  checkIn: CheckIn | null
  checkInTime: string
  showEndSession: boolean
  addTask: (title: string, context: Context, dueDate?: string | null) => void
  editTask: (taskId: string, title: string, context: Context, dueDate?: string | null) => void
  toggleDone: (taskId: string) => void
  deleteTask: (taskId: string) => void
  launchTask: (taskId: string) => void
  addMicroStep: (taskId: string, label: string) => void
  toggleMicroStep: (taskId: string, stepId: string) => void
  deleteMicroStep: (taskId: string, stepId: string) => void
  startTaskTimer: (taskId: string, duration: number) => void
  pauseTaskTimer: (taskId: string) => void
  resumeTaskTimer: (taskId: string) => void
  resetTaskTimer: (taskId: string, duration: number) => void
  moveTaskUp: (taskId: string) => void
  moveTaskDown: (taskId: string) => void
  setFocusTask: (id: string | null) => void
  setNotifEnabled: (val: boolean) => void
  setNotifDelay: (val: number) => void
  startSession: () => void
  endSession: () => void
  setShowEndSession: (val: boolean) => void
  completeOnboarding: () => void
  setCurrentView: (view: 'app' | 'stats' | 'history' | 'profile') => void
  setUrgencyMode: (val: boolean) => void
  submitCheckIn: (intention: string) => void
  skipCheckIn: () => void
  resetCheckIn: () => void
  setCheckInTime: (time: string) => void
  resetAll: () => void
}

const generateId = () => Math.random().toString(36).slice(2, 10)
const todayKey = () => new Date().toISOString().slice(0, 10)

const recordElan = (history: DayRecord[], amount: number, tasksDone: number): DayRecord[] => {
  const key = todayKey()
  const existing = history.find((d) => d.date === key)
  if (existing) {
    return history.map((d) =>
      d.date === key
        ? { ...d, elan: d.elan + amount, tasksDone: d.tasksDone + tasksDone }
        : d
    )
  }
  return [...history, { date: key, elan: amount, tasksDone }]
}

const defaultTaskTimer = {
  timerStartedAt: null,
  timerElapsed: 0,
  timerDuration: 15 * 60,
  timerRunning: false,
  completedAt: null,
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      tasks: [],
      elan: 0,
      focusTaskId: null,
      notifEnabled: false,
      notifDelay: 30,
      sessionActive: false,
      sessionStart: null,
      sessionCount: 0,
      hasSeenOnboarding: false,
      history: [],
      currentView: 'app',
      urgencyMode: false,
      checkIn: null,
      checkInTime: '08:00',
      showEndSession: false,

      addTask: (title, context, dueDate = null) => {
        const newTask: Task = {
          id: generateId(),
          title,
          context,
          done: false,
          createdAt: Date.now(),
          dueDate: dueDate ?? null,
          microSteps: [],
          launched: false,
          ...defaultTaskTimer,
        }
        set((s) => ({ tasks: [newTask, ...s.tasks] }))
      },

      editTask: (taskId, title, context, dueDate = null) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, title, context, dueDate: dueDate ?? null } : t
          ),
        }))
      },

      toggleDone: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId)
        if (task && !task.done) {
          set((s) => ({
            elan: s.elan + 1,
            history: recordElan(s.history, 1, 1),
          }))
        }
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : null }
              : t
          ),
        }))
      },

      deleteTask: (taskId) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }))
      },

      launchTask: (taskId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, launched: true } : t
          ),
        }))
      },

      addMicroStep: (taskId, label) => {
        const step: MicroStep = { id: generateId(), label, done: false }
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, microSteps: [...t.microSteps, step] }
              : t
          ),
        }))
      },

      toggleMicroStep: (taskId, stepId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  microSteps: t.microSteps.map((ms) =>
                    ms.id === stepId ? { ...ms, done: !ms.done } : ms
                  ),
                }
              : t
          ),
        }))
      },

      deleteMicroStep: (taskId, stepId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, microSteps: t.microSteps.filter((ms) => ms.id !== stepId) }
              : t
          ),
        }))
      },

      startTaskTimer: (taskId, duration) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, timerRunning: true, timerDuration: duration, timerStartedAt: Date.now(), timerElapsed: 0 }
              : t
          ),
        }))
      },

      pauseTaskTimer: (taskId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  timerRunning: false,
                  timerElapsed: t.timerElapsed + (t.timerStartedAt
                    ? Math.floor((Date.now() - t.timerStartedAt) / 1000) : 0),
                  timerStartedAt: null,
                }
              : t
          ),
        }))
      },

      resumeTaskTimer: (taskId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, timerRunning: true, timerStartedAt: Date.now() }
              : t
          ),
        }))
      },

      resetTaskTimer: (taskId, duration) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, timerRunning: false, timerDuration: duration, timerStartedAt: null, timerElapsed: 0 }
              : t
          ),
        }))
      },

      moveTaskUp: (taskId) => {
        set((s) => {
          const active = s.tasks.filter((t) => !t.done)
          const done = s.tasks.filter((t) => t.done)
          const idx = active.findIndex((t) => t.id === taskId)
          if (idx <= 0) return s
          const reordered = [...active]
          ;[reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]]
          return { tasks: [...reordered, ...done] }
        })
      },

      moveTaskDown: (taskId) => {
        set((s) => {
          const active = s.tasks.filter((t) => !t.done)
          const done = s.tasks.filter((t) => t.done)
          const idx = active.findIndex((t) => t.id === taskId)
          if (idx < 0 || idx >= active.length - 1) return s
          const reordered = [...active]
          ;[reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]]
          return { tasks: [...reordered, ...done] }
        })
      },

      setFocusTask: (id) => set({ focusTaskId: id }),
      setNotifEnabled: (val) => set({ notifEnabled: val }),
      setNotifDelay: (val) => set({ notifDelay: val }),

      startSession: () =>
        set((s) => ({
          sessionActive: true,
          sessionStart: Date.now(),
          sessionCount: s.sessionCount + 1,
        })),

      endSession: () => set({ sessionActive: false, sessionStart: null, showEndSession: false }),
      setShowEndSession: (val) => set({ showEndSession: val }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      setCurrentView: (view) => set({ currentView: view }),
      setUrgencyMode: (val) => set({ urgencyMode: val }),

      submitCheckIn: (intention) => {
        const today = todayKey()
        set({ checkIn: { date: today, intention, done: true } })
        if (intention.trim()) {
          const newTask: Task = {
            id: generateId(),
            title: intention.trim(),
            context: 'perso',
            done: false,
            createdAt: Date.now(),
            dueDate: today,
            microSteps: [],
            launched: false,
            ...defaultTaskTimer,
          }
          set((s) => ({ tasks: [newTask, ...s.tasks] }))
        }
      },

      skipCheckIn: () => {
        set({ checkIn: { date: todayKey(), intention: '', done: true } })
      },

      resetCheckIn: () => set({ checkIn: null }),

      setCheckInTime: (time) => set({ checkInTime: time }),

      resetAll: () =>
        set({
          tasks: [],
          elan: 0,
          focusTaskId: null,
          sessionActive: false,
          sessionStart: null,
          history: [],
          sessionCount: 0,
          urgencyMode: false,
          checkIn: null,
          showEndSession: false,
        }),
    }),
    { name: 'elementaire-storage' }
  )
)