# Complete Course Lifecycle Test

## Test Scenario: End-to-End Course Creation & Management

### Phase 1: Create Course in Admin Panel ✅

**Location**: `/admin`

1. **Navigate to Admin**
   - Go to `/admin`
   - Verify admin access granted
   - Open browser console (F12)

2. **Create Basic Course**
   - Click "Create Course" tab
   - Fill in:
     - Title: "Complete Web Development 2024"
     - Icon: 💻
     - Description: "Master web development from HTML to deployment"
     - Level: Beginner
     - Duration: 40 hours
     - Lessons: 20
   - Watch Course ID auto-generate: `complete-web-development-2024`
   - Click "Create Course"
   - **Expected**: Success alert, course appears in catalog

3. **Verify Course in Catalog**
   - Auto-switches to "Course Catalog" tab
   - Find "Complete Web Development 2024"
   - Click "View" button
   - **Expected**: Opens `/course.html?id=complete-web-development-2024`

---

### Phase 2: Build Course Curriculum ✅

**Location**: `/course-builder`

1. **Navigate to Course Builder**
   - Go to `/course-builder`
   - Open console (F12)

2. **Fill Basic Info**
   - Course ID: `complete-web-development-2024`
   - Title: "Complete Web Development 2024"
   - Subtitle: "From Zero to Full-Stack Developer"
   - Icon: 💻
   - Category: Development
   - Level: Beginner
   - Language: English

3. **Add Course Description**
   - Use rich text editor
   - Add formatted text
   - **Test**: Paste screenshot (Ctrl+V)
   - **Expected**: Image appears in editor

4. **Add Learning Objectives**
   - Click "+ Add Objective"
   - Add 3-5 objectives:
     - "Build responsive websites with HTML & CSS"
     - "Create interactive apps with JavaScript"
     - "Deploy projects to production"
   - **Expected**: Each objective appears in list

5. **Upload Course Thumbnail**
   - **Method 1**: Click upload area, select image
   - **Method 2**: Copy image, click area, paste (Ctrl+V)
   - **Expected**: Thumbnail preview appears

---

### Phase 3: Add Lessons ✅

1. **Add Lesson 1: Introduction**
   - Click "+ Add Lesson" button
   - Fill in:
     - Title: "Welcome to Web Development"
     - Description: "Course overview and setup"
     - Duration: 10 minutes
   - Click "Save Lesson"
   - **Expected**: Lesson appears in curriculum panel

2. **Add Lesson 2: HTML Basics**
   - Click "+ Add Lesson"
   - Title: "HTML Fundamentals"
   - Description: "Learn HTML tags and structure"
   - Duration: 30 minutes
   - Click "Save Lesson"

3. **Add Lesson 3: CSS Styling**
   - Click "+ Add Lesson"
   - Title: "CSS Styling Basics"
   - Description: "Style your web pages"
   - Duration: 45 minutes
   - Click "Save Lesson"

4. **Verify Lessons**
   - Check sidebar shows: "3 lessons, 0 chapters"
   - All lessons visible in curriculum panel

---

### Phase 4: Add Chapters to Lessons ✅

**For Lesson 1: "Welcome to Web Development"**

1. **Add Video Chapter**
   - Click "Add Chapter" on Lesson 1
   - Select Type: Video
   - Title: "Course Introduction"
   - Video URL: `https://www.youtube.com/watch?v=example`
   - Duration: 5 minutes
   - Click "Save Chapter"
   - **Expected**: Chapter appears under lesson

2. **Add Text Chapter**
   - Click "Add Chapter" on Lesson 1
   - Select Type: Text/Article
   - Title: "Setup Your Environment"
   - Use rich text editor to add content
   - **Test**: Paste screenshot in editor (Ctrl+V)
   - Duration: 5 minutes
   - Click "Save Chapter"
   - **Expected**: Chapter with image appears

**For Lesson 2: "HTML Fundamentals"**

3. **Add Code Chapter**
   - Click "Add Chapter" on Lesson 2
   - Select Type: Code
   - Title: "Your First HTML Page"
   - Code: 
     ```html
     <!DOCTYPE html>
     <html>
       <head><title>Hello World</title></head>
       <body><h1>Hello World!</h1></body>
     </html>
     ```
   - Language: HTML
   - Duration: 10 minutes
   - Click "Save Chapter"

4. **Add Quiz Chapter**
   - Click "Add Chapter" on Lesson 2
   - Select Type: Quiz
   - Title: "HTML Knowledge Check"
   - Questions: "What does HTML stand for?"
   - Duration: 5 minutes
   - Click "Save Chapter"

**For Lesson 3: "CSS Styling Basics"**

5. **Add Image Chapter**
   - Click "Add Chapter" on Lesson 3
   - Select Type: Image
   - Title: "CSS Box Model Diagram"
   - **Test**: Paste image (Ctrl+V)
   - Caption: "Understanding the CSS box model"
   - Click "Save Chapter"

6. **Verify Chapter Count**
   - Sidebar should show: "3 lessons, 5 chapters"
   - Each lesson shows its chapters

---

### Phase 5: Save & Publish Course ✅

1. **Auto-Save Check**
   - Make any small change
   - Wait 1 second
   - **Expected**: Console shows "Auto-saved"

2. **Manual Save**
   - Click "Save Course" button
   - **Expected Console Output**:
     ```
     💾 Saving course: complete-web-development-2024
     📊 Total lessons: 3
     ⏱️ Total duration: 85 minutes
     ✅ Saved to localStorage
     🌐 Attempting to save to backend...
     ⚠️ Backend save failed, but localStorage save succeeded
     📝 Updated existing course in catalog
     💾 Catalog saved
     ```
   - **Expected Alert**: "Course saved successfully! ✅"

3. **Verify Persistence**
   - Refresh page (F5)
   - **Expected**: All data loads back
   - All lessons and chapters intact

---

### Phase 6: View Course as Student ✅

1. **Open Course Detail Page**
   - Navigate to `/course.html?id=complete-web-development-2024`
   - **Expected**:
     - Course title and icon display
     - Description shows
     - Metadata: "Beginner | 2 hours | 3 lessons"
     - Course ID displayed

2. **Check Enrollment Status**
   - If logged in: Shows enrollment status
   - If not enrolled: "Request Access" button
   - If enrolled: "Continue Learning" button

---

### Phase 7: Edit Existing Course ✅

1. **From Admin Panel**
   - Go to `/admin` → "Course Catalog"
   - Find "Complete Web Development 2024"
   - Click "Edit" button
   - **Expected**: Redirects to course builder with data loaded

2. **Make Changes**
   - Add another lesson
   - Edit lesson title
   - Add more chapters
   - Click "Save Course"
   - **Expected**: Changes saved, catalog updated

---

### Phase 8: Test All Features ✅

**Image Paste/Upload**
- [ ] Paste in course description editor
- [ ] Paste in text chapter editor
- [ ] Paste in image chapter
- [ ] Upload course thumbnail
- [ ] All images display correctly

**Auto-Save**
- [ ] Make change, wait 1 second
- [ ] Console shows auto-save
- [ ] Refresh page, changes persist

**Lesson Management**
- [ ] Add lesson
- [ ] Edit lesson title inline
- [ ] Delete lesson
- [ ] Reorder lessons (if implemented)

**Chapter Management**
- [ ] Add video chapter
- [ ] Add text chapter with images
- [ ] Add image chapter
- [ ] Add code chapter
- [ ] Add quiz chapter
- [ ] Edit chapter
- [ ] Delete chapter

**Course Metadata**
- [ ] Auto-generated course ID works
- [ ] Unique URL created
- [ ] Course appears in catalog
- [ ] Course detail page works
- [ ] Enrollment status shows

---

## Expected Console Logs

### On Course Builder Load:
```
Course Builder initializing...
Setting up event listeners...
Course ID field is editable
Thumbnail upload area is focusable
Description editor initialized
Article editor initialized
Course Builder ready
Loading draft...
Draft course loaded: {id: "...", ...}
📚 Loading courses...
📊 Found 1 courses
```

### On Save Course:
```
💾 Saving course: complete-web-development-2024
📊 Total lessons: 3
⏱️ Total duration: 85 minutes
✅ Saved to localStorage
🌐 Attempting to save to backend...
⚠️ Backend save failed, but localStorage save succeeded
📝 Updated existing course in catalog
💾 Catalog saved
```

### On Add Lesson:
```
Lesson saved
Rendering lessons...
Updated lesson count: 3 lessons, 5 chapters
Auto-saving...
```

### On Add Chapter:
```
Chapter saved
Rendering chapters for lesson...
Auto-saving...
```

---

## Troubleshooting

**Issue: Course doesn't save**
- Check console for errors
- Verify course ID and title filled
- Check localStorage: `localStorage.getItem('courseDraft')`

**Issue: Lessons don't appear**
- Check console for render errors
- Verify `currentCourse.lessons` array
- Run: `renderLessons()`

**Issue: Chapters don't save**
- Check lesson has chapters array
- Verify chapter modal closes
- Check console for save logs

**Issue: Images don't paste**
- Ensure area is focused (click it first)
- Try Ctrl+V after clicking
- Check console for paste event logs

---

## Success Criteria

✅ Course created in admin panel
✅ Course ID auto-generated
✅ Unique URL created
✅ Course builder loads
✅ Basic info saved
✅ Thumbnail uploaded/pasted
✅ Learning objectives added
✅ 3+ lessons created
✅ 5+ chapters added (various types)
✅ Images paste in text chapters
✅ Auto-save works
✅ Manual save works
✅ Data persists after refresh
✅ Course appears in catalog
✅ Course detail page works
✅ Edit course works
✅ All console logs show success

---

**Test Status**: Ready for manual testing
**Last Updated**: 2026-04-27
