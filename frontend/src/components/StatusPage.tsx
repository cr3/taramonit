import { OverallStatus } from '../types'
import StatusBadge from './StatusBadge'
import ServiceCard from './ServiceCard'

interface StatusPageProps {
  status: OverallStatus | null
  loading: boolean
  error: string | null
  lastUpdated: Date
  onRefresh: () => void
}

function StatusPage({ status, loading, error, lastUpdated, onRefresh }: StatusPageProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading status...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Status</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Taram Status</h1>
        <p className="text-gray-600">Real-time service status and uptime</p>
      </header>

      {/* Overall Status Banner */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <StatusBadge status={status.status} large />
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {formatTime(lastUpdated)}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Services</h2>
        {status.services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Status updates every 30 seconds</p>
      </footer>
    </div>
  )
}

export default StatusPage
