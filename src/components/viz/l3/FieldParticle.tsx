import { useRef } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/** Styga iš daugelio svyruoklių. Palietus – lokalus sužadinimas („dalelė“), kuris keliauja. */
const N = 120
export default function FieldParticle() {
  const u = useRef(new Float32Array(N)), v = useRef(new Float32Array(N))
  const H = 220
  const excite = (xFrac: number) => { const c = Math.round(xFrac * (N - 1)); for (let i = 0; i < N; i++) v.current[i] += 220 * Math.exp(-((i - c) ** 2) / 8) }

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const U = u.current, V = v.current, k = 900, damp = 0.995
    const steps = 3
    for (let s = 0; s < steps; s++) {
      const d = dt / steps
      for (let i = 0; i < N; i++) {
        const l = U[i > 0 ? i - 1 : i], r = U[i < N - 1 ? i + 1 : i]
        V[i] = (V[i] + (l + r - 2 * U[i]) * k * d - U[i] * 2 * d) * damp
      }
      for (let i = 0; i < N; i++) U[i] += V[i] * d
    }
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted')
    const cy = h / 2
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke()
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.beginPath()
    for (let i = 0; i < N; i++) { const x = (i / (N - 1)) * w, y = cy - U[i]; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
    ctx.stroke()
    ctx.fillStyle = fg
    for (let i = 0; i < N; i += 4) { ctx.beginPath(); ctx.arc((i / (N - 1)) * w, cy - U[i], 2.5, 0, Math.PI * 2); ctx.fill() }
    ctx.font = '11px system-ui'; ctx.fillStyle = muted; ctx.fillText('laukas (visur, net kai ramus)', 8, h - 10)
  }, H)

  return (
    <Panel caption="Linija – laukas, kuris užpildo visą erdvę. Paliesk jį: sužadinimas, kuris atsiranda ir keliauja, yra tai, ką vadiname dalele.">
      <canvas ref={ref} style={{ width: '100%', height: H }} onPointerDown={e => { const b = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect(); excite((e.clientX - b.left) / b.width) }} />
      <div className="flex gap-2 px-4 pb-3">
        <Button primary small onClick={() => excite(0.3)}>sužadinti</Button>
        <Button small onClick={() => { u.current.fill(0); v.current.fill(0) }}>nuraminti</Button>
      </div>
      <Readout>Dalelė – ne daiktas lauke, o paties lauko gumbas.</Readout>
    </Panel>
  )
}
