import { useTranslation } from 'react-i18next'
import { ServiceStatus } from '../types'
import StatusBadge from './StatusBadge'

interface ServiceCardProps {
  service: ServiceStatus
}

function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation()

  const formatAvailability = (availability: number | null) => {
    if (availability === null) return t('services.notAvailable')
    return `${availability.toFixed(2)}%`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {service.name}
          </h3>
          <StatusBadge status={service.status} />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">{t('services.uptime24h')}</p>
          <p className={`text-2xl font-bold ${
            service.availability_24h !== null && service.availability_24h >= 99.9
              ? 'text-green-600'
              : service.availability_24h !== null && service.availability_24h >= 95
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {formatAvailability(service.availability_24h)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
