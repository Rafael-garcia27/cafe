# 12 — Getränke-Rezepturen

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Jedes Getränk ist eine **Komposition** aus einem Brew und Zusätzen — keine
eigene Brühmethode (kb/00 §1). Dieses Kapitel definiert die Kompositionsregeln.

---

## 1. Die Kennzahl: Kaffeeintensität

Um Getränke vergleichbar zu machen, braucht es eine Größe, die über alle
Kategorien funktioniert — von Ristretto bis Latte.

$$ I = \frac{\mathrm{TDS}_{brew}\cdot m_{brew}}{m_{total}} $$

Also: **Anteil gelöster Kaffeefeststoffe an der Gesamtmasse des Getränks**,
in Prozent. Spezialfall von F-11 mit $\mathrm{TDS}=0$ für Milch, Wasser und Eis.

Damit lassen sich alle Getränke auf einer Achse anordnen, und die App kann
einen ehrlichen „Stärke"-Regler bauen, statt Kategorienamen zu raten.

> Milchbestandteile werden hier bewusst **nicht** mitgezählt. $I$ misst, wie
> viel Kaffee im Getränk steckt — nicht, wie dick es ist.

---

## 2. Espresso-basiert, pur

Basis durchgehend: **18 g Dosis, 58-mm-Korb, TDS ~10 %** (sofern nicht anders angegeben).

| Getränk | Ratio | Ausbringung | Gesamt | Tasse | $I$ | Kennzeichen |
| ------- | ----- | ----------- | ------ | ----- | --- | ----------- |
| **Ristretto** | 1:1,3 | 24 g (TDS ~12 %) | 24 g | 60 ml | 12,0 % | dicht, sirupös, süß; braucht **gröberen** Mahlgrad (kb/08 §3.2) |
| **Espresso / Doppio** | 1:2 | 36 g | 36 g | 60–90 ml | 10,0 % | Referenz |
| **Lungo** | 1:3,5 | 63 g (TDS ~5,8 %) | 63 g | 90–120 ml | 5,8 % | leichter, aromatischer, mehr Bitterkeit |
| **Turbo Shot** | 1:4 | 72 g (TDS ~5,3 %) | 72 g | 120 ml | 5,3 % | grob gemahlen, 6 bar, 15–20 s; nur helle Röstungen |
| **Espresso con Panna** | 1:2 | 36 g | 36 g + Sahne | 90 ml | – | Sahnehaube auf dem Shot |

**Historische Einordnung:** Der klassische italienische *Single* Espresso
sind 7–9 g auf 25–30 g. Im modernen Specialty-Segment ist der **Doppio der
Standard** — er ist reproduzierbarer, weil größere Körbe gleichmäßiger
extrahieren und Dosierschwankungen relativ weniger wiegen. Die App sollte
`doppio` als Default führen und `single` als Option.

---

## 3. Espresso mit Wasser

### 3.1 Americano vs. Long Black

| | Americano | Long Black |
| --- | --- | --- |
| Reihenfolge | Espresso, dann Wasser drauf | **Wasser zuerst**, dann Espresso hinein |
| Crema | wird zerstört | bleibt erhalten |
| Aromatik | flacher | intensiver, mehr Duft |
| Herkunft | USA | AU/NZ |

**Der Unterschied ist real, nicht folkloristisch.** Wer heißes Wasser auf die
Crema gießt, zerschlägt sie mechanisch und verliert die flüchtigen Aromen, die
sie festhält. Empfehlung der App: **immer Long-Black-Reihenfolge**.

### 3.2 Verdünnungsgrade (F-12 / F-13)

Basis 36 g Espresso bei TDS 10 %:

| Stil | Wasser | Gesamt | $I$ | Charakter |
| ---- | ------ | ------ | --- | --------- |
| Kurz | 60 g | 96 g | 3,75 % | sehr kräftig, espressonah |
| **Standard** | 120 g | 156 g | **2,31 %** | kräftig — der übliche Café-Americano |
| Lang | 180 g | 216 g | 1,67 % | milder |
| **Filterstärke** | **231 g** | **267 g** | **1,35 %** | ✅ entspricht exakt Golden-Cup-Filter |

**Der wichtigste Befund dieses Kapitels:** Ein normaler Americano ist mit
2,3 % rund **70 % stärker als Filterkaffee**. Genau daher kommt der verbreitete
Eindruck, Americano schmecke „hart" oder „dünn und trotzdem bitter" — es ist
schlicht ein sehr konzentriertes Getränk mit wenig aromatischer Fülle.

Wer Filterkaffee-Charakter will, braucht **1:6,4** (Espresso:Wasser),
gerechnet nach F-13. Diese Zahl sollte die App als Rechner anbieten:

```
Eingabe:  Espressomasse, gemessene oder geschätzte TDS, Ziel-TDS
Ausgabe:  Wassermenge (F-13), Gesamtmasse, resultierendes I
```

### 3.3 Wassertemperatur

85–90 °C, **nicht kochend**. Kochendes Wasser auf einen fertigen Shot
verstärkt die Wahrnehmung von Bitterkeit. Bei der Long-Black-Reihenfolge ist
das Wasser ohnehin schon leicht abgekühlt, wenn der Shot dazukommt.

---

## 4. Milchgetränke

Alle Angaben: **Doppio 18 g → 36 g**, Vollmilch, Milchmasse als *finale* Masse
nach Dampfkondensat (kb/11 §3). Die **einzufüllende** Menge liegt jeweils
ca. 9 % darunter.

| Getränk | Milch (final) | Schaum | Gesamt | Glas | $I$ | Kennzeichen |
| ------- | ------------- | ------ | ------ | ---- | --- | ----------- |
| **Espresso Macchiato** | 15 g | Haube | 51 g | 60–90 ml | 7,06 % | „gefleckt" — nur ein Löffel Schaum |
| **Cortado** | 60 g | 0,3 cm | 96 g | 90–120 ml | 3,75 % | 1:1,7 Espresso:Milch; kaum Schaum |
| **Gibraltar** | 60 g | 0,3 cm | 96 g | 130 ml Glas | 3,75 % | Cortado im Libbey-Glas |
| **Piccolo Latte** | 65 g | 0,5 cm | 101 g | 100–120 ml | 3,56 % | oft auf Ristretto-Basis |
| **Flat White** | **124 g** | **0,5–1 cm** | **160 g** | **150–175 ml** | **2,25 %** | Microfoam, glänzend, keine Schaumschicht |
| **Cappuccino (modern)** | 124 g | 1,5–2 cm | 160 g | 150–180 ml | 2,25 % | wie Flat White, nur mehr Luft |
| **Cappuccino (klassisch)** | 125 g auf Single 25 g | 2 cm | 150 g | 150–160 ml | 2,00 % | 1/3 Espresso, 1/3 Milch, 1/3 Schaum |
| **Latte / Caffè Latte** | 244 g | ~1 cm | 280 g | 300–350 ml | 1,29 % | mildestes Milchgetränk |
| **Latte Macchiato** | 244 g | 1,5 cm | 280 g | 300 ml Glas | 1,29 % | Milch zuerst, Espresso durchgegossen → Schichten |
| **Mocha** | 180 g + 30 g Schokolade | 1 cm | 246 g | 300 ml | 1,46 % | Schokolade zuerst im Espresso lösen |

### 4.1 Flat White vs. Cappuccino vs. Latte

Der Unterschied liegt in **genau zwei Größen** — Milchmenge und Overrun:

```
                 Milch    Overrun   Schaum
Cortado           60 g      5–10 %   0,3 cm
Flat White       124 g     10–20 %   0,5–1 cm
Cappuccino       124 g     50–80 %   1,5–2 cm
Latte            244 g     20–30 %   ~1 cm
```

Flat White und Cappuccino haben **dieselbe Masse und dasselbe $I$**. Sie
unterscheiden sich ausschließlich in der Luftmenge. Das ist der ganze
Unterschied — und der Grund, warum ein zu luftig geschäumter Flat White
automatisch zum Cappuccino wird.

**Die App sollte das visualisieren**, statt es zu erklären: ein Schnittbild
durch das Glas mit Espresso-, Milch- und Schaumanteil. Das ist in zwei
Sekunden verstanden und beantwortet die meistgestellte Kaffeefrage überhaupt.

### 4.2 Ristretto-Basis für Milchgetränke

Verbreitete Praxis (v. a. AU/NZ): Flat White auf **Doppio-Ristretto**
(18 g → 27 g, TDS ~11,5 %) statt auf normalem Doppio.

Wirkung: dichter, süßer, weniger bitter; setzt sich besser gegen die Milch
durch. $I$ steigt leicht auf 2,4 % bei kleinerem Volumen.

Für die App als Option `baseShotStyle: 'espresso' | 'ristretto'` führen.

### 4.3 Milchmengen-Rückrechnung

Für ein Zielglas gilt (kb/11 §7):

```
Beispiel Flat White, 160 ml Glas:
  Zielvolumen                     160 ml
  − Espresso                       36 ml
  = Milchvolumen final (m. Schaum) 124 ml
  ÷ (1 + 0,15 Overrun)             108 ml flüssig
  ÷ (1 + 0,09 Kondensat)            99 ml
  ⇒ EINFÜLLEN: ~100 g Milch
```

Rund **100 g Milch für einen 160-ml-Flat-White** — deutlich weniger, als die
meisten schätzen. Dieser Rechner ist eine der nützlichsten Einzelfunktionen,
die die App bieten kann.

---

## 5. Filterbasierte Getränke

| Getränk | Rezept | Ergebnis | $I$ |
| ------- | ------ | -------- | --- |
| **Pour Over (V60)** | 18 g / 300 g / 1:16,7 | ~264 g in der Kanne | 1,38 % |
| **Pour Over stark** | 18 g / 270 g / 1:15 | ~234 g | 1,55 % |
| **Batch Brew** | 60 g / 1000 g | ~880 g | 1,36 % |
| **AeroPress Standard** | 16 g / 240 g | ~216 g | 1,45 % |
| **AeroPress Konzentrat + Bypass** | 18 g / 120 g → verdünnt | ~223 g | 1,45 % |

$I$ entspricht hier per Definition dem TDS, weil nichts zugesetzt wird.

---

## 6. Zusammenfassende Intensitätsskala

Alle Getränke auf einer Achse — die Kernaussage dieses Kapitels:

```
 I (%)
 12  ┤ █ Ristretto
 10  ┤ █ Espresso
  8  ┤
  7  ┤ █ Espresso Macchiato
  6  ┤ █ Lungo
  5  ┤ █ Turbo Shot
  4  ┤ █ Cortado / Gibraltar / Piccolo
  3  ┤
  2,3┤ █ Americano (Standard)
  2,2┤ █ Flat White / Cappuccino
  1,5┤ █ AeroPress / Mocha
  1,4┤ █ Pour Over / Americano (Filterstärke)
  1,3┤ █ Latte
  0  └──────────────────────────────────────
```

Ein Flat White ist damit **kaum stärker als ein Pour Over** — er wirkt nur so,
weil Milch und Textur die Wahrnehmung verändern. Und ein Standard-Americano ist
das **stärkste nicht-espressobasierte Getränk** der Liste. Beides überrascht die
meisten Nutzer und ist ein gutes Argument für eine solche Anzeige in der App.

---

## 7. Kompositionsmodell für die App

```ts
interface DrinkType {
  id: string
  name: string
  category: 'pure' | 'water' | 'milk' | 'iced' | 'special'
  baseMethod: BrewMethod
  baseShotStyle?: 'espresso' | 'ristretto' | 'lungo'
  baseRatio: number
  components: {
    kind: 'milk' | 'water' | 'ice' | 'syrup' | 'tonic' | 'cream' | 'chocolate'
    massG: number          // Referenzwert, skalierbar
    tempC?: number
    foamClass?: FoamClass
  }[]
  glassMl: [number, number]
  targetIntensityPct: number   // I
  scalable: boolean            // darf über Glasgröße skaliert werden?
  notes?: string
}
```

### Skalierungsregel

Wenn der Nutzer die Glasgröße ändert, skalieren **alle** Komponenten
proportional — mit **einer Ausnahme**: Der Espressoanteil springt in Shot-Stufen
(einfach/doppel/dreifach), weil man keinen 1,4-fachen Shot ziehen kann.

```
neueGesamtmasse = glasMl * 0,96          (Füllgrad)
shots           = round(neueGesamtmasse * targetI / (tdsEsp * yieldProShot))
milch           = neueGesamtmasse − shots * yieldProShot
```

Das erhält die Intensität $I$ so gut wie möglich bei diskreten Shotzahlen und
ist der korrekte Weg, „Flat White in groß" zu berechnen — statt einfach alles
zu verdoppeln, was das Getränk milchlastig und wässrig machen würde.

### Sinnvolle Grenzen

```
I > 4 %   und  category = milk   → „sehr kräftig, prüfen"
I < 1 %                          → „sehr dünn, Ratio prüfen"
glasMl > 400 && shots = 1        → „Ein Shot ist für dieses Volumen zu wenig"
milkG / espressoG > 10           → „Kaffee wird kaum wahrnehmbar sein"
```

Iced-Varianten aller hier gelisteten Getränke: **kb/13**.
