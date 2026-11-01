import type { Lesson } from './types'
import { LESSON4 } from './lesson4'
import { LESSON5 } from './lesson5'
import { LESSON6 } from './lesson6'

const soon = (id: number, slug: string, title: string, subtitle: string, review: boolean): Lesson => ({
  id, slug, title, subtitle, minutes: 15, review, ready: false, sections: [], quiz: [],
})

export const LESSONS: Lesson[] = [
  soon(1, 'kvantai', 'Kvantai ir matavimas', 'Laipteliai, du plyšiai, superpozicija, dekoherencija', true),
  soon(2, 'susietumas', 'Susietumas', 'Belo nelygybė, nesignalizavimas, kriptografija', true),
  soon(3, 'laukas', 'Kvantinis laukas', 'Dalelės kaip virpesiai, vakuumas, Higso laukas', true),
  LESSON4,
  LESSON5,
  LESSON6,
]

export const bySlug = (slug: string | undefined) => LESSONS.find(l => l.slug === slug)
export const byId = (id: number) => LESSONS.find(l => l.id === id)
