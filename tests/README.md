# Automated Test Suite

## Overview
This directory contains automated end-to-end tests for the Course Builder platform using Playwright.

## Test Files

### 01-authentication.spec.js
- User registration
- User login  
- Admin access
- Non-admin access restriction

### 02-course-creation.spec.js
- Create new course
- Upload course thumbnail
- Add learning objectives
- Add course description (rich text)

### 03-lesson-management.spec.js
- Create lesson
- Edit lesson title inline
- Open lesson editor
- Delete lesson
- Create multiple lessons

### 04-chapter-management.spec.js
- Add video chapter
- Add text chapter
- Add image chapter
- Add code chapter
- Edit chapter
- Delete chapter
- Multiple chapters in lesson

### 05-persistence.spec.js
- Auto-save functionality
- Draft recovery after refresh
- Lesson persistence
- Chapter persistence
- Clear draft

## Setup

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run Tests

#### All Tests
```bash
npm test
```

#### Specific Test File
```bash
npx playwright test tests/03-lesson-management.spec.js
```

#### Headed Mode (See Browser)
```bash
npm run test:headed
```

#### UI Mode (Interactive)
```bash
npm run test:ui
```

#### Debug Mode
```bash
npm run test:debug
```

## Test Configuration

Tests are configured in `playwright.config.js`:
- Base URL: `http://localhost:3000`
- Browsers: Chromium, Firefox, WebKit
- Screenshots: On failure
- Videos: On failure
- Traces: On first retry

## Writing New Tests

### Basic Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('Test case name', async ({ page }) => {
    // Test steps
    await page.goto('/path');
    await page.click('button');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices
1. Use descriptive test names
2. Add wait times for async operations
3. Check console logs for debugging
4. Verify both UI and data persistence
5. Clean up after tests

## CI/CD Integration

Tests can be run in CI with:
```bash
CI=true npm test
```

This will:
- Run tests in parallel
- Retry failed tests 2 times
- Generate HTML report

## Troubleshooting

### Tests Failing?
1. Check server is running on port 3000
2. Clear browser cache and localStorage
3. Run in headed mode to see what's happening
4. Check console logs in test output

### Slow Tests?
1. Reduce wait times where possible
2. Run specific test files
3. Use `test.only()` for focused testing

### Debugging
```bash
# Run with debug mode
npx playwright test --debug

# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Coverage

Current test coverage:
- Authentication: 4 tests
- Course Creation: 4 tests
- Lesson Management: 5 tests
- Chapter Management: 7 tests
- Persistence: 5 tests

**Total: 25 automated tests**

## Future Tests

Planned additions:
- Image paste/upload tests (requires clipboard API mocking)
- Admin dashboard tests
- Student experience tests
- Performance tests
- Accessibility tests
- Mobile responsive tests
