import { useState } from 'react'
import { Button, Panel, Readout } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

/** Dvi hipotezės apie tą patį pasaulį: viena tikrinama kasdien, kita – ne. */
const TRUTH = 0.7
export default function TwoHypotheses() {
  const [a, setA] = useState<number[]>([0.2])
  const [b] = useState<number[]>([0.2])
  const [days, setDays] = useState(0)

  const day = (n = 1) => {
    setA(prev => {
      const out = [...prev]
      for (let i = 0; i < n; i++) {
        const sample = Math.random() < TRUTH ? 1 : 0           // ką parodė tikrovė
        const belief = out[out.length - 1]
        out.push(belief + 0.12 * (sample - belief))            // pataisa pagal paklaidą
      }
      return out
    })
    setDays(d => d + n)
  }
  const reset = () => { setA([0.2]); setDays(0) }

  const Row = ({ title, hist, tested }: { title: string; hist: number[]; tested: boolean }) => {
    const cur = hist[hist.length - 1]
    return (
      <div className="px-4 py-3">
        <div className="flex justify-between text-sm"><span className="font-medium">{title}</span><span className="text-muted">{tested ? 'tikrinama' : 'vengiama'}</span></div>
        <svg viewBox="0 -8 340 52" className="mt-1 w-full" style={{ touchAction: 'pan-y' }}>
          <line x1={10} y1={22} x2={330} y2={22} stroke="var(--line)" strokeWidth={4} strokeLinecap="round" />
          <line x1={10 + TRUTH * 320} y1={6} x2={10 + TRUTH * 320} y2={38} stroke="var(--fg)" strokeWidth={2} />
          <text x={10 + TRUTH * 320} y={4} fontSize={9} textAnchor="middle" fill="var(--fg)">tikrovė</text>
          {hist.map((h, i) => <circle key={i} cx={10 + h * 320} cy={22} r={2} fill="var(--accent)" opacity={0.3} />)}
          <circle cx={10 + cur * 320} cy={22} r={8} fill="var(--accent)" stroke="var(--panel)" strokeWidth={2} />
        </svg>
        <div className="text-xs text-muted">įsitikinimas: {fmt(cur * 100, 0)} % · skirtumas nuo tikrovės: {fmt(Math.abs(cur - TRUTH) * 100, 0)} proc. punktų</div>
      </div>
    )
  }

  return (
    <Panel caption="Abi hipotezės prasidėjo nuo tos pačios klaidos. Tikrovė – juoda linija. Rudas taškas – ką hipotezė „mano“ šiandien.">
      <Row title="A: „pabandysiu ir pažiūrėsiu“" hist={a} tested />
      <div className="mx-4 border-t border-line" />
      <Row title="B: „žinau, kad nepavyks, tad nebandau“" hist={b} tested={false} />
      <div className="flex flex-wrap gap-2 px-4 pb-3">
        <Button primary small onClick={() => day(1)}>nauja diena</Button>
        <Button small onClick={() => day(10)}>10 dienų</Button>
        <Button small onClick={reset}>iš naujo</Button>
      </div>
      <Readout>{days === 0 ? 'Abi klysta vienodai. Spausk „nauja diena“.' : days < 8 ? `${days} d. A gauna paklaidos signalą ir juda. B – jokio signalo, jokio judesio.` : `${days} d. A beveik susitapatino su tikrove. B tebėra ten, kur pradėjo – ir jaučiasi teisi, nes niekada neklydo.`}</Readout>
    </Panel>
  )
}
