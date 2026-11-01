import type { Concept } from './types'

export const CONCEPTS: Concept[] = [
  // 4 pamoka
  { id: 'vienalaikiskumas', term: 'Vienalaikiškumo reliatyvumas', en: 'relativity of simultaneity', short: 'Ar du įvykiai vyksta vienu metu, priklauso nuo stebėtojo greičio. Bendro „dabar“ visiems nėra.', lesson: 4, section: 1 },
  { id: 'erdvelaikis', term: 'Erdvėlaikis', en: 'spacetime', short: 'Erdvė ir laikas kaip vienas keturmatis darinys, kurį skirtingi stebėtojai pjauna skirtingai.', lesson: 4, section: 1 },
  { id: 'blokine-visata', term: 'Blokinė visata', en: 'block universe', short: 'Interpretacija, pagal kurią praeitis, dabartis ir ateitis egzistuoja vienodai, kaip vienas kūnas.', lesson: 4, section: 2 },
  { id: 'pasaulio-linija', term: 'Pasaulio linija', en: 'world line', short: 'Daikto kelias per erdvėlaikį: ne taškas, o gija per visas akimirkas.', lesson: 4, section: 2 },
  { id: 'bangos-funkcija', term: 'Bangos funkcija', en: 'wave function', short: 'Kvantinės sistemos aprašas, iš kurio gaunamos matavimo rezultatų tikimybės.', lesson: 4, section: 3 },
  { id: 'laikas-parametras', term: 'Laikas kaip parametras', en: 'time as a parameter', short: 'Kvantinėje mechanikoje laikas nėra matuojamas dydis – tai išorinė rankenėlė lygtyje.', lesson: 4, section: 3 },
  { id: 'wheeler-dewitt', term: 'Wheelerio ir DeWitto lygtis', en: 'Wheeler–DeWitt equation', short: 'Kvantinės gravitacijos lygtis visai visatai, kurioje laiko nėra. Hipotezė.', lesson: 4, section: 4 },
  { id: 'laiko-problema', term: 'Laiko problema', en: 'problem of time', short: 'Nesutarimas tarp kvantinės mechanikos (laikas – parametras) ir reliatyvumo (laikas – matmuo).', lesson: 4, section: 4 },
  { id: 'page-wootters', term: 'Page\'o ir Wootterso mechanizmas', en: 'Page–Wootters mechanism', short: 'Idėja, kad laikas atsiranda iš susietumo tarp laikrodžio ir likusios sistemos. Hipotezė.', lesson: 4, section: 5 },
  { id: 'susietumas', term: 'Susietumas', en: 'entanglement', short: 'Dviejų dalių būsena, kurios negalima aprašyti atskirai: matuojant vieną, žinai ir kitą.', lesson: 4, section: 5 },
  { id: 'entropija', term: 'Entropija', en: 'entropy', short: 'Mato, kiek daug mikroskopinių išsidėstymų atitinka tai, ką matome. Netvarkai jų daug, tvarkai – mažai.', lesson: 4, section: 6 },
  { id: 'laiko-strele', term: 'Laiko strėlė', en: 'arrow of time', short: 'Laiko kryptis, kurią nustato entropijos augimas, nors pagrindiniai dėsniai krypties neturi.', lesson: 4, section: 6 },
  { id: 'griztamumas', term: 'Mikroskopinis grįžtamumas', en: 'microscopic reversibility', short: 'Kiekvieną dalelių judesį galima atsukti atgal – dėsniai to nedraudžia.', lesson: 4, section: 6 },
  { id: 'praeities-hipoteze', term: 'Praeities hipotezė', en: 'past hypothesis', short: 'Prielaida, kad visata prasidėjo nuo labai mažos entropijos. Iš jos išplaukia laiko kryptis ir atmintis.', lesson: 4, section: 7 },
  { id: 'irasas', term: 'Įrašas (pėdsakas)', en: 'record', short: 'Fizinis praeities pėdsakas dabartyje. Galimas tik ta kryptimi, kuria auga entropija.', lesson: 4, section: 7 },
  { id: 'stebetojo-mitas', term: '„Stebėtojas sukuria tikrovę“', en: 'observer effect (popular)', short: 'Populiarus iškraipymas: matavimas yra fizinė sąveika, o ne sąmonės poveikis. Mitas.', lesson: 4, section: 8 },
]
