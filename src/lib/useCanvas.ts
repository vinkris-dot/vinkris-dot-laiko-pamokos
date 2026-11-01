import { useEffect, useRef } from 'react'

export type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => void

/**
 * Drobė, kuri pati prisitaiko prie pločio ir ekrano tankio ir piešia kiekvieną kadrą.
 * draw gauna plotį ir aukštį CSS pikseliais; t – sekundės nuo pradžios, dt – nuo paskutinio kadro.
 */
export function useCanvas(draw: DrawFn, height: number, running = true) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)

    let raf = 0
    const start = performance.now()
    let last = start
    const frame = (now: number) => {
      const t = (now - start) / 1000
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, height)
      drawRef.current(ctx, w, height, t, dt)
      if (running) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [height, running])

  return ref
}

/** Spalvos iš CSS kintamųjų – kad drobė sektų temą. */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'
}
