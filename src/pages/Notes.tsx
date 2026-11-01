import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LESSONS } from '../data/lessons'
import { useProgress } from '../lib/progress'

export function Notes() {
  const [params] = useSearchParams()
  const [slug, setSlug] = useState(params.get('pamoka') ?? 'laikas')
  const { state, setNote } = useProgress()
  const lesson = LESSONS.find(l => l.slug === slug)!

  const exportMd = () => {
    const parts = LESSONS.filter(l => state.notes[l.slug]?.trim())
      .map(l => `## ${l.id} pamoka · ${l.title}\n\n${state.notes[l.slug].trim()}\n`)
    const md = `# Laiko pamokos – mano mintys\n\n${parts.join('\n') || '_(dar tuščia)_\n'}`
    try {
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'laiko-pamokos-mintys.md'; a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch { /* tyliai */ }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Mano mintys</h1>
      <p className="mb-3 text-sm text-muted">Saugoma tik tavo telefone. Gali eksportuoti kaip .md failą.</p>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LESSONS.map(l => (
          <button key={l.slug} type="button" onClick={() => setSlug(l.slug)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${slug === l.slug ? 'border-accent bg-accent text-white' : 'border-line bg-panel'}`}>
            {l.id} · {l.title}{state.notes[l.slug]?.trim() ? ' •' : ''}
          </button>
        ))}
      </div>
      <textarea value={state.notes[slug] ?? ''} onChange={e => setNote(slug, e.target.value)}
        placeholder={`Ką pagalvojai per „${lesson.title}“?`} rows={10}
        className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none focus:border-accent" />
      <button type="button" onClick={exportMd} className="mt-3 rounded-full border border-line px-4 py-2.5">Eksportuoti .md</button>
    </div>
  )
}
