// Test Suite 3: Lesson Management
const { test, expect } = require('@playwright/test');

test.describe('Curriculum Builder - Lessons', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Navigate to curriculum panel
    await page.click('text=Curriculum');
    await page.waitForTimeout(500);
  });

  test('3.1 Create Lesson', async ({ page }) => {
    // Check console logs
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    // Click add lesson button
    await page.click('button:has-text("+ Add Lesson")');
    
    // Wait for lesson to be created
    await page.waitForTimeout(1000);
    
    // Verify console logs
    const hasAddLog = consoleLogs.some(log => log.includes('Adding new lesson'));
    const hasAddedLog = consoleLogs.some(log => log.includes('Lesson added'));
    
    expect(hasAddLog).toBe(true);
    expect(hasAddedLog).toBe(true);
    
    // Verify lesson card appears
    const lessonCard = page.locator('.lesson-card').first();
    await expect(lessonCard).toBeVisible();
    
    // Verify lesson number badge
    const lessonNumber = lessonCard.locator('.lesson-number');
    await expect(lessonNumber).toHaveText('1');
    
    // Verify lesson count in sidebar
    const lessonCount = page.locator('#lessonCount');
    const countText = await lessonCount.textContent();
    expect(countText).toContain('1 lesson');
  });

  test('3.2 Edit Lesson Title Inline', async ({ page }) => {
    // Create a lesson first
    await page.click('button:has-text("+ Add Lesson")');
    await page.waitForTimeout(1000);
    
    // Find lesson title input
    const titleInput = page.locator('.lesson-title-input').first();
    
    // Clear and type new title
    await titleInput.fill('Introduction to Testing');
    
    // Blur to trigger save
    await page.keyboard.press('Tab');
    
    // Wait for auto-save
    await page.waitForTimeout(2000);
    
    // Verify in localStorage
    const courseData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('courseDraft'));
    });
    
    expect(courseData.lessons[0].title).toBe('Introduction to Testing');
  });

  test('3.3 Open Lesson Editor', async ({ page }) => {
    // Create a lesson
    await page.click('button:has-text("+ Add Lesson")');
    await page.waitForTimeout(1000);
    
    // Click Edit button
    await page.click('.lesson-card button:has-text("Edit")');
    
    // Verify modal opens
    const modal = page.locator('#lessonModal');
    await expect(modal).toHaveClass(/active/);
    
    // Verify modal content
    await expect(page.locator('#lessonTitle')).toBeVisible();
    await expect(page.locator('#lessonDescription')).toBeVisible();
    await expect(page.locator('#chaptersContainer')).toBeVisible();
  });

  test('3.4 Delete Lesson', async ({ page }) => {
    // Create a lesson
    await page.click('button:has-text("+ Add Lesson")');
    await page.waitForTimeout(1000);
    
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Click delete button
    await page.click('.lesson-card .btn-icon[title="Delete"]');
    
    // Wait for deletion
    await page.waitForTimeout(1000);
    
    // Verify lesson removed
    const lessonCards = await page.locator('.lesson-card').count();
    expect(lessonCards).toBe(0);
    
    // Verify count updated
    const lessonCount = page.locator('#lessonCount');
    const countText = await lessonCount.textContent();
    expect(countText).toContain('0 lesson');
  });

  test('3.5 Create Multiple Lessons', async ({ page }) => {
    // Create 3 lessons
    for (let i = 0; i < 3; i++) {
      await page.click('button:has-text("+ Add Lesson")');
      await page.waitForTimeout(500);
    }
    
    // Verify 3 lesson cards
    const lessonCards = await page.locator('.lesson-card').count();
    expect(lessonCards).toBe(3);
    
    // Verify numbering
    const firstNumber = await page.locator('.lesson-number').first().textContent();
    const lastNumber = await page.locator('.lesson-number').last().textContent();
    
    expect(firstNumber).toBe('1');
    expect(lastNumber).toBe('3');
    
    // Verify count
    const lessonCount = page.locator('#lessonCount');
    const countText = await lessonCount.textContent();
    expect(countText).toContain('3 lessons');
  });
});
