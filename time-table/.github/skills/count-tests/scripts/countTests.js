import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../..');

/**
 * Recursively find all test files in the project
 * @param {string} dir - Directory to search in
 * @param {string[]} fileList - Accumulator for file list
 * @returns {string[]} Array of test file paths
 */
function findTestFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // Skip node_modules and hidden directories
        if (file === 'node_modules' || file.startsWith('.')) {
            return;
        }

        if (stat.isDirectory()) {
            findTestFiles(filePath, fileList);
        } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

/**
 * Count test cases in a file by counting it() and test() calls
 * @param {string} filePath - Path to the test file
 * @returns {number} Number of test cases found
 */
function countTestCases(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Match it() and test() patterns, accounting for whitespace and comments
    // Pattern: word boundary, then 'it' or 'test', then optional whitespace, then opening paren
    const pattern = /\b(it|test)\s*\(/g;
    const matches = content.match(pattern) || [];
    
    return matches.length;
}

/**
 * Check if a file is an e2e test based on its path
 * @param {string} filePath - Path to the test file
 * @returns {boolean} True if the file is an e2e test
 */
function isE2eTest(filePath) {
    return filePath.includes('/e2e/') || 
           filePath.includes('\\e2e\\') || 
           filePath.includes('e2e.test');
}

/**
 * Count all tests in the project
 * @returns {Object} Object with totalFiles, totalCases, e2eFiles, e2eCases
 */
export function countAllTests() {
    const testFiles = findTestFiles(projectRoot);

    let totalFiles = 0;
    let totalCases = 0;
    let e2eFiles = 0;
    let e2eCases = 0;

    testFiles.forEach(filePath => {
        const testCount = countTestCases(filePath);
        const isE2e = isE2eTest(filePath);

        totalFiles++;
        totalCases += testCount;

        if (isE2e) {
            e2eFiles++;
            e2eCases += testCount;
        }
    });

    return {
        totalFiles,
        totalCases,
        e2eFiles,
        e2eCases,
    };
}

// Run and output results if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    const results = countAllTests();
    console.log(JSON.stringify(results, null, 2));
}
