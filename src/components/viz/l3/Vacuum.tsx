import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/** Vakuumo virpesiai: kuo smulkesnis mastelis, tuo didesnis santykinis drebėjimas. */
export default function Vacuum() {
  const [zoom, setZoom] = useState(0)
  const zRef = useRef(zoom); zRef.current = zoom
  const H = 220
  const ref = useCanvas((ctx, w, h, t) => {
    const accent = cssVar('--accent'), muted = cssVar('--muted'), line = cssVar('--line')
    const z = zRef.current
    const cy = h / 2, amp = 2 + z * 40, freq = 0.02 + z * 0.3
    ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke()
    ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath()
    for (let x = 0; x < w; x++) {
      const y = cy + amp * (Math.sin(x * freq + t * 3) * Math.sin(x * freq * 2.7 - t * 5) + 0.5 * Math.sin(x * freq * 5.3 + t * 11))
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.stroke()
    ctx.font = '11px system-ui'; ctx.fillStyle = muted
    ctx.fillText(z < 0.2 ? 'iš toli: atrodo tuščia ir rami' : z < 0.6 ? 'priartinus: drebėjimas' : 'labai arti: vakuumas verda', 8, 20)
    ctx.fillText('laukas be dalelių (žemiausia būsena)', 8, h - 10)
  }, H)
  return (
    <Panel caption="Linija – laukas be jokių dalelių. Kuo labiau priartini, tuo neramesnis jis atrodo: visiškai nurimti neleidžia kvantinė mechanika.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4"><Slider label="Priartinimas" value={zoom} min={0} max={1} onChange={setZoom} format={v => `${Math.round(1 + v * 99)}×`} /></div>
      <Readout>{zoom < 0.2 ? 'Įprastu masteliu vakuumas atrodo tuščias.' : 'Šis drebėjimas tikras: jis šiek tiek pakeičia atomų spektrus ir stumia Kazimiro plokšteles.'}</Readout>
    </Panel>
  )
}
