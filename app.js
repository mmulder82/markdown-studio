// State management
let currentFileHandle = null; // File System Access API handle
let currentFilePath = null;
let currentFileName = t('file.untitled');
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
const includeImagesCheckbox = document.getElementById('include-images');
const langToggle = document.getElementById('lang-toggle');
const saveLabel = document.getElementById('save-label');

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
    } else if (mode === 'editor') {
        editorPane.style.display = 'flex';
        editorPane.style.width = '100%';
    } else if (mode === 'preview') {
        previewPane.style.display = 'flex';
        previewPane.style.width = '100%';
    }
    updateViewModeText();
}

// De knop toont de weergave waar je naartoe gaat
function updateViewModeText() {
    const next = { split: 'editor', editor: 'preview', preview: 'split' }[viewMode];
    viewModeText.textContent = t(`toolbar.view.${next}`);
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
    document.title = `${fileName} – ${t('app.name')}`;

    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Editor management
function showEditor(markdown = '', fileName = t('file.untitled')) {
    dropZone.style.display = 'none';
    toolbar.style.display = 'flex';
    editorContainer.style.display = 'flex';

    markdownEditor.value = markdown;
    currentContent = markdown;
    currentFileName = fileName;
    fileNameDisplay.textContent = fileName;
    document.title = `${fileName} – ${t('app.name')}`;

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
    document.title = t('app.name');
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
        const li = document.createElement('li');
        li.className = 'empty';
        li.textContent = t('sidebar.recentEmpty');
        recentList.appendChild(li);
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
            alert(t('alert.recentReopen', { path: file.path }));
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

    if (diffMins < 1) return t('date.justNow');
    if (diffMins < 60) return t('date.minutes', { n: diffMins });
    if (diffHours < 24) return t('date.hours', { n: diffHours });
    if (diffDays < 7) return t('date.days', { n: diffDays });

    return date.toLocaleDateString(I18n.locale, { day: 'numeric', month: 'short' });
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

function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
    return `${bytes.toLocaleString(I18n.locale, { maximumFractionDigits: i ? 1 : 0 })} ${units[i]}`;
}

// Word-document (.docx) omzetten naar Markdown en openen in de editor
let isImporting = false;
async function importWordFile(file) {
    if (isImporting) return;
    isImporting = true;
    showToast(t('word.converting', { name: file.name }), { duration: 0 });
    try {
        const { markdown, imageCount } = await WordImport.convertDocx(file, {
            includeImages: includeImagesCheckbox.checked,
            labels: { image: t('word.imageLabel'), images: t('word.imagesHeading') },
        });
        const mdName = file.name.replace(/\.docx?$/i, '') + '.md';

        currentFileHandle = null; // opslaan = downloaden als nieuw .md-bestand
        showEditor(markdown, mdName);
        addToRecentFiles(file.name, mdName);

        const textLength = WordImport.stripEmbeddedImages(markdown, t('word.imageLabel')).length;
        const chars = textLength.toLocaleString(I18n.locale);
        if (imageCount) {
            const size = formatSize(new Blob([markdown]).size);
            showToast(t('word.convertedImages', { chars, images: imageCount, size }), { duration: 6000 });
        } else {
            showToast(t('word.converted', { chars }), { duration: 5000 });
        }
    } catch (err) {
        console.error(err);
        const key = `word.error.${err.code || 'generic'}`;
        showToast(t(key) === key ? t('word.error.generic') : t(key), { error: true, duration: 7000 });
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
        alert(t('alert.wrongType'));
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
        alert(t('alert.readError'));
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
    saveLabel.textContent = t('toolbar.saved');
    setTimeout(() => {
        saveLabel.textContent = t('toolbar.save');
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
                    description: t('picker.markdown'),
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

    showEditor(t('newDoc'), t('file.untitled'));
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

// Markdown kopiëren (bijv. om in een AI-chat te plakken).
// Ingebedde afbeeldingen gaan er altijd uit: base64-data is voor een AI-chat alleen ruis.
function copyWithFallback(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
}

copyMarkdownBtn.addEventListener('click', async () => {
    let text = markdownEditor.value;
    const withoutImages = WordImport.hasEmbeddedImages(text);
    if (withoutImages) {
        text = WordImport.stripEmbeddedImages(text, t('word.imageLabel'));
    }
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        copyWithFallback(text); // browsers zonder Clipboard API
    }
    const label = copyMarkdownBtn.querySelector('span');
    label.textContent = t('toolbar.copied');
    setTimeout(() => { label.textContent = t('toolbar.copy'); }, 1500);
    if (withoutImages) {
        showToast(t('copy.withoutImages'), { duration: 5000 });
    }
});

// Optie: afbeeldingen meenemen bij Word-import (onthouden in de browser)
try {
    includeImagesCheckbox.checked = localStorage.getItem('includeImages') === 'true';
} catch (e) { /* geen opslag beschikbaar */ }
includeImagesCheckbox.addEventListener('change', () => {
    try { localStorage.setItem('includeImages', includeImagesCheckbox.checked); } catch (e) { /* negeren */ }
});

// Taal wisselen (Nederlands / English)
langToggle.addEventListener('click', () => {
    I18n.setLanguage(I18n.lang === 'nl' ? 'en' : 'nl');
});

document.addEventListener('languagechange', () => {
    renderRecentFiles();
    updateViewModeText();
    document.title = toolbar.style.display === 'none' ? t('app.name') : `${currentFileName} – ${t('app.name')}`;
});

// Live preview (bij grote documenten, bijv. met ingebedde afbeeldingen, iets vertraagd)
let previewTimer = null;
markdownEditor.addEventListener('input', () => {
    clearTimeout(previewTimer);
    if (markdownEditor.value.length > 200000) {
        previewTimer = setTimeout(updatePreview, 300);
    } else {
        updatePreview();
    }
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
I18n.applyTranslations();
document.title = t('app.name');
initTheme();
renderRecentFiles();
updateViewModeText();
