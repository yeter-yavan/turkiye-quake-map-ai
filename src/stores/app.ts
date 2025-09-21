import { create } from 'zustand'
import type { MapConfig } from '@/types'

interface AppState {
  // State
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
  mapConfig: MapConfig
  sidebarOpen: boolean
  filtersOpen: boolean
  selectedEarthquake: string | null
  viewMode: 'map' | 'list' | 'analytics'

  // Actions
  setLoading: (loading: boolean) => void
  setError: (err: string | null) => void
  clearError: () => void
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'connecting') => void
  updateMapConfig: (config: Partial<MapConfig>) => void
  resetMapConfig: () => void
  toggleSidebar: () => void
  toggleFilters: () => void
  setSelectedEarthquake: (id: string | null) => void
  setViewMode: (mode: 'map' | 'list' | 'analytics') => void
  updateLastUpdate: () => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isLoading: false,
  error: null,
  lastUpdate: null,
  connectionStatus: 'disconnected',
  mapConfig: {
    center: [39.9334, 32.8597], // Ankara merkezi
    zoom: 6,
    minZoom: 5,
    maxZoom: 18
  },
  sidebarOpen: false,
  filtersOpen: false,
  selectedEarthquake: null,
  viewMode: 'map',

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (err) => set({ error: err }),
  
  clearError: () => set({ error: null }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  updateMapConfig: (config) => set((state) => ({
    mapConfig: { ...state.mapConfig, ...config }
  })),
  
  resetMapConfig: () => set({
    mapConfig: {
      center: [39.9334, 32.8597],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18
    }
  }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  toggleFilters: () => set((state) => ({ filtersOpen: !state.filtersOpen })),
  
  setSelectedEarthquake: (id) => set({ selectedEarthquake: id }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  updateLastUpdate: () => set({ lastUpdate: new Date() })
}))

// Selectors
export const useIsConnected = () => useAppStore((state) => state.connectionStatus === 'connected')
export const useHasError = () => useAppStore((state) => state.error !== null)
export const useIsMapView = () => useAppStore((state) => state.viewMode === 'map') 