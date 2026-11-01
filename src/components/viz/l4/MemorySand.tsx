import { useRef, useState } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'
import { useCanvas, cssVar } from '../../../lib/useCanvas'

/** Smėlis: lygus (maža entropija) arba sujauktas (didelė). Pirštu brėžiamas pėdsakas. */
const CELL = 5
export default function MemorySand() {
  const [noisy, setNoisy] = useState(false)
  const [drawn, setDrawn] = useState(false)
  const grid = useRef<Float32Array | null>(null)
  const dims = useRef({ c: 0, r: 0 })
  const H = 240

  const fill = (c: number, r: number, loud: boolean) => {
    const g = new Float32Array(c * r)
    for (let i = 0; i < g.length; i++) g[i] = loud ? Math.random() * 2 - 1 : (Math.random() - 0.5) * 0.08
    grid.current = g; dims.current = { c, r }
  }

  const ref = useCanvas((ctx, w, h) => {
    const c = Math.ceil(w / CELL), r = Math.ceil(h / CELL)
    if (!grid.current || dims.current.c !== c || dims.current.r !== r) fill(c, r, noisy)
    const g = grid.current!
    const dark = matchMedia('(prefers-color-scheme: dark)').matches
    for (let y = 0; y < r; y++) for (let x = 0; x < c; x++) {
      const v = g[x + y * c]                    // -1 .. 1 (neigiama – duobė)
      const L = dark ? 38 + v * 20 : 80 - v * 18
      ctx.fillStyle = `hsl(36 30% ${L}%)`
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL)
    }
    ctx.fillStyle = cssVar('--muted'); ctx.font = '11px system-ui'
    ctx.fillText(noisy ? 'sujauktas smėlis' : 'lygus smėlis', 6, h - 8)
  }, H)

  const last = useRef<{ x: number; y: number } | null>(null)
  const stamp = (x: number, y: number) => {
    const g = grid.current; if (!g) return
    const { c, r } = dims.current
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const X = Math.round(x) + dx, Y = Math.round(y) + dy
      if (X < 0 || Y < 0 || X >= c || Y >= r) continue
      const d = Math.hypot(X - x, Y - y)
      if (d <= 1.6) g[X + Y * c] = -0.9
      else if (d <= 2.8) g[X + Y * c] = Math.max(g[X + Y * c], 0.55)
    }
  }
  const press = (e: React.PointerEvent, start = false) => {
    const b = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const x = (e.clientX - b.left) / CELL, y = (e.clientY - b.top) / CELL
    const prev = start ? null : last.current
    if (prev) {
      const n = Math.max(1, Math.ceil(Math.hypot(x - prev.x, y - prev.y)))
      for (let i = 1; i <= n; i++) stamp(prev.x + ((x - prev.x) * i) / n, prev.y + ((y - prev.y) * i) / n)
    } else stamp(x, y)
    last.current = { x, y }
    setDrawn(true)
  }

  const set = (loud: boolean) => { setNoisy(loud); grid.current = null; setDrawn(false) }

  return (
    <Panel caption="Brėžk pirštu. Lygiame smėlyje pėdsakas – aiškus įrašas apie tai, kas buvo. Sujauktame – įrašas skęsta triukšme.">
      <canvas ref={ref} style={{ width: '100%', height: H }} onPointerDown={e => { (e.target as Element).setPointerCapture(e.pointerId); press(e, true) }} onPointerMove={e => e.buttons && press(e)} onPointerUp={() => { last.current = null }} />
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <Button primary={!noisy} small onClick={() => set(false)}>maža entropija (lygus)</Button>
        <Button primary={noisy} small onClick={() => set(true)}>didelė entropija</Button>
      </div>
      <Readout>{!drawn ? 'Perbrauk pirštu per smėlį.' : noisy ? 'Pėdsakas yra, bet jo neįmanoma atskirti nuo aplinkos – jokio įrašo, jokios atminties.' : 'Pėdsakas įskaitomas: iš jo galima „perskaityti“ praeitį. Taip veikia atmintis.'}</Readout>
    </Panel>
  )
}
