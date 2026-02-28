import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import type { User } from '@supabase/supabase-js'
import type { Task, Project } from '../types'

export function useSync(user: User | null) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!user || initialized.current) return
    initialized.current = true
    loadFromSupabase(user.id)
  }, [user])

  async function loadFromSupabase(userId: string) {
    const [
      { data: projects },
      { data: tasks },
      { data: steps },
      { data: history },
      { data: checkin },
      { data: profile },
    ] = await Promise.all([
      supabase.from('projects').select('*').eq('user_id', userId).order('position'),
      supabase.from('tasks').select('*').eq('user_id', userId).order('position'),
      supabase.from('micro_steps').select('*').order('position'),
      supabase.from('history_records').select('*').eq('user_id', userId),
      supabase.from('checkins').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(1),
      supabase.from('profiles').select('*').eq('id', userId).single(),
    ])

    if (projects) {
      useStore.setState({
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? '',
          color: p.color ?? '#6366f1',
          done: p.done ?? false,
          createdAt: p.created_at,
        })),
      })
    }

    if (tasks) {
      const tasksWithSteps: Task[] = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        context: t.context,
        done: t.done,
        createdAt: t.created_at,
        completedAt: t.completed_at,
        dueDate: t.due_date,
        launched: t.launched,
        projectId: t.project_id ?? null,
        timerStartedAt: t.timer_started_at,
        timerElapsed: t.timer_elapsed,
        timerDuration: t.timer_duration,
        timerRunning: false,
        microSteps: (steps ?? [])
          .filter((s) => s.task_id === t.id)
          .map((s) => ({ id: s.id, label: s.label, done: s.done })),
      }))
      useStore.setState({ tasks: tasksWithSteps })
    }

    if (history) {
      useStore.setState({
        history: history.map((h) => ({ date: h.date, elan: h.elan, tasksDone: h.tasks_done })),
      })
    }

    if (checkin?.[0]) {
      useStore.setState({
        checkIn: { date: checkin[0].date, intention: checkin[0].intention, done: checkin[0].done },
      })
    }

    if (profile) {
      useStore.setState({
        elan: profile.elan,
        checkInTime: profile.checkin_time,
        notifEnabled: profile.notif_enabled,
        notifDelay: profile.notif_delay,
      })
    }
  }

  async function syncTask(task: Task, userId: string) {
    await supabase.from('tasks').upsert({
      id: task.id,
      user_id: userId,
      title: task.title,
      context: task.context,
      done: task.done,
      created_at: task.createdAt,
      completed_at: task.completedAt,
      due_date: task.dueDate,
      launched: task.launched,
      project_id: task.projectId,
      timer_started_at: task.timerStartedAt,
      timer_elapsed: task.timerElapsed,
      timer_duration: task.timerDuration,
      timer_running: task.timerRunning,
      position: useStore.getState().tasks.filter((t) => !t.done).indexOf(task),
    })
    await supabase.from('micro_steps').delete().eq('task_id', task.id)
    if (task.microSteps.length > 0) {
      await supabase.from('micro_steps').insert(
        task.microSteps.map((s, i) => ({
          id: s.id, task_id: task.id, label: s.label, done: s.done, position: i,
        }))
      )
    }
  }

  async function deleteTask(taskId: string) {
    await supabase.from('tasks').delete().eq('id', taskId)
  }

  async function syncProject(project: Project, userId: string) {
    await supabase.from('projects').upsert({
      id: project.id,
      user_id: userId,
      name: project.name,
      description: project.description,
      color: project.color,
      done: project.done,
      created_at: project.createdAt,
      position: useStore.getState().projects.indexOf(project),
    })
  }

  async function deleteProject(projectId: string) {
    await supabase.from('projects').delete().eq('id', projectId)
  }

  async function syncHistory(userId: string) {
    const history = useStore.getState().history
    for (const record of history) {
      await supabase.from('history_records').upsert({
        user_id: userId,
        date: record.date,
        elan: record.elan,
        tasks_done: record.tasksDone,
      })
    }
  }

  async function syncCheckIn(userId: string) {
    const checkIn = useStore.getState().checkIn
    if (!checkIn) return
    await supabase.from('checkins').upsert({
      user_id: userId,
      date: checkIn.date,
      intention: checkIn.intention,
      done: checkIn.done,
    })
  }

  async function syncProfile(userId: string) {
    const s = useStore.getState()
    await supabase.from('profiles').upsert({
      id: userId,
      elan: s.elan,
      checkin_time: s.checkInTime,
      notif_enabled: s.notifEnabled,
      notif_delay: s.notifDelay,
      updated_at: new Date().toISOString(),
    })
  }

  return { syncTask, deleteTask, syncProject, deleteProject, syncHistory, syncCheckIn, syncProfile }
}