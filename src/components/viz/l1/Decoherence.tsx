import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** Interferencijos juostos blunka, kai daugiau aplinkos dalelių susiduria su sistema. */
export default function Decoherence() {
  const [n, setN] = useState(0)
  const nRef = useRef(n); nRef.current = n
  const env = useRef<{ x: number; y: number; vx: number; vy: number }[]>([])
  const H = 220
  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const fg = cssVar('--fg'), accent = cssVar('--accent'), muted = cssVar('--muted')
    const N = nRef.current
    while (env.current.length < N) env.current.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 80, vy: (Math.random() - 0.5) * 80 })
    env.current.length = N
    for (const p of env.current) { p.x += p.vx * dt; p.y += p.vy * dt; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1 }
    const vis = Math.exp(-N / 12)   // juostų kontrastas
    // juostos
    const y0 = 40, y1 = h - 40, cx = w / 2
    for (let x = 0; x < w; x++) {
      const u = (x - cx) / (w / 2)
      const envl = Math.exp(-u * u * 3)
      const I = envl * (1 - vis + vis * Math.cos(u * 22) ** 2)
      ctx.fillStyle = accent; ctx.globalAlpha = I * 0.9; ctx.fillRect(x, y0, 1, y1 - y0)
    }
    ctx.globalAlpha = 1
    ctx.fillStyle = fg
    for (const p of env.current) { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill() }
    ctx.font = '11px system-ui'; ctx.fillStyle = muted
    ctx.fillText('sistemos interferencija', 8, 26); ctx.fillText(`juostų ryškumas: ${Math.round(vis * 100)} %`, 8, h - 14)
  }, H)
  return (
    <Panel caption="Rudos juostos – sistemos „kvantiškumas“ (interferencija). Juodi taškai – aplinkos dalelės, kurios su ja susiduria.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Aplinkos dalelių" value={n} min={0} max={60} step={1} onChange={setN} format={v => fmt(v, 0)} />
      </div>
      <Readout>{n === 0 ? 'Izoliuota sistema: juostos ryškios.' : n < 15 ? 'Kelios dalelės – juostos jau blunka.' : n < 40 ? 'Aplinka „sužinojo“ būseną: interferencija beveik dingo.' : 'Tai jau klasikinis daiktas: jokių juostų. Be jokio stebėtojo.'}</Readout>
    </Panel>
  )
}
