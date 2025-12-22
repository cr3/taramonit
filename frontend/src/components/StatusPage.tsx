import { useTranslation } from 'react-i18next'
import { OverallStatus } from '../types'
import StatusBadge from './StatusBadge'
import ServiceCard from './ServiceCard'
import LanguageToggle from './LanguageToggle'

interface StatusPageProps {
  status: OverallStatus | null
  loading: boolean
  error: string | null
  lastUpdated: Date
  onRefresh: () => void
}

function StatusPage({ status, loading, error, lastUpdated, onRefresh }: StatusPageProps) {
  const { t, i18n } = useTranslation()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white">{t('loading.status')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('error.unableToLoad')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('error.tryAgain')}
          </button>
        </div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="text-center mb-12 relative">
        <div className="absolute top-0 right-0">
          <LanguageToggle />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('app.title')}</h1>
        <p className="text-gray-600">{t('app.subtitle')}</p>
      </header>

      {/* Overall Status Banner */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <StatusBadge status={status.status} large />
            <p className="text-sm text-gray-500 mt-2">
              {t('time.lastUpdated', { time: formatTime(lastUpdated) })}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {t('actions.refresh')}
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-white">{t('services.title')}</h2>
          <p className="text-white">{t('footer.autoUpdate')}</p>
        </div>
        {status.services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  )
}

export default StatusPage
