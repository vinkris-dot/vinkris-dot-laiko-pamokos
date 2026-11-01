import type { Reading } from './types'

export const READINGS: Reading[] = [
  { group: 'Laikas fizikoje', author: 'Carlo Rovelli', title: 'The Order of Time', year: '2018', note: 'Kvantinės gravitacijos fizikas apie tai, kaip laikas „išnyksta“ ir iš kur atsiranda.', lesson: 4 },
  { group: 'Laikas fizikoje', author: 'Sean Carroll', title: 'From Eternity to Here', year: '2010', note: 'Entropija ir laiko strėlė, išsamiau ir griežčiau.', lesson: 4 },
  { group: 'Prognozuojančios smegenys', author: 'Anil Seth', title: 'Being You', year: '2021', note: 'Sąmonė kaip „kontroliuojama haliucinacija“; geriausia įžanga.', lesson: 5 },
  { group: 'Prognozuojančios smegenys', author: 'Lisa Feldman Barrett', title: 'How Emotions Are Made', year: '2017', note: 'Emocijos kaip smegenų prognozės, ne reakcijos.', lesson: 5 },
  { group: 'Prognozuojančios smegenys', author: 'Andy Clark', title: 'The Experience Machine', year: '2023', note: 'Prognozuojančių smegenų filosofija, platesnis vaizdas.', lesson: 5 },
  { group: 'Laiko biochemija', author: 'Till Roenneberg', title: 'Internal Time', year: '2012', note: 'Chronobiologijos klasika: vidiniai laikrodžiai ir chronotipai.', lesson: 6 },
  { group: 'Laiko biochemija', author: 'Russell Foster', title: 'Life Time', year: '2022', note: 'Naujesnė, praktiškesnė.', lesson: 6 },
  { group: 'Laiko biochemija', author: 'Nessa Carey', title: 'The Epigenetics Revolution', year: '2012', note: 'Kaip patirtis įsirašo į genų skaitymą; sąžininga dėl to, kas įrodyta.', lesson: 6 },
  { group: 'Pirminiai šaltiniai', author: 'Don Page, William Wootters', title: '„Evolution without evolution: Dynamics described by stationary observables“', year: 'Physical Review D 27, 2885 (1983)', note: 'Straipsnis, iš kurio kilo mintis apie laiką iš susietumo.', lesson: 4, url: 'https://doi.org/10.1103/PhysRevD.27.2885' },
  { group: 'Pirminiai šaltiniai', author: 'Karl Friston', title: '„The free-energy principle: a unified brain theory?“', year: 'Nature Reviews Neuroscience 11, 127–138 (2010)', note: 'Laisvosios energijos principo apžvalga iš pirmų lūpų.', lesson: 5, url: 'https://doi.org/10.1038/nrn2787' },
  { group: 'Pirminiai šaltiniai', author: 'Nobelio komitetas', title: '2017 m. fiziologijos ir medicinos premija (Hall, Rosbash, Young)', year: '2017', note: 'Premijos aprašas apie cirkadinio laikrodžio molekulinį mechanizmą.', lesson: 6, url: 'https://www.nobelprize.org/prizes/medicine/2017/press-release/' },
]

export const READING_ORDER = 'Rekomenduojama skaitymo tvarka pradedančiajai: Rovelli → Seth → Roenneberg.'
