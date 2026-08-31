# 10 — AeroPress

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Immersion mit Druckabschluss. Sehr fehlerverzeihend und
die mit dem größten Rezeptspielraum.

---

## 1. Warum die AeroPress anders funktioniert

| Eigenschaft | Konsequenz |
| ----------- | ---------- |
| **Immersion statt Perkolation** | Die Konzentration im Wasser steigt, das Gefälle sinkt → die Extraktion läuft asymptotisch aus. Nach ~2 min passiert wenig Zusätzliches. |
| **Kein Bett zum Durchströmen** | **Channeling ist physikalisch unmöglich.** Kein Puck-Prep, keine Verteilungsfehler. |
| **Druck erst am Ende** | Der Pressvorgang extrahiert kaum, er trennt nur. 0,3–0,8 bar — Größenordnungen unter Espresso. |
| **Kurzer Papierweg** | Fines gelangen leichter durch als beim V60 → mehr Körper. |
| **Kleines Volumen (max. ~250 g)** | Größere Mengen brauchen zwingend Bypass. |

**Die entscheidende praktische Folge:** Die Zeitsensitivität ist rund halb so
groß wie beim V60. Eine Diagnose-Engine, die für alle Methoden dieselben
Zeitkorrekturen vorschlägt, ist bei der AeroPress systematisch zu aggressiv.

---

## 2. Zwei Grundmodi

### 2.1 Standard (aufrecht)

Kammer auf die Tasse, Filter unten. Es tropft während der Ziehzeit bereits
durch — Immersion *und* Perkolation gemischt.

- Einfacher, sicherer
- Weniger kontrollierbar (das Durchtropfen ist unkontrollierte Extraktion)
- Für kurze Ziehzeiten (< 1:30) gut geeignet

### 2.2 Inverted (invertiert)

Kammer umgedreht, Kolben unten, Filterkappe erst am Ende aufgesetzt.

- **Volle Kontrolle über die Ziehzeit** — nichts läuft vorzeitig durch
- Rühren jederzeit möglich
- Pflicht für Ziehzeiten > 1:30
- Risiko: Beim Umdrehen kann heißer Kaffee auslaufen — nur mit fest sitzender
  Kappe und über der Tasse umdrehen

**Empfehlung für die App:** `inverted: boolean` als Rezeptvariable führen und
bei `steepS > 90` automatisch invertiert vorschlagen.

---

## 3. Filter

| Filter | Durchlass | Körper | Klarheit | Bemerkung |
| ------ | --------- | ------ | -------- | --------- |
| **Papier (Original)** | fein | mittel | hoch | Standard; spülen empfohlen |
| **Papier, 2 Lagen** | sehr fein | niedrig | sehr hoch | langsamer Press, sehr sauber |
| **Metall (fein)** | mittel | hoch | mittel | Öle bleiben → mehr Textur, wiederverwendbar |
| **Metall (grob)** | grob | sehr hoch | niedrig | French-Press-artig |
| **Prismo (Ventil)** | fein + Rückschlagventil | hoch | mittel | ermöglicht echte Immersion aufrecht + höheren Druck |

Papierfilter binden Cafestol und Kahweol (Diterpene). Metallfilter lassen sie
durch — geschmacklich mehr Körper, ernährungsphysiologisch relevanter
Unterschied bei sehr hohem Konsum.

---

## 4. Rezepte

### 4.1 Standard (Alltag, ausgewogen)

```
Modus:      invertiert
Dosis:      16 g
Wasser:     240 g        (1:15)
Mahlgrad:   mittel, ~600 µm
Temp:       92 °C

0:00  Wasser komplett aufgießen
0:10  2× rühren
0:10–1:30  ziehen lassen
1:30  Filterkappe drauf, umdrehen
1:35  pressen, ~25 s, gleichmäßig
      Beim ersten Zischen aufhören
```

### 4.2 Konzentrat + Bypass (für größere Tassen und Iced)

```
Modus:      invertiert
Dosis:      18 g
Wasser:     120 g        (1:6,7 — Konzentrat)
Mahlgrad:   mittel-fein
Temp:       94 °C

0:00  aufgießen, 3× rühren
2:00  pressen (~30 s)
      → ca. 93 g Konzentrat, TDS ~3,5 %
danach: mit 130 g heißem Wasser auf ~223 g verdünnen
      → TDS ~1,45 %
```

**Rechnung nach F-15:** Konzentrat 93 g bei 3,5 % TDS auf 1,45 % bringen
→ $m_{bypass} = 93\cdot(3{,}5/1{,}45 - 1) = 93\cdot1{,}414 = 131$ g ✅

**Wichtig (F-14):** Bypass ändert die Stärke, **nicht** die EY. Wer mit Bypass
gegen Bitterkeit ankämpft, verdünnt nur bittere Flüssigkeit.

### 4.3 James Hoffmann Ultimate AeroPress

```
Modus:      aufrecht (Standard)
Dosis:      11 g
Wasser:     200 g        (1:18)
Mahlgrad:   fein (feiner als üblich!)
Temp:       100 °C

0:00  aufgießen
0:00–2:00  ziehen (nicht rühren)
2:00  sanft swirlen, 30 s absetzen lassen
2:30  sehr langsam pressen (~30 s)
```

Kennzeichen: geringe Dosis, feiner Mahlgrad, lange Zeit, kein Rühren.
Ergibt eine klare, teeartige, sehr saubere Tasse.

### 4.4 Championship-Stil (WAC-typisch)

```
Modus:      invertiert
Dosis:      18 g
Wasser:     60 g heiß + Bypass
Mahlgrad:   fein (espressonah)
Temp:       85 °C (bewusst niedrig)

0:00  60 g aufgießen, kräftig rühren
0:45  pressen
      → ~40 g sehr konzentriert
danach: mit 120–160 g Wasser bei ~70 °C verdünnen
```

Prinzip: niedrige Temperatur + feiner Mahlgrad + kurze Zeit → hohe Süße bei
sehr geringer Bitterkeit. Danach auf Trinkstärke verdünnt. Die niedrige
Temperatur ist kein Fehler, sondern das zentrale Stilmittel.

### 4.5 Espresso-Style (Prismo)

```
Modus:      aufrecht mit Prismo
Dosis:      18 g
Wasser:     55 g
Mahlgrad:   fein (espressonah)
Temp:       93 °C

0:00  aufgießen, rühren
0:30  kräftig pressen, ~30 s
      → ~45 g, TDS ~5–7 %
```

**Ehrliche Einordnung:** Das ist **kein Espresso**. Der erreichbare Druck liegt
bei etwa 1–2 bar statt 9. Es entsteht keine echte Emulsion und keine stabile
Crema. Als Basis für einen milchbasierten Drink ohne Siebträger ist es
trotzdem brauchbar — die App sollte es als eigene Kategorie
(`espresso-style`) führen und nicht mit `espresso` vermischen, sonst werden
Ratios und Diagnosen unsinnig.

### 4.6 Cold Brew in der AeroPress

```
Modus:      invertiert
Dosis:      20 g
Wasser:     200 g Raumtemperatur   (1:10)
Mahlgrad:   grob
Zeit:       1–2 min kräftig rühren, dann 8–12 h kühl stehen lassen
danach:     pressen, mit Wasser/Milch 1:1 verdünnen
```

Deutlich schneller als klassisches Cold Brew (12–24 h) bei ähnlichem Ergebnis,
weil die Immersion durch das Rühren beschleunigt wird.

---

## 5. Variablen und ihre Wirkung

| Variable | Bereich | Wirkung |
| -------- | ------- | ------- |
| **Ratio** | 1:6 (Konzentrat) – 1:18 | Stärke |
| **Mahlgrad** | fein – grob | EY; wirkt schwächer als beim V60 |
| **Temperatur** | 70–100 °C | EY und Bitterkeit; **der unterschätzte Regler** |
| **Ziehzeit** | 30 s – 10 min | EY, aber asymptotisch |
| **Rühren** | 0–5× | Agitation → EY; wirksamer als Zeitverlängerung |
| **Pressdruck** | sanft – kräftig | minimal auf EY; stärker auf Körper und Fines |
| **Presszeit** | 10–60 s | marginal |
| **Bypass** | 0–200 g | **nur** Stärke, nie EY (F-14) |

### 5.1 Temperatur als Hauptregler

Die AeroPress ist die einzige Methode, bei der niedrige Temperaturen
(75–85 °C) ein etabliertes Stilmittel sind, kein Fehler.

| Temp | Wirkung |
| ---- | ------- |
| 100 °C | maximale Extraktion; bei hellen Röstungen gut, bei dunklen bitter |
| 92–95 °C | Standard |
| 85 °C | süßer, weniger Bitterkeit, weniger Körper |
| 75–80 °C | sehr süß und mild; braucht feineren Mahlgrad oder längere Zeit als Ausgleich |

**Grund:** Bitterstoffe (Chlorogensäure-Laktone, Phenylindane) haben eine
stärkere Temperaturabhängigkeit ihrer Löslichkeit als Zucker und Säuren. Bei
niedrigerer Temperatur verschiebt sich das Verhältnis zugunsten der süßen
Fraktion. Man extrahiert insgesamt weniger, aber **selektiver**.

### 5.2 Rühren vs. Zeit

Rühren ist der effizientere Hebel: 2× Rühren wirkt ungefähr wie 30–45 s mehr
Ziehzeit 🟠 — bei gleichzeitig gleichmäßigerer Extraktion, weil die gesättigten
Grenzschichten aufgebrochen werden (kb/01 §3.3).

**Für die Engine:** Bei „zu sauer / unterextrahiert" ist bei der AeroPress
`stirCount + 1` oft der bessere erste Vorschlag als eine Mahlgradkorrektur —
er ist reversibel, kostet keine neue Einstellung und wirkt sofort.

---

## 6. Diagnose

| Symptom | Ursache | Korrektur |
| ------- | ------- | --------- |
| Sauer, dünn | Unterextraktion | feiner; +1 Rührvorgang; heißer; länger ziehen |
| Bitter, trocken | Überextraktion | gröber; **kühler** (stärkster Hebel); kürzer |
| Wässrig, aber nicht sauer | Ratio zu weit | Ratio enger (weniger Wasser) |
| Zu intensiv, aber sauber | Ratio zu eng | Bypass zugeben (F-15) |
| Sehr schwer zu pressen | zu fein / zu viel Kaffee | gröber; Dosis reduzieren |
| Presst sich ohne Widerstand | zu grob | feiner |
| Trüb, viel Satz in der Tasse | zu fein + kräftig gepresst | gröber; sanfter pressen; 2 Papierfilter |
| Papiergeschmack | Filter nicht gespült | spülen |
| Schmeckt jedes Mal anders | Ziehzeit/Rühren nicht konstant | Timer nutzen, Rührzahl fixieren |

**Was hier fehlt und beim Espresso zentral ist:** Kein Channeling, kein
Puck-Prep, keine Verteilungsfehler. Wenn eine AeroPress „sauer und bitter
zugleich" schmeckt, ist die Ursache **nicht** ungleichmäßige Durchströmung,
sondern fast immer eine sehr breite Partikelverteilung (stumpfe/dejustierte
Mühle, kb/07 §3.3) oder eine unterentwickelte Röstung (kb/05 §1.2).

---

## 7. Ablauf (App-Schrittfolge, invertiert)

```
STEP 1   Wasser aufsetzen
STEP 2   Kolben ~1 cm in die Kammer, umgedreht auf die Waage stellen
STEP 3   Filter in die Kappe, mit heißem Wasser spülen
STEP 4   Bohnen wiegen, mahlen (RDT)
STEP 5   Mahlgut einfüllen, Waage tarieren
STEP 6   TIMER START — Wasser aufgießen bis Zielmasse
STEP 7   Rühren (Anzahl aus dem Rezept)
STEP 8   Ziehen lassen bis steepS
STEP 9   Kappe aufsetzen und festdrehen
STEP 10  Über der Tasse umdrehen
STEP 11  Gleichmäßig pressen (~25 s) — beim Zischen stoppen
STEP 12  Bypass zugeben (falls im Rezept)
STEP 13  Verkosten und bewerten
```

**Sicherheitshinweis in der UI vor STEP 10:** Kappe auf festen Sitz prüfen.
Das ist der einzige Schritt aller Methoden mit echtem Verbrühungsrisiko.

---

## 8. Warum die AeroPress in der App eine Sonderrolle verdient

Sie ist das ideale **Lernwerkzeug**:

- Kein Channeling → eine Fehlerquelle weniger, Ursache-Wirkung wird eindeutig
- Sehr schnelle Iteration (2 min pro Durchgang statt 4 min beim V60)
- Riesiger Parameterraum → man kann Extremwerte gefahrlos ausprobieren
- Wenig Kaffeeverbrauch pro Versuch

**Empfehlung:** Ein Onboarding-Modus „Verstehe Extraktion in 4 Tassen" auf
AeroPress-Basis — vier Durchgänge mit systematisch variierten Einzelvariablen
(zu grob / zu fein / zu kalt / richtig), bei dem der Nutzer die
Geschmacksunterschiede selbst kalibriert. Das ist mit keiner anderen Methode
so schnell und so eindeutig möglich.
