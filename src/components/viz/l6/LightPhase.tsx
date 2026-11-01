import { useState } from 'react'
import { Button, Panel, Readout, Slider } from '../../ui/Controls'

const TYPES = [
  { id: 'anksti', label: 'vyturys', start: 22 },
  { id: 'vid', label: 'vidutinis', start: 23.5 },
  { id: 'velai', label: 'pelėda', start: 1.5 },
]
const hm = (h: number) => { const x = ((h % 24) + 24) % 24; const hh = Math.floor(x), mm = Math.round((x - hh) * 60); return `${hh}:${mm.toString().padStart(2, '0')}` }

export default function LightPhase() {
  const [type, setType] = useState(TYPES[1])
  const [light, setLight] = useState(0)     // -1 vakarinė … +1 rytinė
  const shift = -light * 1.5                // rytinė ankstina, vakarinė vėlina
  const start = type.start + shift, end = start + 8
  const W = 360, cx = 180, cy = 120, R = 85
  const ang = (h: number) => ((h / 24) * Math.PI * 2) - Math.PI / 2
  const arc = (a: number, b: number, r: number) => {
    const large = b - a > 12 ? 1 : 0
    return `M${cx + r * Math.cos(ang(a))},${cy + r * Math.sin(ang(a))} A${r},${r} 0 ${large} 1 ${cx + r * Math.cos(ang(b))},${cy + r * Math.sin(ang(b))}`
  }
  return (
    <Panel caption="Ratas – para. Pilka – tamsa, rudas lankas – miego langas. Rytinė šviesa jį ankstina, vakarinė vėlina.">
      <div className="flex flex-wrap gap-2 px-4 pt-3">
        {TYPES.map(t => <Button key={t.id} small primary={type.id === t.id} onClick={() => setType(t)}>{t.label}</Button>)}
      </div>
      <svg viewBox={`0 0 ${W} 240`} className="w-full" style={{ touchAction: 'pan-y' }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--line)" strokeWidth={14} />
        <path d={arc(21, 24, R)} fill="none" stroke="var(--muted)" strokeWidth={14} opacity={0.4} />
        <path d={arc(0, 7, R)} fill="none" stroke="var(--muted)" strokeWidth={14} opacity={0.4} />
        <path d={arc(start, end, R)} fill="none" stroke="var(--accent)" strokeWidth={14} strokeLinecap="round" />
        {[0, 6, 12, 18].map(h => (
          <text key={h} x={cx + (R + 24) * Math.cos(ang(h))} y={cy + (R + 24) * Math.sin(ang(h)) + 4} fontSize={11} textAnchor="middle" fill="var(--muted)">{h}:00</text>
        ))}
        {/* šviesos žymė */}
        {Math.abs(light) > 0.05 && (
          <g>
            <circle cx={cx + (R - 26) * Math.cos(ang(light > 0 ? 7.5 : 21.5))} cy={cy + (R - 26) * Math.sin(ang(light > 0 ? 7.5 : 21.5))} r={9 + Math.abs(light) * 6} fill="var(--warn)" opacity={0.8} />
            <text x={cx} y={cy + 14} fontSize={11} textAnchor="middle" fill="var(--muted)">{light > 0 ? 'rytinė šviesa' : 'vakarinė šviesa'}</text>
          </g>
        )}
        <text x={cx} y={cy - 8} fontSize={13} textAnchor="middle" fill="var(--fg)">miegas {hm(start)}–{hm(end)}</text>
      </svg>
      <div className="px-4">
        <Slider label="Šviesa: vakare ← → ryte" value={light} min={-1} max={1} step={0.05} onChange={setLight} format={v => v > 0.05 ? 'ryte' : v < -0.05 ? 'vakare' : 'nėra'} />
      </div>
      <Readout>{Math.abs(light) < 0.05 ? `${type.label[0].toUpperCase() + type.label.slice(1)}: natūralus langas ${hm(type.start)}–${hm(type.start + 8)}.` : light > 0 ? `Rytinė šviesa paankstina laikrodį apie ${Math.abs(shift).toFixed(1).replace('.', ',')} val.` : `Vakarinė šviesa (ir ekranai) vėlina laikrodį apie ${Math.abs(shift).toFixed(1).replace('.', ',')} val.`}</Readout>
    </Panel>
  )
}
