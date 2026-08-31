# 04 — Rohkaffee: Herkunft, Varietät, Aufbereitung

> **Fachbegriffe?** Einstieg ohne Vorwissen: [START-HIER.md](START-HIER.md) ·
> Einzelne Begriffe: [GLOSSAR.md](GLOSSAR.md)

Alles, was passiert, **bevor** die Bohne den Röster erreicht — und was davon
in der App als Bohnen-Metadaten und Empfehlungslogik landet.

> Der Anteil des Baristas am fertigen Kaffee wird systematisch überschätzt.
> Die Obergrenze der Qualität wird auf der Farm festgelegt: durch Varietät,
> Höhe, Erntezeitpunkt, Pflückqualität und Aufbereitung. Wir können diese
> Obergrenze nicht überschreiten — nur verfehlen.

---

## 1. Die Kaffeekirsche

```
Exokarp (Schale)
 └ Mesokarp (Fruchtfleisch + Mucilage, zuckerreich, klebrig)
    └ Pergaminhaut (Parchment / Pergamino)
       └ Silberhäutchen (Silverskin)
          └ Samen = die Bohne  (normalerweise 2 pro Kirsche)
```

- **Peaberry (Caracolillo/PB)**: nur ein Samen entwickelt sich, wird rund.
  Kein Qualitätsmerkmal, aber gleichmäßigere Röstung durch homogene Form.
- **Mucilage** ist der Schlüssel zur Aufbereitung: Wie viel davon wann entfernt
  wird, definiert Washed / Honey / Natural.

---

## 2. Spezies und Varietäten

### 2.1 Spezies

| Spezies                   | Anteil Weltmarkt | Koffein | Charakter                          |
| ------------------------- | ---------------- | ------- | ---------------------------------- |
| *Coffea arabica*          | ~60 %            | ~1,2 %  | komplex, säurebetont, Specialty     |
| *Coffea canephora* (Robusta) | ~40 %         | ~2,2 %  | kräftig, erdig, mehr Crema, bitter |
| *Coffea liberica / eugenioides* | < 1 %     | var.    | Nische, ungewöhnliche Profile      |

Robusta ist nicht per se schlecht — Fine Robusta aus Indien oder Uganda kann
exzellent sein. In italienischen Espressoblends liefert er Crema-Stabilität
und Körper. Als *Sortenkaffee* im Specialty-Segment bleibt er selten.

### 2.2 Arabica-Varietäten (die für die App relevanten)

| Varietät          | Herkunft/Verbreitung        | Charakter                                   |
| ----------------- | --------------------------- | ------------------------------------------- |
| **Typica**        | Urform, weltweit            | klar, süß, elegant, niedriger Ertrag        |
| **Bourbon**       | Urform, weltweit            | süßer, komplexer, buttrig                   |
| **Caturra**       | Bourbon-Mutation, Kolumbien | zitrisch, hell, hoher Ertrag                |
| **Catuaí**        | Mundo Novo × Caturra, BR    | ausgewogen, robust, ertragreich             |
| **Mundo Novo**    | Typica × Bourbon, BR        | Körper, Schokolade, sehr ertragreich        |
| **SL28**          | Kenia (Scott Labs 1935)     | **Schwarze Johannisbeere**, enorme Struktur |
| **SL34**          | Kenia                       | wie SL28, etwas runder, mehr Körper         |
| **Ruiru 11 / Batian** | Kenia, krankheitsresistent | sauberer, aber flacher als SL28          |
| **Castillo**      | Kolumbien (Cenicafé)        | rostresistent, solide, weniger ausdrucksstark |
| **Geisha/Gesha**  | Äthiopien → Panama          | Jasmin, Bergamotte, Tee — Spitzenpreise     |
| **Pink Bourbon**  | Kolumbien (Huila)           | tropisch, floral, hohe Süße                 |
| **Tabi**          | Kolumbien                   | Bourbon-nah, resistent                      |
| **Äthiopische Landrassen** | Äthiopien          | tausende lokale Sorten, oft als „Heirloom" verkauft |
| **JARC 74110/74112/74158** | Äthiopien          | Auslesen, resistent, floral-zitrisch        |
| **Wolisho / Dega / Kurume** | Äthiopien (Guji/Sidama) | regionale Landrassen                   |

> **„Ethiopian Heirloom" ist kein Sortenname**, sondern eine Sammelbezeichnung
> für nicht kartierte lokale Landrassen. Für die App: als Varietät zulassen,
> aber als `landrace: true` markieren, damit keine falsche Präzision entsteht.

---

## 3. Anbaubedingungen

### 3.1 Höhe

Die wichtigste Einzelgröße nach der Varietät.

| Höhe (masl) | Reifung | Dichte     | Charakter                        |
| ----------- | ------- | ---------- | -------------------------------- |
| < 900       | schnell | niedrig    | weich, wenig Säure, erdig        |
| 900–1200    | mittel  | mittel     | Nuss, Schokolade, milde Säure    |
| 1200–1600   | langsam | hoch       | klare Säure, Frucht, Komplexität |
| 1600–2000+  | sehr langsam | sehr hoch | intensive Säure, floral, Tee  |

**Mechanismus:** Kühlere Nächte verlangsamen die Reifung → mehr Zeit für die
Einlagerung von Zuckern und Säuren → dichtere Bohne mit mehr Vorläufersubstanzen.

**Direkte App-Konsequenz:** Dichtere Bohnen sind **schwerer zu extrahieren**.
Höhe > 1800 masl → Mahlgrad-Offset **1–2 Schritte feiner** und Brühtemperatur
**+1 bis +2 °C** gegenüber dem Röstgrad-Default 🟠.

Handelsklassen: SHB/SHG (Strictly Hard/High Grown, > 1350 m), HB/HG, MHB.

### 3.2 Klima und Witterung

| Faktor           | Wirkung                                                     |
| ---------------- | ----------------------------------------------------------- |
| Niederschlag     | 1500–2500 mm/Jahr; braucht eine ausgeprägte Trockenzeit für die Blüte |
| Temperatur       | Arabica 18–22 °C Jahresmittel; > 30 °C schädigt              |
| Schatten         | verlangsamt Reifung, erhöht Süße, schützt vor Extremen       |
| Boden            | vulkanisch, gut drainiert, leicht sauer (pH 5–6)             |
| **El Niño / La Niña** | verschiebt Erntefenster um Wochen, beeinflusst Ertrag stark |
| **Frost (BR)**   | Juni/Juli-Frost in Minas Gerais → globale Preisschocks       |
| **Roya** (Kaffeerost) | Pilz; trieb die Verbreitung von Castillo/Ruiru 11        |

Für die App irrelevant im Detail — relevant als Erklärung, warum derselbe
Kaffee vom selben Produzenten im Folgejahr anders schmeckt. Deshalb gehört
`harvestYear` ins Bohnenmodell.

### 3.3 Ernte

| Methode        | Beschreibung                       | Qualität                        |
| -------------- | ---------------------------------- | ------------------------------- |
| **Selektiv**   | nur reife Kirschen, mehrere Durchgänge | höchste; Standard im Specialty |
| **Strip**      | ganzer Zweig auf einmal            | mittel; unreife Kirschen dabei  |
| **Mechanisch** | Rüttelmaschine (Brasilien)         | variabel; nur bei flachem Terrain |

Unreife Kirschen (Quaker im Röstgut) sind die häufigste Ursache für
strohig-papierige Fehlnoten, die durch **keine** Brühkorrektur behebbar sind.

---

## 4. Aufbereitung — der größte Geschmackshebel nach der Röstung

### 4.1 Washed / Gewaschen

```
Ernte → Flotation → Entpulpen → Fermentation 12–72 h → Waschen → Trocknen 7–15 d
```
Mucilage wird durch Fermentation abgebaut und weggewaschen.

- **Profil:** klar, transparent, säurebetont, terroir-treu, leichter Körper
- **Verbreitung:** Kolumbien, Kenia, Äthiopien (teilweise), Mittelamerika
- **App:** höchste Klarheit → ideal für V60. Verzeiht wenig, zeigt Fehler sofort.

### 4.2 Natural / Trocken aufbereitet

```
Ernte → Flotation → ganze Kirsche trocknen 15–30 d (Wenden!) → Schälen
```

- **Profil:** intensiv fruchtig (Beere, Tropenfrucht), schwerer Körper,
  niedrigere wahrgenommene Säure, süßer, weinig
- **Risiko:** ungleichmäßige Trocknung → Gärnoten, Essigstich, muffig
- **App:** löst sich leichter → **Mahlgrad ~1 Schritt gröber** als Washed
  gleichen Röstgrads 🟠. Bei Espresso oft geringere Ratio nötig.

### 4.3 Honey / Pulped Natural

Entpulpt, aber **ohne** Waschen getrocknet — die Mucilage bleibt dran.

| Typ         | verbleibende Mucilage | Trocknung        | Profil                     |
| ----------- | --------------------- | ---------------- | -------------------------- |
| White Honey | ~10–25 %              | volle Sonne      | fast wie Washed, etwas süßer |
| Yellow Honey| ~25–50 %              | Sonne            | süß, klar, ausgewogen      |
| Red Honey   | ~50–75 %              | teils Schatten   | Frucht + Klarheit          |
| Black Honey | ~75–100 %             | Schatten, langsam| natural-nah, sehr süß, sirupös |

Brasilien nennt dasselbe Verfahren **Pulped Natural** — dort hat es sich zuerst
etabliert und ist die Basis der meisten brasilianischen Espressokaffees.

### 4.4 Anaerob / Carbonic Maceration

- **Anaerob:** Fermentation in geschlossenen Tanks unter CO₂-Atmosphäre,
  12–120 h, oft temperaturkontrolliert.
- **Carbonic Maceration:** ganze, unversehrte Kirschen im CO₂-gefluteten Tank —
  Fermentation findet **innerhalb** der Frucht statt (aus dem Weinbau übernommen).

**Profil:** sehr intensiv, oft Zimt, Rum, Erdbeerkaugummi, tropisch, Zimtblüte.
Polarisierend — manche empfinden es als „nicht mehr nach Kaffee".

**App-Hinweis:** Diese Kaffees haben oft eine **atypisch hohe Löslichkeit** und
brauchen kürzere Kontaktzeiten oder gröberen Mahlgrad als das Röstprofil
vermuten lässt. Für den Empfehlungsalgorithmus als eigene Kategorie führen,
nicht unter „natural" subsumieren.

### 4.5 Wet Hulled / Giling Basah

Indonesische Spezialität (Sumatra, Sulawesi). Die Pergaminhaut wird bereits bei
30–35 % Restfeuchte entfernt, danach wird weitergetrocknet.

**Profil:** erdig, holzig, Kräuter, Tabak, Zeder, sehr niedrige Säure,
enormer Körper. Optisch oft dunkelgrün-blaue Bohnen.

### 4.6 Experimentell

Hefe-Inokulation (Lalcafé-Stämme), Co-Fermentation mit Fruchtzusätzen,
Thermalschock, verlängerte Fermentation. Qualitätsspanne extrem breit;
Rückverfolgbarkeit oft schwach. Für die App: `experimental` mit Freitextfeld.

---

## 5. Herkunftsprofile (Kernländer)

### 🇨🇴 Kolumbien

| | |
| --- | --- |
| **Regionen** | Huila, Nariño, Tolima, Cauca, Antioquia, Quindío, Caldas, Risaralda, Santander, Sierra Nevada |
| **Höhe** | 1200–2100 masl |
| **Varietäten** | Caturra, Castillo, Colombia, Typica, Bourbon, Tabi, Pink Bourbon, Geisha |
| **Ernte** | Haupternte Sep–Dez; Nebenernte („Mitaca"/„Traviesa") Apr–Jun. Nariño abweichend Mai–Aug |
| **Aufbereitung** | überwiegend Washed; stark wachsender Anteil experimenteller Fermentation |
| **Profil** | Karamell, Panela, roter Apfel, Zitrus, ausgewogene Säure, mittlerer Körper |
| **Besonderheit** | Zwei Ernten pro Jahr → ganzjährig frische Ware verfügbar. Kleinbäuerlich geprägt (Ø < 2 ha). |
| **Eignung** | Allrounder — funktioniert in allen Methoden. Ideale Einsteigerbohne für Dial-in. |

### 🇪🇹 Äthiopien

| | |
| --- | --- |
| **Regionen** | Yirgacheffe, Sidama, Guji, Gedeb, Kochere, Limu, Jimma, Harrar |
| **Höhe** | 1700–2300 masl |
| **Varietäten** | lokale Landrassen; JARC-Auslesen 74110/74112/74158; Wolisho, Dega, Kurume |
| **Ernte** | Okt–Jan, Export Dez–Apr |
| **Aufbereitung** | Washed und Natural etwa gleich stark |
| **Profil Washed** | Jasmin, Bergamotte, Zitrone, schwarzer Tee, sehr leichter Körper, hohe Klarheit |
| **Profil Natural** | Blaubeere, Erdbeere, Mango, sirupös, weinig |
| **Grading** | G1/G2 nach Defektzahl (nicht nach Größe) |
| **Besonderheit** | Ursprungsland des Arabica; höchste genetische Vielfalt weltweit. Häufig „Garden Coffee" von Kleinstbauern, gesammelt an Washing Stations. |
| **Eignung** | V60 hervorragend. Espresso anspruchsvoll: sehr dicht, braucht feinen Mahlgrad, hohe Temperatur, weite Ratio (1:2,5–1:3). |

### 🇰🇪 Kenia

| | |
| --- | --- |
| **Regionen** | Nyeri, Kirinyaga, Embu, Murang'a, Kiambu, Machakos, Mt. Elgon/Bungoma |
| **Höhe** | 1400–2100 masl |
| **Varietäten** | SL28, SL34, Ruiru 11, Batian, K7 |
| **Ernte** | Haupternte Okt–Dez; „Fly Crop" Jun–Aug |
| **Aufbereitung** | Washed mit **doppelter Fermentation** und anschließendem Wassersoak — weltweit die aufwendigste Standardaufbereitung |
| **Profil** | Schwarze Johannisbeere, Tomate, Grapefruit, Rhabarber; intensive Phosphor- und Apfelsäure; dichter, saftiger Körper |
| **Grading** | **AA, AB, PB, C, E, TT, T = Siebgröße, KEIN Qualitätsurteil.** AA-Bohnen sind größer, nicht zwingend besser. |
| **Besonderheit** | Auktionssystem an der Nairobi Coffee Exchange; Rückverfolgbarkeit bis zur „Factory" (Washing Station) |
| **Eignung** | V60 spektakulär. Espresso polarisierend — die Säurestruktur kann im konzentrierten Format überwältigen. |

### 🇧🇷 Brasilien

| | |
| --- | --- |
| **Regionen** | Sul de Minas, Cerrado Mineiro, Mogiana, Chapada Diamantina, Espírito Santo (überwiegend Conilon/Robusta) |
| **Höhe** | 800–1400 masl — niedrig nach Specialty-Maßstäben |
| **Varietäten** | Mundo Novo, Catuaí Amarelo/Vermelho, Bourbon Amarelo, Acaiá, Icatu, Obatã, Arara |
| **Ernte** | Mai–Sep, überwiegend mechanisch/strip |
| **Aufbereitung** | Natural und Pulped Natural dominieren (trockenes Erntewetter) |
| **Profil** | Schokolade, Erdnuss, Haselnuss, Karamell; niedrige Säure; schwerer, cremiger Körper |
| **Besonderheit** | Größter Produzent der Welt (~1/3 der globalen Ernte). Preisbestimmend für den gesamten Markt. |
| **Eignung** | **Das Espresso-Arbeitstier.** Perfekt als Blendbasis, extrem fehlerverzeihend beim Dial-in, hervorragend mit Milch. Für V60 oft zu wenig Säure/Klarheit. |

### Weitere relevante Ursprünge (Kurzprofile)

| Land | Charakter | Bemerkung |
| ---- | --------- | --------- |
| 🇷🇼 Ruanda / 🇧🇮 Burundi | floral, Zitrus, Bourbon-Süße | „Potato Defect" möglich (Antestia-Wanze) — einzelne Tassen schmecken nach roher Kartoffel; nicht vorhersagbar, nicht korrigierbar |
| 🇬🇹 Guatemala | Kakao, Gewürz, Apfel | Antigua, Huehuetenango |
| 🇨🇷 Costa Rica | klar, Honig, Zitrus | Micromill-Revolution, viele Honey-Varianten |
| 🇵🇦 Panama | Geisha-Heimat | Jasmin, Bergamotte; Auktionsrekorde |
| 🇸🇻 El Salvador | Bourbon-Süße, mild | Pacamara-Varietät |
| 🇮🇩 Indonesien | erdig, holzig, Kräuter | Wet Hulled, sehr niedrige Säure |
| 🇮🇳 Indien | würzig, Fine Robusta | Monsooned Malabar: bewusst monsungelagert |
| 🇾🇪 Jemen | wild, fermentiert, getrocknete Frucht | ältester Handelsursprung, sehr teuer |

---

## 6. Rohkaffee-Qualitätsparameter

| Parameter        | Zielwert       | Bedeutung                                    |
| ---------------- | -------------- | -------------------------------------------- |
| Restfeuchte      | 10–12 %        | < 9 % → brüchig, backt schnell; > 12,5 % → Schimmelrisiko |
| Wasseraktivität  | 0,50–0,58 aw   | Lagerstabilität                              |
| Dichte           | 280–450 g/L    | Proxy für Höhe und Härte                     |
| Siebgröße        | 14–19          | 1 Screen = 1/64 Zoll                         |
| Defektzahl       | ≤ 5 Full Defects / 350 g | Specialty-Grenze (SCA)             |
| Quaker           | 0              | unreife Bohnen, röstet nicht mit             |

**Für die App:** `densityGL` ist die praktisch nützlichste dieser Größen, weil
sie direkt mit dem nötigen Mahlgrad korreliert. Wenn der Röster sie angibt:
erfassen. Faustregel 🟠: **> 400 g/L → 1 Schritt feiner mahlen.**

---

## 7. Ableitungen für die Empfehlungs-Engine

```
Höhe > 1800 masl        → Mahlgrad −1..−2 Schritte, Temp +1..+2 °C
Dichte > 400 g/L        → Mahlgrad −1 Schritt
Aufbereitung = natural  → Mahlgrad +1 Schritt, Ratio etwas enger
Aufbereitung = anaerobic/CM → Kontaktzeit −10 %, als eigene Klasse behandeln
Aufbereitung = wet-hulled → niedrigere Temperatur, sehr fehlerverzeihend
Varietät = SL28/SL34    → hohe Säureerwartung, Nutzer vorwarnen
Varietät = Geisha       → weite Ratio, niedrige Dosis, V60 bevorzugen
Ursprung = Brasilien    → Espresso-Präferenz, milchtauglich, robust im Dial-in
Ursprung = Äthiopien washed / Kenia → V60-Präferenz
```

Diese Regeln sind additiv und werden auf die Röstgrad-Defaults aus kb/03 §6
aufgeschlagen. Maschinenlesbar in `data/origins.json`.
