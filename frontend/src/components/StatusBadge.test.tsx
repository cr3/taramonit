import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from './StatusBadge'

describe('StatusBadge', () => {
  it('renders operational status correctly', () => {
    render(<StatusBadge status="operational" />)
    expect(screen.getByText('All Systems Operational')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders up status correctly', () => {
    render(<StatusBadge status="up" />)
    expect(screen.getByText('Operational')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders degraded status correctly', () => {
    render(<StatusBadge status="degraded" />)
    expect(screen.getByText('Degraded Performance')).toBeInTheDocument()
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('renders down status correctly', () => {
    render(<StatusBadge status="down" />)
    expect(screen.getByText('Down')).toBeInTheDocument()
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('applies large size classes when large prop is true', () => {
    const { container } = render(<StatusBadge status="operational" large />)
    const badge = container.querySelector('.text-2xl')
    expect(badge).toBeInTheDocument()
  })

  it('applies small size classes by default', () => {
    const { container } = render(<StatusBadge status="operational" />)
    const badge = container.querySelector('.text-sm')
    expect(badge).toBeInTheDocument()
  })

  it('applies correct color classes for operational status', () => {
    const { container } = render(<StatusBadge status="operational" />)
    const badge = container.querySelector('.bg-green-100')
    expect(badge).toBeInTheDocument()
    expect(container.querySelector('.text-green-800')).toBeInTheDocument()
  })

  it('applies correct color classes for down status', () => {
    const { container } = render(<StatusBadge status="down" />)
    const badge = container.querySelector('.bg-red-100')
    expect(badge).toBeInTheDocument()
    expect(container.querySelector('.text-red-800')).toBeInTheDocument()
  })
})
