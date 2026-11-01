import { useRef, useState } from 'react'
import { Button, Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** Ta pati jėga stumia dvi daleles: fotoną (be sąveikos) ir dalelę su pasirenkama sąveika su Higso lauku. */
export default function Higgs() {
  const [g, setG] = useState(0.5)
  const gRef = useRef(g); gRef.current = g
  const sim = useRef({ x1: 0, v1: 0, x2: 0, v2: 0, run: false })
  const H = 200
  const ref = useCanvas((ctx, w, h, t, dt) => {
    const s = sim.current, F = 160
    if (s.run) {
      s.v1 += F * dt; s.x1 += s.v1 * dt                       // fotonas: masė ~0 (ribojam greitį)
      s.v1 = Math.min(s.v1, 260)
      const m = 0.3 + gRef.current * 6; s.v2 += (F / m) * dt; s.x2 += s.v2 * dt
      if (s.x1 > w - 30 && s.x2 > w - 30) s.run = false
    }
    const fg = cssVar('--fg'), accent = cssVar('--accent'), muted = cssVar('--muted'), line = cssVar('--line')
    // Higso laukas – fonas iš taškelių, tankesnis pagal sąveiką
    ctx.fillStyle = line
    const step = 14
    for (let y = 100; y < h - 20; y += step) for (let x = 10; x < w; x += step) { ctx.beginPath(); ctx.arc(x + Math.sin(t + y) * 2, y, 1 + gRef.current * 2.2, 0, Math.PI * 2); ctx.fill() }
    ctx.font = '11px system-ui'; ctx.fillStyle = muted
    ctx.fillText('fotonas (nesąveikauja)', 10, 40); ctx.fillText('dalelė, kabinasi į Higso lauką', 10, 92)
    ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(20 + Math.min(s.x1, w - 40), 60, 7, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(20 + Math.min(s.x2, w - 40), 130, 7 + gRef.current * 8, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = muted; ctx.fillText('Higso laukas', 10, h - 6)
  }, H)
  const start = () => { sim.current = { x1: 0, v1: 0, x2: 0, v2: 0, run: true } }
  return (
    <Panel caption="Abi daleles stumia ta pati jėga. Rudas fotonas su Higso lauku nesąveikauja ir įsibėgėja iš karto. Juoda dalelė kabinasi į lauką – kuo stipriau, tuo sunkiau ją įgreitinti.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4"><Slider label="Sąveika su Higso lauku" value={g} min={0} max={1} onChange={setG} format={v => `${fmt(v * 100, 0)} %`} /></div>
      <div className="px-4 pb-3"><Button primary small onClick={start}>stumtelėti abi</Button></div>
      <Readout>{g < 0.1 ? 'Beveik be sąveikos – dalelė lengva, lekia beveik kaip fotonas.' : g < 0.6 ? 'Vidutinė sąveika – vidutinė masė.' : 'Stipri sąveika – sunki dalelė, įsibėgėja lėtai. Tai ir yra masė.'}</Readout>
    </Panel>
  )
}
