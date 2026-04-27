// Test Suite 4: Chapter Management
const { test, expect } = require('@playwright/test');

test.describe('Chapter Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/course-builder');
    await page.waitForLoadState('networkidle');
    
    // Navigate to curriculum and create a lesson
    await page.click('text=Curriculum');
    await page.waitForTimeout(500);
    await page.click('button:has-text("+ Add Lesson")');
    await page.waitForTimeout(1000);
    
    // Open lesson editor
    await page.click('.lesson-card button:has-text("Edit")');
    await page.waitForTimeout(500);
  });

  test('4.1 Add Video Chapter', async ({ page }) => {
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    // Click add chapter
    await page.click('button:has-text("+ Add Chapter")');
    
    // Wait for chapter modal
    await page.waitForSelector('#chapterModal.active');
    
    // Verify console logs
    const hasLog = consoleLogs.some(log => log.includes('Adding new chapter'));
    expect(hasLog).toBe(true);
    
    // Fill in chapter details
    await page.fill('#chapterTitle', 'Welcome Video');
    await page.selectOption('#chapterType', 'video');
    await page.fill('#chapterVideoUrl', 'https://youtube.com/watch?v=dQw4w9WgXcQ');
    await page.fill('#chapterDuration', '10');
    
    // Save chapter
    await page.click('#chapterModal button:has-text("Save Chapter")');
    
    // Wait for modal to close
    await page.waitForTimeout(1000);
    
    // Verify chapter appears in list
    const chapterItem = page.locator('.chapter-item').first();
    await expect(chapterItem).toBeVisible();
    await expect(chapterItem).toContainText('Welcome Video');
    await expect(chapterItem).toContainText('10 min');
  });

  test('4.2 Add Text Chapter', async ({ page }) => {
    // Click add chapter
    await page.click('button:has-text("+ Add Chapter")');
    await page.waitForSelector('#chapterModal.active');
    
    // Fill in details
    await page.fill('#chapterTitle', 'Testing Fundamentals');
    await page.selectOption('#chapterType', 'text');
    
    // Wait for text editor to initialize
    await page.waitForSelector('#chapterTextEditor .ql-editor');
    
    // Type in editor
    await page.click('#chapterTextEditor .ql-editor');
    await page.type('#chapterTextEditor .ql-editor', 'This chapter covers testing basics.');
    
    // Save
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(1000);
    
    // Verify chapter saved
    await expect(page.locator('.chapter-item')).toContainText('Testing Fundamentals');
  });

  test('4.3 Add Image Chapter', async ({ page }) => {
    // Click add chapter
    await page.click('button:has-text("+ Add Chapter")');
    await page.waitForSelector('#chapterModal.active');
    
    // Fill in details
    await page.fill('#chapterTitle', 'Architecture Diagram');
    await page.selectOption('#chapterType', 'image');
    
    // Add caption
    await page.fill('#chapterImageCaption', 'System architecture overview');
    
    // Save
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(1000);
    
    // Verify chapter saved
    await expect(page.locator('.chapter-item')).toContainText('Architecture Diagram');
  });

  test('4.4 Add Code Chapter', async ({ page }) => {
    // Click add chapter
    await page.click('button:has-text("+ Add Chapter")');
    await page.waitForSelector('#chapterModal.active');
    
    // Fill in details
    await page.fill('#chapterTitle', 'Hello World Example');
    await page.selectOption('#chapterType', 'code');
    await page.selectOption('#chapterCodeLanguage', 'python');
    await page.fill('#chapterCode', 'def hello():\n    print("Hello, World!")');
    await page.fill('#chapterDuration', '2');
    
    // Save
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(1000);
    
    // Verify chapter saved
    await expect(page.locator('.chapter-item')).toContainText('Hello World Example');
    await expect(page.locator('.chapter-item')).toContainText('2 min');
  });

  test('4.5 Edit Chapter', async ({ page }) => {
    // Create a chapter first
    await page.click('button:has-text("+ Add Chapter")');
    await page.waitForSelector('#chapterModal.active');
    await page.fill('#chapterTitle', 'Original Title');
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(1000);
    
    // Click edit button
    await page.click('.chapter-item .btn-icon[title="Edit"]');
    await page.waitForSelector('#chapterModal.active');
    
    // Verify title populated
    const titleValue = await page.inputValue('#chapterTitle');
    expect(titleValue).toBe('Original Title');
    
    // Update title
    await page.fill('#chapterTitle', 'Updated Title');
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(1000);
    
    // Verify update
    await expect(page.locator('.chapter-item')).toContainText('Updated Title');
  });

  test('4.6 Delete Chapter', async ({ page }) => {
    // Create a chapter
    await page.click('button:has-text("+ Add Chapter")');
    await page.waitForSelector('#chapterModal.active');
    await page.fill('#chapterTitle', 'To Be Deleted');
    await page.click('#chapterModal button:has-text("Save Chapter")');
    await page.waitForTimeout(1000);
    
    // Setup dialog handler
    page.on('dialog', dialog => dialog.accept());
    
    // Delete chapter
    await page.click('.chapter-item .btn-icon[title="Delete"]');
    await page.waitForTimeout(1000);
    
    // Verify deleted
    const chapterCount = await page.locator('.chapter-item').count();
    expect(chapterCount).toBe(0);
  });

  test('4.7 Multiple Chapters in Lesson', async ({ page }) => {
    // Create 3 different chapter types
    const chapters = [
      { title: 'Video Intro', type: 'video', duration: '5' },
      { title: 'Text Content', type: 'text', duration: '10' },
      { title: 'Code Example', type: 'code', duration: '3' }
    ];
    
    for (const chapter of chapters) {
      await page.click('button:has-text("+ Add Chapter")');
      await page.waitForSelector('#chapterModal.active');
      await page.fill('#chapterTitle', chapter.title);
      await page.selectOption('#chapterType', chapter.type);
      await page.fill('#chapterDuration', chapter.duration);
      
      if (chapter.type === 'text') {
        await page.waitForSelector('#chapterTextEditor .ql-editor');
      }
      
      await page.click('#chapterModal button:has-text("Save Chapter")');
      await page.waitForTimeout(1000);
    }
    
    // Verify all chapters
    const chapterCount = await page.locator('.chapter-item').count();
    expect(chapterCount).toBe(3);
    
    // Verify total duration (5 + 10 + 3 = 18)
    await page.click('#lessonModal button:has-text("Save Lesson")');
    await page.waitForTimeout(1000);
    
    const lessonMeta = await page.locator('.lesson-meta-inline').first().textContent();
    expect(lessonMeta).toContain('3 chapters');
    expect(lessonMeta).toContain('18 min');
  });
});
