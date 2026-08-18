# 07 — Mahlgut und Mühle

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Der Mahlgrad ist die stärkste Einzelvariable der Kaffeezubereitung. Er ist
gleichzeitig die einzige, die keine absolute Skala hat — „12" bedeutet auf jeder
Mühle etwas anderes. Dieses Kapitel schafft die Übersetzung.

---

## 1. Warum Mahlgrad so stark wirkt

Er verändert **drei Dinge gleichzeitig**, und beim Espresso zeigen alle drei
in dieselbe Richtung:

1. **Spezifische Oberfläche** (F-27): halber Durchmesser = doppelte Oberfläche
2. **Diffusionsweg** (F-28): halber Durchmesser = viertel Diffusionszeit
3. **Durchflusswiderstand** (F-21): halber Durchmesser = viertel Flussrate

Bei Filtermethoden wirken nur (1) und (2), und (3) nur schwach. Deshalb ist
die Mahlgradempfindlichkeit beim Espresso **grob dreimal so hoch** 🟠 — dieselbe
Klickzahl verschiebt dort dreimal so viel wie im V60.

---

## 2. Zielgrößen nach Methode 🟡

| Methode              | Median-Ø   | Sieb-Referenz |
| -------------------- | ---------- | ------------- |
| Türkisch / Ibrik     | < 150 µm   | Puderzucker   |
| **Espresso**         | 200–400 µm | feiner Sand   |
| Moka                 | 350–500 µm | –             |
| **AeroPress (kurz)** | 400–600 µm | Tafelsalz     |
| **V60**              | 550–800 µm | grober Sand   |
| **AeroPress (lang)** | 600–900 µm | –             |
| Chemex / Batch       | 700–950 µm | –             |
| French Press         | 900–1200 µm| Meersalz      |
| Cold Brew            | 1000–1400 µm| grobes Meersalz |

Diese Zahlen sind Mediane. Die tatsächliche Verteilung ist entscheidender.

---

## 3. Partikelverteilung

Jede Mühle erzeugt eine **bimodale Verteilung**:

```
 Anteil
   ↑
   │   ╱╲                     Feinanteil („Fines")
   │  ╱  ╲                    < 100 µm, aus Zellwandbruch
   │ ╱    ╲          ╱‾‾╲
   │╱      ╲___     ╱    ╲    Hauptfraktion („Boulders")
   │            ╲__╱      ╲__
   └──────────────────────────→ Partikelgröße
     0   100      400    800 µm
```

### 3.1 Fines — nicht nur Feind

| Wirkung | Bewertung |
| ------- | --------- |
| extrahieren extrem schnell, oft über 30 % EY | Bitterkeit, Adstringenz |
| wandern nach unten, verstopfen den Filter | Stalling im V60, Choking im ST |
| liefern Körper, Textur, Crema-Stabilität | **notwendig beim Espresso** |

**Espresso braucht Fines.** Ohne sie entstünde nicht genug Widerstand für 9 bar,
und der Körper fehlte. Das Ziel ist nicht „keine Fines", sondern eine
**kontrollierte, reproduzierbare Menge**.

**Filter will weniger Fines.** Hier sind sie überwiegend störend: Sie sorgen
für lokale Überextraktion bei gleichzeitiger Unterextraktion der Boulders —
das ist die Signatur „sauer und bitter gleichzeitig" (kb/01 §1.3).

### 3.2 Mahlwerkstypen

| | **Scheibenmahlwerk (flat)** | **Kegelmahlwerk (conical)** |
| --- | --- | --- |
| Verteilung | enger, unimodaler | breiter, ausgeprägter bimodal |
| Fines | weniger | mehr |
| Tasse | klarer, säurebetonter, definierter | mehr Körper, runder, süßer |
| Retention | höher | niedriger |
| Wärmeentwicklung | höher | niedriger |
| Typisch | Espressomühlen, Café-Setups | Handmühlen, Einsteiger, Filter |
| Fehlertoleranz | geringer | höher |

**Weder ist besser.** Flat ist die Wahl für maximale Klarheit bei hellen
Röstungen, Conical für Süße, Körper und Robustheit im Alltag. Für ein
Heim-Setup mit gemischtem Einsatz ist Conical oft die praktischere Wahl.

### 3.3 Weitere Mahlwerksfaktoren

- **Ausrichtung (Alignment):** Sind die Mahlscheiben nicht exakt parallel,
  entsteht ein breiteres Spektrum mit mehr Fines. Bei günstigen Mühlen die
  häufigste versteckte Qualitätsbremse.
- **Schärfe:** Stumpfe Mahlscheiben *quetschen* statt zu schneiden → mehr Fines
  und mehr Wärme. Standzeit ~500–1000 kg (Stahl), deutlich mehr bei beschichtet.
- **Drehzahl:** Langsamer = weniger Wärme, weniger statische Aufladung, oft
  engere Verteilung.
- **Retention:** Im Mahlwerk verbleibendes Mahlgut. Es ist vom vorherigen
  Durchgang, also alt und mit anderem Mahlgrad. Bei Einzeldosierung durch
  Spülschuss („purge") oder RDT auffangen.

---

## 4. Praktische Mahltechniken

### 4.1 RDT — Ross Droplet Technique 🟡

**1–2 Tropfen Wasser** auf die ganzen Bohnen vor dem Mahlen (Sprühflasche oder
angefeuchteter Löffelstiel).

Wirkung: Die statische Aufladung bricht zusammen.
- Kein Mahlgut-Sprühnebel, keine Klumpen
- Retention sinkt deutlich
- Dosiergenauigkeit steigt

Kein Einfluss auf den Geschmack — die Wassermenge ist gegenüber der
Restfeuchte der Bohne vernachlässigbar. **Immer machen.** Eine der wenigen
Techniken ohne Nachteil.

### 4.2 WDT — Weiss Distribution Technique (Espresso)

Nach dem Mahlen mit dünnen Nadeln (0,3–0,4 mm) im Korb rühren, um Klumpen
aufzulösen und die Dichte zu vereinheitlichen.

Wirkung: Der wirksamste Einzelschritt gegen Channeling. In Blindtests der
sichtbarste Effekt aller Puck-Prep-Maßnahmen.
- Nadeln bis fast auf den Korbboden führen
- 8–12 kreisende Bewegungen, dann glattstreichen
- Nicht verdichten — WDT lockert, Tamping verdichtet

### 4.3 Single Dosing vs. Bohnenbehälter

| | Single Dosing | Hopper |
| --- | --- | --- |
| Frische | maximal | Bohnen liegen offen |
| Sortenwechsel | jederzeit | Spülen nötig |
| Retention | Purge/RDT nötig | selbstspülend |
| Konsistenz | leicht schlechter (Gewichtsdruck fehlt) | besser |

Für einen Hobby-Barista mit mehreren Sorten ist Single Dosing praktisch
alternativlos.

### 4.4 Sieben (Kruve o. ä.)

Absieben von Fines (< 200 µm) und Boulders (> 800 µm) erhöht die Gleichmäßigkeit
messbar. Klarheit und Süße steigen deutlich.

Nachteile: 20–40 % Materialverlust, hoher Zeitaufwand, beim Espresso oft
Verlust von Körper und Crema. Als **Diagnosewerkzeug** (Wie viele Fines macht
meine Mühle?) wertvoller als als Alltagsroutine.

---

## 5. Mühlen-Kalibrierung

Das Kernproblem der App: Mahlgrad muss **zwischen Mühlen übertragbar** werden.

### 5.1 Datenmodell

```ts
interface Grinder {
  id: string
  name: string
  burrType: 'flat' | 'conical'
  burrDiameterMm?: number
  scaleType: 'stepped' | 'stepless'
  clicksPerRotation?: number
  micronPerStep: number        // ← die entscheidende Zahl
  zeroPointOffsetMicron: number // Mahlgut-Ø am Berührpunkt (meist ~0)
  usableRange: [number, number] // in Schritten
  confidence: 'measured' | 'vendor' | 'estimated'
}
```

### 5.2 Referenzwerte gängiger Mühlen 🟠

**Diese Werte sind Startpunkte, keine Wahrheit.** Herstellerangaben,
Fertigungstoleranzen und Mahlwerksverschleiß streuen erheblich. Die App sollte
sie als `confidence: 'vendor'` bzw. `'estimated'` führen und den Nutzer über
die Selbstkalibrierung (§5.3) auf `'measured'` heben lassen.

| Mühle | Typ | Schritte/Umdr. | µm/Schritt | Espresso | V60 |
| ----- | --- | -------------- | ---------- | -------- | --- |
| 1Zpresso J-Max | conical | 30 | ~8,8 | 20–34 | 55–75 |
| 1Zpresso JX-Pro | conical | 40 | ~12,5 | 14–24 | 30–45 |
| 1Zpresso JX | conical | 20 | ~25 | 7–12 | 15–22 |
| 1Zpresso K-Ultra | conical | 30 | ~12,5 | 14–24 | 30–45 |
| Comandante C40 | conical | 30 | ~30 | 6–12 | 18–28 |
| Timemore C2/C3 | conical | 36 | ~30 | 6–11 | 16–24 |
| Kingrinder K6 | conical | 240* | ~16 | 30–50 | 65–95 |
| Kingrinder K4 | conical | – | ~22 | 20–36 | 45–70 |
| Baratza Encore | conical | 40 gesamt | ~55 | n. e.† | 15–22 |
| Niche Zero | conical | stufenlos 0–50 | ~10‡ | 10–18 | 28–40 |
| Eureka Mignon | flat | stufenlos | – | Wormwheel | – |
| DF64 / DF54 | flat | stufenlos | ~10‡ | – | – |

\* Feinrasterung über mehrere Umdrehungen
† Encore ist für Espresso nicht fein genug (ohne Umbau)
‡ pro Skalenteil, geschätzt

### 5.3 Selbstkalibrierung — die zuverlässige Methode

So bestimmt der Nutzer `micronPerStep` für seine Mühle, ohne Sieb und ohne
Herstellerangabe. **Diese Prozedur gehört als geführter Ablauf in die App.**

```
1. Bohne fixieren (eine Tüte, gleicher Röstgrad, gleiches Alter)
2. Rezept fixieren: 18 g in, 36 g out, gleiche Temperatur, gleiche Puck-Prep
3. Shot bei Einstellung S₁ → Zeit t₁ notieren
4. 4 Schritte gröber → Einstellung S₂ → Zeit t₂ notieren
5. Auswerten mit F-22:

       d₂/d₁ = √(t₁/t₂)

   Beispiel: t₁ = 34 s, t₂ = 24 s  →  d₂/d₁ = √(34/24) = 1,190
   → 4 Schritte entsprechen +19,0 % Partikelgröße

6. Absolutwert schätzen: bei Espresso ist d₁ ≈ 300 µm
   → Δd = 300 × 0,190 = 57 µm über 4 Schritte
   → micronPerStep ≈ 14,3 µm
```

**Warum das funktioniert:** F-22 verknüpft eine gut messbare Größe (Zeit) mit
einer schlecht messbaren (Partikelgröße) über einen physikalisch belastbaren
Zusammenhang. Der Absolutwert bleibt eine Schätzung, aber das **Verhältnis**
ist belastbar — und genau das braucht die App, um Empfehlungen in Klicks
auszudrücken.

**Voraussetzungen, die die App prüfen muss:**
- Beide Shots ohne Channeling (`flowState` ∈ {normal, slow, fast})
- Gleiche Bohne, Altersunterschied < 3 Tage
- Identische Dosis (±0,2 g)

### 5.4 Übertragung zwischen Mühlen

```js
// Rezept von Mühle A auf Mühle B übertragen
micronA = grinderA.zeroPointOffsetMicron + settingA * grinderA.micronPerStep
settingB = (micronA - grinderB.zeroPointOffsetMicron) / grinderB.micronPerStep
```

🟠 · Liefert einen **Startpunkt, keine Endeinstellung.** Unterschiedliche
Mahlwerksgeometrien erzeugen bei gleichem Median unterschiedliche Verteilungen.
Die App sollte das Ergebnis mit einem Toleranzband anzeigen (± 2 Schritte)
statt als exakte Zahl.

---

## 6. Diagnose über das Mahlgut

| Beobachtung | Ursache | Maßnahme |
| ----------- | ------- | -------- |
| Klumpen im Korb | Statik | RDT + WDT |
| Mahlgut sprüht/klebt | Statik | RDT |
| Sichtbar sehr ungleiche Partikel | stumpfe/dejustierte Mahlscheiben | Alignment prüfen, Mahlscheiben tauschen |
| Espresso choked trotz grober Einstellung | Retention, altes Mahlgut | Purge, Mühle reinigen |
| Zeit schwankt ±5 s bei identischem Rezept | Dosierstreuung oder Retention | wiegen, Single Dosing, RDT |
| V60 stallt regelmäßig | zu viele Fines | gröber + weniger Agitation, ggf. sieben |
| Mahlgut warm nach dem Mahlen | zu hohe Drehzahl / stumpf | langsamer mahlen |

---

## 7. Für die App

### Anzeigelogik
Immer **zwei Zahlen** zeigen:
1. Die mühlenspezifische Einstellung („22 Klicks") — was der Nutzer einstellt
2. Die abgeleitete Partikelgröße („≈ 310 µm") — was übertragbar ist

### Empfehlungsausgabe
Nicht: *„etwas feiner mahlen"*
Sondern: *„3 Klicks feiner (≈ −40 µm). Erwartete Shotzeit danach: 31 s."*

Die erwartete Zeit ergibt sich aus F-22 rückwärts:
$t_{neu} = t_{alt}\cdot(d_{alt}/d_{neu})^2$

### Sperrregel
Bei `flowState ∈ {uneven, spritzing}` ist die gemessene Zeit physikalisch
bedeutungslos. Die App muss dann **jede** Mahlgradempfehlung unterdrücken und
stattdessen auf Puck-Prep verweisen (kb/08 §4). Ohne diese Sperre schickt die
Engine den Nutzer in eine Spirale, in der er einen Kanal mit dem Mahlgrad zu
beheben versucht — der klassischste aller Dial-in-Fehler.
