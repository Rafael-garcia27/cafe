# 13 — Iced und Cold

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Kalte Zubereitungen sind kein Anhang, sondern ein eigenes Regelwerk: Kälte
verändert die **Wahrnehmung** (Süße und Aroma sinken, Bitterkeit tritt hervor)
und Eis verändert die **Masse** (Verdünnung durch Schmelzwasser).

**Zwei Grundprinzipien, die alles Folgende erklären:**

1. **Kalt gebrüht ≠ kalt getrunken.** Cold Brew und Flash Chill sind zwei
   völlig verschiedene Getränke mit verschiedener Chemie.
2. **Jedes Iced-Rezept muss konzentrierter gebrüht werden**, weil Schmelzwasser
   verdünnt und Kälte die Wahrnehmung dämpft.

---

## 1. Die zwei Wege zu kaltem Kaffee

| | **Flash Chill / Japanese Iced** | **Cold Brew** |
| --- | --- | --- |
| Brühtemperatur | heiß (93–99 °C) | kalt (4–22 °C) |
| Zeit | 2–4 min | 8–24 h |
| Kühlung | sofort auf Eis | von Anfang an kalt |
| **Säure** | **vollständig erhalten** | stark reduziert |
| Aromatik | hell, floral, komplex, klar | schokoladig, weich, „rund" |
| Bitterkeit | normal | niedrig |
| EY typisch | 18–22 % | 15–18 % |
| Haltbarkeit | 1–2 Tage | 7–14 Tage (Konzentrat) |
| Geeignet für | helle, fruchtige, blumige Kaffees | mittlere bis dunkle, schokoladige Kaffees |

**Chemischer Hintergrund:** Kaltes Wasser löst Säuren deutlich schlechter als
heißes. Cold Brew hat rund **60–70 % weniger titrierbare Säure** 🟡 als heiß
gebrühter Kaffee derselben Bohne. Koffein dagegen wird über die lange Zeit
weitgehend extrahiert — Cold Brew ist also mild im Geschmack, aber nicht
koffeinarm.

> **Regel für die App:** Bei einem hellen äthiopischen Washed ist Cold Brew die
> falsche Methode — man zerstört genau die Säurestruktur, für die man bezahlt
> hat. Der Empfehlungsalgorithmus sollte bei `roastLevel ∈ {light}` und
> `acidityExpectation = high` **Flash Chill** vorschlagen und Cold Brew
> aktiv abraten.

---

## 2. Japanese Iced Coffee (Flash Chill, V60)

### 2.1 Prinzip

Das Brühwasser wird aufgeteilt: Ein Teil geht **heiß** durch den Kaffee, der
andere liegt als **Eis** in der Kanne und kühlt den Kaffee im Moment des
Auftreffens. Die flüchtigen Aromen werden dabei eingefangen, statt als Dampf
zu verfliegen — deshalb schmeckt Flash-Chill-Kaffee aromatischer als
nachträglich gekühlter.

### 2.2 Rezept

```
Dosis:        20 g
Wasser gesamt: 300 g     (1:15)
  davon Eis:   120 g     (40 %) — direkt in die Kanne
  davon heiß:  180 g     (60 %) — zum Aufgießen
Mahlgrad:     1 Schritt FEINER als heißer V60
Temperatur:   96 °C (heißer als normal)

0:00   Bloom auf 50 g, swirlen
0:45   Guss auf 110 g
1:15   Guss auf 180 g
~2:15  Drawdown fertig
       → schwenken bis das Eis geschmolzen ist
Ergebnis: ca. 260 g bei ~4 °C
```

### 2.3 Warum feiner und heißer?

Auf 20 g Kaffee treffen nur 180 g heißes Wasser statt 300 g — das entspricht
während der Perkolation einer Ratio von **1:9**. Weniger Wasser pro Gramm
Kaffee bedeutet weniger Extraktionskapazität. Ohne Kompensation landet man
bei 16–17 % EY statt 20 %.

Kompensation: **1 Schritt feiner + 2–3 °C heißer.**

### 2.4 Kontrollrechnung (F-17)

Kaffee, der in der Kanne landet: $180 - 2{,}0\cdot20 = 140$ g bei ~80 °C.

Benötigtes Eis für 5 °C Endtemperatur:
$$ m_{ice} = \frac{140\cdot4{,}10\cdot(80-5)}{2{,}09\cdot18 + 334 + 4{,}18\cdot5}
= \frac{43\,050}{392{,}5} = 110\ \mathrm{g} $$

Die 120 g des Rezepts liegen leicht darüber — das Eis schmilzt vollständig,
das Getränk landet bei ~3–4 °C. ✅

**Endergebnis:** 260 g Getränk aus 20 g Kaffee = effektiv **1:13**.
Bei 20 % EY ergibt das TDS $= 20\cdot20/260 = 1{,}54\ \%$ — bewusst stärker als
heißer Filterkaffee (1,38 %), weil Kälte die wahrgenommene Intensität dämpft.

### 2.5 Eisanteil variieren

| Eisanteil | Wirkung |
| --------- | ------- |
| 30 % | wärmeres Ergebnis (~12 °C), stärker; Eis im Glas nötig |
| **40 %** | ✅ Standard, ~4 °C, direkt trinkfertig |
| 50 % | sehr kalt, etwas dünner; puffert Nachschmelzen im Glas |

**Regel:** Wer zusätzlich Eiswürfel ins Serviergefäß gibt, sollte bei 30–35 %
bleiben, sonst wird es wässrig. Die App sollte `servedOverIce: boolean`
abfragen und den Eisanteil entsprechend anpassen.

### 2.6 Flash Chill mit der AeroPress

```
Dosis:      18 g
Heiß:       120 g bei 94 °C
Eis:        100 g in der Tasse
Ziehzeit:   1:30, invertiert
→ direkt auf das Eis pressen
```

---

## 3. Cold Brew

### 3.1 Konzentrat (empfohlen)

```
Dosis:      100 g
Wasser:     800 g       (1:8)
Mahlgrad:   grob (1000–1300 µm)
Zeit:       12–16 h bei Raumtemperatur
        ODER 18–24 h im Kühlschrank
Filtern:    grob (Sieb) → fein (Papier)
Ausbeute:   ~600 g Konzentrat, TDS ~4,5–5,5 %
Haltbarkeit: 7–14 Tage gekühlt
```

**Verdünnen (F-15):** Konzentrat bei 5 % TDS auf 1,4 % bringen
→ $m_{bypass} = m_{conc}\cdot(5/1{,}4 - 1) = m_{conc}\cdot2{,}57$
→ **1 Teil Konzentrat : 2,5 Teile Wasser oder Milch.**

### 3.2 Ready-to-drink

```
Dosis:      70 g
Wasser:     1000 g      (1:14)
Zeit:       14–18 h
→ ohne Verdünnung trinkfertig, TDS ~1,3 %
```

### 3.3 Parameter

| Variable | Wirkung |
| -------- | ------- |
| **Zeit** | Hauptregler. < 8 h → sauer und dünn; > 24 h → holzig, papierig, adstringierend |
| **Mahlgrad** | grob. Feiner Mahlgrad erzeugt viel Trub und macht das Filtern zur Qual |
| **Temperatur** | Raumtemperatur extrahiert schneller (12–16 h); Kühlschrank sauberer und sicherer (18–24 h) |
| **Rühren** | 1× nach dem Aufgießen; danach ruhen lassen |
| **Ratio** | 1:8 Konzentrat, 1:14 trinkfertig |

**Lebensmittelsicherheit:** Cold Brew bei Raumtemperatur ist mikrobiologisch
nicht unkritisch (pH ~5, hohe Feuchte, Nährstoffe). Maximal 16 h bei
Raumtemperatur, danach kühlen. Fertiges Konzentrat immer gekühlt lagern und
innerhalb von 14 Tagen verbrauchen.

### 3.4 Nitro Cold Brew

Cold Brew mit Stickstoff versetzt (Sahnesiphon mit N₂O-freien N₂-Kapseln oder
Zapfsystem). Ergibt eine cremige, bierartige Textur und eine dichte Krone.
Der Stickstoff senkt zudem die wahrgenommene Säure und erhöht die
wahrgenommene Süße — ohne dass Zucker zugesetzt wird.

---

## 4. Iced-Varianten der Espressogetränke

**Grundregel:** Immer **konzentrierter** brühen als die heiße Variante, weil
Schmelzwasser verdünnt und Kälte die Wahrnehmung dämpft.

| Getränk | Basis | Zusatz | Eis | Gesamt | $I$ |
| ------- | ----- | ------ | --- | ------ | --- |
| **Iced Espresso / Espresso on Ice** | Doppio 36 g | – | 60 g | ~96 g | 3,75 % |
| **Iced Americano** | Doppio 36 g | 120 g kaltes Wasser | 80 g | ~236 g | 1,53 % |
| **Iced Latte** | **Ristretto-Doppio 27 g** (TDS ~11,5 %) | 180 g kalte Milch | 80 g | ~287 g | 1,08 % |
| **Iced Flat White** | Ristretto-Doppio 27 g | 110 g kalte Milch | 60 g | ~197 g | 1,58 % |
| **Iced Cortado** | Doppio 36 g | 60 g kalte Milch | 50 g | ~146 g | 2,47 % |
| **Iced Mocha** | Doppio 36 g | 30 g Schoko + 150 g Milch | 70 g | ~286 g | 1,26 % |

Angenommen ist, dass etwa **50 % des Eises** während der Trinkdauer schmilzt
und mitgerechnet wird.

### 4.1 Warum Ristretto-Basis bei Iced Latte?

Ein normaler Doppio (36 g bei 10 % TDS = 3,6 g Feststoff) verschwindet in
180 g kalter Milch plus Schmelzwasser fast vollständig. Ein Ristretto-Doppio
(27 g bei 11,5 % = 3,1 g Feststoff) bringt fast dieselbe Menge Feststoff bei
25 % weniger Volumen — dadurch bleibt mehr Raum für Milch und Eis, ohne dass
der Kaffee untergeht. Zusätzlich ist der Ristretto süßer und weniger bitter,
was in der Kälte wichtiger ist als in der Wärme.

### 4.2 Kalte Milch nicht aufschäumen

Iced-Milchgetränke werden mit **kalter, unbehandelter Milch** gemacht. Kalter
Milchschaum (aus dem Handaufschäumer) ist möglich, aber optional — er zerfällt
in kaltem Kaffee schnell und trägt wenig bei.

### 4.3 Espresso Tonic

```
Glas:      300 ml, randvoll mit Eis
Tonic:     150–180 g, langsam über das Eis
Espresso:  Doppio 36 g, langsam obenauf
Garnitur:  Zeste von Orange, Zitrone oder Grapefruit
```

**Reihenfolge ist entscheidend:** Tonic zuerst, Espresso obenauf. Umgekehrt
schäumt das Tonic über und die Schichtung geht verloren.

**Bohnenempfehlung:** helle, fruchtige, floral geprägte Kaffees. Die Chinin-
Bitterkeit des Tonics verträgt sich schlecht mit dunklen, schokoladigen
Röstungen — beide Bitterkeiten addieren sich.

### 4.4 Shakerato

```
Shaker:    Eis bis 2/3
Espresso:  Doppio 36 g, heiß
Zucker:    5–10 g Sirup (kein Kristallzucker — löst sich kalt nicht)
Schütteln: 15–20 s, kräftig
Abseihen:  in ein gekühltes Coupette-Glas, ohne Eis
```

Der Zucker ist hier funktional: Er stabilisiert den Schaum, der beim Schütteln
aus der Crema entsteht. Ohne Zucker fällt die Schaumkrone innerhalb von
Sekunden zusammen.

### 4.5 Affogato

```
Vanilleeis:  1–2 Kugeln in eine vorgekühlte Schale
Espresso:    Doppio 36 g, heiß, direkt darüber
```
Sofort servieren. Kein Rezept, sondern Timing.

---

## 5. Zuckersirup

Kristallzucker löst sich in kaltem Kaffee praktisch nicht. Für alle
Iced-Getränke deshalb Sirup:

```
Simple Syrup 1:1   → 100 g Zucker + 100 g Wasser, erwärmen bis klar
                     ~50 % Zuckeranteil, Standard
Rich Syrup 2:1     → 200 g Zucker + 100 g Wasser
                     ~66 %, konzentrierter, länger haltbar
```
Haltbarkeit gekühlt: 1:1 ca. 4 Wochen, 2:1 ca. 6 Monate.

---

## 6. Eis

| Form | Schmelzrate | Einsatz |
| ---- | ----------- | ------- |
| **Große Würfel (4–5 cm)** | langsam | Iced Espresso, Espresso Tonic — minimale Verdünnung |
| Standardwürfel (2–3 cm) | mittel | Alltag |
| Crushed | sehr schnell | nur für Frappé-artige Getränke |
| **Kaffee-Eiswürfel** | – | Iced Latte ohne Verdünnung — aus Filterkaffee oder Cold Brew vorgefroren |

**Kaffee-Eiswürfel** sind die eleganteste Lösung gegen das Verwässern:
Das Schmelzwasser ist selbst Kaffee, $I$ bleibt über die gesamte Trinkdauer
konstant. Die App sollte das als Vorbereitungstipp führen — inklusive
Erinnerung („Eiswürfel für morgen vorbereiten?").

**Eistemperatur beachten:** Gefrierschrank-Eis hat ca. −18 °C, nicht 0 °C.
Der Unterschied macht in F-17 rund 10 % der benötigten Eismasse aus und ist in
der Formel bereits über den Term $c_{ice}\cdot|T_{ice}|$ berücksichtigt.

---

## 7. Für die App

### `iced` als Modifikator, nicht als eigene Methode

```ts
interface IcedModifier {
  mode: 'flash-chill' | 'over-ice' | 'cold-brew'
  icePct?: number            // Anteil des Brühwassers als Eis (flash-chill)
  iceG?: number              // Eis im Glas (over-ice)
  iceTempC: number           // Default −18
  servedOverIce: boolean
  concentrationFactor: number // Default 1,15 für over-ice
}
```

### Automatische Rezeptanpassung

```js
if (mode === 'flash-chill') {
  hotWaterG  = totalWaterG * (1 - icePct)
  iceG       = totalWaterG * icePct
  grindSteps = baseGrindSteps - 1        // feiner
  tempC      = baseTempC + 2
}

if (mode === 'over-ice') {
  ratio      = baseRatio / concentrationFactor   // konzentrierter
  meltG      = iceG * 0.5                        // Annahme: 50 % schmelzen
  finalMassG = brewG + meltG + additionsG
}
```

### Validierung

```
icePct < 0,25                         → „zu wenig Eis, Getränk bleibt lauwarm"
icePct > 0,55                         → „zu viel Eis, Getränk wird wässrig"
mode = cold-brew && roastLevel = light → „Cold Brew zerstört die Säurestruktur
                                          dieser Bohne — Flash Chill empfohlen"
coldBrewHours > 24                    → „holzige Noten wahrscheinlich"
coldBrewHours > 16 && !refrigerated   → „Lebensmittelsicherheit: bitte kühlen"
```

Die vorletzte Regel ist ein Beispiel dafür, wo die App echten fachlichen Wert
liefert: Sie widerspricht dem Nutzer begründet, statt jedes Rezept auszuführen.
