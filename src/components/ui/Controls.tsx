import type { ReactNode } from 'react'

export function Slider({ label, value, min, max, step = 0.01, onChange, format }: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (v: number) => void; format?: (v: number) => string
}) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-fg">{format ? format(value) : value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </label>
  )
}

export function Button({ children, onClick, primary, disabled, small }: {
  children: ReactNode; onClick?: () => void; primary?: boolean; disabled?: boolean; small?: boolean
}) {
  const base = small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5'
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`rounded-full font-medium transition active:scale-95 disabled:opacity-40 ${base} ${
        primary ? 'bg-accent text-white' : 'border border-line bg-panel text-fg'
      }`}>
      {children}
    </button>
  )
}

export function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} aria-pressed={on}
      className="flex items-center gap-3 rounded-full border border-line bg-panel px-3 py-2 text-sm">
      <span className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-accent' : 'bg-line'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? 'left-5.5' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

export function Panel({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-line bg-panel">
      {children}
      {caption && <p className="border-t border-line px-4 py-2 text-sm text-muted">{caption}</p>}
    </div>
  )
}

export function Readout({ children }: { children: ReactNode }) {
  return <div className="px-4 pb-3 text-center text-sm text-muted min-h-[2.2em]">{children}</div>
}
