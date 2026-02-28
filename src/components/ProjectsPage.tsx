import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { Project } from '../types'
import { Plus, X, Check, Trash2, ChevronRight } from 'lucide-react'

const COLORS = [
  '#6366f1', '#34d399', '#fbbf24', '#f43f5e', '#38bdf8', '#a78bfa', '#fb923c',
]

type Props = {
  onProjectChange?: (project: Project, userId: string) => void
  onProjectDelete?: (projectId: string) => void
  userId: string
}

function NewProjectModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string, desc: string, color: string) => void }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [color, setColor] = useState('#6366f1')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#13131f] border border-white/12 rounded-t-3xl p-6 pb-10 space-y-5 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Nouveau projet</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du projet"
            autoFocus
            className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-400/50 transition-colors"
          />
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optionnelle)"
            className="w-full bg-white/6 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-indigo-400/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/35 uppercase tracking-widest">Couleur</p>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  background: c,
                  border: color === c ? '2px solid white' : '2px solid transparent',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/6 border border-white/12 text-white/50 hover:text-white text-sm font-medium transition-all"
          >
            Annuler
          </button>
          <button
            onClick={() => { if (name.trim()) { onSave(name.trim(), desc.trim(), color); onClose() } }}
            disabled={!name.trim()}
            className="flex-2 flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold transition-all"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, taskCount, doneCount, onOpen, onDelete }: {
  project: Project
  taskCount: number
  doneCount: number
  onOpen: () => void
  onDelete: () => void
}) {
  const progress = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0

  return (
    <div
      className="relative rounded-2xl border border-white/10 bg-white/4 hover:bg-white/6 hover:border-white/18 transition-all overflow-hidden cursor-pointer group"
      onClick={onOpen}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: project.color }} />

      <div className="pl-5 pr-4 py-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white leading-tight">{project.name}</h3>
            {project.description && (
              <p className="text-xs text-white/40 mt-1 font-light line-clamp-1">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            <span className="text-xs text-white/35 tabular-nums">{doneCount}/{taskCount}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
            >
              <Trash2 size={13} />
            </button>
            <ChevronRight size={15} className="text-white/25" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-1 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: project.color }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/30">{progress}% terminé</span>
            {taskCount === 0 && (
              <span className="text-xs text-white/20">Aucune tâche</span>
            )}
            {doneCount === taskCount && taskCount > 0 && (
              <span className="text-xs flex items-center gap-1" style={{ color: project.color }}>
                <Check size={10} />
                Terminé
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage({ onProjectChange, onProjectDelete, userId }: Props) {
  const { projects, tasks, addProject, deleteProject, setCurrentView, setActiveProjectId } = useStore()
  const [showModal, setShowModal] = useState(false)

  const activeProjects = projects.filter((p) => !p.done)
  const doneProjects = projects.filter((p) => p.done)

  const getTaskCounts = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId)
    return {
      total: projectTasks.length,
      done: projectTasks.filter((t) => t.done).length,
    }
  }

  const handleCreateProject = (name: string, desc: string, color: string) => {
    const project = addProject(name, desc, color)
    onProjectChange?.(project, userId)
  }

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId)
    onProjectDelete?.(projectId)
  }

  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId)
    setCurrentView('project-detail')
  }

  return (
    <div className="w-full pb-10 animate-fade-up">
      <div className="flex items-center justify-between pt-8 pb-6 border-b border-white/8 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Projets</h1>
          <p className="text-sm text-white/35 mt-1 font-light">
            {activeProjects.length} actif{activeProjects.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus size={16} />
          Nouveau
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="w-14 h-14 rounded-full bg-indigo-500/15 border border-indigo-400/25 flex items-center justify-center mx-auto">
            <span className="text-2xl">📁</span>
          </div>
          <p className="text-white/60 text-base font-medium">Aucun projet pour l'instant.</p>
          <p className="text-white/30 text-sm">Crée un projet pour regrouper tes tâches.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-indigo-400 text-sm border border-indigo-400/30 px-4 py-2 rounded-xl hover:bg-indigo-400/10 transition-all"
          >
            + Créer mon premier projet
          </button>
        </div>
      )}

      <div className="space-y-3">
        {activeProjects.map((project) => {
          const counts = getTaskCounts(project.id)
          return (
            <ProjectCard
              key={project.id}
              project={project}
              taskCount={counts.total}
              doneCount={counts.done}
              onOpen={() => handleOpenProject(project.id)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          )
        })}
      </div>

      {doneProjects.length > 0 && (
        <div className="mt-8 space-y-3">
          <p className="text-xs font-semibold text-white/25 uppercase tracking-widest">Terminés</p>
          {doneProjects.map((project) => {
            const counts = getTaskCounts(project.id)
            return (
              <div key={project.id} style={{ opacity: 0.4 }}>
                <ProjectCard
                  project={project}
                  taskCount={counts.total}
                  doneCount={counts.done}
                  onOpen={() => handleOpenProject(project.id)}
                  onDelete={() => handleDeleteProject(project.id)}
                />
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onSave={handleCreateProject}
        />
      )}
    </div>
  )
}