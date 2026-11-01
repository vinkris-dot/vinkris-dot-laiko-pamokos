import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

type P = [number, number, number] // x, t (aukštyn), z

const T0 = -1.5, T1 = 1.5
function worldLines(): P[][] {
  const lines: P[][] = []
  const n = 80
  const rest: P[] = [], orbit: P[] = [], walk: P[] = []
  for (let i = 0; i <= n; i++) {
    const t = T0 + (T1 - T0) * (i / n)
    rest.push([-0.6, t, -0.5])
    orbit.push([0.45 * Math.cos(t * 2.4) + 0.2, t, 0.45 * Math.sin(t * 2.4) + 0.3])
    walk.push([0.5 * Math.sin(t * 1.6) - 0.1, t, -0.55 + 0.2 * Math.cos(t)])
  }
  lines.push(rest, orbit, walk)
  return lines
}
const LINES = worldLines()

export default function BlockUniverse() {
  const rot = useRef({ yaw: 0.6, pitch: 0.45 })
  const drag = useRef<{ x: number; y: number } | null>(null)
  const [now, setNow] = useState(0)
  const [tilt, setTilt] = useState(0)
  const nowRef = useRef(now); nowRef.current = now
  const tiltRef = useRef(tilt); tiltRef.current = tilt

  const H = 320
  const ref = useCanvas((ctx, w, h) => {
    const { yaw, pitch } = rot.current
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
    const scale = Math.min(w, h) * 0.27
    const proj = ([x, t, z]: P) => {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy
      const y1 = t * cp - z1 * sp
      const depth = t * sp + z1 * cp
      return { X: w / 2 + x1 * scale, Y: h / 2 - y1 * scale, d: depth }
    }
    const fg = cssVar('--fg'), line = cssVar('--line'), accent = cssVar('--accent'), muted = cssVar('--muted')

    // blokas
    const bx = 1, bz = 1
    const corners: P[] = [[-bx, T0, -bz], [bx, T0, -bz], [bx, T0, bz], [-bx, T0, bz], [-bx, T1, -bz], [bx, T1, -bz], [bx, T1, bz], [-bx, T1, bz]]
    const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]
    ctx.strokeStyle = line; ctx.lineWidth = 1.5
    for (const [a, b] of edges) {
      const A = proj(corners[a]), B = proj(corners[b])
      ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke()
    }
    // užrašai
    ctx.fillStyle = muted; ctx.font = '11px system-ui'
    const top = proj([-bx, T1, -bz]), bot = proj([-bx, T0, -bz])
    ctx.fillText('ateitis', top.X - 40, top.Y)
    ctx.fillText('praeitis', bot.X - 44, bot.Y + 6)

    // pjūvis: t = t0 + tilt·x
    const t0 = T0 + (T1 - T0) * nowRef.current, k = tiltRef.current
    const plane: P[] = [[-bx, t0 - k * bx, -bz], [bx, t0 + k * bx, -bz], [bx, t0 + k * bx, bz], [-bx, t0 - k * bx, bz]]
    const pp = plane.map(proj)
    ctx.fillStyle = accent; ctx.globalAlpha = 0.18
    ctx.beginPath(); ctx.moveTo(pp[0].X, pp[0].Y); pp.slice(1).forEach(p => ctx.lineTo(p.X, p.Y)); ctx.closePath(); ctx.fill()
    ctx.globalAlpha = 1; ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke()

    // pasaulio linijos
    for (const L of LINES) {
      ctx.lineWidth = 2.5
      for (let i = 1; i < L.length; i++) {
        const a = L[i - 1], b = L[i]
        const fa = a[1] - (t0 + k * a[0]), fb = b[1] - (t0 + k * b[0])
        const below = (fa + fb) / 2 < 0
        ctx.strokeStyle = below ? fg : muted
        ctx.globalAlpha = below ? 0.9 : 0.35
        const A = proj(a), B = proj(b)
        ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke()
        if (fa <= 0 && fb > 0 || fa > 0 && fb <= 0) {
          const s = fa / (fa - fb)
          const p = proj([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s])
          ctx.globalAlpha = 1; ctx.fillStyle = accent
          ctx.beginPath(); ctx.arc(p.X, p.Y, 6, 0, Math.PI * 2); ctx.fill()
          ctx.strokeStyle = fg; ctx.lineWidth = 1; ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }
    ctx.fillStyle = muted; ctx.font = '11px system-ui'
    ctx.fillText('„dabar“ – pjūvis', 10, h - 10)
  }, H)

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture(e.pointerId) }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    rot.current.yaw += (e.clientX - drag.current.x) * 0.01
    rot.current.pitch = Math.max(-1.2, Math.min(1.2, rot.current.pitch + (e.clientY - drag.current.y) * 0.01))
    drag.current = { x: e.clientX, y: e.clientY }
  }
  const onUp = () => { drag.current = null }

  return (
    <Panel caption="Sukinėk bloką pirštu. Trys gijos – trys daiktai: vienas stovi, vienas sukasi, vienas vaikšto. Taškai ant pjūvio – tai, ką pamatytum „dabar“.">
      <canvas ref={ref} style={{ width: '100%', height: H }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
      <div className="space-y-1 px-4">
        <Slider label="Pjūvis „dabar“" value={now} min={0} max={1} onChange={setNow} format={x => `${fmt(x * 100, 0)} %`} />
        <Slider label="Pjūvio pasvirimas (kito stebėtojo greitis)" value={tilt} min={-0.7} max={0.7} onChange={setTilt} format={x => fmt(x)} />
      </div>
      <Readout>{Math.abs(tilt) < 0.03 ? 'Pjūvis lygus – tavo „dabar“.' : 'Pasviręs pjūvis – kitaip judančio stebėtojo „dabar“. Tie patys daiktai, kitos akimirkos.'}</Readout>
    </Panel>
  )
}
