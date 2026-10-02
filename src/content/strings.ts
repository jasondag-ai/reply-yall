// All player-facing text lives in src/content. No em dashes in game text.
export const strings = {
  title: {
    to: 'To: All Staff',
    time: '8:59 AM',
    name: 'Reply Y’all',
    tagline: 'One tap from HR.',
    start: 'Start',
  },
  game: {
    score: 'Score',
    streak: 'Streak',
    to: 'To',
    cc: 'Cc',
    timer: 'Time left',
    actions: {
      reply: 'Reply',
      replyAll: 'Reply All',
      forward: 'Forward',
      archive: 'Archive',
    },
    toast: {
      success: 'Good call',
      awkward: 'Awkward',
    },
  },
  disaster: {
    stamp: 'HR would like a word',
    tapped: 'You tapped',
    timeoutCause: 'You ran out of time',
    timeoutLine: 'You said nothing for too long. In this office, that counts as a statement.',
    next: 'Continue',
  },
  gameOver: {
    heading: 'Game over',
    tagline: 'Bless your heart.',
    time: 'Time survived',
    score: 'Score',
    best: 'Best',
    newBest: 'New best',
    rematch: 'Rematch',
  },
} as const
