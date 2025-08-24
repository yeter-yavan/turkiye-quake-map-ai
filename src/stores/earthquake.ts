import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Earthquake, FilterOptions } from '@/types'
import { earthquakeService } from '@/services/earthquakeService'

export const useEarthquakeStore = defineStore('earthquake', () => {
  // State
  const earthquakes = ref<Earthquake[]>([])
  const filteredEarthquakes = ref<Earthquake[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdate = ref<Date | null>(null)
  
  // Filtreler
  const filters = ref<FilterOptions>({
    minMagnitude: 0,
    maxMagnitude: 10,
    minDepth: 0,
    maxDepth: 1000,
    dateRange: {
      start: null,
      end: null
    },
    sources: ['AFAD', 'Kandilli'],
    showAnomalies: false
  })

  // Getters
  const totalCount = computed(() => earthquakes.value.length)
  const anomalyCount = computed(() => earthquakes.value.filter(eq => eq.isAnomaly).length)
  const latestEarthquakes = computed(() => 
    [...earthquakes.value]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
  )
  
  const strongestEarthquakes = computed(() => 
    [...earthquakes.value]
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 5)
  )

  // Actions
  const fetchEarthquakes = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const data = await earthquakeService.fetchAll()
      earthquakes.value = data
      lastUpdate.value = new Date()
      
      applyFilters()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Deprem verisi alınamadı'
      console.error('Error fetching earthquakes:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addEarthquake = (earthquake: Earthquake) => {
    // Duplicate kontrolü
    const exists = earthquakes.value.find(eq => eq.id === earthquake.id)
    if (!exists) {
      earthquakes.value.unshift(earthquake)
      applyFilters()
    }
  }

  const updateEarthquake = (id: string, updates: Partial<Earthquake>) => {
    const index = earthquakes.value.findIndex(eq => eq.id === id)
    if (index !== -1) {
      earthquakes.value[index] = { ...earthquakes.value[index], ...updates }
      applyFilters()
    }
  }

  const removeEarthquake = (id: string) => {
    const index = earthquakes.value.findIndex(eq => eq.id === id)
    if (index !== -1) {
      earthquakes.value.splice(index, 1)
      applyFilters()
    }
  }

  const applyFilters = () => {
    let filtered = [...earthquakes.value]

    // Magnitude filtresi
    filtered = filtered.filter(eq => 
      eq.magnitude >= filters.value.minMagnitude && 
      eq.magnitude <= filters.value.maxMagnitude
    )

    // Depth filtresi
    filtered = filtered.filter(eq => 
      eq.depth >= filters.value.minDepth && 
      eq.depth <= filters.value.maxDepth
    )

    // Source filtresi
    filtered = filtered.filter(eq => 
      filters.value.sources.includes(eq.source)
    )

    // Date range filtresi
    if (filters.value.dateRange.start) {
      filtered = filtered.filter(eq => 
        new Date(eq.date) >= filters.value.dateRange.start!
      )
    }
    
    if (filters.value.dateRange.end) {
      filtered = filtered.filter(eq => 
        new Date(eq.date) <= filters.value.dateRange.end!
      )
    }

    // Anomali filtresi
    if (filters.value.showAnomalies) {
      filtered = filtered.filter(eq => eq.isAnomaly)
    }

    filteredEarthquakes.value = filtered
  }

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters }
    applyFilters()
  }

  const clearFilters = () => {
    filters.value = {
      minMagnitude: 0,
      maxMagnitude: 10,
      minDepth: 0,
      maxDepth: 1000,
      dateRange: {
        start: null,
        end: null
      },
      sources: ['AFAD', 'Kandilli'],
      showAnomalies: false
    }
    applyFilters()
  }

  const getEarthquakeById = (id: string) => {
    return earthquakes.value.find(eq => eq.id === id)
  }

  const getEarthquakesByLocation = (latitude: number, longitude: number, radius: number = 100) => {
    return earthquakes.value.filter(eq => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        eq.latitude, 
        eq.longitude
      )
      return distance <= radius
    })
  }

  // Yardımcı fonksiyonlar
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Dünya yarıçapı (km)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  return {
    // State
    earthquakes,
    filteredEarthquakes,
    isLoading,
    error,
    lastUpdate,
    filters,
    
    // Getters
    totalCount,
    anomalyCount,
    latestEarthquakes,
    strongestEarthquakes,
    
    // Actions
    fetchEarthquakes,
    addEarthquake,
    updateEarthquake,
    removeEarthquake,
    applyFilters,
    updateFilters,
    clearFilters,
    getEarthquakeById,
    getEarthquakesByLocation
  }
}) 