import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey((v) => v + 1)

  return (
    <AppContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}
