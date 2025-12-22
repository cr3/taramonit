import { useTranslation } from 'react-i18next'

interface StatusBadgeProps {
  status: 'operational' | 'degraded' | 'up' | 'down'
  large?: boolean
}

function StatusBadge({ status, large = false }: StatusBadgeProps) {
  const { t } = useTranslation()

  const getStatusConfig = () => {
    switch (status) {
      case 'operational':
      case 'up':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✓',
          label: status === 'operational' ? t('status.allOperational') : t('status.operational')
        }
      case 'degraded':
      case 'down':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '✗',
          label: status === 'degraded' ? t('status.degradedPerformance') : t('status.down')
        }
    }
  }

  const config = getStatusConfig()
  const sizeClasses = large
    ? 'text-2xl px-6 py-3'
    : 'text-sm px-3 py-1'

  return (
    <div className={`inline-flex items-center gap-2 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={large ? 'text-3xl' : 'text-base'}>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  )
}

export default StatusBadge
