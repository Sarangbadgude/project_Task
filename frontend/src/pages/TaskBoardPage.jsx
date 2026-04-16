import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { tasksApi, projectsApi } from '../services/api'
import { useApi } from '../hooks/useApi'
import { TaskForm } from '../components/TaskForm'
import { useNotify } from '../context/NotifyContext'
import { useAppContext } from '../context/AppContext'

const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Critical']
const STATUS_LABELS = ['Todo', 'InProgress', 'Review', 'Done']

const toLabel = (value, labels) => (typeof value === 'number' ? labels[value] ?? String(value) : value)
const toPayload = (p) => ({
  ...p,
  priority: typeof p.priority === 'number' ? PRIORITY_LABELS[p.priority] : p.priority,
  status: typeof p.status === 'number' ? STATUS_LABELS[p.status] : p.status,
})
const isOverdue = (task) => {
  if (!task?.dueDate) return false
  if (toLabel(task.status, STATUS_LABELS) === 'Done') return false
  const due = new Date(task.dueDate); due.setHours(0, 0, 0, 0)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return due < today
}

const statusClass = (s) => ({ Todo: 'todo', InProgress: 'inprogress', Review: 'review', Done: 'done' })[s] || s.toLowerCase()

const INITIAL_TASK = { title: '', description: '', priority: 'Medium', status: 'Todo', dueDate: '' }

export default function TaskBoardPage() {
  const { projectId } = useParams()
  const { notify } = useNotify()
  const { triggerRefresh } = useAppContext()
  const { loading, error } = useApi()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'createdAt', sortDir: 'desc', page: 1, pageSize: 10 })
  const [meta, setMeta] = useState({ totalPages: 1 })
  const [showForm, setShowForm] = useState(false)
  const [taskFormErrors, setTaskFormErrors] = useState({})

  const load = () => {
    const params = { ...filters }
    Object.keys(params).forEach(k => { if (params[k] === '' || params[k] === null) delete params[k] })
    tasksApi.getByProject(projectId, params).then(res => {
      setTasks(res.data.data)
      setMeta({ totalPages: res.data.totalPages })
    })
  }

  useEffect(() => { projectsApi.getById(projectId).then(r => setProject(r.data)) }, [projectId])
  useEffect(() => { load() }, [projectId, filters])

  const createTask = async (payload) => {
    try {
      await tasksApi.create(projectId, toPayload(payload))
      setTaskFormErrors({}); setShowForm(false)
      load(); triggerRefresh(); notify('Task created!')
    } catch (err) {
      setTaskFormErrors(err?.response?.data?.errors || {})
    }
  }

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    await tasksApi.delete(id)
    load(); triggerRefresh(); notify('Task deleted', 'error')
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/projects">Projects</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{project?.name ?? '…'}</span>
      </div>

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Task Board</h1>
          {project && <p className="page-subtitle">{project.name}</p>}
        </div>
        <button onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <div className="card form-panel" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>New Task</h3>
          <TaskForm apiErrors={taskFormErrors} initial={INITIAL_TASK} onSubmit={createTask} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="filters-bar">
        <span className="filters-bar-label">Filter</span>
        <select className="filter-control" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All Status</option>
          {STATUS_LABELS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-control" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
          <option value="">All Priority</option>
          {PRIORITY_LABELS.map(p => <option key={p}>{p}</option>)}
        </select>
        <div className="filter-divider" />
        <span className="filters-bar-label">Sort</span>
        <select className="filter-control" value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="createdAt">Created</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
        <select className="filter-control" value={filters.sortDir} onChange={e => setFilters({ ...filters, sortDir: e.target.value })}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
      {error && <p className="error">{error}</p>}

      {!loading && tasks.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p className="empty-state-title">No tasks found</p>
            <p className="empty-state-desc">Add a task or adjust your filters.</p>
          </div>
        </div>
      )}

      <div className="grid">
        {tasks.map(t => {
          const priorityLabel = toLabel(t.priority, PRIORITY_LABELS)
          const statusLabel = toLabel(t.status, STATUS_LABELS)
          return (
            <article key={t.id} className={`card task-card ${isOverdue(t) ? 'overdue' : ''}`}>
              <p className="task-card-title">
                <Link to={`/tasks/${t.id}`}>{t.title}</Link>
              </p>
              {t.description && <p className="muted" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>{t.description}</p>}
              <div className="task-card-meta">
                <span className={`badge ${String(priorityLabel).toLowerCase()}`}>{priorityLabel}</span>
                <span className={`status-badge ${statusClass(statusLabel)}`}>{statusLabel}</span>
                {t.commentCount > 0 && <span className="muted" style={{ fontSize: '0.78rem' }}>💬 {t.commentCount}</span>}
              </div>
              <p className="task-card-due">Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</p>
              <div className="task-card-actions">
                <Link to={`/tasks/${t.id}`} className="primary-link-btn" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>View</Link>
                <button type="button" className="danger-btn" style={{ fontSize: '0.78rem', padding: '6px 10px' }} onClick={() => deleteTask(t.id)}>Delete</button>
              </div>
            </article>
          )
        })}
      </div>

      {meta.totalPages > 1 && (
        <div className="pagination">
          <button className="ghost" disabled={filters.page === 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>← Prev</button>
          <span className="pagination-info">Page {filters.page} of {meta.totalPages}</span>
          <button className="ghost" disabled={filters.page >= meta.totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next →</button>
        </div>
      )}
    </div>
  )
}
