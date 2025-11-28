#!/usr/bin/env node
import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const args = process.argv.slice(2);
const searchTerm = args[0];

// Find all slide files
const slideFiles = glob.sync('slides/**/*.md', { nodir: true });

if (slideFiles.length === 0) {
  console.error('❌ No slide files found in slides/ directory');
  process.exit(1);
}

// If no argument provided, list all available slides
if (!searchTerm) {
  console.log('📋 Available slides:\n');

  const grouped = {};
  slideFiles.forEach(file => {
    const pathParts = file.split(path.sep);
    const category = pathParts.length > 2 ? pathParts[1] : 'general';
    const name = path.basename(file, '.md');
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push({ name, file });
  });

  Object.keys(grouped).sort().forEach(category => {
    console.log(`  ${category}/`);
    grouped[category].forEach(slide => {
      console.log(`    • ${slide.name}`);
    });
  });

  console.log('\n💡 Usage: pnpm dev <slide-name>');
  console.log('   Example: pnpm dev workshop');
  console.log('   Example: pnpm dev intro');
  process.exit(0);
}

// Search for matching slide
const matches = slideFiles.filter(file => {
  const name = path.basename(file, '.md');
  const fullPath = file.toLowerCase();
  const term = searchTerm.toLowerCase();

  // Exact name match
  if (name.toLowerCase() === term) return true;
  // Partial name match
  if (name.toLowerCase().includes(term)) return true;
  // Path contains search term
  if (fullPath.includes(term)) return true;

  return false;
});

if (matches.length === 0) {
  console.error(`❌ No slide found matching "${searchTerm}"`);
  console.log('\n📋 Available slides:');
  slideFiles.forEach(file => {
    const name = path.basename(file, '.md');
    console.log(`   • ${name} (${file})`);
  });
  process.exit(1);
}

if (matches.length > 1) {
  // Check for exact match first
  const exactMatch = matches.find(file =>
    path.basename(file, '.md').toLowerCase() === searchTerm.toLowerCase()
  );

  if (exactMatch) {
    matches.length = 0;
    matches.push(exactMatch);
  } else {
    console.log(`🔍 Multiple slides match "${searchTerm}":\n`);
    matches.forEach((file, i) => {
      const name = path.basename(file, '.md');
      console.log(`   ${i + 1}. ${name} (${file})`);
    });
    console.log('\n💡 Please be more specific.');
    process.exit(1);
  }
}

const slideFile = matches[0];
const slideName = path.basename(slideFile, '.md');

console.log(`🚀 Starting dev server for: ${slideName}`);
console.log(`📂 File: ${slideFile}\n`);

// Run slidev with the matched file
const child = spawn('npx', ['slidev', slideFile, '--open'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('❌ Failed to start dev server:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
