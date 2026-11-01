import type { Lesson } from './types'

export const LESSON1: Lesson = {
  id: 1, slug: 'kvantai', title: 'Kvantai ir matavimas', subtitle: 'Kartojimas: laipteliai, du plyšiai, superpozicija, dekoherencija',
  minutes: 12, review: true, ready: true,
  sections: [
    {
      id: 'l1-laipteliai', title: 'Kvantai kaip laipteliai',
      text: ['Energija atome negali būti bet kokia – tik tam tikrų „laiptelių“ aukščio. Elektronas peršoka į aukštesnį laiptelį tik tada, kai gauna lygiai tiek energijos, kiek skiria laiptelius. Per mažai ar per daug – nieko nevyksta. Tokia porcija ir yra kvantas (quantum).', 'Slankikliu keisk fotono energiją ir pataikyk į laiptelių tarpą.'],
      tag: 'įrodyta', why: 'Diskretūs energijos lygmenys matomi atomų spektrų linijose – vienas pirmųjų ir tvirčiausių kvantinės fizikos įrodymų.',
      viz: 'energy-levels', seen: 'Atomas priima energiją tik porcijomis – iš to kilo pats žodis „kvantas“.', concepts: ['kvantas', 'energijos-lygmuo'],
    },
    {
      id: 'l1-plysiai', title: 'Dviejų plyšių eksperimentas',
      text: ['Dalelės leidžiamos po vieną pro dvi angas. Ekrane po daugelio dalelių išryškėja juostos – interferencija (interference), lyg kiekviena dalelė būtų banga, praėjusi pro abu plyšius vienu metu. Vos pastatai detektorių, kuris nustato, pro kurį plyšį dalelė praėjo, juostos dingsta ir lieka dvi dėmės.', 'Įjunk ir išjunk detektorių ir palygink, kas kaupiasi ekrane.'],
      tag: 'įrodyta', why: 'Eksperimentas atliktas su fotonais, elektronais, atomais ir net didelėmis molekulėmis; rezultatas visur tas pats.',
      viz: 'double-slit', seen: 'Kol kelio niekas „nežino“, dalelė elgiasi kaip banga; sužinojus kelią, juostos dingsta.', concepts: ['interferencija'],
    },
    {
      id: 'l1-superpozicija', title: 'Superpozicija',
      text: ['Kvantinė būsena gali būti dviejų galimybių derinys – superpozicija (superposition). Tai ne „nežinome, kuri“, o tikra būsena, kuri matuojant duoda vieną ar kitą rezultatą su tam tikra tikimybe. Rodyklė žemiau – tokia būsena: kuo arčiau viršaus, tuo dažniau gausi „0“.', 'Pasuk rodyklę ir matuok daug kartų – tikimybės pasirodys skaičiuose.'],
      tag: 'įrodyta', why: 'Superpozicija yra kvantinės mechanikos pagrindas, o jos pasekmės (interferencija, kvantiniai kompiuteriai) patvirtintos eksperimentais.',
      viz: 'superposition', seen: 'Superpozicija – viena būsena su dviem galimais atsakymais, o ne paslėptas atsakymas.', concepts: ['superpozicija'],
    },
    {
      id: 'l1-matavimas', title: 'Matavimas kaip sąveika',
      text: ['Kad pamatytum dalelę, turi į ją kažką pasiųsti – pavyzdžiui, šviesą. Bet šviesa dalelę stumteli. Kuo tikslesnė šviesa (trumpesnė banga), tuo stipresnis stumtelėjimas. Matavimas nėra pasyvus žvilgsnis – tai fizinė sąveika, kuri keičia tai, kas matuojama. Jokios sąmonės čia nereikia.', 'Keisk šviesos bangos ilgį ir žiūrėk, kaip keičiasi vietos tikslumas ir stumtelėjimas.'],
      tag: 'įrodyta', why: 'Tai Heizenbergo mikroskopo mintinis eksperimentas, o jo esmę – neapibrėžtumo sąryšį – patvirtina visi tikslūs matavimai.',
      viz: 'measurement-kick', seen: 'Matuoti – reiškia sąveikauti: tikslumas vienur perkamas trikdžiu kitur.', concepts: ['matavimas'],
    },
    {
      id: 'l1-dekoherencija', title: 'Dekoherencija',
      text: ['Kodėl kasdieniai daiktai nebūna superpozicijoje? Nes su jais nuolat susiduria aplinka: oro molekulės, šviesa, šiluma. Kiekvienas susidūrimas „sužino“ šiek tiek apie sistemą, ir interferencija nyksta. Tai dekoherencija (decoherence). Ji vyksta be jokio stebėtojo – užtenka aplinkos.', 'Didink aplinkos dalelių skaičių ir žiūrėk, kaip blunka juostos.'],
      tag: 'įrodyta', why: 'Dekoherencija išmatuota tiesiogiai, pavyzdžiui, Serge\'o Haroche\'o eksperimentuose (Nobelio premija 2012 m.).',
      viz: 'decoherence', seen: 'Kvantiškumas dingsta ne nuo žvilgsnio, o nuo aplinkos – ir labai greitai.', concepts: ['dekoherencija'],
    },
  ],
  quiz: [
    { id: 'l1-q1', q: 'Kas nutinka dviejų plyšių eksperimente, kai prie plyšio pastatomas detektorius?', options: ['Juostos tampa ryškesnės', 'Juostos dingsta, lieka dvi dėmės', 'Dalelės nebepraeina'], answer: 1, explain: 'Sužinojus kelią interferencija dingsta – dalelė elgiasi kaip dalelė, ne kaip banga.' },
    { id: 'l1-q2', q: 'Kas sukelia dekoherenciją?', options: ['Sąmoningas stebėtojas', 'Sąveika su aplinka', 'Per didelė energija'], answer: 1, explain: 'Užtenka oro molekulių ar šviesos – aplinka „sužino“ būseną ir interferencija nyksta.' },
    { id: 'l1-q3', q: 'Superpozicija reiškia, kad…', options: ['Nežinome, kurioje būsenoje dalelė yra', 'Dalelė yra tikroje dviejų galimybių derinio būsenoje', 'Dalelė yra dviejose vietose vienu metu kaip du daiktai'], answer: 1, explain: 'Tai viena būsena, kurios matavimas duoda skirtingus rezultatus su tikimybėmis – ir tai matyti interferencijoje.' },
  ],
}

export const LESSON2: Lesson = {
  id: 2, slug: 'susietumas', title: 'Susietumas', subtitle: 'Kartojimas: susietos dalelės, Belo nelygybė, nesignalizavimas, kriptografija',
  minutes: 12, review: true, ready: true,
  sections: [
    {
      id: 'l2-pora', title: 'Susietos dalelės',
      text: ['Dvi dalelės gali būti sukurtos taip, kad jų būsena aprašoma tik kartu – tai susietumas (entanglement). Išmatavus vieną, rezultatas atsitiktinis, bet kita visada duoda atitinkamą rezultatą, kad ir kaip toli būtų. Tai ne „iš anksto sutartos“ reikšmės – tai parodo kitas skyrius.', 'Matuok porą daug kartų ir stebėk: kiekvienas rezultatas atsitiktinis, bet pora visada sutampa.'],
      tag: 'įrodyta', why: 'Susietumas kuriamas ir matuojamas laboratorijose kasdien; 2022 m. Nobelio premija skirta už jo eksperimentus.',
      viz: 'entangled-pair', seen: 'Atskirai – grynas atsitiktinumas, kartu – tobula koreliacija.', concepts: ['koreliacija'],
    },
    {
      id: 'l2-belas', title: 'Belo nelygybė kaip žaidimas',
      text: ['Gal dalelės tiesiog iš anksto „susitaria“? Johnas Bellas parodė, kaip tai patikrinti. Žaidimas: du žaidėjai, atskirti vienas nuo kito, gauna po klausimą (0 arba 1) ir atsako (0 arba 1). Laimi, jei atsakymai sutampa, išskyrus atvejį, kai abu klausimai yra 1 – tada turi skirtis. Bet koks iš anksto sutartas planas laimi daugiausia 75 % kartų. Su susietomis dalelėmis – apie 85 %.', 'Sužaisk daug raundų abiem strategijomis ir palygink.'],
      tag: 'įrodyta', why: 'Belo nelygybės pažeidimas patvirtintas daugybėje eksperimentų, įskaitant 2015 m. „be spragų“ bandymus.',
      viz: 'bell-game', seen: 'Jokie iš anksto sutarti atsakymai neduoda daugiau nei 75 %; gamta duoda 85 % – vadinasi, sutarimo nėra.', concepts: ['belo-nelygybe'],
    },
    {
      id: 'l2-signalas', title: 'Kodėl tai ne telefonas',
      text: ['Jei matavimas čia akimirksniu „nulemia“ rezultatą ten, ar galima siųsti žinutes greičiau už šviesą? Ne. Kad ir ką darytum su savo dalele, kitos dalelės rezultatai lieka grynas atsitiktinumas – 50 ir 50. Koreliacija matoma tik sudėjus abiejų pusių rezultatus, o jiems sudėti reikia įprasto ryšio. Tai nesignalizavimas (no-signalling).', 'Keisk savo matavimo kryptį ir žiūrėk, ar kitos pusės statistika pasikeičia.'],
      tag: 'įrodyta', why: 'Nesignalizavimas išplaukia iš kvantinės mechanikos matematikos ir niekada nebuvo pažeistas eksperimente.',
      viz: 'no-signalling', seen: 'Susietumas neperduoda žinutės: kitas galas mato tik atsitiktinumą, kol nepalygina rezultatų.', concepts: ['nesignalizavimas'],
    },
    {
      id: 'l2-kriptografija', title: 'Kvantinė kriptografija',
      text: ['Tai, kad matavimas trikdo, galima panaudoti. Jei dvi pusės dalijasi raktu per fotonus, pasiklausytoja turi juos išmatuoti – ir palieka pėdsakus: dalis fotonų pasikeičia. Palyginusios dalį rakto, pusės pamato klaidas ir žino, kad kažkas klausėsi. Tai kvantinis raktų paskirstymas (quantum key distribution).', 'Įjunk pasiklausytoją ir pažiūrėk, kiek klaidų atsiranda.'],
      tag: 'įrodyta', why: 'Kvantinis raktų paskirstymas veikia komerciškai nuo 2000-ųjų, įskaitant palydovinius ryšius.',
      viz: 'qkd', seen: 'Fizika garantuoja, kad pasiklausymas palieka pėdsaką – to negali užtikrinti jokia matematika.', concepts: ['kvantine-kriptografija'],
    },
  ],
  quiz: [
    { id: 'l2-q1', q: 'Kiek daugiausia gali laimėti Belo žaidime su iš anksto sutartu planu?', options: ['50 %', '75 %', '100 %'], answer: 1, explain: 'Bet koks klasikinis planas duoda ne daugiau kaip 75 %. Susietos dalelės – apie 85 %, todėl „plano“ būti negali.' },
    { id: 'l2-q2', q: 'Ar susietumu galima perduoti žinutę greičiau už šviesą?', options: ['Taip, jei dalelės pakankamai susietos', 'Ne – kitas galas mato tik atsitiktinumą', 'Taip, bet tik vieną bitą'], answer: 1, explain: 'Koreliacija atsiranda tik palyginus rezultatus, o palyginimui reikia įprasto ryšio.' },
    { id: 'l2-q3', q: 'Kaip kvantinė kriptografija aptinka pasiklausytoją?', options: ['Pagal klaidas, kurias palieka jos matavimai', 'Pagal signalo vėlavimą', 'Pagal šifro sudėtingumą'], answer: 0, explain: 'Matavimas trikdo fotonus, tad dalis rakto pasikeičia ir pusės tai pamato.' },
  ],
}

export const LESSON3: Lesson = {
  id: 3, slug: 'laukas', title: 'Kvantinis laukas', subtitle: 'Kartojimas: dalelės kaip virpesiai, vakuumas, Kazimiro efektas, Higso laukas',
  minutes: 12, review: true, ready: true,
  sections: [
    {
      id: 'l3-virpesiai', title: 'Dalelės kaip laukų virpesiai',
      text: ['Šiuolaikinėje fizikoje pagrindinis dalykas – ne dalelė, o laukas (field): kažkas, kas užpildo visą erdvę. Elektronas yra elektronų lauko virpesys, fotonas – elektromagnetinio lauko virpesys. Dalelė – tai lauko „gumbas“, kuris gali keliauti.', 'Paliesk lauką ir pažiūrėk, kaip iš jo „iššoka“ dalelė.'],
      tag: 'įrodyta', why: 'Kvantinė laukų teorija – tiksliausiai patikrinta fizikos teorija; jos prognozės sutampa su matavimais iki dešimties skaitmenų.',
      viz: 'field-particle', seen: 'Dalelė – ne rutuliukas, o lauko virpesys, kurį galima sužadinti.', concepts: ['kvantinis-laukas'],
    },
    {
      id: 'l3-vakuumas', title: 'Vakuumas, kuris nėra tuščias',
      text: ['Net ir pašalinus visas daleles, laukas lieka – ir jis negali būti visiškai ramus. Kvantinė mechanika neleidžia nurimti: lauko žemiausia būsena vis dar virpa. Tai vadinama vakuumo fliuktuacijomis (vacuum fluctuations). Šie virpesiai matuojami – jie, pavyzdžiui, šiek tiek pakeičia atomų spektrus.', 'Priartink ir pažiūrėk: kuo mažesnis mastelis, tuo neramesnis vakuumas.'],
      tag: 'įrodyta', why: 'Vakuumo virpesių pasekmės (Lembo poslinkis, Kazimiro efektas) išmatuotos. Populiarus vaizdinys apie „iš nieko atsirandančias dalelių poras“ – tik iliustracija, ne tiesioginis stebėjimas.',
      viz: 'vacuum', seen: 'Tuščia erdvė virpa, ir tą virpėjimą galima išmatuoti.', concepts: ['vakuumas'],
    },
    {
      id: 'l3-kazimiras', title: 'Kazimiro efektas',
      text: ['Jei vakuumas virpa, tarp dviejų labai artimų metalinių plokštelių telpa tik tos bangos, kurios „įsitenka“ į tarpą. Išorėje bangų daugiau nei viduje – ir išorė plokšteles spaudžia viena prie kitos. Tai Kazimiro efektas (Casimir effect), išmatuotas laboratorijoje.', 'Artink plokšteles ir stebėk, kaip mažėja bangų tarp jų ir auga jėga.'],
      tag: 'įrodyta', why: 'Efektas numatytas 1948 m., tiksliai išmatuotas 1997 m. (Lamoreaux) ir vėliau daug kartų.',
      viz: 'casimir', seen: 'Vakuumas stumia: tarp plokštelių telpa mažiau bangų, todėl išorė nugali.', concepts: ['kazimiro-efektas'],
    },
    {
      id: 'l3-higsas', title: 'Higso laukas',
      text: ['Kodėl dalelės turi masę? Vienas laukas, Higso laukas (Higgs field), nėra nulinis net vakuume. Dalelės, kurios su juo sąveikauja, juda lyg per klampią terpę – jas sunkiau įgreitinti. Tą „sunkumą“ ir vadiname mase. Fotonas su Higso lauku nesąveikauja, todėl masės neturi ir juda šviesos greičiu.', 'Keisk sąveikos stiprumą ir stebėk, kaip dalelė greitėja.'],
      tag: 'įrodyta', why: 'Higso bozonas atrastas 2012 m. CERN. „Klampi terpė“ – analogija: Higso laukas nestabdo judančios dalelės, tik apsunkina jos įgreitinimą.',
      viz: 'higgs', seen: 'Masė – ne „medžiagos kiekis“, o tai, kaip stipriai dalelė kabinasi į Higso lauką.', concepts: ['higso-laukas'],
    },
  ],
  quiz: [
    { id: 'l3-q1', q: 'Kas, pagal kvantinę laukų teoriją, yra elektronas?', options: ['Mažas kietas rutuliukas', 'Elektronų lauko virpesys', 'Energijos porcija be vietos'], answer: 1, explain: 'Laukas užpildo erdvę, o dalelė yra jo sužadinimas, kuris gali keliauti.' },
    { id: 'l3-q2', q: 'Kodėl Kazimiro plokštelės traukiasi viena prie kitos?', options: ['Dėl gravitacijos', 'Nes tarp jų telpa mažiau vakuumo bangų nei išorėje', 'Dėl elektros krūvio'], answer: 1, explain: 'Išorėje bangų daugiau, jų spaudimas nugali – plokšteles stumia viena prie kitos.' },
    { id: 'l3-q3', q: 'Kodėl fotonas neturi masės?', options: ['Nes juda per greitai', 'Nes nesąveikauja su Higso lauku', 'Nes yra per mažas'], answer: 1, explain: 'Masė atsiranda iš sąveikos su Higso lauku. Fotonas su juo nesąveikauja.' },
  ],
}
