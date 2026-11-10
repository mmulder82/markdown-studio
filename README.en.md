# Markdown Studio

[Nederlands](README.md) · **English**

Read and write Markdown with a live preview, and convert Word documents to Markdown so AI can read and interpret them quickly. Everything runs in your own browser: nothing is uploaded.

## Features

- 📄 **Import Word**: convert `.docx` documents into clean Markdown
- 🖼️ **Include images** (optional): keep the images from Word in the `.md` file
- 📋 **Copy for AI**: copy the Markdown in one click to paste into an AI chat
- ✍️ **Live editor**: write Markdown and see the result instantly
- 👁️ **Views**: split, editor only or preview only
- 🌓 **Dark mode** and 🇳🇱/🇬🇧 **Dutch and English**
- 💻 **Syntax highlighting** for code blocks
- 📚 **Recently opened** and 🎯 **drag and drop**
- 💾 **Save** in one click or with Cmd+S

## Usage

### Convert a Word document to Markdown

1. Click **Import Word** or drop a `.docx` file into the window.
2. The document is converted and opens in the editor (`report.docx` → `report.md`).
3. Click **Copy** to paste the Markdown into an AI chat, or **Save** to download a `.md` file.

What happens during conversion:

- Headings, lists, bold/italic, tables, links and footnotes (`[^1]`) become Markdown.
- By default, images become `*[image: description]*`: the description (alt text) from Word is kept.
- The table of contents with page numbers is skipped: it is noise for an AI.
- Empty table rows and columns, layout tables, duplicate headings and extra blank lines are cleaned up.

### Include images

Tick **Include images** to keep the images. They are referenced in the text (`![description][img-1]`) and the image data is placed at the bottom of the file, so the text stays readable.

- The `.md` file becomes much larger (a 32 KB policy document can grow to 900 KB, for example).
- **Copy** always leaves the images out and puts `*[image: description]*` back in their place: an AI chat cannot read embedded images.
- **Save** keeps them.
- Image formats a browser cannot display (such as EMF from older Word documents) always become a description.

### Privacy

Conversion happens entirely in your own browser. The document is never sent anywhere, not even when the app runs on GitHub Pages. Only the conversion libraries are loaded from a CDN (jsDelivr) on first use.

### Limitations

- `.docx` only. Save old `.doc` files as `.docx` in Word first.
- Automatic heading numbering (1.1, 2.3 …) is not included, only the heading text.
- Text boxes and SmartArt are not always included.
- Password-protected documents cannot be opened.

### Writing and editing

- **New file**: start with an example document.
- **Open MD file**, or drop a `.md` file into the window.
- **Save** (Cmd/Ctrl+S) writes back to the opened file if your browser supports it (Chrome, Edge). Otherwise the file is downloaded.

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| Cmd/Ctrl + S | Save |
| Cmd/Ctrl + E | Toggle view (split → editor → preview) |

### Language

The app automatically picks your browser's language (Dutch or English). Use the **EN**/**NL** button next to the title to switch. Your choice is remembered, as are dark mode and the image option.

## Publishing on GitHub Pages

The app consists of static files only, so it runs directly on GitHub Pages:

1. Put the files in the root of a (public) repository.
2. In the repository, go to **Settings → Pages**.
3. Under *Source*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and click **Save**.
4. After a minute the app is available at `https://<username>.github.io/<repository>/`.

> Never put Word documents or other confidential files in the repository: everything in it is public. The `.gitignore` blocks Office and PDF files by default.

## As an app on your Mac

- **Safari**: open the app and choose **File → Add to Dock**.
- **Chrome**: open the app, click ⋮ → **Save and share → Install page as app**.

## Technology

- Plain HTML, CSS and JavaScript, no build step or installation
- [Marked](https://marked.js.org/) for rendering Markdown
- [Highlight.js](https://highlightjs.org/) for syntax highlighting
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) and [Turndown](https://github.com/mixmark-io/turndown) for Word → Markdown (only loaded when you import a Word file)

| File | Contents |
| --- | --- |
| `index.html` | The page |
| `app.js` | Editor, preview, files, copy, save |
| `word-import.js` | Word → Markdown, including clean-up for AI |
| `i18n.js` | All texts in Dutch and English |
| `styles.css` | Styling, light and dark |
