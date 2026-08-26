# Vergleich: `barista-pwa` (alt) vs. `dialed` (neu)

Erstellt **nach** Iteration 1 — bewusst so, damit der Altbestand das Ergebnis
nicht verankert (Briefing F5). `barista-pwa` wurde ausschließlich lesend
analysiert; dort liegt uncommittete Arbeit.

Stand: 2026-08-26

---

## 1. Kennzahlen

| | `barista-pwa` | `dialed` |
|---|---|---|
| TypeScript/TSX | 4.443 Zeilen | 7.337 Zeilen |
| Fachwissen als Daten | 0 | 8 JSON-Dateien |
| Fachdokumentation | – | 17 Kapitel (`kb/`) |
| Tests | **0** | **92** |
| Größte Datei | `BrewScreen.tsx` (944) | `BrewScreen.tsx` (693) |
| UI-Sprache | Englisch | Deutsch |
| Service Worker | **nein** | ja |
| Deployment | keins | GitHub Pages + CI |
| Datensicherung | Zwischenablage | Datei + Share-API + Import |

---

## 2. Wo `dialed` weiter ist

### 2.1 Wissen als Daten statt als Code

`barista-pwa` kodiert Zielwerte in `rules.ts` als TypeScript-Tabellen —
Espresso-Startpunkte, V60-Zeiten, Schwellen. Jede fachliche Korrektur ist ein
Codeeingriff mit Deploy-Risiko.

`dialed` liest alles aus `data/*.json`. Eine geänderte Zielzeit ist eine
Datenänderung. `src/kb/index.ts` ist der einzige Ort, der die JSON kennt.

### 2.2 Gestaffelte Engine statt flacher Regelsammlung

`barista-pwa` sammelt Vorschläge additiv ein und zieht Punkte ab. Ein Shot mit
mehreren Auffälligkeiten kann **sechs Vorschläge gleichzeitig** liefern —
Grind, Yield, Extraction, Temperature, Dose, Distribution.

`dialed` läuft in vier Stufen mit Sperren und gibt **genau eine** Korrektur aus.
Ohne diese Beschränkung ist nach dem nächsten Durchgang nicht mehr feststellbar,
welche Änderung gewirkt hat.

### 2.3 Kanalbildung wird als Sperre behandelt, nicht als Punktabzug

`barista-pwa`, bei nassem Puck:
```
score -= 5
suggestions.push({ parameter: 'Distribution', … })
```
Der Mahlgradvorschlag daneben bleibt bestehen — obwohl die gemessene Zeit bei
Kanalbildung physikalisch bedeutungslos ist.

`dialed` sperrt (D-01/D-02) alle Mahlgrad- und Ratio-Empfehlungen, bis die
Verteilung stimmt.

### 2.4 Mahlgradkorrektur aus Physik statt Pauschalwert

| Anlass | `barista-pwa` | `dialed` |
|---|---|---|
| Zeit zu lang | +3 Klicks | √(t_ist/t_ziel), typ. 2–5 |
| sauer | −2 Klicks | dieselbe Formel |
| choked | +4 Klicks | dieselbe Formel |

Die alte App nimmt feste Beträge unabhängig davon, **wie weit** daneben.
`dialed` rechnet nach dem Durchflussgesetz und liefert zusätzlich eine
überprüfbare Zeitvorhersage.

### 2.5 Zwei Lernmodelle statt „bester Shot"

`barista-pwa` merkt sich den bestbewerteten Durchgang je Bohne × Methode.

`dialed` führt zusätzlich ein **Prozessmodell** (Zeitabweichung, Streuung) und
ein **Präferenzmodell** (systematische Ratio-/Temperaturabweichung über alle
Bohnen). Damit lernt es nicht nur *diese Bohne*, sondern *diesen Nutzer*.

### 2.6 Ursachen außerhalb der Brühparameter

Nur in `dialed`:
- **Wasser-Gate** — Extraktion objektiv gut, schmeckt trotzdem flach
- **Röstungsverdacht** — dreimal feiner gegangen, Säure bleibt, Bitterkeit kommt
- **Schleifenerkennung** — Oszillation und Sackgassen
- **Streuungswarnung** — erst wiederholbar machen, dann Rezept ändern
- **Frische-Drift** — Mahlgrad über die Lebensdauer der Tüte mitführen

### 2.7 Fehler- und Charakterachse getrennt

`barista-pwa` führt `TasteTag` flach: `sour` (Fehler) und `bright` (positive
Eigenschaft) stehen gleichrangig. Die Diagnose kann nicht unterscheiden, ob sie
handeln soll.

`dialed` trennt `Defect[]` (löst aus) von `Character[]` (beschreibt nur).

### 2.8 Mühle als Abstraktion statt fest verdrahtet

`barista-pwa` verdrahtet **eine** Mühle:
```ts
export const GRINDER_RANGES = { espresso: {min:20,max:30}, … }
export function clicksToScale(c) { return (c/10).toFixed(1) }
```
Das ist die Mylo SG2 — ohne dass sie benannt wird.

`dialed` hat einen Katalog, `micronPerStep`, Selbstkalibrierung über zwei Shots
und Übertragung zwischen Mühlen. Die Mylo ist voreingestellt, aber austauschbar.

### 2.9 Betrieb

`dialed`: Service Worker, vollständig offline, GitHub Pages mit CI, die vor dem
Ausliefern Typprüfung und 92 Tests fährt. Datensicherung über Share-API mit
Datei- und Zwischenablage-Rückfall.

`barista-pwa`: kein Service Worker, kein Deployment, Export nur in die
Zwischenablage.

---

## 3. Wo `barista-pwa` besser ist

Diese Punkte sind in `dialed` nachzuziehen.

### 3.1 Frischemodell mit Aufbereitung ⚠️ echte Lücke

`barista-pwa` staffelt nach **Methode × Röstgrad × Aufbereitung** in sechs
Stufen (`tooFresh`, `earlyPeak`, `peak`, `latePeak`, `aging`, `old`).

`dialed` kennt nur **Methode × Röstgrad**.

Der fehlende Faktor ist fachlich belegt: Natural und Honey brauchen 3–7 Tage
länger als Washed, weil Restzucker im Mucilage die Ausgasung verzögert. Beispiel
aus der alten App (Espresso, hell):

| Aufbereitung | zu frisch bis Tag |
|---|---|
| Washed | 7 |
| Honey | 5 |
| Natural | 3 |

**Bewertung:** Die alte App ist hier feiner und hat recht.

### 3.2 Widerspruch beim AeroPress-Mahlgrad ⚠️ zu klären

| Quelle | AeroPress |
|---|---|
| `barista-pwa`, Kommentar „User-confirmed ranges" | 30–50 Klicks = Skala **3–5** |
| `dialed`, aus Nachbarwerten abgeleitet | 40–60 Klicks = Skala **4–6** |

Ein vom Nutzer bestätigter Wert wiegt schwerer als meine Ableitung. Die
Mylo-Skala hat bei 3–4 allerdings „MOKAPOT" stehen, was gegen 3–5 spricht.
**Nachfragen, nicht raten.**

### 3.3 Schwundfaktor beim Bohnenbestand

`barista-pwa`:
```ts
const WASTE_FACTOR = 1.12
used = brews.reduce((s,b) => s + b.params.doseIn * WASTE_FACTOR, 0)
```
Berücksichtigt Retention in der Mühle, Verschütten und Spülschüsse.

`dialed` zieht nur die Dosis ab und überschätzt die Restmenge dadurch um ~12 %.

### 3.4 Fragen-Assistent

`barista-pwa` hat eine schlagwortbasierte Wissensdatenbank („Warum ist mein
Kaffee sauer?"). `dialed` hat ein Glossar — das erklärt Begriffe, beantwortet
aber keine Fragen.

### 3.5 Gesamtnote 0–100

Eine Zahl auf einen Blick. `dialed` hat bewusst keine, weil ein Score
Genauigkeit suggeriert, die ohne Messung nicht existiert — aber der schnelle
Eindruck fehlt.

### 3.6 Wischgesten

`SwipeRow.tsx` — Wischen zum Löschen. In `dialed` gibt es nur Detailseiten.

---

## 4. Interpretation

### 4.1 Zwei verschiedene Produktgattungen

`barista-pwa` ist ein **Protokollwerkzeug mit Ratgeberfunktion**: Es speichert,
bewertet mit einem Score und gibt eine Liste von Hinweisen aus.

`dialed` ist ein **Diagnosewerkzeug**: Es leitet aus Kontext genau einen
nächsten Schritt ab und sagt, wenn das Problem gar nicht in den Parametern liegt.

Das ist genau die Trennung, die du im Briefing gefordert hattest — „mehr als ein
Ratgeber, der sagt: mahle feiner wenn der Kaffee zu schnell fließt". Die alte App
ist wörtlich diese Sorte Ratgeber.

### 4.2 Die alte App weiß mehr über Kaffee, als ihre Struktur zulässt

Das Frischemodell ist erstklassig — 72 handgepflegte Wertebereiche über drei
Dimensionen. Aber es steckt in einer verschachtelten TypeScript-Konstante, ist
nicht getestet und nicht ohne Deploy änderbar.

Umgekehrt hat `dialed` die bessere Struktur, aber an dieser Stelle das ärmere
Modell. **Das ist der stärkste Einzelbefund des Vergleichs:** gutes Wissen in
schlechter Struktur schlägt in einem Detail leere Struktur.

### 4.3 Die alte App war heimlich eine Mylo-App

`GRINDER_RANGES` mit Espresso 20–30, V60 50–80 und `clicksToScale = clicks/10`
ist die Mylo SG2 — nur ohne Namen. Das erklärt rückblickend, warum die
Empfehlungen dort in Klicks funktionierten, obwohl es keine Mühlenabstraktion
gab: Es gab nur eine Mühle.

Nebeneffekt: Die dort hinterlegten Bereiche sind unabhängige Bestätigung meiner
Mylo-Zuordnung — mit Ausnahme von AeroPress (§3.2).

### 4.4 Fehlende Tests erklären den Rest

Ohne Tests ist eine gestaffelte Engine mit Sperren nicht beherrschbar. Die flache
Regelsammlung der alten App ist eine **Folge** dieser Lücke, nicht nur eine
Designentscheidung: Man kann nur bauen, was man prüfen kann.

### 4.5 Englisch war eine Hürde

Die alte App spricht Englisch, obwohl Nutzer und Auftraggeber Deutsch sprechen.
Bei einem Werkzeug, dessen Wert an nachvollziehbaren Begründungen hängt, ist das
teuer — man liest Erklärungen in der Fremdsprache weniger genau.

---

## 5. Übernahmeliste für Iteration 2

| Priorität | Übernehmen | Aufwand |
|---|---|---|
| 1 | Aufbereitung ins Frischemodell (§3.1) | mittel — `data/formulas.json` erweitern |
| 2 | AeroPress-Mahlgrad klären (§3.2) | Rückfrage |
| 3 | Schwundfaktor 1,12 (§3.3) | klein |
| 4 | Wischgesten (§3.6) | klein |
| 5 | Fragen-Assistent (§3.4) | groß — später |
| – | Score 0–100 | **nicht übernehmen**, siehe §3.5 |
