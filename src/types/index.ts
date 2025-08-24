// Deprem verisi tipleri
export interface Earthquake {
  id: string
  date: string
  time: string
  latitude: number
  longitude: number
  magnitude: number
  depth: number
  location: string
  province?: string
  district?: string
  source: 'AFAD' | 'Kandilli'
  timestamp: number
  isAnomaly?: boolean
  anomalyScore?: number
}

// AFAD API response tipi
export interface AFADResponse {
  data: Array<{
    id: string
    date: string
    time: string
    latitude: number
    longitude: number
    magnitude: number
    depth: number
    location: string
    province?: string
    district?: string
  }>
  success: boolean
  message?: string
}

// Kandilli API response tipi
export interface KandilliResponse {
  data: Array<{
    id: string
    date: string
    time: string
    latitude: number
    longitude: number
    magnitude: number
    depth: number
    location: string
    province?: string
    district?: string
  }>
  success: boolean
  message?: string
}

// Harita konfigürasyonu
export interface MapConfig {
  center: [number, number]
  zoom: number
  minZoom: number
  maxZoom: number
}

// Filtre seçenekleri
export interface FilterOptions {
  minMagnitude: number
  maxMagnitude: number
  minDepth: number
  maxDepth: number
  dateRange: {
    start: Date | null
    end: Date | null
  }
  sources: ('AFAD' | 'Kandilli')[]
  showAnomalies: boolean
}

// AI anomali tespiti sonucu
export interface AnomalyDetection {
  earthquakeId: string
  score: number
  isAnomaly: boolean
  factors: string[]
  confidence: number
}

// WebSocket mesaj tipleri
export interface WebSocketMessage {
  type: 'new_earthquake' | 'update_earthquake' | 'anomaly_detected' | 'system_status'
  data: any
  timestamp: number
}

// Uygulama durumu
export interface AppState {
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
}

// Orhan Aydoğdu API Response
export interface OrhanAydogduResponse {
  status: boolean
  httpStatus: number
  desc: string
  serverloadms: number
  metadata: {
    date_starts: string
    date_ends: string
    total: number
  }
  result: OrhanAydogduEarthquake[]
}

export interface OrhanAydogduEarthquake {
  _id: string
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

// Deprem zonu tipleri
export interface EarthquakeZone {
  id: string
  name: string
  type: 'fault_line' | 'tectonic_plate' | 'seismic_zone' | 'historical'
  coordinates: [number, number][]
  properties: {
    risk_level: 'low' | 'medium' | 'high' | 'very_high'
    description: string
    last_major_earthquake?: string
    average_magnitude?: number
    color: string
    opacity: number
  }
}

// Deprem zonu katmanı
export interface ZoneLayer {
  id: string
  name: string
  visible: boolean
  zones: EarthquakeZone[]
}

// Harita modu
export type MapMode = 'earthquakes' | 'zones' | 'combined' 