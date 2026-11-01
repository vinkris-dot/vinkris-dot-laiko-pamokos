import { useEffect, useRef, useState } from 'react'
import { Button, Panel, Readout, Toggle } from '../../ui/Controls'

type Tab = 'trikampis' | 'pilka' | 'garsas'

function Kanizsa() {
  const [hide, setHide] = useState(false)
  const pts = [[150, 40], [60, 195], [240, 195]] as const
  return (
    <>
      <svg viewBox="0 0 300 230" className="mx-auto w-full max-w-[300px]" style={{ touchAction: 'pan-y' }}>
        <rect width="300" height="230" fill="var(--panel)" />
        {!hide && pts.map(([x, y], i) => {
          // „pakmanai“: apskritimas su išpjova į trikampio vidų
          const cx = 150, cy = 143
          const a = Math.atan2(cy - y, cx - x)
          const r = 32, s = a - 0.55, e = a + 0.55
          const d = `M${x},${y} L${x + r * Math.cos(s)},${y + r * Math.sin(s)} A${r},${r} 0 1 0 ${x + r * Math.cos(e)},${y + r * Math.sin(e)} Z`
          return <path key={i} d={d} fill="var(--fg)" />
        })}
        {hide && <polygon points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--line)" strokeDasharray="4 4" />}
      </svg>
      <div className="px-4 pb-3"><Toggle label="paslėpti išpjovas" on={hide} onChange={setHide} /></div>
      <Readout>{hide ? 'Trikampio kontūro niekada nebuvo – jį nupiešė smegenys. Punktyras rodo, kur jį „matei“.' : 'Matai šviesų trikampį virš trijų skritulių? Jo kraštinių nėra nubrėžta.'}</Readout>
    </>
  )
}

function Brightness() {
  const [bridge, setBridge] = useState(false)
  return (
    <>
      <svg viewBox="0 0 300 160" className="mx-auto w-full max-w-[300px]" style={{ touchAction: 'pan-y' }}>
        <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#1a1a1a" /><stop offset="1" stopColor="#e8e8e8" /></linearGradient></defs>
        <rect width="300" height="160" fill="url(#g)" />
        <rect x="55" y="55" width="50" height="50" fill="#8a8a8a" />
        <rect x="195" y="55" width="50" height="50" fill="#8a8a8a" />
        {bridge && <rect x="55" y="70" width="190" height="20" fill="#8a8a8a" />}
      </svg>
      <div className="px-4 pb-3"><Toggle label="sujungti kvadratus" on={bridge} onChange={setBridge} /></div>
      <Readout>{bridge ? 'Tas pats pilkumas ištisai. Smegenys „pataisė“ ryškumą pagal foną – prognozė apie apšvietimą.' : 'Kairysis kvadratas atrodo šviesesnis už dešinįjį? Abu yra lygiai vienodo pilkumo.'}</Readout>
    </>
  )
}

function MissingFundamental() {
  const ctx = useRef<AudioContext | null>(null)
  const nodes = useRef<{ osc: OscillatorNode; gain: GainNode; f: number }[]>([])
  const [on, setOn] = useState(false)
  const [fund, setFund] = useState(false)
  const F = 110

  const stop = () => { nodes.current.forEach(n => { try { n.osc.stop() } catch { /* jau sustabdyta */ } }); nodes.current = []; setOn(false) }
  const start = () => {
    try {
      const ac = ctx.current ?? new AudioContext()
      ctx.current = ac
      if (ac.state === 'suspended') ac.resume()
      stop()
      for (let k = 1; k <= 6; k++) {
        const osc = ac.createOscillator(), gain = ac.createGain()
        osc.frequency.value = F * k
        gain.gain.value = k === 1 ? (fund ? 0.12 : 0) : 0.08 / k
        osc.connect(gain).connect(ac.destination); osc.start()
        nodes.current.push({ osc, gain, f: F * k })
      }
      setOn(true)
    } catch { /* garsas neprieinamas */ }
  }
  useEffect(() => { const n = nodes.current.find(x => x.f === F); if (n) n.gain.gain.value = fund ? 0.12 : 0 }, [fund])
  useEffect(() => () => stop(), [])

  return (
    <>
      <div className="flex items-end justify-center gap-2 px-4 pt-4" style={{ height: 120 }}>
        {[1, 2, 3, 4, 5, 6].map(k => (
          <div key={k} className="flex flex-col items-center text-xs text-muted">
            <div className={`w-8 rounded-t ${k === 1 ? (fund ? 'bg-accent' : 'bg-line') : 'bg-fg/70'}`} style={{ height: k === 1 ? (fund ? 70 : 6) : 70 / k + 10 }} />
            <span className="mt-1">{F * k}</span>
          </div>
        ))}
      </div>
      <div className="px-4 text-center text-xs text-muted">dažniai hercais; pirmasis stulpelis – žemiausias tonas</div>
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {!on ? <Button primary small onClick={start}>groti</Button> : <Button small onClick={stop}>sustabdyti</Button>}
        <Toggle label="groti ir žemiausią toną" on={fund} onChange={setFund} />
      </div>
      <Readout>{!on ? 'Paspausk „groti“ (geriau su ausinėmis).' : fund ? 'Dabar žemiausias tonas skamba iš tikrųjų. Išjunk jį – aukštis liks tas pats.' : 'Girdi žemą toną (110 Hz)? Garsiakalbis jo neskleidžia – smegenys jį „pridėjo“ pačios iš aukštesnių tonų rašto.'}</Readout>
    </>
  )
}

export default function Illusions() {
  const [tab, setTab] = useState<Tab>('trikampis')
  return (
    <Panel caption="Trys pavyzdžiai, kaip smegenys užpildo tai, ko jutimuose nėra.">
      <div className="flex gap-2 px-4 pt-3">
        {(['trikampis', 'pilka', 'garsas'] as Tab[]).map(t => <Button key={t} small primary={tab === t} onClick={() => setTab(t)}>{t}</Button>)}
      </div>
      {tab === 'trikampis' && <Kanizsa />}
      {tab === 'pilka' && <Brightness />}
      {tab === 'garsas' && <MissingFundamental />}
    </Panel>
  )
}
