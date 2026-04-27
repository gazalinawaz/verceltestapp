# Test Course Creation - Manual Testing Guide

## Test Case: Create Sample Course

### Prerequisites
1. Navigate to `/admin` page
2. Ensure you're logged in as admin
3. Open browser console (F12) to see debug logs

### Test Steps

#### Step 1: Fill Course Details
1. Click "Create Course" tab
2. Fill in the following:
   - **Course Title**: "JavaScript Fundamentals 2024"
   - **Course Icon**: 🚀
   - **Description**: "Learn JavaScript from scratch with hands-on projects"
   - **Level**: Beginner
   - **Duration**: 10 hours
   - **Number of Lessons**: 15

#### Step 2: Verify Auto-Generated ID
- As you type the title, watch the Course ID field
- Expected: `javascript-fundamentals-2024`
- Should appear in blue bold text

#### Step 3: Submit Form
1. Click "Create Course" button
2. Watch console for logs
3. Expected console output:
   ```
   Course data: {id: "javascript-fundamentals-2024", title: "JavaScript Fundamentals 2024", ...}
   Saving to localStorage...
   Attempting to save to backend...
   ```

#### Step 4: Verify Save
1. Check localStorage:
   - Open Console (F12)
   - Type: `localStorage.getItem('coursesCatalog')`
   - Should see array with your course
2. Check catalog:
   - Click "Course Catalog" tab
   - Should see your new course listed

#### Step 5: Verify Course URL
1. In catalog, find your course
2. Click "View" button
3. Should open: `/course.html?id=javascript-fundamentals-2024`
4. Verify course details display correctly

### Expected Results
✅ Course ID auto-generates as you type title
✅ Form submits without errors
✅ Success message appears
✅ Course appears in catalog
✅ Course URL works
✅ Course data persists in localStorage

### Common Issues

**Issue 1: Form doesn't submit**
- Check console for errors
- Verify all required fields are filled
- Check if submit button is clickable

**Issue 2: Course doesn't appear in catalog**
- Check localStorage: `localStorage.getItem('coursesCatalog')`
- Verify `loadCourses()` function is called
- Check if `coursesList` element exists

**Issue 3: Auto-generated ID not showing**
- Verify title field has input event listener
- Check console for `updateCourseIdPreview` logs
- Ensure `generateCourseId` function exists

### Debug Commands

```javascript
// Check if course was saved
JSON.parse(localStorage.getItem('coursesCatalog'))

// Manually trigger course load
loadCourses()

// Check form element
document.getElementById('createCourseForm')

// Check submit handler
console.log('Form has submit listener:', !!document.getElementById('createCourseForm').onsubmit)

// Clear all courses (reset)
localStorage.removeItem('coursesCatalog')
location.reload()
```

### Test Results
- [ ] Course ID auto-generates
- [ ] Form submits successfully
- [ ] Success alert appears
- [ ] Course appears in catalog
- [ ] Course URL opens correctly
- [ ] Data persists after refresh
