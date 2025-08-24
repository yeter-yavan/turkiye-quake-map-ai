<template>
  <div class="space-y-6">
    <!-- Geri butonu -->
    <div class="flex items-center space-x-4">
      <button 
        @click="$router.go(-1)"
        class="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        <span>Geri</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-2 text-gray-500">Deprem detayları yükleniyor...</p>
    </div>

    <!-- Deprem bulunamadı -->
    <div v-else-if="!earthquake" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Deprem bulunamadı</h3>
      <p class="mt-1 text-sm text-gray-500">
        Belirtilen ID ile deprem bulunamadı.
      </p>
    </div>

    <!-- Deprem detayları -->
    <div v-else class="space-y-6">
      <!-- Başlık ve magnitude -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center space-x-4">
          <div 
            :class="[
              'w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl',
              getMagnitudeColor(earthquake.magnitude)
            ]"
          >
            {{ earthquake.magnitude.toFixed(1) }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ earthquake.magnitude.toFixed(1) }} Büyüklüğünde Deprem
            </h1>
            <p class="text-lg text-gray-600">{{ earthquake.location }}</p>
          </div>
        </div>
        
        <!-- Aksiyon butonları -->
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button 
            @click="viewOnMap"
            class="btn btn-primary flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
            </svg>
            <span>Haritada Göster</span>
          </button>
          
          <button 
            @click="shareData"
            class="btn btn-secondary flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            <span>Paylaş</span>
          </button>
        </div>
      </div>

      <!-- Ana bilgi kartları -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Konum bilgisi -->
        <div class="card">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="ml-3 text-lg font-semibold text-gray-900">Konum Bilgisi</h3>
          </div>
          
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500">Ana Konum</p>
              <p class="text-lg font-medium text-gray-900">{{ earthquake.location }}</p>
            </div>
            
            <div v-if="earthquake.province">
              <p class="text-sm text-gray-500">İl</p>
              <p class="text-lg font-medium text-gray-900">{{ earthquake.province }}</p>
            </div>
            
            <div v-if="earthquake.district">
              <p class="text-sm text-gray-500">İlçe</p>
              <p class="text-lg font-medium text-gray-900">{{ earthquake.district }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Koordinatlar</p>
              <p class="text-lg font-medium text-gray-900">
                {{ earthquake.latitude.toFixed(4) }}, {{ earthquake.longitude.toFixed(4) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Zaman bilgisi -->
        <div class="card">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="ml-3 text-lg font-semibold text-gray-900">Zaman Bilgisi</h3>
          </div>
          
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500">Tarih</p>
              <p class="text-lg font-medium text-gray-900">{{ formatDate(earthquake.date) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Saat</p>
              <p class="text-lg font-medium text-gray-900">{{ earthquake.time }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Ne Kadar Önce</p>
              <p class="text-lg font-medium text-gray-900">{{ formatTimeAgo(earthquake.timestamp) }}</p>
            </div>
          </div>
        </div>

        <!-- Teknik bilgiler -->
        <div class="card">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="ml-3 text-lg font-semibold text-gray-900">Teknik Bilgiler</h3>
          </div>
          
          <div class="space-y-3">
            <div>
              <p class="text-sm text-gray-500">Büyüklük</p>
              <p class="text-lg font-medium text-gray-900">{{ earthquake.magnitude.toFixed(1) }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Derinlik</p>
              <p class="text-lg font-medium text-gray-900">{{ earthquake.depth }} km</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Veri Kaynağı</p>
              <span 
                :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  earthquake.source === 'AFAD' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                ]"
              >
                {{ earthquake.source }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Anomali bilgisi -->
      <div v-if="earthquake.isAnomaly" class="card border-warning-200 bg-warning-50">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="ml-3 text-lg font-semibold text-warning-800">AI Anomali Tespit Edildi</h3>
        </div>
        
        <div class="space-y-3">
          <div v-if="earthquake.anomalyScore">
            <p class="text-sm text-warning-700">Anomali Skoru</p>
            <p class="text-lg font-medium text-warning-800">{{ earthquake.anomalyScore.toFixed(2) }}</p>
          </div>
          
          <p class="text-warning-700">
            Bu deprem, AI algoritması tarafından anormal olarak tespit edilmiştir. 
            Magnitude, derinlik veya konum açısından beklenmeyen özellikler göstermektedir.
          </p>
        </div>
      </div>

      <!-- Harita görünümü -->
      <div class="card p-0 overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Konum Haritası</h3>
        </div>
        <div class="h-96">
          <EarthquakeMap 
            :earthquakes="[earthquake]"
            :center="[earthquake.latitude, earthquake.longitude]"
            :zoom="10"
          />
        </div>
      </div>

      <!-- Yakındaki depremler -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Yakındaki Depremler</h3>
          <span class="text-sm text-gray-500">100 km yarıçapında</span>
        </div>
        
        <div v-if="nearbyEarthquakes.length > 0" class="space-y-3">
          <div 
            v-for="nearby in nearbyEarthquakes" 
            :key="nearby.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex items-center space-x-3">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                  getMagnitudeColor(nearby.magnitude)
                ]"
              >
                {{ nearby.magnitude.toFixed(1) }}
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ nearby.location }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(nearby.date) }} {{ nearby.time }}</p>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-sm text-gray-600">{{ nearby.depth }} km</p>
              <p class="text-xs text-gray-500">{{ calculateDistance(earthquake, nearby).toFixed(1) }} km uzak</p>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8 text-gray-500">
          Yakında başka deprem bulunamadı.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEarthquakeStore } from '@/stores/earthquake'
import EarthquakeMap from '@/components/EarthquakeMap.vue'
import type { Earthquake } from '@/types'

// Router
const route = useRoute()
const router = useRouter()

// Store
const earthquakeStore = useEarthquakeStore()

// State
const isLoading = ref(false)

// Computed
const earthquakeId = computed(() => route.params.id as string)
const earthquake = computed(() => earthquakeStore.getEarthquakeById(earthquakeId.value))

const nearbyEarthquakes = computed(() => {
  if (!earthquake.value) return []
  
  return earthquakeStore.getEarthquakesByLocation(
    earthquake.value.latitude,
    earthquake.value.longitude,
    100
  ).filter(eq => eq.id !== earthquake.value!.id).slice(0, 5)
})

// Methods
const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude >= 6.0) return 'bg-red-600'
  if (magnitude >= 5.0) return 'bg-orange-600'
  if (magnitude >= 4.0) return 'bg-yellow-600'
  if (magnitude >= 3.0) return 'bg-green-600'
  return 'bg-gray-600'
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('tr-TR')
}

const formatTimeAgo = (timestamp: number): string => {
  const now = new Date()
  const eqDate = new Date(timestamp)
  const diff = now.getTime() - eqDate.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Az önce'
  if (minutes < 60) return `${minutes} dk önce`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} saat önce`
  
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}

const viewOnMap = () => {
  router.push('/')
  earthquakeStore.setSelectedEarthquake(earthquake.value!.id)
}

const shareData = () => {
  if (navigator.share) {
    navigator.share({
      title: `${earthquake.value!.magnitude} Büyüklüğünde Deprem`,
      text: `${earthquake.value!.location} konumunda ${earthquake.value!.magnitude} büyüklüğünde deprem meydana geldi.`,
      url: window.location.href
    })
  } else {
    // Fallback: URL'yi kopyala
    navigator.clipboard.writeText(window.location.href)
    alert('URL kopyalandı!')
  }
}

const calculateDistance = (eq1: Earthquake, eq2: Earthquake): number => {
  const R = 6371 // Dünya yarıçapı (km)
  const dLat = (eq2.latitude - eq1.latitude) * Math.PI / 180
  const dLon = (eq2.longitude - eq1.longitude) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(eq1.latitude * Math.PI / 180) * Math.cos(eq2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Lifecycle
onMounted(async () => {
  if (!earthquake.value) {
    isLoading.value = true
    try {
      await earthquakeStore.fetchEarthquakes()
    } catch (error) {
      console.error('Error fetching earthquakes:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script> 