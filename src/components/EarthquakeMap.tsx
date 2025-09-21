import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEarthquakeStore } from '@/stores/earthquake'
import { useAppStore } from '@/stores/app'
import type { Earthquake, MapConfig } from '@/types'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ZoomIn, ZoomOut, MapIcon } from 'lucide-react'

interface EarthquakeMapProps {
  earthquakes?: Earthquake[]
  center?: [number, number]
  zoom?: number
  onEarthquakeClick?: (earthquake: Earthquake) => void
  onMapMove?: (config: MapConfig) => void
}

// Custom hook for map events
function MapEvents({ onMapMove }: { onMapMove?: (config: MapConfig) => void }) {
  const map = useMap()
  const { updateMapConfig } = useAppStore()

  useEffect(() => {
    const handleMapMove = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()

      const config: MapConfig = {
        center: [center.lat, center.lng],
        zoom,
        minZoom: 5,
        maxZoom: 18
      }

      onMapMove?.(config)
      updateMapConfig(config)
    }

    map.on('moveend', handleMapMove)
    map.on('zoomend', handleMapMove)

    return () => {
      map.off('moveend', handleMapMove)
      map.off('zoomend', handleMapMove)
    }
  }, [map, onMapMove, updateMapConfig])

  return null
}

// Custom hook for map controls
function MapControls({ selectedTileLayer, onTileLayerChange }: { 
  selectedTileLayer: string
  onTileLayerChange: (value: string) => void 
}) {
  const map = useMap()

  const zoomIn = useCallback(() => {
    map.zoomIn()
  }, [map])

  const zoomOut = useCallback(() => {
    map.zoomOut()
  }, [map])

  return (
    <div className="absolute top-4 left-4 z-10 space-y-2">
      {/* Zoom controls */}
      <Card className="p-2">
        <div className="space-y-1">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={zoomIn}
            title="Yakınlaştır"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={zoomOut}
            title="Uzaklaştır"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
      </Card>
      
      {/* Tile layer selector */}
      <Card className="p-2">
        <Select value={selectedTileLayer} onValueChange={onTileLayerChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="osm">OpenStreetMap</SelectItem>
            <SelectItem value="satellite">Uydu</SelectItem>
            <SelectItem value="terrain">Arazi</SelectItem>
          </SelectContent>
        </Select>
      </Card>
    </div>
  )
}

export function EarthquakeMap({
  earthquakes = [],
  center = [39.9334, 32.8597], // Ankara merkezi
  zoom = 6,
  onEarthquakeClick,
  onMapMove
}: EarthquakeMapProps) {
  const [selectedTileLayer, setSelectedTileLayer] = useState('osm')
  const { totalCount, anomalyCount } = useEarthquakeStore()
  const { setSelectedEarthquake } = useAppStore()

  const tileLayers = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  }

  const getMarkerColor = (magnitude: number): string => {
    if (magnitude >= 6.0) return '#dc2626' // Kırmızı - Büyük deprem
    if (magnitude >= 5.0) return '#ea580c' // Turuncu - Orta-büyük
    if (magnitude >= 4.0) return '#f59e0b' // Sarı - Orta
    if (magnitude >= 3.0) return '#10b981' // Yeşil - Küçük
    return '#6b7280' // Gri - Çok küçük
  }

  const createMarkerIcon = (magnitude: number) => {
    return L.divIcon({
      className: 'earthquake-marker',
      html: `
        <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
             style="background-color: ${getMarkerColor(magnitude)};">
          ${magnitude.toFixed(1)}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  const handleEarthquakeClick = useCallback((earthquake: Earthquake) => {
    onEarthquakeClick?.(earthquake)
    setSelectedEarthquake(earthquake.id)
  }, [onEarthquakeClick, setSelectedEarthquake])

  const handleTileLayerChange = (value: string) => {
    setSelectedTileLayer(value)
  }

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={5}
        maxZoom={18}
        zoomControl={false}
        attributionControl={true}
        className="w-full h-full rounded-lg shadow-lg"
      >
        <TileLayer
          url={tileLayers[selectedTileLayer as keyof typeof tileLayers]}
          attribution={selectedTileLayer === 'osm' ? '© OpenStreetMap contributors' : 
                      selectedTileLayer === 'satellite' ? '© Esri' : '© OpenTopoMap'}
        />
        
        <MapEvents onMapMove={onMapMove} />
        <MapControls 
          selectedTileLayer={selectedTileLayer}
          onTileLayerChange={handleTileLayerChange}
        />

        {/* Earthquake markers */}
        {earthquakes.map((earthquake) => (
          <Marker
            key={earthquake.id}
            position={[earthquake.latitude, earthquake.longitude]}
            icon={createMarkerIcon(earthquake.magnitude)}
            eventHandlers={{
              click: () => handleEarthquakeClick(earthquake)
            }}
          >
            <Popup>
              <div className="earthquake-popup">
                <h3 className="font-bold text-lg mb-2">
                  {earthquake.magnitude} Büyüklüğünde Deprem
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Konum:</strong> {earthquake.location}</p>
                  <p><strong>Tarih:</strong> {earthquake.date}</p>
                  <p><strong>Saat:</strong> {earthquake.time}</p>
                  <p><strong>Derinlik:</strong> {earthquake.depth} km</p>
                  <p><strong>Kaynak:</strong> {earthquake.source}</p>
                  {earthquake.isAnomaly && (
                    <p className="text-warning-600 font-semibold">
                      ⚠️ AI Anomali Tespit Edildi
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map info panel */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="max-w-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center space-x-2">
              <MapIcon className="w-4 h-4" />
              <span>Harita Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Toplam Deprem:</span>
              <span className="font-medium text-foreground">{totalCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Görünen:</span>
              <span className="font-medium text-foreground">{earthquakes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Anomali:</span>
              <span className="font-medium text-warning-600">{anomalyCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 