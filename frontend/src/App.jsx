import { BrowserRouter, Link, Routes, Route, useLocation } from 'react-router-dom'
import { NotifyProvider } from './context/NotifyContext'
import { AppProvider, useAppContext } from './context/AppContext'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import TaskBoardPage from './pages/TaskBoardPage'
import TaskDetailPage from './pages/TaskDetailPage'
import './styles/main.css'

function Sidebar() {
  const { pathname } = useLocation()
  useAppContext()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">📋</div>
        <span className="brand-name">TaskBoard</span>
      </div>
      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        <Link className={`nav-item ${pathname === '/' || pathname === '/dashboard' ? 'active' : ''}`} to="/">
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link className={`nav-item ${pathname.startsWith('/projects') ? 'active' : ''}`} to="/projects">
          <span className="nav-icon">📁</span>
          <span>Projects</span>
        </Link>
      </nav>

    </aside>
  )
}

function AppShell() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-body">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<TaskBoardPage />} />
            <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <NotifyProvider>
          <AppShell />
        </NotifyProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
