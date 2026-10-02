// Email content. No em dashes in game text.
// Each email: a setup, a trap, a punchline.

export type ActionId = 'reply' | 'replyAll' | 'forward' | 'archive'
export type Result = 'success' | 'awkward' | 'disaster'

export interface Outcome {
  result: Result
  /** One line shown after the tap. */
  line: string
}

export interface Email {
  id: string
  subject: string
  from: { name: string; detail: string }
  to: string[]
  cc: string[]
  /** 1 to 3 lines, separated by \n. */
  body: string
  /** Time allowed before any per-run speed-up. */
  timerMs: number
  actions: Record<ActionId, Outcome>
}

export const ACTION_IDS: readonly ActionId[] = ['reply', 'replyAll', 'forward', 'archive']

export const emails: readonly Email[] = [
  {
    id: 'casserole',
    subject: 'Loretta’s casserole',
    from: { name: 'Travis Boudreaux', detail: 'Sales' },
    to: ['You'],
    cc: ['Loretta Pike, Payroll'],
    body: 'Between us, does Loretta’s squash casserole taste like a punishment to you too?\nDo NOT let her know I said that.',
    timerMs: 8000,
    actions: {
      reply: {
        result: 'success',
        line: 'You quietly tell Travis who he copied. He goes pale. You go to lunch.',
      },
      replyAll: {
        result: 'disaster',
        line: 'Your “Lord, yes” went to Loretta too. Loretta runs payroll. Your direct deposit is now “pending.”',
      },
      forward: {
        result: 'awkward',
        line: 'You forwarded it to your mama for a ruling. She sided with Loretta.',
      },
      archive: {
        result: 'awkward',
        line: 'You stayed out of it. Travis now tells people you “had no comment.”',
      },
    },
  },
  {
    id: 'boat-wax',
    subject: 'Y’all shipped me the WRONG ONE',
    from: { name: 'Buck Thibodeaux', detail: 'Thibodeaux Marine' },
    to: ['You'],
    cc: ['Dale Guidry, Attorney'],
    body: 'I ordered boat wax. I got 40 cases of baby wipes.\nI have copied my attorney, who is also my cousin.\nWhose fault is this?',
    timerMs: 8000,
    actions: {
      reply: {
        result: 'disaster',
        line: 'You promised Buck a full refund. It came to $48,000. You make eleven dollars an hour.',
      },
      replyAll: {
        result: 'disaster',
        line: 'Your “so sorry, totally our fault” went to his attorney. Legal thanks you for the confession.',
      },
      forward: {
        result: 'success',
        line: 'You sent it to Mr. Hollis without a word. He called it the first sensible thing he’d seen all week.',
      },
      archive: {
        result: 'awkward',
        line: 'You archived an angry man. He called the front desk. You are the front desk.',
      },
    },
  },
  {
    id: 'gift-cards',
    subject: 'Quick favor. Keep it quiet.',
    from: { name: 'Mr. Hollis, CEO', detail: 'ceo.hollis77@gmail.com' },
    to: ['You'],
    cc: [],
    body: 'In a meeting, can’t talk.\nNeed 10 gift cards, $200 each, for a client. Send me the codes.\nTell no one. It’s a surprise.',
    timerMs: 8000,
    actions: {
      reply: {
        result: 'disaster',
        line: 'You sent $2,000 in gift card codes to a stranger. The real Mr. Hollis sits twelve feet from you.',
      },
      replyAll: {
        result: 'awkward',
        line: 'Nobody else was on it, so you just asked a scammer, “Is this real?” He said yes.',
      },
      forward: {
        result: 'success',
        line: 'You forwarded it to IT. Wendell wrote back “good catch,” which is the most he has ever said.',
      },
      archive: {
        result: 'awkward',
        line: 'You ignored it. Kyle in Shipping got one too, and did not. He asks why nobody warned him.',
      },
    },
  },
  {
    id: 'training',
    subject: 'Confirm by 5: Respect at Work training',
    from: { name: 'Patrice Odom', detail: 'Human Resources' },
    to: ['Front Office (6)'],
    cc: ['Mr. Hollis'],
    body: 'Reply all on this thread to confirm you finished the training.\nThe auditor wants every name on one chain.\nBless the heart of whoever skips this.',
    timerMs: 8000,
    actions: {
      reply: {
        result: 'awkward',
        line: 'Only Patrice saw it. She asked the whole chain why one of us can’t follow instructions.',
      },
      replyAll: {
        result: 'success',
        line: 'Your name is on the chain. Patrice sent a thumbs up, which from her is a parade.',
      },
      forward: {
        result: 'awkward',
        line: 'You forwarded it to a vendor. He took the training. He scored higher than you.',
      },
      archive: {
        result: 'disaster',
        line: 'Yours was the only name missing. Patrice booked you the three-hour refresher. In person. With Patrice.',
      },
    },
  },
  {
    id: 'reply-all-storm',
    subject: 'RE: RE: RE: STOP REPLYING ALL',
    from: { name: 'Gary Fontenot', detail: 'Warehouse' },
    to: ['All Staff (212)'],
    cc: [],
    body: 'Every one of y’all is replying all to say stop replying all.\nI have a forklift and a short fuse. Do not test me.',
    timerMs: 8000,
    actions: {
      reply: {
        result: 'awkward',
        line: 'You told Gary, privately, to calm down. Gary does not calm down. Gary printed it out.',
      },
      replyAll: {
        result: 'disaster',
        line: 'You replied all to say “agreed, please stop.” You were reply number 100. The server went down with your name on it.',
      },
      forward: {
        result: 'awkward',
        line: 'You forwarded it to a friend for a laugh. Your friend works here. Your friend replied all.',
      },
      archive: {
        result: 'success',
        line: 'You did nothing, and did it beautifully. The storm passed right over you.',
      },
    },
  },
]
