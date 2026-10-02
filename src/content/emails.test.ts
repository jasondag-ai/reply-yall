import { describe, expect, it } from 'vitest'
import { ACTION_IDS, emails } from './emails'

const RESULTS = ['success', 'awkward', 'disaster']

describe('emails', () => {
  it('has 5 emails with unique ids', () => {
    expect(emails).toHaveLength(5)
    expect(new Set(emails.map((e) => e.id)).size).toBe(5)
  })

  it.each(emails.map((e) => [e.id, e] as const))('%s is complete', (_id, email) => {
    expect(email.subject).not.toBe('')
    expect(email.from.name).not.toBe('')
    expect(email.to.length).toBeGreaterThan(0)
    expect(email.timerMs).toBe(8000)

    const lines = email.body.split('\n')
    expect(lines.length).toBeGreaterThanOrEqual(1)
    expect(lines.length).toBeLessThanOrEqual(3)
    for (const line of lines) expect(line.trim()).not.toBe('')

    for (const action of ACTION_IDS) {
      const outcome = email.actions[action]
      expect(RESULTS).toContain(outcome.result)
      expect(outcome.line).not.toBe('')
      expect(outcome.line).not.toContain('\n')
    }
  })

  it('gives every email a safe answer and a trap', () => {
    for (const email of emails) {
      const results = ACTION_IDS.map((a) => email.actions[a].result)
      expect(results).toContain('success')
      expect(results).toContain('disaster')
    }
  })

  it('makes Reply All the trap in at least 2 emails', () => {
    const traps = emails.filter((e) => e.actions.replyAll.result === 'disaster')
    expect(traps.length).toBeGreaterThanOrEqual(2)
  })
})
