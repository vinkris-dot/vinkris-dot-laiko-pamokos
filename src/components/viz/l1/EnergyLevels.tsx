import { useEffect, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

const LEVELS = [0, 3, 5, 6]     // energijos laipteliai (sąlyginiai vienetai)
export default function EnergyLevels() {
  const [photon, setPhoton] = useState(1)
  const [level, setLevel] = useState(0)
  const [flash, setFlash] = useState(false)
  const gaps = LEVELS.slice(level + 1).map(e => e - LEVELS[level])
  const hit = gaps.findIndex(g => Math.abs(g - photon) < 0.15)

  const fire = () => {
    setFlash(true)
    if (hit >= 0) setLevel(level + 1 + hit)
  }
  useEffect(() => { if (flash) { const id = setTimeout(() => setFlash(false), 350); return () => clearTimeout(id) } }, [flash])
  useEffect(() => { if (level > 0) { const id = setTimeout(() => setLevel(0), 1800); return () => clearTimeout(id) } }, [level])

  const W = 360, H = 200, x0 = 150, x1 = 300
  const sy = (e: number) => 170 - e * 24
  return (
    <Panel caption="Horizontalios linijos – leidžiami energijos laipteliai. Rutuliukas – elektronas. Fotonas pakelia jį tik tada, kai jo energija lygiai sutampa su tarpu.">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ touchAction: 'pan-y' }}>
        {LEVELS.map((e, i) => (
          <g key={i}>
            <line x1={x0} y1={sy(e)} x2={x1} y2={sy(e)} stroke="var(--fg)" strokeWidth={2} />
            <text x={x1 + 8} y={sy(e) + 4} fontSize={11} fill="var(--muted)">{i === 0 ? 'pagrindas' : `${e}`}</text>
          </g>
        ))}
        {/* fotonas */}
        <g opacity={flash ? 1 : 0.5}>
          <path d={`M20,${sy(LEVELS[level]) - 6} ${Array.from({ length: 12 }, (_, i) => `l8,${i % 2 ? 8 : -8}`).join(' ')}`} fill="none" stroke="var(--warn)" strokeWidth={2.5} />
          <text x={20} y={sy(LEVELS[level]) + 24} fontSize={11} fill="var(--muted)">fotonas · {fmt(photon, 1)}</text>
        </g>
        <circle cx={(x0 + x1) / 2} cy={sy(LEVELS[level])} r={9} fill="var(--accent)" style={{ transition: 'cy .3s' }} />
      </svg>
      <div className="px-4">
        <Slider label="Fotono energija" value={photon} min={0.5} max={6.5} step={0.1} onChange={setPhoton} format={v => fmt(v, 1)} />
      </div>
      <div className="px-4 pb-3"><button type="button" onClick={fire} className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">pasiųsti fotoną</button></div>
      <Readout>{level > 0 ? 'Pataikei į laiptelį – elektronas pašoko (ir tuoj nukris atgal).' : hit >= 0 ? 'Energija sutampa su tarpu – siųsk.' : `Tarpai nuo pagrindo: ${gaps.map(g => fmt(g, 0)).join(', ')}. Tokia energija nepriimama.`}</Readout>
    </Panel>
  )
}
