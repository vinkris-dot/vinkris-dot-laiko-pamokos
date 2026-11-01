import { useState } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

/** CHSH žaidimas: laimi, jei a⊕b = x·y. Klasika: 75 %. Kvantinė strategija: cos²(π/8) ≈ 85,4 %. */
type Strat = 'klasikinė' | 'kvantinė'
export default function BellGame() {
  const [strat, setStrat] = useState<Strat>('klasikinė')
  const [score, setScore] = useState<Record<Strat, { n: number; w: number }>>({ 'klasikinė': { n: 0, w: 0 }, 'kvantinė': { n: 0, w: 0 } })
  const [last, setLast] = useState<{ x: number; y: number; a: number; b: number; win: boolean } | null>(null)

  const round = () => {
    const x = Math.random() < 0.5 ? 0 : 1, y = Math.random() < 0.5 ? 0 : 1
    let a: number, b: number
    if (strat === 'klasikinė') { a = 0; b = 0 }               // geriausias sutartas planas: visada 0
    else {
      // susietos dalelės: matavimo kampai 0/45° ir 22,5°/−22,5°
      const ta = x === 0 ? 0 : Math.PI / 4, tb = y === 0 ? Math.PI / 8 : -Math.PI / 8
      const same = Math.random() < Math.cos(ta - tb) ** 2
      a = Math.random() < 0.5 ? 0 : 1; b = same ? a : 1 - a
    }
    const win = ((a + b) % 2) === (x * y)
    setLast({ x, y, a, b, win })
    setScore(s => ({ ...s, [strat]: { n: s[strat].n + 1, w: s[strat].w + (win ? 1 : 0) } }))
  }
  const play = (n: number) => { for (let i = 0; i < n; i++) round() }
  const pct = (s: Strat) => score[s].n ? (score[s].w / score[s].n) * 100 : 0

  return (
    <Panel caption="Du žaidėjai atskirose dėžutėse gauna klausimus (0/1) ir atsako (0/1). Laimi, jei atsakymai sutampa, išskyrus atvejį 1 ir 1 – tada turi skirtis.">
      <div className="flex gap-2 px-4 pt-3">
        {(['klasikinė', 'kvantinė'] as Strat[]).map(s => <Button key={s} small primary={strat === s} onClick={() => setStrat(s)}>{s} strategija</Button>)}
      </div>
      <div className="flex justify-around px-4 py-3 text-center text-sm">
        {(['A', 'B'] as const).map((who, i) => (
          <div key={who} className="rounded-2xl border border-line bg-panel-2 px-4 py-2">
            <div className="text-xs text-muted">dėžutė {who}</div>
            <div>klausimas: <b>{last ? (i ? last.y : last.x) : '–'}</b></div>
            <div>atsakymas: <b className="text-accent">{last ? (i ? last.b : last.a) : '–'}</b></div>
          </div>
        ))}
      </div>
      <div className="space-y-2 px-4">
        {(['klasikinė', 'kvantinė'] as Strat[]).map(s => (
          <div key={s}>
            <div className="flex justify-between text-xs text-muted"><span>{s}</span><span>{score[s].n ? `${fmt(pct(s), 1)} % iš ${score[s].n}` : '–'}</span></div>
            <div className="relative h-3 rounded-full bg-line">
              <div className="h-3 rounded-full bg-accent" style={{ width: `${pct(s)}%` }} />
              <div className="absolute top-[-3px] h-5 w-0.5 bg-fg" style={{ left: '75%' }} />
            </div>
          </div>
        ))}
        <div className="text-right text-xs text-muted">juoda riba – 75 % (Belo nelygybė)</div>
      </div>
      <div className="flex gap-2 px-4 py-3">
        <Button primary small onClick={() => play(1)}>raundas</Button>
        <Button small onClick={() => play(500)}>500 raundų</Button>
      </div>
      <Readout>{last ? (last.win ? 'Laimėta. ' : 'Pralaimėta. ') + (strat === 'klasikinė' ? 'Sutartas planas neperžengia 75 %.' : 'Susietos dalelės: apie 85 % – daugiau nei leidžia bet koks planas.') : 'Žaisk raundus su abiem strategijomis.'}</Readout>
    </Panel>
  )
}
