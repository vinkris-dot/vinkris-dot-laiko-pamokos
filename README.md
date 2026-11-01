# Laiko pamokos

Interaktyvus vaizdinis kursas apie kvantinę fiziką, laiką, prognozuojančias smegenis ir laiko biochemiją. Vienas statinis tinklalapis, pritaikytas telefonui (390 px), be serverio ir be paskyrų.

## Paleisti vietoje

```bash
npm install
npm run dev
```

## Sukurti ir įkelti

```bash
npm run build      # rezultatas – dist/
```

`main` šakos pakeitimai automatiškai įkeliami į GitHub Pages (žr. `.github/workflows/deploy.yml`). Repozitorijos nustatymuose **Settings → Pages → Source** turi būti „GitHub Actions“.

## Sandara

- `src/data/` – pamokų turinys (tekstai, žymės, klausimai), sąvokos, skaitiniai.
- `src/components/viz/` – interaktyvios vizualizacijos (po vieną failą skyriui); `registry.ts` sieja skyriaus raktą su komponentu.
- `src/pages/` – pradžia, pamoka, pasitikrinimas, sąvokos, mintys, skaitiniai.
- `src/lib/` – progreso saugykla (`localStorage`), drobės kablys, formatavimas.

Žymės prie teiginių: `įrodyta` / `hipotezė` / `spėjimas` / `mitas`.
