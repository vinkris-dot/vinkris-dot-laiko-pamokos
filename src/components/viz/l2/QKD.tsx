import { useState } from 'react'
import { Button, Panel, Readout, Toggle } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

interface Ph { bit: number; bA: number; bB: number; got: number; keep: boolean }
export default function QKD() {
  const [eve, setEve] = useState(false)
  const [ph, setPh] = useState<Ph[]>([])
  const send = () => {
    const out: Ph[] = []
    for (let i = 0; i < 24; i++) {
      const bit = Math.random() < 0.5 ? 0 : 1, bA = Math.random() < 0.5 ? 0 : 1, bB = Math.random() < 0.5 ? 0 : 1
      let state = { bit, base: bA }
      if (eve) { const bE = Math.random() < 0.5 ? 0 : 1; const got = bE === state.base ? state.bit : (Math.random() < 0.5 ? 0 : 1); state = { bit: got, base: bE } }
      const got = bB === state.base ? state.bit : (Math.random() < 0.5 ? 0 : 1)
      out.push({ bit, bA, bB, got, keep: bA === bB })
    }
    setPh(out)
  }
  const kept = ph.filter(p => p.keep), errs = kept.filter(p => p.got !== p.bit).length
  return (
    <Panel caption="Kiekvienas fotonas siunčiamas vienu iš dviejų „pagrindų“ (+ arba ×). Sutapus pagrindams, bitas turi sutapti. Pasiklausytoja matuoja ir dalį fotonų sugadina.">
      <div className="px-4 pt-3"><Toggle label="pasiklausytoja linijoje" on={eve} onChange={v => { setEve(v); setPh([]) }} /></div>
      <div className="grid grid-cols-12 gap-1 px-4 py-3">
        {ph.map((p, i) => (
          <div key={i} className={`flex flex-col items-center rounded text-[10px] ${p.keep ? (p.got !== p.bit ? 'bg-bad/20 text-bad' : 'bg-ok/15 text-ok') : 'text-muted opacity-50'}`}>
            <span>{p.bA ? '×' : '+'}</span><span className="font-mono">{p.bit}</span><span className="font-mono">{p.got}</span>
          </div>
        ))}
      </div>
      {ph.length > 0 && <div className="px-4 text-xs text-muted">viršuje – pagrindas, viduryje – išsiųstas bitas, apačioje – gautas. Spalvoti – pagrindai sutapo (raktas).</div>}
      <div className="px-4 py-3"><Button primary small onClick={send}>siųsti 24 fotonus</Button></div>
      <Readout>{!ph.length ? 'Siųsk fotonus.' : `Rakto bitų: ${kept.length}, klaidų: ${errs} (${fmt(kept.length ? (errs / kept.length) * 100 : 0, 0)} %). ${eve ? 'Klaidos išduoda pasiklausytoją.' : 'Be klaidų – kanalas švarus.'}`}</Readout>
    </Panel>
  )
}
