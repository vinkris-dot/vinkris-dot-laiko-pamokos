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
  'delay-chain': lazy(() => import('./l5/DelayChain')),
  'prediction-loop': lazy(() => import('./l5/PredictionLoop')),
  'illusions': lazy(() => import('./l5/Illusions')),
  'emotion-timeline': lazy(() => import('./l5/EmotionTimeline')),
  'two-hypotheses': lazy(() => import('./l5/TwoHypotheses')),
  'free-energy': lazy(() => import('./l5/FreeEnergy')),
  'circadian-loop': lazy(() => import('./l6/CircadianLoop')),
  'light-phase': lazy(() => import('./l6/LightPhase')),
  'cycle-28': lazy(() => import('./l6/Cycle28')),
  'epigenetics': lazy(() => import('./l6/Epigenetics')),
  'three-clocks': lazy(() => import('./l6/ThreeClocks')),
}
