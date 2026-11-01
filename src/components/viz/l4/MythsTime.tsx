import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tag } from '../../ui/Tag'

const MYTHS = [
  {
    claim: '„Laiko nėra – fizika tai įrodė.“',
    real: 'Wheelerio ir DeWitto lygtyje laiko parametro tikrai nėra, o reliatyvumas neigia bendrą „dabar“.',
    fake: 'Lygtis – neišspręsta hipotezė, o ne įrodymas. Be to, net joje kitimas gali atsirasti iš vidaus (Page ir Wootters). Kasdienis laikas, senėjimas ir priežastingumas niekur nedingsta.',
    origin: 'Iš populiarių knygų, kuriose subtilus „laikas nėra fundamentalus“ sutrumpintas iki „laiko nėra“.',
  },
  {
    claim: '„Stebėtojas sukuria tikrovę.“',
    real: 'Matavimas kvantinėje mechanikoje keičia sistemos būseną, ir rezultatas iš anksto nenulemtas.',
    fake: 'Matavimas – fizinė sąveika su prietaisu ar aplinka (dekoherencija, 1 pamoka), o ne sąmonės veiksmas. Akmuo ar fotonas „stebi“ taip pat gerai kaip žmogus.',
    origin: 'Iš ankstyvų Kopenhagos interpretacijos formuluočių su žodžiu „stebėtojas“, kurį ezoterika perskaitė pažodžiui.',
  },
  {
    claim: '„Ateitis jau egzistuoja, todėl viskas nulemta.“',
    real: 'Blokinėje visatoje ateities įvykiai yra tokia pat erdvėlaikio dalis kaip praeities.',
    fake: 'Blokinė visata – interpretacija, ne įrodymas. Ir net joje kvantiniai rezultatai lieka atsitiktiniai: „egzistuoja“ nereiškia „buvo galima numatyti“.',
    origin: 'Iš reliatyvumo populiarinimo, kuriame erdvėlaikio geometrija sumaišyta su likimu.',
  },
]

export default function MythsTime() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="my-4 space-y-3">
      {MYTHS.map((m, i) => (
        <button key={i} type="button" onClick={() => setOpen(open === i ? null : i)}
          className="block w-full rounded-2xl border border-line bg-panel px-4 py-3 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium leading-snug">{m.claim}</span>
            <span className="text-muted">{open === i ? '−' : '+'}</span>
          </div>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-3 space-y-3 text-sm">
                  <div><Tag kind="mitas" /></div>
                  <p><span className="font-medium text-ok">Kas tikra. </span>{m.real}</p>
                  <p><span className="font-medium text-bad">Kas ne. </span>{m.fake}</p>
                  <p className="text-muted"><span className="font-medium">Iš kur kilo. </span>{m.origin}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  )
}
