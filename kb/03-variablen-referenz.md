# 03 — Variablen-Referenz

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Jede Größe, die in der App eingegeben, angezeigt oder berechnet wird.
Diese Tabellen definieren **Slider-Grenzen, Schrittweiten, Defaults,
Validierungsregeln und Tooltips**. Maschinenlesbar in `data/variables.json`.

**Spaltenbedeutung**
- **Sens.** = Sensitivität: Wie stark verändert ein Schritt das Ergebnis?
  `***` = dominant, `**` = deutlich, `*` = fein, `–` = marginal
- **Prio** = Reihenfolge in der Korrekturkaskade (kb/14). 1 = zuerst anfassen.

---

## 1. Primärvariablen — Espresso

| Variable        | Einheit | Min | Max  | Default | Schritt | Sens. | Prio |
| --------------- | ------- | --- | ---- | ------- | ------- | ----- | ---- |
| `doseG`         | g       | 7   | 25   | 18      | 0,1     | *     | 4    |
| `yieldG`        | g       | 10  | 90   | 36      | 0,5     | **    | 2    |
| `ratio`         | –       | 1,0 | 5,0  | 2,0     | 0,1     | **    | 2    |
| `grindSetting`  | Schritte| –   | –    | –       | 1       | ***   | 1    |
| `timeS`         | s       | 10  | 60   | 28      | 1       | **    | –¹   |
| `waterTempC`    | °C      | 85  | 100  | 93      | 0,5     | *     | 3    |
| `pressureBar`   | bar     | 3   | 12   | 9       | 0,5     | *     | 5    |
| `preinfusionS`  | s       | 0   | 20   | 5       | 1       | *     | 5    |

¹ `timeS` ist **Ergebnis**, keine Stellgröße. Man stellt sie nicht ein, man
beobachtet sie und korrigiert über den Mahlgrad (F-22). Die App darf sie deshalb
nicht als Slider anbieten, sondern nur als Ziel-/Ist-Anzeige.

**Abhängigkeiten:** `yieldG = doseG × ratio` (F-03). Die UI sollte zwei der drei
Felder frei lassen und das dritte berechnen. Empfohlen: Nutzer stellt `doseG` und
`ratio`, `yieldG` folgt.

### Dosisgrenzen nach Korbgröße (F-25)

| Korb-Ø | Übliche Dosis | Absolut max. |
| ------ | ------------- | ------------ |
| 58 mm  | 16–20 g       | 25 g         |
| 54 mm  | 14–17 g       | 21 g         |
| 53 mm  | 13–16 g       | 20 g         |
| 51 mm  | 12–15 g       | 18 g         |

Überdosierung erzeugt zu wenig Headspace: Der gequollene Puck drückt gegen die
Brausescheibe, das Wasser kann sich nicht verteilen → Channeling am Rand.
Unterdosierung erzeugt zu viel Headspace: Das Bett schwimmt auf, kippt und
kanalisiert. Beides ist ein Technik-, kein Extraktionsproblem.

---

## 2. Primärvariablen — V60

| Variable       | Einheit | Min | Max | Default | Schritt | Sens. | Prio |
| -------------- | ------- | --- | --- | ------- | ------- | ----- | ---- |
| `doseG`        | g       | 10  | 60  | 18      | 0,5     | *     | 4    |
| `waterG`       | g       | 150 | 900 | 300     | 5       | **    | 2    |
| `ratio`        | –       | 12  | 20  | 16,7    | 0,1     | **    | 2    |
| `grindSetting` | Schritte| –   | –   | –       | 1       | ***   | 1    |
| `waterTempC`   | °C      | 80  | 100 | 94      | 1       | **    | 3    |
| `bloomWaterG`  | g       | 0   | 150 | 2,5×Dosis| 1      | *     | 5    |
| `bloomTimeS`   | s       | 0   | 60  | 40      | 5       | *     | 5    |
| `pourCount`    | –       | 1   | 8   | 3       | 1       | **    | 4    |
| `totalTimeS`   | s       | 90  | 360 | 165     | 5       | **    | –¹   |
| `drawdownS`    | s       | 10  | 180 | 35      | 1       | –     | –²   |

¹ Ergebnis, keine Stellgröße — wie beim Espresso.
² Reine **Diagnosegröße**. Drawdown = Zeit vom Ende des letzten Gusses bis zum
letzten Tropfen. Der beste Einzelindikator für Verstopfung durch Fines.

**Größenabhängigkeit der Zielzeit** (V60-02) 🟡:

| Dosis | Wasser (1:16,7) | Zielzeit gesamt |
| ----- | --------------- | --------------- |
| 12 g  | 200 g           | 2:00 – 2:30     |
| 15 g  | 250 g           | 2:15 – 2:45     |
| 18 g  | 300 g           | 2:30 – 3:00     |
| 22 g  | 370 g           | 2:45 – 3:15     |
| 30 g  | 500 g           | 3:15 – 4:00     |

> **Wichtig für die App:** Die Zielzeit skaliert mit der Dosis, aber **nicht
> linear**. Ein festes Zeitziel von „2:30" für alle Größen ist der häufigste
> Fehler in V60-Rezept-Apps. Bei 30 g führt es zu massiver Unterextraktion,
> weil der Nutzer zu grob mahlt, um die Zeit zu halten.

---

## 3. Primärvariablen — AeroPress

| Variable        | Einheit | Min | Max | Default | Schritt | Sens. | Prio |
| --------------- | ------- | --- | --- | ------- | ------- | ----- | ---- |
| `doseG`         | g       | 10  | 30  | 16      | 0,5     | *     | 4    |
| `waterG`        | g       | 60  | 250 | 240     | 5       | **    | 2    |
| `ratio`         | –       | 6   | 18  | 15      | 0,5     | **    | 2    |
| `grindSetting`  | Schritte| –   | –   | –       | 1       | **    | 1    |
| `waterTempC`    | °C      | 70  | 100 | 92      | 1       | **    | 3    |
| `steepS`        | s       | 30  | 600 | 90      | 5       | *     | 3    |
| `pressS`        | s       | 10  | 60  | 25      | 5       | –     | 5    |
| `stirCount`     | –       | 0   | 10  | 2       | 1       | *     | 4    |
| `bypassG`       | g       | 0   | 250 | 0       | 5       | –³    | –    |
| `inverted`      | bool    | –   | –   | false   | –       | –     | –    |
| `filterType`    | enum    | –   | –   | paper   | –       | *     | 5    |

³ Bypass verändert die EY **nicht** (F-14) — nur die Stärke. In der
Diagnose-Engine darf `bypassG` deshalb nie als Antwort auf „zu bitter" oder
„zu sauer" vorgeschlagen werden.

**Kapazitätsgrenze:** Die AeroPress-Kammer fasst bis Markierung 4 rund 250 g
Wasser. Rezepte mit mehr Wasser **müssen** über Bypass laufen (Konzentrat
brühen, danach verdünnen). Die App sollte das automatisch erkennen:
`if (waterG > 250) → bypass-Modus vorschlagen`.

**Wassertemperatur:** Der Bereich beginnt bei 70 °C, nicht bei 80 °C. Die
AeroPress ist die einzige der drei Methoden, bei der niedrige Temperaturen
(75–85 °C) ein etabliertes Stilmittel sind — sie reduzieren Bitterkeit bei
dunklen Röstungen und sehr feinem Mahlgrad drastisch.

---

## 4. Milchvariablen

| Variable         | Einheit | Min | Max | Default | Sens. |
| ---------------- | ------- | --- | --- | ------- | ----- |
| `milkG`          | g       | 30  | 400 | 150     | **    |
| `milkStartTempC` | °C      | 2   | 10  | 4       | –     |
| `milkTargetTempC`| °C      | 50  | 70  | 60      | **    |
| `foamClass`      | enum    | –   | –   | microfoam-standard | ** |
| `milkType`       | enum    | –   | –   | whole   | **    |
| `overrunPct`     | %       | 0   | 100 | 15      | **    |

**Harte Grenzen** 🟢:
- **> 70 °C**: Molkenproteine denaturieren irreversibel, Schwefelnoten
  („gekocht"), Schaum kollabiert. Die App muss oberhalb 68 °C warnen.
- **< 50 °C**: Getränk wird als lauwarm empfunden.
- **Süße-Optimum bei 55–62 °C** 🟡 — dort ist die wahrgenommene Süße maximal.

---

## 5. Wasservariablen

| Variable       | Einheit    | SCA-Ziel | Akzeptabel | Sens. |
| -------------- | ---------- | -------- | ---------- | ----- |
| `tdsMgL`       | mg/L       | 150      | 75–250     | **    |
| `ghMgL`        | mg/L CaCO₃ | 68       | 17–85      | **    |
| `khMgL`        | mg/L CaCO₃ | 40       | 20–60      | ***   |
| `ph`           | –          | 7,0      | 6,5–7,5    | *     |
| `naMgL`        | mg/L       | 10       | < 30       | *     |
| `chlorineMgL`  | mg/L       | 0        | 0          | ***   |

Details, Umrechnungen und DIY-Rezepte: kb/06.

---

## 6. Bohnen- und Kontextvariablen

| Variable        | Typ     | Bereich       | Sens. | Anmerkung                          |
| --------------- | ------- | ------------- | ----- | ---------------------------------- |
| `roastLevel`    | enum    | 5 Stufen      | ***   | steuert fast alle Defaults         |
| `agtron`        | number  | 25–95         | ***   | präziser als `roastLevel`          |
| `daysOffRoast`  | number  | 0–120         | **    | berechnet, siehe F-31              |
| `process`       | enum    | 9 Werte       | *     | beeinflusst Löslichkeit leicht     |
| `altitudeMasl`  | number  | 400–2300      | *     | höher → dichter → feiner mahlen    |
| `densityGL`     | number  | 280–450       | *     | direkter Proxy für Härte der Bohne |

### Röstgrad → Startwerte 🟡

| Röstgrad      | Agtron | Espresso-Ratio | Espresso-Temp | V60-Temp | V60-Ratio |
| ------------- | ------ | -------------- | ------------- | -------- | --------- |
| hell          | 75–95  | 1:2,5–1:3,0    | 94–96 °C      | 96–99 °C | 1:15–1:16 |
| mittel-hell   | 65–75  | 1:2,2–1:2,6    | 93–95 °C      | 94–96 °C | 1:16      |
| mittel        | 55–65  | 1:2,0–1:2,3    | 92–94 °C      | 93–95 °C | 1:16–1:17 |
| mittel-dunkel | 45–55  | 1:1,8–1:2,1    | 90–93 °C      | 90–93 °C | 1:16–1:17 |
| dunkel        | 25–45  | 1:1,7–1:2,0    | 88–92 °C      | 86–91 °C | 1:17–1:18 |

**Logik dahinter:** Helle Röstungen sind dichter und schlechter löslich →
mehr Wasser, mehr Hitze, längerer Kontakt. Dunkle Röstungen sind porös und
brüchig → sie extrahieren leicht und kippen schnell in die Bitterkeit →
weniger Wasser, weniger Hitze.

**Mahlgrad-Offset nach Röstgrad** (relativ zum Mittel-Referenzpunkt) 🟠:

| Röstgrad      | Espresso  | V60       |
| ------------- | --------- | --------- |
| hell          | −2 bis −4 Schritte (feiner) | −1 bis −2 |
| mittel        | Referenz  | Referenz  |
| dunkel        | +2 bis +3 Schritte (gröber) | +1 bis +2 |

---

## 7. Beobachtungsvariablen (kategorial)

Nutzereingaben, die kein Zahlenwert sind, aber die Diagnose steuern.

### `flowState` — Espresso

| Wert        | Definition                                    | Auslöser                    |
| ----------- | --------------------------------------------- | --------------------------- |
| `choked`    | > 45 s, kaum Fluss                            | viel zu fein / überdosiert  |
| `slow`      | 10–40 % über Zielzeit                         | zu fein                     |
| `normal`    | ±10 % um Zielzeit, gleichmäßiger Strang       | –                           |
| `fast`      | 10–40 % unter Zielzeit                        | zu grob                     |
| `gusher`    | < 15 s, wässrig                               | viel zu grob / Kanal        |
| `uneven`    | mehrere Ströme, ungleich lang                 | **Channeling**              |
| `spritzing` | seitliches Spritzen, Tropfen an der Korbwand  | **Channeling**              |

> `uneven` und `spritzing` **sperren F-22** — die Zeit ist bei Channeling kein
> gültiges Maß für den Mahlgrad.

### `puckState` — Espresso, nach dem Shot

| Wert          | Aussehen                        | Bedeutung                            |
| ------------- | ------------------------------- | ------------------------------------ |
| `even`        | fest, trocken, glatt            | ✅ gut                                |
| `wet-soupy`   | matschig, formlos               | Ratio/Dosis unpassend, Headspace zu groß |
| `dry-cracked` | trocken mit Rissen              | oft normal; große Risse = Channeling |
| `crater`      | Loch in der Mitte               | zentraler Kanal, Verteilungsfehler   |
| `sideChannel` | Rinne/Auswaschung am Rand       | Randkanal, meist Tamping schief      |

### `bloomBehavior` — V60/AeroPress

| Wert         | Bedeutung                                              |
| ------------ | ------------------------------------------------------ |
| `vigorous`   | starkes Aufblähen → sehr frisch (< 7 d)                |
| `moderate`   | ✅ ideal                                                |
| `flat`       | kaum Reaktion → alt (> 30 d) oder Wasser zu kalt       |
| `uneven`     | trockene Stellen → Wasser zu schnell oder zu zentral   |

### `drawdown` — V60, abgeleitet aus `drawdownS`

| Klasse   | Anteil an Gesamtzeit | Bedeutung                       |
| -------- | -------------------- | ------------------------------- |
| `fast`   | < 15 %               | zu grob oder Bett zu flach      |
| `normal` | 15–30 %              | ✅                               |
| `slow`   | 30–45 %              | zu fein, viele Fines            |
| `stalled`| > 45 %               | verstopft, hohe Überextraktion  |

---

## 8. Messvariablen

| Variable         | Einheit | Bereich  | Auflösung | Pflicht |
| ---------------- | ------- | -------- | --------- | ------- |
| `tdsPct`         | %       | 0,5–15   | 0,01      | nein    |
| `beverageMassG`  | g       | 10–1000  | 0,1       | nein    |
| `extractionYield`| %       | 10–30    | berechnet | –       |
| `brewTempC`      | °C      | 70–100   | 0,1       | nein    |
| `rating`         | 1–5     | –        | 1         | ja      |

**Regel:** Liegt `tdsPct` vor, hat die objektive Diagnose (kb/14, Teil A)
Vorrang vor der sensorischen (Teil B). Bei Widerspruch zeigt die App beide
und weist auf die Differenz hin — meist ein Hinweis auf ungleichmäßige
Extraktion (kb/01 §1.3) oder ein Wasserproblem (kb/06).

---

## 9. Wechselwirkungen (die Fallen)

Diese Kopplungen muss die App kennen, sonst gibt sie widersprüchliche Ratschläge.

| Ändere ich …           | … ändert sich unbeabsichtigt mit           | Kompensation                          |
| ---------------------- | ------------------------------------------ | ------------------------------------- |
| Mahlgrad feiner        | Shotzeit ↑, EY ↑, Channelingrisiko ↑       | ggf. Dosis −0,5 g                     |
| Dosis ↑ (Ratio fix)    | Yield ↑, Zeit ↑, Headspace ↓               | Mahlgrad ~1 Schritt gröber            |
| Ratio weiter           | Zeit ↑, TDS ↓, EY ↑                        | bewusste Doppelwirkung, kein Fehler   |
| Temperatur ↑           | EY ↑, Flussrate ↑ (Viskosität ↓)           | minimal, meist vernachlässigbar       |
| Bohne 10 Tage älter    | Widerstand ↓, Zeit ↓, EY ↓                 | ~1 Schritt feiner (F-32)              |
| Korb 58 → 54 mm        | Dosisdichte ↑ bei gleicher Dosis           | Dosis über F-25 skalieren             |
| Filterpapier gewechselt| Drawdown ±20 %                             | Mahlgrad nachziehen                   |
| Milch heißer           | Süße ↓ über 62 °C, Schaum instabil > 68 °C | Zieltemperatur senken                 |
| GH ↑                   | EY ↑ bei gleichem Rezept                   | Mahlgrad 1 Schritt gröber             |
| KH ↑                   | wahrgenommene Säure ↓, EY unverändert      | **nicht** über Mahlgrad korrigieren   |

Die letzte Zeile ist der wichtigste Eintrag der Tabelle: **Karbonathärte
verändert den Geschmack, ohne die Extraktion zu verändern.** Wer darauf mit
Mahlgrad reagiert, verschlechtert einen objektiv korrekten Kaffee.

---

## 10. Anzeige-Rundung

| Größe        | Nachkommastellen | Beispiel |
| ------------ | ---------------- | -------- |
| Dosis        | 1                | 18,0 g   |
| Ausbringung  | 1                | 36,5 g   |
| Ratio        | 1 (bzw. 2 unter 3) | 1:2,4  |
| Zeit         | 0, als `m:ss`    | 2:35     |
| Temperatur   | 0                | 93 °C    |
| TDS          | 2                | 1,38 %   |
| EY           | 1                | 20,2 %   |
| Flussrate    | 2                | 1,44 g/s |
| Koffein      | Spanne, gerundet auf 5 | 90–120 mg |
