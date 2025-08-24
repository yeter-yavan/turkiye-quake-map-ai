import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppState, MapConfig } from '@/types'

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdate = ref<Date | null>(null)
  const connectionStatus = ref<'connected' | 'disconnected' | 'connecting'>('disconnected')
  
  // Harita konfigürasyonu
  const mapConfig = ref<MapConfig>({
    center: [39.9334, 32.8597], // Ankara merkezi
    zoom: 6,
    minZoom: 5,
    maxZoom: 18
  })

  // UI durumu
  const sidebarOpen = ref(false)
  const filtersOpen = ref(false)
  const selectedEarthquake = ref<string | null>(null)
  const viewMode = ref<'map' | 'list' | 'analytics'>('map')

  // Getters
  const isConnected = computed(() => connectionStatus.value === 'connected')
  const hasError = computed(() => error.value !== null)
  const isMapView = computed(() => viewMode.value === 'map')

  // Actions
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  const setConnectionStatus = (status: 'connected' | 'disconnected' | 'connecting') => {
    connectionStatus.value = status
  }

  const updateMapConfig = (config: Partial<MapConfig>) => {
    mapConfig.value = { ...mapConfig.value, ...config }
  }

  const resetMapConfig = () => {
    mapConfig.value = {
      center: [39.9334, 32.8597],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18
    }
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const toggleFilters = () => {
    filtersOpen.value = !filtersOpen.value
  }

  const setSelectedEarthquake = (id: string | null) => {
    selectedEarthquake.value = id
  }

  const setViewMode = (mode: 'map' | 'list' | 'analytics') => {
    viewMode.value = mode
  }

  const updateLastUpdate = () => {
    lastUpdate.value = new Date()
  }

  return {
    // State
    isLoading,
    error,
    lastUpdate,
    connectionStatus,
    mapConfig,
    sidebarOpen,
    filtersOpen,
    selectedEarthquake,
    viewMode,
    
    // Getters
    isConnected,
    hasError,
    isMapView,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setConnectionStatus,
    updateMapConfig,
    resetMapConfig,
    toggleSidebar,
    toggleFilters,
    setSelectedEarthquake,
    setViewMode,
    updateLastUpdate
  }
}) 