# Abnahme

Prüfung gegen die Kriterien aus `01-briefing.md`, Teil G.
Stand: nach Iteration 3, Deployment live.

**Live:** https://rafael-garcia27.github.io/dialed/
**Repo:** https://github.com/Rafael-garcia27/dialed

---

## Abnahmekriterien

| # | Szenario | Ergebnis | Nachweis |
|---|----------|:--------:|----------|
| G1 | Neue Bohne, nie gebrüht → Startpunkt mit sichtbarer Begründung | ✅ | 4 Tests „G1" |
| G2 | 35 s statt 28 s bei normalem Fluss → „3 Klicks gröber" mit Rechenweg | ✅ | 4 Tests „G2" |
| G3 | „sauer **und** bitter" → keine Mahlgradempfehlung, Technikhinweis | ✅ | 4 Tests „G3" |
| G4 | Referenz 14 Tage älter → automatisch ~1 Klick feiner, begründet | ✅ | 4 Tests „G4" |
| G5 | Bohne 3 Tage alt → Warnung, kein Einmessen | ✅ | 5 Tests „G5" |
| G6 | 3× feiner ohne Besserung, jetzt bitter → Abbruch, Röstungsverdacht | ✅ | 1 Test „G6" |
| G7 | 3 Brews ≥ 4 ★ → persönlicher Startpunkt ersetzt Standard | ✅ | 2 Tests „G7" |
| G8 | 22 Durchgänge mit engeren Ratios → Tendenz wird benannt | ✅ | 3 Tests „G8" |
| G9 | Flugmodus → voll funktionsfähig | ✅ | Service Worker aktiv, 10 Dateien im Precache, App-Shell offline verfügbar |
| G10 | Ganzer Durchgang ≤ 3 Pflichtinteraktionen | ✅ | Start → Stopp → Bewerten; alles andere vorbelegt |
| G11 | iPhone 12 standalone, nichts abgeschnitten | ✅ | 390×844 geprüft, Safe Areas, 100dvh, kein Querscrollen |
| G12 | Datenexport vollständig und wiederherstellbar | ✅ | Share-API mit Datei-Fallback, Import mit Schemaprüfung |

**Zusätzlich:** Wasser-Notausgang (C6), Kanalbildungs-Sperre (C3),
Mühlen-Selbstkalibrierung (C1), Deckelung großer Korrekturen.

---

## Nachweiskette Anforderung → Umsetzung

| Anforderung des Auftraggebers | Umsetzung |
|---|---|
| A1 „**meine** perfekten Shots" | Präferenzmodell je Methode, personalisierbarer Zielkorridor, Pro-Bohne-Referenz |
| A2/A3 „mehr als ein Ratgeber" | 8 Gates, die Empfehlungen aktiv **sperren**, wenn Raten schädlich wäre |
| A4 Loggen (Dose, Zeit, Yield) | `Brew` mit Ist-Werten, Beobachtungen, optionaler Messung |
| A5 Analyse **immer** mit Kaffeeprofil | Röstgrad, Höhe, Dichte, Aufbereitung, Decaf, Lagerung wirken auf jeden Default |
| A6 „Regal" | `Bean` + `Bag`: Herkunft, Farm, Varietät, Röstdatum, Frische-Ring |
| A7 „erst danach" | Vierstufige Engine; jede Stufe blockiert die nächste |
| A8 „welche Parameter **wie stark**" | Durchflussgesetz → Klicks statt Richtungen, plus Zeitprognose |
| A9 Feedback im Kontext | Fehlerachse × Methode × Röstgrad × Ratio × Beobachtung |
| A10 Lernen „wie ich brühe" **und** „was mir schmeckt" | Zwei getrennte Modelle plus Pro-Bohne-Gedächtnis |
| A11 einfach, schnell, reproduzierbar | 4 Tabs, 3 Pflichttaps, deterministische Engine ohne Netz |
| A12 nicht nachbauen | Diagnose- statt Protokollwerkzeug; Best-of dokumentiert in `03` |

---

## Technischer Stand

| | |
|---|---|
| Tests | **92**, alle grün |
| Typprüfung | strict, fehlerfrei |
| Bundle | 118 KB gzip (JS) + 5,5 KB (CSS) |
| Precache | 10 Dateien, App-Shell vollständig offline |
| Netzwerkanfragen zur Laufzeit | **keine** |
| CI | Typprüfung → Tests → Build → Deploy |

---

## Bewusst nicht umgesetzt

| Punkt | Warum |
|---|---|
| **Milchgetränke** (Flat White, Americano …) | Briefing C10: im Zielbild, aber nicht in diesem Auftrag. Fachlich vollständig vorbereitet in `kb/11`, `kb/12` und `data/drinks.json` — die Rezepturen sind da, nur der Screen fehlt. |
| **Iced-Modus** | Ebenso vorbereitet (`kb/13`, Eismengen-Formel in `types/domain.ts`), noch ohne Oberfläche. |
| **Refraktometer-Eingabe** | Engine unterstützt TDS/EY vollständig; das Eingabefeld ist hinter einem Schalter versteckt, weil die meisten Nutzer kein Messgerät haben. |
| **Waagen-Anbindung** | iOS-Safari kennt kein Web Bluetooth (Briefing C9). Der Timer ist stattdessen blindbedienbar. |
| **Rezept-Schrittsequenzen für V60/AeroPress** | Datenmodell und Rezeptvarianten stehen in `data/methods.json` (Hoffmann, 4:6, Championship). Der geführte Guss-Timer wäre der nächste sinnvolle Ausbau. |

---

## Naheliegende nächste Schritte

1. **Geführter Guss-Timer für V60** — kumulierte Zielmassen, die Daten liegen bereits vor
2. **Milchgetränke-Screen** — inklusive Rückrechnung der einzufüllenden Milchmenge
3. **Iced-Modus** — Eismenge aus der Energiebilanz
4. Nach ein paar Wochen echter Nutzung: die 🟠-Heuristiken gegen die eigenen Daten prüfen
