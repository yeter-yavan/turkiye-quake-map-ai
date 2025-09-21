import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppStore, useHasError } from '@/stores/app'
import { useEarthquakeStore } from '@/stores/earthquake'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { ErrorBanner } from '@/components/ErrorBanner'

export default function App() {
  const {
    isLoading,
    sidebarOpen,
    setLoading,
    updateLastUpdate
  } = useAppStore()

  const hasError = useHasError()
  const { fetchEarthquakes } = useEarthquakeStore()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        await fetchEarthquakes()
        updateLastUpdate()
      } catch (error) {
        console.error('App initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [fetchEarthquakes, setLoading, updateLastUpdate])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {hasError && <ErrorBanner />}
        <Outlet />
      </main>

      <Sidebar open={sidebarOpen} />
      <LoadingOverlay show={isLoading} />
    </div>
  )
} 