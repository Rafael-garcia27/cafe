# Briefing — Barista-App

**Auftraggeber:** Rafael (Hobby-Barista, Entwickler)
**Setup:** Siebträger + separate Espressomühle · V60 + Handmühle · AeroPress
**Zielgerät:** iPhone 12, PWA
**Fachliche Grundlage:** `../kb/` und `../data/` dieser Wissensbasis
**Datum:** 2026-08-18

---

# TEIL A — Was gesagt wurde

Die Originalanforderung, in Aussagen zerlegt:

| # | Aussage | Typ |
|---|---------|-----|
| A1 | „Die App soll mir helfen, **meine** perfekten Shots zu ziehen." | Zielbild |
| A2 | „Mehr sein als ein Ratgeber, der mir die perfekte Ratio vorgibt." | Abgrenzung |
| A3 | „Nicht nur ‚mahle feiner, wenn der Kaffee zu schnell fließt'." | Abgrenzung |
| A4 | Loggen: Kaffee, Brühverfahren, Dial-in (Dose, Time, Yield). | Funktion |
| A5 | Output analysieren — **immer unter Berücksichtigung des Kaffeeprofils**. | Funktion |
| A6 | „Regal": Bohne, Röstdatum, Herkunft, Farm, Profil, empfohlene Zubereitung. | Funktion |
| A7 | Regal **plus** Logbuch fließen in die Analyse, **erst danach** kommt die Empfehlung. | Ablauf |
| A8 | Empfehlung sagt, **welche Parameter wie stark** zu ändern sind. | Funktion |
| A9 | Geschmacksfeedback („balanciert, sauer, wenig süß") wird im Kontext von Profil, Zubereitung und Ratio ausgewertet — **erst dann** Empfehlung. | Ablauf |
| A10 | Die App merkt sich alles **pro Bohne** und lernt, **wie ich brühe** und **was mir schmeckt**. | Funktion |
| A11 | Nicht überkompliziert, hohe UX/UI, schnell, reproduzierbar. | Qualität |
| A12 | Homegrind/Beanery als Inspiration, nicht nachbauen. | Rahmen |

---

# TEIL B — Was damit gemeint ist

## B1 · „**Meine** perfekten Shots" — das Possessivpronomen ist die Produktthese

Nicht „objektiv perfekt". Nicht Golden Cup. **Seine.**

Das ist keine Floskel, sondern die härteste Anforderung im ganzen Dokument.
Es bedeutet: Der SCA-Zielkorridor (Extraktion 18–22 %) ist nur der **Startwert**,
nicht das Ziel. Wenn der Auftraggeber systematisch Shots bevorzugt, die die Norm
als „überextrahiert" bewertet, muss die App **auf sein Optimum hin optimieren** —
nicht ihn zur Norm zurückerziehen.

**Konsequenz für die Architektur:** Der Zielkorridor muss eine *Variable pro
Nutzer* sein, kein Konstantenblock. Die Norm ist der Prior, die Historie
überschreibt ihn.

## B2 · A2 und A3 sind eine Kategoriekritik, keine Feature-Wünsche

Er beschreibt präzise das Versagen der gesamten Produktkategorie:

- **A2 („perfekte Ratio vorgeben")** = statische Rezeptdatenbanken. Ein Rezept
  aus dem Internet kennt weder seine Mühle noch sein Röstdatum noch seinen
  Geschmack. Es ist bestenfalls ein Startwert.
- **A3 („mahle feiner wenn zu schnell")** = kontextfreie Wenn-Dann-Regel. Sie ist
  in ~60 % der Fälle richtig und in den restlichen 40 % schädlich — nämlich immer
  dann, wenn die Ursache Kanalbildung, Frische, Wasser oder Röstung ist.

**Das Alleinstellungsmerkmal ist damit definiert:** Jede Empfehlung muss
konditioniert sein auf `(Bohne × Methode × Historie × Frische × Beobachtung)`.
Eine Regel, die diese Konditionierung nicht braucht, gehört nicht in die App.

## B3 · „**Erst danach**" / „**erst dann**" — er beschreibt eine Pipeline

Beide Formulierungen tauchen auf (A7, A9). Er will keine Nachschlagetabelle,
sondern eine **geordnete Kette von Schlussfolgerungen**. Implizit heißt das:

1. Die Engine muss **gestaffelt** sein (erst Kontext, dann Analyse, dann Rat).
2. Sie muss ihren Weg **zeigen** können. Wer eine Reihenfolge fordert, will
   nachvollziehen — nicht glauben.

**Konsequenz:** Jede Empfehlung trägt ihre Begründungskette sichtbar mit.

## B4 · „**Wie stark**" (A8) — er will Zahlen, keine Richtungen

„Etwas gröber" ist nicht umsetzbar. „3 Klicks gröber" ist es.

Das ist technisch nur lösbar, wenn die App die **Mühle** kennt (siehe C1) —
eine Anforderung, die er nicht gestellt hat, ohne die A8 aber unerfüllbar bleibt.

## B5 · A10 enthält **zwei** verschiedene Lernprobleme

Er sagt „wie ich brühe **und** was mir schmeckt". Das sind nicht zwei
Formulierungen derselben Sache:

| | **Prozessmodell** („wie ich brühe") | **Präferenzmodell** („was mir schmeckt") |
|---|---|---|
| Lernt | seine systematischen Abweichungen, seine Streuung, das Verhalten seiner Geräte | seinen Zielkorridor, seine Fehlertoleranz |
| Beispiel | „Deine Shots laufen konstant 2 s länger als berechnet" | „Du bewertest 1:2,2 durchgehend besser als 1:2,0" |
| Datenbasis | Ist-Werte, Zeiten, Beobachtungen | Bewertungen, Fehler-Tags, `wouldRepeat` |
| Wirkt auf | Vorhersagegenauigkeit | Zielwerte der Empfehlung |

Beide müssen getrennt geführt werden. Ein einziges „Lernen"-Feature erfüllt A10
nicht.

## B6 · A11 ist der zentrale Zielkonflikt des Projekts

„Nicht überkompliziert" steht gegen alles darüber. Die Auflösung:

> **Die Komplexität gehört in die Engine, nicht in die Oberfläche.**

Der Nutzer sieht: Bohne wählen → brühen → drei Tags antippen → eine Empfehlung.
Dahinter laufen Gates, Konfidenzgewichtung und Personalisierung — unsichtbar.

„Fortgeschritten" ist ein **Modus**, kein Standardzustand.

## B7 · „**Schnell**" hat zwei Bedeutungen, beide gelten

1. **Technisch** — die App startet und reagiert ohne Wartezeit.
2. **Im Ablauf** — er steht mit nassen Händen an der Maschine. Ein Brühvorgang
   darf nicht mehr als **drei Interaktionen** kosten: starten, stoppen,
   bewerten.

## B8 · „**Reproduzierbar**" schließt ein LLM zur Laufzeit aus

Der Barista-Begriff heißt: gleicher Input → gleiches Ergebnis. Übertragen auf die
App: **gleiche Datenlage → identische Empfehlung, jedes Mal.**

Damit ist eine KI-gestützte Empfehlung zur Laufzeit ausgeschlossen — sie wäre
nicht deterministisch, nicht offline verfügbar und nicht nachvollziehbar. Die
Engine ist **regelbasiert und rein funktional**. Kein API-Call, keine Latenz,
keine Kosten, kein Netz.

*(Das Fachwissen der KI steckt in `kb/` und `data/` — es ist zur Bauzeit
eingeflossen, nicht zur Laufzeit.)*

---

# TEIL C — Was nicht gesagt wurde, aber gebraucht wird

Aus Sicht der Fachrollen ergänzt. **C1–C5 sind blockierend**: Ohne sie erfüllt
die App die gestellten Anforderungen nachweislich nicht.

## C1 · Die Mühle fehlt — und ohne sie ist A8 unmöglich 🔴

Er nennt Dose, Time, Yield. Der **Mahlgrad** fehlt in der Aufzählung, ist aber
die stärkste Stellschraube überhaupt (Faktor 3 gegenüber allem anderen beim
Espresso).

Härter noch: „Wie stark verändern" ist ohne Mühlenkenntnis nicht beantwortbar.
„12 % gröber" nützt niemandem — „3 Klicks" schon. Die Umrechnung braucht die
Schrittweite der konkreten Mühle.

**Zu bauen:**
- `Grinder` als eigene Entität mit `micronPerStep`
- Referenzwerte für gängige Mühlen (1Zpresso, Comandante, Timemore, Kingrinder,
  Niche …) als Startwert
- **Selbstkalibrier-Assistent**: zwei Shots mit definiertem Abstand, daraus wird
  die tatsächliche Schrittweite berechnet. Kostet zwei Shots, spart bei jeder
  neuen Bohne zwei bis drei.

→ `kb/07-mahlgut.md §5`

## C2 · Zeit ist ein Ergebnis, keine Einstellung 🔴

Er listet „time" als Dial-in-Parameter. Physikalisch ist sie es nicht: Man stellt
den Mahlgrad ein, **daraus folgt** eine Zeit.

**UI-Konsequenz:** Zeit erscheint als Anzeige mit Zielband, **niemals als
Schieberegler**. Eine App, die Zeit einstellbar macht, lehrt ein falsches
Modell — und der Nutzer sucht dann in einem Raum, den es nicht gibt.

## C3 · „Sauer **und** bitter" ist der Fall, in dem jede Parameterempfehlung falsch ist 🔴

Sein Beispiel-Feedback lautet „balanciert, sauer, wenig süß". Der nicht genannte,
aber häufigste Problemfall ist **sauer und bitter gleichzeitig**.

Das ist kein Verkostungsfehler, sondern die Signatur **ungleichmäßiger
Extraktion**: Ein Teil des Kaffees ist überextrahiert, der andere kaum berührt.
Ursache ist Technik (Verteilung, Tampen, Gießen), nicht Parameter.

Wer hier den Mahlgrad ändert, verschlimmert es zuverlässig — und genau das
tut jede Wenn-Dann-App. **Das ist der Fall, an dem sich A3 entscheidet.**

**Zu bauen:** ein Gate, das bei diesem Muster **alle** Mahlgrad- und
Ratio-Empfehlungen sperrt und stattdessen auf Technik verweist.

## C4 · Frische ändert sich täglich, ohne dass jemand etwas tut 🔴

Er will das Röstdatum erfassen (A6), sagt aber nicht, was damit geschehen soll.
Fachlich passiert Folgendes: Kaffee gast wochenlang CO₂ aus. Mit weniger CO₂
bietet dasselbe Mahlgut weniger Widerstand — der Espresso läuft schneller und
schmeckt saurer, **ohne dass sich am Rezept etwas geändert hat**.

Ohne Korrektur wandert jedes gespeicherte Rezept mit der Zeit aus dem Fenster,
und der Nutzer sucht den Fehler bei sich.

**Zu bauen:** Beim Vorschlag eines gespeicherten Referenz-Shots die Alters­differenz
zum damaligen Zeitpunkt einrechnen (~1 Schritt feiner je 12 Tage).

> **Das ist die Funktion, die kein Konkurrenzprodukt hat.** Kein Buch, kein
> Rezept und kein Café kennt das Röstdatum *seines* letzten guten Shots.

## C5 · Die Datenhaltung ist auf iOS existenziell gefährdet 🔴

Sein gesamter Wert liegt in der Historie (A10). Safari löscht IndexedDB einer
PWA nach **7 Tagen ohne Nutzung**. Ein zweiwöchiger Urlaub kann die komplette
Lernbasis vernichten.

**Zu bauen:** automatischer Export, `navigator.storage.persist()`, sichtbare
Backup-Erinnerung. Nicht optional — ohne das ist die App bei Datenverlust
wertlos, und der Nutzer merkt es erst, wenn es zu spät ist.

## C6 · Wasser als Notausgang 🟡

Nicht genannt. Fachlich: Bei zu hoher Karbonathärte schmeckt Kaffee **flach,
obwohl alle Messwerte stimmen**. Keine Mahlgradkorrektur hilft.

Ohne diese Regel schickt die App den Nutzer in eine Endlosschleife. Sie braucht
keine Wasseranalyse-Pflicht — nur die Fähigkeit, bei diesem Muster zu sagen:
*„Das liegt nicht an deiner Einstellung. Prüf dein Wasser."*

## C7 · Die Röster-Empfehlung ist ein Hinweis, keine Wahrheit 🟡

Er will „empfohlene Zubereitung" erfassen (A6) — richtig, das steht auf der Tüte.
Fachlich einzuordnen: Diese Angaben sind oft generisch („1:2 in 25–30 s") und
kennen weder seine Mühle noch sein Wasser.

**Zu bauen:** als sichtbar gekennzeichneter Startwert mit **niedriger Gewichtung**.
Sobald zwei eigene gute Ergebnisse vorliegen, tritt sie zurück.

## C8 · Ristretto ist kein früher gestoppter Espresso 🟡

Eine Falle, in die er sicher laufen wird: Wer den Shot einfach früher stoppt,
bekommt Unterextraktion, keinen Ristretto. Ein echter Ristretto braucht einen
**gröberen** Mahlgrad.

**Zu bauen:** Beim Wechsel des Shot-Stils den Mahlgrad-Offset mit vorschlagen.

## C9 · Keine Waagen-Anbindung möglich 🟡

Web Bluetooth existiert in iOS-Safari nicht. Eine Acaia-Integration ist auf dem
Zielgerät ausgeschlossen.

**Konsequenz:** Der Brüh-Screen muss für **Blindbedienung** ausgelegt sein —
großflächige Touchziele, laufender Timer, Ablesbarkeit aus 50 cm, keine
Präzisionsgesten mit nassen Händen.

## C10 · Milchgetränke sind im Zielbild, nicht in diesem Prompt 🟢

Sein ursprüngliches Zielbild nennt Flat White und Americano. Dieser Prompt nicht
— er fokussiert auf den Shot. **Richtige Priorisierung:** Der Shot ist die Basis,
Milch ist eine Schicht darüber. Nicht streichen, aber nach hinten stellen.

---

# TEIL D — Was er bekommen kann, ohne es zu fordern

Möglichkeiten, die sich aus der Datenlage ergeben und die er nicht formuliert hat:

| Möglichkeit | Warum sie funktioniert |
|---|---|
| **„Welche Bohne heute?"** | Aus Röstdatum + Restmenge aller Tüten: welche ist gerade im optimalen Fenster, welche läuft aus |
| **Vorhersage vor dem Brühen** | „Erwartete Zeit: 28–29 s." Trifft sie ein, glaubt der Nutzer auch der Geschmacksvorhersage. Vertrauen entsteht durch überprüfbare Prognosen. |
| **„Hör auf zu drehen"** | Erkennen, wenn drei Korrekturen in dieselbe Richtung nichts gebracht haben → Ursache liegt bei Bohne, Wasser oder Röstung |
| **Sein Profil sichtbar machen** | „Du bevorzugst durchgehend 0,3 engere Ratios als der Standard." Das ist Selbsterkenntnis, die man sonst nirgends bekommt. |
| **Schwankungserkennung** | „Deine Shotzeiten streuen um 6 s. Bevor du das Rezept änderst, mach es erst wiederholbar." |
| **Übertragung zwischen Mühlen** | Rezept von der Handmühle auf die Espressomühle rechnen |
| **Kosten pro Tasse / Restmenge** | Fällt aus den vorhandenen Daten ohne Zusatzaufwand ab |

---

# TEIL E — Nicht-Ziele

Bewusst ausgeschlossen. Jedes davon würde A11 („nicht überkompliziert")
verletzen oder B8 („reproduzierbar") brechen:

- ❌ **KI/LLM zur Laufzeit** — verletzt Reproduzierbarkeit und Offline-Fähigkeit
- ❌ **Cloud-Zwang, Accounts, Login** — die App ist ein persönliches Werkzeug
- ❌ **Social, Sharing, Community-Rezepte** — er will *seine* Shots, nicht fremde
- ❌ **Gamification, Streaks, Badges** — infantilisiert ein Präzisionswerkzeug
- ❌ **Online-Bohnendatenbank** — Fremddaten ohne Bezug zu seinem Setup
- ❌ **Refraktometer als Pflicht** — die Engine muss ohne Messgerät funktionieren
- ❌ **Mehr als eine Empfehlung gleichzeitig** — zwei Änderungen machen das
  Ergebnis uninterpretierbar. Das ist keine UI-Vorliebe, sondern Methodik.

---

# TEIL F — Briefing an das Entwicklerteam

## F0 · Der Auftrag in einem Satz

> Baut ein persönliches Dial-in-Werkzeug, das aus Bohnendaten, Brühprotokoll und
> Geschmacksfeedback **eine** begründete, bezifferte Korrektur ableitet, dabei
> auf den persönlichen Geschmack des Nutzers hin lernt — und das ehrlich sagt,
> wenn das Problem gar nicht in den Parametern liegt.

## F1 · An die App- und PWA-Entwicklung

**Mandat:** Architektur, Datenschicht, Offline-Fähigkeit, Performance.

- Deterministische, **rein funktionale Engine** ohne Netzabhängigkeit (B8).
  Die Engine ist ohne UI testbar. Jede Regel hat eine ID und einen Test.
- Fachwissen kommt aus `data/*.json` — **nicht** im Code hartkodiert. Die
  Wissensbasis ist die Quelle der Wahrheit, der Code ist ihr Interpreter.
- Lokale Persistenz mit **Export/Import als Erstklassen-Funktion** (C5).
- Startzeit unter 1 s auf iPhone 12, alle Interaktionen unter 100 ms.
- Vollständig offline nutzbar. Es gibt keinen Zustand, der Netz braucht.

## F2 · An die Kaffee-Fachrollen (Hoffmann, Farmer, Wissenschaftler, Hobby-Barista)

**Mandat:** Fachliche Richtigkeit, Zielwerte, Regelwerk, Ehrlichkeit.

- Alle Zielwerte, Defaults und Regeln stammen aus `kb/` und `data/`. Keine
  erfundenen Zahlen.
- **Konfidenzstufen respektieren:** Was als „heuristisch" markiert ist, muss die
  App aus Nutzerdaten überschreiben dürfen. Was als „gesichert" markiert ist,
  bleibt eine harte Grenze (Milch über 70 °C, Extraktion über 30 %).
- Die Gates aus `kb/14` sind **nicht verhandelbar** — sie sind der Unterschied
  zwischen einem Werkzeug und einem Ratgeber (C3, C4, C6).
- Der Hobby-Barista-Blick prüft jede Funktion gegen: *„Mache ich das morgens um
  halb sieben wirklich?"* Alles, was diesen Test nicht besteht, fliegt raus.

## F3 · An die iOS-/PWA-Optimierung

**Mandat:** Das Gerät ist ein iPhone 12. Nicht „mobil", sondern **dieses Gerät**.

- Viewport 390 × 844, `safe-area-inset` für Notch und Home-Indicator
- `display: standalone`, Apple-Touch-Icons, korrekte Statusbar
- Kein `beforeinstallprompt` in iOS — Installation muss **erklärt** werden
- `100vh` ist in iOS-Safari kaputt → `dvh`/`svh`
- Kein Web Bluetooth (C9) → Brüh-Screen für Blindbedienung
- Touchziele ≥ 44 pt, Daumenzone unten, Einhandbedienung
- `navigator.storage.persist()` gegen Eviction (C5)
- Dark Mode, weil morgens in einer dunklen Küche gebrüht wird

## F4 · An die GitHub-/Delivery-Rolle

**Mandat:** Veröffentlichung, Deployment, Nachvollziehbarkeit.

- Repository unter **`Rafael-garcia27`** (privat), **niemals** unter
  `Rafael-278` / `CogniCoreitsolutions`
- Automatisches Deployment, sodass die PWA per URL aufs iPhone installierbar ist
- README mit Installationsanleitung für iOS (Teilen → Zum Home-Bildschirm)
- Saubere Commit-Historie entlang der drei Iterationen

## F5 · Umgang mit `barista-pwa`

Die bestehende PWA wird **erst nach Iteration 1** angesehen. Grund: Wer zuerst
den Altbestand liest, baut ihn nach. Der Auftraggeber hat explizit gesagt, dass
sie „bei weitem nicht ausgereift" ist — sie darf das Ergebnis nicht verankern.

Danach: ehrlicher Abgleich, das Beste aus beidem, dokumentiert.

**Das Repo wird ausschließlich lesend angefasst** — es enthält uncommittete
Arbeit des Auftraggebers.

## F6 · Zur Inspiration (Homegrind, Beanery)

Übernehmen: die Idee des Bohnenregals, schnelle Log-Erfassung, ruhige Optik.

Bewusst anders machen:
- Diese Apps sind **Protokollwerkzeuge** — sie speichern, was war.
  Diese App ist ein **Diagnosewerkzeug** — sie sagt, was als Nächstes zu tun ist.
- Keine Rezept-Bibliothek fremder Leute.
- Keine Bewertung gegen einen Standard, sondern gegen **sein** Optimum.

---

# TEIL G — Abnahmekriterien

Die App gilt als fertig, wenn sie diese Szenarien besteht:

| # | Szenario | Erwartetes Verhalten |
|---|----------|---------------------|
| G1 | Neue Bohne angelegt, noch nie gebrüht | Startpunkt aus Röstgrad, Herkunft, Aufbereitung, Höhe — mit sichtbarer Begründung |
| G2 | Shot lief 35 s statt 28 s, Fluss normal | „3 Klicks gröber, erwartete Zeit danach 28–29 s" — mit Rechenweg |
| G3 | Feedback „sauer **und** bitter" | **Keine** Mahlgradempfehlung. Stattdessen Technikhinweis. |
| G4 | Referenz-Shot ist 14 Tage alt | Startpunkt automatisch ~1 Klick feiner, mit Begründung |
| G5 | Bohne erst 3 Tage alt | Warnung, kein Einmessen empfohlen |
| G6 | 3× feiner gegangen, keine Besserung, jetzt auch bitter | Abbruch der Schleife, Verdacht auf Röstung/Wasser |
| G7 | 5 Shots mit Rating ≥ 4 für eine Bohne | Persönlicher Startpunkt ersetzt den Standard |
| G8 | Über 15 Brews hinweg systematisch engere Ratios bevorzugt | App erkennt und benennt die persönliche Tendenz |
| G9 | Flugmodus | Voll funktionsfähig |
| G10 | Ganzer Brühvorgang | ≤ 3 Interaktionen von „Start" bis „bewertet" |
| G11 | iPhone 12, Standalone | Keine abgeschnittenen Elemente, kein horizontales Scrollen, alle Ziele erreichbar |
| G12 | Datenexport | Vollständig, wiederherstellbar, ohne Cloud |

---

## Anhang: Nachweiskette Anforderung → Umsetzung

| Anforderung | Erfüllt durch | Nachweis |
|---|---|---|
| A1 „meine" | Präferenzmodell, personalisierter Zielkorridor | G7, G8 |
| A2/A3 kein Ratgeber | Gates + Konditionierung auf Kontext | G3, G5, G6 |
| A4 Loggen | `Brew` mit Ist-Werten und Beobachtungen | G2 |
| A5 Kaffeeprofil in der Analyse | Bohnen-Modifikatoren auf alle Defaults | G1 |
| A6 Regal | `Bean` + `Bag` mit Herkunft, Farm, Röstdatum | G1, G4 |
| A7 Reihenfolge | Gestaffelte Engine (Gates → Analyse → Rat) | G3, G6 |
| A8 „wie stark" | Mühlenkalibrierung + Durchflussgesetz | G2 |
| A9 Feedback im Kontext | Fehlerachse × Bohne × Ratio × Methode | G3 |
| A10 Lernen | Prozessmodell **und** Präferenzmodell getrennt | G7, G8 |
| A11 einfach/schnell | Progressive Disclosure, ≤ 3 Interaktionen | G10, G11 |
| A12 nicht nachbauen | Diagnose- statt Protokollwerkzeug | F6 |
