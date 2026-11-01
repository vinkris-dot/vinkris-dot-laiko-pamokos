import { useEffect, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

/**
 * Erdvėlaikio schema. Vienetai: c = 1. Įvykiai A (x=-1) ir B (x=+1) ramybės sistemoje vyksta vienu metu (t=0).
 * Stebėtojo, judančio greičiu v, „dabar“ linija: t = v·x. Jo laikas įvykiui: t' ∝ t − v·x.
 */
export default function Simultaneity() {
  const [v, setV] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const loop = (now: number) => { setPhase(((now - t0) / 1000 / 4) % 1); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const W = 360, H = 300, cx = 180, cy = 180, k = 95
  const sx = (x: number) => cx + x * k
  const sy = (t: number) => cy - t * k
  const A = { x: -1, t: 0 }, B = { x: 1, t: 0 }
  // stebėtojo laikas įvykiams (be gama – ji keičia tik mastelį, ne eilę)
  const tA = A.t - v * A.x, tB = B.t - v * B.x
  // slenkanti „dabar“ linija: t = v·x + c
  const c = -1.4 + phase * 2.8
  const passedA = c >= tA, passedB = c >= tB

  const nowLine = (cc: number) => {
    const x0 = -1.8, x1 = 1.8
    return { x1: sx(x0), y1: sy(v * x0 + cc), x2: sx(x1), y2: sy(v * x1 + cc) }
  }
  const order = Math.abs(v) < 0.02 ? 'Stebėtojui abu žaibai trenkia vienu metu.'
    : v > 0 ? `Stebėtojui B trenkia anksčiau už A.` : `Stebėtojui A trenkia anksčiau už B.`

  const Bolt = ({ x, y, lit }: { x: number; y: number; lit: boolean }) => (
    <path d={`M${x},${y - 18} l-6,11 h6 l-5,13 l12,-16 h-6 l5,-8 z`} fill={lit ? 'var(--accent)' : 'var(--line)'} stroke="var(--fg)" strokeWidth={0.8} />
  )

  return (
    <Panel caption="Horizontaliai – erdvė, vertikaliai – laikas. Pilka punktyrinė linija – stebėtojo „dabar“. Ji slenka aukštyn ir rodo, kurį žaibą stebėtojas pasiekia pirmiau.">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ touchAction: 'pan-y' }}>
        {/* tinklelis ir ašys */}
        <line x1={sx(-1.8)} y1={sy(0)} x2={sx(1.8)} y2={sy(0)} stroke="var(--line)" />
        <line x1={sx(0)} y1={sy(-1.4)} x2={sx(0)} y2={sy(1.6)} stroke="var(--line)" />
        <text x={sx(1.8) - 4} y={sy(0) - 6} fontSize={11} fill="var(--muted)" textAnchor="end">erdvė →</text>
        <text x={sx(0) - 8} y={sy(1.6) + 12} fontSize={11} fill="var(--muted)" textAnchor="end">laikas ↑</text>
        {/* šviesos kūgis */}
        <line x1={sx(-1.5)} y1={sy(-1.5)} x2={sx(1.5)} y2={sy(1.5)} stroke="var(--line)" strokeDasharray="2 4" />
        <line x1={sx(1.5)} y1={sy(-1.5)} x2={sx(-1.5)} y2={sy(1.5)} stroke="var(--line)" strokeDasharray="2 4" />
        {/* stebėtojo pasaulio linija: x = v·t */}
        <line x1={sx(-1.4 * v)} y1={sy(-1.4)} x2={sx(1.6 * v)} y2={sy(1.6)} stroke="var(--fg)" strokeWidth={2} />
        <circle cx={sx(0)} cy={sy(0)} r={5} fill="var(--fg)" />
        <text x={sx(1.6 * v) + 8} y={sy(1.6) + 26} fontSize={11} fill="var(--fg)">stebėtojas</text>
        {/* stebėtojo „dabar“ per pradžią */}
        <line {...nowLine(0)} stroke="var(--accent)" strokeWidth={1.5} opacity={0.5} />
        {/* slenkantis „dabar“ */}
        <line {...nowLine(c)} stroke="var(--muted)" strokeWidth={2} strokeDasharray="6 5" />
        {/* įvykiai */}
        <Bolt x={sx(A.x)} y={sy(A.t)} lit={passedA} />
        <Bolt x={sx(B.x)} y={sy(B.t)} lit={passedB} />
        <text x={sx(A.x)} y={sy(A.t) + 28} fontSize={13} fontWeight={600} textAnchor="middle" fill="var(--fg)">A</text>
        <text x={sx(B.x)} y={sy(B.t) + 28} fontSize={13} fontWeight={600} textAnchor="middle" fill="var(--fg)">B</text>
      </svg>
      <div className="px-4">
        <Slider label="Stebėtojo greitis" value={v} min={-0.9} max={0.9} step={0.01} onChange={setV}
          format={x => `${fmt(x)} šviesos greičio`} />
      </div>
      <Readout>{order}</Readout>
    </Panel>
  )
}
