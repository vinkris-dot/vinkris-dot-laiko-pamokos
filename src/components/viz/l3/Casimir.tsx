import { useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

export default function Casimir() {
  const [d, setD] = useState(0.7)   // 0..1 atstumas
  const W = 360, H = 200, cx = 180, cy = 100
  const gap = 20 + d * 140
  const xL = cx - gap / 2, xR = cx + gap / 2
  const inside = Math.max(1, Math.floor(gap / 24))        // kiek bangų telpa
  const force = Math.min(1, 0.02 / Math.pow(0.1 + d * 0.9, 4) * 0.1 * 5)
  const wave = (x0: number, x1: number, n: number, key: string) => {
    const L = x1 - x0, pts = Array.from({ length: 60 }, (_, i) => { const x = x0 + (L * i) / 59; return `${i ? 'L' : 'M'}${x},${cy - 14 * Math.sin((Math.PI * n * i) / 59)}` }).join(' ')
    return <path key={key} d={pts} fill="none" stroke="var(--accent)" strokeWidth={1.5} opacity={0.8} />
  }
  return (
    <Panel caption="Dvi plokštelės vakuume. Tarp jų telpa tik bangos, kurios „įsitenka“ į tarpą; išorėje – visos. Rodyklės – išorės spaudimas.">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ touchAction: 'pan-y' }}>
        {[1, 2, 3, 4, 5, 6].map(n => wave(0, xL, n, `l${n}`))}
        {[1, 2, 3, 4, 5, 6].map(n => wave(xR, W, n, `r${n}`))}
        {Array.from({ length: inside }, (_, i) => wave(xL, xR, i + 1, `m${i}`))}
        <rect x={xL - 4} y={30} width={8} height={140} fill="var(--fg)" />
        <rect x={xR - 4} y={30} width={8} height={140} fill="var(--fg)" />
        <g stroke="var(--fg)" strokeWidth={3 + force * 4} fill="var(--fg)">
          <line x1={xL - 70 * force - 10} y1={cy + 60} x2={xL - 10} y2={cy + 60} /><polygon points={`${xL - 8},${cy + 60} ${xL - 18},${cy + 54} ${xL - 18},${cy + 66}`} />
          <line x1={xR + 70 * force + 10} y1={cy + 60} x2={xR + 10} y2={cy + 60} /><polygon points={`${xR + 8},${cy + 60} ${xR + 18},${cy + 54} ${xR + 18},${cy + 66}`} />
        </g>
        <text x={cx} y={190} fontSize={11} textAnchor="middle" fill="var(--muted)">tarp plokštelių telpa {inside} {inside === 1 ? 'banga' : inside < 10 ? 'bangos' : 'bangų'}</text>
      </svg>
      <div className="px-4"><Slider label="Atstumas tarp plokštelių" value={d} min={0} max={1} onChange={setD} format={v => fmt(v * 100, 0) + ' %'} /></div>
      <Readout>{d > 0.6 ? 'Toli: viduje ir išorėje bangų beveik vienodai, jėga nejuntama.' : d > 0.25 ? 'Arčiau: viduje bangų mažiau – išorė pradeda spausti.' : 'Labai arti: jėga auga kaip atstumo ketvirtas laipsnis.'}</Readout>
    </Panel>
  )
}
