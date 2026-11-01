import { useRef, useState } from 'react'
import { Panel, Readout, Toggle } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/** Maža „visata“: uždara forma, kurios kraštas virpa. Be išorinio laikrodžio – sustingsta. */
export default function WheelerDeWitt() {
  const [clock, setClock] = useState(true)
  const clockRef = useRef(clock); clockRef.current = clock
  const frozen = useRef(0)      // laikas, kuriuo sustingo
  const localT = useRef(0)

  const H = 280
  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted')
    if (clockRef.current) localT.current += dt
    else frozen.current = localT.current
    const tt = localT.current
    const cx = w * 0.42, cy = h / 2, R = Math.min(w, h) * 0.26

    const shape = (phase: number) => {
      ctx.beginPath()
      for (let i = 0; i <= 120; i++) {
        const th = (i / 120) * Math.PI * 2
        const r = R * (1 + 0.14 * Math.cos(3 * th - phase * 1.3) + 0.09 * Math.cos(5 * th + phase * 2.1) + 0.06 * Math.cos(2 * th - phase * 0.7))
        const X = cx + r * Math.cos(th), Y = cy + r * Math.sin(th)
        i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y)
      }
      ctx.closePath()
    }

    if (!clockRef.current) {
      // visos „leidžiamos“ būsenos vienu metu – blankūs kontūrai
      for (let k = 0; k < 7; k++) {
        shape(frozen.current + k * 0.9)
        ctx.strokeStyle = muted; ctx.globalAlpha = 0.18; ctx.lineWidth = 1; ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    shape(tt)
    ctx.fillStyle = accent; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke()
    ctx.fillStyle = muted; ctx.font = '11px system-ui'; ctx.textAlign = 'center'
    ctx.fillText('visatos būsena', cx, cy + R + 36)

    // laikrodis dešinėje
    const kx = w * 0.82, ky = h / 2, kr = 34
    ctx.textAlign = 'center'
    if (clockRef.current) {
      ctx.strokeStyle = fg; ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(kx, ky, kr, 0, Math.PI * 2); ctx.stroke()
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        ctx.beginPath(); ctx.moveTo(kx + Math.cos(a) * (kr - 5), ky + Math.sin(a) * (kr - 5)); ctx.lineTo(kx + Math.cos(a) * kr, ky + Math.sin(a) * kr); ctx.stroke()
      }
      const a = tt * 0.9 - Math.PI / 2
      ctx.strokeStyle = accent; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + Math.cos(a) * (kr - 8), ky + Math.sin(a) * (kr - 8)); ctx.stroke()
      ctx.fillStyle = muted; ctx.fillText('išorinis laikrodis', kx, ky + kr + 18)
    } else {
      ctx.strokeStyle = line; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.arc(kx, ky, kr, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([])
      ctx.fillStyle = muted; ctx.font = '22px system-ui'; ctx.fillText('?', kx, ky + 8)
      ctx.font = '11px system-ui'; ctx.fillText('laikrodžio nėra', kx, ky + kr + 18)
    }
    ctx.textAlign = 'left'
  }, H)

  return (
    <Panel caption="Su išoriniu laikrodžiu forma banguoja. Wheelerio ir DeWitto lygtyje laikrodžio nėra: lieka tik galimų būsenų rinkinys, be „prieš“ ir „po“.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <Toggle label={clock ? 'išorinis laikrodis įjungtas' : 'Wheelerio ir DeWitto režimas'} on={clock} onChange={setClock} />
      </div>
      <Readout>{clock ? 'Laikrodis stovi už visatos ribų – bet tikroje visatoje „už ribų“ nieko nėra.' : 'Visata „sustingo“. Blankūs kontūrai – kitos leidžiamos būsenos, bet jų nesieja jokia eilė.'}</Readout>
    </Panel>
  )
}
