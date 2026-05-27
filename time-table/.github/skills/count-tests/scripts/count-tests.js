const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2] || '.';

const TEST_PATTERNS = [
  { regex: /\.test\.(js|ts|jsx|tsx)$/, label: 'Unit (.test)' },
  { regex: /\.spec\.(js|ts|jsx|tsx)$/, label: 'Spec (.spec)' },
  { regex: /\.test\.py$/, label: 'Python (.test.py)' },
  { regex: /^test_.*\.py$/, label: 'Python (test_*.py)' },
];

const E2E_DIRS = ['cypress', 'e2e', 'playwright'];

const CASE_PATTERNS = [
  /\bit\s*\(/g,
  /\btest\s*\(/g,
  /\bdef\s+test_/g,
];

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];

function walkDir(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function countCasesInFile(filePath) {
  let count = 0;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const pattern of CASE_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    }
  } catch {
    // skip unreadable files
  }
  return count;
}

function isE2EFile(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return E2E_DIRS.some(dir => normalized.includes(`/${dir}/`));
}

const allFiles = walkDir(rootDir);

const summary = {
  totalFiles: 0,
  totalCases: 0,
  byCategory: {},
  e2eFiles: 0,
  e2eCases: 0,
};

for (const file of allFiles) {
  const fileName = path.basename(file);
  const matched = TEST_PATTERNS.find(p => p.regex.test(fileName));
  if (!matched) continue;

  const cases = countCasesInFile(file);
  summary.totalFiles++;
  summary.totalCases += cases;

  if (isE2EFile(file)) {
    summary.e2eFiles++;
    summary.e2eCases += cases;
  } else {
    if (!summary.byCategory[matched.label]) {
      summary.byCategory[matched.label] = { files: 0, cases: 0 };
    }
    summary.byCategory[matched.label].files++;
    summary.byCategory[matched.label].cases += cases;
  }
}

console.log(JSON.stringify(summary, null, 2));
