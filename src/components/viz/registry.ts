import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

type V = LazyExoticComponent<ComponentType>

export const VIZ: Record<string, V> = {
  'simultaneity': lazy(() => import('./l4/Simultaneity')),
  'block-universe': lazy(() => import('./l4/BlockUniverse')),
  'time-parameter': lazy(() => import('./l4/TimeParameter')),
  'wheeler-dewitt': lazy(() => import('./l4/WheelerDeWitt')),
  'page-wootters': lazy(() => import('./l4/PageWootters')),
  'entropy-box': lazy(() => import('./l4/EntropyBox')),
  'memory-sand': lazy(() => import('./l4/MemorySand')),
  'myths-time': lazy(() => import('./l4/MythsTime')),
}
