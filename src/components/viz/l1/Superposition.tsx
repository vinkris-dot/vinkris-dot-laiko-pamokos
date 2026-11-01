import { useState } from 'react'
import { Button, Panel, Readout, Slider } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

export default function Superposition() {
  const [angle, setAngle] = useState(30)   // 0 = grynas „0“, 90 = grynas „1“
  const [res, setRes] = useState<number[]>([])
  const p0 = Math.cos((angle * Math.PI) / 180) ** 2
  const measure = (n: number) => setRes(r => [...r, ...Array.from({ length: n }, () => (Math.random() < p0 ? 0 : 1))].slice(-500))
  const n0 = res.filter(x => x === 0).length
  const rad = ((angle - 90) * Math.PI) / 180
  return (
    <Panel caption="Rodyklė – būsena. Viršuje – „0“, dešinėje – „1“. Tarp jų – superpozicija: matavimas duoda 0 arba 1 su tikimybėmis pagal rodyklės kryptį.">
      <div className="flex items-center justify-around px-2 pt-2">
        <svg width={160} height={160} viewBox="-80 -80 160 160">
          <circle r={64} fill="none" stroke="var(--line)" strokeWidth={2} />
          <text y={-68} textAnchor="middle" fontSize={12} fill="var(--muted)">0</text>
          <text x={72} y={4} textAnchor="middle" fontSize={12} fill="var(--muted)">1</text>
          <line x1={0} y1={0} x2={60 * Math.cos(rad)} y2={60 * Math.sin(rad)} stroke="var(--accent)" strokeWidth={5} strokeLinecap="round" />
          <circle r={5} fill="var(--fg)" />
        </svg>
        <div className="w-28 text-sm">
          <div className="text-xs text-muted">rezultatai</div>
          <div className="mt-1 flex h-24 items-end gap-2">
            <div className="flex flex-1 flex-col items-center"><div className="w-full rounded-t bg-fg/70" style={{ height: `${res.length ? (n0 / res.length) * 90 : 0}px` }} /><span>0</span></div>
            <div className="flex flex-1 flex-col items-center"><div className="w-full rounded-t bg-accent" style={{ height: `${res.length ? ((res.length - n0) / res.length) * 90 : 0}px` }} /><span>1</span></div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <Slider label="Būsenos kryptis" value={angle} min={0} max={90} step={1} onChange={v => { setAngle(v); setRes([]) }} format={v => `${fmt(v, 0)}°`} />
      </div>
      <div className="flex gap-2 px-4 pb-3">
        <Button primary small onClick={() => measure(1)}>išmatuoti</Button>
        <Button small onClick={() => measure(100)}>išmatuoti 100 kartų</Button>
      </div>
      <Readout>{res.length ? `Iš ${res.length} matavimų: „0“ – ${fmt((n0 / res.length) * 100, 0)} %, laukta ${fmt(p0 * 100, 0)} %. Paskutinis: ${res[res.length - 1]}.` : `Tikimybė gauti „0“: ${fmt(p0 * 100, 0)} %. Matuok.`}</Readout>
    </Panel>
  )
}
