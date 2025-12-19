import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ServiceCard from './ServiceCard'
import { ServiceStatus } from '../types'

describe('ServiceCard', () => {
  const stubService: ServiceStatus = {
    name: 'Test Service',
    status: 'up',
    availability_24h: 99.95,
  }

  it('renders service name correctly', () => {
    render(<ServiceCard service={stubService} />)
    expect(screen.getByText('Test Service')).toBeInTheDocument()
  })

  it('renders StatusBadge component', () => {
    render(<ServiceCard service={stubService} />)
    expect(screen.getByText('Operational')).toBeInTheDocument()
  })

  it('displays availability percentage with two decimal places', () => {
    render(<ServiceCard service={stubService} />)
    expect(screen.getByText('99.95%')).toBeInTheDocument()
  })

  it('displays N/A when availability is null', () => {
    const serviceWithNullAvailability: ServiceStatus = {
      ...stubService,
      availability_24h: null,
    }
    render(<ServiceCard service={serviceWithNullAvailability} />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('applies green color class for high availability (>=99.9%)', () => {
    render(<ServiceCard service={stubService} />)
    const availability = screen.getByText('99.95%')
    expect(availability).toHaveClass('text-green-600')
  })

  it('applies yellow color class for medium availability (>=95% and <99.9%)', () => {
    const serviceWithMediumAvailability: ServiceStatus = {
      ...stubService,
      availability_24h: 97.5,
    }
    render(<ServiceCard service={serviceWithMediumAvailability} />)
    const availability = screen.getByText('97.50%')
    expect(availability).toHaveClass('text-yellow-600')
  })

  it('applies red color class for low availability (<95%)', () => {
    const serviceWithLowAvailability: ServiceStatus = {
      ...stubService,
      availability_24h: 85.0,
    }
    render(<ServiceCard service={serviceWithLowAvailability} />)
    const availability = screen.getByText('85.00%')
    expect(availability).toHaveClass('text-red-600')
  })

  it('displays 24h Uptime label', () => {
    render(<ServiceCard service={stubService} />)
    expect(screen.getByText('24h Uptime')).toBeInTheDocument()
  })

  it('handles down status correctly', () => {
    const serviceDown: ServiceStatus = {
      ...stubService,
      status: 'down',
      availability_24h: 50.0,
    }
    render(<ServiceCard service={serviceDown} />)
    expect(screen.getByText('Down')).toBeInTheDocument()
    expect(screen.getByText('50.00%')).toBeInTheDocument()
  })
})
