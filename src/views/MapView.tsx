import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEarthquakeStore } from '@/stores/earthquake'
import { useAppStore } from '@/stores/app'
import { EarthquakeMap } from '@/components/EarthquakeMap'
import type { Earthquake } from '@/types'

export default function MapView() {
  const navigate = useNavigate()
  const { filteredEarthquakes, fetchEarthquakes } = useEarthquakeStore()
  const { mapConfig } = useAppStore()

  useEffect(() => {
    fetchEarthquakes()
  }, [fetchEarthquakes])

  const handleEarthquakeClick = (earthquake: Earthquake) => {
    navigate(`/earthquake/${earthquake.id}`)
  }

  const handleMapMove = () => {
    // Map movement is handled by the EarthquakeMap component
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deprem Haritası</h1>
        <p className="text-muted-foreground mt-2">
          Türkiye'deki güncel deprem verilerini harita üzerinde görüntüleyin
        </p>
      </div>

      <div className="h-[600px] w-full">
        <EarthquakeMap
          earthquakes={filteredEarthquakes}
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          onEarthquakeClick={handleEarthquakeClick}
          onMapMove={handleMapMove}
        />
      </div>
    </div>
  )
} 