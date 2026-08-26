# Faktencheck — Annahmen beider Apps gegen Fachwissen geprüft

Auftrag: Weder `barista-pwa` noch `dialed` als Autorität behandeln. Alles gegen
Fachwissen und die ASC-Kursunterlage prüfen.

**Primärquelle:** `public/asc-barista-cheatsheet.html` — Inhalte des
5-Tage-Kurses der African School of Coffee, SCA-Standards als internationale
Referenz. Das ist die Quelle, an der sich der Auftraggeber tatsächlich
ausgebildet hat, und sie schlägt im Zweifel jede allgemeine Empfehlung.

Stand: 2026-08-26

---

## 1. Von ASC bestätigt — bleibt wie es ist

| Annahme in `dialed` | ASC | Status |
|---|---|---|
| Temperatur hell 95 / mittel 93 / dunkel 90 °C | 94–96 / 92–94 / 88–92 | ✅ trifft |
| EY-Ziel 18–22 % | 18–22 % | ✅ |
| Espresso-TDS 8–11 % | 8–11 % | ✅ |
| Mahlgrad Espresso 200–400 µm | 200–400 µm | ✅ |
| Dosis 58 mm: 16–20 g | 16–20 g | ✅ |
| „Zeit ist ein Ergebnis, kein Regler" | „Time is a result. The grind is the dial." | ✅ wörtlich |
| Sauer + bitter = Technik, nicht Mahlgrad | „Sour AND bitter? Channeling — fix technique, not the grind." | ✅ wörtlich |
| Salzig = sicherstes Zeichen für Unterextraktion | „salty (surest sign)" | ✅ wörtlich |
| WDT 8–12 Bewegungen | „stir 8–12× with needles" | ✅ |
| Eben tampen schlägt fest, ~10–15 kg | „Level beats hard · ~10–15 kg is plenty · 1° tilt = channel" | ✅ |
| ±1 °C ≈ ∓0,2–0,3 EY | identisch | ✅ |
| Eine Variable pro Änderung | „One variable per change — otherwise you learn nothing." | ✅ |
| Ratio-Richtung: hell weiter, dunkel enger | Shot-Familien + „dark = shorter" | ✅ |

**Bewertung:** Der fachliche Kern von `dialed` deckt sich mit dem Kurs. Die
Wissensbasis war nicht geraten.

---

## 2. Abweichung: Espresso-Zielzeiten ⚠️

| Röstgrad | ASC | `dialed` | `barista-pwa` | Δ dialed |
|---|---|---|---|---|
| hell | 27–30 s | 31 s | 25–35 s | **+2,5 s** |
| mittel | 24–26 s | 28 s | 25–32 s | **+3,0 s** |
| dunkel | 20–23 s | 25 s | 22–28 s | **+3,5 s** |

`dialed` liegt durchgehend zu lang, `barista-pwa` zu breit und ebenfalls zu lang.

### Ursache — mein Denkfehler

ASC nennt die Zeiten **für 1:2**. `dialed` verwendet für helle Röstungen aber
1:2,7. Bei gleichem Fluss dauert mehr Ausbringung zwangsläufig länger — die
Zahlen sind so gar nicht vergleichbar.

Der eigentliche Fehler steckt tiefer: **`targetTimeRange()` ignoriert Ratio und
Dosis vollständig.** Wer die Ratio auf 1:3 stellt, bekommt weiterhin 28 s als
Ziel — und mahlt sich in die Unterextraktion.

### Korrektur: Flussrate als Zielgröße

Die dosis- und ratio-unabhängige Größe ist die Flussrate. `kb/02` (F-24) sagt das
selbst: *„diagnostisch wertvoller als die Zeit allein, weil unabhängig von der
Dosis"* — nur benutzt hat die App es nicht.

Aus ASC bei 36 g Ausbringung zurückgerechnet:

| Röstgrad | ASC-Zeit | ⇒ Zielfluss |
|---|---|---|
| hell | 28,5 s | 1,26 g/s |
| mittel-hell | – | 1,35 g/s (interpoliert) |
| mittel | 25 s | 1,44 g/s |
| mittel-dunkel | – | 1,55 g/s (interpoliert) |
| dunkel | 21,5 s | 1,67 g/s |

```
Zielzeit = Zielausbringung ÷ Zielfluss(Röstgrad)
```

Das reproduziert ASC bei 1:2 **exakt** und passt sich automatisch an, wenn Dosis
oder Ratio geändert werden. Physikalisch begründet ist die Staffelung ebenfalls:
ASC — *„dark = porous → extracts fast → tips into bitterness early"*.

Der bisher in `kb/08` genannte Flussbereich 1,2–1,6 g/s wird dadurch auf
**1,2–1,7 g/s** erweitert; dunkle Röstungen liegen am oberen Rand.

---

## 3. `barista-pwa` widerspricht sich selbst ❌

In `engine/freshness.ts`:

```ts
// Natural/honey process adds 3-7 days vs washed
```

Die zugehörige Tabelle (Espresso, helle Röstung) sagt das **Gegenteil**:

| Aufbereitung | „zu frisch" bis Tag |
|---|---|
| Washed | 7 |
| Honey | 5 |
| Natural | **3** |

Natural bekommt die **kürzeste** Ruhezeit, nicht die längste. Kommentar und
Daten stehen im Widerspruch.

**Folge:** Das Frischemodell der alten App kann nicht unbesehen übernommen
werden. Die Feinheit der Staffelung ist gut, die Richtung ist unbelegt.

---

## 4. Was ASC zur Aufbereitung wirklich sagt

Der Kurs behandelt Aufbereitung ausführlich — aber **ausschließlich als
Trocknungsvorgang auf der Farm**, nicht als Einflussgröße auf die Ruhezeit
nach der Röstung:

> Washed ~1–2½ Wochen · Honey ~1½–3 Wochen · Natural ~2½–4+ Wochen
> Alle drei trocknen auf 10–12 % Restfeuchte.

**Kein Satz zu Degassing nach Aufbereitung.** Die Behauptung „Natural braucht
3–7 Tage länger" hat in der Kursunterlage keine Grundlage.

### Was fachlich haltbar ist

| Einflussgröße auf die Ausgasung | Beleglage |
|---|---|
| **Röstgrad** | 🟡 gut belegt — dunkler = mehr CO₂ und porösere Struktur = schnellere Abgabe |
| **Bohnendichte / Anbauhöhe** | 🟠 plausibel — dichtere Bohne hält CO₂ länger |
| **Entkoffeinierung** | 🟡 gut belegt — vorgeschädigte, poröse Struktur, kürzeres Fenster |
| **Aufbereitung** | 🟠 **umstritten** — Mechanismen sprechen in beide Richtungen |

Für die Aufbereitung gibt es Argumente in beide Richtungen: Restzucker in den
äußeren Zellschichten könnten CO₂ länger halten; andererseits werden Naturals
oft etwas anders geröstet und gelten als früher trinkbar.

### Meine Entscheidung

Aufbereitung kommt ins Modell, **aber:**

1. **klein** — ±2 Tage, nicht ±7
2. **nur am oberen Ende** — die besser begründbare Aussage ist nicht „Naturals
   brauchen länger zum Starten", sondern „Naturals verlieren ihr Fruchtaroma
   früher". Also endet ihr Fenster eher, statt später zu beginnen.
3. **als 🟠 markiert** und in der Begründung sichtbar
4. **überschreibbar durch eigene Daten** — die App lernt aus den Bewertungen des
   Nutzers, an welchem Tag *seine* Naturals am besten waren

Punkt 4 ist die eigentliche Verbesserung: Statt eine umstrittene Konstante fest
zu verdrahten, wird sie zum Startwert, den die Historie korrigiert. Das kann
keine der beiden Apps.

---

## 5. Offener Widerspruch: AeroPress-Mahlgrad ⚠️

| Quelle | Skala | Klicks |
|---|---|---|
| `barista-pwa`, Kommentar „User-confirmed ranges" | 3–5 | 30–50 |
| `dialed`, aus Nachbarwerten abgeleitet | 4–6 | 40–60 |
| Mylo-Aufdruck | steht nicht drauf | – |

Auf der Mühle steht bei 3–4 „MOKAPOT" und bei 5–8 „POUR OVER". AeroPress liegt
fachlich zwischen Espresso und Pour Over, also grob 3,5–6.

**Nicht entschieden — Rückfrage an den Auftraggeber.** Ein selbst bestätigter
Wert wiegt schwerer als jede Ableitung.

---

## 6. Unbelegte Zahlen in `barista-pwa` ❌

`engine/suitability.ts` bewertet Bohnen-Methoden-Eignung auf einer 0–100-Skala:

```ts
'light': { honey: 48, natural: 42, washed: 22 }   // Espresso
```

Warum 22 und nicht 25 oder 15? Keine Quelle, keine Herleitung, keine Toleranz.
Die Rangfolge ist plausibel — heller washed Espresso ist tatsächlich
anspruchsvoll, ASC bestätigt das indirekt über die längsten Zeiten und höchsten
Temperaturen. Die **Genauigkeit ist aber vorgetäuscht.**

**Übernahme nur als grobe Klasse** (gut geeignet / geht / schwierig), nicht als
Punktzahl.

---

## 7. Eigene Lücke: Schwundfaktor

`barista-pwa` rechnet beim Bestand mit `WASTE_FACTOR = 1.12` für Retention in
der Mühle, Spülschüsse und Verschütten. `dialed` zieht nur die Dosis ab und
überschätzt die Restmenge um ~12 %.

Der Wert ist plausibel und wird übernommen — allerdings aufgeteilt, weil er nicht
für alle Methoden gleich ist: Espresso mit Einzeldosierung und Spülschuss
verliert mehr als ein abgewogener V60.

---

## 8. Ergebnisliste

| # | Befund | Konsequenz |
|---|---|---|
| 1 | Fachkern von `dialed` deckt sich mit ASC | bleibt |
| 2 | Zielzeiten zu lang, reagieren nicht auf Ratio | **Flussraten-Modell** |
| 3 | `barista-pwa` widerspricht sich bei Aufbereitung | Tabelle nicht übernehmen |
| 4 | ASC stützt Aufbereitung→Ruhezeit nicht | kleiner Effekt, 🟠, lernbar |
| 5 | AeroPress-Mahlgrad ungeklärt | Rückfrage |
| 6 | Eignungs-Punktzahlen unbelegt | nur als Klasse |
| 7 | Schwundfaktor fehlt in `dialed` | übernehmen, methodenabhängig |

---

## 9. Nachtrag: Die Mühlenskala stimmte nicht

Anlass war die offene Frage aus §5 (AeroPress-Mahlgrad). Sie ließ sich nicht
beantworten, ohne zuerst zu klären, was ein Klick auf der Mylo überhaupt
bedeutet — und dabei fiel ein Fehler in `dialed` auf.

### Das Datenblatt beschreibt etwas anderes als gedacht

Hinterlegt war `micronPerStep: 20`, aus der Herstellerangabe
*„Adjustment resolution 20 microns"*. Gegenprobe gegen den Aufdruck der Mühle:

| Aufdruck | bei 20 µm/Klick | Standardbereich | |
|---|---|---|---|
| ESPRESSO 2–3 | 400–600 µm | 200–400 µm | ✗ |
| MOKAPOT 3–4 | 600–800 µm | 350–500 µm | ✗ |
| POUR OVER 5–8 | 1000–1600 µm | 550–800 µm | ✗ |
| FRENCH PRESS 8–9 | 1600–1800 µm | 900–1200 µm | ✗ |

**Keine einzige Werksempfehlung landet in ihrem Standardbereich.** Die Angabe
beschreibt den **Mahlscheibenabstand**, nicht die entstehende Partikelgröße.
Das ist nicht dasselbe: Bohnen brechen entlang ihrer Zellstruktur, das Mahlgut
fällt kleiner aus als der eingestellte Spalt.

### Rückrechnung aus dem Aufdruck

Zwei Anker, beide aus dem Aufdruck der Mühle gegen Branchenkonsens:

```
Klick 25  ≈  300 µm   (Espresso-Mitte)
Klick 85  ≈ 1050 µm   (French-Press-Mitte)

⇒ (1050 − 300) / (85 − 25) = 12,5 µm pro Klick, Nullpunkt ≈ 0
```

Gegenprobe mit 12,5 µm/Klick:

| Aufdruck | ergibt | Standardbereich | |
|---|---|---|---|
| ESPRESSO 2–3 | 238–363 µm | 200–400 µm | ✓ |
| MOKAPOT 3–4 | 363–488 µm | 350–500 µm | ✓ |
| POUR OVER 5–8 | 613–988 µm | 550–800 µm | ✓ |
| FRENCH PRESS 8–9 | 988–1113 µm | 900–1200 µm | ✓ |

**Alle vier passen.** Der Wert ist zusätzlich plausibel: 12,5 µm/Klick ist
genau die Auflösung vergleichbarer 38-mm-Kegelmahlwerke.

Konfidenz von `vendor` auf **`measured`** gehoben — die Herleitung ist besser
belegt als die Herstellerangabe.

### Damit ist §5 beantwortet

AeroPress steht nicht auf der Mühle, hat aber die größte Rezeptspanne der drei
Methoden. Ein einzelner Bereich wäre die falsche Antwort:

| Stil | Ziel µm | Klicks | Mylo-Skala |
|---|---|---|---|
| Espresso-Style (Prismo) | 250–350 | 20–28 | 2,0–2,8 |
| Championship (45 s) | 350–450 | 28–36 | 2,8–3,6 |
| Hoffmann (2:30) | 400–500 | 32–40 | 3,2–4,0 |
| Konzentrat + Bypass | 400–550 | 32–44 | 3,2–4,4 |
| **Standard (90 s)** | **450–600** | **36–48** | **3,6–4,8** |
| Lange Ziehzeit (3–5 min) | 600–800 | 48–64 | 4,8–6,4 |
| Cold Brew | 1000–1300 | 80–104 | 8,0–10,4 |

**Auflösung des Widerspruchs:**

| Quelle | Angabe | Bewertung |
|---|---|---|
| `barista-pwa` | 3,0–5,0 | nah dran; unten etwas zu fein |
| `dialed` (alt) | 4,0–6,0 | oben deutlich zu grob |
| **hergeleitet** | **3,6–4,8** | für das Standardrezept |

Der Auftraggeber hatte den alten Wert nach eigener Aussage nicht bewusst
bestätigt — der Kommentar „user-confirmed" in `barista-pwa` war also selbst
eine unbelegte Behauptung. Gut, dass wir nicht darauf gebaut haben.

### Nebenwirkung

Die Mahlgradkorrektur rechnet über `micronPerStep` von Prozent in Klicks um.
Mit 12,5 statt 20 µm ergibt dieselbe relative Änderung **mehr Klicks** —
eine 12-%-Korrektur bei 300 µm sind jetzt 3 Klicks statt 2. Das entspricht
der Erfahrung an Handmühlen besser.
