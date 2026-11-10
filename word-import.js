/*
 * Word-import: zet .docx-bestanden in de browser om naar Markdown.
 *
 * Alles gebeurt lokaal in de browser; het document wordt nergens heen gestuurd.
 * Alleen de twee bibliotheken (mammoth en turndown) worden bij het eerste gebruik
 * van een CDN geladen.
 *
 * Werkt ook in Node (voor tests): require('./word-import.js').convertWithLibs(...)
 */
(function (global) {
    'use strict';

    const LIBS = [
        'https://cdn.jsdelivr.net/npm/mammoth@1.13.0/mammoth.browser.min.js',
        'https://cdn.jsdelivr.net/npm/turndown@7.2.4/dist/turndown.js',
    ];

    // Extra stijlregels voor mammoth (Engelse én Nederlandse Word-stijlnamen).
    const STYLE_MAP = [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Titel'] => h1:fresh",
        // Inhoudsopgave overslaan: paginanummers zijn ruis voor een AI.
        "p[style-name='TOC Heading'] => !",
        "p[style-name='Kop van inhoudsopgave'] => !",
    ];
    for (const name of ['toc', 'TOC', 'Inhopg']) {
        for (let i = 1; i <= 9; i++) STYLE_MAP.push(`p[style-name='${name} ${i}'] => !`);
    }

    // ------------------------------------------------------------ bibliotheken laden

    let libsPromise = null;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Kon de conversiebibliotheek niet laden. Ben je online?'));
            document.head.appendChild(s);
        });
    }

    function loadLibs() {
        if (global.mammoth && global.TurndownService) return Promise.resolve();
        if (!libsPromise) {
            libsPromise = LIBS.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve())
                .catch((err) => { libsPromise = null; throw err; });
        }
        return libsPromise;
    }

    // ------------------------------------------------------------ Word-document bijwerken

    // Een run met alleen tabs: opmaak weghalen. Een 'vette tab' verdwijnt anders,
    // waardoor woorden aan elkaar plakken ("AuteursJan" i.p.v. "Auteurs Jan").
    function plainTabs(run) {
        if (run.children.length && run.children.every((c) => c.type === 'tab')) {
            return Object.assign({}, run, {
                styleId: null, styleName: null, isBold: false, isItalic: false,
                isUnderline: false, isStrikethrough: false, verticalAlignment: 'baseline',
            });
        }
        return run;
    }

    // ------------------------------------------------------------ HTML -> Markdown

    function noteId(value) {
        const m = /^(foot|end)note-(?:ref-)?(\d+)$/.exec(value || '');
        return m ? (m[1] === 'end' ? 'e' : '') + m[2] : null;
    }

    function createTurndown(TurndownService) {
        const td = new TurndownService({
            headingStyle: 'atx',
            bulletListMarker: '-',
            emDelimiter: '*',
            strongDelimiter: '**',
            codeBlockStyle: 'fenced',
        });
        td.escape = escapeMarkdown;
        let cellService = null; // voor de inhoud van tabelcellen

        td.addRule('strikethrough', {
            filter: ['s', 'del', 'strike'],
            replacement: (content) => (content.trim() ? `~~${content}~~` : content),
        });

        // Afbeeldingen: alleen de alt-tekst bewaren.
        td.addRule('image', {
            filter: 'img',
            replacement: (content, node) => {
                const alt = (node.getAttribute('alt') || '').replace(/\s+/g, ' ').trim();
                return alt ? `*[afbeelding: ${alt}]*` : '*[afbeelding]*';
            },
        });

        // Compacte lijsten: "- item" en "1. item".
        td.addRule('listItem', {
            filter: 'li',
            replacement: (content, node, options) => {
                const parent = node.parentNode;
                let prefix = options.bulletListMarker + ' ';
                if (parent.nodeName === 'OL') {
                    const start = parent.getAttribute('start');
                    const index = Array.prototype.indexOf.call(parent.children, node);
                    prefix = (start ? Number(start) + index : index + 1) + '. ';
                }
                content = content
                    .replace(/^\n+/, '')
                    .replace(/\n+$/, '\n')
                    .replace(/\n/gm, '\n' + ' '.repeat(prefix.length));
                return prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '');
            },
        });

        // Links: voetnootverwijzingen, terugverwijzingen en interne ankers.
        td.addRule('links', {
            filter: (node) => node.nodeName === 'A',
            replacement: (content, node) => {
                const href = node.getAttribute('href') || '';
                const ref = noteId(node.getAttribute('id'));
                if (ref) return `[^${ref}]`;                       // verwijzing in de tekst
                if (/^#(foot|end)note-ref-/.test(href)) return '';   // ↑ terug naar de tekst
                if (!href || href.startsWith('#')) return content;   // bladwijzer / interne link
                if (!content.trim()) return '';
                if (content === href) return `<${href}>`;
                return `[${content}](${href})`;
            },
        });

        // Voetnoten onderaan als [^1]: tekst
        td.addRule('footnote', {
            filter: (node) => node.nodeName === 'LI' && noteId(node.getAttribute('id')) !== null,
            replacement: (content, node) => {
                const text = content.trim().replace(/\n/g, '\n    ');
                return `[^${noteId(node.getAttribute('id'))}]: ${text}\n`;
            },
        });

        // Tabellen als GFM-tabel; de eerste rij wordt de kop.
        td.addRule('table', {
            filter: 'table',
            replacement: (content, node) => {
                if (!cellService) cellService = createTurndown(TurndownService);
                const rows = [];
                const collect = (el) => {
                    for (const child of Array.from(el.childNodes)) {
                        if (child.nodeName === 'TR') rows.push(child);
                        else if (['THEAD', 'TBODY', 'TFOOT'].includes(child.nodeName)) collect(child);
                    }
                };
                collect(node);

                let grid = rows.map((tr) => {
                    const cells = [];
                    for (const cell of Array.from(tr.childNodes)) {
                        if (cell.nodeName !== 'TD' && cell.nodeName !== 'TH') continue;
                        const md = cellService.turndown(cell.innerHTML)
                            .replace(/\n{2,}/g, '<br>')
                            .replace(/\n/g, ' ')
                            .replace(/\|/g, '\\|')
                            .trim();
                        cells.push(md);
                        const span = Number(cell.getAttribute('colspan') || 1);
                        for (let i = 1; i < span; i++) cells.push('');
                    }
                    return cells;
                });
                // Lege kopregel? Dan wordt de volgende rij de kop.
                while (grid.length > 1 && grid[0].every((c) => !c)) grid.shift();
                if (!grid.length) return '';

                const cols = Math.max(...grid.map((r) => r.length));
                grid = grid.map((r) => r.concat(Array(cols - r.length).fill('')));
                const line = (r) => '| ' + r.join(' | ') + ' |';
                const out = [line(grid[0]), '|' + ' --- |'.repeat(cols), ...grid.slice(1).map(line)];
                return '\n\n' + out.join('\n') + '\n\n';
            },
        });

        return td;
    }

    function cleanMarkdown(md) {
        return md
            .replace(/[ \t]+$/gm, '')          // spaties aan regeleinden
            .replace(/(\S)[ \t]{2,}/g, '$1 ')  // dubbele spaties midden in een regel
            .replace(/\n{3,}/g, '\n\n')        // max. één lege regel
            .replace(/^(#{1,6} \d+)\\\. /gm, '$1. ') // "# 1\. Doel" -> "# 1. Doel" (in een kop onnodig)
            // Losse regel direct gevolgd door een kop met dezelfde tekst (bijv. een ondertitel-label).
            .replace(/^(?:#+ )?(.+)\n\n(#+ \1)$/gm, '$2')
            .trim() + '\n';
    }

    // Spaarzaam escapen: alleen tekens die anders echt als opmaak worden gelezen.
    // (Turndown escapet standaard ook [ ] en _ binnen woorden; dat is ruis voor een AI.)
    function escapeMarkdown(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/([*`])/g, '\\$1')
            .replace(/(^|\W)_|_(?=\W|$)/g, (m) => m.replace('_', '\\_'))
            .replace(/\[([^\]]*)\](?=\()/g, '\\[$1\\]')   // alleen [tekst](...) lijkt op een link
            .replace(/^(#{1,6} |>|[-+] |=+$|~~~)/g, '\\$1')
            .replace(/^(\d+)\. /g, '$1\\. ');
    }

    // ------------------------------------------------------------ publieke functies

    /** input: {arrayBuffer} (browser) of {buffer} (Node). */
    async function convertWithLibs(input, mammoth, TurndownService) {
        const result = await mammoth.convertToHtml(input, {
            styleMap: STYLE_MAP,
            transformDocument: mammoth.transforms.run(plainTabs),
            convertImage: mammoth.images.imgElement(() => Promise.resolve({ src: 'afbeelding' })),
        });
        const markdown = cleanMarkdown(createTurndown(TurndownService).turndown(result.value));
        return { markdown, messages: result.messages };
    }

    /** Zet een File/Blob (.docx) om naar Markdown. */
    async function convertDocx(file) {
        if (/\.doc$/i.test(file.name || '')) {
            throw new Error('Het oude .doc-formaat wordt niet ondersteund. Open het bestand in Word en sla het op als .docx.');
        }
        await loadLibs();
        const arrayBuffer = await file.arrayBuffer();
        try {
            return await convertWithLibs({ arrayBuffer }, global.mammoth, global.TurndownService);
        } catch (err) {
            console.error(err);
            throw new Error('Dit bestand kon niet worden gelezen. Is het een geldig .docx-bestand zonder wachtwoord?');
        }
    }

    const api = { convertDocx, convertWithLibs, cleanMarkdown };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else global.WordImport = api;
})(typeof window !== 'undefined' ? window : globalThis);
