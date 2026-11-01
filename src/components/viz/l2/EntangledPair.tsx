import { useState } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'

export default function EntangledPair() {
  const [rows, setRows] = useState<[number, number][]>([])
  const measure = (n: number) => setRows(r => [...r, ...Array.from({ length: n }, () => { const a = Math.random() < 0.5 ? 0 : 1; return [a, 1 - a] as [number, number] })].slice(-12))
  const last = rows[rows.length - 1]
  return (
    <Panel caption="Pora išskrenda į priešingas puses. Kiekvienas matavimas – atsitiktinis, bet antroji dalelė visada duoda priešingą rezultatą.">
      <svg viewBox="0 0 360 120" className="w-full" style={{ touchAction: 'pan-y' }}>
        <circle cx={180} cy={60} r={8} fill="var(--muted)" />
        <text x={180} y={90} fontSize={10} textAnchor="middle" fill="var(--muted)">šaltinis</text>
        <line x1={170} y1={60} x2={70} y2={60} stroke="var(--line)" strokeDasharray="4 4" />
        <line x1={190} y1={60} x2={290} y2={60} stroke="var(--line)" strokeDasharray="4 4" />
        <circle cx={50} cy={60} r={20} fill={last ? (last[0] ? 'var(--accent)' : 'var(--fg)') : 'var(--panel-2)'} stroke="var(--line)" strokeWidth={2} />
        <circle cx={310} cy={60} r={20} fill={last ? (last[1] ? 'var(--accent)' : 'var(--fg)') : 'var(--panel-2)'} stroke="var(--line)" strokeWidth={2} />
        <text x={50} y={65} fontSize={14} textAnchor="middle" fill="var(--panel)">{last ? last[0] : '?'}</text>
        <text x={310} y={65} fontSize={14} textAnchor="middle" fill="var(--panel)">{last ? last[1] : '?'}</text>
        <text x={50} y={100} fontSize={11} textAnchor="middle" fill="var(--muted)">kairė</text>
        <text x={310} y={100} fontSize={11} textAnchor="middle" fill="var(--muted)">dešinė</text>
      </svg>
      <div className="px-4 pb-2 font-mono text-sm">
        <div className="flex gap-1 text-xs text-muted"><span className="w-12">kairė</span>{rows.map((r, i) => <span key={i} className="w-4 text-center">{r[0]}</span>)}</div>
        <div className="flex gap-1 text-xs text-muted"><span className="w-12">dešinė</span>{rows.map((r, i) => <span key={i} className="w-4 text-center text-accent">{r[1]}</span>)}</div>
      </div>
      <div className="flex gap-2 px-4 pb-3">
        <Button primary small onClick={() => measure(1)}>išmatuoti porą</Button>
        <Button small onClick={() => measure(12)}>12 porų</Button>
      </div>
      <Readout>{rows.length ? 'Kiekviena eilutė atskirai – monetos metimas. Kartu – visada priešingi.' : 'Matuok porą.'}</Readout>
    </Panel>
  )
}
