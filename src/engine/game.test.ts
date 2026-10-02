import { describe, expect, it } from 'vitest'
import { parseFlags } from './flags'
import { applyResult, currentIndex, formatTime, newRun, reshuffle, timerMsFor, type Run } from './game'

const rng = () => 0.42

describe('timer', () => {
  it('starts at 8s, drops 0.5s per email, floors at 3s', () => {
    const times = Array.from({ length: 13 }, (_, answered) => timerMsFor(8000, answered))
    expect(times).toEqual([8000, 7500, 7000, 6500, 6000, 5500, 5000, 4500, 4000, 3500, 3000, 3000, 3000])
  })
})

describe('scoring', () => {
  it('success adds 100 and builds the streak', () => {
    let run = newRun(5)
    run = applyResult(run, 'success', rng)
    run = applyResult(run, 'success', rng)
    expect(run).toMatchObject({ score: 200, streak: 2, answered: 2 })
  })

  it('awkward adds 25 and resets the streak', () => {
    let run = newRun(5)
    run = applyResult(run, 'success', rng)
    run = applyResult(run, 'awkward', rng)
    expect(run).toMatchObject({ score: 125, streak: 0, answered: 2 })
  })
})

describe('deck', () => {
  it('plays the first pass in order', () => {
    let run = newRun(5)
    const seen: number[] = []
    for (let i = 0; i < 5; i++) {
      seen.push(currentIndex(run))
      run = applyResult(run, 'success', rng)
    }
    expect(seen).toEqual([0, 1, 2, 3, 4])
  })

  it('can start on a chosen email', () => {
    expect(newRun(5, 2).deck).toEqual([2, 0, 1, 3, 4])
  })

  it('reshuffles after every pass and keeps going', () => {
    let run: Run = newRun(5)
    let seed = 1
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    let previous = -1
    for (let pass = 0; pass < 20; pass++) {
      const seen: number[] = []
      for (let i = 0; i < 5; i++) {
        seen.push(currentIndex(run))
        run = applyResult(run, 'success', random)
      }
      expect([...seen].sort()).toEqual([0, 1, 2, 3, 4])
      expect(seen[0]).not.toBe(previous)
      previous = seen[4]
    }
    expect(run.answered).toBe(100)
  })

  it('never opens a new pass with the email just played', () => {
    for (let last = 0; last < 5; last++) {
      for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
        expect(reshuffle(5, last, () => r)[0]).not.toBe(last)
      }
    }
  })
})

describe('formatTime', () => {
  it('shows minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(9999)).toBe('0:09')
    expect(formatTime(83400)).toBe('1:23')
  })
})

describe('test flags', () => {
  it('defaults to the first email at normal speed', () => {
    expect(parseFlags('', 5)).toEqual({ startIndex: 0, slow: false })
  })

  it('reads ?email=3 and ?slow=1', () => {
    expect(parseFlags('?email=3&slow=1', 5)).toEqual({ startIndex: 2, slow: true })
  })

  it('ignores emails that do not exist', () => {
    for (const bad of ['?email=0', '?email=6', '?email=abc', '?email=1.5']) {
      expect(parseFlags(bad, 5).startIndex).toBe(0)
    }
  })
})
