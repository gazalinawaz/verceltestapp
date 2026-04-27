const { test, expect } = require('@playwright/test');

/**
 * Complete Course Lifecycle Test
 * Tests the entire flow from course creation to deletion
 */

test.describe('Complete Course Lifecycle', () => {
    const testCourseId = 'test-course-' + Date.now();
    const testCourseTitle = 'Complete Test Course ' + Date.now();

    test.beforeEach(async ({ page }) => {
        // Clear localStorage before each test
        await page.goto('http://localhost:3000');
        await page.evaluate(() => {
            localStorage.clear();
        });
    });

    test('Full lifecycle: Create → Build → Edit → Delete', async ({ page }) => {
        console.log('🧪 Starting full lifecycle test...');

        // ========================================
        // PHASE 1: Create Course in Admin Panel
        // ========================================
        console.log('📝 Phase 1: Creating course in admin panel...');
        
        await page.goto('http://localhost:3000/admin');
        
        // Wait for admin page to load
        await page.waitForSelector('#createCourseForm', { timeout: 5000 });
        
        // Switch to Create Course tab
        await page.click('text=Create Course');
        await page.waitForTimeout(500);
        
        // Fill course details
        await page.fill('#courseTitle', testCourseTitle);
        await page.waitForTimeout(500); // Wait for auto-generated ID
        
        await page.fill('#courseIcon', '🧪');
        await page.fill('#courseDescription', 'This is a test course for automated testing');
        await page.selectOption('#courseLevel', 'Beginner');
        await page.fill('#courseDuration', '10');
        await page.fill('#courseLessons', '3');
        
        // Verify course ID was auto-generated
        const courseId = await page.inputValue('#courseId');
        console.log('🆔 Auto-generated course ID:', courseId);
        expect(courseId).toBeTruthy();
        expect(courseId).toContain('complete-test-course');
        
        // Submit form
        console.log('💾 Submitting course creation form...');
        await page.click('button[type="submit"]');
        
        // Wait for success alert and dismiss it
        page.on('dialog', async dialog => {
            console.log('✅ Alert:', dialog.message());
            await dialog.accept();
        });
        
        await page.waitForTimeout(2000);
        
        // Verify course appears in catalog
        await page.click('text=Course Catalog');
        await page.waitForTimeout(500);
        
        const courseCard = await page.locator('.course-card', { hasText: testCourseTitle });
        await expect(courseCard).toBeVisible();
        console.log('✅ Course appears in catalog');
        
        // Verify course URL exists
        const courseUrl = await page.locator(`a[href*="${courseId}"]`).first();
        await expect(courseUrl).toBeVisible();
        console.log('✅ Course URL created');
        
        // ========================================
        // PHASE 2: Build Course Curriculum
        // ========================================
        console.log('📚 Phase 2: Building course curriculum...');
        
        await page.goto('http://localhost:3000/course-builder');
        await page.waitForSelector('#courseId', { timeout: 5000 });
        
        // Fill basic course info
        await page.fill('#courseId', courseId);
        await page.fill('#courseTitle', testCourseTitle);
        await page.fill('#courseSubtitle', 'Automated test subtitle');
        await page.selectOption('#courseCategory', 'development');
        await page.selectOption('#courseLevel', 'Beginner');
        
        console.log('✅ Basic info filled');
        
        // Add learning objectives
        await page.click('text=Add Objective');
        await page.fill('#learningObjectives input:last-of-type', 'Learn automated testing');
        await page.click('text=Add Objective');
        await page.fill('#learningObjectives input:last-of-type', 'Master course creation');
        
        console.log('✅ Learning objectives added');
        
        // ========================================
        // PHASE 3: Add Lessons
        // ========================================
        console.log('📖 Phase 3: Adding lessons...');
        
        // Add Lesson 1
        await page.click('text=Add Lesson');
        await page.waitForSelector('#lessonModal.active', { timeout: 2000 });
        
        await page.fill('#lessonTitle', 'Introduction to Testing');
        await page.fill('#lessonDescription', 'Learn the basics of automated testing');
        await page.fill('#lessonDuration', '15');
        
        await page.click('#lessonModal button:has-text("Save")');
        await page.waitForTimeout(1000);
        
        console.log('✅ Lesson 1 added');
        
        // Add Lesson 2
        await page.click('text=Add Lesson');
        await page.waitForSelector('#lessonModal.active', { timeout: 2000 });
        
        await page.fill('#lessonTitle', 'Advanced Testing Techniques');
        await page.fill('#lessonDescription', 'Deep dive into testing strategies');
        await page.fill('#lessonDuration', '30');
        
        await page.click('#lessonModal button:has-text("Save")');
        await page.waitForTimeout(1000);
        
        console.log('✅ Lesson 2 added');
        
        // Verify lessons appear in UI
        const lesson1 = await page.locator('text=Introduction to Testing');
        await expect(lesson1).toBeVisible();
        
        const lesson2 = await page.locator('text=Advanced Testing Techniques');
        await expect(lesson2).toBeVisible();
        
        // Verify lesson count in sidebar
        const lessonCount = await page.textContent('#lessonCount');
        expect(lessonCount).toContain('2 lessons');
        console.log('✅ Lesson count updated:', lessonCount);
        
        // ========================================
        // PHASE 4: Add Chapters
        // ========================================
        console.log('📑 Phase 4: Adding chapters...');
        
        // Find first lesson's "Add Chapter" button
        const firstLessonCard = await page.locator('.lesson-card').first();
        await firstLessonCard.locator('text=Add Chapter').click();
        await page.waitForSelector('#chapterModal.active', { timeout: 2000 });
        
        // Add video chapter
        await page.selectOption('#chapterType', 'video');
        await page.fill('#chapterTitle', 'Introduction Video');
        await page.fill('#chapterVideoUrl', 'https://www.youtube.com/watch?v=test123');
        await page.fill('#chapterDuration', '10');
        
        await page.click('#chapterModal button:has-text("Save")');
        await page.waitForTimeout(1000);
        
        console.log('✅ Video chapter added');
        
        // Add text chapter
        await firstLessonCard.locator('text=Add Chapter').click();
        await page.waitForSelector('#chapterModal.active', { timeout: 2000 });
        
        await page.selectOption('#chapterType', 'text');
        await page.fill('#chapterTitle', 'Testing Fundamentals');
        
        // Add content to rich text editor
        const editorContent = 'This is the chapter content about testing fundamentals.';
        await page.evaluate((content) => {
            const editor = document.querySelector('#chapterTextEditor .ql-editor');
            if (editor) {
                editor.innerHTML = `<p>${content}</p>`;
            }
        }, editorContent);
        
        await page.fill('#chapterDuration', '5');
        await page.click('#chapterModal button:has-text("Save")');
        await page.waitForTimeout(1000);
        
        console.log('✅ Text chapter added');
        
        // Verify chapters appear
        const videoChapter = await page.locator('text=Introduction Video');
        await expect(videoChapter).toBeVisible();
        
        const textChapter = await page.locator('text=Testing Fundamentals');
        await expect(textChapter).toBeVisible();
        
        // ========================================
        // PHASE 5: Save Course
        // ========================================
        console.log('💾 Phase 5: Saving course...');
        
        await page.click('text=Save Course');
        await page.waitForTimeout(2000);
        
        // Verify save in localStorage
        const savedCourse = await page.evaluate(() => {
            const draft = localStorage.getItem('courseDraft');
            return draft ? JSON.parse(draft) : null;
        });
        
        expect(savedCourse).toBeTruthy();
        expect(savedCourse.title).toBe(testCourseTitle);
        expect(savedCourse.lessons).toHaveLength(2);
        console.log('✅ Course saved to localStorage');
        console.log('📊 Lessons:', savedCourse.lessons.length);
        console.log('📑 Chapters in lesson 1:', savedCourse.lessons[0].chapters?.length || 0);
        
        // Verify in catalog
        const catalog = await page.evaluate(() => {
            const catalogData = localStorage.getItem('coursesCatalog');
            return catalogData ? JSON.parse(catalogData) : [];
        });
        
        const catalogCourse = catalog.find(c => c.id === courseId);
        expect(catalogCourse).toBeTruthy();
        console.log('✅ Course added to catalog');
        
        // ========================================
        // PHASE 6: Verify Persistence
        // ========================================
        console.log('🔄 Phase 6: Testing persistence...');
        
        await page.reload();
        await page.waitForTimeout(2000);
        
        // Verify data loads back
        const reloadedTitle = await page.inputValue('#courseTitle');
        expect(reloadedTitle).toBe(testCourseTitle);
        
        const reloadedLessons = await page.locator('.lesson-card').count();
        expect(reloadedLessons).toBe(2);
        
        console.log('✅ Data persists after reload');
        
        // ========================================
        // PHASE 7: Edit Course
        // ========================================
        console.log('✏️ Phase 7: Editing course...');
        
        // Add another lesson
        await page.click('text=Add Lesson');
        await page.waitForSelector('#lessonModal.active', { timeout: 2000 });
        
        await page.fill('#lessonTitle', 'Testing Best Practices');
        await page.fill('#lessonDescription', 'Learn industry best practices');
        await page.fill('#lessonDuration', '20');
        
        await page.click('#lessonModal button:has-text("Save")');
        await page.waitForTimeout(1000);
        
        // Verify 3 lessons now
        const updatedLessonCount = await page.locator('.lesson-card').count();
        expect(updatedLessonCount).toBe(3);
        
        console.log('✅ Course edited - 3 lessons now');
        
        // ========================================
        // PHASE 8: Test Deletion
        // ========================================
        console.log('🗑️ Phase 8: Testing deletion...');
        
        // Delete a chapter
        const deleteChapterBtn = await page.locator('.btn-icon[title="Delete"]').first();
        
        page.once('dialog', async dialog => {
            console.log('Confirm delete chapter:', dialog.message());
            await dialog.accept();
        });
        
        await deleteChapterBtn.click();
        await page.waitForTimeout(1000);
        
        console.log('✅ Chapter deleted');
        
        // Delete a lesson
        const deleteLessonBtn = await page.locator('.lesson-card').last().locator('text=🗑️');
        
        page.once('dialog', async dialog => {
            console.log('Confirm delete lesson:', dialog.message());
            await dialog.accept();
        });
        
        await deleteLessonBtn.click();
        await page.waitForTimeout(1000);
        
        // Verify 2 lessons remain
        const remainingLessons = await page.locator('.lesson-card').count();
        expect(remainingLessons).toBe(2);
        
        console.log('✅ Lesson deleted - 2 lessons remain');
        
        // Save after deletion
        await page.click('text=Save Course');
        await page.waitForTimeout(2000);
        
        // ========================================
        // PHASE 9: Delete Course from Admin
        // ========================================
        console.log('🗑️ Phase 9: Deleting course from admin...');
        
        await page.goto('http://localhost:3000/admin');
        await page.waitForTimeout(1000);
        
        // Go to catalog
        await page.click('text=Course Catalog');
        await page.waitForTimeout(500);
        
        // Find and delete the test course
        const courseToDelete = await page.locator('.course-card', { hasText: testCourseTitle });
        
        page.once('dialog', async dialog => {
            console.log('Confirm delete course:', dialog.message());
            await dialog.accept();
        });
        
        await courseToDelete.locator('text=Delete').click();
        await page.waitForTimeout(1000);
        
        // Verify course is gone
        const deletedCourse = await page.locator('.course-card', { hasText: testCourseTitle }).count();
        expect(deletedCourse).toBe(0);
        
        console.log('✅ Course deleted from catalog');
        
        // Verify removed from localStorage
        const finalCatalog = await page.evaluate(() => {
            const catalogData = localStorage.getItem('coursesCatalog');
            return catalogData ? JSON.parse(catalogData) : [];
        });
        
        const stillExists = finalCatalog.find(c => c.id === courseId);
        expect(stillExists).toBeUndefined();
        
        console.log('✅ Course removed from localStorage');
        
        // ========================================
        // PHASE 10: Verify Course URL 404s
        // ========================================
        console.log('🔍 Phase 10: Verifying deleted course...');
        
        await page.goto(`http://localhost:3000/course.html?id=${courseId}`);
        await page.waitForTimeout(1000);
        
        const notFoundText = await page.locator('text=Course Not Found').count();
        expect(notFoundText).toBeGreaterThan(0);
        
        console.log('✅ Deleted course shows "Not Found"');
        
        console.log('🎉 FULL LIFECYCLE TEST COMPLETED SUCCESSFULLY!');
    });

    test('Test course with no lessons', async ({ page }) => {
        console.log('🧪 Testing course with no lessons...');
        
        await page.goto('http://localhost:3000/course-builder');
        await page.waitForSelector('#courseId', { timeout: 5000 });
        
        // Fill minimal info
        await page.fill('#courseId', 'empty-course-test');
        await page.fill('#courseTitle', 'Empty Course Test');
        
        // Try to save without lessons
        await page.click('text=Save Course');
        await page.waitForTimeout(2000);
        
        // Should still save (0 lessons is valid)
        const savedCourse = await page.evaluate(() => {
            const draft = localStorage.getItem('courseDraft');
            return draft ? JSON.parse(draft) : null;
        });
        
        expect(savedCourse).toBeTruthy();
        expect(savedCourse.lessons).toHaveLength(0);
        
        console.log('✅ Course with 0 lessons saves correctly');
    });

    test('Test duplicate course ID prevention', async ({ page }) => {
        console.log('🧪 Testing duplicate course ID prevention...');
        
        await page.goto('http://localhost:3000/admin');
        await page.waitForSelector('#createCourseForm', { timeout: 5000 });
        
        // Create first course
        await page.click('text=Create Course');
        await page.fill('#courseTitle', 'Duplicate Test Course');
        await page.fill('#courseIcon', '🔁');
        await page.fill('#courseDescription', 'First course');
        await page.selectOption('#courseLevel', 'Beginner');
        await page.fill('#courseDuration', '5');
        await page.fill('#courseLessons', '1');
        
        const firstCourseId = await page.inputValue('#courseId');
        
        page.once('dialog', async dialog => await dialog.accept());
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
        
        // Try to create duplicate
        await page.click('text=Create Course');
        await page.fill('#courseTitle', 'Duplicate Test Course');
        await page.fill('#courseIcon', '🔁');
        await page.fill('#courseDescription', 'Duplicate attempt');
        await page.selectOption('#courseLevel', 'Beginner');
        await page.fill('#courseDuration', '5');
        await page.fill('#courseLessons', '1');
        
        let duplicateAlert = false;
        page.once('dialog', async dialog => {
            if (dialog.message().includes('already exists')) {
                duplicateAlert = true;
            }
            await dialog.accept();
        });
        
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);
        
        expect(duplicateAlert).toBe(true);
        console.log('✅ Duplicate course ID prevented');
    });
});
