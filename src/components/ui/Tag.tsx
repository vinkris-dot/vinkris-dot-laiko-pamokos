import { useState } from 'react'
import type { Tag as TagKind } from '../../data/types'

const STYLE: Record<TagKind, string> = {
  'įrodyta': 'bg-ok/15 text-ok border-ok/40',
  'hipotezė': 'bg-warn/15 text-warn border-warn/40',
  'spėjimas': 'bg-muted/15 text-muted border-muted/40',
  'mitas': 'bg-bad/15 text-bad border-bad/40',
}

export function Tag({ kind, why }: { kind: TagKind; why?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={() => why && setOpen(o => !o)}
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium leading-none ${STYLE[kind]}`}
        aria-expanded={open}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {kind}
        {why && <span className="ml-1 opacity-60">{open ? '▴' : '▾'}</span>}
      </button>
      {open && why && (
        <p className="mt-2 rounded-xl bg-panel-2 px-3 py-2 text-sm text-muted">{why}</p>
      )}
    </div>
  )
}
