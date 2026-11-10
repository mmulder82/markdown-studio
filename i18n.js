/*
 * Vertalingen (Nederlands / English).
 *
 * In de HTML:  data-i18n="sleutel"             -> textContent
 *              data-i18n-html="sleutel"        -> innerHTML (alleen voor eigen teksten met <br>)
 *              data-i18n-title="sleutel"       -> title-attribuut
 *              data-i18n-placeholder="sleutel" -> placeholder
 * In JS:       t('sleutel', { variabele: waarde })
 */
(function (global) {
    'use strict';

    const APP_NAME = 'Markdown Studio';

    const STRINGS = {
        nl: {
            'app.name': APP_NAME,
            'lang.switch': 'EN',
            'lang.switchTitle': 'Switch to English',
            'theme.toggle': 'Donkere modus aan/uit',

            'sidebar.new': 'Nieuw bestand',
            'sidebar.open': 'Open MD-bestand',
            'sidebar.importWord': 'Word importeren',
            'sidebar.importWordTitle': 'Zet een Word-document (.docx) om naar Markdown',
            'sidebar.includeImages': 'Afbeeldingen meenemen',
            'sidebar.includeImagesHint': 'Bewaart afbeeldingen in het .md-bestand (veel groter). "Kopiëren" voor een AI-chat laat ze altijd weg.',
            'sidebar.recent': 'Recent geopend',
            'sidebar.recentEmpty': 'Nog geen bestanden geopend',

            'toolbar.copy': 'Kopiëren',
            'toolbar.copyTitle': 'Kopieer de Markdown, bijvoorbeeld om in een AI-chat te plakken',
            'toolbar.copied': 'Gekopieerd!',
            'toolbar.viewTitle': 'Weergave wisselen (Cmd/Ctrl+E)',
            'toolbar.view.editor': 'Editor',
            'toolbar.view.preview': 'Voorbeeld',
            'toolbar.view.split': 'Naast elkaar',
            'toolbar.save': 'Opslaan',
            'toolbar.saveTitle': 'Opslaan (Cmd/Ctrl+S)',
            'toolbar.saved': 'Opgeslagen!',

            'drop.title': 'Sleep een .md- of Word-bestand hierheen',
            'drop.text': 'Word-documenten (.docx) worden omgezet naar Markdown, zodat AI ze makkelijk kan lezen.<br>Dat gebeurt in je eigen browser: het document wordt nergens naartoe gestuurd.',
            'editor.placeholder': 'Begin met typen... Gebruik Markdown-syntax voor opmaak.',
            'file.untitled': 'Naamloos.md',
            'picker.markdown': 'Markdown-bestanden',

            'alert.recentReopen': 'Vanwege de beveiliging van je browser moet je het bestand opnieuw selecteren. Gebruik "Open MD-bestand" en ga naar: {path}',
            'alert.wrongType': 'Selecteer een .md-, .markdown- of Word-bestand (.docx).',
            'alert.readError': 'Fout bij het lezen van het bestand.',

            'word.converting': '"{name}" wordt omgezet…',
            'word.converted': 'Omgezet uit Word: {chars} tekens. Kopieer of sla op als .md.',
            'word.convertedImages': 'Omgezet uit Word: {chars} tekens tekst en {images} afbeelding(en), samen {size}.',
            'word.imageLabel': 'afbeelding',
            'word.imagesHeading': 'Afbeeldingen (ingebed)',
            'word.error.libs': 'De conversiebibliotheek kon niet worden geladen. Ben je online?',
            'word.error.docFormat': 'Het oude .doc-formaat wordt niet ondersteund. Open het bestand in Word en sla het op als .docx.',
            'word.error.invalid': 'Dit bestand kon niet worden gelezen. Is het een geldig .docx-bestand zonder wachtwoord?',
            'word.error.generic': 'Omzetten mislukt.',
            'copy.withoutImages': 'Gekopieerd zonder afbeeldingen: een AI-chat kan ingebedde afbeeldingen niet lezen. Opslaan bewaart ze wel.',

            'date.justNow': 'Zojuist',
            'date.minutes': '{n} min geleden',
            'date.hours': '{n} uur geleden',
            'date.days': '{n} dagen geleden',

            'newDoc': `# Nieuw document

Welkom! Begin hier met schrijven...

## Voorbeelden

### Opmaak
- **Vetgedrukte tekst**
- *Cursieve tekst*
- ~~Doorgestreepte tekst~~

### Code
Inline code: \`const x = 5;\`

Codeblok:
\`\`\`javascript
function hallo() {
    console.log("Hallo!");
}
\`\`\`

### Links
[Klik hier](https://example.com)

### Afbeeldingen
![Alt-tekst](afbeelding-url.jpg)
`,
        },

        en: {
            'app.name': APP_NAME,
            'lang.switch': 'NL',
            'lang.switchTitle': 'Schakel naar Nederlands',
            'theme.toggle': 'Toggle dark mode',

            'sidebar.new': 'New file',
            'sidebar.open': 'Open MD file',
            'sidebar.importWord': 'Import Word',
            'sidebar.importWordTitle': 'Convert a Word document (.docx) to Markdown',
            'sidebar.includeImages': 'Include images',
            'sidebar.includeImagesHint': 'Keeps images in the .md file (much larger). "Copy" for an AI chat always leaves them out.',
            'sidebar.recent': 'Recently opened',
            'sidebar.recentEmpty': 'No files opened yet',

            'toolbar.copy': 'Copy',
            'toolbar.copyTitle': 'Copy the Markdown, for example to paste into an AI chat',
            'toolbar.copied': 'Copied!',
            'toolbar.viewTitle': 'Toggle view (Cmd/Ctrl+E)',
            'toolbar.view.editor': 'Editor',
            'toolbar.view.preview': 'Preview',
            'toolbar.view.split': 'Split',
            'toolbar.save': 'Save',
            'toolbar.saveTitle': 'Save (Cmd/Ctrl+S)',
            'toolbar.saved': 'Saved!',

            'drop.title': 'Drop a .md or Word file here',
            'drop.text': 'Word documents (.docx) are converted to Markdown, so AI can read them easily.<br>This happens in your own browser: the document is never sent anywhere.',
            'editor.placeholder': 'Start typing... Use Markdown syntax for formatting.',
            'file.untitled': 'Untitled.md',
            'picker.markdown': 'Markdown files',

            'alert.recentReopen': 'For browser security reasons you need to select the file again. Use "Open MD file" and go to: {path}',
            'alert.wrongType': 'Please select a .md, .markdown or Word (.docx) file.',
            'alert.readError': 'Error reading the file.',

            'word.converting': 'Converting "{name}"…',
            'word.converted': 'Converted from Word: {chars} characters. Copy it or save as .md.',
            'word.convertedImages': 'Converted from Word: {chars} characters of text and {images} image(s), {size} in total.',
            'word.imageLabel': 'image',
            'word.imagesHeading': 'Embedded images',
            'word.error.libs': 'The conversion library could not be loaded. Are you online?',
            'word.error.docFormat': 'The old .doc format is not supported. Open the file in Word and save it as .docx.',
            'word.error.invalid': 'This file could not be read. Is it a valid .docx file without a password?',
            'word.error.generic': 'Conversion failed.',
            'copy.withoutImages': 'Copied without images: an AI chat cannot read embedded images. Saving keeps them.',

            'date.justNow': 'Just now',
            'date.minutes': '{n} min ago',
            'date.hours': '{n} hours ago',
            'date.days': '{n} days ago',

            'newDoc': `# New document

Welcome! Start writing here...

## Examples

### Formatting
- **Bold text**
- *Italic text*
- ~~Strikethrough text~~

### Code
Inline code: \`const x = 5;\`

Code block:
\`\`\`javascript
function hello() {
    console.log("Hello!");
}
\`\`\`

### Links
[Click here](https://example.com)

### Images
![Alt text](image-url.jpg)
`,
        },
    };

    const LOCALES = { nl: 'nl-NL', en: 'en-GB' };

    function detectLanguage() {
        let saved = null;
        try { saved = localStorage.getItem('lang'); } catch (e) { /* geen opslag beschikbaar */ }
        if (saved && STRINGS[saved]) return saved;
        const langs = navigator.languages || [navigator.language || 'en'];
        return langs.some((l) => /^nl\b/i.test(l)) ? 'nl' : 'en';
    }

    let lang = detectLanguage();

    function t(key, vars) {
        let s = (STRINGS[lang] && STRINGS[lang][key]) ?? STRINGS.en[key] ?? key;
        if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
        return s;
    }

    function applyTranslations(root = document) {
        document.documentElement.lang = lang;
        root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
        root.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
        root.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
        root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    }

    function setLanguage(newLang) {
        if (!STRINGS[newLang]) return;
        lang = newLang;
        try { localStorage.setItem('lang', lang); } catch (e) { /* geen opslag beschikbaar */ }
        applyTranslations();
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }

    global.I18n = {
        t,
        applyTranslations,
        setLanguage,
        get lang() { return lang; },
        get locale() { return LOCALES[lang]; },
        languages: Object.keys(STRINGS),
    };
    global.t = t;
})(window);
