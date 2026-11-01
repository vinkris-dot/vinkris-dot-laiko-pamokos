import { useRef, useState } from 'react'
import { Button, Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** Padarėlis tikisi šilumos. Nuostabą mažina keisdamas modelį (lūkestį) arba pasaulį (vietą). */
export default function FreeEnergy() {
  const [cold, setCold] = useState(0)             // kiek pasaulis atšalo (0..1)
  const [expect, setExpect] = useState(0.8)       // lūkestis (šiluma 0..1)
  const [x, setX] = useState(0.5)                 // padėtis 0..1
  const pos = useRef(x)                           // animuota padėtis
  const coldRef = useRef(cold); coldRef.current = cold
  const expRef = useRef(expect); expRef.current = expect
  const xRef = useRef(x); xRef.current = x
  const H = 200

  const temp = (p: number, c: number) => Math.max(0, Math.min(1, 1 - p * 0.9 - c * 0.6))  // kairėje šilčiau
  const surprise = Math.abs(temp(x, cold) - expect)

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    pos.current += (xRef.current - pos.current) * Math.min(1, dt * 4)
    const fg = cssVar('--fg'), accent = cssVar('--accent'), muted = cssVar('--muted')
    // temperatūros juosta
    const y0 = 56, hh = 64
    for (let i = 0; i < w; i++) {
      const tt = temp(i / w, coldRef.current)
      ctx.fillStyle = `hsl(${200 - tt * 180} 50% ${55 + tt * 10}%)`
      ctx.fillRect(i, y0, 1, hh)
    }
    ctx.font = '11px system-ui'; ctx.fillStyle = muted
    ctx.fillText('šilta', 6, y0 + hh + 14); ctx.textAlign = 'right'; ctx.fillText('šalta', w - 6, y0 + hh + 14); ctx.textAlign = 'left'
    // padarėlis
    const px = 22 + pos.current * (w - 44), py = y0 + hh / 2
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(px, py, 16, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = cssVar('--panel'); ctx.beginPath(); ctx.arc(px - 5, py - 3, 2.5, 0, Math.PI * 2); ctx.arc(px + 5, py - 3, 2.5, 0, Math.PI * 2); ctx.fill()
    // mintis: lūkestis
    const e = expRef.current
    ctx.fillStyle = `hsl(${200 - e * 180} 50% 60%)`; ctx.beginPath(); ctx.arc(px, y0 - 18, 11, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = fg; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.fillStyle = muted; ctx.textAlign = 'center'; ctx.fillText('tikisi', px, y0 - 36); ctx.textAlign = 'left'
    // nuostabos skalė
    const s = Math.abs(temp(xRef.current, coldRef.current) - e)
    ctx.fillStyle = muted; ctx.fillText('nuostaba', 6, h - 24)
    ctx.fillStyle = cssVar('--line'); ctx.fillRect(70, h - 32, w - 80, 10)
    ctx.fillStyle = accent; ctx.fillRect(70, h - 32, (w - 80) * s, 10)
  }, H)

  const changeModel = () => setExpect(temp(x, cold))
  const changeWorld = () => {
    // rasti vietą, kur temperatūra ≈ lūkestis
    let best = x, bd = 9
    for (let p = 0; p <= 1; p += 0.01) { const d = Math.abs(temp(p, cold) - expect); if (d < bd) { bd = d; best = p } }
    setX(best)
  }

  return (
    <Panel caption="Juosta – pasaulio temperatūra. Burbulas – ko padarėlis tikisi. Nuostaba – skirtumas tarp lūkesčio ir to, ką jis jaučia ten, kur stovi.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Pasaulis atšąla" value={cold} min={0} max={1} onChange={setCold} format={v => `${fmt(v * 100, 0)} %`} />
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <Button primary small onClick={changeModel}>pakeisti modelį (suvokimas)</Button>
        <Button primary small onClick={changeWorld}>pakeisti pasaulį (veiksmas)</Button>
      </div>
      <Readout>{surprise < 0.08 ? 'Nuostaba maža: lūkestis ir jutimas sutampa.' : 'Nuostaba didelė. Du keliai: pakeisti, ko tikiesi, arba pakeisti, kur esi.'}</Readout>
    </Panel>
  )
}
