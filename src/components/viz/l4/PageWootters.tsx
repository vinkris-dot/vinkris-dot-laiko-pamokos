import { useEffect, useRef, useState } from 'react'
import { Panel, Readout, Slider, Toggle } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

/** Laikrodis ir švytuoklė – susieta pora. Bendra būsena nejuda; stebint koreliaciją atsiranda tėkmė. */
const N = 12
const pairs = Array.from({ length: N }, (_, i) => ({ clock: (i / N) * 360, pend: 40 * Math.sin((i / N) * Math.PI * 2) }))

export default function PageWootters() {
  const [angle, setAngle] = useState(0)        // laikrodžio rodyklė, laipsniais
  const [auto, setAuto] = useState(false)
  const dialRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!auto) return
    let raf = 0, last = performance.now()
    const loop = (now: number) => { setAngle(a => (a + (now - last) * 0.06) % 360); last = now; raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [auto])

  const pend = 40 * Math.sin((angle / 360) * Math.PI * 2)

  const dragTo = (e: React.PointerEvent) => {
    const svg = dialRef.current; if (!svg) return
    const r = svg.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2)
    let a = (Math.atan2(y, x) * 180) / Math.PI + 90
    if (a < 0) a += 360
    setAuto(false); setAngle(a)
  }

  const idx = Math.round((angle / 360) * N) % N
  const rad = ((angle - 90) * Math.PI) / 180

  return (
    <Panel caption="Viršuje – bendra būsena iš išorės: nejudantis porų sąrašas. Apačioje – kas matyti iš vidaus: suk laikrodį, ir švytuoklė „juda“ kartu.">
      {/* Bendra būsena */}
      <div className="px-4 pt-3">
        <div className="text-xs uppercase tracking-widest text-muted">Iš išorės: bendra būsena (nejuda)</div>
        <div className="mt-2 flex justify-between">
          {pairs.map((p, i) => (
            <div key={i} className={`flex flex-col items-center rounded-md p-0.5 ${i === idx ? 'bg-accent-soft' : ''}`}>
              <svg width={18} height={18} viewBox="-10 -10 20 20">
                <circle r={8} fill="none" stroke="var(--muted)" strokeWidth={1.2} />
                <line x1={0} y1={0} x2={7 * Math.cos(((p.clock - 90) * Math.PI) / 180)} y2={7 * Math.sin(((p.clock - 90) * Math.PI) / 180)} stroke="var(--fg)" strokeWidth={1.5} />
              </svg>
              <svg width={18} height={18} viewBox="-10 -4 20 20">
                <line x1={0} y1={0} x2={12 * Math.sin((p.pend * Math.PI) / 180)} y2={12 * Math.cos((p.pend * Math.PI) / 180)} stroke="var(--accent)" strokeWidth={1.5} />
                <circle cx={12 * Math.sin((p.pend * Math.PI) / 180)} cy={12 * Math.cos((p.pend * Math.PI) / 180)} r={2.5} fill="var(--accent)" />
              </svg>
            </div>
          ))}
        </div>
        <div className="mt-1 text-center text-xs text-muted">kiekviena pora: laikrodis ↔ švytuoklė; jos susietos</div>
      </div>

      <div className="mt-3 text-center text-xs uppercase tracking-widest text-muted">Iš vidaus: stebėtojas lygina dalis</div>
      <div className="flex items-center justify-around px-2 py-2">
        <svg ref={dialRef} width={150} height={150} viewBox="-75 -75 150 150" onPointerDown={e => { (e.target as Element).setPointerCapture(e.pointerId); dragTo(e) }} onPointerMove={e => e.buttons && dragTo(e)}>
          <circle r={64} fill="var(--panel-2)" stroke="var(--line)" strokeWidth={2} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <line key={i} x1={56 * Math.cos(a)} y1={56 * Math.sin(a)} x2={62 * Math.cos(a)} y2={62 * Math.sin(a)} stroke="var(--muted)" strokeWidth={2} />
          })}
          <line x1={0} y1={0} x2={48 * Math.cos(rad)} y2={48 * Math.sin(rad)} stroke="var(--fg)" strokeWidth={4} strokeLinecap="round" />
          <circle cx={48 * Math.cos(rad)} cy={48 * Math.sin(rad)} r={9} fill="var(--accent)" />
          <circle r={4} fill="var(--fg)" />
        </svg>
        <svg width={150} height={150} viewBox="-75 -20 150 150">
          <line x1={-40} y1={0} x2={40} y2={0} stroke="var(--line)" strokeWidth={3} />
          <line x1={0} y1={0} x2={90 * Math.sin((pend * Math.PI) / 180)} y2={90 * Math.cos((pend * Math.PI) / 180)} stroke="var(--fg)" strokeWidth={2.5} />
          <circle cx={90 * Math.sin((pend * Math.PI) / 180)} cy={90 * Math.cos((pend * Math.PI) / 180)} r={13} fill="var(--accent)" />
        </svg>
      </div>
      <div className="-mt-2 flex justify-around text-xs text-muted"><span>laikrodis</span><span>likusi sistema</span></div>
      <div className="px-4">
        <Slider label="Laikrodžio rodyklė" value={angle} min={0} max={359} step={1} onChange={v => { setAuto(false); setAngle(v) }} format={x => `${fmt(x, 0)}°`} />
      </div>
      <div className="px-4 pb-3"><Toggle label="stebėti iš eilės" on={auto} onChange={setAuto} /></div>
      <Readout>{auto ? 'Sudėjus koreliacijas iš eilės atrodo, kad švytuoklė juda. Iš išorės – niekas nepasikeitė.' : 'Suk rodyklę pirštu arba slankikliu.'}</Readout>
    </Panel>
  )
}
