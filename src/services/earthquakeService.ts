import axios from 'axios'
import type { Earthquake } from '@/types'

// Kandilli API configuration
const KANDILLI_API_BASE = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live'

// API response types based on the actual API structure
interface KandilliAPIResponse {
  status: boolean
  httpStatus: number
  desc: string
  serverloadms: number
  metadata: {
    date_starts: string
    date_ends: string
    total: number
  }
  result: KandilliEarthquake[]
}

interface KandilliEarthquake {
  earthquake_id: string
  provider: string
  title: string
  date: string
  mag: number
  depth: number
  geojson: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
  location_properties: {
    closestCity: {
      name: string
      cityCode: number
      distance: number
      population: number
    }
    epiCenter: {
      name: string
      cityCode: number
      population: number
    }
    closestCities: Array<{
      name: string
      cityCode: number
      distance: number
      population: number
    }>
    airports: Array<{
      distance: number
      name: string
      code: string
      coordinates: {
        type: string
        coordinates: [number, number]
      }
    }>
  }
  rev: any
  date_time: string
  created_at: number
  location_tz: string
}

class EarthquakeService {
  private earthquakes: Earthquake[] = []

  async fetchEarthquakes(): Promise<Earthquake[]> {
    try {
      console.log('Fetching earthquakes from Kandilli API...')
      
      const response = await axios.get<KandilliAPIResponse>(`${KANDILLI_API_BASE}`, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Turkiye-Quake-Map-AI/1.0'
        }
      })

      if (!response.data.status) {
        throw new Error(`API Error: ${response.data.desc}`)
      }

      console.log(`API Response: ${response.data.result.length} earthquakes received`)
      
      // Transform API data to our Earthquake type
      this.earthquakes = response.data.result.map(this.transformKandilliData)
      
      // Sort by timestamp (newest first)
      this.earthquakes.sort((a, b) => b.timestamp - a.timestamp)
      
      console.log(`Transformed ${this.earthquakes.length} earthquakes`)
      return this.earthquakes
      
    } catch (error) {
      console.error('Error fetching earthquakes from Kandilli API:', error)
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...')
      return this.getMockEarthquakes()
    }
  }

  private transformKandilliData(kandilliEq: KandilliEarthquake): Earthquake {
    // Parse date from "2023.03.08 02:54:44" format
    const dateParts = kandilliEq.date.split(' ')
    const dateStr = dateParts[0].replace(/\./g, '-') // "2023.03.08" -> "2023-03-08"
    const timeStr = dateParts[1] || "00:00:00"
    
    // Extract coordinates (API returns [longitude, latitude])
    const [longitude, latitude] = kandilliEq.geojson.coordinates
    
    // Get location name from title or epiCenter
    const location = kandilliEq.title || kandilliEq.location_properties.epiCenter?.name || 'Bilinmeyen Konum'
    
    // Get province from epiCenter
    const province = kandilliEq.location_properties.epiCenter?.name || undefined
    
    // Get district from title (usually format: "DISTRICT-CITY")
    const district = kandilliEq.title?.split('-')[0]?.trim() || undefined
    
    // Simple anomaly detection based on magnitude and depth
    const isAnomaly = kandilliEq.mag > 5.0 && kandilliEq.depth < 10
    const anomalyScore = isAnomaly ? (kandilliEq.mag * 10 + (100 - kandilliEq.depth)) / 2 : 0

    return {
      id: kandilliEq.earthquake_id,
      date: dateStr,
      time: timeStr,
      latitude: latitude,
      longitude: longitude,
      magnitude: kandilliEq.mag,
      depth: kandilliEq.depth,
      location: location,
      province: province,
      district: district,
      source: 'Kandilli' as const,
      timestamp: kandilliEq.created_at * 1000, // Convert to milliseconds
      isAnomaly,
      anomalyScore
    }
  }

  // Fallback mock data in case API fails
  private getMockEarthquakes(): Earthquake[] {
    return [
      {
        id: 'mock_1',
        date: '2024-01-15',
        time: '14:30:25',
        latitude: 39.9334,
        longitude: 32.8597,
        magnitude: 4.2,
        depth: 12.5,
        location: 'Ankara, Çankaya',
        province: 'Ankara',
        district: 'Çankaya',
        source: 'Kandilli',
        timestamp: 1705323025000,
        isAnomaly: false
      },
      {
        id: 'mock_2',
        date: '2024-01-15',
        time: '12:15:10',
        latitude: 38.4192,
        longitude: 27.1287,
        magnitude: 5.1,
        depth: 8.2,
        location: 'İzmir, Bornova',
        province: 'İzmir',
        district: 'Bornova',
        source: 'Kandilli',
        timestamp: 1705316110000,
        isAnomaly: true,
        anomalyScore: 75.5
      }
    ]
  }

  async fetchLast24Hours(): Promise<Earthquake[]> {
    try {
      const response = await axios.get<KandilliAPIResponse>(`${KANDILLI_API_BASE}`, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Turkiye-Quake-Map-AI/1.0'
        }
      })

      if (!response.data.status) {
        throw new Error(`API Error: ${response.data.desc}`)
      }

      const allEarthquakes = response.data.result.map(this.transformKandilliData)
      
      // Filter last 24 hours
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      return allEarthquakes
        .filter(eq => eq.timestamp >= yesterday.getTime())
        .sort((a, b) => b.timestamp - a.timestamp)
        
    } catch (error) {
      console.error('Error fetching last 24 hours:', error)
      return this.getMockEarthquakes()
    }
  }

  async fetchByDateRange(startDate: string, endDate: string): Promise<Earthquake[]> {
    try {
      const response = await axios.get<KandilliAPIResponse>(`${KANDILLI_API_BASE}`, {
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Turkiye-Quake-Map-AI/1.0'
        }
      })

      if (!response.data.status) {
        throw new Error(`API Error: ${response.data.desc}`)
      }

      const allEarthquakes = response.data.result.map(this.transformKandilliData)
      
      // Filter by date range
      const start = new Date(startDate).getTime()
      const end = new Date(endDate + ' 23:59:59').getTime()
      
      return allEarthquakes
        .filter(eq => eq.timestamp >= start && eq.timestamp <= end)
        .sort((a, b) => b.timestamp - a.timestamp)
        
    } catch (error) {
      console.error('Error fetching by date range:', error)
      return this.getMockEarthquakes()
    }
  }

  getEarthquakeById(id: string): Earthquake | undefined {
    return this.earthquakes.find(eq => eq.id === id)
  }

  getEarthquakesByLocation(latitude: number, longitude: number, radius: number = 100): Earthquake[] {
    return this.earthquakes.filter(eq => {
      const distance = this.calculateDistance(latitude, longitude, eq.latitude, eq.longitude)
      return distance <= radius
    })
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
}

export const earthquakeService = new EarthquakeService() 