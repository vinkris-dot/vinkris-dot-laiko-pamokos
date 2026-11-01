import { useRef, useState } from 'react'
import { Button, Panel, Readout, Toggle } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/** Dalelės po vieną. Be detektoriaus – interferencijos juostos, su detektoriumi – dvi dėmės. */
export default function DoubleSlit() {
  const [detector, setDetector] = useState(false)
  const dRef = useRef(detector); dRef.current = detector
  const hits = useRef<{ x: number; d: boolean }[]>([])
  const acc = useRef(0)
  const H = 230

  const sample = (det: boolean) => {
    // atmetimo metodas pagal pasiskirstymą ekrane (x ∈ -1..1)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 2 - 1
      const env = Math.exp(-x * x * 2.2)
      const p = det ? 0.5 * (Math.exp(-((x - 0.35) ** 2) * 18) + Math.exp(-((x + 0.35) ** 2) * 18)) : env * Math.cos(x * 15) ** 2
      if (Math.random() < p) return x
    }
    return 0
  }

  const ref = useCanvas((ctx, w, h, _t, dt) => {
    acc.current += dt * 60
    while (acc.current > 1) { acc.current -= 1; if (hits.current.length < 2500) hits.current.push({ x: sample(dRef.current), d: dRef.current }) }
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted')
    const sx = 40, slitX = w * 0.35, screenX = w - 30
    // šaltinis, siena su plyšiais, ekranas
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(sx, h / 2, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = line; ctx.fillRect(slitX - 3, 10, 6, h / 2 - 32); ctx.fillRect(slitX - 3, h / 2 - 18, 6, 36); ctx.fillRect(slitX - 3, h / 2 + 22, 6, h / 2 - 32)
    if (dRef.current) { ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(slitX + 14, h / 2 - 25, 5, 0, Math.PI * 2); ctx.fill(); ctx.font = '10px system-ui'; ctx.fillStyle = muted; ctx.fillText('detektorius', slitX + 22, h / 2 - 21) }
    ctx.fillStyle = line; ctx.fillRect(screenX, 10, 4, h - 20)
    // pataikymai (y ∈ ekrano aukštis)
    ctx.fillStyle = fg
    for (const p of hits.current) { ctx.globalAlpha = p.d === dRef.current ? 0.6 : 0.15; ctx.fillRect(screenX - 10 - Math.random() * 0, 10 + (p.x + 1) / 2 * (h - 20), 10, 1.2) }
    ctx.globalAlpha = 1
    // histograma
    const bins = new Array(40).fill(0)
    for (const p of hits.current) if (p.d === dRef.current) bins[Math.min(39, Math.floor((p.x + 1) / 2 * 40))]++
    const mx = Math.max(1, ...bins)
    ctx.fillStyle = accent; ctx.globalAlpha = 0.5
    bins.forEach((b, i) => ctx.fillRect(screenX - 12 - (b / mx) * 60, 10 + (i / 40) * (h - 20), (b / mx) * 60, (h - 20) / 40 - 1))
    ctx.globalAlpha = 1
    ctx.font = '11px system-ui'; ctx.fillStyle = muted; ctx.fillText('po vieną dalelę', sx - 20, h / 2 + 22)
  }, H)

  const n = hits.current.filter(p => p.d === detector).length
  return (
    <Panel caption="Kairėje – šaltinis, viduryje – siena su dviem plyšiais, dešinėje – ekranas. Rudas grafikas – kiek dalelių pataikė į kiekvieną vietą.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <Toggle label="detektorius prie plyšio" on={detector} onChange={v => { setDetector(v); hits.current = [] }} />
        <Button small onClick={() => { hits.current = [] }}>išvalyti</Button>
      </div>
      <Readout>{detector ? 'Žinant kelią – dvi dėmės, jokių juostų.' : n < 200 ? 'Dalelės krinta po vieną, atrodo atsitiktinai…' : '…bet iš daugelio išryškėja juostos – interferencija.'}</Readout>
    </Panel>
  )
}
