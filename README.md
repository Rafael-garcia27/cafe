# Kaffee-Wissensbasis (Barista-App)

Fachliche und maschinenlesbare Grundlage für eine Barista-App.
Kein Endnutzer-Dokument — **Quelle der Wahrheit** für Datenmodell, Rechenkern,
Empfehlungs- und Diagnose-Engine.

Abgedeckte Methoden: **Espresso (Siebträger)**, **V60 (Handfilter)**, **AeroPress**.
Abgedeckte Getränke: Espresso, Ristretto, Lungo, Americano/Long Black, Flat White,
Cappuccino, Latte, Cortado/Gibraltar, Pour Over, Batch, Cold Brew, Japanese Iced,
Iced Latte, Espresso Tonic, Affogato, Shakerato u. a. — inkl. Iced-Varianten.

---

## Verzeichnisstruktur

```
Barista/
├── README.md                        ← dieses Dokument
├── kb/                              ← Fachwissen (Markdown, Quelle der Wahrheit)
│   ├── START-HIER.md            ⭐  Kaffee von null, ohne Vorwissen — 20 Min.
│   ├── GLOSSAR.md               ⭐  Jeder Fachbegriff einzeln erklärt
│   ├── 00-domaenenmodell.md         Entitäten, Beziehungen, Enums, App-Architektur
│   ├── 01-extraktionstheorie.md     Was passiert physikalisch/chemisch
│   ├── 02-formelsammlung.md         ALLE Formeln, computable, mit Einheiten
│   ├── 03-variablen-referenz.md     Jede Variable: Range, Default, Wirkrichtung
│   ├── 04-rohkaffee.md              Herkunft, Varietät, Anbau, Aufbereitung
│   ├── 05-roestung-frische.md       Röstgrad, Degassing, Alterung
│   ├── 06-wasser.md                 Wasserchemie, Zielwerte, Rezepte
│   ├── 07-mahlgut.md                Partikelgrößen, Fines, Mühlen-Kalibrierung
│   ├── 08-methode-espresso.md       Vollständige Methodenspezifikation
│   ├── 09-methode-v60.md            Vollständige Methodenspezifikation
│   ├── 10-methode-aeropress.md      Vollständige Methodenspezifikation
│   ├── 11-milch.md                  Milchwissenschaft, Texturierung, Ratios
│   ├── 12-getraenke.md              Getränke-Rezepturen als Kompositionen
│   ├── 13-iced-und-cold.md          Iced/Cold-Brew inkl. Schmelz-Thermodynamik
│   ├── 14-diagnostik.md             Symptom → Ursache → Korrektur (Regelwerk)
│   ├── 15-dial-in.md                Dial-in als deterministische Algorithmen
│   └── 16-sensorik.md               Verkostung, Deskriptoren, Scoring
├── data/                            ← App-Daten (JSON, aus kb/ abgeleitet)
│   ├── glossary.json            ⭐  Begriffserklärungen als App-Inhalt (Tooltips)
│   ├── variables.json               Variablen-Registry mit Ranges/Defaults
│   ├── methods.json                 Methodenprofile + Startrezepte
│   ├── drinks.json                  Getränke-Kompositionen
│   ├── formulas.json                Formeln als evaluierbare Ausdrücke
│   ├── diagnostics.json             Diagnose-Regelwerk
│   ├── origins.json                 Herkunftsprofile
│   └── grinders.json                Mühlen-Kalibrierungsdaten
└── types/
    ├── domain.ts                    TypeScript-Vertrag + Rechenkern (reine Funktionen)
    └── domain.test.ts               Regressionstest gegen alle Rechenbeispiele aus kb/
```

**Verifikation.** Jedes in `kb/` ausgerechnete Beispiel ist in
`types/domain.test.ts` als Assertion hinterlegt und läuft grün. Wenn
Dokumentation und Implementierung auseinanderlaufen, gilt
`kb/02-formelsammlung.md`.

```bash
npm test
```

---

## Wenn du noch nie mit Kaffee gearbeitet hast

**Lies zuerst `kb/START-HIER.md`.** Es erklärt in 20 Minuten und ohne Vorwissen,
was beim Kaffeekochen physikalisch passiert, warum es genau zwei Fehlerbilder
gibt und wie die drei Methoden zusammenhängen. Danach ist jedes andere Kapitel
verständlich.

Einzelne Begriffe schlägt man in `kb/GLOSSAR.md` nach — dort ist jeder
Fachausdruck der gesamten Wissensbasis erklärt, ohne Voraussetzungen.

> **Wichtig fürs Produkt:** Die Begriffe in `data/glossary.json` sind kein
> Doku-Beiwerk, sondern **App-Inhalt**. Wer „Overrun", „Extraktionsausbeute"
> oder „Kanalbildung" nicht kennt, versteht auch keine Empfehlung, die diese
> Wörter verwendet. Jeder Fachbegriff, der in der UI auftaucht, braucht ein
> Info-Icon — und der Einsteigermodus zeigt nur Begriffe mit `level: "basis"`.

---

## Leseanleitung für die App-Entwicklung

| Ich baue …                    | Ich lese …                                  | Ich importiere …        |
| ----------------------------- | ------------------------------------------- | ----------------------- |
| Verständnis der Domäne        | **`kb/START-HIER.md`**                      | –                       |
| Erklärtexte / Tooltips        | `kb/GLOSSAR.md`                             | `data/glossary.json`    |
| Datenmodell / DB-Schema       | `kb/00-domaenenmodell.md`                   | `types/domain.ts`       |
| Rechenkern (TDS, EY, Ratio)   | `kb/02-formelsammlung.md`                   | `data/formulas.json`    |
| Slider, Eingabefelder, Limits | `kb/03-variablen-referenz.md`               | `data/variables.json`   |
| „Startpunkt vorschlagen"      | `kb/08`–`kb/10`, `kb/15-dial-in.md`         | `data/methods.json`     |
| „Was ist schiefgelaufen?"     | `kb/14-diagnostik.md`                       | `data/diagnostics.json` |
| Getränke-Auswahl & Aufbau     | `kb/12-getraenke.md`, `kb/11-milch.md`      | `data/drinks.json`      |
| Iced-Modus                    | `kb/13-iced-und-cold.md`                    | `data/drinks.json`      |
| Bohnen-Anlage & Empfehlung    | `kb/04-rohkaffee.md`, `kb/05-roestung`      | `data/origins.json`     |
| Frische-Anzeige               | `kb/05-roestung-frische.md`                 | `data/formulas.json`    |
| Mühlen-Umrechnung             | `kb/07-mahlgut.md`                          | `data/grinders.json`    |
| Verkostungs-UI                | `kb/16-sensorik.md`                         | `data/variables.json`   |

---

## Verhältnis zur bestehenden `barista-pwa`

Die vorhandene PWA (`../barista-pwa`) deckt bereits ab: `Bean`/`Bag`/`BrewLog`,
drei Methoden, Taste-Tags, Puck-/Flow-State, Engines für Diagnose, Empfehlung,
Frische, Mühle, Eignung.

Diese Wissensbasis ist ein **echtes Superset** davon. Erweiterungen gegenüber
dem aktuellen Modell:

- `Recipe` als eigene Entität mit **Schritt-Sequenz** (Bloom, Guss, Steep, Press)
  → macht V60/AeroPress reproduzierbar statt nur „Wasser + Zeit"
- `Drink` getrennt von `Brew` → Flat White ist eine Komposition aus Shot + Milch,
  kein eigenes Brühverfahren
- Messgrößen `TDS` / `EY` → Diagnose wird objektiv statt rein sensorisch
- `Equipment` als Entität (Korbgröße, Mühle, Filter) → Rezepte werden übertragbar
- `Water` als Entität → erklärt sonst unerklärliche Geschmacksabweichungen
- Aufbereitung erweitert: `anaerobic`, `carbonic-maceration`, `wet-hulled`
- Iced/Cold als **Modifikator** jedes Rezepts, nicht als Extra-Methode
- Diagnose-Regeln mit **quantifizierten Korrektur-Deltas** statt nur Richtung

Details und Migrationshinweise: `kb/00-domaenenmodell.md`, Abschnitt 9.

---

## Konventionen in allen Dokumenten

- **Einheiten**: Masse in Gramm (g), Temperatur in °C, Zeit in Sekunden (s),
  Druck in bar, Partikelgröße in µm, Wasserhärte in mg/L CaCO₃ (ppm).
- **Alles wird gewogen, nichts wird volumetrisch dosiert.** „ml" erscheint nur
  bei Glasgrößen und Milchvolumen (dort, wo Schaum das Volumen definiert).
  Für Wasser gilt näherungsweise 1 ml = 1 g (bei 20 °C exakt 0,998 g/ml).
- **Verhältnisse** werden als `1:n` geschrieben (Kaffee : Wasser bzw.
  Kaffee : Getränk). Intern immer als Zahl `n` speichern.
- **Konfidenz-Kennzeichnung** bei jeder Zahl:
  - 🟢 **gesichert** — physikalisch/chemisch belegt oder normiert (SCA, ISO)
  - 🟡 **etabliert** — breiter Branchenkonsens, empirisch robust
  - 🟠 **heuristisch** — Erfahrungswert, setup-abhängig, muss kalibriert werden
  
  Die App sollte 🟠-Werte als *anpassbar* behandeln und aus Nutzer-Logs lernen.

---

## Stand

Aufgebaut am 2026-08-18. Zielsetup des Nutzers: Siebträger + separate
Espressomühle, V60 + Handmühle, AeroPress.
