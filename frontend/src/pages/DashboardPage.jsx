import { useEffect } from 'react'
import { dashboardApi } from '../services/api'
import { useApi } from '../hooks/useApi'
import { useAppContext } from '../context/AppContext'

export default function DashboardPage() {
  const { data, loading, error, execute } = useApi(dashboardApi.get)
  const { refreshKey } = useAppContext()

  useEffect(() => { execute() }, [execute, refreshKey])

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>
  if (error) return <p className="error">⚠ {error}</p>
  if (!data) return null

  const statusEntries = Object.entries(data.tasksByStatus || {})

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your projects and tasks</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card accent-indigo">
          <div className="stat-card-top">
            <span className="stat-label">Total Projects</span>
            <div className="stat-icon">📁</div>
          </div>
          <p className="stat-value">{data.totalProjects}</p>
        </div>
        <div className="stat-card accent-indigo">
          <div className="stat-card-top">
            <span className="stat-label">Total Tasks</span>
            <div className="stat-icon">✅</div>
          </div>
          <p className="stat-value">{data.totalTasks}</p>
        </div>
        <div className="stat-card accent-red">
          <div className="stat-card-top">
            <span className="stat-label">Overdue Tasks</span>
            <div className="stat-icon">⚠️</div>
          </div>
          <p className="stat-value">{data.overdueTasks}</p>
        </div>
        <div className="stat-card accent-amber">
          <div className="stat-card-top">
            <span className="stat-label">Due in 7 Days</span>
            <div className="stat-icon">📅</div>
          </div>
          <p className="stat-value">{data.dueWithin7Days}</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 14, fontSize: '0.95rem' }}>Tasks by Status</h3>
        {statusEntries.length === 0
          ? <p className="muted">No task data available.</p>
          : (
            <div className="status-grid">
              {statusEntries.map(([status, count]) => (
                <div className="status-item" key={status}>
                  <span>{status}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}
