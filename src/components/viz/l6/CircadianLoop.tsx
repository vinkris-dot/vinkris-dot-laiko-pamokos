import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** PER/CRY – CLOCK/BMAL1 kilpa. Periodą keičia slankiklis; apačioje – kaip vidinė naktis slenka per 7 paras. */
export default function CircadianLoop() {
  const [period, setPeriod] = useState(24)
  const pRef = useRef(period); pRef.current = period
  const phase = useRef(0)   // 0..1 – kilpos fazė
  const H = 330

  const ref = useCanvas((ctx, w, _h, _t, dt) => {
    phase.current = (phase.current + dt * 0.08 * (24 / pRef.current)) % 1
    const ph = phase.current
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted'), panel2 = cssVar('--panel-2')
    const cx = w * 0.4, cy = 95, R = 58
    // ratas
    ctx.strokeStyle = line; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke()
    // aktyvioji dalis – kiek PER/CRY susikaupę
    const per = 0.5 - 0.5 * Math.cos(ph * Math.PI * 2)   // 0..1
    ctx.strokeStyle = accent; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + ph * Math.PI * 2); ctx.stroke()
    ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = fg
    ctx.fillText('CLOCK · BMAL1', cx, cy - R - 14)
    ctx.textAlign = 'left'; ctx.fillText('įjungia genus', cx + R + 8, cy - 4); ctx.textAlign = 'center'
    ctx.fillText('PER · CRY', cx, cy + R + 20)
    ctx.fillText('kaupiasi', cx, cy + R + 33)
    ctx.textAlign = 'right'; ctx.fillText('išjungia', cx - R - 8, cy - 4)
    ctx.fillText('CLOCK · BMAL1', cx - R - 8, cy + 9); ctx.textAlign = 'center'
    // taškas
    const a = -Math.PI / 2 + ph * Math.PI * 2
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 8, 0, Math.PI * 2); ctx.fill()
    // PER/CRY lygio stulpelis
    const bx = w * 0.84, by = 40, bh = 110
    ctx.fillStyle = panel2; ctx.fillRect(bx - 14, by, 28, bh)
    ctx.fillStyle = accent; ctx.fillRect(bx - 14, by + bh - bh * per, 28, bh * per)
    ctx.fillStyle = muted; ctx.fillText('PER · CRY kiekis', bx, by + bh + 16)
    ctx.fillText(per > 0.6 ? 'slopina' : per < 0.2 ? 'suiro – ratas iš naujo' : 'kaupiasi', bx, by + bh + 30)

    // 7 parų juosta
    const y0 = 215, rowH = 18, x0 = 30, x1 = w - 10, days = 7
    const sx = (hour: number) => x0 + (hour / (24 * days)) * (x1 - x0)
    ctx.textAlign = 'left'; ctx.fillStyle = muted; ctx.fillText('tikra naktis', x0, y0 - 6)
    for (let d = 0; d < days; d++) { ctx.fillStyle = line; ctx.fillRect(sx(d * 24 + 22), y0, sx(8) - x0, rowH) }
    ctx.fillStyle = muted; ctx.fillText('vidinė naktis (laikrodis sako „miegok“)', x0, y0 + rowH + 20)
    const P = pRef.current
    for (let k = 0; k < Math.ceil((24 * days) / P) + 1; k++) {
      const start = 22 + k * P
      if (start > 24 * days) break
      ctx.fillStyle = accent; ctx.globalAlpha = 0.7
      ctx.fillRect(sx(start), y0 + rowH + 26, Math.min(sx(start + 10 * (P / 24)) - sx(start), x1 - sx(start)), rowH)
      ctx.globalAlpha = 1
    }
    ctx.fillStyle = muted
    for (let d = 0; d <= days; d++) { ctx.fillText(`${d + 1}`, sx(d * 24) - 3, y0 + rowH * 2 + 44); }
    ctx.fillText('para', x1 - 26, y0 + rowH * 2 + 58)
  }, H)

  const drift = (period - 24) * 7
  return (
    <Panel caption="Ratas – kilpa ląstelėje: CLOCK ir BMAL1 įjungia PER ir CRY gamybą, PER ir CRY susikaupę juos išjungia, paskui suyra. Apačioje – kaip vidinė naktis slenka nuo tikros, jei ciklas ne 24 val.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Kilpos trukmė (mutacija)" value={period} min={20} max={28} step={0.5} onChange={setPeriod} format={v => `${fmt(v, 1)} val.`} />
      </div>
      <Readout>{Math.abs(drift) < 0.6 ? 'Ciklas ~24 val.: vidinė naktis sutampa su tikra.' : `Per savaitę laikrodis nuslenka ${fmt(Math.abs(drift), 1)} val. ${drift > 0 ? 'vėliau' : 'anksčiau'} – kaip nuolatinė kelionė per laiko juostas.`}</Readout>
    </Panel>
  )
}
