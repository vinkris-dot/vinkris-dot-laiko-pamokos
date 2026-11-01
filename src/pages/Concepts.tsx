import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONCEPTS } from '../data/concepts'
import { LESSONS, byId } from '../data/lessons'
import { useProgress } from '../lib/progress'

export function Concepts() {
  const [q, setQ] = useState('')
  const { state } = useProgress()

  // Kaupiamasis sąrašas: rodomos sąvokos iš skyrių, kuriuos jau peržiūrėjai; jei dar nieko – visos 4 pamokos.
  const learned = useMemo(() => {
    const anySeen = Object.keys(state.seen).length > 0
    return CONCEPTS.filter(c => {
      const l = byId(c.lesson)
      if (!l || !l.ready) return false
      const s = l.sections[c.section - 1]
      return anySeen ? !!(s && state.seen[s.id]) : true
    })
  }, [state.seen])

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const shown = learned.filter(c => !q || norm(`${c.term} ${c.en ?? ''} ${c.short}`).includes(norm(q)))
  const groups = LESSONS.filter(l => shown.some(c => c.lesson === l.id))

  return (
    <div>
      <h1 className="text-2xl font-semibold">Sąvokos</h1>
      <p className="mb-3 text-sm text-muted">Kaupiasi su kiekvienu peržiūrėtu skyriumi. Paliesk sąvoką – nukels į vizualizaciją.</p>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ieškoti…" inputMode="search"
        className="mb-4 w-full rounded-full border border-line bg-panel px-4 py-2.5 outline-none focus:border-accent" />
      {shown.length === 0 && <p className="text-muted">Nieko nerasta.</p>}
      {groups.map(l => (
        <section key={l.id} className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-widest text-muted">{l.id} pamoka · {l.title}</h2>
          <ul className="space-y-2">
            {shown.filter(c => c.lesson === l.id).map(c => (
              <li key={c.id}>
                <Link to={`/pamoka/${l.slug}/${c.section}`} className="block rounded-2xl border border-line bg-panel px-4 py-3">
                  <div className="font-medium leading-snug">{c.term}{c.en && <span className="ml-1 text-sm font-normal text-muted">({c.en})</span>}</div>
                  <p className="mt-1 text-sm text-muted">{c.short}</p>
                  <p className="mt-1 text-xs text-accent">→ {c.section} skyrius</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
