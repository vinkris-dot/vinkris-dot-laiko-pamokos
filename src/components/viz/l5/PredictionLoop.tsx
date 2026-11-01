import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** Pasaulis juda; jutimas – triukšmingas; modelis taisomas tik pagal paklaidą, pasvertą pasitikėjimu. */
export default function PredictionLoop() {
  const [trust, setTrust] = useState(0.5)
  const trustRef = useRef(trust); trustRef.current = trust
  const world = useRef<number[]>([]), sensed = useRef<number[]>([]), model = useRef<number[]>([])
  const m = useRef(0), v = useRef(0)
  const H = 240

  const ref = useCanvas((ctx, w, h, t) => {
    const W = Math.sin(t * 0.9) * 0.5 + Math.sin(t * 2.3) * 0.25 + Math.sin(t * 0.37) * 0.3
    const S = W + (Math.random() - 0.5) * 0.35
    // modelis: tęsia savo judesį (prognozė), paskui taiso pagal paklaidą
    const pred = m.current + v.current
    const err = S - pred
    const gain = 1 - trustRef.current
    const next = pred + gain * err
    v.current = (next - m.current) * 0.9
    m.current = next
    world.current.push(W); sensed.current.push(S); model.current.push(next)
    const N = Math.floor(w)
    for (const a of [world, sensed, model]) while (a.current.length > N) a.current.shift()

    const fg = cssVar('--fg'), accent = cssVar('--accent'), muted = cssVar('--muted'), line = cssVar('--line')
    const top = 20, bottom = h - 46, mid = (top + bottom) / 2, amp = (bottom - top) / 2.4
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(w, mid); ctx.stroke()
    // jutimai – taškai
    ctx.fillStyle = muted
    sensed.current.forEach((s, i) => { if (i % 3 === 0) { ctx.beginPath(); ctx.arc(i, mid - s * amp, 1.2, 0, Math.PI * 2); ctx.fill() } })
    const curve = (arr: number[], color: string, width: number) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath()
      arr.forEach((y, i) => i === 0 ? ctx.moveTo(i, mid - y * amp) : ctx.lineTo(i, mid - y * amp)); ctx.stroke()
    }
    curve(world.current, fg, 1.5)
    curve(model.current, accent, 2.5)
    // paklaida dabar
    const i = world.current.length - 1
    ctx.strokeStyle = accent; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(i, mid - W * amp); ctx.lineTo(i, mid - next * amp); ctx.stroke(); ctx.setLineDash([])
    ctx.font = '11px system-ui'; ctx.fillStyle = fg; ctx.fillText('pasaulis', 6, top + 4)
    ctx.fillStyle = accent; ctx.fillText('smegenų modelis', 6, top + 18)
    ctx.fillStyle = muted; ctx.fillText('· · · jutimai (su triukšmu)', 6, top + 32)
    // kilpa
    const steps = ['prognozė', 'jutimas', 'paklaida', 'pataisa']
    const phase = Math.floor((t * 2) % 4)
    steps.forEach((s, k) => {
      const x = 10 + k * ((w - 20) / 4)
      ctx.fillStyle = k === phase ? accent : muted
      ctx.fillText(s + (k < 3 ? '  →' : ''), x, h - 10)
    })
  }, H)

  return (
    <Panel caption="Juoda – tikras pasaulis, taškai – ką praneša jutimai, rudas – ką „mato“ smegenys. Apačioje sukasi kilpa: prognozė, jutimas, paklaida, pataisa.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Pasitikėjimas prognoze" value={trust} min={0} max={0.98} onChange={setTrust} format={x => `${fmt(x * 100, 0)} %`} />
      </div>
      <Readout>
        {trust < 0.2 ? 'Smegenys priima beveik visus jutimus – ir visą triukšmą kartu.'
          : trust > 0.8 ? `Smegenys priima tik ${fmt((1 - trust) * 100, 0)} % jutimų: prognozė sklandi, bet atsilieka nuo pasaulio.`
          : `Smegenys priima ${fmt((1 - trust) * 100, 0)} % jutimų – triukšmas nuslopintas, pasaulis dar sekamas.`}
      </Readout>
    </Panel>
  )
}
