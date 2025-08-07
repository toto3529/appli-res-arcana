export const generateUUID = (): string => {
  const hex = [...Array(256).keys()].map((i) => i.toString(16).padStart(2, "0"))
  const r = cryptoLikeRandomBytes(16)

  r[6] = (r[6] & 0x0f) | 0x40 // version 4
  r[8] = (r[8] & 0x3f) | 0x80 // variant 10

  return (
    hex[r[0]] +
    hex[r[1]] +
    hex[r[2]] +
    hex[r[3]] +
    "-" +
    hex[r[4]] +
    hex[r[5]] +
    "-" +
    hex[r[6]] +
    hex[r[7]] +
    "-" +
    hex[r[8]] +
    hex[r[9]] +
    "-" +
    hex[r[10]] +
    hex[r[11]] +
    hex[r[12]] +
    hex[r[13]] +
    hex[r[14]] +
    hex[r[15]]
  )
}

// Générateur random fallback 100% JS
function cryptoLikeRandomBytes(length: number): number[] {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(Math.floor(Math.random() * 256))
  }
  return result
}
