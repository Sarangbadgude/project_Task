import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../services/api'
import { useApi } from '../hooks/useApi'
import { ProjectForm } from '../components/ProjectForm'
import { useNotify } from '../context/NotifyContext'
import { useAppContext } from '../context/AppContext'

const STATUS_ORDER = ['Todo', 'InProgress', 'Review', 'Done']

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [createErrors, setCreateErrors] = useState({})
  const [editErrors, setEditErrors] = useState({})
  const { loading, error } = useApi(projectsApi.getAll)
  const { notify } = useNotify()
  const { triggerRefresh } = useAppContext()

  const load = () => projectsApi.getAll().then(r => setProjects(r.data))
  useEffect(() => { load() }, [])

  const createProject = async (payload) => {
    try {
      await projectsApi.create(payload)
      setCreateErrors({})
      setShowForm(false)
      load(); triggerRefresh(); notify('Project created!')
    } catch (err) {
      setCreateErrors(err?.response?.data?.errors || {})
    }
  }

  const updateProject = async (payload) => {
    try {
      await projectsApi.update(editingProject.id, payload)
      setEditErrors({})
      setEditingProject(null)
      load(); triggerRefresh(); notify('Project updated!')
    } catch (err) {
      setEditErrors(err?.response?.data?.errors || {})
    }
  }

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project and all related tasks/comments?')) return
    await projectsApi.delete(id)
    load(); triggerRefresh(); notify('Project deleted', 'error')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(v => !v); setEditingProject(null) }}>
          {showForm ? '✕ Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <div className="card form-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>New Project</h3>
          <ProjectForm apiErrors={createErrors} onSubmit={createProject} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
      {error && <p className="error">{error}</p>}

      {!loading && projects.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p className="empty-state-title">No projects yet</p>
            <p className="empty-state-desc">Create your first project to get started.</p>
          </div>
        </div>
      )}

      <div className="grid projects-grid">
        {projects.map(p => (
          <article key={p.id} className="card project-card">
            <div>
              <p className="project-card-title">{p.name}</p>
              <p className="project-card-desc">{p.description || 'No description provided.'}</p>
            </div>
            <p className="project-card-meta"><strong>{p.taskCount ?? 0}</strong> tasks total</p>
            <div className="status-grid">
              {STATUS_ORDER.map(status => (
                <div className="status-item" key={status}>
                  <span>{status}</span>
                  <strong>{p.tasksByStatus?.[status] ?? 0}</strong>
                </div>
              ))}
            </div>
            <div className="project-card-actions">
              <Link className="primary-link-btn" to={`/projects/${p.id}`}>Open Board →</Link>
              <button type="button" className="ghost" onClick={() => { setEditingProject(p); setShowForm(false) }}>Edit</button>
              <button type="button" className="danger-btn" onClick={() => deleteProject(p.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {editingProject && (
        <div className="card form-panel" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 14 }}>Edit — {editingProject.name}</h3>
          <ProjectForm apiErrors={editErrors} initial={editingProject} onSubmit={updateProject} onCancel={() => setEditingProject(null)} />
        </div>
      )}
    </div>
  )
}
