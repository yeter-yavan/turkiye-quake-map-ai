import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Map',
    component: () => import('@/views/MapView.vue'),
    meta: {
      title: 'Harita Görünümü'
    }
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('@/views/ListView.vue'),
    meta: {
      title: 'Liste Görünümü'
    }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: {
      title: 'Analiz Görünümü'
    }
  },
  {
    path: '/earthquake/:id',
    name: 'EarthquakeDetail',
    component: () => import('@/views/EarthquakeDetailView.vue'),
    meta: {
      title: 'Deprem Detayı'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Sayfa Bulunamadı'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Route guard - title güncelleme
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Türkiye Deprem Haritası`
  }
  next()
})

export default router 