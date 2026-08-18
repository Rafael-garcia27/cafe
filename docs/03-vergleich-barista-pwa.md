# Vergleich: Briefing vs. bestehende `barista-pwa`

Durchgeführt **nach** Iteration 1 (Briefing F5), damit der Altbestand das
Ergebnis nicht verankert. Das alte Repo wurde ausschließlich **lesend**
analysiert — es enthält uncommittete Arbeit des Auftraggebers.

**Umfang des Altbestands:** ~3.100 Zeilen UI, 8 Engine-Module, 3 Screens.

---

## 1. Ehrliche Bilanz

Die alte PWA ist deutlich besser als „nicht ausgereift" vermuten lässt. Sie hat
drei Ideen, die im Briefing **nicht vorkamen** und die fachlich richtig sind.
Sie hat aber auch die vier Konstruktionsfehler, die das Briefing als
Kategoriekritik benannt hat (A2/A3).

---

## 2. Was übernommen wird

### 2.1 ⭐ Bohnen-Eignung je Methode (`suitability.ts`)

Ein Wert 0–100 dafür, wie gut eine Bohne zu einer Methode passt — aus
Röstgrad × Aufbereitung × Herkunft.

```
Espresso  · dunkel  · natural  → 95
Espresso  · hell    · washed   → 22
V60       · hell    · washed   → 98
```

**Warum das gut ist:** Es beantwortet eine Frage, die meine Version gar nicht
stellt — *„passt diese Bohne überhaupt zu dieser Methode?"*. Ein heller
kenianischer Washed als Espresso ist kein Anwenderfehler, sondern eine
Materialeigenschaft (kb/15 §6). Die App kann das **vorher** sagen, statt den
Nutzer in eine aussichtslose Dial-in-Schleife laufen zu lassen.

**Was ich anders mache:** Die Zahlen im Altbestand sind erfunden und wirken
präziser als sie sind (95 vs. 92). Ich leite sie aus `origins.json`
(`methodSuitability`, 1–5) plus Röstgrad und Aufbereitung ab und zeige sie als
**vier Stufen** statt als Prozentzahl — ehrlicher gegenüber der Datenlage.

### 2.2 ⭐ Ruhefenster nach Aufbereitung, nicht nur nach Röstgrad

Der Altbestand differenziert `washed / honey / natural` und liegt damit
fachlich richtig: Naturals gasen anders aus als Washed.

```
Espresso · hell · washed  → zu frisch bis Tag 7
Espresso · hell · natural → zu frisch bis Tag 3
```

Meine Iteration 1 kennt nur Röstgrad. **Wird übernommen** als additiver
Offset auf `restWindows` — Naturals starten früher, Honey dazwischen.

### 2.3 ⭐ Rückfall auf den besten Versuch, auch wenn er nicht gut war

Der Altbestand nutzt den bestbewerteten Brew **unabhängig von der Bewertung**
als Startpunkt — mit weicherem Text. Meine Version verlangt ≥ 4 Sterne und
fällt sonst auf den Standard zurück.

**Der Altbestand hat recht:** Wer fünfmal gebrüht und dreimal 3 Sterne
vergeben hat, will beim sechsten Mal nicht wieder bei null anfangen. Sein
bester Versuch ist als Ausgangspunkt allemal besser als ein generischer
Standard.

**Wird übernommen** als eigene Quelle `own-attempt` zwischen `transfer` und
`default`, mit klar unterscheidbarer Begründung.

### 2.4 Plausibilitätsprüfung der Mahlgradeinstellung

`analyzeGrinderOutOfRange()` meldet, wenn die eingetragene Einstellung für die
Methode absurd ist. Kleine Sache, verhindert stille Fehleingaben.
**Wird übernommen**, in Mikrometern statt in Klicks — damit mühlenunabhängig.

### 2.5 Anzeige der Mühlenskala

`clicksToScale(24) → "2.4"` — zeigt die Zahl so, wie sie auf dem Rädchen
steht. **Wird übernommen** als optionales Anzeigeformat pro Mühle.

### 2.6 Zähler „so oft schon gebrüht"

Motiviert zum Bewerten und macht den Lernfortschritt sichtbar.
**Wird übernommen**, gekoppelt an die Personalisierungsschwelle.

---

## 3. Was bewusst NICHT übernommen wird

| Altbestand | Warum nicht |
|---|---|
| **Englische Oberfläche** | Der Auftraggeber arbeitet auf Deutsch. |
| **Mühlenbereiche fest verdrahtet** (`espresso: 20–30 Klicks`) | Gilt nur für genau eine Mühle. Mein µm-Modell ist übertragbar und kalibrierbar (Briefing C1). |
| **Korrektur pauschal ±3 Klicks** | Geraten. Das Durchflussgesetz liefert die Zahl aus der Zeitabweichung — plus eine überprüfbare Vorhersage (Briefing B4). |
| **Keine Kanalbildungs-Sperre** | Genau der Fall aus Briefing A3/C3: Bei Kanalbildung ist die Zeit bedeutungslos, die App rät trotzdem einen Mahlgrad. |
| **Kein „sauer UND bitter"** | Der häufigste Problemfall bleibt unerkannt; jede Empfehlung verschlimmert ihn. |
| **`TasteTag` flach** | `sour` (Fehler) und `bright` (Charakter) gleichrangig macht die Diagnose unscharf (kb/16 §2). |
| **Zeit als Eingabeparameter** | Zeit ist ein Ergebnis (Briefing C2). Sie einstellbar zu machen lehrt ein falsches Modell. |
| **Kein Wasser** | Die häufigste unerkannte Fehlerursache fehlt komplett (Briefing C6). |
| **Feste V60-Zielzeit** | Muss mit der Dosis skalieren (Anti-Regel D-66). |
| **Q&A-Assistent mit Freitextsuche** | Gute Absicht, aber Doppelung zum Glossar. Erklärungen gehören an den Ort, wo der Begriff auftaucht — nicht in einen separaten Frage-Screen. |
| **944-Zeilen-Screen** | `BrewScreen.tsx` ist zu groß, um noch änderbar zu sein. |

---

## 4. Gegenüberstellung

| Fähigkeit | `barista-pwa` | Dialed nach Iter. 1 | nach Iter. 2 |
|---|:--:|:--:|:--:|
| Bohnenregal mit Röstdatum | ✅ | ✅ | ✅ |
| Frische-Fenster | ✅ | ✅ | ✅ |
| … nach Aufbereitung differenziert | ✅ | ❌ | ✅ übernommen |
| **Frische-Drift auf den Mahlgrad** | ❌ | ✅ | ✅ |
| Startpunkt aus eigener Historie | ✅ | ✅ | ✅ |
| … auch bei mittelmäßiger Bewertung | ✅ | ❌ | ✅ übernommen |
| … Transfer von ähnlicher Bohne | ❌ | ✅ | ✅ |
| **Bohnen-Eignung je Methode** | ✅ | ❌ | ✅ übernommen |
| Mahlgradempfehlung | ± Klicks pauschal | Durchflussgesetz | + Skalenanzeige |
| **Überprüfbare Zeitvorhersage** | ❌ | ✅ | ✅ |
| **Mühlen-Selbstkalibrierung** | ❌ | ✅ | ✅ |
| **Kanalbildungs-Sperre** | ❌ | ✅ | ✅ |
| **„sauer und bitter"-Erkennung** | ❌ | ✅ | ✅ |
| **Wasser-Notausgang** | ❌ | ✅ | ✅ |
| **Schleifenerkennung** | ❌ | ✅ | ✅ |
| Fehler/Charakter getrennt | ❌ | ✅ | ✅ |
| Präferenzmodell über alle Bohnen | ❌ | ✅ | ✅ |
| Datensicherung | ❌ | ✅ | ✅ |
| Glossar / Erklärtexte | Q&A-Screen | 44 Begriffe inline | ✅ |
| Sprache | Englisch | Deutsch | Deutsch |
| Tests | ❌ | 74 | 90+ |

---

## 5. Aufgaben für Iteration 2

1. `suitability.ts` — Eignungsbewertung aus `origins.json` ableiten, vierstufig
2. `restWindows` um Aufbereitungs-Offsets erweitern
3. Startpunkt-Quelle `own-attempt` ergänzen
4. Mahlgrad-Plausibilitätsprüfung in µm
5. Skalenanzeige je Mühle (`24 Klicks · Skala 2.4`)
6. Brühzähler und Fortschritt zur Personalisierung sichtbar machen
7. „Welche Bohne heute?" um die Eignung erweitern
