# 16 — Sensorik und Verkostung

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Wie Geschmack erfasst wird, damit die Diagnose-Engine damit rechnen kann.

---

## 1. Die fünf Dimensionen

| Dimension | Was gemeint ist | Wo wahrgenommen |
| --------- | --------------- | --------------- |
| **Säure (Acidity)** | Lebendigkeit, Struktur, „Biss" | Zungenränder |
| **Süße (Sweetness)** | Zucker und Maillard-Produkte | Zungenspitze |
| **Bitterkeit (Bitterness)** | Phenole, Laktone | Zungenrücken |
| **Körper (Body)** | Viskosität, Mundgefühl, Textur | ganzer Mund |
| **Abgang (Aftertaste)** | Länge und Art des Nachhalls | retronasal |

Dazu zwei Qualitäten, die keine Grundgeschmäcker sind, aber entscheiden:

- **Balance** — stehen die fünf Dimensionen im Verhältnis zueinander?
- **Clean Cup** — gibt es Fremdnoten, die nicht zum Kaffee gehören?

### 1.1 Säure ist kein Fehler

Der wichtigste Punkt für Einsteiger-Kommunikation in der App:

| Gute Säure | Schlechte Säure |
| ---------- | --------------- |
| Apfel, Zitrone, Johannisbeere, Weinsäure | scharf, stechend, essigartig |
| angenehm, strukturgebend, „saftig" | unangenehm, beißend |
| verschwindet sauber im Abgang | bleibt als Schärfe hängen |
| **Sortencharakter** | **Unterextraktion** |

Ein heller kenianischer SL28 *soll* deutlich sauer schmecken. Wer das als
Fehler diagnostiziert und feiner mahlt, macht ihn bitter, ohne die Säure zu
verlieren.

**Der Unterscheider ist die Süße.** Säure mit Süße = Charakter.
Säure ohne Süße, dafür mit Salzigkeit = Unterextraktion.

---

## 2. Zwei getrennte Achsen — die Kernentscheidung des Datenmodells

Die bestehende PWA führt `TasteTag` als flache Liste, in der `sour` (Fehler)
und `bright` (positive Eigenschaft) gleichberechtigt nebeneinander stehen.
Das macht die Diagnose-Engine notwendig unscharf: Sie kann nicht unterscheiden,
ob sie handeln soll.

**Korrektur: zwei Achsen.**

### 2.1 Fehlerachse (`Defect[]`) — löst Korrekturen aus

| Tag | Definition | Diagnostische Bedeutung |
| --- | ---------- | ----------------------- |
| `sour` | scharf-sauer ohne Süße | Unterextraktion |
| `salty` | salzig | **stärkster Einzelindikator für Unterextraktion** |
| `thin` | wässrig, ohne Substanz | zu weite Ratio oder Unterextraktion |
| `shortFinish` | Abgang bricht abrupt ab | Unterextraktion |
| `bitter` | dominant bitter | Überextraktion |
| `astringent` | trocken, pelzig, zusammenziehend | Überextraktion |
| `harsh` | kratzig, rau | Überextraktion oder dunkle Röstung |
| `ashy` | verbrannt, aschig | Überextraktion oder Röstfehler |
| `flat` | ohne Säure, ohne Leben | **Wasser (KH)** oder alte Bohne |
| `hollow` | Mitte fehlt, vorne und hinten da | ungleichmäßige Extraktion |
| `papery` | Karton, Papier | alt oder Filter nicht gespült |
| `rancid` | ranzig, alt-fettig | Bohne > 8 Wochen |
| `fermented` | überreif, gärig, weinig-schlecht | Aufbereitungsfehler |

### 2.2 Charakterachse (`Character[]`) — beschreibt, löst NICHTS aus

```
Frucht:      citrus · stoneFruit · berry · tropical · applePear · driedFruit
Blumig:      floral · jasmine · rose · tea
Süß:         caramel · honey · brownSugar · panela · vanilla · maple
Röstig:      chocolate · darkChocolate · nutty · malt · toast
Würzig:      spice · cinnamon · clove · pepper
Erdig:       earthy · woody · herbal · tobacco
Struktur:    bright · juicy · winey · complex · clean · balanced
Textur:      syrupy · creamy · silky · tealike · full · light
```

**Regel:** Kein Tag der Charakterachse darf jemals eine Parameterkorrektur
auslösen. `bright` bedeutet nicht „zu sauer". `winey` bedeutet nicht
„fermentiert". Die Engine liest nur die Fehlerachse.

### 2.3 Migration aus der bestehenden PWA

| Alt (`TasteTag`) | Neu | Achse |
| ---------------- | --- | ----- |
| `sour` | `sour` | Fehler |
| `bitter` | `bitter` | Fehler |
| `watery` | `thin` | Fehler |
| `flat` | `flat` | Fehler |
| `harsh` | `harsh` | Fehler |
| `sweet` | `honey` / `caramel` (Auswahl) | Charakter |
| `fruity` | `berry` / `citrus` / `stoneFruit` | Charakter |
| `floral` | `floral` | Charakter |
| `chocolaty` | `chocolate` | Charakter |
| `nutty` | `nutty` | Charakter |
| `balanced` | `balanced` | Charakter |
| `bright` | `bright` | Charakter |
| `syrupy` | `syrupy` | Charakter |

Die Migration ist verlustfrei in Richtung Fehlerachse und vergröbernd bei
`sweet`/`fruity` (ein alter Tag → mehrere neue). Für Altdaten den generischen
Wert setzen und den Nutzer bei Bedarf verfeinern lassen.

---

## 3. Bewertungssysteme

### 3.1 SCA Cupping Form (klassisch)

Zehn Kategorien à 10 Punkte, Gesamtskala 0–100.

| Kategorie | Was bewertet wird |
| --------- | ----------------- |
| Fragrance/Aroma | trocken (Fragrance) + nass (Aroma) |
| Flavor | Gesamteindruck im Mund |
| Aftertaste | Länge und Qualität des Nachhalls |
| Acidity | Qualität, nicht Menge |
| Body | Qualität, nicht Menge |
| Balance | Zusammenspiel |
| Uniformity | 5 Tassen gleich? |
| Clean Cup | frei von Fehlern |
| Sweetness | vorhanden? |
| Overall | Gesamturteil des Verkosters |

**Specialty-Grenze: ≥ 80 Punkte.**

| Score | Klasse |
| ----- | ------ |
| 90+ | Outstanding (extrem selten) |
| 85–89,99 | Excellent |
| 80–84,99 | Very Good — Specialty |
| < 80 | Commercial |

Wichtig: `Acidity` und `Body` bewerten **Qualität**, nicht Intensität. Ein
leichter Körper kann 9 Punkte bekommen, wenn er zum Kaffee passt.

### 3.2 CVA (Coffee Value Assessment)

Neueres SCA-System, das die klassische Form ablöst. Trennt bewusst:

- **Descriptive Assessment** — was ist da? (wertfrei, Intensitäten)
- **Affective Assessment** — wie gut ist es? (Präferenz)
- **Physical Assessment** — Feuchte, Dichte, Defekte
- **Extrinsic Assessment** — Zertifizierung, Herkunft, Story

Der Grund für die Trennung ist derselbe wie bei unseren zwei Achsen: Wer
Beschreibung und Bewertung mischt, kann später nicht mehr auseinanderhalten,
was gemessen und was gemocht wurde.

**Für die App:** Die 100-Punkte-Skala ist für Heimanwender ungeeignet — sie
suggeriert eine Präzision, die ohne Kalibrierung und Vergleichsproben nicht
existiert. **Empfehlung: 1–5 Sterne plus Tags.** Das ist ehrlich, schnell und
für die Lernlogik völlig ausreichend.

---

## 4. Verkostungsprotokoll für die App

### 4.1 Espresso

```
1. RIECHEN        sofort, über der Crema
2. CREMA          Farbe, Feinporigkeit, Stabilität (Diagnose, keine Bewertung)
3. VERRÜHREN      der Shot ist geschichtet — ohne Rühren schmeckt man nur
                  die konzentrierte erste Hälfte
4. ERSTER SCHLUCK bei ~60 °C: Süße und Balance
5. ZWEITER        bei ~45 °C: Säure und Komplexität treten hervor
6. ABGANG         30 s warten: Was bleibt? Wie lange? Angenehm?
7. ABKÜHLEN       bei ~30 °C werden Fehler am deutlichsten
```

Schritt 3 wird fast immer übersprungen und verfälscht jede Espressoverkostung.

### 4.2 Filter

```
1. RIECHEN        über der Kanne
2. ABKÜHLEN       auf ~60 °C — heißer ist sensorisch fast nutzlos
3. SLURPEN        laut einsaugen, damit der Kaffee vernebelt und
                  retronasal wahrgenommen wird
4. DURCHGEHEN     Säure → Süße → Körper → Abgang, in dieser Reihenfolge
5. ABKÜHLEN LASSEN  bei 40 °C und bei Raumtemperatur erneut probieren
```

**Die aufschlussreichste Temperatur ist Raumtemperatur.** Ein Kaffee, der kalt
noch süß und angenehm ist, war gut extrahiert. Ein Kaffee, der kalt bitter oder
scharf sauer wird, war es nicht. Diese Probe kostet nichts und ist
diagnostisch wertvoller als jede Notiz bei 70 °C.

---

## 5. Kalibrierung des eigenen Gaumens

Nur wer eigene Wahrnehmung eichen kann, kann Tags sinnvoll vergeben.
**Vorschlag für ein Onboarding-Modul der App** (AeroPress, weil schnell und
ohne Channeling-Störgröße, kb/10 §8):

```
Vier Tassen derselben Bohne, jeweils EINE Variable extrem verstellt:

Tasse 1  deutlich zu grob      → so schmeckt UNTEREXTRAKTION
         (sauer, salzig, dünn, kurzer Abgang)

Tasse 2  deutlich zu fein      → so schmeckt ÜBEREXTRAKTION
         (bitter, trocken, adstringierend, aschig)

Tasse 3  richtig, aber 1:20    → so schmeckt ZU DÜNN
         (ausgewogen, aber ohne Substanz)

Tasse 4  richtig, 1:15         → so schmeckt RICHTIG
```

Danach kann der Nutzer die drei Fehlerbilder unterscheiden — und erst dann
sind seine Tags für die Engine verwertbar.

**Das ist der beste denkbare erste Kontakt mit der App.** Er kostet 15 Minuten
und 70 g Kaffee und ersetzt hundert Seiten Erklärung. Wer die vier Tassen
nebeneinander hatte, braucht nie wieder eine Definition von „überextrahiert".

---

## 6. Häufige Verwechslungen

| Verwechslung | Unterscheidungsmerkmal |
| ------------ | ---------------------- |
| Säure ↔ Bitterkeit | Säure: Zungenränder, „spitz", vergeht schnell. Bitterkeit: Zungenrücken, „breit", bleibt |
| Bitterkeit ↔ Adstringenz | Bitter ist ein Geschmack, Adstringenz ein **Tastgefühl** (trocken, pelzig, wie schwarzer Tee) |
| Körper ↔ Stärke | Körper = Textur. Stärke = Konzentration. Ein Lungo kann stark und dünn sein |
| Süße ↔ Zucker | Kaffee enthält kaum freien Zucker. Die „Süße" kommt aus Maillard-Produkten und der **Abwesenheit** von Bitterkeit |
| Fruchtig ↔ Sauer | Fruchtig ist aromatisch (retronasal), sauer ist Geschmack (Zunge) |
| „Zu stark" ↔ „überextrahiert" | zwei unabhängige Achsen (kb/01 §2) |

Die letzte Zeile ist die folgenreichste: Sie ist der Grund, warum Nutzer bei
„zu bitter" an der Ratio drehen und es schlimmer machen.

---

## 7. Datenmodell

```ts
interface Tasting {
  brewId: string
  rating: 1 | 2 | 3 | 4 | 5
  defects: Defect[]              // löst Diagnose aus
  characters: Character[]        // beschreibend
  intensity?: {                  // optional, 1–5
    acidity: number
    sweetness: number
    bitterness: number
    body: number
    aftertaste: number
  }
  temperatureAtTasting?: 'hot' | 'warm' | 'cool' | 'room'
  notes?: string
  wouldRepeat: boolean
}
```

### UI-Empfehlungen

- **Fehler und Charakter räumlich trennen.** Zwei Blöcke, verschieden gefärbt,
  mit unterschiedlicher Überschrift: „Was stört?" vs. „Was schmeckst du?"
- **Fehlertags dürfen leer bleiben** — das ist der Normalfall bei einem guten
  Kaffee und muss ohne Reibung möglich sein.
- **`intensity` ist optional.** Nur für Nutzer, die es wollen; die Engine
  braucht es nicht.
- **`wouldRepeat`** ist das ehrlichste Einzelsignal für die Lernlogik —
  ehrlicher als Sterne, weil es keine Skalen-Interpretation erfordert.
- **Nach dem Abkühlen erneut fragen.** Eine Push-Nachricht nach 10 Minuten
  („Wie schmeckt er jetzt, kalt?") liefert die diagnostisch wertvollste
  Information des ganzen Durchgangs — und niemand macht diese Probe von selbst.
