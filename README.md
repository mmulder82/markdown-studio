# Markdown Reader & Editor

Een complete Markdown reader én editor met live preview, dark mode, syntax highlighting en meer!

## Features

✨ **Modern Design** - Clean en overzichtelijk interface geoptimaliseerd voor Mac
🌓 **Dark Mode** - Schakel eenvoudig tussen licht en donker thema
✍️ **Live Editor** - Schrijf Markdown met real-time preview
👁️ **Flexibele Views** - Kies tussen split view, editor only, of preview only
💻 **Syntax Highlighting** - Mooie kleuren voor code blocks in alle populaire talen
📚 **Recent Files** - Snelle toegang tot je recent geopende bestanden
🎯 **Drag & Drop** - Sleep bestanden direct in de app
📄 **Word importeren** - Zet .docx-documenten om naar Markdown, zodat AI ze snel kan lezen
📋 **Kopiëren** - Kopieer de Markdown met één klik, bijvoorbeeld om in een AI-chat te plakken
💾 **Snel Opslaan** - Download je werk met één klik of gebruik Cmd+S

## Hoe te gebruiken

### Opstarten
1. Open `index.html` in je webbrowser
2. Begin direct met schrijven of open een bestaand bestand

### Nieuw Document Schrijven
1. Klik op "Nieuw Bestand"
2. Begin met typen in de editor (links)
3. Zie de preview in real-time (rechts)
4. Klik op "Opslaan" of druk Cmd+S om je werk te downloaden

### Bestaand Bestand Openen
1. Klik op "Open MD Bestand" of sleep een .md bestand in het venster
2. Het bestand opent direct in de editor
3. Bewerk en sla op wanneer je klaar bent

### Word-document omzetten naar Markdown
1. Klik op "Word importeren" of sleep een `.docx`-bestand in het venster
2. Het document wordt omgezet en opent in de editor (bijv. `rapport.docx` → `rapport.md`)
3. Klik op "Kopiëren" om de Markdown in een AI-chat te plakken, of op "Opslaan" om een `.md`-bestand te downloaden

**Privacy:** de omzetting gebeurt volledig in je eigen browser. Het document wordt nergens naartoe gestuurd, ook niet als de app op GitHub Pages draait. Alleen de conversiebibliotheken worden bij het eerste gebruik van een CDN (jsDelivr) geladen.

Wat er bij het omzetten gebeurt:
- Koppen, lijsten, vet/cursief, tabellen, links en voetnoten (`[^1]`) worden Markdown
- Afbeeldingen worden `*[afbeelding: alt-tekst]*`: de beschrijving blijft behouden, de afbeelding zelf niet
- De inhoudsopgave met paginanummers wordt overgeslagen (ruis voor een AI)
- Tabs worden spaties, en lege tabelkoppen, dubbele koppen en overbodige witregels worden opgeschoond

Beperkingen:
- Alleen `.docx`; sla oude `.doc`-bestanden eerst in Word op als `.docx`
- Automatische nummering van koppen (1.1, 2.3 …) komt niet mee, alleen de koptekst
- Tekstvakken en SmartArt worden niet altijd meegenomen
- Met een wachtwoord beveiligde documenten kunnen niet worden geopend

## Keyboard Shortcuts

- **Cmd+S** (of Ctrl+S) - Bestand opslaan
- **Cmd+E** (of Ctrl+E) - Wissel tussen view modes (split/editor/preview)

## View Modes

Klik op de view toggle button in de toolbar om te wisselen tussen:

1. **Split View** - Editor + Preview naast elkaar (standaard)
2. **Editor Only** - Alleen de editor voor geconcentreerd schrijven
3. **Preview Only** - Alleen de preview voor lezen

## Ondersteunde Markdown Features

### Tekst Opmaak
- **Vetgedrukt**: `**tekst**` of `__tekst__`
- *Cursief*: `*tekst*` of `_tekst_`
- ~~Doorgestreept~~: `~~tekst~~`

### Koppen
```markdown
# H1 Kop
## H2 Kop
### H3 Kop
```

### Lijsten
```markdown
- Ongeordende lijst item
- Nog een item

1. Geordende lijst
2. Item 2
```

### Code
Inline code: \`code hier\`

Code blocks:
\`\`\`javascript
function hello() {
    console.log("Hello!");
}
\`\`\`

### Links en Afbeeldingen
```markdown
[Link tekst](https://example.com)
![Alt tekst](image.jpg)
```

### Quotes
```markdown
> Dit is een quote
> Over meerdere regels
```

### Tabellen
```markdown
| Kolom 1 | Kolom 2 |
|---------|---------|
| Data 1  | Data 2  |
```

## Publiceren op GitHub Pages

De app bestaat alleen uit statische bestanden en draait dus direct op GitHub Pages:

1. Maak een (publieke) repository op GitHub en zet deze bestanden in de hoofdmap:
   `index.html`, `app.js`, `word-import.js`, `styles.css`, `README.md`, `.nojekyll`,
   `favicon.svg`, `favicon.ico` en `apple-touch-icon.png`
2. Ga in de repository naar **Settings → Pages**
3. Kies bij *Source* voor **Deploy from a branch**, branch `main`, map `/ (root)`, en klik op **Save**
4. Na een minuut staat de app op `https://<gebruikersnaam>.github.io/<repository>/`

> Zet nooit Word-documenten of andere vertrouwelijke bestanden in de repository: alles daarin is openbaar.

## Installatie Tips

### Als Standalone App op Mac

**Safari:**
1. Open `index.html` in Safari
2. Ga naar File → Add to Dock
3. Nu heb je een app icoon in je Dock!

**Chrome:**
1. Open `index.html` in Chrome
2. Klik op ⋮ (drie puntjes) → More Tools → Create Shortcut
3. Vink "Open as window" aan
4. Perfect! Nu werkt het als een echte app

## Tips & Tricks

- De app onthoudt automatisch je dark mode voorkeur
- Recent geopende bestanden blijven opgeslagen in je browser
- Gebruik Tab in de editor voor inspringen
- De editor gebruikt een monospace font voor gemakkelijk lezen
- Live preview update terwijl je typt

## Technologie

- **Marked.js** voor Markdown parsing
- **Highlight.js** voor syntax highlighting
- **Mammoth.js** en **Turndown** voor het omzetten van Word naar Markdown (worden pas geladen als je een Word-bestand importeert)
- Pure HTML/CSS/JavaScript - geen installatie nodig!

---

Veel schrijfplezier! 📝
