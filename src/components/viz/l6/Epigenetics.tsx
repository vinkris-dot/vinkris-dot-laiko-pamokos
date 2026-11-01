import { useRef, useState } from 'react'
import { Panel, Readout, Slider } from '../../ui/Controls'
import { Tag } from '../../ui/Tag'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** Genas su jungikliu (promotoriumi). Metilo žymenys mažina skaitymą – mažiau baltymo. */
export default function Epigenetics() {
  const [methyl, setMethyl] = useState(0)
  const mRef = useRef(methyl); mRef.current = methyl
  const proteins = useRef<{ x: number; y: number; vy: number }[]>([])
  const reader = useRef(0)
  const H = 210

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted'), bad = cssVar('--bad')
    const y = 100, x0 = 20, xp = 110, x1 = w - 20
    // DNR juosta
    ctx.strokeStyle = line; ctx.lineWidth = 10; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke()
    // jungiklis (promotorius)
    ctx.strokeStyle = muted; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xp, y); ctx.stroke()
    // genas
    ctx.strokeStyle = accent; ctx.beginPath(); ctx.moveTo(xp + 6, y); ctx.lineTo(x1, y); ctx.stroke()
    ctx.font = '11px system-ui'; ctx.fillStyle = muted; ctx.textAlign = 'center'
    ctx.fillText('jungiklis', (x0 + xp) / 2, y + 26); ctx.fillText('genas', (xp + x1) / 2, y + 26)
    // metilo žymenys ant jungiklio
    const n = Math.round(mRef.current * 8)
    for (let i = 0; i < 8; i++) {
      const mx = x0 + 8 + i * ((xp - x0 - 16) / 7)
      ctx.fillStyle = i < n ? bad : line
      ctx.beginPath(); ctx.arc(mx, y - 14, 4, 0, Math.PI * 2); ctx.fill()
      if (i < n) { ctx.strokeStyle = bad; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mx, y - 10); ctx.lineTo(mx, y - 5); ctx.stroke() }
    }
    ctx.fillStyle = muted; ctx.fillText(n ? `${n} metilo žymenys` : 'be žymenų', (x0 + xp) / 2, y - 28)
    // skaitytuvas juda genu, greitis mažėja su žymenimis
    const rate = 1 - mRef.current * 0.92
    reader.current += dt * 0.6 * rate
    if (reader.current >= 1) { reader.current = 0; proteins.current.push({ x: x1 + 4, y: y - 20, vy: -30 - Math.random() * 20 }) }
    const rx = xp + 10 + reader.current * (x1 - xp - 14)
    ctx.fillStyle = fg; ctx.globalAlpha = 0.2 + 0.8 * rate
    ctx.beginPath(); ctx.ellipse(rx, y, 14, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1
    // baltymai
    proteins.current.forEach(p => { p.y += p.vy * dt; p.x -= 12 * dt })
    proteins.current = proteins.current.filter(p => p.y > 10).slice(-30)
    ctx.fillStyle = accent
    for (const p of proteins.current) { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill() }
    ctx.fillStyle = muted; ctx.textAlign = 'right'; ctx.fillText('baltymas', x1, 24); ctx.textAlign = 'left'
    ctx.fillText(`skaitymas: ${Math.round(rate * 100)} %`, x0, h - 12)
  }, H)

  return (
    <Panel caption="Rudas skritulys bėga per geną ir gamina baltymą. Žymenys ant jungiklio – patirties pėdsakai: genas tas pats, bet skaitomas rečiau.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Patirties žymenys (stresas, mityba, aplinka)" value={methyl} min={0} max={1} onChange={setMethyl} format={v => `${fmt(v * 100, 0)} %`} />
      </div>
      <Readout>{methyl < 0.1 ? 'Genas skaitomas laisvai.' : methyl < 0.6 ? 'Dalis žymenų – skaitymas lėtėja, baltymo mažiau.' : 'Jungiklis beveik užrašytas „neskaityti“: genas lieka, bet tyli.'}</Readout>
      <div className="mx-4 mb-3 rounded-xl border border-line bg-panel-2 px-3 py-2 text-sm">
        <div className="mb-1 flex items-center gap-2"><span className="font-medium">Perdavimas vaikams</span><Tag kind="hipotezė" /></div>
        <p className="text-muted">Gyvūnuose rasta, kad dalis žymenų išlieka palikuonyse. Žmonėms tai dar neįrodyta: tyrimai maži, o žymenis sunku atskirti nuo bendros aplinkos.</p>
      </div>
    </Panel>
  )
}
