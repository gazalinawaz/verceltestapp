// Test Suite 5: Auto-Save & Persistence
const { test, expect } = require('@playwright/test');

test.describe('Auto-Save & Persistence', () => {
  
  test('5.1 Auto-Save Functionality', async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Monitor console for auto-save
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    // Make a change
    await page.fill('#courseTitle', 'Auto-Save Test Course');
    
    // Wait for auto-save (triggers after 1 second)
    await page.waitForTimeout(2000);
    
    // Verify auto-save log
    const hasSaveLog = consoleLogs.some(log => log.includes('Course auto-saved'));
    expect(hasSaveLog).toBe(true);
    
    // Verify localStorage
    const courseData = await page.evaluate(() => {
      return localStorage.getItem('courseDraft');
    });
    
    expect(courseData).toBeTruthy();
    const course = JSON.parse(courseData);
    expect(course.title).toBe('Auto-Save Test Course');
  });

  test('5.2 Draft Recovery After Refresh', async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Create course data
    await page.fill('#courseTitle', 'Persistent Course');
    await page.fill('#courseId', 'persistent-101');
    
    // Wait for auto-save
    await page.waitForTimeout(2000);
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify data restored
    const titleValue = await page.inputValue('#courseTitle');
    const idValue = await page.inputValue('#courseId');
    
    expect(titleValue).toBe('Persistent Course');
    expect(idValue).toBe('persistent-101');
  });

  test('5.3 Lesson Persistence', async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Create lesson
    await page.click('text=Curriculum');
    await page.waitForTimeout(500);
    await page.click('button:has-text("+ Add Lesson")');
    await page.waitForTimeout(1000);
    
    // Edit lesson title
    await page.fill('.lesson-title-input', 'Persistent Lesson');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(2000);
    
    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.click('text=Curriculum');
    await page.waitForTimeout(500);
    
    // Verify lesson restored
    const lessonTitle = await page.locator('.lesson-title-input').first().inputValue();
    expect(lessonTitle).toBe('Persistent Lesson');
  });

  test('5.4 Chapter Persistence', async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Create lesson and chapter
    await page.click('text=Curriculum');
    await page.waitForTimeout(500);
    await page.click('button:has-text("+ Add Lesson")');
    await page.waitForTimeout(1000);
    await page.click('.lesson-card button:has-text("Edit")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("+ Add Chapter")');
    await page.waitForSelector('#chapterModal.active');
    
    // Fill chapter
    await page.fill('#chapterTitle', 'Persistent Chapter');
    await page.selectOption('#chapterType', 'video');
    await page.fill('#chapterDuration', '15');
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(2000);
    
    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.click('text=Curriculum');
    await page.waitForTimeout(500);
    await page.click('.lesson-card button:has-text("Edit")');
    await page.waitForTimeout(500);
    
    // Verify chapter restored
    await expect(page.locator('.chapter-item')).toContainText('Persistent Chapter');
    await expect(page.locator('.chapter-item')).toContainText('15 min');
  });

  test('5.5 Clear Draft', async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Create some data
    await page.fill('#courseTitle', 'To Be Cleared');
    await page.waitForTimeout(2000);
    
    // Clear localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify empty
    const titleValue = await page.inputValue('#courseTitle');
    expect(titleValue).toBe('');
  });
});
