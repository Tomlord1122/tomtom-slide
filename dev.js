#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import { select } from '@inquirer/prompts';

const args = process.argv.slice(2);
const searchTerm = args[0];

// Load ignore patterns from .slideignore
const ignoreDirs = new Set();
const ignoreFilePath = '.slideignore';
if (fs.existsSync(ignoreFilePath)) {
  const content = fs.readFileSync(ignoreFilePath, 'utf-8');
  content.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .forEach(dir => ignoreDirs.add(dir));
}

// Find all slide files (excluding ignored directories)
const slideFiles = glob.sync('slides/**/*.md', { nodir: true })
  .filter(file => {
    const parts = file.split(path.sep);
    return !parts.some(part => ignoreDirs.has(part));
  });

if (slideFiles.length === 0) {
  console.error('❌ No slide files found in slides/ directory');
  process.exit(1);
}

// Start dev server for a slide file
function startDevServer(slideFile) {
  const slideName = path.basename(slideFile, '.md');

  console.log(`🚀 Starting dev server for: ${slideName}`);
  console.log(`📂 File: ${slideFile}\n`);

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
}

// Interactive hierarchical selector
async function selectSlideInteractively() {
  let currentPath = 'slides';

  while (true) {
    // Get items in current directory
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    const dirs = items
      .filter(item => item.isDirectory() && !ignoreDirs.has(item.name))
      .map(item => item.name);
    const mdFiles = items
      .filter(item => item.isFile() && item.name.endsWith('.md'))
      .map(item => item.name);

    // Build choices
    const choices = [];

    // Add directories first
    dirs.forEach(dir => {
      choices.push({
        name: `📁 ${dir}/`,
        value: { type: 'dir', name: dir }
      });
    });

    // Add markdown files
    mdFiles.forEach(file => {
      const name = path.basename(file, '.md');
      choices.push({
        name: `📄 ${name}`,
        value: { type: 'file', name: file }
      });
    });

    if (choices.length === 0) {
      console.error('❌ No slides or directories found in', currentPath);
      process.exit(1);
    }

    const selected = await select({
      message: `📋 ${currentPath}/`,
      choices,
    });

    if (selected.type === 'dir') {
      // Navigate into directory
      currentPath = path.join(currentPath, selected.name);
    } else {
      // Selected a file, return full path
      return path.join(currentPath, selected.name);
    }
  }
}

// If no argument provided, show interactive selector
if (!searchTerm) {
  try {
    const selected = await selectSlideInteractively();
    startDevServer(selected);
  } catch (err) {
    // User cancelled (Ctrl+C)
    process.exit(0);
  }
} else {
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

  startDevServer(matches[0]);
}
