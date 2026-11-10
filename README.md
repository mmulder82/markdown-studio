# Markdown Studio

**Nederlands** · [English](README.en.md)

Lees en schrijf Markdown met live preview, en zet Word-documenten om naar Markdown, zodat AI ze snel kan lezen en interpreteren. Alles draait in je eigen browser: er wordt niets geüpload.

## Functies

- 📄 **Word importeren**: zet `.docx`-documenten om naar nette Markdown
- 🖼️ **Afbeeldingen meenemen** (optioneel): bewaar de afbeeldingen uit Word in het `.md`-bestand
- 📋 **Kopiëren voor AI**: kopieer de Markdown met één klik om in een AI-chat te plakken
- ✍️ **Live editor**: schrijf Markdown en zie direct het resultaat
- 👁️ **Weergaven**: naast elkaar, alleen editor of alleen voorbeeld
- 🌓 **Donkere modus** en 🇳🇱/🇬🇧 **Nederlands en Engels**
- 💻 **Syntax highlighting** voor codeblokken
- 📚 **Recent geopend** en 🎯 **slepen en neerzetten**
- 💾 **Opslaan** met één klik of met Cmd+S

## Gebruik

### Word-document omzetten naar Markdown

1. Klik op **Word importeren** of sleep een `.docx`-bestand in het venster.
2. Het document wordt omgezet en opent in de editor (`rapport.docx` → `rapport.md`).
3. Klik op **Kopiëren** om de Markdown in een AI-chat te plakken, of op **Opslaan** om een `.md`-bestand te downloaden.

Wat er bij het omzetten gebeurt:

- Koppen, lijsten, vet/cursief, tabellen, links en voetnoten (`[^1]`) worden Markdown.
- Afbeeldingen worden standaard `*[afbeelding: beschrijving]*`: de beschrijving (alt-tekst) uit Word blijft behouden.
- De inhoudsopgave met paginanummers wordt overgeslagen: die is ruis voor een AI.
- Lege tabelrijen en -kolommen, opmaaktabellen, dubbele koppen en overbodige witregels worden opgeschoond.

### Afbeeldingen meenemen

Vink **Afbeeldingen meenemen** aan om de afbeeldingen te bewaren. Ze komen dan als verwijzing in de tekst (`![beschrijving][img-1]`), en de afbeeldingsdata staat onderaan het bestand. Zo blijft de tekst leesbaar.

- Het `.md`-bestand wordt een stuk groter (een beleidsstuk van 32 KB kan bijvoorbeeld 900 KB worden).
- **Kopiëren** laat de afbeeldingen altijd weg en zet er weer `*[afbeelding: beschrijving]*` voor in de plaats: een AI-chat kan ingebedde afbeeldingen niet lezen.
- **Opslaan** bewaart ze wel.
- Afbeeldingsformaten die een browser niet kan tonen (zoals EMF uit oudere Word-documenten) worden altijd een beschrijving.

### Privacy

De omzetting gebeurt volledig in je eigen browser. Het document wordt nergens naartoe gestuurd, ook niet als de app op GitHub Pages draait. Alleen de conversiebibliotheken worden bij het eerste gebruik van een CDN (jsDelivr) geladen.

### Beperkingen

- Alleen `.docx`. Sla oude `.doc`-bestanden eerst in Word op als `.docx`.
- Automatische nummering van koppen (1.1, 2.3 …) komt niet mee, alleen de koptekst.
- Tekstvakken en SmartArt worden niet altijd meegenomen.
- Met een wachtwoord beveiligde documenten kunnen niet worden geopend.

### Schrijven en bewerken

- **Nieuw bestand**: begin met een voorbeelddocument.
- **Open MD-bestand**, of sleep een `.md`-bestand in het venster.
- **Opslaan** (Cmd/Ctrl+S) schrijft terug naar het geopende bestand als je browser dat ondersteunt (Chrome, Edge). Anders wordt het bestand gedownload.

### Sneltoetsen

| Toets | Actie |
| --- | --- |
| Cmd/Ctrl + S | Opslaan |
| Cmd/Ctrl + E | Weergave wisselen (naast elkaar → editor → voorbeeld) |

### Taal

De app kiest automatisch de taal van je browser (Nederlands of Engels). Met de knop **EN**/**NL** naast de titel wissel je zelf. Je keuze wordt onthouden, net als de donkere modus en de optie voor afbeeldingen.

## Publiceren op GitHub Pages

De app bestaat alleen uit statische bestanden en draait dus direct op GitHub Pages:

1. Zet de bestanden in de hoofdmap van een (openbare) repository.
2. Ga in de repository naar **Settings → Pages**.
3. Kies bij *Source* voor **Deploy from a branch**, branch `main`, map `/ (root)`, en klik op **Save**.
4. Na een minuut staat de app op `https://<gebruikersnaam>.github.io/<repository>/`.

> Zet nooit Word-documenten of andere vertrouwelijke bestanden in de repository: alles daarin is openbaar. De `.gitignore` houdt Office- en PDF-bestanden standaard tegen.

## Als app op je Mac

- **Safari**: open de app en kies **Archief → Voeg toe aan Dock**.
- **Chrome**: open de app, klik op ⋮ → **Opslaan en delen → Pagina installeren als app**.

## Technologie

- Pure HTML, CSS en JavaScript, zonder build-stap of installatie
- [Marked](https://marked.js.org/) voor het tonen van Markdown
- [Highlight.js](https://highlightjs.org/) voor syntax highlighting
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) en [Turndown](https://github.com/mixmark-io/turndown) voor Word → Markdown (pas geladen als je een Word-bestand importeert)

| Bestand | Inhoud |
| --- | --- |
| `index.html` | De pagina |
| `app.js` | Editor, preview, bestanden, kopiëren, opslaan |
| `word-import.js` | Word → Markdown, inclusief opschoning voor AI |
| `i18n.js` | Alle teksten in het Nederlands en Engels |
| `styles.css` | Opmaak, licht en donker |
