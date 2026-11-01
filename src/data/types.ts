export type Tag = 'įrodyta' | 'hipotezė' | 'spėjimas' | 'mitas'

export interface Formula {
  /** Kaip formulė užrašoma (paprastu tekstu, be LaTeX) */
  text: string
  /** Vienas sakinys, ką ji sako */
  note: string
}

export interface Section {
  id: string
  title: string
  /** 1–3 pastraipos, iš viso ≤ 120 žodžių */
  text: string[]
  tag: Tag
  /** Paaiškinimas, kodėl tokia žymė (rodomas paspaudus žymę) */
  why: string
  /** Vizualizacijos raktas (žr. components/viz/registry) */
  viz: string
  /** Vienas sakinys „ką čia pamatei“ */
  seen: string
  concepts: string[]
  formula?: Formula
}

export interface Question {
  id: string
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface Lesson {
  id: number
  slug: string
  title: string
  subtitle: string
  minutes: number
  review: boolean
  ready: boolean
  sections: Section[]
  quiz: Question[]
}

export interface Concept {
  id: string
  term: string
  en?: string
  short: string
  lesson: number
  /** skyriaus eilės numeris pamokoje (nuo 1) */
  section: number
}

export interface Reading {
  group: string
  author: string
  title: string
  year: string
  note: string
  lesson: number
  url?: string
}
