import { useState } from 'react'
import { Panel, Readout, Slider, Toggle } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

const EVENTS = [
  { t: 0.5, label: 'žingsniai koridoriuje', icon: '👣' },
  { t: 2.2, label: 'durys atsidaro', icon: '🚪' },
  { t: 3.6, label: 'pažįstamas atsidusimas', icon: '😮‍💨' },
  { t: 6, label: '„Vėl tas pats…“', icon: '💬' },
  { t: 8, label: 'pokalbis', icon: '🗣' },
]
const sig = (x: number) => 1 / (1 + Math.exp(-x))
/** kūno įtampa 0..1 */
const tension = (t: number, predictive: boolean) => predictive
  ? 0.1 + 0.8 * sig((t - 2.4) * 2.2)       // kyla nuo pirmų užuominų, dar prieš žodžius
  : 0.1 + 0.8 * sig((t - 6.8) * 3.0)       // kyla tik po žodžių

export default function EmotionTimeline() {
  const [t, setT] = useState(0)
  const [pred, setPred] = useState(true)
  const W = 360, H = 170, x0 = 16, x1 = 344, y0 = 20, y1 = 120
  const sx = (s: number) => x0 + (s / 10) * (x1 - x0)
  const sy = (v: number) => y1 - v * (y1 - y0)
  const path = (p: boolean) => Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${sx(i / 10)},${sy(tension(i / 10, p))}`).join(' ')
  const now = tension(t, pred)
  const words = EVENTS[3].t
  const passed = EVENTS.filter(e => e.t <= t)

  return (
    <Panel caption="Kreivė – kūno įtampa (pulsas, raumenys). Žymekliai – kas vyksta. Palygink, kada kūnas sureaguoja su prognoze ir be jos.">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ touchAction: 'pan-y' }}>
        <line x1={x0} y1={y1} x2={x1} y2={y1} stroke="var(--line)" />
        <line x1={sx(words)} y1={y0 - 6} x2={sx(words)} y2={y1} stroke="var(--muted)" strokeDasharray="3 3" />
        <text x={sx(words) + 4} y={y0 + 4} fontSize={10} fill="var(--muted)">žodžiai</text>
        <path d={path(!pred)} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        <path d={path(pred)} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
        <circle cx={sx(t)} cy={sy(now)} r={7} fill="var(--accent)" stroke="var(--panel)" strokeWidth={2} />
        {EVENTS.map(e => (
          <g key={e.t} opacity={e.t <= t ? 1 : 0.35}>
            <line x1={sx(e.t)} y1={y1} x2={sx(e.t)} y2={y1 + 8} stroke="var(--muted)" />
            <text x={sx(e.t)} y={y1 + 26} fontSize={14} textAnchor="middle">{e.icon}</text>
          </g>
        ))}
        <text x={x0} y={H - 6} fontSize={10} fill="var(--muted)">kūno įtampa ↑ · laikas →</text>
      </svg>
      <div className="px-4">
        <Slider label="Laikas" value={t} min={0} max={10} step={0.05} onChange={setT} format={x => `${fmt(x, 1)} s`} />
      </div>
      <div className="px-4 pb-3"><Toggle label={pred ? 'su prognoze' : 'be prognozės (tik reakcija)'} on={pred} onChange={setPred} /></div>
      <Readout>
        {passed.length ? `${passed[passed.length - 1].label}. ` : 'Tyla. '}
        {pred
          ? (t < words && now > 0.5 ? 'Kūnas jau įsitempęs, nors žodžių dar nebuvo.' : t >= words ? 'Žodžiai tik patvirtina tai, ką kūnas jau „žinojo“.' : 'Kūnas ramus.')
          : (t < words ? 'Be prognozės kūnas laukia įvykio.' : 'Tik dabar, po žodžių, kūnas pradeda reaguoti.')}
      </Readout>
    </Panel>
  )
}
