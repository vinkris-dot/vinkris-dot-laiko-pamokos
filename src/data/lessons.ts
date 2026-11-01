import type { Lesson } from './types'
import { LESSON4 } from './lesson4'
import { LESSON5 } from './lesson5'
import { LESSON6 } from './lesson6'
import { LESSON1, LESSON2, LESSON3 } from './lessons123'

export const LESSONS: Lesson[] = [
  LESSON1,
  LESSON2,
  LESSON3,
  LESSON4,
  LESSON5,
  LESSON6,
]

export const bySlug = (slug: string | undefined) => LESSONS.find(l => l.slug === slug)
export const byId = (id: number) => LESSONS.find(l => l.id === id)
