# 05 — Röstung, Frische, Lagerung

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Was zwischen Rohbohne und Mühle passiert — und warum dieselbe Tüte in Woche 1
und Woche 5 zwei verschiedene Kaffees sind.

---

## 1. Der Röstprozess

Rösten heißt: **Wasser austreiben, dann Zucker und Aminosäuren gezielt reagieren
lassen, bevor sie verbrennen.**

### 1.1 Phasen

| Phase | Zeitanteil | Bohnentemp | Was passiert |
| ----- | ---------- | ---------- | ------------ |
| **Drying** | ~40–50 % | bis ~150 °C | Restfeuchte 10–12 % → ~3 %. Grasig, heuartig. Endet mit „Yellowing". |
| **Maillard** | ~30–40 % | 150–190 °C | Aminosäuren + reduzierende Zucker → Melanoidine. **Hier entstehen Körper, Süße, Bräunung.** Toast-/Brotgeruch. |
| **Development** | ~15–25 % | ab First Crack | Karamellisierung, CO₂-Bildung, Aromaentfaltung |
| **First Crack** | – | ~196–205 °C | Zellwände platzen durch Wasserdampf. Hörbar. Ab hier ist Kaffee trinkbar. |
| **Second Crack** | – | ~224–230 °C | Zellstruktur bricht, Öl tritt aus. Ab hier dominiert Röstgeschmack. |

### 1.2 Development Time Ratio (DTR)

$$ \mathrm{DTR} = \frac{t_{\text{nach First Crack}}}{t_{\text{gesamt}}} $$

Typisch **18–25 %** 🟡.

- **DTR zu niedrig** (< 15 %): unterentwickelt — grasig, scharf sauer,
  Getreide, dünner Körper. Sieht hell aus, schmeckt aber nicht „hell", sondern
  **roh**. Häufigster Fehler bei Röstern, die auf hell trimmen.
- **DTR zu hoch** (> 30 %): „gebaked" — flach, papierig, ohne Säure und ohne
  Röstaroma. Entsteht, wenn zu wenig Energie zugeführt wird und die Bohne
  zu lange bei niedrigem Gradienten verweilt.

**Diagnostisch wichtig:** Unterentwickelte Röstung erzeugt Symptome, die
**exakt** wie Unterextraktion aussehen (sauer, dünn, salzig). Der Unterschied:
Bei Unterextraktion hilft feinerer Mahlgrad; bei Unterentwicklung ändert sich
nichts oder es wird nur bitter *und* bleibt sauer.

> **Regel für die App:** Wenn nach 3 Korrekturzyklen in Richtung feiner die
> Säure nicht weicht, aber Bitterkeit hinzukommt, ist die Röstung die Ursache
> — nicht die Zubereitung. Die Engine muss den Nutzer aus der Schleife holen
> und das klar benennen. Das ist die häufigste Frustrationsquelle beim Dial-in.

### 1.3 Maillard vs. Karamellisierung

| | Maillard | Karamellisierung |
| --- | --- | --- |
| Beteiligt | Aminosäuren **+** Zucker | nur Zucker |
| Ab ca. | 140–150 °C | 160–180 °C |
| Ergebnis | Melanoidine — Körper, Röstaroma, braune Farbe | Karamellaromen, Bitterkeit, Süßeverlust |

Beide laufen im Röster gleichzeitig. Melanoidine sind zugleich die wichtigsten
Antioxidantien im Kaffee und die Hauptträger des Mundgefühls.

---

## 2. Röstgrad

### 2.1 Agtron / SCA-Farbskala

Gemessen wird die Infrarot-Reflexion des Mahlguts. **Höherer Wert = heller.**

| Agtron (Ground) | Bezeichnung        | Bezug First/Second Crack     |
| --------------- | ------------------ | ---------------------------- |
| 85–95           | Extremely Light    | knapp nach First Crack       |
| 75–85           | Light / Nordic     | kurz nach FC                 |
| 65–75           | Medium-Light       | Filter-Standard              |
| 55–65           | Medium             | Espresso-Standard modern     |
| 45–55           | Medium-Dark        | vor Second Crack             |
| 35–45           | Dark               | in/nach Second Crack         |
| 25–35           | Very Dark / French | deutlich nach SC, ölig       |

> **Für die App:** Wenn `agtron` bekannt ist, hat er Vorrang vor `roastLevel`.
> Die Zuordnung der Defaults erfolgt dann über die Agtron-Zahl, nicht über die
> vom Röster gewählte Etikettenbezeichnung — diese ist nicht standardisiert
> und variiert zwischen Röstern um bis zu zwei Stufen.

### 2.2 Röstgrad → physikalische Eigenschaften

| Eigenschaft            | hell → dunkel |
| ---------------------- | ------------- |
| Masse                  | ↓ (12–20 % Röstverlust) |
| Volumen                | ↑ (50–100 %)  |
| Dichte                 | ↓↓            |
| Porosität              | ↑↑            |
| Löslichkeit            | ↑↑            |
| Säure                  | ↓↓            |
| Bitterkeit             | ↑↑            |
| Öl an der Oberfläche   | ↑ (ab Second Crack sichtbar) |
| CO₂-Gehalt direkt nach Röstung | ↑     |
| CO₂-Ausgasungsrate     | ↑↑            |
| Koffein pro Bohne      | ~ konstant    |
| **Koffein pro Gramm**  | ↑ (Masseverlust!) |

Die letzte Zeile korrigiert einen weit verbreiteten Irrtum in beide Richtungen:
Koffein ist thermisch stabil und wird beim Rösten kaum zerstört. Weil dunkle
Röstungen aber Masse verlieren, enthält **ein Gramm dunkler Röstung minimal
mehr Koffein** als ein Gramm heller. Beim volumetrischen Dosieren kehrt sich
das um, weil dunkle Bohnen weniger dicht sind. Da wir immer wiegen, gilt:
dunkel ≈ minimal mehr Koffein pro Gramm. Der Effekt ist klein (wenige Prozent)
und praktisch irrelevant.

---

## 3. Degassing / Ausgasung

Beim Rösten entsteht CO₂ — **6–12 mg pro Gramm** 🟡, bei dunklen Röstungen mehr.
Es entweicht über Tage bis Wochen (F-30).

### 3.1 Was zu viel CO₂ anrichtet

**Espresso:**
- CO₂ expandiert im Puck und verdrängt Wasser → ungleichmäßige Durchströmung
- Shot „blondet" früh, spritzt, läuft unruhig
- Extraktion messbar niedriger bei gleicher Zeit
- Crema übertrieben dick, schaumig-blasig statt haselnussbraun-fein, zerfällt schnell

**Filter:**
- Bloom bläht explosiv auf, Bett hebt sich und reißt
- Wasser läuft an trockenen Stellen vorbei
- Ergebnis: sauer und ungleichmäßig trotz korrektem Rezept

### 3.2 Ruhezeitfenster 🟡

Tage nach Röstdatum, in denen der Kaffee sein Optimum zeigt:

| Röstgrad     | Espresso | V60      | AeroPress |
| ------------ | -------- | -------- | --------- |
| hell         | 10–28 d  | 7–24 d   | 7–26 d    |
| mittel-hell  | 8–24 d   | 6–20 d   | 6–22 d    |
| mittel       | 7–21 d   | 5–18 d   | 5–20 d    |
| mittel-dunkel| 5–16 d   | 4–14 d   | 4–16 d    |
| dunkel       | 4–12 d   | 3–10 d   | 3–12 d    |

**Warum Espresso länger ruhen muss:** Der Druck im Siebträger verstärkt die
Störwirkung des CO₂ erheblich. Ein Kaffee, der im V60 an Tag 4 hervorragend
ist, kann als Espresso am selben Tag unbrauchbar sein.

Die Glockenkurven-Parametrisierung für den Frische-Score steht in kb/02, F-31.

### 3.3 Der Drift über die Tüte hinweg

Zwischen Tag 7 und Tag 25 sinkt der Bettwiderstand spürbar. Bei unverändertem
Mahlgrad läuft derselbe Shot **schneller** und wird **saurer**.

Kompensation nach F-32 🟠: **ca. 1 Mahlschritt feiner je 12 Tage**.

> Das ist eine der wertvollsten Funktionen, die die App bieten kann: Sie kennt
> das Röstdatum und kann proaktiv vorschlagen: *„Diese Bohne ist seit deinem
> letzten guten Shot 11 Tage älter — geh einen Klick feiner."*
> Diese Empfehlung gibt sonst niemand, und sie stimmt fast immer.

---

## 4. Alterung / Staling

Zwei getrennte Prozesse, oft verwechselt:

| | Ausgasung | Alterung |
| --- | --- | --- |
| Ursache | CO₂-Verlust | Oxidation + Verlust flüchtiger Aromen |
| Zeitraum | Tage | Wochen |
| Wirkung | **positiv** (macht brühbar) | **negativ** (macht fad) |
| Umkehrbar | – | nein |

### Alterungssymptome nach Zeit 🟡

| Zeit         | Ganze Bohne, dicht verschlossen         |
| ------------ | ---------------------------------------- |
| 0–3 Wochen   | optimal                                  |
| 3–6 Wochen   | Aromatik lässt nach, Süße bleibt         |
| 6–10 Wochen  | flach, „Karton", Papier                  |
| > 10 Wochen  | ranzig (oxidierte Lipide), muffig        |

**Gemahlener Kaffee:** 60–80 % der flüchtigen Aromen sind nach **15 Minuten**
weg 🟡. Die vollständige Oberfläche ist dann dem Sauerstoff ausgesetzt. Es gibt
keine sinnvolle Aufbewahrung von gemahlenem Kaffee — nur „sofort verbrauchen".

**Ausgelöste Lipide:** Dunkle, ölige Röstungen altern deutlich schneller, weil
das ausgetretene Öl direkt oxidiert. Deshalb halten helle Röstungen länger.

---

## 5. Lagerung

### 5.1 Die vier Feinde

| Feind        | Wirkung                        | Gegenmaßnahme                     |
| ------------ | ------------------------------ | --------------------------------- |
| **Sauerstoff** | Oxidation, Ranzigkeit        | dicht schließen, Ventiltüte, Vakuum |
| **Feuchtigkeit** | vorzeitige Extraktion, Schimmel | trocken lagern, nie Kühlschrank |
| **Wärme**    | beschleunigt alle Reaktionen   | kühl, aber nicht feucht           |
| **Licht**    | Photooxidation                 | undurchsichtige Verpackung        |

### 5.2 Praktische Regeln

- **Originaltüte mit Aromaventil** ist ausreichend gut — Luft raus, fest
  verschließen. Das Ventil lässt CO₂ entweichen, ohne O₂ hereinzulassen.
- **Nie in den Kühlschrank.** Kondensation an den Bohnen bei jeder Entnahme,
  plus Aufnahme von Fremdgerüchen. Das ist der schlechteste denkbare Ort.
- **Nicht in Glasgefäßen auf der Arbeitsplatte** — Licht und Temperaturwechsel.
- **Ganze Bohne kaufen, immer.**

### 5.3 Einfrieren — die eine echte Ausnahme 🟡

Einfrieren ist kein Notbehelf, sondern nachweislich die beste
Langzeitkonservierung. Bedingungen:

1. **Portionieren** in Tagesdosen (oder Einzelshots) vor dem Einfrieren
2. **Luftdicht** verpacken — Vakuum oder gut verschlossene Kleinbeutel
3. **Nicht auftauen lassen**, bevor gemahlen wird
4. **Direkt gefroren mahlen**
5. Einmal entnommene Portion **nicht wieder einfrieren**

Punkt 4 ist der interessante: Gefrorene Bohnen sind spröder und brechen
**gleichmäßiger**. Die Partikelverteilung wird enger, der Feinanteil sinkt.
Gefroren gemahlener Kaffee extrahiert dadurch messbar gleichmäßiger — das ist
kein Kompromiss gegenüber frischer Ware, sondern in mancher Hinsicht besser.

**Konsequenz für den Mahlgrad:** Gefroren gemahlen läuft ein Espresso
**langsamer** bei gleicher Einstellung (weniger Fines heißt zwar weniger
Verstopfung, aber die engere Verteilung erhöht die Packungsdichte). Praktisch:
**1–2 Schritte gröber** starten 🟠.

**App:** `Bag.storage = 'ambient' | 'frozen'` erfassen und die Frische-Uhr für
gefrorene Tüten anhalten (F-31 mit `daysOffRoast` = Tage bis zum Einfrieren).

---

## 6. Decaf

| Verfahren | Lösungsmittel | Aromaerhalt | Anmerkung |
| --------- | ------------- | ----------- | --------- |
| **Swiss Water** | Wasser + Aktivkohle | gut | chemikalienfrei, teuer, verbreitet im Specialty |
| **EA / Sugarcane** | Ethylacetat (aus Zuckerrohrfermentation) | sehr gut | v. a. Kolumbien; oft süßer als das Original |
| **CO₂** | überkritisches CO₂ | sehr gut | industriell, teuer, sehr selektiv |
| **MC / Dichlormethan** | Methylenchlorid | mittel | günstigste Variante; im Specialty verpönt |

**Zubereitungsbesonderheiten von Decaf** 🟡:
- Die Bohnenstruktur ist durch den Prozess vorgeschädigt und poröser
- → extrahiert **schneller** → **1–2 Schritte gröber** mahlen
- → **niedrigere Temperatur** (−2 °C) gegen Bitterkeit
- → röstet dunkler aus, als sie aussieht — die Farbe täuscht
- → altert schneller: Ruhefenster ~30 % kürzer ansetzen

Für die App: `isDecaf` muss die Defaults spürbar verschieben, nicht nur ein
Badge sein. Das ist in der bestehenden PWA (`DecafBadge.tsx`) bislang rein
kosmetisch.

---

## 7. Ableitungen für die Engine

```
daysOffRoast < restWindow.min   → Warnung „noch zu frisch", Score-Malus
daysOffRoast im Fenster         → Score 80–100
daysOffRoast > restWindow.max   → Hinweis „über dem Optimum", Mahlgrad feiner
daysOffRoast > 60               → Warnung „Alterung dominiert, Korrekturen greifen nicht"

roastLevel dunkel  → Temp −2..−4 °C, Ratio enger, Mahlgrad gröber
roastLevel hell    → Temp +2..+3 °C, Ratio weiter, Mahlgrad feiner
isDecaf            → Mahlgrad +1..+2 gröber, Temp −2 °C, Ruhefenster ×0,7
storage = frozen   → Frische-Uhr angehalten, Mahlgrad +1..+2 gröber
agtron vorhanden   → überschreibt roastLevel-Defaults
```
