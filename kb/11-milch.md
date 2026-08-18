# 11 — Milch

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Milch ist kein Zusatz, sondern ein zweiter Hauptbestandteil mit eigener
Chemie, eigenen Grenzwerten und eigenen Fehlerbildern.

---

## 1. Zusammensetzung (Vollmilch, 3,5 % Fett) 🟢

| Bestandteil | Anteil | Rolle im Kaffee |
| ----------- | ------ | --------------- |
| Wasser | ~87,5 % | Träger |
| **Laktose** | ~4,7 % | **Süße** — der Hauptgrund, warum Milchkaffee süß schmeckt |
| **Protein** | ~3,3 % | **Schaumstabilität** (80 % Casein, 20 % Molkenprotein) |
| **Fett** | ~3,5 % | **Mundgefühl**, Cremigkeit, Aromaträger |
| Mineralstoffe | ~0,7 % | – |

### 1.1 Wer macht was

**Molkenproteine** (v. a. β-Lactoglobulin) denaturieren an der
Luft-Wasser-Grenzfläche und bilden dort einen elastischen Film um jede
Luftblase. **Das ist der eigentliche Schaummechanismus.**

**Casein-Mizellen** stabilisieren zusätzlich und geben dem Schaum Substanz.

**Fett** ist zwiespältig: Es liefert Cremigkeit und Mundgefühl, wirkt aber
gegenüber dem Proteinfilm leicht destabilisierend. Deshalb schäumt Magermilch
*mehr* (höheres Volumen), aber der Schaum ist trocken, grob und zerfällt
schneller. Vollmilch ergibt weniger Volumen, dafür feineren, glänzenderen,
länger stabilen Schaum.

> **Für Latte Art ist Vollmilch das richtige Werkzeug.** Für maximale
> Schaumhöhe (z. B. klassischer Cappuccino nach alter Schule) Magermilch.

**Laktose** ist nur etwa 1/5 so süß wie Saccharose, aber die wahrgenommene
Süße steigt mit der Temperatur bis etwa 60 °C stark an — deshalb schmeckt
richtig temperierte Milch deutlich süßer als kalte.

---

## 2. Temperatur — die harten Grenzen 🟢

| Temperatur | Was passiert |
| ---------- | ------------ |
| < 40 °C | wirkt lauwarm, Süße noch nicht entwickelt |
| 50–55 °C | untere Grenze für ein warmes Getränk |
| **55–62 °C** | **Süße-Optimum.** Laktose maximal wahrnehmbar, Aromatik intakt |
| 62–68 °C | akzeptabel, Süße beginnt zu kippen |
| **> 70 °C** | **Molkenproteine denaturieren irreversibel.** Schwefelnoten („gekochte Milch"), Schaum kollabiert, Süße verschwindet |
| > 80 °C | Maillard-Reaktion in der Milch, deutlich „verbrannt" |

**Zielwert: 60 °C** (±5). Die App muss oberhalb 68 °C warnen.

**Praxis:** Die Hand am Kännchen ist ein zuverlässiger Sensor —
bei ca. 60 °C wird es unangenehm heiß zu halten. Wer bis zum Loslassen
wartet, ist bei ~65 °C und damit noch im Rahmen. Wer länger hält, hat sie
verbrannt.

**Nachheizen:** Milch, die einmal über 70 °C war, lässt sich nicht retten und
sollte nicht erneut aufgeschäumt werden — die Proteine sind verbraucht.

---

## 3. Die Massenzunahme durch Dampf (F-19) 🟢

Beim Aufschäumen kondensiert Dampf **in** der Milch. Sie wird dabei nicht nur
wärmer, sondern schwerer und dünner.

$$ \frac{m_{steam}}{m_{milk}} = \frac{c_{milk}\cdot\Delta T}{h_{fg}+c_w(100-T_{final})} $$

**Beispiel:** 150 g Milch, 4 °C → 60 °C
→ +9,0 % = **+13,5 g Wasser** → 163,5 g texturierte Milch.

Bei realem (leicht feuchtem) Maschinendampf eher **10–13 %** 🟡.

**Konsequenzen, die kaum jemand einrechnet:**
1. Der Kaffee-Milch-Ratio verschiebt sich um ~10 % zugunsten der Milch.
2. Rezepte müssen auf die **finale** Milchmasse gerechnet werden.
3. Wer 150 g in die Kanne gießt, hat am Ende ~164 g im Getränk.

**App-Regel:** In `MilkSpec` zwei Felder führen —
`milkStartG` (einzufüllen) und `milkFinalG` (berechnet nach F-19).
Die Getränke-Rezepturen in kb/12 beziehen sich auf `milkFinalG`.

---

## 4. Texturieren (Aufschäumen)

### 4.1 Die zwei Phasen

```
PHASE 1 — STRETCHING (Luft einziehen)
  Dampfdüse knapp unter der Oberfläche
  Hörbar: gleichmäßiges „Tschhh", KEIN lautes Kreischen
  Dauer: bis ca. 37 °C (Handwärme — man spürt die Grenze)
  Hier und NUR hier entsteht das Volumen

PHASE 2 — TEXTURING / ROLLING (Wirbel)
  Düse tiefer eintauchen, seitlich versetzt
  Ein stabiler Wirbel (Whirlpool) zieht die Blasen nach unten
  Keine Luft mehr, nur noch Zerkleinern und Einarbeiten
  Bis 60 °C
```

**Der häufigste Fehler:** Zu lange in Phase 1 bleiben → zu viel Luft →
steifer, trockener, blasiger Schaum, der sich vom Getränk trennt. Die Luft
muss **früh** und **schnell** rein, danach nur noch rollen.

**Der zweithäufigste:** Kein sauberer Wirbel in Phase 2. Ohne Wirbel bleiben
große Blasen erhalten — der Schaum wird nie glänzend.

### 4.2 Zielergebnis: Microfoam

| Merkmal | ✅ richtig | ❌ falsch |
| ------- | --------- | -------- |
| Optik | glänzend, wie nasse Farbe | matt, blasig |
| Blasen | mit bloßem Auge nicht erkennbar | sichtbar |
| Bewegung | fließt als eine Einheit, wellt sich | Schaum sitzt obenauf und rutscht |
| Klopfprobe | keine großen Blasen an der Oberfläche | Blasen steigen auf |

**Nach dem Schäumen:** Kännchen 1–2× auf die Arbeitsfläche klopfen (große
Blasen zerstören), dann **schwenken bis glänzend**. Zügig eingießen — Schaum
und Milch trennen sich innerhalb von ~30 s wieder.

### 4.3 Overrun (Volumenzunahme) 🟡

$$ \text{Overrun} = \frac{V_{final}-V_{start}}{V_{start}} $$

| Getränk | Overrun | Schaumhöhe im Glas |
| ------- | ------- | ------------------ |
| Cortado / Piccolo | 5–10 % | ~0,3 cm |
| **Flat White** | **10–20 %** | **0,5–1 cm** |
| Latte | 20–30 % | ~1 cm |
| **Cappuccino** | **50–80 %** | **1,5–2 cm** |
| Macchiato-Haube | 80–100 % | – |

**Das ist der einzige echte Unterschied zwischen Flat White, Latte und
Cappuccino** — neben der Menge. Nicht die Bohne, nicht der Shot, nicht die
Tasse. Nur wie viel Luft in der Milch ist.

### 4.4 Hygiene

Nach **jedem** Aufschäumen: Lanze abwischen und einen Stoß abblasen. Antrocknende
Milchreste sind ein Nährboden und übertragen Fehlaromen in den nächsten Drink.
Das ist keine Kosmetik — angetrocknete Milch in der Düse ist geschmacklich
sofort wahrnehmbar.

---

## 5. Pflanzliche Alternativen

| Milch | Schäumt | Geschmack | Gerinnungsrisiko | Bemerkung |
| ----- | ------- | --------- | ---------------- | --------- |
| **Hafer (Barista)** | ⭐⭐⭐ | neutral-süß, getreidig | niedrig | Die beste Alternative. Enthält zugesetzte Fette und Emulgatoren (oft Rapsöl, Dikaliumphosphat) für Stabilität |
| Hafer (Standard) | ⭐ | süßlich | mittel | ohne Barista-Formulierung meist ungeeignet |
| **Soja (Barista)** | ⭐⭐⭐ | bohnig, kräftig | **hoch** | proteinreich → schäumt sehr gut, gerinnt aber bei Säure + Hitze |
| Mandel (Barista) | ⭐⭐ | nussig, dünn | mittel | wenig Protein → instabiler Schaum |
| Kokos | ⭐ | dominant | mittel | überdeckt den Kaffee |
| Erbse | ⭐⭐⭐ | neutral | niedrig | proteinreich, unterschätzt |
| **Laktosefreie Kuhmilch** | ⭐⭐⭐ | **süßer** | niedrig | Laktose ist gespalten → Glucose + Galactose schmecken deutlich süßer |

### 5.1 Gerinnen (Curdling) verhindern

**Mechanismus:** Kaffeesäure senkt den pH-Wert. Nähert er sich dem
isoelektrischen Punkt der Proteine, flocken diese aus. Hitze beschleunigt das.
Bei Sojamilch ist der Effekt am stärksten.

**Gegenmaßnahmen (nach Wirksamkeit):**
1. Barista-Version verwenden (pH-gepuffert)
2. Milch **nicht über 60 °C** erhitzen
3. **Milch in den Kaffee gießen, nicht umgekehrt** — der pH-Schock ist geringer
4. Bei sehr säurebetonten Kaffees (Kenia, helle Äthiopier) mildere Bohne wählen
5. Milch nicht zu lange stehen lassen, bevor sie auf den Shot trifft

### 5.2 Temperaturbesonderheiten

Pflanzliche Milch verträgt Hitze schlechter als Kuhmilch. Hafermilch wird
über ~65 °C dünn und wässrig, weil die Stärke-/Fettemulsion bricht.
**Zielwert für Hafer: 55–60 °C**, also 5 °C niedriger als bei Kuhmilch.

---

## 6. Latte Art (Kurzfassung)

Voraussetzungen — in dieser Reihenfolge:
1. **Microfoam** (nicht verhandelbar; alles andere ist zweitrangig)
2. **Stabile Crema** auf dem Shot (Bohne 5–25 Tage alt)
3. **Zügig eingießen**, bevor sich Schaum und Milch trennen
4. Tasse geneigt, aus der Höhe beginnen (Milch taucht unter die Crema)
5. Auf ~1/2 bis 2/3 Füllstand tief herangehen und den Schaum aufschwimmen lassen
6. Zum Abschluss durchziehen

**Diagnose:** Wenn kein Muster entsteht, liegt es fast nie an der Gießtechnik,
sondern an der Milchtextur. Zu steifer Schaum sitzt obenauf und lässt sich
nicht bewegen; zu dünner sinkt ein und hinterlässt nichts.

---

## 7. Für die App

### `MilkSpec`

```ts
interface MilkSpec {
  milkType: MilkType
  milkStartG: number       // eingefüllt
  milkFinalG: number       // berechnet, F-19
  startTempC: number       // Default 4
  targetTempC: number      // Default 60 (Hafer: 57)
  foamClass: FoamClass
  overrunPct: number       // aus foamClass abgeleitet
}
```

### Berechnung

```js
milkFinalG = milkStartG * (1 + steamCondensateRatio(startTempC, targetTempC))
foamVolumeMl = milkFinalG * (overrunPct / 100)
```

### Warnregeln

```
targetTempC > 68            → „Milch verbrennt, Süße geht verloren"
targetTempC > 62 && oat     → „Hafermilch wird über 62 °C dünn"
milkType = soy && beanAcidityHigh && targetTempC > 60
                            → „Gerinnungsrisiko: Temperatur senken, Milch in den Kaffee gießen"
foamClass = stiff && drink ∈ {flatWhite, cortado}
                            → „Zu viel Luft für dieses Getränk"
```

### Was die App leisten kann, was ein Buch nicht kann

Aus `glassMl` und `drinkTypeId` rückwärts die **einzufüllende** Milchmenge
berechnen — unter Berücksichtigung von Overrun (§4.3) und Dampfkondensat
(F-19). Das ist eine dreistufige Rechnung, die im Alltag niemand im Kopf macht,
und sie ist der Grund, warum selbstgemachte Flat Whites regelmäßig
überlaufen oder halbleer bleiben:

```
gewünschtes Getränkevolumen (ml)
  − Espressovolumen
  = benötigtes Milchvolumen final (inkl. Schaum)
  ÷ (1 + overrun)
  = benötigtes Milchvolumen flüssig final
  ÷ (1 + steamCondensate)
  = einzufüllende Milchmenge  ← das sucht der Nutzer
```
