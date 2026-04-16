import { createContext, useContext, useState, useCallback } from 'react'

const NotifyContext = createContext(null)

export function NotifyProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500)
  }, [])

  return (
    <NotifyContext.Provider value={{ notify }}>
      {children}
      <div className="toast-container">
        {notifications.map(n => (
          <div key={n.id} className={`toast toast-${n.type}`}>{n.message}</div>
        ))}
      </div>
    </NotifyContext.Provider>
  )
}

export const useNotify = () => useContext(NotifyContext)
