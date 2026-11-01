import { useState } from 'react'
import { Button, Panel, Readout, Slider } from '../../ui/Controls'
import { fmt } from '../../../lib/fmt'

export default function NoSignalling() {
  const [angle, setAngle] = useState(0)
  const [res, setRes] = useState<[number, number][]>([])
  const [compared, setCompared] = useState(false)
  const run = (n: number) => {
    const th = (angle * Math.PI) / 180
    setRes(r => [...r, ...Array.from({ length: n }, () => { const a = Math.random() < 0.5 ? 0 : 1; const same = Math.random() < Math.cos(th) ** 2; return [a, same ? a : 1 - a] as [number, number] })].slice(-400))
  }
  const bob0 = res.filter(r => r[1] === 0).length
  const same = res.filter(r => r[0] === r[1]).length
  return (
    <Panel caption="Tu keiti savo matavimo kryptį. Kita pusė mato tik savo rezultatus: visada apie 50 ir 50. Koreliacija matoma tik palyginus abi puses.">
      <div className="px-4 pt-3">
        <Slider label="Tavo matavimo kryptis" value={angle} min={0} max={90} step={1} onChange={v => { setAngle(v); setRes([]); setCompared(false) }} format={v => `${fmt(v, 0)}°`} />
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 text-sm">
        <div className="rounded-2xl border border-line bg-panel-2 p-3">
          <div className="text-xs text-muted">kita pusė mato</div>
          <div className="mt-1 flex h-16 items-end gap-2">
            <div className="flex flex-1 flex-col items-center"><div className="w-full rounded-t bg-fg/70" style={{ height: `${res.length ? (bob0 / res.length) * 56 : 0}px` }} /><span className="text-xs">0</span></div>
            <div className="flex flex-1 flex-col items-center"><div className="w-full rounded-t bg-fg/70" style={{ height: `${res.length ? ((res.length - bob0) / res.length) * 56 : 0}px` }} /><span className="text-xs">1</span></div>
          </div>
          <div className="text-xs text-muted">{res.length ? `„0“: ${fmt((bob0 / res.length) * 100, 0)} %` : '–'}</div>
        </div>
        <div className="rounded-2xl border border-line bg-panel-2 p-3">
          <div className="text-xs text-muted">palyginus abi puses</div>
          <div className="mt-1 text-2xl font-semibold text-accent">{compared && res.length ? `${fmt((same / res.length) * 100, 0)} %` : '?'}</div>
          <div className="text-xs text-muted">sutampa</div>
        </div>
      </div>
      <div className="flex gap-2 px-4 py-3">
        <Button primary small onClick={() => run(100)}>išmatuoti 100 porų</Button>
        <Button small onClick={() => setCompared(true)} disabled={!res.length}>palyginti</Button>
      </div>
      <Readout>{!res.length ? 'Pasirink kryptį ir matuok.' : !compared ? 'Kita pusė mato 50 ir 50, kad ir ką darytum. Jokios žinutės.' : 'Tik palyginus (įprastu ryšiu) matyti, kad tavo kryptis keičia sutapimų dalį.'}</Readout>
    </Panel>
  )
}
