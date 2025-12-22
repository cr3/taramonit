import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StatusPage from './StatusPage'
import { OverallStatus } from '../types'

describe('StatusPage', () => {
  const stubStatus: OverallStatus = {
    status: 'operational',
    services: [
      {
        name: 'Service 1',
        status: 'up',
        availability_24h: 99.95,
      },
      {
        name: 'Service 2',
        status: 'up',
        availability_24h: 100.0,
      },
    ],
  }

  const mockLastUpdated = new Date('2025-12-19T12:00:00Z')

  it('renders loading state correctly', () => {
    render(
      <StatusPage
        status={null}
        loading={true}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )
    expect(screen.getByText('Loading status...')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    render(
      <StatusPage
        status={null}
        loading={false}
        error="Network error"
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )
    expect(screen.getByText('Unable to Load Status')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('calls onRefresh when Try Again button is clicked in error state', async () => {
    const user = userEvent.setup()
    const mockRefresh = vi.fn()

    render(
      <StatusPage
        status={null}
        loading={false}
        error="Network error"
        lastUpdated={mockLastUpdated}
        onRefresh={mockRefresh}
      />
    )

    const tryAgainButton = screen.getByText('Try Again')
    await user.click(tryAgainButton)
    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })

  it('renders null when status is null and not loading or error', () => {
    const { container } = render(
      <StatusPage
        status={null}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders status page correctly with data', () => {
    render(
      <StatusPage
        status={stubStatus}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )

    expect(screen.getByText('Taram Status')).toBeInTheDocument()
    expect(screen.getByText('Real-time service status and uptime')).toBeInTheDocument()
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument()
  })

  it('renders all services', () => {
    render(
      <StatusPage
        status={stubStatus}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )

    expect(screen.getByText('Service 1')).toBeInTheDocument()
    expect(screen.getByText('Service 2')).toBeInTheDocument()
  })

  it('displays last updated time', () => {
    render(
      <StatusPage
        status={stubStatus}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
  })

  it('calls onRefresh when Refresh button is clicked', async () => {
    const user = userEvent.setup()
    const mockRefresh = vi.fn()

    render(
      <StatusPage
        status={stubStatus}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={mockRefresh}
      />
    )

    const refreshButton = screen.getByText('Refresh')
    await user.click(refreshButton)
    expect(mockRefresh).toHaveBeenCalledTimes(1)
  })

  it('displays Services heading', () => {
    render(
      <StatusPage
        status={stubStatus}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )

    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('Updated every 30 seconds')).toBeInTheDocument()
  })

  it('renders degraded status correctly', () => {
    const degradedStatus: OverallStatus = {
      status: 'degraded',
      services: [
        {
          name: 'Service 1',
          status: 'down',
          availability_24h: 50.0,
        },
      ],
    }

    render(
      <StatusPage
        status={degradedStatus}
        loading={false}
        error={null}
        lastUpdated={mockLastUpdated}
        onRefresh={() => {}}
      />
    )

    expect(screen.getByText('Degraded Performance')).toBeInTheDocument()
  })
})
