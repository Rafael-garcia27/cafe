# 08 — Espresso (Siebträger)

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Vollständige Methodenspezifikation. Druckextraktion, ~25–35 s, das
anspruchsvollste und unversöhnlichste der drei Verfahren.

---

## 1. Definition

> Espresso ist ein Getränk aus 7–22 g fein gemahlenem Kaffee, durch das
> 6–9 bar heißes Wasser (88–96 °C) in 20–40 s gepresst werden, sodass
> 14–55 g eines konzentrierten, emulgierten Getränks mit 7–12 % TDS entstehen.

Kein anderes Verfahren erzeugt eine **Emulsion** (Lipidtröpfchen im Wasser)
und eine **Suspension** (feinste Feststoffpartikel). Genau daraus entstehen
Körper, Textur und Crema. Espresso ist deshalb nicht „starker Kaffee", sondern
physikalisch ein anderes Getränk.

---

## 2. Ausrüstung

| Komponente | Kritisch | Anmerkung |
| ---------- | -------- | --------- |
| Mühle | ⭐⭐⭐ | Wichtiger als die Maschine. Ohne feine, gleichmäßige Verstellbarkeit ist Dial-in unmöglich. |
| Maschine | ⭐⭐ | Braucht: stabile Temperatur, ~9 bar, 58 mm (oder definierte Alternative) |
| Waage 0,1 g | ⭐⭐⭐ | Ohne Auswaage-Messung ist die Ratio unbekannt → kein Rezept |
| Bodenloser Siebträger | ⭐⭐ | Das beste Diagnosewerkzeug überhaupt — Channeling wird sichtbar |
| Präzisionskorb | ⭐ | Gleichmäßigere Lochung als Standardkörbe |
| WDT-Werkzeug | ⭐⭐ | Nadeln 0,3–0,4 mm |
| Tamper (passend!) | ⭐⭐ | 58,3–58,5 mm für 58er Körbe; zu klein lässt einen Randspalt |
| Verteiler / Leveler | ⭐ | Nice-to-have, ersetzt WDT nicht |
| Puck Screen | ⭐ | Sauberere Brausescheibe, gleichmäßigere Benetzung |

> **Die Prioritätsreihenfolge für Neuanschaffungen lautet: Mühle → Waage →
> bodenloser Siebträger → Maschine.** Eine 300-€-Maschine mit einer 500-€-Mühle
> schlägt eine 1500-€-Maschine mit einer 100-€-Mühle deutlich.

---

## 3. Zielwerte

### 3.1 Standard-Startpunkte 🟡

| Röstgrad | Dosis (58 mm) | Ratio | Yield | Zeit | Temp |
| -------- | ------------- | ----- | ----- | ---- | ---- |
| hell | 18 g | 1:2,5–1:3,0 | 45–54 g | 28–35 s | 94–96 °C |
| mittel-hell | 18 g | 1:2,2–1:2,6 | 40–47 g | 27–32 s | 93–95 °C |
| mittel | 18 g | 1:2,0–1:2,3 | 36–41 g | 26–30 s | 92–94 °C |
| mittel-dunkel | 18 g | 1:1,8–1:2,1 | 32–38 g | 25–29 s | 90–93 °C |
| dunkel | 17 g | 1:1,7–1:2,0 | 29–34 g | 22–28 s | 88–92 °C |

Die Zeit wird **ab Pumpenstart** gemessen (inkl. Präinfusion), nicht ab dem
ersten Tropfen. Beide Konventionen sind verbreitet — die App muss festlegen,
welche gilt, und es in der UI benennen. Empfehlung: **ab Pumpenstart**, weil
das die einzige Größe ist, die jede Maschine gleich messen kann.

### 3.2 Getränkevarianten über die Ratio

| Name | Ratio | 18 g ergibt | Charakter |
| ---- | ----- | ----------- | --------- |
| **Ristretto** | 1:1 – 1:1,5 | 18–27 g | dicht, sirupös, süß, weniger Bitterkeit — die *früh* gelösten Stoffe dominieren |
| **Espresso** | 1:2 – 1:2,5 | 36–45 g | Referenz |
| **Lungo** | 1:3 – 1:4,5 | 54–81 g | leichter, aromatischer, mehr Bitterkeit — hohe Extraktion, niedrige Stärke |
| **Turbo Shot** | 1:3 – 1:5, grob, 6 bar | 54–90 g | 15–20 s, sehr grob gemahlen; hohe EY ohne Bitterkeit; nur bei hellen Röstungen sinnvoll |

**Wichtig gegen ein verbreitetes Missverständnis:** Ein Ristretto ist **nicht**
„ein kürzer laufender Espresso mit derselben Einstellung". Wer den Shot einfach
früher stoppt, erhält Unterextraktion. Ein echter Ristretto braucht einen
**gröberen Mahlgrad**, damit in der kürzeren Wassermenge dieselbe Zeit und
damit eine ausreichende EY erreicht wird.

### 3.3 Messgrößen

| Größe | Ziel | Formel |
| ----- | ---- | ------ |
| Ratio | 1:2 ±0,3 | F-02 |
| Flussrate | 1,2–1,6 g/s | F-24 |
| TDS | 8–11 % | gemessen |
| EY | 19–22 % | F-06 |
| Dosisdichte | 0,62–0,76 g/cm² | F-25 |

---

## 4. Puck Prep — der Schritt, an dem die meisten scheitern

Reihenfolge, jeder Schritt mit Zweck:

```
1. Siebträger absolut trocken       Restfeuchte startet lokale Extraktion
2. Mahlen mit RDT                   Statik brechen (kb/07 §4.1)
3. Auf 0,1 g genau dosieren         Ratio ist sonst unbekannt
4. WDT, 8–12 Bewegungen             Klumpen auflösen, Dichte vereinheitlichen
5. Level (Verteiler oder klopfen)   ebene Oberfläche
6. Tampen: eben > fest              ~10–15 kg, entscheidend ist die Ebenheit
7. Nicht mehr klopfen!              erzeugt Risse im fertigen Puck
8. (optional) Puck Screen auflegen  gleichmäßigere Benetzung
9. Brühgruppe kurz spülen           Temperatur stabilisieren, Reste entfernen
10. Sofort einspannen und starten   Aufheizen des Pucks vermeiden
```

### 4.1 Tamping — was wirklich zählt

| Mythos | Realität |
| ------ | -------- |
| „30 lbs / 15 kg exakt" | Der Druck ist nach dem Erreichen der Verdichtung irrelevant. Ab ~10 kg ändert mehr Kraft praktisch nichts mehr — 9 bar Wasserdruck überschreiben jede Handkraft. |
| „Fest tampen macht langsamer" | Marginal. Der Mahlgrad regelt die Zeit, nicht die Tampkraft. |
| „Drehen/polieren hilft" | Nein. Es versiegelt bestenfalls die Oberfläche. |
| **„Schief tampen ruiniert den Shot"** | **Ja.** Ein um 1° geneigter Puck erzeugt eine dünnere Seite → dort strömt bevorzugt Wasser → Channeling. |

**Merksatz: Eben schlägt fest.** Ein kalibrierter Tamper oder ein
selbstnivellierender Verteiler löst dieses Problem dauerhaft.

### 4.2 Channeling — Erkennung und Behebung

**Erkennung (bodenloser Siebträger):**
- Mehrere getrennte Strahlen statt einem zusammenlaufenden Strang
- Seitliches Spritzen, helle Stellen
- Sehr frühes Blonding (heller Strahl vor Erreichen der Zielmenge)
- Nach dem Shot: Krater, Rinne am Rand, Loch in der Mitte

**Ursachen nach Häufigkeit:**
1. Ungleichmäßige Verteilung vor dem Tampen → **WDT**
2. Schiefer Tamp → kalibrierter Tamper
3. Klopfen nach dem Tampen → weglassen
4. Zu wenig Headspace (Überdosierung) → Dosis reduzieren
5. Zu viel Headspace (Unterdosierung) → Dosis erhöhen
6. Beschädigter/verstopfter Korb → reinigen oder ersetzen
7. Zu fein gemahlen für die Bohne → gröber

> **Zentrale Regel für die Engine:** Channeling wird **nicht** über den
> Mahlgrad behoben. Solange `flowState ∈ {uneven, spritzing}` oder
> `puckState ∈ {crater, sideChannel}`, ist jede Mahlgradempfehlung gesperrt
> (kb/07 §7). Erst Technik korrigieren, dann wieder einmessen.

---

## 5. Temperatur

| Röstgrad | Brühtemperatur |
| -------- | -------------- |
| hell | 94–96 °C |
| mittel | 92–94 °C |
| dunkel | 88–92 °C |

**Wirkung:** ±1 °C ≈ ∓0,2–0,3 Prozentpunkte EY 🟠.

**Praktisch:**
- Temperatur ist ein **Feinwerkzeug** nach Mahlgrad und Ratio (Priorität 3)
- Ohne PID: „Temperature Surfing" bei Einkreisern — Aufheizphase abwarten,
  Leerbezug, definierte Wartezeit, dann brühen
- Siebträger und Korb **immer eingespannt** vorheizen — ein kalter Korb kostet
  2–4 °C in den ersten Sekunden 🟠

---

## 6. Druck und Präinfusion

### 6.1 Klassisch: 9 bar

Historischer Standard (Federkraft der Hebelmaschinen). Funktioniert gut für
mittlere und dunkle Röstungen.

### 6.2 Präinfusion

Niedriger Druck (2–4 bar) oder drucklos für 3–10 s vor dem Vollduck.

**Wirkung:**
- Puck wird gleichmäßig benetzt, bevor der volle Druck wirkt
- CO₂ kann entweichen
- Deutlich weniger Channeling
- Der Puck setzt sich gleichmäßig

**Praxis:** 5 s Präinfusion sind fast immer eine Verbesserung. Bei sehr frischem
Kaffee (< 8 Tage) bis 10 s.

### 6.3 Druckprofilierung

| Profil | Verlauf | Wirkung |
| ------ | ------- | ------- |
| Flat 9 bar | konstant | Referenz, kräftig |
| **Declining** | 9 → 6 bar | mehr Süße, weniger Bitterkeit am Shot-Ende |
| **Low-pressure flat** | 6 bar | höhere EY bei weniger Bitterkeit; ideal für helle Röstungen |
| Blooming | Präinfusion → Pause → Rampe | maximale Gleichmäßigkeit bei frischem Kaffee |

**Der wichtigste Befund:** Mehr Druck als 9 bar verbessert nichts. Über ~9 bar
steigt die Kanalisierungsneigung, das Bett verdichtet sich stärker, und die EY
kann sogar **fallen**. Moderne Profile gehen deshalb eher zu 6–7 bar.

Für die App: `pressureProfile: PressurePoint[]` mit `{ atSecond, bar }`.
Nur relevant für Maschinen mit Profilierung — sonst ausblenden.

---

## 7. Crema

Schaum aus CO₂-Blasen, stabilisiert durch Melanoidine, Proteine und Lipide.

| Beobachtung | Bedeutung |
| ----------- | --------- |
| Haselnussbraun, feinporig, 3–4 mm, hält > 2 min | ✅ gut |
| Sehr hell, dünn, zerfällt sofort | Unterextraktion, zu grob, oder Bohne alt |
| Sehr dunkel, große Blasen, „Tigerfell"-Flecken | zu fein, überextrahiert, oder sehr dunkle Röstung |
| Übertrieben dick, schaumig, blasig | Bohne zu frisch (< 5 d), viel CO₂ |
| Fehlt fast vollständig | Bohne > 6 Wochen alt |

> **Crema ist ein Frische- und Prozessindikator, kein Qualitätsurteil.**
> Dunkle Röstungen und Robusta erzeugen mehr Crema, ohne besser zu sein.
> Sehr helle Röstungen erzeugen wenig Crema — das ist normal.
> Die App sollte Crema als Diagnosehinweis führen, nie als Bewertungskriterium.

---

## 8. Ablauf (App-Schrittfolge)

```
STEP 1  Maschine aufheizen (mind. 20 min, Siebträger eingespannt)
STEP 2  Bohnen wiegen (Ziel: doseG)
STEP 3  RDT: 1–2 Tropfen Wasser
STEP 4  Mahlen
STEP 5  Auswiegen, ggf. korrigieren (±0,1 g)
STEP 6  WDT, 8–12 Bewegungen
STEP 7  Leveln
STEP 8  Tampen — eben, ~10–15 kg
STEP 9  Brühgruppe 2 s spülen
STEP 10 Einspannen, Tasse auf Waage, Waage tarieren
STEP 11 Start — Timer läuft ab Pumpenstart
STEP 12 Bei targetYieldG stoppen
STEP 13 Erfassen: Zeit, Auswaage, flowState, puckState
STEP 14 Verkosten und bewerten
```

**UI-Hinweis:** Schritte 10–12 brauchen einen Live-Modus mit Waagenanzeige und
Timer. Wenn eine Bluetooth-Waage angebunden werden kann (Acaia, Bookoo,
Timemore Black Mirror), ist das der wertvollste Integrationspunkt der ganzen App
— es ist der einzige Moment, in dem der Nutzer beide Hände braucht.

---

## 9. Methodenspezifische Diagnose

| Symptom | Wahrscheinlichste Ursache | Korrektur |
| ------- | ------------------------- | --------- |
| Sauer, dünn, salzig, schnell durchgelaufen | Unterextraktion | Mahlgrad feiner (F-22) |
| Bitter, trocken, adstringierend, langsam | Überextraktion | Mahlgrad gröber (F-22) |
| **Sauer UND bitter** | ungleichmäßige Extraktion | **Puck Prep**, nicht Mahlgrad |
| Zeit stimmt, schmeckt trotzdem sauer | Temperatur zu niedrig oder Ratio zu eng | Temp +1–2 °C, dann Ratio weiter |
| Zeit stimmt, schmeckt trotzdem bitter | Temperatur zu hoch oder Ratio zu weit | Temp −2 °C, dann Ratio enger |
| Choked (> 45 s) | zu fein oder überdosiert | 3–4 Schritte gröber, Dosis −0,5 g |
| Gusher (< 15 s) | zu grob oder großer Kanal | Prep prüfen, dann feiner |
| Zeit schwankt ±5 s bei gleichem Rezept | Dosierstreuung, Retention, inkonsistenter Tamp | wiegen, RDT, kalibrierter Tamper |
| Shot startet spät (> 12 s bis 1. Tropfen) | sehr fein oder hohe Präinfusion | normal bei feinem Mahlgrad |
| Blondet sehr früh | Channeling oder zu grob | Prep prüfen |
| Flach, langweilig, EY korrekt | **Wasser** (KH zu hoch) | kb/06 |
| Sauer bleibt trotz 3× feiner + wird bitter | **Röstung unterentwickelt** | Bohne wechseln (kb/05 §1.2) |

---

## 10. Wartung (wirkt direkt auf den Geschmack)

| Intervall | Aufgabe |
| --------- | ------- |
| Nach jedem Bezug | Siebträger ausklopfen, ausspülen, Brausescheibe abspülen |
| Täglich | Blindsieb-Rückspülung (ohne Reiniger), Dampflanze innen und außen |
| Wöchentlich | Rückspülen **mit** Reiniger, Körbe und Siebträger einlegen |
| Monatlich | Brausescheibe abschrauben und reinigen, Duschsieb, Dichtung prüfen |
| Halbjährlich | Brühgruppendichtung tauschen (bei Vielnutzung) |
| Nach Härte | Entkalken — nur wenn KH > 40 mg/L relevant (kb/06) |

**Ranziges Kaffeeöl** in Sieb und Brausescheibe ist eine der häufigsten
unerkannten Ursachen für dumpfe, bittere Espressi. Ein wöchentliches Rückspülen
mit Reiniger ist geschmacklich wirksamer als die meisten Rezeptänderungen.

Für die App: Wartungsintervalle sind an die **Anzahl der Bezüge** koppelbar,
nicht an den Kalender. Nach 50 Bezügen eine Erinnerung — das ist präziser als
„jeden Sonntag" und wird eher befolgt.
