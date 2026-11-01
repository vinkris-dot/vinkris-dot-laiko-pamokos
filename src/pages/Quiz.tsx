import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { bySlug } from '../data/lessons'
import { useProgress } from '../lib/progress'

export function Quiz() {
  const { slug } = useParams()
  const lesson = bySlug(slug)
  const { state, answer } = useProgress()
  if (!lesson) return <p>Pamoka nerasta.</p>

  return (
    <div>
      <Link to={`/pamoka/${lesson.slug}`} className="text-sm text-muted">← {lesson.title}</Link>
      <h1 className="mt-3 text-2xl font-semibold leading-tight">Pasitikrinimas</h1>
      <p className="mb-5 text-muted">Ne egzaminas. Po atsakymo pamatysi, kodėl taip. Gali ir praleisti.</p>

      <ol className="space-y-5">
        {lesson.quiz.map((q, qi) => {
          const chosen = state.quiz[q.id]
          const answered = chosen !== undefined
          return (
            <li key={q.id} className="rounded-2xl border border-line bg-panel p-4">
              <p className="font-medium leading-snug">{qi + 1}. {q.q}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((o, oi) => {
                  const isRight = oi === q.answer
                  const cls = !answered ? 'border-line' : isRight ? 'border-ok bg-ok/10' : oi === chosen ? 'border-bad bg-bad/10' : 'border-line opacity-60'
                  return (
                    <button key={oi} type="button" disabled={answered} onClick={() => answer(q.id, oi)}
                      className={`block w-full rounded-xl border px-3 py-2.5 text-left leading-snug ${cls}`}>
                      {o}
                    </button>
                  )
                })}
              </div>
              {answered && (
                <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-muted">
                  <span className={chosen === q.answer ? 'text-ok' : 'text-bad'}>{chosen === q.answer ? 'Taip. ' : 'Ne visai. '}</span>
                  {q.explain}
                </motion.p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex flex-col gap-3">
        <Link to="/savokos" className="rounded-full bg-accent px-4 py-2.5 text-center font-medium text-white">Sąvokų sąrašas →</Link>
        <Link to={`/mintys?pamoka=${lesson.slug}`} className="rounded-full border border-line px-4 py-2.5 text-center">Užsirašyti mintį</Link>
        <Link to="/" className="py-2 text-center text-sm text-muted">Į pamokų žemėlapį</Link>
      </div>
    </div>
  )
}
