import { useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'

const g = (d: number, c: number, w: number) => Math.exp(-((d - c) ** 2) / (2 * w * w))
const estrogen = (d: number) => 0.15 + 0.85 * g(d, 13, 2.2) + 0.45 * g(d, 21, 3.5)
const progesterone = (d: number) => 0.05 + 0.95 * g(d, 21, 3.2)
const PHASES = [
  { from: 1, to: 5, name: 'menstruacija' },
  { from: 6, to: 13, name: 'folikulinė fazė' },
  { from: 14, to: 14, name: 'ovuliacija' },
  { from: 15, to: 28, name: 'liutealinė fazė' },
]
/** vidutinės tendencijos 0..1 */
const BODY = (d: number) => ({
  apetitas: 0.35 + 0.5 * g(d, 24, 4),
  temperatura: d >= 15 ? 0.8 : 0.35,
  energija: 0.35 + 0.55 * g(d, 12, 4) - 0.15 * g(d, 27, 2),
  nuotaika: 0.6 + 0.25 * g(d, 12, 4) - 0.3 * g(d, 26, 2.5),
})

export default function Cycle28() {
  const [day, setDay] = useState(1)
  const W = 360, x0 = 20, x1 = 340, y0 = 20, y1 = 120
  const sx = (d: number) => x0 + ((d - 1) / 27) * (x1 - x0)
  const sy = (v: number) => y1 - v * (y1 - y0)
  const path = (f: (d: number) => number) => Array.from({ length: 109 }, (_, i) => { const d = 1 + i / 4; return `${i ? 'L' : 'M'}${sx(d)},${sy(f(d))}` }).join(' ')
  const phase = PHASES.find(p => day >= p.from && day <= p.to)!
  const b = BODY(day)
  const bars: [string, number, string][] = [
    ['apetitas', b.apetitas, b.apetitas > 0.6 ? 'didesnis' : 'įprastas'],
    ['temperatūra', b.temperatura, b.temperatura > 0.6 ? '+0,3–0,5 °C' : 'įprasta'],
    ['energija', b.energija, b.energija > 0.65 ? 'aukšta' : b.energija < 0.3 ? 'žema' : 'vidutinė'],
    ['nuotaika', b.nuotaika, b.nuotaika > 0.7 ? 'pakili' : b.nuotaika < 0.45 ? 'jautresnė' : 'stabili'],
  ]
  return (
    <Panel caption="Kreivės – hormonų lygis per ciklą (vidurkiai). Juostos – ką tą dieną dažniausiai jaučia kūnas. Tavo ciklas gali būti kitoks.">
      <svg viewBox={`0 0 ${W} 150`} className="w-full" style={{ touchAction: 'pan-y' }}>
        {PHASES.map(p => <rect key={p.name} x={sx(p.from)} y={y0} width={Math.max(2, sx(p.to + 1) - sx(p.from))} height={y1 - y0} fill={p === phase ? 'var(--accent-soft)' : 'transparent'} />)}
        <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="var(--line)" />
        <path d={path(estrogen)} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        <path d={path(progesterone)} fill="none" stroke="var(--fg)" strokeWidth={2.5} strokeDasharray="5 3" />
        <line x1={sx(day)} y1={y0} x2={sx(day)} y2={y1} stroke="var(--muted)" />
        <circle cx={sx(day)} cy={sy(estrogen(day))} r={5} fill="var(--accent)" />
        <circle cx={sx(day)} cy={sy(progesterone(day))} r={5} fill="var(--fg)" />
        <text x={x0} y={y1 + 14} fontSize={10} fill="var(--muted)">1 d.</text>
        <text x={sx(14)} y={y1 + 14} fontSize={10} fill="var(--muted)" textAnchor="middle">14 d.</text>
        <text x={x1} y={y1 + 14} fontSize={10} fill="var(--muted)" textAnchor="end">28 d.</text>
        <text x={x0 + 4} y={y0 + 4} fontSize={10} fill="var(--accent)">— estrogenas</text>
        <text x={x0 + 4} y={y0 + 16} fontSize={10} fill="var(--fg)">- - progesteronas</text>
        <text x={x0} y={y1 + 28} fontSize={11} fill="var(--fg)">{day} diena · {phase.name}</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 pb-2 text-sm">
        {bars.map(([name, v, label]) => (
          <div key={name}>
            <div className="flex justify-between text-xs text-muted"><span>{name}</span><span>{label}</span></div>
            <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${v * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="px-4">
        <Slider label="Ciklo diena" value={day} min={1} max={28} step={1} onChange={setDay} format={v => `${v} d.`} />
      </div>
      <Readout>{day <= 5 ? 'Abu hormonai žemai: menstruacija.' : day < 14 ? 'Estrogenas kyla: daugiau energijos, dažnai geresnė nuotaika.' : day === 14 ? 'Ovuliacija: estrogeno pikas.' : day < 24 ? 'Progesteronas aukštai: temperatūra pakilusi, didesnis apetitas.' : 'Abu hormonai krinta: jautresnė nuotaika, mažiau energijos.'}</Readout>
    </Panel>
  )
}
