import axios from 'axios'
import type { Earthquake, AFADResponse, OrhanAydogduResponse } from '@/types'

// API konfigürasyonu - Proxy üzerinden
const API_CONFIG = {
  AFAD: {
    baseURL: '/api/afad', // Proxy üzerinden
    endpoints: {
      earthquakes: '/earthquake/filter',
      last24h: '/earthquake/last24h',
      last7days: '/earthquake/last7days',
      last30days: '/earthquake/last30days'
    }
  },
  KANDILLI: {
    baseURL: '/api/kandilli', // Proxy üzerinden
    endpoints: {
      earthquakes: '', // Ana endpoint
      last24h: '', // Aynı endpoint, client-side filtering
      last7days: '' // Aynı endpoint, client-side filtering
    }
  }
}

// AFAD API service
class AFADService {
  private baseURL = API_CONFIG.AFAD.baseURL

  async fetchEarthquakes(params: {
    startDate?: string
    endDate?: string
    minMagnitude?: number
    maxMagnitude?: number
    minDepth?: number
    maxDepth?: number
    limit?: number
  } = {}): Promise<Earthquake[]> {
    try {
      const response = await axios.post<AFADResponse>(
        `${this.baseURL}${API_CONFIG.AFAD.endpoints.earthquakes}`,
        {
          startDate: params.startDate || this.getDefaultStartDate(),
          endDate: params.endDate || this.getDefaultEndDate(),
          minMagnitude: params.minMagnitude || 0,
          maxMagnitude: params.maxMagnitude || 10,
          minDepth: params.minDepth || 0,
          maxDepth: params.maxDepth || 1000,
          limit: params.limit || 1000
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'AFAD API hatası')
      }

      return this.transformAFADData(response.data.data)
    } catch (error) {
      console.error('AFAD API Error:', error)
      throw new Error('AFAD verisi alınamadı')
    }
  }

  async fetchLast24Hours(): Promise<Earthquake[]> {
    try {
      const response = await axios.get<AFADResponse>(
        `${this.baseURL}${API_CONFIG.AFAD.endpoints.last24h}`,
        {
          timeout: 30000
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'AFAD API hatası')
      }

      return this.transformAFADData(response.data.data)
    } catch (error) {
      console.error('AFAD Last24h Error:', error)
      throw new Error('Son 24 saat verisi alınamadı')
    }
  }

  async fetchLast7Days(): Promise<Earthquake[]> {
    try {
      const response = await axios.get<AFADResponse>(
        `${this.baseURL}${API_CONFIG.AFAD.endpoints.last7days}`,
        {
          timeout: 30000
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'AFAD API hatası')
      }

      return this.transformAFADData(response.data.data)
    } catch (error) {
      console.error('AFAD Last7Days Error:', error)
      throw new Error('Son 7 gün verisi alınamadı')
    }
  }

  private transformAFADData(data: any[]): Earthquake[] {
    return data.map(item => ({
      id: item.id || `afad_${Date.now()}_${Math.random()}`,
      date: item.date || new Date().toISOString().split('T')[0],
      time: item.time || new Date().toTimeString().split(' ')[0],
      latitude: parseFloat(item.latitude) || 0,
      longitude: parseFloat(item.longitude) || 0,
      magnitude: parseFloat(item.magnitude) || 0,
      depth: parseFloat(item.depth) || 0,
      location: item.location || 'Bilinmeyen Konum',
      province: item.province,
      district: item.district,
      source: 'AFAD' as const,
      timestamp: new Date(`${item.date} ${item.time}`).getTime(),
      isAnomaly: false,
      anomalyScore: 0
    }))
  }

  private getDefaultStartDate(): string {
    const date = new Date()
    date.setDate(date.getDate() - 30) // Son 30 gün
    return date.toISOString().split('T')[0]
  }

  private getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0]
  }
}

// Kandilli API service (Orhan Aydoğdu API kullanarak)
class KandilliService {
  private baseURL = API_CONFIG.KANDILLI.baseURL

  async fetchEarthquakes(params: {
    startDate?: string
    endDate?: string
    minMagnitude?: number
    maxMagnitude?: number
    limit?: number
  } = {}): Promise<Earthquake[]> {
    try {
      const response = await axios.get<OrhanAydogduResponse>(
        `${this.baseURL}${API_CONFIG.KANDILLI.endpoints.earthquakes}`,
        {
          timeout: 30000
        }
      )

      if (!response.data.status) {
        throw new Error('Kandilli API hatası')
      }

      let earthquakes = this.transformOrhanAydogduData(response.data.result)
      
      // Client-side filtering
      if (params.minMagnitude) {
        earthquakes = earthquakes.filter(eq => eq.magnitude >= params.minMagnitude!)
      }
      if (params.maxMagnitude) {
        earthquakes = earthquakes.filter(eq => eq.magnitude <= params.maxMagnitude!)
      }
      if (params.startDate || params.endDate) {
        earthquakes = this.filterByDateRange(earthquakes, params.startDate, params.endDate)
      }
      if (params.limit) {
        earthquakes = earthquakes.slice(0, params.limit)
      }

      return earthquakes
    } catch (error) {
      console.error('Kandilli API Error:', error)
      throw new Error('Kandilli verisi alınamadı')
    }
  }

  async fetchLast24Hours(): Promise<Earthquake[]> {
    try {
      const response = await axios.get<OrhanAydogduResponse>(
        `${this.baseURL}${API_CONFIG.KANDILLI.endpoints.earthquakes}`,
        {
          timeout: 30000
        }
      )

      if (!response.data.status) {
        throw new Error('Kandilli API hatası')
      }

      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      return this.transformOrhanAydogduData(response.data.result)
        .filter(eq => eq.timestamp >= yesterday.getTime())
        .sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Kandilli Last24h Error:', error)
      throw new Error('Son 24 saat verisi alınamadı')
    }
  }

  private transformOrhanAydogduData(data: any[]): Earthquake[] {
    return data.map(item => {
      // Orhan Aydoğdu API'de coordinates [longitude, latitude] formatında
      const [longitude, latitude] = item.geojson.coordinates
      
      return {
        id: item.earthquake_id || `kandilli_${Date.now()}_${Math.random()}`,
        date: item.date.replace(/\./g, '-'), // "2025.08.21" -> "2025-08-21"
        time: item.date_time.split(' ')[1] || '00:00:00', // "2025-08-21 17:20:11" -> "17:20:11"
        latitude: latitude,
        longitude: longitude,
        magnitude: parseFloat(item.mag) || 0,
        depth: parseFloat(item.depth) || 0,
        location: item.title || 'Bilinmeyen Konum',
        province: item.location_properties?.epiCenter?.name || 'Bilinmeyen',
        district: item.title?.split('-')[1]?.trim() || 'Bilinmeyen',
        source: 'Kandilli' as const,
        timestamp: new Date(item.date_time).getTime(),
        isAnomaly: false,
        anomalyScore: 0
      }
    })
  }

  private filterByDateRange(earthquakes: Earthquake[], startDate?: string, endDate?: string): Earthquake[] {
    let filtered = earthquakes

    if (startDate) {
      const start = new Date(startDate).getTime()
      filtered = filtered.filter(eq => eq.timestamp >= start)
    }

    if (endDate) {
      const end = new Date(endDate + ' 23:59:59').getTime()
      filtered = filtered.filter(eq => eq.timestamp <= end)
    }

    return filtered
  }
}

// Ana service class
class EarthquakeService {
  private afadService = new AFADService()
  private kandilliService = new KandilliService()

  async fetchAll(): Promise<Earthquake[]> {
    try {
      const [afadData, kandilliData] = await Promise.allSettled([
        this.afadService.fetchEarthquakes(),
        this.kandilliService.fetchEarthquakes()
      ])

      const earthquakes: Earthquake[] = []

      if (afadData.status === 'fulfilled') {
        earthquakes.push(...afadData.value)
      }

      if (kandilliData.status === 'fulfilled') {
        earthquakes.push(...kandilliData.value)
      }

      // Duplicate kontrolü ve sıralama
      const uniqueEarthquakes = this.removeDuplicates(earthquakes)
      return uniqueEarthquakes.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Fetch All Error:', error)
      throw new Error('Deprem verisi alınamadı')
    }
  }

  async fetchLast24Hours(): Promise<Earthquake[]> {
    try {
      const [afadData, kandilliData] = await Promise.allSettled([
        this.afadService.fetchLast24Hours(),
        this.kandilliService.fetchLast24Hours()
      ])

      const earthquakes: Earthquake[] = []

      if (afadData.status === 'fulfilled') {
        earthquakes.push(...afadData.value)
      }

      if (kandilliData.status === 'fulfilled') {
        earthquakes.push(...kandilliData.value)
      }

      const uniqueEarthquakes = this.removeDuplicates(earthquakes)
      return uniqueEarthquakes.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Last24h Error:', error)
      throw new Error('Son 24 saat verisi alınamadı')
    }
  }

  async fetchByDateRange(startDate: string, endDate: string): Promise<Earthquake[]> {
    try {
      const [afadData, kandilliData] = await Promise.allSettled([
        this.afadService.fetchEarthquakes({ startDate, endDate }),
        this.kandilliService.fetchEarthquakes({ startDate, endDate })
      ])

      const earthquakes: Earthquake[] = []

      if (afadData.status === 'fulfilled') {
        earthquakes.push(...afadData.value)
      }

      if (kandilliData.status === 'fulfilled') {
        earthquakes.push(...kandilliData.value)
      }

      const uniqueEarthquakes = this.removeDuplicates(earthquakes)
      return uniqueEarthquakes.sort((a, b) => b.timestamp - a.timestamp)
    } catch (error) {
      console.error('Date Range Error:', error)
      throw new Error('Tarih aralığı verisi alınamadı')
    }
  }

  private removeDuplicates(earthquakes: Earthquake[]): Earthquake[] {
    const seen = new Set<string>()
    return earthquakes.filter(eq => {
      const key = `${eq.latitude}_${eq.longitude}_${eq.magnitude}_${eq.timestamp}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }
}

// Service instance
export const earthquakeService = new EarthquakeService() 