/**
 * App-Icons erzeugen — ohne externe Werkzeuge.
 *
 * Auf dem Zielrechner ist weder ImageMagick noch rsvg-convert installiert,
 * und `sips` kann kein SVG rastern. Deshalb ein minimaler PNG-Encoder auf
 * Basis von zlib, das in Node eingebaut ist.
 *
 *   node scripts/make-icons.mjs
 *
 * Motiv: Ring mit Kern und vier Marken — der Verstellring der Mühle,
 * abstrahiert. Farben: Pantone 476 C auf 7401 C.
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const BG = [78, 54, 41]     // Pantone 476 C — Espressobraun
const FG = [245, 225, 164]  // Pantone 7401 C — Creme

const crcTable = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
const crc32 = (buf) => {
  let c = -1
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}

function png(size, draw) {
  const px = Buffer.alloc(size * size * 4)
  draw((x, y, r, g, b, a = 255) => {
    const i = (y * size + x) * 4
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a
  })
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function icon(size, maskable) {
  // Maskable braucht mehr Rand: iOS und Android beschneiden das Icon.
  const pad = maskable ? size * 0.18 : size * 0.08
  const cx = size / 2, cy = size / 2
  const R = (size - 2 * pad) / 2
  const ringR = R * 0.82, ringW = Math.max(2, size * 0.055)
  const coreR = R * 0.3
  const tickIn = R * 0.94, tickOut = R * 1.0
  return png(size, (set) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        set(x, y, BG[0], BG[1], BG[2])
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy
        const d = Math.hypot(dx, dy)
        let on = false
        if (Math.abs(d - ringR) < ringW / 2) on = true
        if (d < coreR) on = true
        if (d > tickIn && d < tickOut * 1.02) {
          const a = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 90
          if (a < 7 || a > 83) on = true
        }
        if (on) set(x, y, FG[0], FG[1], FG[2])
      }
    }
  })
}

writeFileSync('public/icon-192.png', icon(192, false))
writeFileSync('public/icon-512.png', icon(512, false))
writeFileSync('public/icon-maskable-512.png', icon(512, true))
writeFileSync('public/apple-touch-icon.png', icon(180, false))
console.log('Icons erzeugt: 192, 512, maskable-512, apple-touch-180')
