// Test flags read from the URL.
//   ?email=3  start on the third email
//   ?slow=1   every timer is 30s

export interface Flags {
  startIndex: number
  slow: boolean
}

export function parseFlags(search: string, emailCount: number): Flags {
  const params = new URLSearchParams(search)
  const n = Number(params.get('email'))
  const startIndex = Number.isInteger(n) && n >= 1 && n <= emailCount ? n - 1 : 0
  return { startIndex, slow: params.get('slow') === '1' }
}
