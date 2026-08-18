# 15 — Dial-in: Algorithmen

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Dial-in ist kein Bauchgefühl, sondern ein Suchverfahren mit definierten
Schritten und Abbruchkriterien. Dieses Kapitel spezifiziert es als Algorithmus.

---

## 1. Startpunkt bestimmen

Die wichtigste Funktion der App. Ein guter Startpunkt spart drei Durchgänge.

```js
function getStartingPoint(bean, bag, method, equipment, logs) {

  // 1) Persönliche Referenz für genau diese Bohne
  const own = logs
    .filter(l => l.beanId === bean.id && l.method === method && l.rating >= 4)
    .sort(byRatingThenRecency)
  if (own.length) {
    return withFreshnessCorrection(own[0], bag)   // → §2
  }

  // 2) Transfer von einer ähnlichen Bohne
  const similar = logs.filter(l =>
       l.method === method
    && l.rating >= 4
    && sameRoastBand(l.bean, bean)         // ±1 Röstgradstufe
    && sameProcessFamily(l.bean, bean)     // washed | natural | honey
  ).sort(bySimilarityScore)
  if (similar.length) {
    return withOriginAdjustment(similar[0], bean)  // → §3
  }

  // 3) Methodendefault + Bohnenmodifikatoren
  return applyModifiers(
    methodDefaults[method][bean.roastLevel],
    bean, bag, equipment
  )
}
```

### 1.1 Ähnlichkeitsmaß

```js
similarity(a, b) =
    3 * (a.roastLevel === b.roastLevel ? 1 : a.roastBandDistance <= 1 ? 0.5 : 0)
  + 2 * (a.process === b.process ? 1 : sameProcessFamily ? 0.5 : 0)
  + 2 * (a.origins ∩ b.origins ? 1 : sameContinent ? 0.4 : 0)
  + 1 * (|a.altitude − b.altitude| < 300 ? 1 : 0)
  + 1 * (a.density && b.density && |Δ| < 30 ? 1 : 0)
```

Nur Transfers mit Score ≥ 5 verwenden. Darunter ist der Methodendefault
verlässlicher als eine schlechte Analogie.

### 1.2 Modifikatorenkette

Auf den Basiswert werden additiv aufgeschlagen (kb/03 §6, kb/04 §7, kb/05 §7):

```
grindSteps  = base
            + roastLevelOffset          hell −2..−4 · dunkel +2..+3
            + altitudeOffset            > 1800 masl: −1..−2
            + densityOffset             > 400 g/L:   −1
            + processOffset             natural: +1
            + decafOffset               +1..+2
            + frozenOffset              +1..+2
            + ageOffset                 F-32: −0,08 × (Tage − Referenz)

tempC       = base
            + roastLevelOffset          hell +2..+3 · dunkel −2..−4
            + altitudeOffset            > 1800 masl: +1..+2
            + decafOffset               −2

ratio       = base
            + roastLevelOffset          hell +0,3..+0,8 · dunkel −0,2..−0,3
```

---

## 2. Frische-Korrektur (F-32)

Wenn eine persönliche Referenz existiert, ist sie fast nie taggleich.

```js
function withFreshnessCorrection(ref, bag) {
  const dRef = daysBetween(ref.bag.roastDate, ref.createdAt)
  const dNow = daysBetween(bag.roastDate, today)
  const drift = dNow - dRef

  if (method === 'espresso' && Math.abs(drift) >= 6) {
    const steps = Math.round(-0.08 * drift)   // ~1 Schritt je 12 Tage
    return { ...ref, grindSteps: ref.grindSteps + steps,
             note: `Bohne ist ${drift} Tage älter — ${Math.abs(steps)} Klick(s) feiner.` }
  }
  return ref
}
```

**Vorzeichen:** `drift > 0` (älter) → `steps` negativ → **feiner**. Die Bohne
ist entgast, das Bett bietet weniger Widerstand, ohne Korrektur läuft der Shot
zu schnell.

> Das ist der Vorschlag, den die App exklusiv leisten kann. Kein Buch, kein
> Rezept und kein Barista im Café kennt das Röstdatum *deines* letzten guten
> Shots. Die App kennt es.

---

## 3. Espresso-Dial-in

### 3.1 Ablauf

```
PHASE A — DOSIS FIXIEREN
  Korbgröße → Dosisdichte 0,68 g/cm² (F-25)
  58 mm → 18 g · 54 mm → 15,5 g · 53 mm → 15 g
  ⇒ Diese Zahl wird ab jetzt NICHT mehr verändert.

PHASE B — RATIO FIXIEREN
  Röstgrad → Ratio (kb/08 §3.1)
  ⇒ Zielausbringung berechnen (F-03). Auch diese bleibt fest.

PHASE C — MAHLGRAD SUCHEN            ← hier passiert alles
  Ziel: die fixierte Ausbringung in der Zielzeit erreichen
  1. Shot ziehen, Zeit messen
  2. Wenn flowState ∈ {uneven, spritzing} → Puck Prep (D-01), Shot verwerfen
  3. Sonst: Korrektur nach F-22
       factor = √(t_ist / t_ziel)
       steps  = round(d_aktuell × (factor − 1) / µm_pro_step)
  4. Wiederholen, bis |t_ist − t_ziel| ≤ 2 s

PHASE D — VERKOSTEN UND FEINJUSTIEREN
  Zeit stimmt, Geschmack noch nicht:
    sauer  → Temp +2 °C, dann Ratio +0,2
    bitter → Temp −2 °C, dann Ratio −0,2
  Immer nur eine Änderung pro Durchgang.

PHASE E — SPEICHERN
  rating ≥ 4 → isBest = true, als Referenz sichern
```

### 3.2 Konvergenz

F-22 konvergiert quadratisch — in der Praxis reichen **2–3 Shots**, wenn
die Mühle kalibriert ist. Ohne Kalibrierung (blind ±2 Klicks) sind es 4–6.

Das ist das stärkste Argument für die Mühlen-Selbstkalibrierung aus kb/07 §5.3:
Sie kostet zwei Shots und spart bei jeder neuen Bohne zwei bis drei.

### 3.3 Was nicht verändert werden darf

| Während des Dial-ins fix | Warum |
| ------------------------ | ----- |
| Dosis | verändert Bettgeometrie und Widerstand gleichzeitig |
| Ratio | verändert Stärke und Extraktion gleichzeitig |
| Temperatur | erst in Phase D |
| Puck Prep | muss konstant sein, sonst ist die Zeit nicht vergleichbar |

Wer in Phase C an mehr als dem Mahlgrad dreht, sucht in einem mehrdimensionalen
Raum statt auf einer Linie — und findet nichts.

---

## 4. V60-Dial-in

Die Zeit ist beim V60 weniger streng als beim Espresso. Deshalb wird zuerst
sensorisch, dann über die Zeit korrigiert.

```
PHASE A — REZEPT FIXIEREN
  Dosis, Ratio, Gießschema, Temperatur nach Röstgrad festlegen

PHASE B — ERSTE TASSE
  Standardrezept (kb/09 §3), Gesamtzeit und Drawdown notieren

PHASE C — ZEITKORREKTUR
  Gesamtzeit außerhalb des dosisabhängigen Zielfensters (kb/03 §2)?
    zu schnell → feiner
    zu langsam → gröber
  Drawdown > 45 % der Gesamtzeit → gröber, unabhängig von der Gesamtzeit

PHASE D — SENSORISCHE KORREKTUR
  sauer   → feiner ODER +1 Guss ODER +2 °C
  bitter  → gröber ODER −1 Guss ODER −2 °C
  dünn    → Ratio enger
  Reihenfolge: Mahlgrad zuerst, Agitation danach, Temperatur zuletzt

PHASE E — GLEICHMÄSSIGKEIT
  Kaffeekuchen eben? Krater? Schräg?
  → Gießtechnik korrigieren, bevor weiter am Mahlgrad gedreht wird
```

**Anti-Regel (D-66):** Vor jeder Zeitkorrektur prüfen, ob das Zielfenster zur
Dosis passt. Bei 30 g sind 3:15–4:00 richtig, nicht 2:30.

---

## 5. AeroPress-Dial-in

Der größte Parameterraum, aber die geringste Empfindlichkeit — deshalb die
schnellste Iteration.

```
PHASE A  Rezepttyp wählen (Standard / Konzentrat+Bypass / Hoffmann / Championship)
PHASE B  Ratio nach gewünschter Stärke
PHASE C  Sensorisch korrigieren, in dieser Reihenfolge:
           sauer  → +1 Rühren  →  +5 °C  →  feiner  →  länger ziehen
           bitter → −5 °C      →  gröber →  kürzer ziehen
PHASE D  Bypass NUR zur Stärkeanpassung (F-14), nie gegen Fehltöne
```

Die Reihenfolge in Phase C weicht bewusst von Espresso und V60 ab
(kb/10 §5, kb/14 §5.1/5.2): Agitation und Temperatur sind hier die
wirksameren und reversibleren Hebel.

---

## 6. Wenn nichts hilft — die Eskalationsleiter

Nach 3 erfolglosen Korrekturen in dieselbe Richtung (kb/14 §7) in dieser
Reihenfolge abarbeiten:

```
1. FRISCHE      Röstdatum im Fenster? (kb/05 §3.2)
2. GLEICHMÄSSIGKEIT  Sauer UND bitter? → Technik, nicht Parameter (kb/14 D-02)
3. WASSER       KH > 80 mg/L? → kb/06
4. MÜHLE        Alignment, Schärfe, Retention? → kb/07 §6
5. RÖSTUNG      Unterentwickelt? (kb/05 §1.2, D-07)
6. BOHNE        Manche Bohnen passen schlicht nicht zur Methode
```

Punkt 6 ist legitim und muss aussprechbar sein. Ein heller kenianischer SL28
ergibt selten einen ausgewogenen Espresso — das ist kein Anwenderfehler,
sondern eine Materialeigenschaft.

---

## 7. Referenz-Brews und Lernen

### 7.1 Was gespeichert wird

Ein `Brew` mit `rating ≥ 4` wird zur Referenz. Gespeichert wird der
**vollständige Zustand**, nicht nur die Parameter:

```
Rezept (Dosis, Ratio, Mahlgrad, Temp, Zeit, Schritte)
+ Equipment-Set (Mühle, Korb, Filter, Dripper)
+ Wasser
+ Bohne + Röstdatum + Tage nach Röstung
+ Messung (falls vorhanden)
+ Bewertung + Verkostungsnotizen
```

Ohne Equipment und Röstdatum ist eine Referenz nicht reproduzierbar — das ist
der Hauptgrund, warum Rezepte aus dem Internet selten funktionieren.

### 7.2 Personalisierung

```
Ab 3 Brews mit rating ≥ 4 für (bean, method):
  → Median dieser Parameter ersetzt die Defaults mit confidence low/medium

Ab 10 Brews über alle Bohnen für (method):
  → systematische Nutzerabweichung erkennen
    z. B. „Du bevorzugst durchweg 0,3 engere Ratios als der Standard"
  → globalen Nutzer-Offset bilden und auf alle künftigen Defaults anwenden

confidence = high bleibt IMMER unangetastet
  (physikalische Grenzen, Milchtemperatur, Löslichkeitsmaximum)
```

Der zweite Block ist der wertvollste: Er erkennt den **persönlichen
Geschmack** als systematische Abweichung, nicht als Rauschen. Wer konsequent
kräftiger mag, soll nicht bei jeder neuen Bohne wieder gegen den Standard
anlaufen müssen.

---

## 8. Vollständiger Zustandsautomat

```
                      ┌──────────────┐
                      │    IDLE      │
                      └──────┬───────┘
                             │ Bohne + Methode gewählt
                             ▼
                   ┌───────────────────┐
                   │   START_POINT     │  §1
                   │  (Quelle: eigen/  │
                   │  transfer/default)│
                   └─────────┬─────────┘
                             ▼
                      ┌─────────────┐
                ┌────►│   BREWING   │
                │     └──────┬──────┘
                │            ▼
                │     ┌─────────────┐
                │     │  RECORDING  │  Zeit, Auswaage, Beobachtungen
                │     └──────┬──────┘
                │            ▼
                │     ┌─────────────┐
                │     │  MEASURING  │  optional: TDS
                │     └──────┬──────┘
                │            ▼
                │     ┌─────────────┐
                │     │   TASTING   │  Fehler + Charakter (kb/16)
                │     └──────┬──────┘
                │            ▼
                │     ┌─────────────┐      Gate aktiv
                │     │  DIAGNOSIS  ├──────────────► ┌────────────┐
                │     └──────┬──────┘                │  BLOCKED   │
                │            │ Korrektur             │ (Technik/  │
                │            │                       │  Wasser/   │
                │            ▼                       │  Bohne)    │
                │     ┌─────────────┐                └─────┬──────┘
                └─────┤  ADJUSTING  │◄─────────────────────┘
                      └──────┬──────┘   behoben
                             │ rating ≥ 4 und im Korridor
                             ▼
                      ┌─────────────┐
                      │  REFERENCE  │  isBest = true
                      └─────────────┘
```

---

## 9. UI-Anforderungen, die sich daraus ergeben

| Zustand | Braucht |
| ------- | ------- |
| `START_POINT` | Herkunft des Vorschlags sichtbar machen: „aus deinem besten Shot vom 12.08." / „aus einer ähnlichen Bohne" / „Standard" — Vertrauen entsteht durch Nachvollziehbarkeit |
| `BREWING` | Live-Timer + Waagenanzeige, große Zahlen, freihändig bedienbar |
| `RECORDING` | Zwei Taps: Zeit übernehmen, Flow-/Puck-State wählen |
| `TASTING` | Fehler- und Charakterachse **getrennt** (kb/16 §2) |
| `DIAGNOSIS` | Eine Empfehlung, fünf Elemente (kb/14 §8) |
| `BLOCKED` | Klare Ansage, was zuerst zu tun ist — keine Parameterempfehlung |
| `REFERENCE` | Bestätigung + „so wie am …" für den nächsten Start |

**Die wichtigste UI-Entscheidung:** In `DIAGNOSIS` nur **einen** Vorschlag
zeigen. Drei Vorschläge nebeneinander verleiten dazu, alle drei umzusetzen —
und machen das Ergebnis uninterpretierbar. Die Alternative gehört hinter ein
„Falls das nicht hilft"-Element, nicht gleichrangig daneben.
