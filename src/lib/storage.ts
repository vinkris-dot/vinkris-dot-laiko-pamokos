// Saugus localStorage sluoksnis: niekada nemeta klaidos.
const KEY = 'laiko-pamokos:v1'

export function loadState<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return { ...fallback, ...parsed }
  } catch {
    return fallback
  }
}

export function saveState<T>(state: T): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // tyliai – pvz., privatus režimas
  }
}
