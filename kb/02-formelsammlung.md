# 02 — Formelsammlung

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Alle Rechenvorschriften der App. Jede Formel hat eine stabile ID (`F-nn`), auf
die `data/formulas.json`, die Diagnose-Regeln (kb/14) und der Code referenzieren.

**Konventionen**
- Massen in **Gramm**, Temperaturen in **°C**, Zeiten in **Sekunden**,
  Energien in **Joule**, Drücke in **bar**, Längen in **mm** bzw. **µm**.
- TDS und EY werden als **Prozentzahl** geführt (`1.35` = 1,35 %), nicht als Bruch.
- Konfidenz: 🟢 gesichert · 🟡 etabliert · 🟠 heuristisch/kalibrierbar

**Physikalische Konstanten**

| Symbol       | Wert           | Einheit    | Bedeutung                              |
| ------------ | -------------- | ---------- | -------------------------------------- |
| $c_w$        | 4,18           | J/(g·K)    | spez. Wärmekapazität Wasser            |
| $c_{ice}$    | 2,09           | J/(g·K)    | spez. Wärmekapazität Eis               |
| $c_{milk}$   | 3,90           | J/(g·K)    | spez. Wärmekapazität Vollmilch         |
| $c_{bev}$    | 4,10           | J/(g·K)    | Kaffeegetränk (≈ Wasser, leicht reduziert) |
| $L_f$        | 334            | J/g        | Schmelzwärme Eis                       |
| $h_{fg}$     | 2257           | J/g        | Verdampfungswärme Wasser bei 100 °C    |
| $\rho_w$     | 0,998          | g/ml       | Dichte Wasser bei 20 °C                |

---

## A. Massen und Verhältnisse

### F-01 — Brew Ratio (Filter)

$$ R = \frac{m_{water}}{m_{dose}} \qquad \text{Notation } 1{:}R $$

```
ratio = waterG / doseG
```
🟢 · Definition. Typisch V60: 15–17. AeroPress: 12–16.

### F-02 — Brew Ratio (Espresso)

$$ R = \frac{m_{out}}{m_{dose}} $$

```
ratio = yieldG / doseG
```
🟢 · **Achtung, entscheidender Unterschied:** Beim Espresso ist der Nenner die
Masse **im Glas**, beim Filter die Masse des **eingegossenen Wassers**. Die App
darf diese beiden Zahlen niemals in derselben Spalte vergleichen. 1:2 Espresso
und 1:2 Filter sind völlig verschiedene Dinge.

Referenzwerte: Ristretto 1:1–1:1,5 · Espresso 1:2–1:2,5 · Lungo 1:3–1:4,5
· Turbo/Filterröstung im ST 1:3–1:5.

### F-03 — Zielausbringung aus Dosis und Ratio

$$ m_{out} = m_{dose} \cdot R $$

```
targetYieldG = doseG * ratio
```
🟢

### F-04 — Benötigte Dosis für Zielausbringung

$$ m_{dose} = \frac{m_{out}}{R} $$
🟢

### F-05 — Retentionswasser und Getränkemasse (Filter)

Das Kaffeebett hält Wasser zurück. Diese Masse landet nie in der Kanne.

$$ m_{retained} = \mathrm{LRR} \cdot m_{dose} $$
$$ m_{beverage} = m_{water} - \mathrm{LRR}\cdot m_{dose} $$

```
beverageG = waterG - lrr * doseG
```

**LRR (Liquid Retention Ratio)** in g Wasser je g Kaffee 🟡:

| Methode                       | LRR       |
| ----------------------------- | --------- |
| V60, Papierfilter             | 2,0       |
| V60, Metallfilter             | 1,8       |
| AeroPress, gepresst           | 1,5       |
| AeroPress, invertiert gepresst| 1,6       |
| French Press (ungepresst)     | 2,2       |

> Ohne diesen Term wird die EY um **10–15 % relativ** zu niedrig berechnet.
> Das ist der häufigste Rechenfehler in Kaffee-Apps.

### F-06 — Extraktionsausbeute (Extraction Yield, EY) — **die Kernformel**

$$ \mathrm{EY}\,[\%] = \frac{\mathrm{TDS}\,[\%] \cdot m_{beverage}}{m_{dose}} $$

```
ey = (tdsPct * beverageG) / doseG
```
🟢

- **Filter:** $m_{beverage}$ über F-05 berechnen (oder Kanne wiegen).
- **Espresso:** $m_{beverage}$ = tatsächlich gewogene Tassenmasse. Kein
  LRR-Abzug nötig, weil direkt gemessen.

**Rechenbeispiel Filter:** 18 g Dosis, 300 g Wasser, TDS 1,38 %
→ $m_{bev} = 300 - 2{,}0\cdot18 = 264$ g
→ EY $= 1{,}38 \cdot 264 / 18 = 20{,}2\ \%$ ✅ im Zielkorridor.

**Rechenbeispiel Espresso:** 18 g in, 36 g out, TDS 9,8 %
→ EY $= 9{,}8 \cdot 36 / 18 = 19{,}6\ \%$ ✅

### F-07 — Extrahierte Feststoffmasse

$$ m_{solids} = \frac{\mathrm{EY}}{100}\cdot m_{dose} = \frac{\mathrm{TDS}}{100}\cdot m_{beverage} $$
🟢 · Nützlich für Bypass-Rechnungen (F-13) und Cold-Brew-Verdünnung.

### F-08 — TDS aus EY und Ratio (Umkehrung, ohne Refraktometer)

Für Espresso:
$$ \mathrm{TDS} = \frac{\mathrm{EY}}{R} $$

Für Filter:
$$ \mathrm{TDS} = \frac{\mathrm{EY}}{R - \mathrm{LRR}} $$

🟢 · Elegante Identität, direkt aus F-01/F-05/F-06. Sie erklärt, warum die
Ratio-Linien im Brew Control Chart Geraden durch den Ursprung sind.

**Anwendung in der App:** Damit lässt sich *ohne Refraktometer* die zu
erwartende Stärke vorhersagen und prüfen, ob ein Rezept überhaupt im
Golden-Cup-Fenster landen **kann**.

Beispiel: V60 bei 1:18 und LRR 2,0. Selbst bei sehr guter EY von 22 % ergibt
sich TDS $= 22/16 = 1{,}38$ %. Bei nur 18 % EY: $18/16 = 1{,}13$ % — unter dem
Golden-Cup-Minimum. **Fazit: 1:18 verzeiht keine niedrige Extraktion.**
Diese Warnung sollte die App beim Ratio-Slider anzeigen.

### F-09 — Ratio für Ziel-TDS bei angenommener EY

$$ R = \frac{\mathrm{EY}}{\mathrm{TDS}_{target}} + \mathrm{LRR}\quad\text{(Filter)},
\qquad R = \frac{\mathrm{EY}}{\mathrm{TDS}_{target}}\quad\text{(Espresso)} $$
🟢

### F-10 — Wassermenge für Ziel-Getränkemasse (Filter)

$$ m_{water} = m_{beverage,target} + \mathrm{LRR}\cdot m_{dose} $$

```
waterG = targetBeverageG + lrr * doseG
```
🟢 · Für „Ich will exakt 250 g in der Kanne."

---

## B. Mischen und Verdünnen

### F-11 — Mischungs-TDS (allgemein)

$$ \mathrm{TDS}_{mix} = \frac{\sum_i m_i \cdot \mathrm{TDS}_i}{\sum_i m_i} $$

```
tdsMix = sum(m_i * tds_i) / sum(m_i)
```
🟢 · Grundlage für Americano, Bypass, Cold-Brew-Verdünnung, Iced-Schmelzwasser.

### F-12 — Americano / Long Black

$$ \mathrm{TDS}_{final} = \frac{\mathrm{TDS}_{esp}\cdot m_{esp}}{m_{esp}+m_{water}} $$
🟢

**Beispiel:** Doppio 36 g bei TDS 10 %, verlängert mit 120 g Wasser
→ $\mathrm{TDS} = 10\cdot36/156 = 2{,}31\ \%$.

Das ist deutlich stärker als Filterkaffee (1,15–1,45 %) — der übliche Grund,
warum Americano „hart" schmeckt. Für Filter-ähnliche Stärke braucht es:

### F-13 — Wassermenge für Ziel-TDS (Americano-Rechner)

$$ m_{water} = m_{esp}\left(\frac{\mathrm{TDS}_{esp}}{\mathrm{TDS}_{target}} - 1\right) $$

```
waterG = espG * (tdsEsp / tdsTarget - 1)
```
🟢

**Beispiel:** 36 g Espresso bei 10 % TDS auf 1,35 % bringen
→ $36\cdot(10/1{,}35 - 1) = 36\cdot6{,}41 = 231$ g Wasser. Gesamt 267 g.
Das ist die **rechnerisch korrekte Americano-Ratio** — und erklärt, warum
1:5 (Espresso:Wasser) die sinnvolle Untergrenze ist, nicht 1:2.

### F-14 — Bypass-Invariante ⚠️ wichtig

> **Verdünnen ändert die Stärke, aber NIEMALS die Extraktionsausbeute.**

$$ \mathrm{EY} = \frac{\mathrm{TDS}_{conc}\cdot m_{conc}}{m_{dose}}
= \frac{\mathrm{TDS}_{mix}\cdot m_{total}}{m_{dose}} $$

🟢 · Der gelöste Feststoff bleibt gleich, nur das Lösungsmittel wächst.

**Konsequenz für die Diagnose-Engine:** Bei „zu bitter" hilft Bypass **nicht**
— die Bitterstoffe sind bereits gelöst und werden nur verdünnt. Bei „zu stark,
aber geschmacklich sauber" hilft Bypass **perfekt**. Die Engine muss das
unterscheiden, sonst gibt sie systematisch falsche Ratschläge.

### F-15 — Bypass-Wasser für Zielstärke

$$ m_{bypass} = m_{conc}\left(\frac{\mathrm{TDS}_{conc}}{\mathrm{TDS}_{target}}-1\right) $$
🟢 · Formal identisch mit F-13. Nutzung: AeroPress-Konzentrat, Cold Brew.

---

## C. Temperatur und Energie

### F-16 — Mischtemperatur

$$ T_{mix} = \frac{\sum_i m_i c_i T_i}{\sum_i m_i c_i} $$
🟢 · Ohne Phasenwechsel. Für Eis siehe F-17.

### F-17 — Eismenge für Zieltemperatur (Flash Chill) 🟢

Energiebilanz mit Phasenwechsel:

$$ m_{ice} = \frac{m_{hot}\cdot c_{bev}\cdot (T_{hot}-T_{final})}
{c_{ice}\cdot|T_{ice}| + L_f + c_w\cdot T_{final}} $$

```js
iceForTargetTemp(hotG, tHot, tFinal, tIce = -18) =>
  (hotG * 4.10 * (tHot - tFinal)) /
  (2.09 * Math.abs(tIce) + 334 + 4.18 * tFinal)
```

**Beispiel:** 200 g Kaffee bei 80 °C auf 5 °C bringen, Gefrierschrank-Eis (−18 °C)
- Zähler: $200\cdot4{,}10\cdot75 = 61\,500$ J
- Nenner: $2{,}09\cdot18 + 334 + 4{,}18\cdot5 = 37{,}6+334+20{,}9 = 392{,}5$ J/g
- $m_{ice} = 61\,500/392{,}5 = \mathbf{157\ g}$

Ergebnis: 357 g Getränk bei 5 °C, Eis vollständig geschmolzen.
Eisanteil an der Gesamtmasse: 44 % — deckt sich mit der Faustregel
„40–50 % des Brühwassers als Eis" für Japanese Iced Coffee.

> **Praxishinweis:** Wer sichtbare Eiswürfel im Glas will, muss **mehr** Eis
> nehmen. F-17 berechnet die Menge, die exakt vollständig schmilzt.
> Für Restwürfel: Faktor 1,3–1,5 auf $m_{ice}$, und die überschüssige Eismasse
> **nicht** in die Ratio-Rechnung einbeziehen — sie schmilzt erst im Glas.

### F-18 — Schmelzwasser-Verdünnung im Glas

$$ \mathrm{TDS}_{final} = \mathrm{TDS}_{init}\cdot\frac{m_{init}}{m_{init}+m_{melt}} $$
🟢 · Spezialfall von F-11 mit $\mathrm{TDS}_{melt}=0$.
Praktisch: Ein Iced Latte verliert über 15 Minuten **10–20 % Stärke** durch
Nachschmelzen. Deshalb werden Iced-Rezepte bewusst konzentrierter gebrüht.

### F-19 — Milchverdünnung durch Dampfkondensat 🟢

Beim Aufschäumen kondensiert Dampf in der Milch und **erhöht deren Masse**:

$$ \frac{m_{steam}}{m_{milk}} = \frac{c_{milk}\cdot\Delta T}{h_{fg} + c_w\cdot(100-T_{final})} $$

**Beispiel:** 150 g Milch von 4 °C auf 60 °C
- Zähler: $3{,}90\cdot56 = 218{,}4$ J/g
- Nenner: $2257 + 4{,}18\cdot40 = 2424$ J/g
- Verhältnis: $0{,}090$ → **+13,5 g Wasser**

Aus 150 g Kühlschrankmilch werden also ~163,5 g texturierte Milch — eine
**Verdünnung um 9 %**, die kaum jemand einrechnet. Bei feuchtem Maschinendampf
(real 5–10 % Wasseranteil) eher 10–13 % 🟡.

**App-Konsequenz:** Die Milchmenge für einen Flat White muss auf die *finale*
Masse gerechnet werden, nicht auf die eingefüllte. Und der Kaffee-Milch-Ratio
verschiebt sich messbar.

---

## D. Fluidmechanik (Espresso)

### F-20 — Darcy-Gesetz für das Kaffeebett

$$ Q = \frac{k\cdot A\cdot \Delta p}{\mu\cdot L} $$

| Symbol     | Bedeutung                    |
| ---------- | ---------------------------- |
| $Q$        | Volumenstrom                 |
| $k$        | Permeabilität des Betts      |
| $A$        | Querschnittsfläche des Korbs |
| $\Delta p$ | Druckdifferenz               |
| $\mu$      | dynamische Viskosität        |
| $L$        | Puckhöhe                     |

🟢 · Erklärt qualitativ alles Wichtige: dickerer Puck → langsamer; höherer Druck
→ schneller; heißeres Wasser (niedrigere Viskosität) → schneller.

### F-21 — Kozeny-Carman: Permeabilität aus Partikelgröße

$$ k \propto \frac{d^2\,\varepsilon^3}{(1-\varepsilon)^2} $$

🟢 · $\varepsilon$ = Porosität des Betts. Bei konstanter Packungsdichte gilt
damit $Q\propto d^2$ — **die Flussrate skaliert quadratisch mit dem
Partikeldurchmesser.**

### F-22 — Mahlgradkorrektur aus Zeitabweichung ⭐ **die nützlichste Formel**

Aus F-20 + F-21 mit $t \propto 1/Q \propto 1/d^2$ folgt:

$$ \frac{d_{neu}}{d_{alt}} = \sqrt{\frac{t_{alt}}{t_{neu}}} $$

```js
grindScaleFactor = Math.sqrt(actualTimeS / targetTimeS)
// > 1 → gröber mahlen,  < 1 → feiner mahlen
```

🟡 · (Physik 🟢, aber konstante Porosität und kein Channeling vorausgesetzt.)

**Beispiel:** Shot läuft 35 s, Ziel 28 s
→ Faktor $\sqrt{35/28} = 1{,}118$ → **12 % gröber**.
Bei ~300 µm Ausgangsgröße: +36 µm.
Bei einer Mühle mit 12 µm/Klick: **3 Klicks gröber**.

Damit lässt sich der Vorschlag der App von „mal ein bisschen gröber" auf eine
konkrete Klickzahl heben — vorausgesetzt, `micronPerStep` ist bekannt (kb/07).

**Wichtige Einschränkung:** Nur gültig, wenn `flowState` normal war. Bei
Channeling ist die gemessene Zeit physikalisch bedeutungslos, weil ein Teil des
Wassers das Bett gar nicht durchströmt hat. Die Engine muss F-22 dann sperren.

### F-23 — Mahlgradschritte aus Skalierungsfaktor

$$ \Delta_{steps} = \frac{d_{alt}\cdot(f-1)}{\mu m_{per\,step}} $$

```js
steps = Math.round((currentMicron * (factor - 1)) / micronPerStep)
```
🟠 · Erfordert Mühlen-Kalibrierung, siehe `data/grinders.json`.

### F-24 — Durchschnittliche Flussrate

$$ \dot m = \frac{m_{out}}{t} $$

🟢 · Zielbereich Espresso: **1,2–2,0 g/s** 🟡.
Diagnostisch wertvoller als die Zeit allein, weil unabhängig von der Dosis.

### F-25 — Korbquerschnitt und Puckgeometrie

$$ A = \pi\left(\frac{d_{basket}}{2}\right)^2 $$

| Korb-Ø | A          |
| ------ | ---------- |
| 58 mm  | 26,42 cm²  |
| 54 mm  | 22,90 cm²  |
| 53 mm  | 22,06 cm²  |
| 51 mm  | 20,43 cm²  |

**Dosisdichte** (Gramm pro cm² Korbfläche) macht Rezepte zwischen Korbgrößen
übertragbar:

$$ \sigma = \frac{m_{dose}}{A} $$

🟡 · Typisch **0,62–0,76 g/cm²**. 18 g im 58er → 0,68 g/cm². Äquivalent im
54er Korb: $0{,}68\cdot22{,}90 = 15{,}6$ g. Genau so überträgt man ein Rezept
von einer 58-mm- auf eine 54-mm-Maschine.

### F-26 — Trockene Puckhöhe

$$ h = \frac{m_{dose}}{\rho_{bulk}\cdot A} $$

🟠 · $\rho_{bulk}\approx 0{,}55$–$0{,}65$ g/cm³ nach dem Tampen.
18 g im 58er bei 0,60 → $h = 18/(0{,}60\cdot26{,}42) = 1{,}14$ cm.
Nass quillt der Puck um ~20–30 %. Daraus folgt der Headspace-Bedarf.

---

## E. Mahlgut

### F-27 — Spezifische Oberfläche

$$ \mathrm{SSA} = \frac{6}{\rho\cdot d} $$
🟢 · Kugelnäherung. Halber Durchmesser = doppelte Oberfläche.

### F-28 — Diffusionszeitkonstante

$$ \tau \approx \frac{d^2}{4\,D_{eff}},\qquad D_{eff}\approx 1\cdot10^{-10}\ \mathrm{m^2/s} $$
🟠 · $D_{eff}$ variiert in der Literatur um eine Größenordnung. Nur für
Größenordnungs-Argumente nutzen, nicht für Vorhersagen.

### F-29 — Mühlen-Skalenumrechnung

$$ d \approx d_0 + s\cdot \mu m_{per\,step} $$
🟠 · Lineare Näherung, gültig im Arbeitsbereich. `d0` = Mikrometer am
Nullpunkt (Berührpunkt der Mahlscheiben). Kalibrierdaten in `data/grinders.json`.

---

## F. Frische

### F-30 — CO₂-Ausgasung (Zerfall erster Ordnung)

$$ m_{CO_2}(t) = m_0\cdot e^{-t/\tau} $$

🟡 · Halbwertszeit ganze Bohne bei Raumtemperatur:

| Röstgrad     | $t_{1/2}$ | $\tau$   |
| ------------ | --------- | -------- |
| hell         | ~14 d     | ~20 d    |
| mittel       | ~10 d     | ~14 d    |
| dunkel       | ~6 d      | ~9 d     |

Gemahlen: $t_{1/2}$ in **Minuten bis wenigen Stunden**.

### F-31 — Frische-Score (App-Heuristik)

$$ F = 100\cdot\exp\!\left(-\frac{(t - t_{peak})^2}{2\sigma^2}\right) $$

🟠 · Glockenkurve mit methodenspezifischem Optimum. Parameter (Tage nach Röstung):

| Methode   | Röstgrad | $t_{peak}$ | $\sigma$ |
| --------- | -------- | ---------- | -------- |
| Espresso  | hell     | 16         | 8        |
| Espresso  | mittel   | 12         | 7        |
| Espresso  | dunkel   |  8         | 5        |
| V60       | hell     | 12         | 8        |
| V60       | mittel   |  9         | 7        |
| V60       | dunkel   |  6         | 5        |
| AeroPress | alle     | wie V60    | +2       |

Zusätzlich ein harter Malus nach dem Öffnen der Tüte:
$F' = F\cdot(1 - 0{,}004\cdot d_{open})$, gedeckelt bei −40 % 🟠.

### F-32 — Mahlgraddrift durch Entgasung

Mit zunehmendem Alter sinkt der Bettwiderstand — derselbe Mahlgrad läuft
schneller durch.

$$ \Delta_{steps} \approx -k_{age}\cdot(t - t_{ref}) $$

🟠 · $k_{age}\approx 0{,}08$ Schritte/Tag für Espresso 🟠, ~0 für Filter
(dort ist der Effekt sensorisch, nicht hydraulisch).
Praktisch: **etwa ein Klick feiner pro 12 Tage** Alterung, um die Shotzeit zu halten.

---

## G. Koffein und Nährwerte

### F-33 — Koffeingehalt (Schätzung)

$$ m_{caf} \approx w_{caf}\cdot m_{dose}\cdot \eta $$

| Parameter        | Wert                                   | Konfidenz |
| ---------------- | -------------------------------------- | --------- |
| $w_{caf}$ Arabica| 1,2 % der Röstmasse                    | 🟡        |
| $w_{caf}$ Robusta| 2,2 %                                  | 🟡        |
| $\eta$ Espresso 1:2 | 0,35–0,55                           | 🟠        |
| $\eta$ Filter 1:16  | 0,70–0,90                           | 🟠        |
| $\eta$ Immersion 4 min | 0,80–0,95                        | 🟠        |
| $\eta$ Cold Brew 16 h  | 0,70–0,85                        | 🟠        |

**Das ist die unpräziseste Formel der Sammlung.** Die App sollte Ergebnisse
als Spanne ausgeben („ca. 90–140 mg"), nie als Punktwert.

Plausibilisierung: Doppio 18 g Arabica → 216 mg im Kaffee, davon 35–55 %
extrahiert = **76–119 mg**. Deckt sich mit publizierten Messwerten für
doppelte Espressi.

**Wichtig gegen einen verbreiteten Irrtum:** Ein Doppio (~100 mg) enthält
*weniger* Koffein als eine große Tasse Filterkaffee (250 g aus 15 g Dosis →
~130–160 mg). Espresso ist konzentrierter, nicht koffeinreicher.

### F-34 — Kosten pro Tasse

$$ c = \frac{p_{kg}}{1000}\cdot m_{dose} $$
🟢

---

## H. Zielkorridore (Validierungsgrenzen)

Diese Werte begrenzen Slider und lösen Warnungen aus.

### Golden Cup (SCA) 🟢

| Größe      | Ziel        | Akzeptabel  |
| ---------- | ----------- | ----------- |
| EY         | 20 %        | 18–22 %     |
| TDS Filter | 1,25 %      | 1,15–1,35 % |
| Brew Ratio | 1:18 (55 g/L) | 1:16–1:20 |

Anmerkung: Der Third-Wave-Konsens liegt beim TDS eher bei **1,30–1,45 %**
(entspricht 1:15–1:16) 🟡 — kräftiger als die SCA-Norm. Die App sollte den
SCA-Korridor als Referenz zeigen, aber 1,45 % nicht als Fehler markieren.

### Espresso 🟡

| Größe        | Klassisch     | Modern (helle Röstung) |
| ------------ | ------------- | ---------------------- |
| Ratio        | 1:2           | 1:2,5–1:3              |
| EY           | 18–21 %       | 20–24 %                |
| TDS          | 9–12 %        | 7–10 %                 |
| Zeit         | 25–30 s       | 25–35 s                |
| Flussrate    | 1,2–1,6 g/s   | 1,0–1,5 g/s            |
| Temperatur   | 92–94 °C      | 94–96 °C               |
| Druck        | 9 bar         | 6–9 bar                |

### Harte physikalische Grenzen 🟢

```
0   < doseG        ≤ 30      (58-mm-Korb; darüber unrealistisch)
0,5 ≤ ratio        ≤ 25
0   < waterTempC   ≤ 100
0   < tdsPct       ≤ 15
0   < ey           ≤ 30      (theoretisches Löslichkeitsmaximum)
0   < timeS        ≤ 3600
```

EY > 26 % bei einer Messung bedeutet praktisch immer **Messfehler** (schmutziges
Refraktometer, ungefilterte Probe, Temperaturdrift), nicht Rekordextraktion.
Die App sollte das als Plausibilitätswarnung ausgeben.

---

## I. Messhinweise Refraktometer

Damit F-06 überhaupt belastbar ist 🟡:

1. **Probe filtern** (Spritzenfilter) — suspendierte Feststoffe verfälschen
   den Brechungsindex nach oben, bei Espresso um bis zu 0,5 Prozentpunkte.
2. **Auf 20–25 °C abkühlen**, sonst driftet der Messwert.
3. **Dreifachmessung**, Median nehmen.
4. Prisma zwischen Messungen trocken wischen — Restfilm addiert sich.
5. Espresso vor der Messung **homogenisieren** (die Tasse ist geschichtet:
   die erste Hälfte des Shots ist deutlich konzentrierter als die zweite).

Punkt 5 ist der mit Abstand häufigste Fehler bei Espresso-Messungen.

---

## Formel-Index

| ID | Kurzname | ID | Kurzname |
|----|----------|----|----------|
| F-01 | Ratio Filter | F-18 | Schmelzverdünnung |
| F-02 | Ratio Espresso | F-19 | Milch-Dampfkondensat |
| F-03 | Zielausbringung | F-20 | Darcy |
| F-04 | Dosis aus Ziel | F-21 | Kozeny-Carman |
| F-05 | Retention / Getränkemasse | F-22 | **Mahlgrad aus Zeit** |
| F-06 | **Extraktionsausbeute** | F-23 | Mahlgradschritte |
| F-07 | Feststoffmasse | F-24 | Flussrate |
| F-08 | TDS aus EY und Ratio | F-25 | Korbfläche / Dosisdichte |
| F-09 | Ratio für Ziel-TDS | F-26 | Puckhöhe |
| F-10 | Wasser für Zielmasse | F-27 | Spez. Oberfläche |
| F-11 | Mischungs-TDS | F-28 | Diffusionszeit |
| F-12 | Americano-TDS | F-29 | Mühlenskala |
| F-13 | Americano-Wasser | F-30 | CO₂-Ausgasung |
| F-14 | **Bypass-Invariante** | F-31 | Frische-Score |
| F-15 | Bypass-Wasser | F-32 | Mahlgraddrift |
| F-16 | Mischtemperatur | F-33 | Koffein |
| F-17 | **Eismenge Flash Chill** | F-34 | Kosten/Tasse |
