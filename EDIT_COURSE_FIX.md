# Edit Course & Add Lesson Fix

## Problem
User reported: "I cannot modify a course and add a lesson further"

## Root Causes Found

### 1. Edit Course Function Broken
**File:** `admin.js` - `editCourse()` function
**Issue:** Only populated admin form fields, didn't redirect to course builder
**Impact:** Clicking "Edit" on a course did nothing useful

### 2. Wrong HTML Elements
**File:** `course-builder.html`
**Issue:** Had "Add Section" button instead of "Add Lesson"
**Impact:** No way to add lessons from UI

### 3. Missing Modal Functions
**File:** `course-builder.js`
**Issue:** `openLessonModal()` and `closeLessonModal()` functions missing
**Impact:** Lesson modal wouldn't open/close properly

## Fixes Applied

### ✅ Fix 1: Rewrote editCourse() Function
**File:** `admin.js`

**Before:**
```javascript
function editCourse(courseId) {
    // Just populated form fields
    // Switched to create tab (wrong!)
}
```

**After:**
```javascript
function editCourse(courseId) {
    // 1. Find course in catalog
    // 2. Create full course draft with proper structure
    // 3. Save to localStorage as 'courseDraft'
    // 4. Redirect to /course-builder
}
```

**New Helper Function:**
```javascript
function createCourseDraftFromCatalog(catalogCourse) {
    return {
        id, title, subtitle, description,
        category, objectives, thumbnail,
        level, language, icon,
        lessons: [], // Empty, will be populated in builder
        pricing, settings
    };
}
```

### ✅ Fix 2: Updated HTML
**File:** `course-builder.html`

**Changed:**
- Button: `onclick="addSection()"` → `onclick="addLesson()"`
- Text: "Add Section" → "Add Lesson"
- Container: `sectionsContainer` → `lessonsContainer`
- Description: "sections and lessons" → "lessons and chapters"

### ⚠️ Fix 3: Missing Modal Functions (NEED TO ADD)
**File:** `course-builder.js`

**Missing functions:**
```javascript
window.closeLessonModal = function() {
    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.remove('active');
        currentLessonId = null;
    }
}
```

## Testing Steps

1. **Go to `/admin`**
2. **Find a course in catalog**
3. **Click "Edit" button**
4. **Expected:** Redirects to `/course-builder` with course loaded
5. **Click "+ Add Lesson"**
6. **Expected:** Lesson added to list
7. **Click lesson to edit**
8. **Expected:** Modal opens with lesson details
9. **Add chapters**
10. **Save course**

## Status
- ✅ editCourse() fixed
- ✅ HTML updated
- ⚠️ Need to add closeLessonModal() function
- ⚠️ Need to verify lesson modal opens correctly
