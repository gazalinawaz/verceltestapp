# Course Builder - Comprehensive Plan

## 🎯 Objective
Build a professional course builder with proper hierarchy: **Course → Section → Lesson → Chapter**

## 📊 Data Structure

### Course Model
```javascript
{
  // Basic Info
  id: "python-masterclass",
  title: "Complete Python Programming Masterclass",
  subtitle: "Learn Python from scratch to advanced",
  description: "<rich html>",
  thumbnail: "base64 or url",
  
  // Metadata
  category: "development",
  level: "Beginner",
  language: "English",
  icon: "🐍",
  
  // Learning Objectives
  objectives: [
    "Master Python fundamentals",
    "Build real-world projects"
  ],
  
  // Curriculum
  sections: [
    {
      id: "section-1",
      title: "Python Basics",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Introduction to Python",
          description: "Learn what Python is",
          order: 1,
          chapters: [
            {
              id: "chapter-1-1-1",
              title: "Welcome Video",
              type: "video",
              order: 1,
              content: {
                url: "https://youtube.com/...",
                duration: 10 // minutes
              }
            },
            {
              id: "chapter-1-1-2",
              title: "What is Python?",
              type: "text",
              order: 2,
              content: {
                html: "<p>Python is...</p>",
                readTime: 5 // minutes
              }
            },
            {
              id: "chapter-1-1-3",
              title: "Code Example",
              type: "code",
              order: 3,
              content: {
                code: "print('Hello World')",
                language: "python"
              }
            },
            {
              id: "chapter-1-1-4",
              title: "Knowledge Check",
              type: "quiz",
              order: 4,
              content: {
                questions: [...]
              }
            }
          ]
        }
      ]
    }
  ],
  
  // Pricing
  pricing: {
    type: "free", // or "paid"
    price: 0
  },
  
  // Settings
  settings: {
    certificate: true,
    discussions: true,
    published: false
  }
}
```

## 🏗️ Chapter/Content Block Types

### 1. Video Chapter
- YouTube/Vimeo URL
- Direct video upload
- Duration (auto-detected or manual)
- Transcript (optional)

### 2. Text/Article Chapter
- Rich text editor (Quill.js)
- Markdown support
- Images inline
- Estimated read time

### 3. Image Chapter
- Single image with caption
- Screenshot paste support
- Image gallery

### 4. Code Chapter
- Syntax highlighted code
- Language selection
- Copy button
- Run in browser (optional)

### 5. Quiz Chapter
- Multiple choice
- True/False
- Fill in the blank
- Auto-grading

### 6. File/Resource Chapter
- PDF downloads
- Code files
- Worksheets
- Additional resources

## 🎨 UI Components

### Left Sidebar
```
Course Structure
├─ 📋 Course Basics
├─ 📚 Curriculum (12 lessons)
├─ 💰 Pricing
├─ ⚙️ Settings
└─ 👁️ Preview
```

### Main Panel - Curriculum View
```
[+ Add Section]

Section 1: Python Basics                    [↕️ ⚙️ 🗑️]
  [+ Add Lesson]
  
  Lesson 1.1: Introduction to Python        [↕️ ✏️ 🗑️]
    Duration: 25 min • 4 chapters
    
    Chapters:
    1. 🎥 Welcome Video (10 min)            [↕️ ✏️ 🗑️]
    2. 📄 What is Python? (5 min)           [↕️ ✏️ 🗑️]
    3. 💻 Code Example                      [↕️ ✏️ 🗑️]
    4. ❓ Knowledge Check                   [↕️ ✏️ 🗑️]
    
    [+ Add Chapter]
```

## 🔧 Key Features

### 1. Screenshot Paste
- **Where**: Thumbnail, Image chapters, Text editor
- **How**: 
  - Listen to `paste` event on specific elements
  - Extract image from `clipboardData`
  - Convert to base64
  - Display preview
  - Store in data model

### 2. Drag & Drop Reordering
- Sections can be reordered
- Lessons within sections
- Chapters within lessons
- Update `order` property on drop

### 3. Auto-save
- Save to localStorage every 30 seconds
- Save on every major action
- Show "Saving..." indicator
- Restore on page load

### 4. Duration Calculation
- Video: From video metadata or manual input
- Text: Word count / 200 words per minute
- Code: Fixed 2 minutes
- Quiz: 1 minute per question
- Auto-sum for lesson and course totals

### 5. Content Block Editor
- Modal for each chapter type
- Type-specific fields
- Preview before save
- Validation

## 🐛 Bugs to Fix

### Issue 1: Paste Not Working
**Problem**: Event listeners not properly attached
**Solution**: 
- Use `addEventListener` instead of inline handlers
- Attach after DOM ready
- Prevent default behavior
- Handle both click and paste events

### Issue 2: Add Lesson Not Working
**Problem**: Function not defined or scope issue
**Solution**:
- Ensure functions are in global scope
- Check for typos in onclick handlers
- Add error handling
- Console log for debugging

## 📝 Implementation Steps

### Phase 1: Fix Core Issues (Priority)
1. ✅ Fix paste event listeners
2. ✅ Fix add lesson functionality
3. ✅ Test section creation
4. ✅ Test lesson creation

### Phase 2: Rebuild Data Model
1. Update course structure
2. Add chapter support
3. Implement content blocks
4. Add validation

### Phase 3: Build Chapter Editor
1. Create chapter modal
2. Type selector
3. Type-specific forms
4. Save/cancel logic

### Phase 4: Drag & Drop
1. Add drag handles
2. Implement drag events
3. Update order on drop
4. Visual feedback

### Phase 5: Polish
1. Auto-save
2. Duration calculation
3. Preview improvements
4. Error handling

## 🧪 Testing Checklist

- [ ] Paste screenshot in thumbnail area
- [ ] Paste screenshot in image chapter
- [ ] Create section
- [ ] Create lesson in section
- [ ] Create chapter in lesson
- [ ] Edit chapter
- [ ] Delete chapter
- [ ] Reorder chapters
- [ ] Reorder lessons
- [ ] Reorder sections
- [ ] Save course
- [ ] Load saved course
- [ ] Preview course
- [ ] Publish course

## 🎯 Success Criteria

1. Can create course with 3+ sections
2. Each section has 2+ lessons
3. Each lesson has 3+ chapters
4. Screenshot paste works everywhere
5. Drag & drop reordering works
6. Auto-save prevents data loss
7. Duration auto-calculates correctly
8. Preview shows complete course structure
