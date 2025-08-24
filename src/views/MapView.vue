<template>
  <div class="space-y-6">
    <!-- Sayfa başlığı -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Deprem Haritası</h1>
        <p class="mt-1 text-sm text-gray-500">
          Türkiye'deki depremleri gerçek zamanlı olarak takip edin
        </p>
      </div>
      
      <!-- Aksiyon butonları -->
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button 
          @click="refreshData"
          :disabled="isLoading"
          class="btn btn-primary flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>Yenile</span>
        </button>
        
        <button 
          @click="appStore.toggleFilters"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L6.293 13.293A1 1 0 016 12.586V10H3z"/>
          </svg>
          <span>Filtreler</span>
        </button>
      </div>
    </div>

    <!-- İstatistik kartları -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Toplam Deprem</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Son 24 Saat</p>
            <p class="text-2xl font-semibold text-gray-900">{{ last24hCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">AI Anomali</p>
            <p class="text-2xl font-semibold text-gray-900">{{ anomalyCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">En Büyük</p>
            <p class="text-2xl font-semibold text-gray-900">{{ maxMagnitude }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ana içerik grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sol sidebar - Filtreler -->
      <div class="lg:col-span-1">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Filtreler</h3>
            <button 
              @click="clearFilters"
              class="text-sm text-primary-600 hover:text-primary-700"
            >
              Temizle
            </button>
          </div>

          <!-- Magnitude filtresi -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Büyüklük Aralığı
            </label>
            <div class="flex space-x-2">
              <input 
                v-model.number="filters.minMagnitude"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="input flex-1"
                placeholder="Min"
              />
              <span class="text-gray-500 self-center">-</span>
              <input 
                v-model.number="filters.maxMagnitude"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="input flex-1"
                placeholder="Max"
              />
            </div>
          </div>

          <!-- Derinlik filtresi -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Derinlik Aralığı (km)
            </label>
            <div class="flex space-x-2">
              <input 
                v-model.number="filters.minDepth"
                type="number"
                step="1"
                min="0"
                max="1000"
                class="input flex-1"
                placeholder="Min"
              />
              <span class="text-gray-500 self-center">-</span>
              <input 
                v-model.number="filters.maxDepth"
                type="number"
                step="1"
                min="0"
                max="1000"
                class="input flex-1"
                placeholder="Max"
              />
            </div>
          </div>

          <!-- Kaynak filtresi -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Veri Kaynağı
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  v-model="filters.sources"
                  type="checkbox"
                  value="AFAD"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">AFAD</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="filters.sources"
                  type="checkbox"
                  value="Kandilli"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Kandilli</span>
              </label>
            </div>
          </div>

          <!-- Anomali filtresi -->
          <div class="mb-4">
            <label class="flex items-center">
              <input 
                v-model="filters.showAnomalies"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Sadece AI Anomalileri</span>
            </label>
          </div>

          <!-- Tarih filtresi -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tarih Aralığı
            </label>
            <div class="space-y-2">
              <input 
                v-model="filters.dateRange.start"
                type="date"
                class="input"
              />
              <input 
                v-model="filters.dateRange.end"
                type="date"
                class="input"
              />
            </div>
          </div>
        </div>

        <!-- Son güncelleme bilgisi -->
        <div class="card mt-4">
          <div class="text-center">
            <p class="text-sm text-gray-500">Son Güncelleme</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ lastUpdate ? formatTime(lastUpdate) : 'Henüz yok' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Sağ taraf - Harita -->
      <div class="lg:col-span-3">
        <div class="card p-0 overflow-hidden">
          <div class="h-96 lg:h-[600px]">
            <EarthquakeMap 
              :earthquakes="filteredEarthquakes"
              :center="mapConfig.center"
              :zoom="mapConfig.zoom"
              @earthquake-click="onEarthquakeClick"
              @map-move="onMapMove"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Seçili deprem detayı -->
    <div v-if="selectedEarthquake" class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Seçili Deprem Detayı</h3>
        <button 
          @click="selectedEarthquake = null"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-gray-500">Büyüklük</p>
          <p class="text-xl font-bold text-gray-900">{{ selectedEarthquake.magnitude }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Konum</p>
          <p class="text-lg font-medium text-gray-900">{{ selectedEarthquake.location }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Tarih & Saat</p>
          <p class="text-lg font-medium text-gray-900">
            {{ selectedEarthquake.date }} {{ selectedEarthquake.time }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Kaynak</p>
          <p class="text-lg font-medium text-gray-900">{{ selectedEarthquake.source }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEarthquakeStore } from '@/stores/earthquake'
import { useAppStore } from '@/stores/app'
import EarthquakeMap from '@/components/EarthquakeMap.vue'
import type { Earthquake, FilterOptions, MapConfig } from '@/types'

// Router
const router = useRouter()

// Stores
const earthquakeStore = useEarthquakeStore()
const appStore = useAppStore()

// State
const selectedEarthquake = ref<Earthquake | null>(null)
const isLoading = ref(false)

// Computed
const totalCount = computed(() => earthquakeStore.totalCount)
const last24hCount = computed(() => earthquakeStore.earthquakes.filter(eq => {
  const now = new Date()
  const eqDate = new Date(eq.timestamp)
  const diffHours = (now.getTime() - eqDate.getTime()) / (1000 * 60 * 60)
  return diffHours <= 24
}).length)
const anomalyCount = computed(() => earthquakeStore.anomalyCount)
const maxMagnitude = computed(() => {
  if (earthquakeStore.earthquakes.length === 0) return 0
  return Math.max(...earthquakeStore.earthquakes.map(eq => eq.magnitude))
})

const filteredEarthquakes = computed(() => earthquakeStore.filteredEarthquakes)
const filters = computed(() => earthquakeStore.filters)
const mapConfig = computed(() => appStore.mapConfig)
const lastUpdate = computed(() => earthquakeStore.lastUpdate)

// Methods
const refreshData = async () => {
  try {
    isLoading.value = true
    await earthquakeStore.fetchEarthquakes()
    appStore.updateLastUpdate()
  } catch (error) {
    console.error('Data refresh error:', error)
  } finally {
    isLoading.value = false
  }
}

const clearFilters = () => {
  earthquakeStore.clearFilters()
}

const onEarthquakeClick = (earthquake: Earthquake) => {
  selectedEarthquake.value = earthquake
}

const onMapMove = (config: MapConfig) => {
  appStore.updateMapConfig(config)
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dk önce`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} saat önce`
  
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}

// Watch filters değişikliklerini
watch(filters, (newFilters) => {
  earthquakeStore.updateFilters(newFilters)
}, { deep: true })

// Lifecycle
onMounted(async () => {
  if (earthquakeStore.earthquakes.length === 0) {
    await refreshData()
  }
})
</script> 