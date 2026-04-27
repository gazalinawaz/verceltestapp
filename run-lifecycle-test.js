#!/usr/bin/env node

/**
 * Automated Course Lifecycle Test Runner
 * Runs the complete end-to-end test suite
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Course Lifecycle Automated Tests\n');
console.log('=' .repeat(60));

// Check if server is running
console.log('\n📡 Checking if server is running on http://localhost:3000...');

try {
    const http = require('http');
    const checkServer = () => {
        return new Promise((resolve, reject) => {
            const req = http.get('http://localhost:3000', (res) => {
                resolve(true);
            });
            req.on('error', () => reject(false));
            req.setTimeout(2000, () => {
                req.destroy();
                reject(false);
            });
        });
    };

    checkServer()
        .then(() => {
            console.log('✅ Server is running\n');
            runTests();
        })
        .catch(() => {
            console.log('❌ Server is NOT running!');
            console.log('\n⚠️  Please start the server first:');
            console.log('   npm start\n');
            console.log('Then run this test again.\n');
            process.exit(1);
        });

} catch (error) {
    console.error('Error checking server:', error.message);
    process.exit(1);
}

function runTests() {
    console.log('🧪 Running Full Lifecycle Test...\n');
    console.log('=' .repeat(60));
    
    try {
        // Run the full lifecycle test
        execSync('npx playwright test tests/06-full-lifecycle.spec.js --headed', {
            stdio: 'inherit',
            cwd: __dirname
        });
        
        console.log('\n' + '=' .repeat(60));
        console.log('✅ ALL TESTS PASSED!');
        console.log('=' .repeat(60));
        console.log('\n📊 Test Summary:');
        console.log('   ✅ Course creation in admin panel');
        console.log('   ✅ Course builder with lessons & chapters');
        console.log('   ✅ Auto-save functionality');
        console.log('   ✅ Data persistence after reload');
        console.log('   ✅ Course editing');
        console.log('   ✅ Chapter deletion');
        console.log('   ✅ Lesson deletion');
        console.log('   ✅ Course deletion from admin');
        console.log('   ✅ Deleted course verification');
        console.log('   ✅ Edge cases (empty course, duplicates)');
        console.log('\n🎉 Complete course lifecycle verified!\n');
        
    } catch (error) {
        console.log('\n' + '=' .repeat(60));
        console.log('❌ TESTS FAILED');
        console.log('=' .repeat(60));
        console.log('\nPlease check the error output above.');
        console.log('Common issues:');
        console.log('  - Server not running on http://localhost:3000');
        console.log('  - Missing Playwright browsers (run: npx playwright install)');
        console.log('  - UI elements not found (check selectors)');
        console.log('\nFor detailed logs, run:');
        console.log('  npx playwright test tests/06-full-lifecycle.spec.js --debug\n');
        process.exit(1);
    }
}
