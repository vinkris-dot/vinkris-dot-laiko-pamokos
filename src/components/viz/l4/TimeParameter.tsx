import { useRef, useState } from 'react'
import { Button, Panel, Readout, Slider, Toggle } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'
import { fmt } from '../../../lib/fmt'

/** Dalelė dėžėje: dviejų žemiausių būsenų superpozicija. Laikas – išorinis parametras. */
const E1 = 1, E2 = 4
function psi(x: number, t: number) {
  const a = Math.sin(Math.PI * x), b = Math.sin(2 * Math.PI * x)
  const re = a * Math.cos(E1 * t) + b * Math.cos(E2 * t)
  const im = -a * Math.sin(E1 * t) - b * Math.sin(E2 * t)
  return { re, im, p: re * re + im * im }
}

export default function TimeParameter() {
  const [t, setT] = useState(0)
  const [play, setPlay] = useState(false)
  const [hits, setHits] = useState<number[]>([])
  const tRef = useRef(t); tRef.current = t
  const playRef = useRef(play); playRef.current = play
  const hitsRef = useRef(hits); hitsRef.current = hits

  const H = 230
  const ref = useCanvas((ctx, w, h, _tt, dt) => {
    if (playRef.current) { const nt = (tRef.current + dt * 0.8) % 10; tRef.current = nt; setT(nt) }
    const tt = tRef.current
    const fg = cssVar('--fg'), accent = cssVar('--accent'), line = cssVar('--line'), muted = cssVar('--muted')
    const pad = 24, x0 = pad, x1 = w - pad, base = h - 50
    // dėžė
    ctx.strokeStyle = line; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(x0, 20); ctx.lineTo(x0, base); ctx.lineTo(x1, base); ctx.lineTo(x1, 20); ctx.stroke()
    // |ψ|²
    const N = 120
    ctx.beginPath()
    for (let i = 0; i <= N; i++) {
      const x = i / N, { p } = psi(x, tt)
      const X = x0 + x * (x1 - x0), Y = base - p * 38
      i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y)
    }
    ctx.lineTo(x1, base); ctx.lineTo(x0, base); ctx.closePath()
    ctx.fillStyle = accent; ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = 1
    ctx.strokeStyle = accent; ctx.lineWidth = 2.5; ctx.stroke()
    // realioji dalis (plonai)
    ctx.beginPath()
    for (let i = 0; i <= N; i++) {
      const x = i / N, { re } = psi(x, tt)
      const X = x0 + x * (x1 - x0), Y = base - 70 - re * 28
      i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y)
    }
    ctx.strokeStyle = muted; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.fillStyle = muted; ctx.font = '11px system-ui'
    ctx.textAlign = 'right'
    ctx.fillText('banga', x1 - 6, 34)
    ctx.fillText('tikimybė rasti dalelę', x1 - 6, base - 8)
    ctx.textAlign = 'left'
    // matavimų pėdsakai
    for (const x of hitsRef.current) {
      const X = x0 + x * (x1 - x0)
      ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(X, base + 18, 3, 0, Math.PI * 2); ctx.fill()
    }
    ctx.fillStyle = muted
    ctx.fillText('išmatuotos vietos', x0 + 4, base + 40)
  }, H)

  const measure = () => {
    // atranka pagal |ψ|²
    const tt = tRef.current
    let x = 0.5
    for (let i = 0; i < 200; i++) {
      const c = Math.random(), { p } = psi(c, tt)
      if (Math.random() * 4 < p) { x = c; break }
    }
    setHits(h => [...h.slice(-59), x])
  }

  return (
    <Panel caption="Slankiklis „laikas“ – rankenėlė lygties išorėje. Mygtukas „išmatuoti vietą“ – vienintelis matavimas, kurį sistema leidžia; laikui tokio mygtuko nėra.">
      <canvas ref={ref} style={{ width: '100%', height: H }} />
      <div className="px-4">
        <Slider label="Laikas (parametras)" value={t} min={0} max={10} step={0.01} onChange={v => { setPlay(false); setT(v) }} format={x => fmt(x, 1)} />
      </div>
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
        <Toggle label="sukti laiką savaime" on={play} onChange={setPlay} />
        <Button primary small onClick={measure}>išmatuoti vietą</Button>
        <Button small onClick={() => setHits([])}>išvalyti</Button>
      </div>
      <Readout>{hits.length ? `Matavimų: ${hits.length}. Vieta – atsitiktinė, bet pagal bangos aukštį.` : 'Paspausk „išmatuoti vietą“ kelis kartus.'}</Readout>
    </Panel>
  )
}
