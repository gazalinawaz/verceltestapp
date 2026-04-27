# Course Builder - Debugging Guide

## Quick Debugging Checklist

### 🔍 When Features Don't Work

#### 1. Open Browser Console (F12)
**Always check console first!** Look for:
- ✅ "Course Builder initializing..."
- ✅ "Course Builder ready"
- ✅ "Setting up event listeners..."
- ❌ Any red errors

---

#### 2. Check What's Not Working

##### **Paste Not Working?**
```
Expected Console Output:
✓ Thumbnail area clicked
✓ Thumbnail area focused
✓ Paste event detected
✓ Image pasted successfully

If Missing:
1. Click upload area first (should highlight blue)
2. Then press Ctrl+V
3. Check clipboard has image (not file path)
```

##### **Add Lesson Not Working?**
```
Expected Console Output:
✓ Adding new lesson...
✓ Lesson added: {id: "...", ...}
✓ Lessons rendered: 1

If Missing:
1. Check console for "addLesson is not defined"
2. Refresh page
3. Clear cache (Ctrl+Shift+R)
```

##### **Add Chapter Not Working?**
```
Expected Console Output:
✓ Adding new chapter...
✓ Chapter text editor initialized

If Missing:
1. Make sure you're inside a lesson editor
2. Check Quill.js loaded (look for toolbar)
3. Refresh and try again
```

##### **Image Paste in Text Chapter Not Working?**
```
Expected Console Output:
✓ Paste in text chapter image area
✓ Image found in clipboard
✓ Pasted image inserted into editor

If Missing:
1. Click the image upload area below editor
2. Make sure it's focused (blue border)
3. Press Ctrl+V
4. Check you have image in clipboard (not text)
```

---

## Common Errors & Fixes

### Error: "Cannot read property 'lessons' of undefined"
**Cause:** Course data not initialized
**Fix:** Refresh page, check localStorage

### Error: "Quill is not defined"
**Cause:** Quill.js CDN not loaded
**Fix:** Check internet connection, refresh page

### Error: "addLesson is not a function"
**Cause:** JavaScript not loaded or cached old version
**Fix:** Hard refresh (Ctrl+Shift+R)

### Error: No console logs at all
**Cause:** JavaScript file not loading
**Fix:** Check Network tab, verify course-builder.js loads

---

## Step-by-Step Testing

### Test 1: Basic Page Load
1. Navigate to `/course-builder`
2. Open console
3. Look for: "Course Builder ready"
4. Look for: "Thumbnail upload element: <div>"

**If fails:** JavaScript not loading

---

### Test 2: Thumbnail Paste
1. Take screenshot (Win+Shift+S)
2. Click thumbnail area (should turn blue)
3. Press Ctrl+V
4. Look for console logs
5. Image should appear

**If fails:** Check focus state, clipboard contents

---

### Test 3: Create Lesson
1. Click "Curriculum" in sidebar
2. Click "+ Add Lesson"
3. Check console for "Lesson added"
4. Lesson card should appear

**If fails:** Check onclick handler, refresh page

---

### Test 4: Create Chapter
1. Click "Edit" on a lesson
2. Click "+ Add Chapter"
3. Modal should open
4. Check console for "Adding new chapter"

**If fails:** Check modal element exists

---

### Test 5: Text Chapter Image Paste
1. In chapter modal, select "Text/Article"
2. Scroll to image upload area
3. Click it (should focus)
4. Paste screenshot
5. Check console logs
6. Image should insert into editor

**If fails:** Check editor initialized, focus state

---

## Browser DevTools Tips

### Check LocalStorage
```
1. F12 → Application tab
2. Storage → Local Storage
3. Look for "courseDraft"
4. Should see course JSON
```

### Check Network
```
1. F12 → Network tab
2. Refresh page
3. Look for:
   - course-builder.js (200 OK)
   - quill.js (200 OK)
   - course-builder-enhanced.css (200 OK)
```

### Check Elements
```
1. F12 → Elements tab
2. Find #thumbnailUpload
3. Should have tabindex="0"
4. Should have paste event listener
```

---

## Manual Function Testing

### Test in Console:
```javascript
// Test if functions exist
typeof window.addLesson // should be "function"
typeof window.addChapter // should be "function"
typeof window.saveCourse // should be "function"

// Test add lesson manually
window.addLesson()

// Check current course
console.log(currentCourse)

// Check lessons
console.log(currentCourse.lessons)
```

---

## Reset Everything

### If All Else Fails:
```
1. Clear localStorage:
   localStorage.clear()

2. Hard refresh:
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)

3. Clear cache:
   F12 → Network → Disable cache checkbox
   
4. Logout and login again

5. Try incognito/private window
```

---

## Report Issues

### Include:
1. **Console logs** (copy all)
2. **Screenshot** of error
3. **Steps** to reproduce
4. **Browser** and version
5. **What you expected** vs **what happened**

### Example:
```
Browser: Chrome 120
Issue: Paste not working in thumbnail

Steps:
1. Clicked thumbnail area
2. Pressed Ctrl+V
3. Nothing happened

Console:
[paste console output here]

Expected: Image should appear
Actual: Nothing happens
```

---

## Quick Fixes

### Fix 1: Paste Not Working
```
1. Click upload area
2. Wait for blue border
3. Ctrl+V
4. If still fails, try clicking again
```

### Fix 2: Modal Not Closing
```
1. Press Escape key
2. Or refresh page
3. Data should be auto-saved
```

### Fix 3: Editor Not Loading
```
1. Check internet connection
2. Refresh page
3. Check console for Quill errors
```

---

## Performance Issues

### Page Slow?
1. Check number of images in course
2. Large images? Compress them
3. Too many chapters? Split into lessons
4. Clear old drafts from localStorage

### Auto-Save Slow?
1. Normal - saves every 1 second
2. Check console for "Course auto-saved"
3. If too frequent, increase timeout

---

## Contact Support

**Found a bug?** Create detailed report with:
- Console logs
- Screenshots  
- Steps to reproduce
- Expected vs actual behavior

**Need help?** Check E2E_TEST_PLAN.md for detailed workflows
