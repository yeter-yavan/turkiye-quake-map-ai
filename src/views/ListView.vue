<template>
  <div class="space-y-6">
    <!-- Sayfa başlığı -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Deprem Listesi</h1>
        <p class="mt-1 text-sm text-gray-500">
          Tüm depremleri detaylı olarak inceleyin
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
          @click="exportData"
          class="btn btn-secondary flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Dışa Aktar</span>
        </button>
      </div>
    </div>

    <!-- Filtreler -->
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Magnitude filtresi -->
        <div>
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

        <!-- Kaynak filtresi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Veri Kaynağı
          </label>
          <select 
            v-model="filters.sources"
            multiple
            class="input"
          >
            <option value="AFAD">AFAD</option>
            <option value="Kandilli">Kandilli</option>
          </select>
        </div>

        <!-- Anomali filtresi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Anomali Durumu
          </label>
          <select v-model="anomalyFilter" class="input">
            <option value="all">Tümü</option>
            <option value="anomaly">Sadece Anomaliler</option>
            <option value="normal">Normal Depremler</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Deprem listesi -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Depremler ({{ filteredEarthquakes.length }})
        </h3>
        
        <!-- Sıralama -->
        <div class="flex items-center space-x-2">
          <label class="text-sm text-gray-700">Sırala:</label>
          <select v-model="sortBy" class="input text-sm">
            <option value="timestamp-desc">Tarih (Yeni)</option>
            <option value="timestamp-asc">Tarih (Eski)</option>
            <option value="magnitude-desc">Büyüklük (Büyük)</option>
            <option value="magnitude-asc">Büyüklük (Küçük)</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-gray-500">Deprem verileri yükleniyor...</p>
      </div>

      <!-- Deprem tablosu -->
      <div v-else-if="filteredEarthquakes.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deprem
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konum
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih & Saat
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Derinlik
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaynak
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="earthquake in paginatedEarthquakes" 
              :key="earthquake.id"
              class="hover:bg-gray-50"
            >
              <!-- Magnitude -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                      getMagnitudeColor(earthquake.magnitude)
                    ]"
                  >
                    {{ earthquake.magnitude.toFixed(1) }}
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ earthquake.magnitude.toFixed(1) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ getMagnitudeDescription(earthquake.magnitude) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Konum -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ earthquake.location }}</div>
                <div class="text-sm text-gray-500">
                  {{ earthquake.province }}{{ earthquake.district ? `, ${earthquake.district}` : '' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ earthquake.latitude.toFixed(4) }}, {{ earthquake.longitude.toFixed(4) }}
                </div>
              </td>

              <!-- Tarih & Saat -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(earthquake.date) }}</div>
                <div class="text-sm text-gray-500">{{ earthquake.time }}</div>
                <div class="text-xs text-gray-400">{{ formatTimeAgo(earthquake.timestamp) }}</div>
              </td>

              <!-- Derinlik -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ earthquake.depth }} km</div>
                <div class="text-xs text-gray-500">
                  {{ getDepthDescription(earthquake.depth) }}
                </div>
              </td>

              <!-- Kaynak -->
              <td class="px-6 py-4 whitespace-nowrap">
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
              </td>

              <!-- Durum -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="earthquake.isAnomaly" class="flex items-center">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-warning-100 text-warning-800">
                    ⚠️ AI Anomali
                  </span>
                  <span v-if="earthquake.anomalyScore" class="ml-2 text-xs text-gray-500">
                    ({{ earthquake.anomalyScore.toFixed(2) }})
                  </span>
                </div>
                <span v-else class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  Normal
                </span>
              </td>

              <!-- İşlemler -->
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewDetails(earthquake)"
                  class="text-primary-600 hover:text-primary-900 mr-3"
                >
                  Detay
                </button>
                <button 
                  @click="viewOnMap(earthquake)"
                  class="text-gray-600 hover:text-gray-900"
                >
                  Haritada Göster
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Önceki
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Sonraki
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                <span class="font-medium">{{ startIndex + 1 }}</span>
                -
                <span class="font-medium">{{ endIndex }}</span>
                / 
                <span class="font-medium">{{ filteredEarthquakes.length }}</span>
                sonuçtan
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                
                <template v-for="page in visiblePages" :key="page">
                  <button 
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
                
                <button 
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Boş durum -->
      <div v-else class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Deprem bulunamadı</h3>
        <p class="mt-1 text-sm text-gray-500">
          Seçilen filtrelere uygun deprem bulunmuyor.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEarthquakeStore } from '@/stores/earthquake'
import type { Earthquake } from '@/types'

// Router
const router = useRouter()

// Store
const earthquakeStore = useEarthquakeStore()

// State
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const sortBy = ref('timestamp-desc')
const anomalyFilter = ref('all')

// Computed
const filters = computed(() => earthquakeStore.filters)
const filteredEarthquakes = computed(() => {
  let earthquakes = earthquakeStore.filteredEarthquakes

  // Anomali filtresi
  if (anomalyFilter.value === 'anomaly') {
    earthquakes = earthquakes.filter(eq => eq.isAnomaly)
  } else if (anomalyFilter.value === 'normal') {
    earthquakes = earthquakes.filter(eq => !eq.isAnomaly)
  }

  // Sıralama
  const sorted = [...earthquakes].sort((a, b) => {
    switch (sortBy.value) {
      case 'timestamp-desc':
        return b.timestamp - a.timestamp
      case 'timestamp-asc':
        return a.timestamp - b.timestamp
      case 'magnitude-desc':
        return b.magnitude - a.magnitude
      case 'magnitude-asc':
        return a.magnitude - b.magnitude
      default:
        return b.timestamp - a.timestamp
    }
  })

  return sorted
})

const totalPages = computed(() => Math.ceil(filteredEarthquakes.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredEarthquakes.value.length))

const paginatedEarthquakes = computed(() => 
  filteredEarthquakes.value.slice(startIndex.value, endIndex.value)
)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const refreshData = async () => {
  try {
    isLoading.value = true
    await earthquakeStore.fetchEarthquakes()
  } catch (error) {
    console.error('Data refresh error:', error)
  } finally {
    isLoading.value = false
  }
}

const clearFilters = () => {
  earthquakeStore.clearFilters()
  anomalyFilter.value = 'all'
  currentPage.value = 1
}

const exportData = () => {
  const data = filteredEarthquakes.value.map(eq => ({
    Tarih: eq.date,
    Saat: eq.time,
    Büyüklük: eq.magnitude,
    Derinlik: eq.depth,
    Konum: eq.location,
    İl: eq.province || '',
    İlçe: eq.district || '',
    Kaynak: eq.source,
    Anomali: eq.isAnomaly ? 'Evet' : 'Hayır'
  }))

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `depremler_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

const viewDetails = (earthquake: Earthquake) => {
  router.push(`/earthquake/${earthquake.id}`)
}

const viewOnMap = (earthquake: Earthquake) => {
  router.push('/')
  // Haritada konumu göstermek için store'u güncelle
  earthquakeStore.setSelectedEarthquake(earthquake.id)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const getMagnitudeColor = (magnitude: number): string => {
  if (magnitude >= 6.0) return 'bg-red-600'
  if (magnitude >= 5.0) return 'bg-orange-600'
  if (magnitude >= 4.0) return 'bg-yellow-600'
  if (magnitude >= 3.0) return 'bg-green-600'
  return 'bg-gray-600'
}

const getMagnitudeDescription = (magnitude: number): string => {
  if (magnitude >= 6.0) return 'Büyük'
  if (magnitude >= 5.0) return 'Orta-Büyük'
  if (magnitude >= 4.0) return 'Orta'
  if (magnitude >= 3.0) return 'Küçük'
  return 'Çok Küçük'
}

const getDepthDescription = (depth: number): string => {
  if (depth < 10) return 'Çok Sığ'
  if (depth < 30) return 'Sığ'
  if (depth < 70) return 'Orta'
  if (depth < 300) return 'Derin'
  return 'Çok Derin'
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

// Watch
watch([filters, anomalyFilter, sortBy], () => {
  currentPage.value = 1
}, { deep: true })

// Lifecycle
onMounted(async () => {
  if (earthquakeStore.earthquakes.length === 0) {
    await refreshData()
  }
})
</script> 