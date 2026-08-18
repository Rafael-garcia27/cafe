# 00 — Domänenmodell

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Die begriffliche Landkarte des Kaffeewissens, übersetzt in App-Entitäten.
Wer dieses Kapitel versteht, kann die restlichen 16 Kapitel korrekt einsortieren.

---

## 1. Die zentrale Trennung: fünf Ebenen

Der häufigste Modellierungsfehler in Kaffee-Apps ist, „Flat White" als
Brühmethode zu behandeln. Das ist falsch und rächt sich spätestens beim
Iced-Modus. Die korrekte Zerlegung hat fünf Ebenen:

```
1. MATERIAL      Was gehe ich rein?      Bean, Bag, Water
2. GERÄT         Womit?                  Equipment (Mühle, Brüher, Korb, Filter)
3. VERFAHREN     Wie wird extrahiert?    Method + Recipe (+ Steps)
4. ERGEBNIS      Was kam heraus?         Brew (Ist-Werte + Messung)
5. GETRÄNK       Was landet in der Tasse? Drink (Komposition aus Brew + Zusätze)
```

Ein **Flat White** ist: `Drink` = `Brew(method=espresso, recipe=…)` + `Milk(texturiert)`.
Ein **Iced Latte** ist derselbe `Brew` mit `IceModifier` + `Milk(kalt)`.
Ein **Americano** ist `Brew(espresso)` + `Water(heiß)`.

Dadurch entsteht kein kombinatorischer Rezept-Wildwuchs: 3 Methoden × ~20 Getränke
werden nicht zu 60 Rezepten, sondern zu 3 Methodenprofilen + 20 Kompositionsregeln.

---

## 2. Entitäten im Überblick

```
Bean ──1:n── Bag ──1:n── Brew ──0:1── Drink
 │                         │
 │                         ├──n:1── Recipe ──1:n── RecipeStep
 │                         ├──n:1── Equipment (Set)
 │                         ├──n:1── Water
 │                         ├──0:1── Measurement (TDS/EY)
 │                         └──0:1── Tasting
 │
 └──n:1── Origin (Profil)
```

---

## 3. Entitäten im Detail

### 3.1 `Bean` — die Kaffee-Identität

Was der Kaffee *ist*. Verbraucht sich nie. Ein Bean kann über Jahre immer wieder
nachgekauft werden.

| Feld               | Typ                | Pflicht | Anmerkung                                     |
| ------------------ | ------------------ | ------- | --------------------------------------------- |
| `id`               | string             | ✔       |                                               |
| `name`             | string             | ✔       | z. B. „Finca La Esperanza Pink Bourbon"       |
| `roaster`          | string             |         |                                               |
| `origins`          | `OriginRef[]`      | ✔       | mehrere = Blend; mit optionalem Anteil in %   |
| `variety`          | `Variety[]`        |         | SL28, Caturra, Geisha … (siehe kb/04)         |
| `process`          | `Process`          | ✔       | erweitert um anaerobic etc.                   |
| `roastLevel`       | `RoastLevel`       | ✔       |                                               |
| `agtron`           | number             |         | 25–95, präziser als `roastLevel`              |
| `altitudeMasl`     | `[min, max]`       |         | Meter über NN                                 |
| `density`          | number             |         | g/L Schüttdichte, korreliert mit Höhe         |
| `harvestYear`      | number             |         |                                               |
| `flavorNotes`      | string[]           |         | Röster-Angabe, freier Text                    |
| `preferredMethod`  | `BrewMethod`       |         |                                               |
| `isDecaf`          | boolean            |         |                                               |
| `decafProcess`     | `DecafProcess`     |         | swiss-water, ea-sugarcane, co2, mc            |

### 3.2 `Bag` — der physische Einkauf

Eine konkrete Tüte. Verbraucht sich. Trägt das **Röstdatum** — die einzige
Größe, die sich ohne Zutun täglich ändert.

| Feld              | Typ     | Anmerkung                                      |
| ----------------- | ------- | ---------------------------------------------- |
| `id`              | string  |                                                |
| `beanId`          | string  |                                                |
| `roastDate`       | date    | **kritisch** für Frische-Engine (kb/05)        |
| `openedDate`      | date    | Sauerstoffkontakt startet hier                 |
| `purchasedGrams`  | number  |                                                |
| `remainingGrams`  | number  | wird pro Brew automatisch dekrementiert        |
| `pricePerKg`      | number  | für Kosten-pro-Tasse                           |
| `depleted`        | boolean |                                                |

### 3.3 `Equipment` — das Setup

Rezepte sind ohne Geräteangabe nicht übertragbar. Ein „Mahlgrad 12" bedeutet auf
zwei Mühlen völlig Verschiedenes.

| Typ         | Relevante Felder                                                          |
| ----------- | ------------------------------------------------------------------------- |
| `grinder`   | `burrType` (flat/conical), `burrDiameterMm`, `scaleType`, `clicksPerRev`, `micronPerStep`, `zeroPoint`, `retentionG` |
| `brewer`    | `method`, `model`, `groupType` (e61/lever/…), `pressureBar`, `pidTemp`     |
| `basket`    | `diameterMm` (53/54/58), `doseRangeG`, `type` (stock/precision/ridgeless)  |
| `dripper`   | `model` (V60-01/02/03, Switch), `material` (plastic/glass/ceramic/metal)   |
| `filter`    | `brand`, `bleached`, `thicknessClass`, `flowClass`                         |
| `scale`     | `resolutionG` (0,1 / 0,01), `hasTimer`                                     |
| `kettle`    | `goosenNeck`, `hasPid`                                                     |

**Warum das zählt:** Keramik-V60 hat eine höhere thermische Masse als Plastik →
ohne Vorheizen bis zu 4 °C Temperaturverlust in der ersten Minute → messbar
niedrigere Extraktion. Das gehört ins Modell, nicht in eine Fußnote.

### 3.4 `Water` — der unterschätzte Hauptbestandteil

Espresso besteht zu ~90 %, Filterkaffee zu ~98,6 % aus Wasser.

| Feld           | Einheit      | Anmerkung                                    |
| -------------- | ------------ | -------------------------------------------- |
| `label`        | –            | „Osmose + Rezept A", „Leitung Köln"          |
| `tdsMgL`       | mg/L         | Gesamtmineralisierung                        |
| `ghMgL`        | mg/L CaCO₃   | Gesamthärte (Ca²⁺ + Mg²⁺) — Extraktionskraft |
| `khMgL`        | mg/L CaCO₃   | Karbonathärte / Alkalinität — Säurepuffer    |
| `ph`           | –            |                                              |
| `naMgL`        | mg/L         |                                              |
| `chlorineMgL`  | mg/L         | muss 0 sein                                  |

### 3.5 `Method` — das Verfahren (statisch, 3 Stück)

Kein Nutzerdatum, sondern Stammdaten der App. Definiert die *Physik* des
Verfahrens und damit, welche Variablen überhaupt existieren.

```
espresso    Druckextraktion, gesättigtes Bett, 8–12 % TDS
v60         Perkolation, Schwerkraft, kontinuierlicher Frischwasserkontakt
aeropress   Immersion (+ optionaler Druckabschluss), Wasser im Gleichgewicht
```

Kernunterschied für den Rechenkern:
- **Perkolation (V60)**: frisches Wasser trifft laufend auf Kaffee → hohes
  Konzentrationsgefälle → hohe Extraktionseffizienz je Zeiteinheit.
- **Immersion (AeroPress)**: Sättigung begrenzt die Extraktion → nach ~2 min
  läuft die Extraktion asymptotisch aus, Zeit wirkt schwächer als beim V60.
- **Druck (Espresso)**: Durchflusswiderstand des Betts wird zur Hauptvariablen →
  Mahlgrad wirkt hier ~3× stärker als bei Filtermethoden.

### 3.6 `Recipe` — der Plan

Das Soll. Wiederverwendbar, teilbar, versionierbar.

| Feld                | Typ              | Anmerkung                                  |
| ------------------- | ---------------- | ------------------------------------------ |
| `id`, `name`        |                  |                                            |
| `method`            | `BrewMethod`     |                                            |
| `doseG`             | number           | Trockenkaffee                              |
| `ratio`             | number           | n aus `1:n`                                |
| `targetYieldG`      | number           | abgeleitet: `doseG * ratio`                |
| `waterTempC`        | number           |                                            |
| `grindSetting`      | `GrindSetting`   | `{ equipmentId, value, unit }`             |
| `totalTimeS`        | number           | Zielzeit                                   |
| `steps`             | `RecipeStep[]`   | **nur V60/AeroPress zwingend**             |
| `pressureProfile`   | `PressurePoint[]`| nur Espresso, optional                     |
| `modifiers`         | `Modifier[]`     | `iced`, `bypass`, `inverted`, `bloomless`  |
| `source`            | enum             | `builtin` / `user` / `derived-from-log`    |

### 3.7 `RecipeStep` — die Sequenz

Das Feld, das in der aktuellen PWA fehlt und ohne das V60 nicht reproduzierbar ist.

| Feld            | Typ                                                    |
| --------------- | ------------------------------------------------------ |
| `index`         | number                                                 |
| `type`          | `bloom` \| `pour` \| `wait` \| `swirl` \| `stir` \| `steep` \| `press` \| `plunge` \| `drawdown` \| `dilute` |
| `startAtS`      | number — Sekunde ab Brühstart                          |
| `durationS`     | number                                                 |
| `targetMassG`   | number — kumulierte Gesamtmasse auf der Waage          |
| `pourStyle`     | `center` \| `spiral` \| `pulse` \| `aggressive`        |
| `note`          | string                                                 |

> **Wichtig:** `targetMassG` ist immer **kumulativ**, nicht inkrementell.
> Die Waage zeigt Gesamtmasse — die App sollte anzeigen, was der Nutzer sieht.

### 3.8 `Brew` — die Durchführung

Das Ist. Referenziert Recipe (Soll) und speichert die Abweichung.

| Feld              | Typ            | Anmerkung                                     |
| ----------------- | -------------- | --------------------------------------------- |
| `recipeId`        | string         | kann null sein bei Freihand-Brew              |
| `bagId`           | string         |                                               |
| `equipmentSetId`  | string         |                                               |
| `waterId`         | string         |                                               |
| `actual`          | `BrewParams`   | tatsächliche Dose/Yield/Zeit/Temp             |
| `observations`    | `Observation`  | `puckState`, `flowState`, `bloomBehavior`, `drawdownS`, `crema` |
| `measurement`     | `Measurement`  | optional: `tdsPct`, `beverageMassG`, `brewTempC` |
| `tasting`         | `Tasting`      | siehe kb/16                                   |
| `rating`          | 1–5            |                                               |
| `isBest`          | boolean        | Referenzpunkt für „so wie letztes Mal"        |

### 3.9 `Measurement` — die objektive Ebene

Optional, aber sie verwandelt die Diagnose von Raten in Rechnen.

```
tdsPct           gemessen mit Refraktometer (%)
beverageMassG    Masse in der Tasse (g)
extractionYield  BERECHNET, nie eingegeben (siehe kb/02, F-06)
```

Wenn `tdsPct` fehlt, arbeitet die Diagnose-Engine rein sensorisch (kb/14).
Wenn `tdsPct` da ist, hat sie Vorrang vor jedem Geschmackstag.

### 3.10 `Drink` — die Komposition

| Feld           | Typ                | Anmerkung                                       |
| -------------- | ------------------ | ----------------------------------------------- |
| `drinkTypeId`  | string             | Referenz auf `data/drinks.json`                 |
| `baseBrewId`   | string             |                                                 |
| `components`   | `Component[]`      | `{ kind: 'milk'\|'water'\|'ice'\|'syrup'\|'tonic', massG, tempC }` |
| `glassMl`      | number             |                                                 |
| `milkSpec`     | `MilkSpec`         | Typ, Zieltemperatur, Schaumklasse (kb/11)       |

---

## 4. Enums (App-weit verbindlich)

```ts
BrewMethod   = 'espresso' | 'v60' | 'aeropress'

RoastLevel   = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'

Process      = 'washed' | 'natural' | 'honey-yellow' | 'honey-red' | 'honey-black'
             | 'anaerobic' | 'carbonic-maceration' | 'wet-hulled' | 'experimental'

DecafProcess = 'swiss-water' | 'ea-sugarcane' | 'co2' | 'methylene-chloride'

PuckState    = 'even' | 'wet-soupy' | 'dry-cracked' | 'crater' | 'sideChannel'

FlowState    = 'choked' | 'slow' | 'normal' | 'fast' | 'gusher' | 'uneven' | 'spritzing'

Modifier     = 'iced' | 'bypass' | 'inverted' | 'bloomless' | 'pressure-profiled'
             | 'preinfusion' | 'double-filter' | 'paper-rinse-skipped'

MilkType     = 'whole' | 'semi' | 'skim' | 'oat-barista' | 'soy-barista'
             | 'almond-barista' | 'lactose-free'

FoamClass    = 'flat' | 'microfoam-thin' | 'microfoam-standard' | 'airy' | 'stiff'
```

Für Geschmacksdeskriptoren siehe kb/16 — dort in zwei Achsen getrennt:
**Fehlerachse** (aktionsauslösend) und **Charakterachse** (beschreibend).
Das ist eine Korrektur gegenüber der flachen `TasteTag`-Liste der aktuellen PWA:
`sour` ist ein Fehler, der eine Mahlgradkorrektur auslöst; `bright` ist eine
positive Charaktereigenschaft, die *nichts* auslösen darf. Beide in einer Liste
zu führen, macht die Diagnose-Engine unscharf.

---

## 5. Der Rechenkern — reine Funktionen

Alles Folgende ist zustandslos und muss ohne DB-Zugriff testbar sein.
Formeln in kb/02, Implementierungsvertrag in `types/domain.ts`.

```
ratio(doseG, yieldG)                         → number
targetYield(doseG, ratio)                    → g
beverageMass(waterG, doseG, lrr)             → g          (Filter)
extractionYield(tdsPct, beverageMassG, doseG)→ %
expectedTds(ey, ratio, lrr)                  → %
blendTds(components[])                       → %          (Americano, Bypass)
mixTemperature(components[])                 → °C
iceForTargetTemp(hotG, tHot, tTarget)        → g          (Flash Chill)
steamCondensate(milkG, tStart, tTarget)      → g          (Milch-Verdünnung)
flowRate(yieldG, timeS)                      → g/s
freshnessScore(roastDate, now, roastLevel, method) → 0–100
grindDelta(currentSetting, deltaMicron, grinder)   → setting
caffeineEstimate(doseG, method, ratio)       → mg
```

---

## 6. Ableitungsregeln (was NIE gespeichert wird)

Doppelt gespeicherte abgeleitete Werte laufen auseinander. Diese Größen werden
**immer** berechnet:

| Größe            | Aus                                    |
| ---------------- | -------------------------------------- |
| `ratio`          | `doseG`, `yieldG`                      |
| `extractionYield`| `tdsPct`, `beverageMassG`, `doseG`     |
| `flowRate`       | `yieldG`, `timeS`                      |
| `daysOffRoast`   | `roastDate`, `now`                     |
| `freshnessScore` | `daysOffRoast`, `roastLevel`, `method` |
| `costPerCup`     | `pricePerKg`, `doseG`                  |
| `remainingCups`  | `remainingGrams`, `doseG`              |

---

## 7. Zustandsmaschine „Dial-in"

Der Kern-Loop der App. Vollständige Algorithmen in kb/15.

```
      ┌─────────────┐
      │  NEUE TÜTE  │
      └──────┬──────┘
             ▼
   ┌─────────────────────┐   kein Log für diese Bohne
   │ STARTPUNKT WÄHLEN   │◄── → Methoden-Default (data/methods.json)
   │                     │   Log vorhanden
   │                     │◄── → bestes Log dieser Bohne
   │                     │   nur andere Bohne, gleicher Röstgrad
   │                     │◄── → Transfer + Frische-Korrektur
   └──────────┬──────────┘
              ▼
        ┌───────────┐
        │  BRÜHEN   │
        └─────┬─────┘
              ▼
     ┌──────────────────┐
     │ MESSEN + KOSTEN  │
     └────────┬─────────┘
              ▼
      ┌───────────────┐   im Zielkorridor + Rating ≥ 4
      │   DIAGNOSE    │────────────────────────► ✅ ALS REFERENZ SPEICHERN
      └───────┬───────┘
              │ Abweichung
              ▼
   ┌────────────────────────┐
   │ EINE VARIABLE ÄNDERN   │  ← Kardinalregel, siehe unten
   └───────────┬────────────┘
               └──────► zurück zu BRÜHEN
```

> **Kardinalregel der App:** Pro Iteration darf die Engine **genau eine**
> Korrektur vorschlagen. Zwei gleichzeitige Änderungen machen das Ergebnis
> uninterpretierbar — man weiß nicht mehr, welche gewirkt hat.
> Reihenfolge der Priorität: **Mahlgrad → Ratio/Yield → Temperatur → Technik**.
> Die Diagnose-Engine muss diese Priorität hart durchsetzen, auch wenn mehrere
> Regeln gleichzeitig feuern (siehe kb/14, Abschnitt „Konfliktauflösung").

---

## 8. Konfidenz und Lernen

Jeder Default in `data/` trägt ein `confidence`-Feld (`high`/`medium`/`low`,
entsprechend 🟢/🟡/🟠 aus dem README).

**Lernregel:** Sobald für eine Kombination `(bean, method)` mindestens
3 Brews mit Rating ≥ 4 existieren, überschreibt der personalisierte Median die
`low`- und `medium`-Defaults. `high`-Werte (physikalische Grenzen wie
„Wassertemperatur ≤ 100 °C", „Espresso-EY selten > 24 %") bleiben unantastbar
und dienen als Validierungsgrenzen.

---

## 9. Migration aus der bestehenden `barista-pwa`

| Aktuell (`src/types.ts`)     | Neu                        | Aktion                                          |
| ---------------------------- | -------------------------- | ----------------------------------------------- |
| `Bean.origins: string[]`     | `OriginRef[]`              | String → `{ country, region?, share? }` mappen   |
| `Process` (3 Werte)          | `Process` (9 Werte)        | additiv, alte Werte bleiben gültig               |
| `RoastLevel` (4)             | `RoastLevel` (5)           | `medium-light` neu, Default-Mapping unnötig      |
| `TasteTag` (flach)           | `Defect[]` + `Character[]` | **Breaking.** Mapping-Tabelle in kb/16 §4        |
| `EspressoParams` etc.        | `Recipe` + `Brew.actual`   | Soll/Ist trennen; Altdaten werden zu `Brew.actual`, `recipeId = null` |
| kein `steps`                 | `RecipeStep[]`             | additiv; für Altdaten leer                       |
| kein `Equipment`             | `Equipment`                | additiv; „Default-Setup" für Altdaten anlegen    |
| kein `Water`                 | `Water`                    | additiv; „Unbekannt" für Altdaten                |
| kein `Measurement`           | `Measurement`              | additiv, überall optional                        |
| `grinderClicks?: number`     | `GrindSetting`             | in `{ equipmentId, value, unit: 'clicks' }` heben |

Alle Änderungen außer `TasteTag` sind additiv und damit migrationsfrei.

---

## 10. Weiterführend

- Physik dahinter → `kb/01-extraktionstheorie.md`
- Rechenvorschriften → `kb/02-formelsammlung.md`
- Wertebereiche jedes Feldes → `kb/03-variablen-referenz.md`
