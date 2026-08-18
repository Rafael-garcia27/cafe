# 06 — Wasser

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Espresso besteht zu ~90 %, Filterkaffee zu ~98,6 % aus Wasser. Es ist der
mengenmäßig größte Bestandteil und die am häufigsten ignorierte Variable.

> **Wenn ein objektiv korrekt extrahierter Kaffee trotzdem langweilig,
> flach oder kreidig schmeckt, ist fast immer das Wasser die Ursache.**
> Diese Diagnose muss die App kennen — sonst schickt sie den Nutzer in eine
> endlose Mahlgrad-Schleife, die per Konstruktion nichts verbessern kann.

---

## 1. Die drei Wirkmechanismen

### 1.1 Gesamthärte (GH) — der Extraktionsmotor

**Ca²⁺ und Mg²⁺** binden Geschmacksmoleküle aktiv und ziehen sie aus dem
Kaffee. Destilliertes Wasser extrahiert deutlich schlechter — es fehlt der
Bindungspartner.

| Ion  | Wirkung                                                        |
| ---- | -------------------------------------------------------------- |
| Mg²⁺ | effektiver Extraktor; bevorzugt fruchtig-süße Verbindungen; ergibt hellere, lebendigere Tassen |
| Ca²⁺ | kräftigere Gesamtextraktion, weniger selektiv; mehr Körper und Schwere; **verursacht Kalkstein** |

**Zu wenig GH** (< 30 mg/L) → dünn, leer, „gewaschen", trotz korrektem Rezept.
**Zu viel GH** (> 150 mg/L) → schwer, kreidig, mineralisch, Überextraktions-artig.

### 1.2 Karbonathärte (KH / Alkalinität) — der Säureregler

**HCO₃⁻** neutralisiert die Kaffeesäuren im Moment des Brühens.

| KH-Bereich | Wirkung |
| ---------- | ------- |
| < 20 mg/L  | Säure ungebremst — spitz, aggressiv, „scharf"; kann bei hellen Röstungen erwünscht sein |
| 20–60 mg/L | ✅ ausgewogen |
| > 80 mg/L  | Säure abgepuffert — **flach, kreidig, tot**; auch bei perfekter EY |

> **Das ist die wichtigste Zeile dieses Kapitels:** Hohe Karbonathärte
> verändert den *Geschmack*, ohne die *Extraktion* zu verändern. Refraktometer
> und Stoppuhr sagen „alles richtig", die Tasse sagt „langweilig". Wer darauf
> mit Mahlgradkorrekturen reagiert, verschlechtert einen objektiv korrekten
> Kaffee. Die Diagnose-Engine muss diesen Ausweg explizit anbieten.

KH ist außerdem der Verursacher von **Kalkstein** in der Maschine — nicht GH.
Deshalb ist reines Enthärten (Ionentausch Ca→Na) für Espressomaschinen der
falsche Ansatz: Es entfernt GH, lässt die Alkalinität aber weitgehend stehen.

### 1.3 Chlor und Chloramin — der Aromakiller

**Zielwert: 0 mg/L.** Nicht kompensierbar, nicht wegzubrühen. Freies Chlor
verflüchtigt sich beim Abstehen; **Chloramin nicht** — dafür braucht es
Aktivkohle.

---

## 2. Zielwerte

### 2.1 SCA Water Standard 🟢

| Parameter        | Ziel   | Akzeptabel |
| ---------------- | ------ | ---------- |
| Geruch           | neutral| neutral    |
| Farbe            | klar   | klar       |
| Gesamtchlor      | 0 mg/L | 0 mg/L     |
| TDS              | 150 mg/L | 75–250 mg/L |
| Calciumhärte     | 68 mg/L CaCO₃ | 17–85 mg/L |
| Gesamtalkalinität| 40 mg/L CaCO₃ | ~40 mg/L |
| pH               | 7,0    | 6,5–7,5    |
| Natrium          | 10 mg/L| ~10 mg/L   |

### 2.2 Praxisorientierte Zielprofile 🟡

Die SCA-Norm ist ein Kompromiss. In der Praxis lohnt sich eine Differenzierung:

| Profil | GH | KH | Zweck |
| ------ | -- | -- | ----- |
| **Filter / hell** | 60–80 | 20–30 | maximale Klarheit und Säurestruktur; für V60 mit hellen Äthiopiern/Kenianern |
| **Universal** | 60–70 | 35–45 | SCA-nah, funktioniert für alles |
| **Espresso** | 50–70 | 40–50 | etwas mehr Puffer gegen die hohe Konzentration; Maschinenschutz |
| **Maschinenschonend** | 40–60 | 40–50 | bewusst niedrigere GH, um Kalkbildung zu bremsen |

**Der Zielkonflikt bei Espressomaschinen:** Geschmacklich optimal wäre sehr
niedrige Alkalinität. Aber Wasser mit KH < 30 mg/L ist **korrosiv** gegenüber
Kupfer und Messing im Boiler. Für Maschinen mit Metallboiler deshalb
**KH ≥ 40 mg/L** einhalten, auch wenn die Tasse mit 25 mg/L besser schmecken
würde. Bei Handfiltern gibt es diese Einschränkung nicht.

---

## 3. Umrechnungen 🟢

| Von              | Nach mg/L CaCO₃ (ppm) | Faktor |
| ---------------- | --------------------- | ------ |
| 1 °dH (deutsche Härte) | 17,85 mg/L      | ×17,85 |
| 1 °fH (französisch)| 10,0 mg/L           | ×10,0  |
| 1 gpg (grains/gal, US) | 17,1 mg/L       | ×17,1  |
| 1 mmol/L Härte   | 100,09 mg/L           | ×100,09|
| 1 mmol/L HCO₃⁻   | 50,04 mg/L (als CaCO₃)| ×50,04 |

**Beispiel:** Leitungswasser mit 14 °dH Gesamthärte
→ 14 × 17,85 = **250 mg/L CaCO₃**. Das ist rund das **3,7-fache** des
SCA-Zielwerts. Solches Wasser ist nicht „etwas hart", sondern für guten Kaffee
unbrauchbar.

---

## 4. Messen

| Methode | Misst wirklich | Tauglichkeit |
| ------- | -------------- | ------------ |
| **TDS-Meter (günstig)** | elektrische Leitfähigkeit × Faktor | ⚠️ **misst KEINE Härte.** Zwei Wässer mit identischem TDS können völlig unterschiedliche GH/KH haben. Nur als Grobindikator. |
| **Tropfentest GH/KH** (Aquaristik) | GH und KH getrennt | ✅ günstig, ausreichend genau, ~5 min |
| **Teststreifen** | grob | ⚠️ ungenau, nur als Screening |
| **Wasserwerk-Analyse** | alles | ✅ kostenlos online abrufbar; Achtung: Jahresmittel, kann saisonal schwanken |
| **Labor** | alles exakt | für Ambitionierte |

**Empfehlung für die App:** GH/KH-Tropfentest als Standardweg vorschlagen.
Ein Set kostet wenige Euro und liefert genau die zwei Zahlen, die zählen.
Ein TDS-Meter allein ist für die Wasserdiagnose **nicht ausreichend** — dieser
Hinweis gehört in die UI, weil TDS-Meter als „Wassertester" vermarktet werden.

---

## 5. Wasser bauen (DIY)

Ausgangsbasis: **destilliertes Wasser oder Umkehrosmose** (GH ≈ 0, KH ≈ 0).

### 5.1 Die Chemie 🟢

Aus Molmassen exakt herleitbar — damit ist jedes Zielprofil frei berechenbar:

| Salz                  | Molmasse   | 1 g/L ergibt                    |
| --------------------- | ---------- | ------------------------------- |
| MgSO₄·7 H₂O (Bittersalz/Epsom) | 246,47 g/mol | **GH 406 mg/L** CaCO₃ |
| CaCl₂·2 H₂O           | 147,01 g/mol | **GH 681 mg/L** CaCO₃          |
| NaHCO₃ (Natron)       | 84,01 g/mol  | **KH 596 mg/L** CaCO₃          |
| KHCO₃ (Kaliumbicarbonat) | 100,12 g/mol | **KH 500 mg/L** CaCO₃       |

**Rechenweg** (am Beispiel Bittersalz):
1 g/L ÷ 246,47 g/mol = 4,057 mmol/L Mg²⁺
4,057 mmol/L × 100,09 g/mol (CaCO₃) = **406 mg/L** GH-Äquivalent.

### 5.2 Konzentrat-Rezept „Universal" (GH 68 / KH 40)

Da die Direktmengen zu klein zum Abwiegen sind, über Konzentrate arbeiten.

**Konzentrat A (Härte):**
```
16,8 g  MgSO₄·7H₂O (Bittersalz, Apotheke/Drogerie)
auf     1 L destilliertes Wasser
```

**Konzentrat B (Puffer):**
```
6,7 g   NaHCO₃ (Natron)
auf     1 L destilliertes Wasser
```

**Dosierung:** je **10 ml A + 10 ml B** auf **1 L** destilliertes Wasser.

Ergebnis: GH ≈ 68 mg/L, KH ≈ 40 mg/L, TDS ≈ 105 mg/L.

**Kontrollrechnung A:** 16,8 g/L × 10 ml/1000 ml = 0,168 g/L im Endwasser
→ 0,168 × 406 = **68,2 mg/L GH** ✅
**Kontrollrechnung B:** 6,7 × 0,010 = 0,067 g/L → 0,067 × 596 = **39,9 mg/L KH** ✅

**Natriumgehalt:** 0,067 g/L NaHCO₃ → 0,798 mmol/L → **18,3 mg/L Na⁺**.
Über dem SCA-Zielwert von 10 mg/L, aber unkritisch. Wer Natrium vermeiden will,
ersetzt Konzentrat B durch **5,6 g KHCO₃ pro Liter** (ebenfalls 10 ml/L) —
Kalium ist geschmacklich neutraler und liefert KH ≈ 40 mg/L.

### 5.3 Weitere Zielprofile

| Profil | Konz. A (ml/L) | Konz. B (ml/L) | GH | KH |
| ------ | -------------- | -------------- | -- | -- |
| Filter / hell | 11 | 6  | 75 | 24 |
| Universal     | 10 | 10 | 68 | 40 |
| Espresso      |  9 | 11 | 61 | 44 |
| Maschinenschonend | 8 | 11 | 55 | 44 |

### 5.4 Magnesium vs. Calcium

Die Rezepte oben nutzen **ausschließlich Magnesium** (kein Calcium). Das ist
Absicht:

- Mg²⁺ extrahiert selektiver und geschmacklich interessanter
- Mg-Salze bilden **deutlich weniger Kesselstein** als Ca-Salze
- Für Handfilter und Espressomaschinen gleichermaßen unproblematisch

Wer mehr Körper und Schwere will, ersetzt 20–30 % der Mg-Menge durch
CaCl₂·2H₂O (Umrechnung über die Tabelle in 5.1). Reines Calciumwasser ist
geschmacklich flacher und verkalkt schneller.

### 5.5 Fertigprodukte

| Produkt | Prinzip | Bewertung |
| ------- | ------- | --------- |
| Third Wave Water | Mineralsachets auf destilliertes Wasser | bequem, verschiedene Profile, teuer im Dauerbetrieb |
| Peak Water | Filterkaraffe, GH selektiv reduzierbar | gut, wenn Leitungswasser nur zu hart ist |
| BWT Magnesium | Ionentausch Ca → Mg | ordentlich; KH bleibt jedoch weitgehend erhalten |
| Brita Standard | Ionentausch, unspezifisch | ⚠️ nicht auf Kaffee optimiert; reduziert unkontrolliert |
| Volvic (Flasche) | GH ~30, KH ~60 | brauchbarer Notbehelf, aber KH-lastig |

---

## 6. Diagnostische Signaturen

| Symptom | Wasserursache | Prüfen |
| ------- | ------------- | ------ |
| Flach, kreidig, „tot", trotz guter EY | **KH zu hoch** | KH messen |
| Aggressiv sauer, spitz, trotz guter EY | KH zu niedrig | KH messen |
| Dünn, leer, „gewaschen" | GH zu niedrig | GH messen |
| Schwer, mineralisch, überextrahiert wirkend | GH zu hoch | GH messen |
| Chemisch, nach Schwimmbad | Chlor / Chloramin | Aktivkohlefilter |
| Metallisch, bitter | Korrosion / alte Leitung | anderes Wasser testen |
| Ergebnisse schwanken ohne Grund | Leitungswasser saisonal schwankend | auf gebautes Wasser wechseln |

**Erkennungsregel für die Engine:**

```
if (ey in [18, 22] && rating <= 2 && defects contains 'flat' && !defects.contains('sour'))
    → verdacht: KH zu hoch → Wasserprüfung vorschlagen, NICHT Mahlgrad ändern
```

---

## 7. Für die App

### Entität `Water`
Siehe kb/00 §3.4. Wichtig: `Water` muss am `Brew` hängen, nicht global sein —
sonst lassen sich Vergleiche „Leitung vs. gebautes Wasser" nicht auswerten.

### Onboarding-Flow
1. „Welches Wasser nutzt du?" → Leitung / Filter / gebaut / Flasche
2. Bei Leitung: PLZ → Hinweis auf die Online-Analyse des Wasserversorgers
3. GH/KH eintragen (optional, aber stark empfohlen)
4. Bewertung: ✅ im Zielbereich / ⚠️ zu hart / ⚠️ zu weich / ❌ Chlor
5. Bei Abweichung: Rezept aus §5.3 vorschlagen, mit Konzentrat-Rechner

### Der Konzentrat-Rechner
Eingabe: Zielprofil + Zielmenge → Ausgabe: ml Konzentrat A und B.
Rein linear, direkt aus §5.1 ableitbar — eine der wenigen Funktionen, die
außer der App niemand anbietet.

### Warnschwellen
```
gh  > 120 mg/L  → „hart, geschmacklich schwer"
gh  <  30 mg/L  → „zu weich, Kaffee wirkt dünn"
kh  >  80 mg/L  → „hohe Alkalinität — Kaffee schmeckt flach"
kh  <  30 mg/L  → „geschmacklich fein, aber bei Metallboilern korrosiv"
chlorine > 0    → „Aktivkohlefilter nötig"
gh/kh > 4       → „ungewöhnliches Verhältnis, Messung prüfen"
```
