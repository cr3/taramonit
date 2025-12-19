import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { OverallStatus } from './types'

describe('App', () => {
  const stubStatusData: OverallStatus = {
    status: 'operational',
    services: [
      {
        name: 'Service 1',
        status: 'up',
        availability_24h: 99.95,
      },
    ],
  }

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading state initially', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(stubStatusData),
      } as Response)
    )

    render(<App />)
    expect(screen.getByText('Loading status...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByText('Loading status...')).not.toBeInTheDocument()
    })
  })

  it('fetches and displays status data on mount', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(stubStatusData),
      } as Response)
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Taram Status')).toBeInTheDocument()
    })

    expect(screen.getByText('Service 1')).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalled()
    const fetchMock = vi.mocked(global.fetch)
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/status$/)
  })

  it('displays error message when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      } as Response)
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Status')).toBeInTheDocument()
    })

    expect(screen.getByText('Failed to fetch status')).toBeInTheDocument()
  })

  it('handles network error correctly', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Status')).toBeInTheDocument()
    })

    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('handles non-Error exceptions', async () => {
    global.fetch = vi.fn(() => Promise.reject('String error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Status')).toBeInTheDocument()
    })

    expect(screen.getByText('Unknown error')).toBeInTheDocument()
  })

  it('refreshes data when onRefresh is called', async () => {
    const user = userEvent.setup({ delay: null })

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(stubStatusData),
      } as Response)
    )

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Taram Status')).toBeInTheDocument()
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)

    const refreshButton = screen.getByText('Refresh')
    await user.click(refreshButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  it('renders with correct container styling', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(stubStatusData),
      } as Response)
    )

    const { container } = render(<App />)
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50')
  })
})
