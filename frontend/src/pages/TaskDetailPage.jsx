import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { tasksApi, commentsApi } from '../services/api'
import { TaskForm } from '../components/TaskForm'
import { useNotify } from '../context/NotifyContext'
import { useAppContext } from '../context/AppContext'

const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Critical']
const STATUS_LABELS = ['Todo', 'InProgress', 'Review', 'Done']

const toPayload = (p) => ({
  ...p,
  priority: typeof p.priority === 'number' ? PRIORITY_LABELS[p.priority] : p.priority,
  status: typeof p.status === 'number' ? STATUS_LABELS[p.status] : p.status,
})

export default function TaskDetailPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { notify } = useNotify()
  const { triggerRefresh } = useAppContext()

  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState({ author: '', body: '' })
  const [successMessage, setSuccessMessage] = useState('')
  const [taskFormErrors, setTaskFormErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(''), 2200) }

  const load = async () => {
    try {
      const [taskRes, commentRes] = await Promise.all([tasksApi.getById(taskId), commentsApi.getByTask(taskId)])
      setTask(taskRes.data); setComments(commentRes.data)
    } catch (e) {
      setError(e?.message || 'Failed to load task')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [taskId])

  const saveTask = async (payload) => {
    try {
      await tasksApi.update(taskId, toPayload(payload))
      setTaskFormErrors({}); triggerRefresh(); load(); showSuccess('Task saved successfully.')
    } catch (err) { setTaskFormErrors(err?.response?.data?.errors || {}) }
  }

  const removeTask = async () => {
    if (!window.confirm('Delete this task?')) return
    await tasksApi.delete(taskId)
    triggerRefresh(); notify('Task deleted', 'error'); navigate(-1)
  }

  const addComment = async (e) => {
    e.preventDefault()
    await commentsApi.create(taskId, comment)
    setComment({ author: '', body: '' }); load(); showSuccess('Comment added.')
  }

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete comment?')) return
    await commentsApi.delete(commentId); load(); showSuccess('Comment deleted.')
  }

  if (loading && !task) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (error && !task) return <p className="error">⚠ {error}</p>
  if (!task) return null

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/projects">Projects</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ cursor: 'pointer', color: 'var(--muted)' }} onClick={() => navigate(-1)}>Task Board</span>
        <span className="breadcrumb-sep">›</span>
        <span>{task.title}</span>
      </div>

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Task Detail</h1>
          <p className="page-subtitle">{task.title}</p>
        </div>
        <div className="row">
          <button type="button" className="ghost" onClick={() => navigate(-1)}>← Back</button>
          <button type="button" className="danger-btn" onClick={removeTask}>Delete Task</button>
        </div>
      </div>

      {successMessage && <p className="success-msg" style={{ marginBottom: 16 }}>✓ {successMessage}</p>}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Edit Task</h3>
        <TaskForm
          apiErrors={taskFormErrors}
          initial={{ ...task, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' }}
          onSubmit={saveTask}
        />
      </div>

      <div className="card">
        <div className="section-header">
          <h3 style={{ fontSize: '0.95rem' }}>Comments <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({comments.length})</span></h3>
        </div>

        <form onSubmit={addComment} className="form" style={{ marginBottom: 20 }}>
          <input
            required
            maxLength={50}
            placeholder="Your name"
            value={comment.author}
            onChange={e => setComment({ ...comment, author: e.target.value })}
          />
          <textarea
            required
            maxLength={500}
            placeholder="Write a comment…"
            rows={3}
            value={comment.body}
            onChange={e => setComment({ ...comment, body: e.target.value })}
          />
          <div>
            <button type="submit">Add Comment</button>
          </div>
        </form>

        {comments.length === 0 && (
          <p className="muted" style={{ textAlign: 'center', padding: '16px 0' }}>No comments yet. Be the first to comment.</p>
        )}

        {comments.map(c => (
          <div key={c.id} className="comment">
            <div className="comment-header">
              <div className="row" style={{ gap: 8 }}>
                <span className="comment-author">{c.author}</span>
                <span className="comment-date">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <button type="button" className="ghost" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => deleteComment(c.id)}>Delete</button>
            </div>
            <p className="comment-body">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
