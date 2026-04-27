// Course Builder JavaScript - Rebuilt

let descriptionEditor;
let chapterEditor;
let currentCourse = {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    category: '',
    objectives: [],
    thumbnail: null,
    level: 'Beginner',
    language: 'English',
    icon: '📚',
    lessons: [],  // SIMPLIFIED: Direct lessons, no sections
    pricing: { type: 'free', price: 0 },
    settings: {
        certificate: false,
        discussions: false,
        published: false
    }
};

let currentLessonId = null;
let currentChapterId = null;
let lessonCounter = 0;
let chapterCounter = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Course Builder initializing...');
    
    try {
        // These functions are from app.js - check if they exist
        if (typeof checkAuthStatus === 'function') {
            checkAuthStatus();
        }
        if (typeof checkAdminAccess === 'function') {
            checkAdminAccess();
        }
    } catch (e) {
        console.warn('Auth check functions not available:', e);
    }
    
    // Always run these critical functions
    initializeEditors();
    setupEventListeners();
    loadDraftCourse();
    
    console.log('Course Builder ready');
    console.log('Thumbnail upload element:', document.getElementById('thumbnailUpload'));
    console.log('Thumbnail input element:', document.getElementById('thumbnailInput'));
});

// Initialize Rich Text Editors
function initializeEditors() {
    console.log('Initializing editors...');
    
    // Check if Quill is loaded
    if (typeof Quill === 'undefined') {
        console.error('Quill library not loaded!');
        return;
    }
    
    // Description editor
    const descEditorEl = document.querySelector('#descriptionEditor');
    if (!descEditorEl) {
        console.error('Description editor element not found');
        return;
    }
    
    descriptionEditor = new Quill('#descriptionEditor', {
        theme: 'snow',
        placeholder: 'Describe your course in detail...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'header': [1, 2, 3, false] }],
                ['link'],
                ['clean']
            ]
        }
    });
    console.log('Description editor initialized');

    // Article editor (for lessons)
    const articleEditorEl = document.querySelector('#articleEditor');
    if (!articleEditorEl) {
        console.warn('Article editor element not found (this is OK, it\'s in a modal)');
        // Don't initialize article editor yet - it's in a modal that may not be rendered
        return;
    }
    
    articleEditor = new Quill('#articleEditor', {
        theme: 'snow',
        placeholder: 'Write your article content...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'header': [1, 2, 3, false] }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
    console.log('Article editor initialized');
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Course ID field - ensure it's editable and updates on change
    const courseIdField = document.getElementById('courseId');
    if (courseIdField) {
        courseIdField.removeAttribute('readonly');
        courseIdField.removeAttribute('disabled');
        courseIdField.addEventListener('input', (e) => {
            currentCourse.id = e.target.value.trim();
            autoSave();
        });
        console.log('Course ID field is editable');
    }
    
    // Thumbnail upload - COMPLETELY REWRITTEN
    const thumbnailUpload = document.getElementById('thumbnailUpload');
    const thumbnailInput = document.getElementById('thumbnailInput');
    
    if (thumbnailUpload && thumbnailInput) {
        // Make the upload area focusable so it can receive paste events
        thumbnailUpload.setAttribute('tabindex', '0');
        
        // Click to upload
        thumbnailUpload.addEventListener('click', (e) => {
            console.log('Thumbnail area clicked');
            if (e.target.tagName !== 'INPUT') {
                thumbnailInput.click();
            }
        });
        
        // File input change
        thumbnailInput.addEventListener('change', (e) => {
            console.log('File selected via input');
            handleThumbnailUpload(e);
        });
        
        // Focus the area when clicked to enable paste
        thumbnailUpload.addEventListener('click', () => {
            thumbnailUpload.focus();
        });
        
        // Paste event on the upload area itself
        thumbnailUpload.addEventListener('paste', (e) => {
            console.log('Paste event on thumbnailUpload element');
            e.preventDefault();
            e.stopPropagation();
            handlePaste(e);
        });
        
        // Global paste handler as backup
        let pasteHandlerAdded = false;
        thumbnailUpload.addEventListener('focus', () => {
            if (!pasteHandlerAdded) {
                console.log('Thumbnail area focused, adding global paste listener');
                window.addEventListener('paste', globalPasteHandler);
                pasteHandlerAdded = true;
            }
        });
        
        thumbnailUpload.addEventListener('blur', () => {
            console.log('Thumbnail area blurred');
        });
    }
    
    // Pricing type change
    document.querySelectorAll('input[name="courseType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const pricingSection = document.getElementById('pricingSection');
            pricingSection.style.display = e.target.value === 'paid' ? 'block' : 'none';
        });
    });
    
    console.log('Event listeners setup complete');
}

// Global paste handler
function globalPasteHandler(e) {
    const thumbnailUpload = document.getElementById('thumbnailUpload');
    if (document.activeElement === thumbnailUpload || thumbnailUpload.contains(document.activeElement)) {
        console.log('Global paste detected while thumbnail area focused');
        e.preventDefault();
        handlePaste(e);
    }
}

// Panel Navigation
function showPanel(panelName) {
    // Hide all panels
    document.querySelectorAll('.builder-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active from all outline items
    document.querySelectorAll('.outline-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected panel
    const panelMap = {
        'basics': 'basicsPanel',
        'curriculum': 'curriculumPanel',
        'pricing': 'pricingPanel',
        'settings': 'settingsPanel',
        'preview': 'previewPanel'
    };
    
    document.getElementById(panelMap[panelName]).classList.add('active');
    event.target.closest('.outline-item').classList.add('active');
    
    // Update preview if preview panel
    if (panelName === 'preview') {
        updatePreview();
    }
}

// Learning Objectives
function addObjective() {
    const container = document.getElementById('learningObjectives');
    const div = document.createElement('div');
    div.className = 'objective-item';
    div.innerHTML = `
        <input type="text" class="form-input" placeholder="Learning objective ${container.children.length + 1}">
        <button class="btn-icon" onclick="removeObjective(this)">🗑️</button>
    `;
    container.appendChild(div);
}

function removeObjective(button) {
    button.closest('.objective-item').remove();
}

// Thumbnail Upload
function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        displayThumbnail(file);
    }
}

function handlePaste(e) {
    console.log('=== PASTE EVENT HANDLER ===' );
    console.log('Event:', e);
    console.log('ClipboardData:', e.clipboardData);
    
    if (!e.clipboardData) {
        console.error('No clipboardData in event');
        return;
    }
    
    const items = e.clipboardData.items;
    if (!items) {
        console.error('No items in clipboardData');
        return;
    }
    
    console.log('Total clipboard items:', items.length);
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`Item ${i}:`, {
            kind: item.kind,
            type: item.type
        });
        
        // Check if it's an image
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            console.log('✓ Image file found!');
            const file = item.getAsFile();
            
            if (file) {
                console.log('File object:', file);
                console.log('File name:', file.name);
                console.log('File size:', file.size);
                console.log('File type:', file.type);
                
                displayThumbnail(file, null);
                console.log('✓ Image pasted and displayed successfully!');
                return;
            } else {
                console.error('getAsFile() returned null');
            }
        }
    }
    
    console.warn('No image found in clipboard items');
}

function displayThumbnail(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('thumbnailPreview');
        const placeholder = document.querySelector('#thumbnailUpload .upload-placeholder');
        preview.src = e.target.result;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        currentCourse.thumbnail = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Lessons Management - SIMPLIFIED
window.addLesson = function() {
    console.log('Adding new lesson...');
    lessonCounter++;
    const lesson = {
        id: `lesson-${Date.now()}-${lessonCounter}`,
        title: `Lesson ${lessonCounter}`,
        description: '',
        order: currentCourse.lessons.length + 1,
        chapters: []
    };
    
    currentCourse.lessons.push(lesson);
    console.log('Lesson added:', lesson);
    renderLessons();
    updateLessonCount();
    autoSave();
}

function renderLessons() {
    const container = document.getElementById('lessonsContainer');
    
    if (!container) {
        console.error('lessonsContainer not found');
        return;
    }
    
    if (currentCourse.lessons.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7; padding: 2rem;">No lessons yet. Click "+ Add Lesson" to get started.</p>';
        return;
    }
    
    container.innerHTML = currentCourse.lessons.map((lesson, index) => {
        const chapterCount = lesson.chapters ? lesson.chapters.length : 0;
        const totalDuration = calculateLessonDuration(lesson);
        
        return `
        <div class="lesson-card" data-lesson-id="${lesson.id}">
            <div class="lesson-header">
                <span class="lesson-handle">☰</span>
                <div class="lesson-number">${index + 1}</div>
                <input type="text" class="lesson-title-input" value="${escapeHtml(lesson.title)}" 
                       onchange="window.updateLessonTitle('${lesson.id}', this.value)">
                <div class="lesson-meta-inline">${chapterCount} chapters • ${totalDuration} min</div>
                <div class="lesson-actions">
                    <button class="btn btn-sm btn-primary" onclick="window.editLesson('${lesson.id}')">Edit</button>
                    <button class="btn-icon" onclick="window.deleteLesson('${lesson.id}')">🗑️</button>
                </div>
            </div>
            <div class="chapters-preview" id="chapters-${lesson.id}">
                ${renderChaptersPreview(lesson.chapters || [])}
            </div>
        </div>
    `;
    }).join('');
    
    console.log('Lessons rendered:', currentCourse.lessons.length);
}

function renderChaptersPreview(chapters) {
    if (chapters.length === 0) {
        return '<p style="color: var(--text-color); opacity: 0.7; padding: 0.5rem 1rem; font-size: 0.9rem;">No chapters yet</p>';
    }
    
    return '<div class="chapters-preview-list">' + chapters.map((chapter, index) => `
        <div class="chapter-preview-item">
            <span class="chapter-preview-icon">${getChapterIcon(chapter.type)}</span>
            <span class="chapter-preview-title">${index + 1}. ${escapeHtml(chapter.title)}</span>
            <span class="chapter-preview-duration">${chapter.duration || 5} min</span>
        </div>
    `).join('') + '</div>';
}


function calculateLessonDuration(lesson) {
    if (!lesson.chapters || lesson.chapters.length === 0) return 0;
    return lesson.chapters.reduce((sum, chapter) => {
        return sum + (chapter.duration || 5);
    }, 0);
}

function getLessonIcon(type) {
    const icons = {
        'video': '🎥',
        'article': '📄',
        'quiz': '❓'
    };
    return icons[type] || '📄';
}

window.updateLessonTitle = function(lessonId, title) {
    console.log('Updating lesson title:', lessonId, title);
    const lesson = currentCourse.lessons.find(l => l.id === lessonId);
    if (lesson) {
        lesson.title = title;
        autoSave();
    }
}

function updateLessonCount() {
    const totalLessons = currentCourse.lessons.length;
    const totalChapters = currentCourse.lessons.reduce((sum, l) => sum + (l.chapters?.length || 0), 0);
    document.getElementById('lessonCount').textContent = `${totalLessons} lessons, ${totalChapters} chapters`;
}


window.editLesson = function(lessonId) {
    console.log('Editing lesson:', lessonId);
    currentLessonId = lessonId;
    
    const lesson = currentCourse.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    // Show lesson editor modal with chapters
    openLessonEditor(lesson);
    document.getElementById('lessonDescription').value = currentLesson.description || '';
    
    if (currentLesson.type === 'video') {
        document.getElementById('videoUrl').value = currentLesson.videoUrl || '';
        document.getElementById('lessonDuration').value = currentLesson.duration || '';
    } else if (currentLesson.type === 'article') {
        articleEditor.root.innerHTML = currentLesson.content || '';
    }
    
    updateLessonTypeFields();
    openLessonModal();
}

function updateLessonTypeFields() {
    const type = document.getElementById('lessonType').value;
    document.querySelectorAll('.lesson-type-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    if (type === 'video') {
        document.getElementById('videoFields').style.display = 'block';
    } else if (type === 'article') {
        document.getElementById('articleFields').style.display = 'block';
    }
}

function saveLesson() {
    const title = document.getElementById('lessonTitle').value.trim();
    if (!title) {
        alert('Please enter a lesson title');
        return;
    }
    
    const type = document.getElementById('lessonType').value;
    const lesson = {
        id: currentLesson ? currentLesson.id : `lesson-${++lessonCounter}`,
        title: title,
        type: type,
        description: document.getElementById('lessonDescription').value,
        duration: document.getElementById('lessonDuration').value || 5
    };
    
    if (type === 'video') {
        lesson.videoUrl = document.getElementById('videoUrl').value;
    } else if (type === 'article' && articleEditor) {
        lesson.content = articleEditor.root.innerHTML;
    }
    
    if (currentLessonId) {
        // Update existing lesson
        const index = currentCourse.lessons.findIndex(l => l.id === currentLessonId);
        currentCourse.lessons[index] = lesson;
    } else {
        // Add new lesson
        currentCourse.lessons.push(lesson);
        section.lessons.push(lesson);
    }
    
    renderSections();
    updateSectionCount();
    closeLessonModal();
}

window.deleteLesson = function(lessonId) {
    if (confirm('Delete this lesson and all its chapters?')) {
        currentCourse.lessons = currentCourse.lessons.filter(l => l.id !== lessonId);
        renderLessons();
        updateLessonCount();
        autoSave();
    }
}

// Lesson Editor Modal
function openLessonEditor(lesson) {
    const modal = document.getElementById('lessonModal');
    if (!modal) return;
    
    // Populate lesson details
    document.getElementById('lessonTitle').value = lesson.title || '';
    document.getElementById('lessonDescription').value = lesson.description || '';
    
    // Render chapters
    renderChapters(lesson.chapters || []);
    
    modal.classList.add('active');
}

function renderChapters(chapters) {
    const container = document.getElementById('chaptersContainer');
    if (!container) return;
    
    if (chapters.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); opacity: 0.7; padding: 1rem; text-align: center;">No chapters yet. Click "+ Add Chapter" to get started.</p>';
        return;
    }
    
    container.innerHTML = chapters.map((chapter, index) => `
        <div class="chapter-item">
            <span class="chapter-icon">${getChapterIcon(chapter.type)}</span>
            <div class="chapter-info">
                <div class="chapter-title">${escapeHtml(chapter.title)}</div>
                <div class="chapter-meta">${chapter.type} • ${chapter.duration || 5} min</div>
            </div>
            <div class="chapter-actions">
                <button class="btn-icon" onclick="window.editChapter(${index})" title="Edit">✏️</button>
                <button class="btn-icon" onclick="window.deleteChapter(${index})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

function getChapterIcon(type) {
    const icons = {
        'video': '🎥',
        'text': '📄',
        'image': '🖼️',
        'code': '💻',
        'quiz': '❓',
        'file': '📎'
    };
    return icons[type] || '📄';
}

window.saveLesson = function() {
    const title = document.getElementById('lessonTitle').value.trim();
    if (!title) {
        alert('Please enter a lesson title');
        return;
    }
    
    const lesson = currentCourse.lessons.find(l => l.id === currentLessonId);
    if (!lesson) return;
    
    lesson.title = title;
    lesson.description = document.getElementById('lessonDescription').value;
    
    closeLessonModal();
    renderLessons();
    autoSave();
}

window.closeLessonModal = function() {
    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Chapter Management
window.addChapter = function() {
    console.log('Adding new chapter...');
    currentChapterId = null;
    
    // Reset chapter form
    document.getElementById('chapterTitle').value = '';
    document.getElementById('chapterType').value = 'video';
    document.getElementById('chapterDuration').value = '5';
    document.getElementById('chapterVideoUrl').value = '';
    document.getElementById('chapterCode').value = '';
    document.getElementById('chapterImageCaption').value = '';
    
    // Initialize chapter text editor if not already done
    initializeChapterEditor();
    
    updateChapterTypeFields();
    openChapterModal();
}

window.editChapter = function(chapterIndex) {
    console.log('Editing chapter:', chapterIndex);
    const lesson = currentCourse.lessons.find(l => l.id === currentLessonId);
    if (!lesson || !lesson.chapters) return;
    
    const chapter = lesson.chapters[chapterIndex];
    if (!chapter) return;
    
    currentChapterId = chapterIndex;
    
    // Populate form
    document.getElementById('chapterTitle').value = chapter.title || '';
    document.getElementById('chapterType').value = chapter.type || 'video';
    document.getElementById('chapterDuration').value = chapter.duration || 5;
    
    // Type-specific fields
    if (chapter.type === 'video') {
        document.getElementById('chapterVideoUrl').value = chapter.content?.url || '';
    } else if (chapter.type === 'text') {
        initializeChapterEditor();
        if (chapterEditor && chapter.content?.html) {
            chapterEditor.root.innerHTML = chapter.content.html;
        }
    } else if (chapter.type === 'image') {
        document.getElementById('chapterImageCaption').value = chapter.content?.caption || '';
        if (chapter.content?.imageData) {
            const preview = document.getElementById('chapterImagePreview');
            preview.src = chapter.content.imageData;
            preview.style.display = 'block';
        }
    } else if (chapter.type === 'code') {
        document.getElementById('chapterCodeLanguage').value = chapter.content?.language || 'javascript';
        document.getElementById('chapterCode').value = chapter.content?.code || '';
    }
    
    updateChapterTypeFields();
    openChapterModal();
}

window.deleteChapter = function(chapterIndex) {
    if (!confirm('Delete this chapter?')) return;
    
    const lesson = currentCourse.lessons.find(l => l.id === currentLessonId);
    if (!lesson || !lesson.chapters) return;
    
    lesson.chapters.splice(chapterIndex, 1);
    renderChapters(lesson.chapters);
    autoSave();
}

function openChapterModal() {
    const modal = document.getElementById('chapterModal');
    if (modal) {
        modal.classList.add('active');
        setupChapterImageUpload();
    }
}

window.closeChapterModal = function() {
    const modal = document.getElementById('chapterModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

window.updateChapterTypeFields = function() {
    const type = document.getElementById('chapterType').value;
    
    // Hide all type-specific fields
    document.querySelectorAll('.chapter-type-fields').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show relevant fields
    const fieldMap = {
        'video': 'videoChapterFields',
        'text': 'textChapterFields',
        'image': 'imageChapterFields',
        'code': 'codeChapterFields'
    };
    
    const fieldId = fieldMap[type];
    if (fieldId) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.style.display = 'block';
        }
    }
    
    // Initialize text editor if text type is selected
    if (type === 'text') {
        initializeChapterEditor();
    }
}

let chapterEditor = null;

function initializeChapterEditor() {
    if (chapterEditor) return; // Already initialized
    
    const editorEl = document.querySelector('#chapterTextEditor');
    if (!editorEl) {
        console.warn('Chapter text editor element not found');
        return;
    }
    
    if (typeof Quill === 'undefined') {
        console.error('Quill not loaded');
        return;
    }
    
    chapterEditor = new Quill('#chapterTextEditor', {
        theme: 'snow',
        placeholder: 'Write your chapter content...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'header': [1, 2, 3, false] }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
    
    console.log('Chapter text editor initialized');
}

function setupChapterImageUpload() {
    // Text chapter image upload
    const textImageUpload = document.getElementById('chapterImageUpload');
    const textImageInput = document.getElementById('chapterImageInput');
    
    if (textImageUpload && textImageInput) {
        // Make focusable
        textImageUpload.setAttribute('tabindex', '0');
        
        // Click to upload
        textImageUpload.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                textImageInput.click();
                textImageUpload.focus();
            }
        };
        
        // File input change
        textImageInput.onchange = (e) => {
            handleChapterImageUpload(e.target.files);
        };
        
        // Paste support
        textImageUpload.onpaste = (e) => {
            console.log('Paste in text chapter image area');
            handleChapterImagePaste(e);
        };
    }
    
    // Single image chapter upload
    const singleImageUpload = document.getElementById('chapterSingleImageUpload');
    const singleImageInput = document.getElementById('chapterSingleImageInput');
    
    if (singleImageUpload && singleImageInput) {
        singleImageUpload.setAttribute('tabindex', '0');
        
        singleImageUpload.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                singleImageInput.click();
                singleImageUpload.focus();
            }
        };
        
        singleImageInput.onchange = (e) => {
            if (e.target.files[0]) {
                displayChapterSingleImage(e.target.files[0]);
            }
        };
        
        singleImageUpload.onpaste = (e) => {
            console.log('Paste in single image chapter area');
            handleChapterSingleImagePaste(e);
        };
    }
}

function handleChapterImageUpload(files) {
    if (!chapterEditor) {
        console.error('Chapter editor not initialized');
        return;
    }
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Insert image into Quill editor
                const range = chapterEditor.getSelection(true);
                chapterEditor.insertEmbed(range.index, 'image', e.target.result);
                chapterEditor.setSelection(range.index + 1);
                console.log('Image inserted into chapter editor');
            };
            reader.readAsDataURL(file);
        }
    });
}

function handleChapterImagePaste(e) {
    console.log('=== CHAPTER IMAGE PASTE ===' );
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.clipboardData || !e.clipboardData.items) {
        console.log('No clipboard data');
        return;
    }
    
    const items = e.clipboardData.items;
    console.log('Clipboard items:', items.length);
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            console.log('✓ Image found in clipboard');
            const file = item.getAsFile();
            if (file && chapterEditor) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const range = chapterEditor.getSelection(true);
                    chapterEditor.insertEmbed(range.index, 'image', e.target.result);
                    chapterEditor.setSelection(range.index + 1);
                    console.log('✓ Pasted image inserted into editor');
                };
                reader.readAsDataURL(file);
                return;
            }
        }
    }
}

function displayChapterSingleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('chapterImagePreview');
        const placeholder = document.querySelector('#chapterSingleImageUpload .upload-placeholder');
        if (preview && placeholder) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

function handleChapterSingleImagePaste(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!e.clipboardData || !e.clipboardData.items) return;
    
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
                displayChapterSingleImage(file);
                return;
            }
        }
    }
}

window.saveChapter = function() {
    const title = document.getElementById('chapterTitle').value.trim();
    const type = document.getElementById('chapterType').value;
    const duration = parseInt(document.getElementById('chapterDuration').value) || 5;
    
    if (!title) {
        alert('Please enter a chapter title');
        return;
    }
    
    const lesson = currentCourse.lessons.find(l => l.id === currentLessonId);
    if (!lesson) return;
    
    if (!lesson.chapters) {
        lesson.chapters = [];
    }
    
    const chapter = {
        id: currentChapterId !== null ? lesson.chapters[currentChapterId].id : `chapter-${Date.now()}`,
        title,
        type,
        duration,
        content: {}
    };
    
    // Type-specific content
    if (type === 'video') {
        chapter.content.url = document.getElementById('chapterVideoUrl').value;
    } else if (type === 'text') {
        chapter.content.html = chapterEditor ? chapterEditor.root.innerHTML : '';
        chapter.content.readTime = Math.ceil(chapterEditor.getText().split(/\s+/).length / 200);
    } else if (type === 'image') {
        const preview = document.getElementById('chapterImagePreview');
        chapter.content.imageData = preview.src;
        chapter.content.caption = document.getElementById('chapterImageCaption').value;
    } else if (type === 'code') {
        chapter.content.language = document.getElementById('chapterCodeLanguage').value;
        chapter.content.code = document.getElementById('chapterCode').value;
    }
    
    // Add or update chapter
    if (currentChapterId !== null) {
        lesson.chapters[currentChapterId] = chapter;
    } else {
        lesson.chapters.push(chapter);
    }
    
    renderChapters(lesson.chapters);
    renderLessons(); // Update lesson card to show new chapter count
    closeChapterModal();
    autoSave();
    
    console.log('Chapter saved:', chapter);
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-save functionality
let autoSaveTimeout;
function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        localStorage.setItem('courseDraft', JSON.stringify(currentCourse));
        console.log('Course auto-saved');
    }, 1000);
}

// Preview
function updatePreview() {
    const preview = document.getElementById('coursePreview');
    const objectives = Array.from(document.querySelectorAll('#learningObjectives input'))
        .map(input => input.value.trim())
        .filter(val => val);
    
    preview.innerHTML = `
        ${currentCourse.thumbnail ? `<img src="${currentCourse.thumbnail}" class="preview-thumbnail" alt="Course thumbnail">` : ''}
        <h1 class="preview-title">${document.getElementById('courseTitle').value || 'Course Title'}</h1>
        <p class="preview-subtitle">${document.getElementById('courseSubtitle').value || ''}</p>
        <div class="preview-meta">
            <span>📊 ${document.getElementById('courseLevel').value}</span>
            <span>🌐 ${document.getElementById('courseLanguage').value}</span>
            <span>📚 ${currentCourse.lessons.length} lessons</span>
            <span>🎥 ${currentCourse.lessons.reduce((sum, l) => sum + (l.chapters?.length || 0), 0)} chapters</span>
        </div>
        ${objectives.length > 0 ? `
            <div class="preview-objectives">
                <h3>What you'll learn</h3>
                <ul>
                    ${objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        <div class="preview-description">
            <h3>About this course</h3>
            ${descriptionEditor.root.innerHTML}
        </div>
    `;
}

// Load Draft
function loadDraftCourse() {
    const draft = localStorage.getItem('courseDraft');
    if (draft) {
        try {
            currentCourse = JSON.parse(draft);
            console.log('Draft course loaded:', currentCourse);
            
            // Populate basic fields if they exist
            if (currentCourse.title) {
                document.getElementById('courseTitle').value = currentCourse.title;
            }
            if (currentCourse.subtitle) {
                document.getElementById('courseSubtitle').value = currentCourse.subtitle;
            }
            if (currentCourse.id) {
                document.getElementById('courseId').value = currentCourse.id;
            }
            if (currentCourse.thumbnail) {
                displayThumbnail(null, currentCourse.thumbnail);
            }
            
            renderLessons();
            updateLessonCount();
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

function displayThumbnail(file, dataUrl) {
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            showThumbnailPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    } else if (dataUrl) {
        showThumbnailPreview(dataUrl);
    }
}

function showThumbnailPreview(dataUrl) {
    const preview = document.getElementById('thumbnailPreview');
    const placeholder = document.querySelector('#thumbnailUpload .upload-placeholder');
    if (preview && placeholder) {
        preview.src = dataUrl;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        currentCourse.thumbnail = dataUrl;
        autoSave();
    }
}

// Save Course
window.saveCourse = async function() {
    // Collect all form data
    currentCourse.id = document.getElementById('courseId').value.trim();
    currentCourse.title = document.getElementById('courseTitle').value.trim();
    currentCourse.subtitle = document.getElementById('courseSubtitle').value.trim();
    currentCourse.description = descriptionEditor.root.innerHTML;
    currentCourse.category = document.getElementById('courseCategory').value;
    currentCourse.level = document.getElementById('courseLevel').value;
    currentCourse.language = document.getElementById('courseLanguage').value;
    currentCourse.icon = document.getElementById('courseIcon').value || '📚';
    
    // Objectives
    currentCourse.objectives = Array.from(document.querySelectorAll('#learningObjectives input'))
        .map(input => input.value.trim())
        .filter(val => val);
    
    // Pricing
    const courseType = document.querySelector('input[name="courseType"]:checked').value;
    currentCourse.pricing = {
        type: courseType,
        price: courseType === 'paid' ? parseFloat(document.getElementById('coursePrice').value) : 0
    };
    
    // Settings
    currentCourse.settings = {
        certificate: document.getElementById('enableCertificate').checked,
        discussions: document.getElementById('enableDiscussions').checked,
        published: document.getElementById('publishCourse').checked
    };
    
    // Validate
    if (!currentCourse.id || !currentCourse.title) {
        alert('Please fill in Course ID and Title');
        return;
    }
    
    // Calculate totals
    const totalLessons = currentCourse.sections.reduce((sum, s) => sum + s.lessons.length, 0);
    const totalDuration = currentCourse.sections.reduce((sum, s) => 
        sum + s.lessons.reduce((lsum, l) => lsum + parseInt(l.duration || 5), 0), 0
    );
    
    // Save to localStorage
    localStorage.setItem('courseDraft', JSON.stringify(currentCourse));
    
    // Send to backend
    try {
        const response = await fetch('/api/admin/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...currentCourse,
                lessons: totalLessons,
                duration: Math.ceil(totalDuration / 60) // Convert to hours
            })
        });
        
        if (response.ok) {
            alert('Course saved successfully! ✅');
            // Add to catalog
            const courses = getCoursesCatalog();
            const existingIndex = courses.findIndex(c => c.id === currentCourse.id);
            
            const catalogCourse = {
                id: currentCourse.id,
                title: currentCourse.title,
                icon: currentCourse.icon,
                description: currentCourse.subtitle || currentCourse.title,
                level: currentCourse.level,
                duration: Math.ceil(totalDuration / 60),
                lessons: totalLessons
            };
            
            if (existingIndex >= 0) {
                courses[existingIndex] = catalogCourse;
            } else {
                courses.push(catalogCourse);
            }
            
            saveCoursesCatalog(courses);
        } else {
            alert('Course saved locally but failed to sync with server.');
        }
    } catch (error) {
        console.error('Error saving course:', error);
        alert('Course saved locally. Will sync when server is available.');
    }
}


// Helper functions from admin.js
function getCoursesCatalog() {
    const stored = localStorage.getItem('coursesCatalog');
    return stored ? JSON.parse(stored) : [];
}

function saveCoursesCatalog(courses) {
    localStorage.setItem('coursesCatalog', JSON.stringify(courses));
}
