import type { Lesson } from './types'
import { LESSON4 } from './lesson4'

const soon = (id: number, slug: string, title: string, subtitle: string, review: boolean): Lesson => ({
  id, slug, title, subtitle, minutes: 15, review, ready: false, sections: [], quiz: [],
})

export const LESSONS: Lesson[] = [
  soon(1, 'kvantai', 'Kvantai ir matavimas', 'Laipteliai, du plyšiai, superpozicija, dekoherencija', true),
  soon(2, 'susietumas', 'Susietumas', 'Belo nelygybė, nesignalizavimas, kriptografija', true),
  soon(3, 'laukas', 'Kvantinis laukas', 'Dalelės kaip virpesiai, vakuumas, Higso laukas', true),
  LESSON4,
  soon(5, 'smegenys', 'Prognozuojančios smegenys', 'Vėlavimas, prognozė, paklaida, kontroliuojama haliucinacija', false),
  soon(6, 'biochemija', 'Laiko biochemija', 'Cirkadinis laikrodis, ciklai, epigenetika', false),
]

export const bySlug = (slug: string | undefined) => LESSONS.find(l => l.slug === slug)
export const byId = (id: number) => LESSONS.find(l => l.id === id)
