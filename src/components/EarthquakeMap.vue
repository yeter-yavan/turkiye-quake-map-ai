<template>
  <div class="relative w-full h-full">
    <!-- Harita container -->
    <div 
      ref="mapContainer" 
      class="w-full h-full rounded-lg shadow-lg"
    ></div>
    
    <!-- Harita kontrolleri -->
    <div class="absolute top-4 left-4 z-10 space-y-2">
      <!-- Zoom kontrolleri -->
      <div class="bg-white rounded-lg shadow-md p-2">
        <button 
          @click="zoomIn"
          class="w-8 h-8 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          title="Yakınlaştır"
        >
          <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </button>
        <button 
          @click="zoomOut"
          class="w-8 h-8 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors mt-1"
          title="Uzaklaştır"
        >
          <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
          </svg>
        </button>
      </div>
      
      <!-- Harita tipi seçici -->
      <div class="bg-white rounded-lg shadow-md p-2">
        <select 
          v-model="selectedTileLayer" 
          @change="changeTileLayer"
          class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500"
        >
          <option value="osm">OpenStreetMap</option>
          <option value="satellite">Uydu</option>
          <option value="terrain">Arazi</option>
        </select>
      </div>
    </div>
    
    <!-- Harita bilgi paneli -->
    <div class="absolute top-4 right-4 z-10">
      <div class="bg-white rounded-lg shadow-md p-4 max-w-xs">
        <h3 class="font-semibold text-gray-900 mb-2">Harita Bilgileri</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex justify-between">
            <span>Toplam Deprem:</span>
            <span class="font-medium">{{ totalEarthquakes }}</span>
          </div>
          <div class="flex justify-between">
            <span>Görünen:</span>
            <span class="font-medium">{{ visibleEarthquakes }}</span>
          </div>
          <div class="flex justify-between">
            <span>Anomali:</span>
            <span class="font-medium text-warning-600">{{ anomalyCount }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading indicator -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg p-4 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-gray-700">Harita yükleniyor...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEarthquakeStore } from '@/stores/earthquake'
import { useAppStore } from '@/stores/app'
import type { Earthquake, MapConfig } from '@/types'

// Props
interface Props {
  earthquakes?: Earthquake[]
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  earthquakes: () => [],
  center: () => [39.9334, 32.8597], // Ankara merkezi
  zoom: 6
})

// Emits
const emit = defineEmits<{
  earthquakeClick: [earthquake: Earthquake]
  mapMove: [config: MapConfig]
}>()

// Stores
const earthquakeStore = useEarthquakeStore()
const appStore = useAppStore()

// Refs
const mapContainer = ref<HTMLElement>()
const map = ref<L.Map>()
const markersLayer = ref<L.LayerGroup>()
const selectedTileLayer = ref('osm')

// State
const isLoading = ref(false)
const tileLayers = ref<Record<string, L.TileLayer>>({})

// Computed
const totalEarthquakes = computed(() => earthquakeStore.totalCount)
const visibleEarthquakes = computed(() => props.earthquakes.length)
const anomalyCount = computed(() => earthquakeStore.anomalyCount)

// Harita başlatma
const initMap = () => {
  if (!mapContainer.value) return

  // Harita oluştur
  map.value = L.map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: true
  })

  // Tile layer'ları oluştur
  tileLayers.value = {
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri'
    }),
    terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap'
    })
  }

  // Varsayılan tile layer'ı ekle
  tileLayers.value[selectedTileLayer.value].addTo(map.value)

  // Markers layer'ı oluştur
  markersLayer.value = L.layerGroup().addTo(map.value)

  // Event listeners
  map.value.on('moveend', onMapMove)
  map.value.on('zoomend', onMapMove)

  // Harita yüklendi
  isLoading.value = false
}

// Tile layer değiştirme
const changeTileLayer = () => {
  if (!map.value) return

  // Mevcut tile layer'ları kaldır
  Object.values(tileLayers.value).forEach(layer => {
    map.value?.removeLayer(layer)
  })

  // Yeni tile layer'ı ekle
  tileLayers.value[selectedTileLayer.value].addTo(map.value)
}

// Zoom kontrolleri
const zoomIn = () => {
  map.value?.zoomIn()
}

const zoomOut = () => {
  map.value?.zoomOut()
}

// Harita hareketi
const onMapMove = () => {
  if (!map.value) return

  const center = map.value.getCenter()
  const zoom = map.value.getZoom()

  const config: MapConfig = {
    center: [center.lat, center.lng],
    zoom,
    minZoom: 5,
    maxZoom: 18
  }

  emit('mapMove', config)
  appStore.updateMapConfig(config)
}

// Deprem marker'ları oluşturma
const createMarkers = () => {
  if (!markersLayer.value || !map.value) return

  // Mevcut marker'ları temizle
  markersLayer.value.clearLayers()

  props.earthquakes.forEach(earthquake => {
    const marker = createEarthquakeMarker(earthquake)
    markersLayer.value?.addLayer(marker)
  })
}

// Tekil deprem marker'ı oluşturma
const createEarthquakeMarker = (earthquake: Earthquake): L.Marker => {
  // Magnitude'a göre marker rengi
  const getMarkerColor = (magnitude: number): string => {
    if (magnitude >= 6.0) return '#dc2626' // Kırmızı - Büyük deprem
    if (magnitude >= 5.0) return '#ea580c' // Turuncu - Orta-büyük
    if (magnitude >= 4.0) return '#f59e0b' // Sarı - Orta
    if (magnitude >= 3.0) return '#10b981' // Yeşil - Küçük
    return '#6b7280' // Gri - Çok küçük
  }

  // Marker icon oluştur
  const icon = L.divIcon({
    className: 'earthquake-marker',
    html: `
      <div class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
           style="background-color: ${getMarkerColor(earthquake.magnitude)};">
        ${earthquake.magnitude.toFixed(1)}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })

  // Marker oluştur
  const marker = L.marker([earthquake.latitude, earthquake.longitude], {
    icon,
    title: `${earthquake.magnitude} büyüklüğünde deprem - ${earthquake.location}`
  })

  // Popup içeriği
  const popupContent = `
    <div class="earthquake-popup">
      <h3 class="font-bold text-lg mb-2">${earthquake.magnitude} Büyüklüğünde Deprem</h3>
      <div class="space-y-1 text-sm">
        <p><strong>Konum:</strong> ${earthquake.location}</p>
        <p><strong>Tarih:</strong> ${earthquake.date}</p>
        <p><strong>Saat:</strong> ${earthquake.time}</p>
        <p><strong>Derinlik:</strong> ${earthquake.depth} km</p>
        <p><strong>Kaynak:</strong> ${earthquake.source}</p>
        ${earthquake.isAnomaly ? '<p class="text-warning-600 font-semibold">⚠️ AI Anomali Tespit Edildi</p>' : ''}
      </div>
    </div>
  `

  marker.bindPopup(popupContent)

  // Click event
  marker.on('click', () => {
    emit('earthquakeClick', earthquake)
    appStore.setSelectedEarthquake(earthquake.id)
  })

  return marker
}

// Harita yenileme
const refreshMap = () => {
  createMarkers()
}

// Watch earthquakes değişikliklerini
watch(() => props.earthquakes, refreshMap, { deep: true })

// Lifecycle
onMounted(() => {
  isLoading.value = true
  nextTick(() => {
    initMap()
    createMarkers()
  })
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.earthquake-marker {
  background: transparent;
  border: none;
}

.earthquake-popup {
  min-width: 250px;
}

/* Leaflet popup stilleri */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  padding: 0;
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style> 