import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/** Išskleidžiama teorijos dalis. Pastraipos antraštė – tekstas iki pirmo taško. */
export function Deeper({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="mt-4 rounded-2xl border border-line bg-panel">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span>
          <span className="font-medium">Giliau</span>
          <span className="ml-2 text-sm text-muted">istorija, priežastys, ribos · {paragraphs.length} dalys</span>
        </span>
        <span className="text-muted">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-4 border-t border-line px-4 py-4">
              {paragraphs.map((p, i) => {
                const dot = p.indexOf('. ')
                const head = dot > 0 && dot < 60 ? p.slice(0, dot) : null
                const body = head ? p.slice(dot + 2) : p
                return (
                  <p key={i}>
                    {head && <span className="font-medium">{head}. </span>}
                    {body}
                  </p>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
