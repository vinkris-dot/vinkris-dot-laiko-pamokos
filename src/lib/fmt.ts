/** Skaičius lietuviškai – su kableliu. */
export const fmt = (v: number, digits = 2) => v.toFixed(digits).replace('.', ',')
