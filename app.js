// State management
let currentFileHandle = null; // File System Access API handle
let currentFilePath = null;
let currentFileName = 'Untitled.md';
let currentContent = '';
let isEditMode = false;
let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');

// Check if File System Access API is supported
const supportsFileSystemAccess = 'showOpenFilePicker' in window;

// DOM elements
const dropZone = document.getElementById('drop-zone');
const content = document.getElementById('content');
const fileInput = document.getElementById('file-input');
const openFileBtn = document.getElementById('open-file');
const newFileBtn = document.getElementById('new-file');
const themeToggle = document.getElementById('theme-toggle');
const recentList = document.getElementById('recent-list');
const toolbar = document.getElementById('toolbar');
const editorContainer = document.getElementById('editor-container');
const editorPane = document.getElementById('editor-pane');
const previewPane = document.getElementById('preview-pane');
const markdownEditor = document.getElementById('markdown-editor');
const fileNameDisplay = document.getElementById('file-name');
const viewToggle = document.getElementById('view-toggle');
const viewModeText = document.getElementById('view-mode-text');
const saveFileBtn = document.getElementById('save-file');
const importWordBtn = document.getElementById('import-word');
const wordInput = document.getElementById('word-input');
const copyMarkdownBtn = document.getElementById('copy-markdown');
const toast = document.getElementById('toast');

// View modes: 'split', 'editor', 'preview'
let viewMode = 'split';

// Configure marked.js for better rendering
marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {
                console.error(err);
            }
        }
        return hljs.highlightAuto(code).value;
    }
});

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    const body = document.body;
    const sunIcon = document.querySelector('.sun');
    const moonIcon = document.querySelector('.moon');
    const lightHighlight = document.getElementById('highlight-light');
    const darkHighlight = document.getElementById('highlight-dark');

    if (theme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        lightHighlight.disabled = true;
        darkHighlight.disabled = false;
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        lightHighlight.disabled = false;
        darkHighlight.disabled = true;
    }
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// View mode management
function setViewMode(mode) {
    viewMode = mode;

    editorPane.style.display = 'none';
    previewPane.style.display = 'none';

    if (mode === 'split') {
        editorPane.style.display = 'flex';
        previewPane.style.display = 'flex';
        viewModeText.textContent = 'Editor';
    } else if (mode === 'editor') {
        editorPane.style.display = 'flex';
        editorPane.style.width = '100%';
        viewModeText.textContent = 'Preview';
    } else if (mode === 'preview') {
        previewPane.style.display = 'flex';
        previewPane.style.width = '100%';
        viewModeText.textContent = 'Split';
    }
}

viewToggle.addEventListener('click', () => {
    if (viewMode === 'split') {
        setViewMode('editor');
    } else if (viewMode === 'editor') {
        setViewMode('preview');
    } else {
        setViewMode('split');
    }
});

// Markdown rendering
function updatePreview() {
    const markdown = markdownEditor.value;
    currentContent = markdown;
    const html = marked.parse(markdown);
    content.innerHTML = html;

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

function renderMarkdown(markdown, fileName) {
    const html = marked.parse(markdown);
    content.innerHTML = html;

    // Update page title
    document.title = `${fileName} - Markdown Reader`;

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Editor management
function showEditor(markdown = '', fileName = 'Untitled.md') {
    dropZone.style.display = 'none';
    toolbar.style.display = 'flex';
    editorContainer.style.display = 'flex';

    markdownEditor.value = markdown;
    currentContent = markdown;
    currentFileName = fileName;
    fileNameDisplay.textContent = fileName;

    setViewMode('split');
    updatePreview();

    // Focus editor, met de cursor (en scrollpositie) aan het begin van het document
    markdownEditor.setSelectionRange(0, 0);
    markdownEditor.focus();
    markdownEditor.scrollTop = 0;
    previewPane.scrollTop = 0;
}

function hideEditor() {
    toolbar.style.display = 'none';
    editorContainer.style.display = 'none';
    dropZone.style.display = 'flex';
}

// File handling
function addToRecentFiles(filePath, fileName) {
    // Remove if already exists
    recentFiles = recentFiles.filter(f => f.path !== filePath);

    // Add to beginning
    recentFiles.unshift({ path: filePath, name: fileName, date: new Date().toISOString() });

    // Keep only last 10
    recentFiles = recentFiles.slice(0, 10);

    // Save to localStorage
    localStorage.setItem('recentFiles', JSON.stringify(recentFiles));

    // Update UI
    renderRecentFiles();
}

function renderRecentFiles() {
    recentList.innerHTML = '';

    if (recentFiles.length === 0) {
        recentList.innerHTML = '<li class="empty">Nog geen bestanden geopend</li>';
        return;
    }

    recentFiles.forEach(file => {
        const li = document.createElement('li');
        li.className = 'recent-file-item';

        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;

        const fileDate = document.createElement('span');
        fileDate.className = 'file-date';
        fileDate.textContent = formatDate(file.date);

        li.appendChild(fileName);
        li.appendChild(fileDate);

        li.addEventListener('click', () => {
            alert('Vanwege browser beveiliging moet je het bestand opnieuw selecteren. Gebruik "Open MD Bestand" en navigeer naar: ' + file.path);
        });

        recentList.appendChild(li);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Zojuist';
    if (diffMins < 60) return `${diffMins} min geleden`;
    if (diffHours < 24) return `${diffHours} uur geleden`;
    if (diffDays < 7) return `${diffDays} dagen geleden`;

    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
}

// Korte melding onderin beeld
let toastTimer = null;
function showToast(message, { error = false, duration = 3000 } = {}) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.toggle('error', error);
    toast.classList.add('visible');
    if (duration) {
        toastTimer = setTimeout(() => toast.classList.remove('visible'), duration);
    }
}

// Word-document (.docx) omzetten naar Markdown en openen in de editor
let isImporting = false;
async function importWordFile(file) {
    if (isImporting) return;
    isImporting = true;
    showToast(`"${file.name}" wordt omgezet…`, { duration: 0 });
    try {
        const { markdown } = await WordImport.convertDocx(file);
        const mdName = file.name.replace(/\.docx?$/i, '') + '.md';

        currentFileHandle = null; // opslaan = downloaden als nieuw .md-bestand
        showEditor(markdown, mdName);
        addToRecentFiles(file.name, mdName);
        showToast(`Omgezet uit Word: ${markdown.length.toLocaleString('nl-NL')} tekens. Kopieer of sla op als .md.`, { duration: 5000 });
    } catch (err) {
        console.error(err);
        showToast(err.message || 'Omzetten mislukt', { error: true, duration: 7000 });
    } finally {
        isImporting = false;
    }
}

function isWordFile(file) {
    return /\.docx?$/i.test(file.name);
}

function isMarkdownFile(file) {
    return /\.(md|markdown)$/i.test(file.name);
}

function handleFile(file) {
    if (isWordFile(file)) {
        importWordFile(file);
        return;
    }
    if (!isMarkdownFile(file)) {
        alert('Selecteer alsjeblieft een .md-, .markdown- of Word-bestand (.docx)');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        const markdown = e.target.result;
        showEditor(markdown, file.name);

        // Store file info
        currentFilePath = file.name;
        addToRecentFiles(file.name, file.name);
    };

    reader.onerror = () => {
        alert('Fout bij het lezen van het bestand');
    };

    reader.readAsText(file);
}

// Save functionality with File System Access API
async function saveFile() {
    // If we have a file handle and API is supported, save to the same file
    if (supportsFileSystemAccess && currentFileHandle) {
        try {
            const writable = await currentFileHandle.createWritable();
            await writable.write(currentContent);
            await writable.close();

            // Show success feedback
            showSaveSuccess();

            // Add to recent files
            addToRecentFiles(currentFileName, currentFileName);
            return;
        } catch (err) {
            // If user cancels permission or error occurs, fall through to download
            console.error('Error saving file:', err);
        }
    }

    // Fallback: download as new file
    const blob = new Blob([currentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Add to recent files
    addToRecentFiles(currentFileName, currentFileName);
}

// Show save success feedback
function showSaveSuccess() {
    const originalText = saveFileBtn.innerHTML;
    saveFileBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Opgeslagen!
    `;

    setTimeout(() => {
        saveFileBtn.innerHTML = originalText;
    }, 2000);
}

// Open file with File System Access API
async function openFileWithPicker() {
    if (!supportsFileSystemAccess) {
        // Fallback to regular file input
        fileInput.click();
        return;
    }

    try {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Markdown Files',
                    accept: {
                        'text/markdown': ['.md', '.markdown']
                    }
                }
            ],
            multiple: false
        });

        const file = await fileHandle.getFile();
        const content = await file.text();

        // Store the file handle for later saving
        currentFileHandle = fileHandle;
        currentFileName = file.name;

        showEditor(content, file.name);
        addToRecentFiles(file.name, file.name);
    } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
            console.error('Error opening file:', err);
        }
    }
}

// Event listeners
newFileBtn.addEventListener('click', () => {
    // Clear file handle for new file
    currentFileHandle = null;

    const defaultContent = `# Nieuw Document

Welkom! Begin hier met schrijven...

## Voorbeelden

### Opmaak
- **Vetgedrukte tekst**
- *Cursieve tekst*
- ~~Doorgestreepte tekst~~

### Code
Inline code: \`const x = 5;\`

Code block:
\`\`\`javascript
function hello() {
    console.log("Hallo!");
}
\`\`\`

### Links
[Klik hier](https://example.com)

### Afbeeldingen
![Alt text](image-url.jpg)
`;
    showEditor(defaultContent, 'Untitled.md');
});

openFileBtn.addEventListener('click', () => {
    openFileWithPicker();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

saveFileBtn.addEventListener('click', () => {
    saveFile();
});

importWordBtn.addEventListener('click', () => {
    wordInput.click();
});

wordInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        importWordFile(file);
    }
    wordInput.value = ''; // zelfde bestand later opnieuw kunnen kiezen
});

// Markdown kopiëren (bijv. om in een AI-chat te plakken)
copyMarkdownBtn.addEventListener('click', async () => {
    const text = markdownEditor.value;
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // Terugval voor browsers zonder Clipboard API
        markdownEditor.select();
        document.execCommand('copy');
        markdownEditor.setSelectionRange(0, 0);
    }
    const label = copyMarkdownBtn.querySelector('span');
    label.textContent = 'Gekopieerd!';
    setTimeout(() => { label.textContent = 'Kopiëren'; }, 1500);
});

// Live preview
markdownEditor.addEventListener('input', () => {
    updatePreview();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (toolbar.style.display !== 'none') {
            saveFile();
        }
    }

    // Cmd/Ctrl + E to toggle view
    if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        if (toolbar.style.display !== 'none') {
            viewToggle.click();
        }
    }
});

// Drag and drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation(); // anders verwerkt de document-handler hieronder het bestand nog een keer
    dropZone.classList.remove('drag-over');

    const file = e.dataTransfer.files[0];
    if (file) {
        handleFile(file);
    }
});

// Also allow dropping on the whole document
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (isMarkdownFile(file) || isWordFile(file))) {
        handleFile(file);
    }
});

// Initialize
initTheme();
renderRecentFiles();
