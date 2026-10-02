const KEY = 'reply-yall-best'

// localStorage can throw in private windows or when blocked. The game plays on without it.
export function loadBest(): number {
  try {
    const n = Number(window.localStorage.getItem(KEY))
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function saveBest(score: number): void {
  try {
    window.localStorage.setItem(KEY, String(score))
  } catch {
    // Best score just won't persist.
  }
}
