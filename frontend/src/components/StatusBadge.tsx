interface StatusBadgeProps {
  status: 'operational' | 'degraded' | 'up' | 'down'
  large?: boolean
}

function StatusBadge({ status, large = false }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'operational':
      case 'up':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✓',
          label: status === 'operational' ? 'All Systems Operational' : 'Operational'
        }
      case 'degraded':
      case 'down':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '✗',
          label: status === 'degraded' ? 'Degraded Performance' : 'Down'
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
