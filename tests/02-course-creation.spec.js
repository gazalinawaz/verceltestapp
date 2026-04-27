// Test Suite 2: Course Creation
const { test, expect } = require('@playwright/test');

test.describe('Course Builder - Basic Course Creation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to course builder
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
  });

  test('2.1 Create New Course', async ({ page }) => {
    // Wait for page to initialize
    await page.waitForSelector('#courseTitle');
    
    // Fill in course basics
    await page.fill('#courseTitle', 'Test Course 101');
    await page.fill('#courseSubtitle', 'Learn testing fundamentals');
    await page.fill('#courseId', 'test-course-101');
    
    // Select category
    await page.selectOption('#courseCategory', 'development');
    
    // Select level
    await page.selectOption('#courseLevel', 'Beginner');
    
    // Select language
    await page.selectOption('#courseLanguage', 'English');
    
    // Check console for auto-save
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    // Wait a bit for auto-save
    await page.waitForTimeout(2000);
    
    // Verify auto-save happened
    const hasSaveLog = consoleLogs.some(log => log.includes('Course auto-saved'));
    expect(hasSaveLog).toBe(true);
    
    // Verify data in localStorage
    const courseData = await page.evaluate(() => {
      return localStorage.getItem('courseDraft');
    });
    
    expect(courseData).toBeTruthy();
    const course = JSON.parse(courseData);
    expect(course.title).toBe('Test Course 101');
    expect(course.id).toBe('test-course-101');
  });

  test('2.2 Upload Course Thumbnail - Click', async ({ page }) => {
    // Click thumbnail upload area
    await page.click('#thumbnailUpload');
    
    // Verify it's focused
    const isFocused = await page.evaluate(() => {
      return document.activeElement.id === 'thumbnailUpload';
    });
    
    expect(isFocused).toBe(true);
    
    // Note: Actual file upload requires file input interaction
    // This tests the click handler
  });

  test('2.3 Add Learning Objectives', async ({ page }) => {
    // Find first objective input
    const firstObjective = page.locator('.objective-item input').first();
    await firstObjective.fill('Master Python fundamentals');
    
    // Click add objective button
    await page.click('text=+ Add Objective');
    
    // Verify new objective field appears
    const objectiveCount = await page.locator('.objective-item').count();
    expect(objectiveCount).toBeGreaterThan(1);
    
    // Fill second objective
    const secondObjective = page.locator('.objective-item input').nth(1);
    await secondObjective.fill('Build real-world projects');
    
    // Wait for auto-save
    await page.waitForTimeout(2000);
    
    // Verify in localStorage
    const courseData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('courseDraft'));
    });
    
    expect(courseData.objectives).toHaveLength(2);
  });

  test('2.4 Add Course Description (Rich Text)', async ({ page }) => {
    // Wait for Quill editor to initialize
    await page.waitForSelector('.ql-editor');
    
    // Click in editor
    await page.click('.ql-editor');
    
    // Type content
    await page.type('.ql-editor', 'This is a comprehensive course on testing.');
    
    // Apply bold formatting
    await page.click('.ql-bold');
    await page.type('.ql-editor', ' Important content.');
    
    // Wait for auto-save
    await page.waitForTimeout(2000);
    
    // Verify content saved
    const courseData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('courseDraft'));
    });
    
    expect(courseData.description).toContain('comprehensive course');
    expect(courseData.description).toContain('<strong>');
  });
});
