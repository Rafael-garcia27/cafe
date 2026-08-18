# 01 — Extraktionstheorie

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Warum Kaffee schmeckt, wie er schmeckt. Dieses Kapitel liefert die *Begründung*
für jede Formel in kb/02 und jede Regel in kb/14. Ohne dieses Kapitel ist die
Diagnose-Engine eine Sammlung von Aberglauben.

---

## 1. Was überhaupt gelöst wird

Gerösteter Kaffee ist zu **ca. 28–30 % seiner Masse wasserlöslich** 🟡.
Der Rest — im Wesentlichen Zellulose und unlösliche Polysaccharide — ist das
Gerüst der Bohne und bleibt im Filter bzw. im Puck zurück.

Daraus folgt die wichtigste Zahl der ganzen Kaffeezubereitung:

> **Die maximal mögliche Extraktionsausbeute liegt bei ~30 %.**
> Alles, was wir tun, spielt sich zwischen 14 % und 24 % ab.

Das ist kontraintuitiv: Wir werfen bei jedem Kaffee **rund 80 % der Bohne weg**,
und das ist richtig so — die letzten Prozent enthalten fast ausschließlich
Bitteres und Adstringierendes.

### 1.1 Die Löslichen, grob nach Extraktionsreihenfolge

Nicht alle Substanzen lösen sich gleich schnell. Ungefähre Reihenfolge 🟡:

| Phase | Was löst sich                                       | Sensorischer Beitrag                       |
| ----- | --------------------------------------------------- | ------------------------------------------ |
| früh  | Koffein, Chlorogensäuren, Zitronen-/Apfel-/Essigsäure | Säure, „Spritzigkeit", Salzigkeit          |
| früh  | einfache Zucker, Fruchtsäuren                        | Süße, Frucht                                |
| mitte | Maillard-Produkte, Melanoidine, Karamellisate        | Süße, Körper, Schokolade, Nuss, Malz       |
| mitte | Lipide (v. a. unter Druck emulgiert)                 | Mundgefühl, Textur, Crema                   |
| spät  | Chlorogensäure-Laktone, Phenylindane                 | Bitterkeit                                  |
| spät  | langkettige Polyphenole, Tannine                     | Adstringenz („trockener Mund"), Holz, Asche |

**Das ist der ganze Trick.** Wir wollen die frühen und mittleren Substanzen
möglichst vollständig und die späten möglichst gar nicht. Da sie sich zeitlich
überlappen, ist perfekter Kaffee immer ein Kompromiss — und der Zielkorridor
18–22 % EY ist genau die Zone, in der der Kompromiss am besten aufgeht.

### 1.2 Die zwei Fehlerbilder

| | **Unterextraktion** (< ~18 %) | **Überextraktion** (> ~22 %) |
|---|---|---|
| Säure | scharf, sauer, stechend | flach, tot |
| Süße | fehlt | verdeckt |
| Bitterkeit | gering | dominant, kratzig |
| Mundgefühl | dünn, wässrig | trocken, adstringierend |
| Abgang | kurz, abrupt | lang, aschig, bleibt hängen |
| Salzigkeit | oft spürbar | – |
| Merksatz | „Es fehlt etwas" | „Es ist zu viel drin" |

> **Die Salzigkeit ist der beste Einzelindikator für Unterextraktion.**
> Kaliumsalze lösen sich sehr früh; wenn man sie schmeckt, ohne dass Süße
> nachkommt, ist der Kaffee sicher unterextrahiert. Sauer allein ist mehrdeutig
> (kann Sortencharakter sein), salzig-sauer ist eindeutig.

### 1.3 Der dritte Fehler, den fast alle übersehen: **ungleichmäßige Extraktion**

Ein Kaffee kann bei 20 % durchschnittlicher EY liegen und trotzdem schlecht sein
— wenn die 20 % aus 30 % überextrahiertem und 70 % unterextrahiertem Material
gemittelt sind.

**Symptom: sauer UND bitter gleichzeitig.** Das ist kein Widerspruch und keine
Verwirrung des Verkosters, sondern die Signatur von Channeling (Espresso) oder
ungleichmäßiger Benetzung (Filter). Die richtige Korrektur ist dann **niemals**
Mahlgrad oder Zeit, sondern **Technik**: Verteilung, WDT, Tamping, Gießmuster.

Diese Unterscheidung muss die Diagnose-Engine zwingend abbilden — sie ist der
häufigste Grund, warum gut gemeinte Korrekturvorschläge nichts verbessern.

---

## 2. Die zwei unabhängigen Achsen: Stärke und Extraktion

Der zweitgrößte Denkfehler nach „Flat White ist eine Methode" ist,
**Stärke** mit **Extraktion** zu verwechseln.

| | **Stärke (TDS)** | **Extraktion (EY)** |
| ---------- | ------------------------------------ | ----------------------------------- |
| Frage      | Wie viel Gelöstes pro ml Getränk?    | Wie viel Prozent der Bohne gelöst?  |
| Einheit    | % (bzw. mg/L)                        | %                                   |
| Gesteuert durch | **Brew Ratio** (Kaffee:Wasser)  | Mahlgrad, Zeit, Temperatur, Turbulenz |
| Sensorisch | intensiv ↔ dünn                      | sauer ↔ bitter                      |
| Espresso   | 8–12 %                               | 18–22 %                             |
| Filter     | 1,15–1,45 %                          | 18–22 %                             |

**Ein starker Kaffee kann unterextrahiert sein** (viel Kaffee, zu grob gemahlen
→ intensiv und trotzdem sauer). **Ein dünner Kaffee kann überextrahiert sein**
(wenig Kaffee, viel zu fein → wässrig und trotzdem bitter). Wer diese beiden
Achsen nicht trennt, dreht bei „zu bitter" an der Ratio und macht es schlimmer.

### 2.1 Das Brew Control Chart

Trägt man TDS (y) gegen EY (x) auf, entsteht das Standard-Diagnosewerkzeug.
Die Brew-Ratio-Linien laufen als Strahlen durch den Ursprung
(siehe kb/02, F-08 — genau das ist die Identität `TDS = EY / Ratio_effektiv`).

```
 TDS
  ↑
1,45 ┤   zu stark      zu stark      zu stark
     │   unterextr.    IDEAL-STARK   überextr.
1,35 ┼─────────────┬═══════════════┬─────────────
     │             ║   GOLDEN CUP  ║
1,15 ┼─────────────┼═══════════════┼─────────────
     │   zu dünn   │   zu dünn     │   zu dünn
     │   unterextr.│   ausgewogen  │   überextr.
     └──────┬──────┴───────┬───────┴──────┬────→ EY
           16 %          18 %           22 %
```

Für die App: **Beide Koordinaten zusammen bestimmen die Korrektur.**
Nur EY zu kennen reicht nicht, nur TDS auch nicht.

| Quadrant           | Korrektur                                      |
| ------------------ | ---------------------------------------------- |
| zu stark + unterextr. | feiner mahlen **und** Ratio weiter (mehr Wasser) |
| zu stark + überextr.  | gröber mahlen **und** Ratio weiter              |
| zu dünn + unterextr.  | feiner mahlen **und** Ratio enger               |
| zu dünn + überextr.   | gröber mahlen **und** Ratio enger               |

Das ist die einzige Situation, in der die Kardinalregel „nur eine Variable"
gelockert wird — weil die beiden Achsen orthogonal sind und sich die Wirkungen
nicht vermischen. Die Engine darf das aber **nur** bei vorliegender
TDS-Messung tun, nie auf Basis von Geschmackstags allein.

---

## 3. Der Extraktionsvorgang physikalisch

Extraktion ist **Stofftransport** in zwei aufeinanderfolgenden Schritten:

```
   ①  Auflösen an der Oberfläche       schnell   (Sekunden)
       └── skaliert mit spezifischer Oberfläche
   ②  Diffusion aus dem Partikelinneren  langsam  (10 s … Minuten)
       └── skaliert mit Partikeldurchmesser²
```

### 3.1 Schritt ① — Oberfläche

Die spezifische Oberfläche kugelförmiger Partikel:

$$ \mathrm{SSA} = \frac{6}{\rho \cdot d} $$

Halbiert man den Partikeldurchmesser, **verdoppelt** sich die Oberfläche.
Deshalb wirkt Mahlgrad so brutal — er ist die einzige Variable, die die
Extraktion um Größenordnungen verschieben kann.

### 3.2 Schritt ② — Diffusion

Die charakteristische Diffusionszeit aus einem Partikel:

$$ \tau \approx \frac{d^2}{4 D_{\mathrm{eff}}} $$

Mit $D_{\mathrm{eff}} \approx 1\cdot10^{-10}\,\mathrm{m^2/s}$ 🟠 ergibt sich:

| Partikel-Ø | τ (Größenordnung) | Bedeutung                                  |
| ---------- | ----------------- | ------------------------------------------ |
| 100 µm     | ~25 s             | im Espresso vollständig erschöpft          |
| 300 µm     | ~220 s            | im Espresso nur oberflächlich extrahiert   |
| 700 µm     | ~1200 s           | im V60 nur oberflächlich extrahiert        |

**Die Konsequenz ist fundamental:** Ein Espresso läuft 25–30 s — in dieser Zeit
kann kein 300-µm-Partikel innen ausdiffundieren. Espresso extrahiert praktisch
**nur die Oberfläche und die Fines**. Genau deshalb sind Feinanteile im Espresso
kein Defekt, sondern ein notwendiger Bestandteil, und genau deshalb ist die
Partikelverteilung wichtiger als der Median-Mahlgrad (siehe kb/07).

### 3.3 Warum Turbulenz wirkt

Um jedes Partikel bildet sich eine gesättigte Grenzschicht. Sie bremst die
Extraktion, weil das Konzentrationsgefälle einbricht. Bewegung — Rühren,
Swirlen, hoher Aufguss, Blooming-Rühren — bricht diese Schicht auf.

**Agitation ist damit ein vollwertiger Extraktionshebel neben Mahlgrad,
Zeit und Temperatur.** In der App muss sie eine eigene Variable sein
(`pourStyle`, `stir`, `swirl`), sonst sind V60-Rezepte nicht reproduzierbar:
Zwei Leute mit identischem Rezept und identischer Mühle bekommen bis zu
**2 Prozentpunkte EY Unterschied** allein durch das Gießverhalten 🟠.

### 3.4 Temperatur

Höhere Temperatur erhöht die Löslichkeit und beschleunigt die Diffusion
(Arrhenius-Verhalten). Praktische Faustregel im Bereich 88–96 °C 🟠:

> **±1 °C ≈ ∓0,2 bis 0,3 Prozentpunkte EY**

Damit ist Temperatur ein **Feinwerkzeug**: Der gesamte nutzbare Bereich von
8 °C verschiebt die EY um etwa 2 Prozentpunkte — ungefähr so viel wie drei
Mahlgradklicks. Deshalb steht sie in der Korrekturpriorität hinter Mahlgrad
und Ratio.

Wichtig ist die Unterscheidung, die viele Setups scheitern lässt:
**Kesseltemperatur ≠ Brühtemperatur ≠ Kontakttemperatur.**
Ein kalter Keramik-V60 zieht in der ersten Minute bis zu 4 °C aus dem Wasser 🟠.
Ein kalter Siebträger-Korb ebenso. Vorheizen ist keine Zeremonie, sondern
Temperaturkontrolle.

---

## 4. Die drei Verfahren im Vergleich

### 4.1 Perkolation (V60)

Frisches Wasser strömt kontinuierlich durch das Bett und wird abgeführt.
Das Konzentrationsgefälle bleibt dauerhaft hoch → **effizienteste Extraktion
pro Zeiteinheit**.

Charakteristik:
- Zeit wirkt stark und annähernd linear
- Bett-Geometrie zählt (Kegel → tiefes Zentrum, flacher Rand)
- **Drawdown-Zeit** ist die aussagekräftigste Beobachtungsgröße
- Verstopfung durch Fines („Stalling") ist der häufigste Ausfall

### 4.2 Immersion (AeroPress, French Press, Cold Brew)

Kaffee liegt im stehenden Wasser. Die Konzentration steigt, das Gefälle sinkt,
die Extraktion läuft **asymptotisch** aus.

Charakteristik:
- Nach ~2 min passiert relativ wenig zusätzlich
- Sehr **fehlerverzeihend**: Zeit ist schwächer gewichtet als beim V60
- Kein Channeling möglich → das Bett kann gar nicht ungleichmäßig durchströmt werden
- Die Ratio limitiert die maximale Extraktion mit: Bei sehr engen Ratios
  (1:8) wird die Lösung so gesättigt, dass EY prinzipiell nicht mehr steigt

**Für die App wichtig:** Die Zeit-Sensitivität von Immersion ist rund
**halb so groß** wie die von Perkolation. Eine Diagnose-Engine, die für alle
drei Methoden dieselben Zeit-Korrekturen vorschlägt, ist bei der AeroPress
systematisch zu aggressiv.

### 4.3 Druckextraktion (Espresso)

Perkolation mit 6–9 bar durch ein dicht gepacktes Bett.

Charakteristik:
- Der **Durchflusswiderstand** wird zur eigentlichen Steuergröße
- Mahlgrad wirkt hier **ca. 3× stärker** als bei Filtermethoden 🟠, weil er
  gleichzeitig Oberfläche *und* Durchflusswiderstand *und* Kontaktzeit ändert —
  drei Effekte, die alle in dieselbe Richtung zeigen
- Emulgierte Lipide und suspendierte Feststoffe → Crema, Körper, Textur
- **Channeling** ist der dominante Ausfall: Wasser sucht sich den Weg des
  geringsten Widerstands und lässt Teile des Betts fast unberührt

Der Druck-Zusammenhang folgt dem Darcy-Gesetz (kb/02, F-20). Praktisch heißt
das: Flussrate skaliert mit dem **Quadrat** des Partikeldurchmessers. Daraus
folgt die vermutlich nützlichste Formel der ganzen Sammlung — die
Mahlgradkorrektur aus der Zeitabweichung (kb/02, F-22).

---

## 5. Was Wasser tut

Reines destilliertes Wasser extrahiert **schlechter** als mineralisiertes.

- **Mg²⁺ und Ca²⁺** binden aktiv Geschmacksmoleküle und ziehen sie aus dem
  Kaffee. Magnesium ist dabei effektiver und bevorzugt fruchtig-süße
  Verbindungen; Calcium extrahiert etwas kräftiger, aber weniger selektiv.
  → **Gesamthärte (GH) ist der Extraktionsmotor.**
- **Bikarbonat (HCO₃⁻, „Karbonathärte" KH)** puffert Säure ab. Zu viel KH →
  der Kaffee schmeckt flach, kreidig, „tot", auch bei perfekter EY. Zu wenig →
  Säuren stehen ungebremst und wirken aggressiv.
  → **KH ist der Säureregler.**
- **Chlor** zerstört Aromatik vollständig und ist nicht kompensierbar.

**Diagnostische Konsequenz:** Wenn ein Kaffee bei objektiv guter EY (gemessen!)
flach und langweilig schmeckt, ist die Ursache mit hoher Wahrscheinlichkeit
zu hohe Karbonathärte — und **keine** Brühvariable. Die App muss diesen
Ausweg kennen, sonst schickt sie den Nutzer in eine endlose, ergebnislose
Mahlgrad-Schleife. Details: kb/06.

---

## 6. Was Frische tut

Frisch geröstet enthält Kaffee **6–12 mg CO₂ pro Gramm** 🟡, das beim Rösten
entsteht und über Tage entweicht.

- **Zu frisch** (< 3–5 Tage): CO₂ drängt das Wasser aus dem Bett. Espresso
  spritzt, blondet vorzeitig, schmeckt scharf und dünn; V60 bloomt explosiv und
  ungleichmäßig. Die Extraktion sinkt messbar.
- **Im Fenster** (siehe kb/05): CO₂ trägt zur Crema bei, ohne die Extraktion zu
  stören.
- **Zu alt** (> 4–8 Wochen): Aromastoffe sind verflogen, Lipide oxidiert
  (ranzig, pappig, „Karton"). **Nicht durch Brühparameter reparierbar.**

**Kritisch für die App:** Da sich diese Variable ohne Nutzeraktion täglich
ändert, muss die Empfehlungs-Engine sie aktiv einrechnen. Ein Rezept, das an
Tag 6 perfekt war, ist an Tag 20 zu grob eingestellt — die Bohne ist entgast,
das Bett bietet weniger Widerstand, der Shot läuft schneller.

Gemahlener Kaffee verliert **60–80 % seiner flüchtigen Aromen in den ersten
15 Minuten** 🟡. Deshalb: immer frisch mahlen, ohne Ausnahme.

---

## 7. Zusammenfassung als Wirkungsmatrix

Wirkung auf **EY** bei Erhöhung der jeweiligen Variablen:

| Variable            | Espresso | V60  | AeroPress | Priorität |
| ------------------- | :------: | :--: | :-------: | :-------: |
| Mahlgrad **gröber** |  ↓↓↓     | ↓↓   |   ↓       |     1     |
| Kontaktzeit ↑       |  ↑↑      | ↑↑   |   ↑       |     2     |
| Wassertemperatur ↑  |  ↑       | ↑    |   ↑       |     3     |
| Ratio weiter (mehr Wasser) | ↑ | ↑   |   ↑       |     2     |
| Agitation ↑         |  –       | ↑↑   |   ↑↑      |     4     |
| Dosis ↑ (Ratio fix) |  ~       | ~    |   ~       |     –     |
| GH des Wassers ↑    |  ↑       | ↑    |   ↑       |     5     |
| Tage nach Röstung ↑ |  ↑       | ↑    |   ↑       |     –     |
| Druck ↑             |  ~/↓     | –    |    –      |     4     |

Legende: ↑↑↑ sehr stark · ↑↑ stark · ↑ moderat · ~ marginal · – ohne Wirkung

Zwei Einträge sind erklärungsbedürftig:

- **Dosis bei fixer Ratio** verändert die EY kaum, aber sie verändert die
  Bett-Geometrie (Höhe, Headspace) und damit indirekt Widerstand und
  Kanalisierungsneigung. Deshalb „marginal", nicht „ohne Wirkung".
- **Druck ↑ beim Espresso** erhöht die EY *nicht* zuverlässig. Über ~9 bar
  steigt die Kanalisierungsneigung und verdichtet das Bett — die Extraktion
  kann sogar *fallen*. Das ist der Grund, warum moderne Profile eher mit
  6–7 bar arbeiten als mit 9.

---

## 8. Merksätze für die App-Texte

1. Mahlgrad steuert **wie viel**. Ratio steuert **wie stark**. Nicht vertauschen.
2. Sauer + salzig = zu wenig. Bitter + trocken = zu viel. Sauer + bitter
   gleichzeitig = ungleichmäßig — dann hilft nur Technik.
3. Ändere pro Durchgang **eine** Variable. Sonst weißt du nachher nichts.
4. Wiege alles. Volumen lügt, Masse nicht.
5. Wenn objektiv alles stimmt und es trotzdem langweilig schmeckt: Wasser prüfen.
6. Wenn nichts hilft: Röstdatum prüfen.
