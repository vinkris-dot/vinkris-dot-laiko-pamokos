import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadState, saveState } from './storage'

export interface ProgressState {
  seen: Record<string, true>            // skyriaus id -> peržiūrėta
  quiz: Record<string, number>          // klausimo id -> pasirinkto atsakymo indeksas
  notes: Record<string, string>         // pamokos slug -> užrašai
  last: { slug: string; n: number } | null
}

const EMPTY: ProgressState = { seen: {}, quiz: {}, notes: {}, last: null }

interface Api {
  state: ProgressState
  markSeen: (sectionId: string, slug: string, n: number) => void
  answer: (qid: string, choice: number) => void
  setNote: (slug: string, text: string) => void
  reset: () => void
}

const Ctx = createContext<Api | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadState(EMPTY))

  useEffect(() => { saveState(state) }, [state])

  const markSeen = useCallback((sectionId: string, slug: string, n: number) => {
    setState(s => {
      if (s.seen[sectionId] && s.last?.slug === slug && s.last?.n === n) return s
      return { ...s, seen: { ...s.seen, [sectionId]: true }, last: { slug, n } }
    })
  }, [])

  const answer = useCallback((qid: string, choice: number) => {
    setState(s => ({ ...s, quiz: { ...s.quiz, [qid]: choice } }))
  }, [])

  const setNote = useCallback((slug: string, text: string) => {
    setState(s => ({ ...s, notes: { ...s.notes, [slug]: text } }))
  }, [])

  const reset = useCallback(() => setState(EMPTY), [])

  const api = useMemo(() => ({ state, markSeen, answer, setNote, reset }), [state, markSeen, answer, setNote, reset])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useProgress(): Api {
  const v = useContext(Ctx)
  if (!v) throw new Error('useProgress be ProgressProvider')
  return v
}
