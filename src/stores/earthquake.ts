import { create } from 'zustand'
import type { Earthquake } from '@/types'
import { earthquakeService } from '@/services/earthquakeService'

interface EarthquakeState {
  // State
  earthquakes: Earthquake[]
  filteredEarthquakes: Earthquake[]
  totalCount: number
  anomalyCount: number
  isLoading: boolean
  error: string | null
  filters: {
    minMagnitude: number
    maxMagnitude: number
    minDepth: number
    maxDepth: number
    dateRange: {
      start: Date | null
      end: Date | null
    }
    sources: ('Kandilli')[] // Updated to only support Kandilli
    showAnomalies: boolean
  }

  // Actions
  fetchEarthquakes: () => Promise<void>
  setEarthquakes: (earthquakes: Earthquake[]) => void
  addEarthquake: (earthquake: Earthquake) => void
  updateEarthquake: (id: string, updates: Partial<Earthquake>) => void
  removeEarthquake: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateFilters: (filters: Partial<EarthquakeState['filters']>) => void
  applyFilters: () => void
  clearFilters: () => void
  detectAnomalies: () => void
}

export const useEarthquakeStore = create<EarthquakeState>((set, get) => ({
  // Initial state
  earthquakes: [],
  filteredEarthquakes: [],
  totalCount: 0,
  anomalyCount: 0,
  isLoading: false,
  error: null,
  filters: {
    minMagnitude: 0,
    maxMagnitude: 10,
    minDepth: 0,
    maxDepth: 1000,
    dateRange: {
      start: null,
      end: null
    },
    sources: ['Kandilli'], // Updated to only support Kandilli
    showAnomalies: false
  },

  // Actions
  fetchEarthquakes: async () => {
    try {
      set({ isLoading: true, error: null })
      const earthquakes = await earthquakeService.fetchEarthquakes()
      set({ 
        earthquakes, 
        filteredEarthquakes: earthquakes,
        totalCount: earthquakes.length,
        anomalyCount: earthquakes.filter(eq => eq.isAnomaly).length
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      set({ isLoading: false })
    }
  },

  setEarthquakes: (earthquakes) => set({ 
    earthquakes, 
    filteredEarthquakes: earthquakes,
    totalCount: earthquakes.length 
  }),

  addEarthquake: (earthquake) => set((state) => {
    const newEarthquakes = [earthquake, ...state.earthquakes]
    return {
      earthquakes: newEarthquakes,
      filteredEarthquakes: newEarthquakes,
      totalCount: newEarthquakes.length
    }
  }),

  updateEarthquake: (id, updates) => set((state) => {
    const updatedEarthquakes = state.earthquakes.map(eq => 
      eq.id === id ? { ...eq, ...updates } : eq
    )
    return {
      earthquakes: updatedEarthquakes,
      filteredEarthquakes: updatedEarthquakes
    }
  }),

  removeEarthquake: (id) => set((state) => {
    const filteredEarthquakes = state.earthquakes.filter(eq => eq.id !== id)
    return {
      earthquakes: filteredEarthquakes,
      filteredEarthquakes,
      totalCount: filteredEarthquakes.length
    }
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  updateFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  applyFilters: () => {
    const { earthquakes, filters } = get()
    let filtered = earthquakes

    // Magnitude filter
    filtered = filtered.filter(eq => 
      eq.magnitude >= filters.minMagnitude && eq.magnitude <= filters.maxMagnitude
    )

    // Depth filter
    filtered = filtered.filter(eq => 
      eq.depth >= filters.minDepth && eq.depth <= filters.maxDepth
    )

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(eq => 
        new Date(eq.date) >= filters.dateRange.start!
      )
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(eq => 
        new Date(eq.date) <= filters.dateRange.end!
      )
    }

    // Source filter (only Kandilli for now)
    filtered = filtered.filter(eq => filters.sources.includes(eq.source))

    // Anomaly filter
    if (filters.showAnomalies) {
      filtered = filtered.filter(eq => eq.isAnomaly)
    }

    set({ 
      filteredEarthquakes: filtered,
      anomalyCount: filtered.filter(eq => eq.isAnomaly).length
    })
  },

  clearFilters: () => set((state) => ({
    filters: {
      minMagnitude: 0,
      maxMagnitude: 10,
      minDepth: 0,
      maxDepth: 1000,
      dateRange: {
        start: null,
        end: null
      },
      sources: ['Kandilli'], // Updated to only support Kandilli
      showAnomalies: false
    },
    filteredEarthquakes: state.earthquakes
  })),

  detectAnomalies: () => {
    // Simple anomaly detection based on magnitude and depth
    const { earthquakes } = get()
    const updatedEarthquakes = earthquakes.map(eq => {
      const isAnomaly = eq.magnitude > 5.0 && eq.depth < 10
      const anomalyScore = isAnomaly ? (eq.magnitude * 10 + (100 - eq.depth)) / 2 : 0
      
      return {
        ...eq,
        isAnomaly,
        anomalyScore
      }
    })

    set({ 
      earthquakes: updatedEarthquakes,
      filteredEarthquakes: updatedEarthquakes,
      anomalyCount: updatedEarthquakes.filter(eq => eq.isAnomaly).length
    })
  }
}))

// Selectors
export const useEarthquakes = () => useEarthquakeStore((state) => state.earthquakes)
export const useFilteredEarthquakes = () => useEarthquakeStore((state) => state.filteredEarthquakes)
export const useEarthquakeFilters = () => useEarthquakeStore((state) => state.filters)
export const useEarthquakeLoading = () => useEarthquakeStore((state) => state.isLoading)
export const useEarthquakeError = () => useEarthquakeStore((state) => state.error) 