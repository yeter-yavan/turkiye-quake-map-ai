import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import MapView from '@/views/MapView'
import ListView from '@/views/ListView'
import AnalyticsView from '@/views/AnalyticsView'
import EarthquakeDetailView from '@/views/EarthquakeDetailView'
import NotFoundView from '@/views/NotFoundView'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MapView />
      },
      {
        path: 'list',
        element: <ListView />
      },
      {
        path: 'analytics',
        element: <AnalyticsView />
      },
      {
        path: 'earthquake/:id',
        element: <EarthquakeDetailView />
      },
      {
        path: '*',
        element: <NotFoundView />
      }
    ]
  }
]) 