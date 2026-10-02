import { describe, expect, it } from 'vitest'
import { strings } from './strings'

function allText(node: unknown): string[] {
  if (typeof node === 'string') return [node]
  if (node && typeof node === 'object') return Object.values(node).flatMap(allText)
  return []
}

describe('game text', () => {
  it('has the title and tagline', () => {
    expect(strings.title.name).toBe('Reply Y’all')
    expect(strings.title.tagline).toBe('One tap from HR.')
  })

  it('never uses em dashes', () => {
    const text = allText(strings)
    expect(text.length).toBeGreaterThan(0)
    for (const line of text) expect(line).not.toContain('—')
  })
})
