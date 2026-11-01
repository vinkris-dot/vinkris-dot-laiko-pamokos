import { useState } from 'react'
import type { Formula as F } from '../../data/types'

export function Formula({ f }: { f: F }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="rounded-full border border-line px-3 py-1 text-sm text-muted active:bg-panel-2"
      >
        {open ? 'slėpti formulę' : 'parodyti formulę'}
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-line bg-panel px-4 py-3">
          <div className="font-mono text-lg tracking-wide">{f.text}</div>
          <p className="mt-1 text-sm text-muted">{f.note}</p>
        </div>
      )}
    </div>
  )
}
