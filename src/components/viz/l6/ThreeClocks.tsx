import { useRef, useState } from 'react'
import { Panel, Readout, Slider, Toggle } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

const hm = (h: number) => { const x = ((h % 24) + 24) % 24; const hh = Math.floor(x), mm = Math.round((x - hh) * 60); return `${hh}:${mm.toString().padStart(2, '0')}` }
const melatonin = (h: number) => Math.max(0, Math.cos(((h - 3) / 24) * Math.PI * 2))        // pikas ~3:00
const cortisol = (h: number) => Math.max(0, Math.cos(((h - 8) / 24) * Math.PI * 2)) ** 2     // pikas ~8:00

export default function ThreeClocks() {
  const [hour, setHour] = useState(8)
  const [run, setRun] = useState(false)
  const hRef = useRef(hour); hRef.current = hour
  const runRef = useRef(run); runRef.current = run
  const H = 320

  const ref = useCanvas((ctx, w, h, t, dt) => {
    if (runRef.current) { const nh = (hRef.current + dt * 1.2) % 24; hRef.current = nh; setHour(nh) }
    const hh = hRef.current
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted'), warn = cssVar('--warn')
    const cx = w / 2, cy = h / 2 - 2
    const ang = (x: number) => (x / 24) * Math.PI * 2 - Math.PI / 2

    // IŠORINIS: fizikinis laikas – tik tėkmė, be „dabar“
    const R1 = Math.min(w, h) * 0.40
    ctx.strokeStyle = line; ctx.lineWidth = 8
    ctx.setLineDash([6, 10]); ctx.lineDashOffset = -t * 30
    ctx.beginPath(); ctx.arc(cx, cy, R1, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([])
    ctx.font = '11px system-ui'; ctx.fillStyle = muted; ctx.textAlign = 'center'
    ctx.fillText('fizikinis laikas: kryptis be „dabar“', cx, cy - R1 - 10)

    // VIDURINIS: kūno laikrodis – para su šviesa ir hormonais
    const R2 = R1 - 30
    ctx.lineWidth = 16
    ctx.strokeStyle = cssVar('--panel-2'); ctx.beginPath(); ctx.arc(cx, cy, R2, ang(7), ang(21)); ctx.stroke()
    ctx.strokeStyle = muted; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(cx, cy, R2, ang(21), ang(7)); ctx.stroke(); ctx.globalAlpha = 1
    // hormonų lankai
    ctx.lineWidth = 5
    for (let k = 0; k < 48; k++) {
      const a0 = ang(k / 2), a1 = ang((k + 1) / 2)
      ctx.strokeStyle = warn; ctx.globalAlpha = cortisol(k / 2) * 0.9; ctx.beginPath(); ctx.arc(cx, cy, R2 + 11, a0, a1); ctx.stroke()
      ctx.strokeStyle = accent; ctx.globalAlpha = melatonin(k / 2) * 0.9; ctx.beginPath(); ctx.arc(cx, cy, R2 - 11, a0, a1); ctx.stroke()
    }
    ctx.globalAlpha = 1
    // dabartinė valanda
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(cx + R2 * Math.cos(ang(hh)), cy + R2 * Math.sin(ang(hh)), 7, 0, Math.PI * 2); ctx.fill()
    ;[0, 6, 12, 18].forEach(x => { ctx.fillStyle = muted; ctx.fillText(`${x}`, cx + (R2 - 30) * Math.cos(ang(x)), cy + (R2 - 30) * Math.sin(ang(x)) + 4) })

    // VIDINIS: smegenų „dabar“ – vėluojantis langas su prognoze priekyje
    const R3 = R2 - 60
    ctx.lineWidth = 12
    ctx.strokeStyle = line; ctx.beginPath(); ctx.arc(cx, cy, R3, 0, Math.PI * 2); ctx.stroke()
    const a = ang(hh)
    ctx.strokeStyle = fg; ctx.beginPath(); ctx.arc(cx, cy, R3, a - 0.5, a - 0.08); ctx.stroke()           // vėluojantis „dabar“
    ctx.strokeStyle = accent; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(cx, cy, R3, a - 0.06, a + 0.4); ctx.stroke(); ctx.setLineDash([])  // prognozė
    ctx.fillStyle = fg; ctx.font = '12px system-ui'; ctx.fillText('„dabar“', cx, cy - 4)
    ctx.font = '10px system-ui'; ctx.fillStyle = muted; ctx.fillText('vėluoja + prognozuoja', cx, cy + 12)

    // legenda
    ctx.textAlign = 'left'; ctx.font = '11px system-ui'
    ctx.fillStyle = warn; ctx.fillText('■ kortizolis', 8, h - 22)
    ctx.fillStyle = accent; ctx.fillText('■ melatoninas', 8, h - 8)
    ctx.fillStyle = fg; ctx.fillText('■ smegenų „dabar“', w - 120, h - 22)
    ctx.fillStyle = accent; ctx.fillText('┈ prognozė', w - 120, h - 8)
  }, H)

  const state = hour < 5 ? 'Gili naktis: melatoninas aukštai, smegenys prognozuoja mažai – miegas.'
    : hour < 10 ? 'Rytas: kortizolis kelia, kūnas „įjungia“ dieną, smegenų „dabar“ budrus.'
    : hour < 17 ? 'Diena: hormonai nurimę, smegenys dirba prognozėmis, laikas atrodo tekantis.'
    : hour < 22 ? 'Vakaras: melatoninas pradeda kilti, prognozės lėtėja.'
    : 'Vėlus vakaras: kūnas sako „miegok“, net jei fizikinis laikas tik teka toliau.'

  return (
    <Panel caption="Išorinis ratas – fizika: tik tėkmė. Vidurinis – kūnas: para, šviesa, hormonai. Vidinis – smegenys: vėluojantis „dabar“ su prognoze priekyje.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Paros laikas" value={hour} min={0} max={23.99} step={0.25} onChange={v => { setRun(false); setHour(v) }} format={hm} />
      </div>
      <div className="px-4 pb-3"><Toggle label="sukti parą" on={run} onChange={setRun} /></div>
      <Readout>{hm(hour)} · {state}</Readout>
    </Panel>
  )
}
