import { READINGS, READING_ORDER } from '../data/readings'
import { byId } from '../data/lessons'

export function Readings() {
  const groups = [...new Set(READINGS.map(r => r.group))]
  return (
    <div>
      <h1 className="text-2xl font-semibold">Skaitiniai</h1>
      <p className="mb-4 rounded-2xl bg-accent-soft px-4 py-3 text-sm">{READING_ORDER}</p>
      {groups.map(g => (
        <section key={g} className="mb-6">
          <h2 className="mb-2 text-sm uppercase tracking-widest text-muted">{g}</h2>
          <ul className="space-y-2">
            {READINGS.filter(r => r.group === g).map(r => (
              <li key={r.title} className="rounded-2xl border border-line bg-panel px-4 py-3">
                <div className="font-medium leading-snug"><em>{r.title}</em></div>
                <div className="text-sm text-muted">{r.author} · {r.year}</div>
                <p className="mt-1 text-sm">{r.note}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-panel-2 px-2 py-0.5 text-muted">→ {r.lesson} pamoka · {byId(r.lesson)?.title}</span>
                  {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-accent">atidaryti</a>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
