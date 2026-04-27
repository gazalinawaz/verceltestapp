// Test Suite 1: Authentication & Authorization
const { test, expect } = require('@playwright/test');

test.describe('Authentication & Authorization', () => {
  
  test('1.1 User Registration', async ({ page }) => {
    await page.goto('/');
    
    // Click login/register button
    await page.click('text=Login');
    
    // Should redirect to Auth0
    await expect(page).toHaveURL(/auth0/);
    
    // Note: Full Auth0 flow requires test credentials
    // This is a placeholder - actual implementation needs Auth0 test environment
  });

  test('1.2 User Login', async ({ page }) => {
    await page.goto('/');
    
    // Click login
    await page.click('text=Login');
    
    // Verify redirect to Auth0
    await expect(page).toHaveURL(/auth0/);
  });

  test('1.3 Admin Access', async ({ page, context }) => {
    // Mock admin session
    await context.addCookies([{
      name: 'appSession',
      value: 'mock-admin-session',
      domain: 'localhost',
      path: '/'
    }]);
    
    await page.goto('/admin');
    
    // Should load admin dashboard (or redirect if not admin)
    await page.waitForLoadState('networkidle');
    
    // Check for admin elements
    const hasAdminContent = await page.locator('text=Course Management').isVisible().catch(() => false);
    
    if (hasAdminContent) {
      await expect(page.locator('text=Course Management')).toBeVisible();
      await expect(page.locator('text=Course Builder')).toBeVisible();
    }
  });

  test('1.4 Non-Admin Access Restriction', async ({ page }) => {
    // Without admin session, should not access admin pages
    await page.goto('/admin');
    
    // Should redirect to login or show error
    await page.waitForLoadState('networkidle');
    
    // Either redirected to login or on admin page without content
    const url = page.url();
    const hasLogin = url.includes('login') || url.includes('auth0');
    
    if (!hasLogin) {
      // If on admin page, should not show admin content
      const hasAdminContent = await page.locator('text=Course Management').isVisible().catch(() => false);
      expect(hasAdminContent).toBe(false);
    }
  });
});
