export type Context = 'perso' | 'pro' | 'urgent'

export type MicroStep = {
  id: string
  label: string
  done: boolean
}

export type Task = {
  id: string
  title: string
  context: Context
  done: boolean
  createdAt: number
  completedAt: number | null
  dueDate: string | null
  microSteps: MicroStep[]
  launched: boolean
  timerStartedAt: number | null
  timerElapsed: number
  timerDuration: number
  timerRunning: boolean
  projectId: string | null
}

export type Project = {
  id: string
  name: string
  description: string
  color: string
  done: boolean
  createdAt: number
}