import { useEffect, useRef, useState } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'

const SOURCES = [
  { id: 'saule', label: 'Saulė', light: '8 min 20 s', ms: 500_000 },
  { id: 'menulis', label: 'Mėnulis', light: '1,3 s', ms: 1300 },
  { id: 'lempa', label: 'lempa kambaryje', light: '0,00001 ms', ms: 0.00001 },
]
// nervų sistemos grandys (apytiksliai, ms)
const STAGES = [
  { label: 'tinklainė', ms: 40 },
  { label: 'regos nervas', ms: 20 },
  { label: 'regos žievė', ms: 30 },
  { label: 'sąmoningas suvokimas', ms: 60 },
]
const TOTAL = STAGES.reduce((a, s) => a + s.ms, 0)
const SLOW = 12 // animacija 12× lėčiau nei tikrovėje

export default function DelayChain() {
  const [src, setSrc] = useState(SOURCES[2])
  const [t, setT] = useState<number | null>(null)   // praėję ms (tik nervų daliai)
  const raf = useRef(0)

  const play = () => {
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const loop = (now: number) => {
      const ms = (now - start) / SLOW
      setT(Math.min(ms, TOTAL))
      if (ms < TOTAL) raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  let acc = 0
  const stages = STAGES.map(s => { const from = acc; acc += s.ms; return { ...s, from, to: acc } })
  const W = 360, x0 = 20, x1 = 340
  const sx = (ms: number) => x0 + (ms / TOTAL) * (x1 - x0)

  return (
    <Panel caption="Šviesos kelias (kairėje) rodomas skaičiumi, o nervų sistemos kelias – juosta. Impulsas judina 12 kartų lėčiau nei tikrovėje.">
      <div className="flex flex-wrap gap-2 px-4 pt-3">
        {SOURCES.map(s => <Button key={s.id} small primary={src.id === s.id} onClick={() => { setSrc(s); setT(null) }}>{s.label}</Button>)}
      </div>
      <div className="mt-3 flex items-center gap-3 px-4 text-sm">
        <div className="rounded-xl bg-panel-2 px-3 py-2">
          <div className="text-xs text-muted">šviesa iki akies</div>
          <div className="font-medium">{src.light}</div>
        </div>
        <div className="text-muted">→</div>
        <div className="rounded-xl bg-panel-2 px-3 py-2">
          <div className="text-xs text-muted">nervų sistema</div>
          <div className="font-medium">~{TOTAL} ms</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} 150`} className="w-full" style={{ touchAction: 'pan-y' }}>
        {stages.map((s, i) => {
          const active = t !== null && t >= s.from
          const fill = t === null ? 0 : Math.max(0, Math.min(1, (t - s.from) / s.ms))
          return (
            <g key={s.label}>
              <rect x={sx(s.from)} y={40} width={sx(s.to) - sx(s.from) - 2} height={26} rx={6} fill="var(--panel-2)" stroke="var(--line)" />
              <rect x={sx(s.from)} y={40} width={(sx(s.to) - sx(s.from) - 2) * fill} height={26} rx={6} fill="var(--accent)" opacity={0.85} />
              <text x={(sx(s.from) + sx(s.to)) / 2} y={i % 2 ? 90 : 30} fontSize={10} textAnchor="middle" fill={active ? 'var(--fg)' : 'var(--muted)'}>{s.label}</text>
              <text x={(sx(s.from) + sx(s.to)) / 2} y={i % 2 ? 103 : 17} fontSize={10} textAnchor="middle" fill="var(--muted)">{s.ms} ms</text>
            </g>
          )
        })}
        <text x={x0} y={130} fontSize={11} fill="var(--muted)">akis</text>
        <text x={x1} y={130} fontSize={11} textAnchor="end" fill="var(--muted)">„dabar“</text>
        {t !== null && <circle cx={sx(t)} cy={53} r={7} fill="var(--fg)" />}
      </svg>
      <div className="px-4 pb-3"><Button primary small onClick={play}>paleisti impulsą</Button></div>
      <Readout>{t === null ? 'Paspausk „paleisti impulsą“.' : t < TOTAL ? `Praėjo ${Math.round(t)} ms – dar nieko nematai.` : `Po ~${TOTAL} ms pagaliau „matai“. Tavo dabar – praeityje.`}</Readout>
    </Panel>
  )
}
