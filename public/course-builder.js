// Course Builder JavaScript

let descriptionEditor;
let articleEditor;
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
    sections: [],
    pricing: { type: 'free', price: 0 },
    settings: {
        certificate: false,
        discussions: false,
        published: false
    }
};

let currentSection = null;
let currentLesson = null;
let sectionCounter = 0;
let lessonCounter = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    checkAdminAccess();
    initializeEditors();
    setupEventListeners();
    loadDraftCourse();
});

// Initialize Rich Text Editors
function initializeEditors() {
    // Description editor
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

    // Article editor (for lessons)
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
}

// Setup Event Listeners
function setupEventListeners() {
    // Thumbnail upload
    const thumbnailUpload = document.getElementById('thumbnailUpload');
    const thumbnailInput = document.getElementById('thumbnailInput');
    
    thumbnailUpload.addEventListener('click', () => thumbnailInput.click());
    thumbnailInput.addEventListener('change', handleThumbnailUpload);
    
    // Paste support for thumbnail
    thumbnailUpload.addEventListener('paste', handlePaste);
    
    // Lesson attachments
    const lessonAttachments = document.getElementById('lessonAttachments');
    lessonAttachments.addEventListener('paste', handleLessonPaste);
    lessonAttachments.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = (e) => handleLessonAttachments(e.target.files);
        input.click();
    });
    
    // Pricing type change
    document.querySelectorAll('input[name="courseType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const pricingSection = document.getElementById('pricingSection');
            pricingSection.style.display = e.target.value === 'paid' ? 'block' : 'none';
        });
    });
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
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            displayThumbnail(file);
            e.preventDefault();
        }
    }
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

// Sections Management
function addSection() {
    sectionCounter++;
    const section = {
        id: `section-${sectionCounter}`,
        title: `Section ${sectionCounter}`,
        lessons: []
    };
    
    currentCourse.sections.push(section);
    renderSections();
    updateSectionCount();
}

function renderSections() {
    const container = document.getElementById('sectionsContainer');
    container.innerHTML = currentCourse.sections.map((section, index) => `
        <div class="section-card" data-section-id="${section.id}">
            <div class="section-header">
                <span class="section-handle">☰</span>
                <input type="text" class="section-title-input" value="${section.title}" 
                       onchange="updateSectionTitle('${section.id}', this.value)">
                <div class="section-actions">
                    <button class="btn btn-sm btn-primary" onclick="addLesson('${section.id}')">+ Add Lesson</button>
                    <button class="btn-icon" onclick="deleteSection('${section.id}')">🗑️</button>
                </div>
            </div>
            <div class="lessons-list" id="lessons-${section.id}">
                ${renderLessons(section.lessons, section.id)}
            </div>
        </div>
    `).join('');
}

function renderLessons(lessons, sectionId) {
    if (lessons.length === 0) {
        return '<p style="color: var(--text-color); opacity: 0.7; padding: 1rem;">No lessons yet. Click "Add Lesson" to get started.</p>';
    }
    
    return lessons.map(lesson => `
        <div class="lesson-item" onclick="editLesson('${sectionId}', '${lesson.id}')">
            <span class="lesson-icon">${getLessonIcon(lesson.type)}</span>
            <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-meta">${lesson.type} • ${lesson.duration || '5'} min</div>
            </div>
            <div class="lesson-actions" onclick="event.stopPropagation()">
                <button class="btn-icon" onclick="deleteLesson('${sectionId}', '${lesson.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function getLessonIcon(type) {
    const icons = {
        'video': '🎥',
        'article': '📄',
        'quiz': '❓'
    };
    return icons[type] || '📄';
}

function updateSectionTitle(sectionId, title) {
    const section = currentCourse.sections.find(s => s.id === sectionId);
    if (section) {
        section.title = title;
    }
}

function deleteSection(sectionId) {
    if (confirm('Delete this section and all its lessons?')) {
        currentCourse.sections = currentCourse.sections.filter(s => s.id !== sectionId);
        renderSections();
        updateSectionCount();
    }
}

function updateSectionCount() {
    const totalLessons = currentCourse.sections.reduce((sum, s) => sum + s.lessons.length, 0);
    document.getElementById('sectionCount').textContent = totalLessons;
}

// Lessons Management
function addLesson(sectionId) {
    currentSection = sectionId;
    currentLesson = null;
    
    // Reset form
    document.getElementById('lessonTitle').value = '';
    document.getElementById('lessonType').value = 'video';
    document.getElementById('videoUrl').value = '';
    document.getElementById('lessonDuration').value = '';
    document.getElementById('lessonDescription').value = '';
    articleEditor.setText('');
    document.getElementById('attachmentsList').innerHTML = '';
    
    updateLessonTypeFields();
    openLessonModal();
}

function editLesson(sectionId, lessonId) {
    currentSection = sectionId;
    const section = currentCourse.sections.find(s => s.id === sectionId);
    currentLesson = section.lessons.find(l => l.id === lessonId);
    
    // Populate form
    document.getElementById('lessonTitle').value = currentLesson.title;
    document.getElementById('lessonType').value = currentLesson.type;
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
    } else if (type === 'article') {
        lesson.content = articleEditor.root.innerHTML;
    }
    
    const section = currentCourse.sections.find(s => s.id === currentSection);
    
    if (currentLesson) {
        // Update existing lesson
        const index = section.lessons.findIndex(l => l.id === currentLesson.id);
        section.lessons[index] = lesson;
    } else {
        // Add new lesson
        section.lessons.push(lesson);
    }
    
    renderSections();
    updateSectionCount();
    closeLessonModal();
}

function deleteLesson(sectionId, lessonId) {
    if (confirm('Delete this lesson?')) {
        const section = currentCourse.sections.find(s => s.id === sectionId);
        section.lessons = section.lessons.filter(l => l.id !== lessonId);
        renderSections();
        updateSectionCount();
    }
}

// Lesson Attachments
function handleLessonPaste(e) {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            addAttachment(file);
            e.preventDefault();
        }
    }
}

function handleLessonAttachments(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            addAttachment(file);
        }
    });
}

function addAttachment(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const container = document.getElementById('attachmentsList');
        const div = document.createElement('div');
        div.className = 'attachment-item';
        div.innerHTML = `
            <img src="${e.target.result}" alt="Attachment">
            <button class="attachment-remove" onclick="this.parentElement.remove()">×</button>
        `;
        container.appendChild(div);
    };
    reader.readAsDataURL(file);
}

// Modal Functions
function openLessonModal() {
    document.getElementById('lessonModal').classList.add('active');
}

function closeLessonModal() {
    document.getElementById('lessonModal').classList.remove('active');
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
            <span>📚 ${currentCourse.sections.length} sections</span>
            <span>🎥 ${currentCourse.sections.reduce((sum, s) => sum + s.lessons.length, 0)} lessons</span>
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

// Save Course
async function saveCourse() {
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

// Load Draft
function loadDraftCourse() {
    const draft = localStorage.getItem('courseDraft');
    if (draft) {
        currentCourse = JSON.parse(draft);
        // Populate form fields
        if (currentCourse.title) {
            document.getElementById('courseTitle').value = currentCourse.title;
        }
        // ... populate other fields as needed
        renderSections();
        updateSectionCount();
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
