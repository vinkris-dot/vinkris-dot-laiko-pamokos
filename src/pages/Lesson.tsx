import { Suspense, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { bySlug } from '../data/lessons'
import { useProgress } from '../lib/progress'
import { Tag } from '../components/ui/Tag'
import { Formula } from '../components/ui/Formula'
import { VIZ } from '../components/viz/registry'

export function LessonOverview() {
  const { slug } = useParams()
  const lesson = bySlug(slug)
  const { state } = useProgress()
  if (!lesson) return <p>Pamoka nerasta.</p>
  return (
    <div>
      <Link to="/" className="text-sm text-muted">← Pamokos</Link>
      <p className="mt-3 text-sm uppercase tracking-widest text-muted">{lesson.id} pamoka · {lesson.minutes} min</p>
      <h1 className="text-3xl font-semibold leading-tight">{lesson.title}</h1>
      <p className="mb-5 text-muted">{lesson.subtitle}</p>
      <ol className="space-y-2">
        {lesson.sections.map((s, i) => (
          <li key={s.id}>
            <Link to={`/pamoka/${lesson.slug}/${i + 1}`}
              className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-4 py-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${state.seen[s.id] ? 'bg-accent text-white' : 'bg-panel-2 text-muted'}`}>
                {state.seen[s.id] ? '✓' : i + 1}
              </span>
              <span className="leading-snug">{s.title}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link to={`/pamoka/${lesson.slug}/pasitikrinimas`}
            className="flex items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3 text-muted">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-2 text-sm">?</span>
            Pasitikrinimas
          </Link>
        </li>
      </ol>
    </div>
  )
}

export function LessonSection() {
  const { slug, n } = useParams()
  const lesson = bySlug(slug)
  const idx = Math.max(0, (parseInt(n ?? '1', 10) || 1) - 1)
  const section = lesson?.sections[idx]
  const { markSeen } = useProgress()
  const nav = useNavigate()

  useEffect(() => {
    if (lesson && section) markSeen(section.id, lesson.slug, idx + 1)
    window.scrollTo({ top: 0 })
  }, [lesson, section, idx, markSeen])

  if (!lesson || !section) return <p>Skyrius nerastas.</p>
  const Viz = VIZ[section.viz]
  const total = lesson.sections.length
  const isLast = idx === total - 1

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-muted">
        <Link to={`/pamoka/${lesson.slug}`}>← {lesson.title}</Link>
        <span>{idx + 1} / {total}</span>
      </div>
      <div className="mb-4 flex gap-1">
        {lesson.sections.map((s, i) => (
          <span key={s.id} className={`h-1 flex-1 rounded-full ${i <= idx ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.article key={section.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>
          <h1 className="text-2xl font-semibold leading-tight">{section.title}</h1>
          <div className="mt-2"><Tag kind={section.tag} why={section.why} /></div>
          <div className="prose mt-4">
            {section.text.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {section.formula && <Formula f={section.formula} />}

          <Suspense fallback={<div className="my-4 h-64 animate-pulse rounded-2xl bg-panel-2" />}>
            {Viz ? <Viz /> : <p className="text-muted">Vizualizacija ruošiama.</p>}
          </Suspense>

          <aside className="rounded-2xl bg-accent-soft px-4 py-3">
            <div className="text-xs uppercase tracking-widest text-accent">Ką čia pamatei</div>
            <p className="mt-1">{section.seen}</p>
          </aside>
        </motion.article>
      </AnimatePresence>

      <div className="mt-6 flex gap-3">
        <button type="button" disabled={idx === 0} onClick={() => nav(`/pamoka/${lesson.slug}/${idx}`)}
          className="rounded-full border border-line px-4 py-2.5 disabled:opacity-30">← Atgal</button>
        <button type="button"
          onClick={() => nav(isLast ? `/pamoka/${lesson.slug}/pasitikrinimas` : `/pamoka/${lesson.slug}/${idx + 2}`)}
          className="flex-1 rounded-full bg-accent px-4 py-2.5 font-medium text-white">
          {isLast ? 'Pasitikrinti →' : 'Toliau →'}
        </button>
      </div>
    </div>
  )
}
