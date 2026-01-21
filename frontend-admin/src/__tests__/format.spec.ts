import { describe, it, expect } from 'vitest'
import { formatDuration, formatDate } from '../utils/format'

describe('formatDuration', () => {
  it('should format seconds to mm:ss', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(65)).toBe('1:05')
    expect(formatDuration(3661)).toBe('61:01')
  })
})

describe('formatDate', () => {
  it('should format date string', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('2024')
  })
})
