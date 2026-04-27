# End-to-End Test Plan - Course Builder Platform

## Overview
This document outlines comprehensive end-to-end testing scenarios for the Course Builder platform, covering all user flows from authentication to course creation and management.

---

## Test Environment Setup

### Prerequisites
- Browser: Chrome/Firefox/Safari (latest versions)
- Auth0 tenant configured with test users
- Test data: Sample courses, users, images
- Network: Stable internet connection

### Test Users
1. **Admin User**: `admin@test.com` (with admin role in app_metadata)
2. **Regular User**: `student@test.com` (no admin role)
3. **New User**: Fresh registration

---

## Test Scenarios

### 1. Authentication & Authorization

#### 1.1 User Registration
**Steps:**
1. Navigate to `/`
2. Click "Get Started" or "Login"
3. Click "Sign Up"
4. Enter email, password
5. Complete registration

**Expected Results:**
- ✅ User account created
- ✅ Redirected to home page
- ✅ User profile visible in navbar
- ✅ Starter course automatically granted (check token claims)

**Test Data:**
- Email: `newuser@test.com`
- Password: `Test123!@#`

---

#### 1.2 User Login
**Steps:**
1. Navigate to `/`
2. Click "Login"
3. Enter credentials
4. Submit

**Expected Results:**
- ✅ Successfully logged in
- ✅ Redirected to home page
- ✅ User avatar and name displayed
- ✅ Token contains course claims

**Test Data:**
- Email: `student@test.com`
- Password: `Test123!@#`

---

#### 1.3 Admin Access
**Steps:**
1. Login as admin user
2. Navigate to `/admin`
3. Verify admin dashboard loads

**Expected Results:**
- ✅ Admin dashboard accessible
- ✅ Course management visible
- ✅ Student enrollment visible
- ✅ Course Builder link visible

**Test Data:**
- Email: `admin@test.com`
- Password: `Admin123!@#`

---

#### 1.4 Non-Admin Access Restriction
**Steps:**
1. Login as regular user
2. Try to access `/admin`
3. Try to access `/course-builder`

**Expected Results:**
- ✅ Access denied or redirected
- ✅ Error message displayed
- ✅ No admin features visible

---

### 2. Course Builder - Basic Course Creation

#### 2.1 Create New Course
**Steps:**
1. Login as admin
2. Navigate to `/course-builder`
3. Fill in Course Basics:
   - Title: "Test Course 101"
   - Subtitle: "Learn testing fundamentals"
   - Course ID: "test-course-101"
   - Category: "Development"
   - Level: "Beginner"
   - Language: "English"
4. Click "Save Course"

**Expected Results:**
- ✅ Course saved to localStorage
- ✅ Success message displayed
- ✅ Course appears in admin catalog
- ✅ Auto-save indicator shows "Saved"

---

#### 2.2 Upload Course Thumbnail
**Steps:**
1. In Course Basics panel
2. Click thumbnail upload area
3. Select image file OR
4. Take screenshot (Win+Shift+S)
5. Click upload area
6. Press Ctrl+V

**Expected Results:**
- ✅ File picker opens on click
- ✅ Image preview displays immediately
- ✅ Pasted screenshot appears
- ✅ Console logs show "Image pasted successfully"
- ✅ Thumbnail saved with course

**Test Data:**
- Image: 1280x720px PNG/JPG
- Screenshot from clipboard

---

#### 2.3 Add Learning Objectives
**Steps:**
1. In Course Basics panel
2. Click "+ Add Objective"
3. Enter objective text
4. Add 3-5 objectives
5. Click remove button on one objective

**Expected Results:**
- ✅ New objective field appears
- ✅ Text saves on blur
- ✅ Objective removed successfully
- ✅ All objectives saved with course

---

#### 2.4 Add Course Description (Rich Text)
**Steps:**
1. In Course Basics panel
2. Click in description editor
3. Type content
4. Apply formatting (bold, italic, lists)
5. Add link
6. Save

**Expected Results:**
- ✅ Rich text editor loads
- ✅ Formatting toolbar visible
- ✅ Formatting applies correctly
- ✅ HTML content saved
- ✅ Content persists on reload

---

### 3. Curriculum Builder - Lessons

#### 3.1 Create Lesson
**Steps:**
1. Navigate to Curriculum panel
2. Click "+ Add Lesson"
3. Verify lesson card appears
4. Edit lesson title inline
5. Type "Introduction to Testing"

**Expected Results:**
- ✅ New lesson card created
- ✅ Lesson numbered automatically (1, 2, 3...)
- ✅ Lesson title editable inline
- ✅ Title saves on blur
- ✅ Lesson count updates in sidebar

**Console Check:**
```
Adding new lesson...
Lesson added: {id: "lesson-...", title: "Lesson 1", ...}
Lessons rendered: 1
```

---

#### 3.2 Edit Lesson
**Steps:**
1. Click "Edit" button on lesson card
2. Verify lesson modal opens
3. Update title: "Introduction to Testing"
4. Add description: "Learn the basics of testing"
5. Click "Save Lesson"

**Expected Results:**
- ✅ Modal opens with lesson details
- ✅ Title and description fields populated
- ✅ Changes save successfully
- ✅ Modal closes
- ✅ Lesson card updates

---

#### 3.3 Delete Lesson
**Steps:**
1. Click delete button (🗑️) on lesson
2. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Lesson removed from list
- ✅ Lesson count updates
- ✅ Auto-save triggered

---

### 4. Chapter Management

#### 4.1 Add Video Chapter
**Steps:**
1. Open lesson editor
2. Click "+ Add Chapter"
3. Chapter modal opens
4. Enter title: "Welcome Video"
5. Select type: "🎥 Video"
6. Enter URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
7. Set duration: 10 minutes
8. Click "Save Chapter"

**Expected Results:**
- ✅ Chapter modal opens
- ✅ Video fields visible
- ✅ Chapter saved to lesson
- ✅ Chapter appears in lesson editor
- ✅ Icon shows 🎥
- ✅ Duration displays correctly

**Console Check:**
```
Adding new chapter...
Chapter saved: {id: "chapter-...", type: "video", title: "Welcome Video", duration: 10}
```

---

#### 4.2 Add Text Chapter with Images
**Steps:**
1. Click "+ Add Chapter"
2. Enter title: "Testing Fundamentals"
3. Select type: "📄 Text/Article"
4. Write content in rich text editor
5. Take screenshot (Win+Shift+S)
6. Click image upload area below editor
7. Press Ctrl+V to paste
8. Verify image appears in editor
9. Add more text
10. Click "Save Chapter"

**Expected Results:**
- ✅ Text editor initializes
- ✅ Toolbar visible with formatting options
- ✅ Image upload area visible
- ✅ Paste event detected
- ✅ Image inserted into editor at cursor
- ✅ Multiple images supported
- ✅ Chapter saves with HTML content

**Console Check:**
```
Paste in text chapter image area
=== CHAPTER IMAGE PASTE ===
Clipboard items: 2
✓ Image found in clipboard
✓ Pasted image inserted into editor
Chapter saved: {type: "text", content: {html: "...", readTime: 5}}
```

---

#### 4.3 Add Image Chapter
**Steps:**
1. Click "+ Add Chapter"
2. Enter title: "Architecture Diagram"
3. Select type: "🖼️ Image"
4. Click image upload area
5. Paste screenshot (Ctrl+V)
6. Add caption: "System architecture overview"
7. Click "Save Chapter"

**Expected Results:**
- ✅ Image upload area visible
- ✅ Screenshot pastes successfully
- ✅ Image preview displays
- ✅ Caption field saves
- ✅ Chapter saved with image data

---

#### 4.4 Add Code Chapter
**Steps:**
1. Click "+ Add Chapter"
2. Enter title: "Hello World Example"
3. Select type: "💻 Code"
4. Select language: "Python"
5. Enter code:
```python
def hello():
    print("Hello, World!")
```
6. Set duration: 2 minutes
7. Click "Save Chapter"

**Expected Results:**
- ✅ Code textarea visible
- ✅ Monospace font applied
- ✅ Language selector works
- ✅ Code saves correctly
- ✅ Chapter displays with 💻 icon

---

#### 4.5 Edit Chapter
**Steps:**
1. Click edit button (✏️) on existing chapter
2. Modify title
3. Update content
4. Click "Save Chapter"

**Expected Results:**
- ✅ Modal opens with existing data
- ✅ All fields populated correctly
- ✅ Changes save
- ✅ Chapter list updates

---

#### 4.6 Delete Chapter
**Steps:**
1. Click delete button (🗑️) on chapter
2. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Chapter removed
- ✅ Lesson duration recalculates
- ✅ Chapter count updates

---

### 5. Complete Course Workflow

#### 5.1 Build Complete Course
**Steps:**
1. Create course with all basic info
2. Upload thumbnail
3. Add 3 learning objectives
4. Create Lesson 1 with:
   - 1 video chapter
   - 1 text chapter with images
   - 1 quiz chapter
5. Create Lesson 2 with:
   - 1 text chapter
   - 1 code chapter
   - 1 image chapter
6. Set pricing (Free)
7. Enable certificate
8. Enable discussions
9. Save course

**Expected Results:**
- ✅ All components save correctly
- ✅ Total duration calculated
- ✅ Lesson count: 2
- ✅ Chapter count: 6
- ✅ Course appears in catalog
- ✅ Preview shows all content

---

### 6. Auto-Save & Persistence

#### 6.1 Auto-Save Functionality
**Steps:**
1. Start creating course
2. Add title
3. Wait 2 seconds
4. Check localStorage
5. Refresh page
6. Verify data persists

**Expected Results:**
- ✅ Auto-save triggers after changes
- ✅ Console shows "Course auto-saved"
- ✅ Data in localStorage
- ✅ Data restored on refresh

**Console Check:**
```
Course auto-saved
Draft course loaded: {title: "...", lessons: [...]}
```

---

#### 6.2 Draft Recovery
**Steps:**
1. Create course partially
2. Close browser
3. Reopen and navigate to course builder
4. Verify draft loads

**Expected Results:**
- ✅ Draft detected
- ✅ All fields populated
- ✅ Lessons restored
- ✅ Chapters restored

---

### 7. Admin Dashboard

#### 7.1 View Course Catalog
**Steps:**
1. Login as admin
2. Navigate to `/admin`
3. View course list

**Expected Results:**
- ✅ All courses displayed
- ✅ Course cards show title, ID, category
- ✅ Edit/Delete buttons visible

---

#### 7.2 Grant Course to Student
**Steps:**
1. In admin dashboard
2. Enter student email
3. Select course from dropdown
4. Click "Grant Access"

**Expected Results:**
- ✅ Success message
- ✅ Course added to user's app_metadata
- ✅ Student can see course in "My Courses"

---

### 8. Student Experience

#### 8.1 View My Courses
**Steps:**
1. Login as student
2. Navigate to `/my-courses`
3. View enrolled courses

**Expected Results:**
- ✅ Courses from token claims displayed
- ✅ Course cards clickable
- ✅ Progress tracking visible (if implemented)

---

### 9. Error Handling

#### 9.1 Missing Required Fields
**Steps:**
1. Try to save course without title
2. Try to save lesson without title
3. Try to save chapter without title

**Expected Results:**
- ✅ Validation error shown
- ✅ Alert message displayed
- ✅ Save prevented
- ✅ Field highlighted

---

#### 9.2 Network Errors
**Steps:**
1. Disconnect internet
2. Try to save course
3. Reconnect
4. Try again

**Expected Results:**
- ✅ Error message shown
- ✅ Data saved locally
- ✅ Retry successful when online

---

## Browser Compatibility Testing

### Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Features to verify:
- Paste functionality (Ctrl+V / Cmd+V)
- File upload
- Rich text editor
- Modal dialogs
- Auto-save
- LocalStorage

---

## Performance Testing

### Metrics to Check:
- Page load time < 3 seconds
- Image upload < 2 seconds
- Auto-save latency < 1 second
- Modal open animation smooth (60fps)
- No memory leaks after 30 minutes

---

## Accessibility Testing

### Checklist:
- ✅ Keyboard navigation works
- ✅ Tab order logical
- ✅ Focus indicators visible
- ✅ Screen reader compatible
- ✅ Color contrast meets WCAG AA
- ✅ Alt text on images

---

## Mobile Responsiveness

### Test on:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad)

### Features:
- ✅ Layout adapts
- ✅ Touch targets adequate (44px min)
- ✅ Modals full-screen on mobile
- ✅ Image upload works
- ✅ Text editor usable

---

## Known Issues & Debugging

### Common Issues:

#### Issue 1: Paste Not Working
**Symptoms:** Ctrl+V does nothing
**Debug Steps:**
1. Open browser console (F12)
2. Look for paste event logs
3. Check if upload area is focused
4. Verify clipboard permissions

**Expected Console Output:**
```
Paste event detected on thumbnail
=== PASTE EVENT HANDLER ===
Clipboard items: 2
✓ Image found in clipboard
✓ Image pasted and displayed successfully!
```

**Fix:** Click upload area first, then paste

---

#### Issue 2: Chapter Editor Not Opening
**Symptoms:** Modal doesn't appear
**Debug Steps:**
1. Check console for errors
2. Verify Quill.js loaded
3. Check modal element exists

**Expected Console Output:**
```
Adding new chapter...
Chapter text editor initialized
```

---

#### Issue 3: Auto-Save Not Working
**Symptoms:** Changes lost on refresh
**Debug Steps:**
1. Check localStorage in DevTools
2. Look for "Course auto-saved" in console
3. Verify no errors blocking save

**Fix:** Check browser localStorage quota

---

## Test Execution Checklist

### Pre-Test:
- [ ] Clear browser cache
- [ ] Clear localStorage
- [ ] Login with test account
- [ ] Open browser console

### During Test:
- [ ] Follow steps exactly
- [ ] Note any deviations
- [ ] Screenshot errors
- [ ] Copy console logs

### Post-Test:
- [ ] Document results
- [ ] Report bugs
- [ ] Verify fixes
- [ ] Regression test

---

## Bug Report Template

```markdown
**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**


**Actual Result:**


**Console Logs:**
```
[paste logs here]
```

**Screenshots:**
[attach screenshots]

**Environment:**
- Browser: 
- OS: 
- User: 
```

---

## Success Criteria

### Must Pass:
- ✅ All authentication flows work
- ✅ Course creation saves correctly
- ✅ Lessons and chapters CRUD operations work
- ✅ Image paste/upload works in all contexts
- ✅ Auto-save prevents data loss
- ✅ Admin features restricted to admins
- ✅ No console errors on happy path

### Nice to Have:
- ✅ Smooth animations
- ✅ Fast load times
- ✅ Mobile responsive
- ✅ Accessible

---

## Test Schedule

### Phase 1: Core Functionality (Week 1)
- Authentication
- Course creation
- Lesson management

### Phase 2: Advanced Features (Week 2)
- Chapter management
- Image upload/paste
- Rich text editing

### Phase 3: Integration (Week 3)
- Admin dashboard
- Student experience
- End-to-end workflows

### Phase 4: Polish (Week 4)
- Performance
- Accessibility
- Cross-browser
- Mobile

---

## Automated Testing (Future)

### Recommended Tools:
- **E2E:** Playwright / Cypress
- **Unit:** Jest
- **Visual:** Percy / Chromatic

### Test Coverage Goals:
- E2E: 80%
- Unit: 90%
- Integration: 85%

---

## Contact

**QA Lead:** [Your Name]
**Dev Lead:** [Dev Name]
**Report Issues:** [Issue Tracker URL]

---

**Last Updated:** 2026-04-27
**Version:** 1.0
