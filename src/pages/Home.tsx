import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LESSONS } from '../data/lessons'
import { useProgress } from '../lib/progress'

export function Home() {
  const { state } = useProgress()
  const nav = useNavigate()

  const pct = (slug: string) => {
    const l = LESSONS.find(x => x.slug === slug)!
    if (!l.sections.length) return 0
    const n = l.sections.filter(s => state.seen[s.id]).length
    return Math.round((n / l.sections.length) * 100)
  }

  const last = state.last
  const resume = () => {
    if (last) nav(`/pamoka/${last.slug}/${last.n}`)
    else nav('/pamoka/laikas/1')
  }

  // Kelias: taškai išdėstyti vingiuotai, kad atrodytų kaip takas
  const W = 340, STEP = 112
  const pts = LESSONS.map((_, i) => ({ x: i % 2 === 0 ? 70 : W - 70, y: 50 + i * STEP }))
  const H = 50 + (LESSONS.length - 1) * STEP + 60
  const path = pts.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `C${pts[i - 1].x},${pts[i - 1].y + STEP / 2} ${p.x},${p.y - STEP / 2} ${p.x},${p.y}`)).join(' ')

  return (
    <div>
      <header className="mb-4">
        <p className="text-sm uppercase tracking-widest text-muted">Vaizdinis kursas</p>
        <h1 className="text-3xl font-semibold leading-tight">Laiko pamokos</h1>
        <p className="mt-1 text-muted">Kvantai, laikas, smegenys ir kūno laikrodžiai – po 15 minučių vakare.</p>
      </header>

      <button type="button" onClick={resume}
        className="mb-6 w-full rounded-2xl bg-accent px-4 py-3 text-left text-white active:scale-[.98]">
        <div className="text-sm opacity-80">{last ? 'Tęsti nuo ten, kur sustojai' : 'Pradėti kursą'}</div>
        <div className="font-medium">
          {last ? `${LESSONS.find(l => l.slug === last.slug)?.title ?? ''}, ${last.n} skyrius` : '4 pamoka · Laikas'}
        </div>
      </button>

      <div className="relative mx-auto overflow-hidden" style={{ width: W, height: H, maxWidth: '100%' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0" style={{ touchAction: 'auto' }}>
          <path d={path} fill="none" stroke="var(--line)" strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" />
        </svg>
        {LESSONS.map((l, i) => {
          const p = pts[i]
          const done = pct(l.slug)
          const left = p.x < W / 2
          return (
            <motion.div key={l.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="absolute" style={{ top: p.y - 26, width: W - 70, ...(left ? { left: p.x - 26 } : { right: W - p.x - 26 }) }}>
              <Link to={l.ready ? `/pamoka/${l.slug}` : '#'} onClick={e => { if (!l.ready) e.preventDefault() }}
                className={`flex items-center gap-3 ${left ? '' : 'flex-row-reverse text-right'}`}>
                <div className={`relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 text-lg font-semibold ${
                  l.ready ? 'border-accent bg-panel text-accent' : 'border-line bg-panel-2 text-muted'}`}>
                  {l.id}
                  {done > 0 && (
                    <svg className="absolute inset-[-2px]" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="26" fill="none" stroke="var(--accent)" strokeWidth="3"
                        strokeDasharray={`${(done / 100) * 163} 163`} strokeLinecap="round" transform="rotate(-90 28 28)" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium leading-tight">{l.title}</div>
                  <div className="text-xs text-muted">
                    {l.review ? 'kartojimas' : 'nauja'} · {l.ready ? (done === 100 ? 'išeita' : done > 0 ? `${done} %` : `${l.minutes} min`) : 'ruošiama'}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
