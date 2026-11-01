import { useRef, useState } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/**
 * Dujų dalelės dėžėje. Fizika deterministinė, fiksuotas žingsnis.
 * „Atsukti laiką“ – apverčiami greičiai ir atkartojama istorija atgal (tiksliai).
 * „Atsukti su trikdžiu“ – apverčiami greičiai, bet viena dalelė truputį pastumiama ir toliau skaičiuojama fizika.
 */
const N = 70, R = 4
interface P { x: number; y: number; vx: number; vy: number }
type Mode = 'idle' | 'run' | 'rewind' | 'perturbed'

function makeParticles(w: number, h: number): P[] {
  const ps: P[] = []
  let seed = 7
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let i = 0; i < N; i++) {
    const a = rnd() * Math.PI * 2, s = 40 + rnd() * 60
    ps.push({ x: 10 + rnd() * (w * 0.28), y: 10 + rnd() * (h - 20), vx: Math.cos(a) * s, vy: Math.sin(a) * s })
  }
  return ps
}

function step(ps: P[], w: number, h: number, dt: number) {
  for (const p of ps) {
    p.x += p.vx * dt; p.y += p.vy * dt
    if (p.x < R) { p.x = 2 * R - p.x; p.vx = -p.vx }
    if (p.x > w - R) { p.x = 2 * (w - R) - p.x; p.vx = -p.vx }
    if (p.y < R) { p.y = 2 * R - p.y; p.vy = -p.vy }
    if (p.y > h - R) { p.y = 2 * (h - R) - p.y; p.vy = -p.vy }
  }
  for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
    const a = ps[i], b = ps[j]
    const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy
    if (d2 < 4 * R * R && d2 > 0) {
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d
      const dv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
      if (dv > 0) { a.vx -= dv * nx; a.vy -= dv * ny; b.vx += dv * nx; b.vy += dv * ny }
      const ov = (2 * R - d) / 2
      a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov
    }
  }
}

/** Stambaus mastelio entropija: dalelių pasiskirstymas 8×4 langeliuose. */
function entropy(ps: P[], w: number, h: number) {
  const cols = 8, rows = 4, cnt = new Array(cols * rows).fill(0)
  for (const p of ps) {
    const c = Math.min(cols - 1, Math.floor((p.x / w) * cols)), r = Math.min(rows - 1, Math.floor((p.y / h) * rows))
    cnt[c + r * cols]++
  }
  let s = 0
  for (const n of cnt) if (n > 0) { const q = n / ps.length; s -= q * Math.log(q) }
  return s / Math.log(cols * rows)
}

export default function EntropyBox() {
  const [mode, setMode] = useState<Mode>('idle')
  const modeRef = useRef(mode); modeRef.current = mode
  const ps = useRef<P[] | null>(null)
  const hist = useRef<Float32Array[]>([])
  const ent = useRef<number[]>([])
  const size = useRef({ w: 0, h: 0 })
  const BOX_H = 200, H = 270

  const snapshot = () => Float32Array.from(ps.current!.flatMap(p => [p.x, p.y, p.vx, p.vy]))
  const restore = (s: Float32Array) => ps.current!.forEach((p, i) => { p.x = s[i * 4]; p.y = s[i * 4 + 1]; p.vx = s[i * 4 + 2]; p.vy = s[i * 4 + 3] })

  const ref = useCanvas((ctx, w) => {
    if (!ps.current || size.current.w !== w) { size.current = { w, h: BOX_H }; ps.current = makeParticles(w, BOX_H); hist.current = []; ent.current = [] }
    const m = modeRef.current
    if (m === 'run' || m === 'perturbed') {
      for (let k = 0; k < 2; k++) step(ps.current, w, BOX_H, 1 / 120)
      if (m === 'run' && hist.current.length < 3600) hist.current.push(snapshot())
      ent.current.push(entropy(ps.current, w, BOX_H))
    } else if (m === 'rewind') {
      const s = hist.current.pop()
      if (s) { restore(s); ent.current.push(entropy(ps.current, w, BOX_H)) }
      else setMode('idle')
    }
    if (ent.current.length > 600) ent.current.shift()

    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted')
    ctx.strokeStyle = line; ctx.lineWidth = 2; ctx.strokeRect(1, 1, w - 2, BOX_H - 2)
    ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, BOX_H); ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = m === 'rewind' ? accent : fg
    for (const p of ps.current) { ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill() }
    // entropijos grafikas
    const gy = BOX_H + 12, gh = H - gy - 14
    ctx.fillStyle = muted; ctx.font = '11px system-ui'; ctx.textAlign = 'right'; ctx.fillText('entropija ↑', w - 6, gy + 12); ctx.textAlign = 'left'
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(0, gy + gh); ctx.lineTo(w, gy + gh); ctx.stroke()
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath()
    ent.current.forEach((e, i) => { const X = (i / 600) * w, Y = gy + gh - e * gh; i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y) })
    ctx.stroke()
  }, H)

  const reset = () => { ps.current = null; setMode('idle') }
  const rewind = () => { if (hist.current.length) setMode('rewind') }
  const perturb = () => {
    if (!ps.current) return
    for (const p of ps.current) { p.vx = -p.vx; p.vy = -p.vy }
    ps.current[0].x += 0.5   // pusė pikselio
    hist.current = []
    setMode('perturbed')
  }

  const text: Record<Mode, string> = {
    idle: 'Visos dalelės kairėje – reta, tvarkinga būsena. Paleisk.',
    run: 'Dalelės sklinda, entropija auga. Dabar atsuk laiką.',
    rewind: 'Greičiai apversti – dalelės tiksliai grįžta. Dėsniai leidžia.',
    perturbed: 'Viena dalelė pastumta per pusę pikselio – ir grįžimas subyra. Tvarka tokia trapi, kad į ją nepataikoma.',
  }

  return (
    <Panel caption="Kiekviena dalelė juda pagal grįžtamus dėsnius. Grafikas apačioje – kiek sumaišytos dalelės (stambaus mastelio entropija).">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <Button primary small onClick={() => setMode('run')} disabled={mode === 'run'}>paleisti</Button>
        <Button small onClick={rewind} disabled={mode !== 'run' && mode !== 'perturbed'}>atsukti laiką</Button>
        <Button small onClick={perturb} disabled={mode !== 'run'}>atsukti su trikdžiu</Button>
        <Button small onClick={reset}>iš naujo</Button>
      </div>
      <Readout>{text[mode]}</Readout>
    </Panel>
  )
}
