import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/** Heizenbergo mikroskopas: trumpesnė banga – tikslesnė vieta, bet didesnis stumtelėjimas. */
export default function MeasurementKick() {
  const [lambda, setLambda] = useState(0.5)   // 0 trumpa … 1 ilga
  const lRef = useRef(lambda); lRef.current = lambda
  const H = 200
  const ref = useCanvas((ctx, w, h, t) => {
    const fg = cssVar('--fg'), accent = cssVar('--accent'), warn = cssVar('--warn'), muted = cssVar('--muted')
    const L = lRef.current, cx = w / 2, cy = h / 2 + 10
    // šviesos banga iš kairės
    const wl = 8 + L * 40
    ctx.strokeStyle = warn; ctx.lineWidth = 2; ctx.beginPath()
    for (let x = 10; x < cx - 30; x++) { const y = cy + Math.sin(((x - t * 60) / wl) * Math.PI * 2) * 10; x === 10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) }
    ctx.stroke()
    // dalelės vietos neapibrėžtumas – dėmė, kurios plotis ~ bangos ilgis
    const blur = 10 + L * 60
    const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, blur)
    g.addColorStop(0, accent); g.addColorStop(1, 'transparent')
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, blur, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill()
    // stumtelėjimo rodyklė – ilgis ~ 1/λ
    const kick = 20 + (1 - L) * 110
    ctx.strokeStyle = fg; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + 12, cy); ctx.lineTo(cx + 12 + kick, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + 12 + kick, cy); ctx.lineTo(cx + 2 + kick, cy - 6); ctx.lineTo(cx + 2 + kick, cy + 6); ctx.closePath(); ctx.fill()
    ctx.font = '11px system-ui'; ctx.fillStyle = muted
    ctx.fillText('šviesa', 10, cy - 24); ctx.fillText('kur dalelė? (neaiškumas)', cx - 60, cy + blur + 18)
    ctx.fillText('stumtelėjimas', cx + 14, cy - 12)
  }, H)
  return (
    <Panel caption="Geltona – šviesa, kuria „žiūrime“. Rudas rūkas – kiek neaiški dalelės vieta. Rodyklė – kaip stipriai šviesa dalelę stumteli.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Šviesos bangos ilgis" value={lambda} min={0} max={1} onChange={setLambda} format={v => v < 0.33 ? 'trumpas' : v < 0.66 ? 'vidutinis' : 'ilgas'} />
      </div>
      <Readout>{lambda < 0.33 ? 'Vieta aiški, bet dalelė smarkiai stumtelėta – jos greitis dabar nežinomas.' : lambda > 0.66 ? 'Stumtelėjimas mažas, bet vieta – rūke.' : 'Kompromisas: nei vieta tiksli, nei trikdis mažas.'}</Readout>
    </Panel>
  )
}
