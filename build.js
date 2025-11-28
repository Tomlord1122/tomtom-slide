import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line args
const baseArg = process.argv.find(arg => arg.startsWith('--base='));
const base = baseArg ? baseArg.split('=')[1] : '/';
const forceRebuild = process.argv.includes('--force');
const cacheDir = path.join(__dirname, '.slide-cache');
const cacheFile = path.join(cacheDir, 'build-hashes.json');

console.log('🚀 Starting multi-slide build...');
console.log(`📦 Base path: ${base}`);
if (forceRebuild) console.log('⚠️  Force rebuild enabled - all slides will be rebuilt\n');

// Auto-discover all markdown files in slides directory
const slideFiles = glob.sync('slides/**/*.md', { nodir: true });

console.log(`📊 Found ${slideFiles.length} slide decks\n`);

if (slideFiles.length === 0) {
  console.error('❌ No slide files found in slides/ directory');
  process.exit(1);
}

// Extract frontmatter from markdown file
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split('\n');

  let currentKey = null;
  let currentValue = '';

  for (const line of lines) {
    if (line.match(/^[a-zA-Z_-]+:/)) {
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      currentValue = valueParts.join(':').trim();
      if (currentValue === '|') {
        currentValue = '';
      }
    } else if (currentKey && line.trim()) {
      currentValue += (currentValue ? '\n' : '') + line.trim();
    }
  }

  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }

  return frontmatter;
}

// Calculate content hash for a slide file
function getFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// Load previous build hashes
function loadBuildCache() {
  if (fs.existsSync(cacheFile)) {
    try {
      return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

// Save build hashes
function saveBuildCache(hashes) {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(cacheFile, JSON.stringify(hashes, null, 2));
}

// Parse each slide file
const slides = slideFiles.map(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = extractFrontmatter(content);
  const pathParts = filePath.split(path.sep);
  const category = pathParts.length > 2
    ? pathParts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'General';
  const filename = path.basename(filePath, '.md');
  const urlPath = pathParts.slice(1, -1).concat(filename).join('-');

  return {
    name: filename,
    title: frontmatter.title || filename.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: frontmatter.info ? frontmatter.info.split('\n')[0].replace(/^#+\s*/, '') : '',
    category: category,
    path: urlPath,
    file: filePath,
    hash: getFileHash(filePath)
  };
});

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Load previous build cache
const previousHashes = loadBuildCache();
const newHashes = {};

// Get current slide paths for cleanup
const currentSlidePaths = new Set(slides.map(s => s.path));

// Clean up deleted slides from dist and cache
const deletedSlides = [];
for (const [filePath, hash] of Object.entries(previousHashes)) {
  // Check if this slide still exists
  if (!slides.find(s => s.file === filePath)) {
    // Extract the path from the old file path
    const pathParts = filePath.split(path.sep);
    const filename = path.basename(filePath, '.md');
    const urlPath = pathParts.slice(1, -1).concat(filename).join('-');
    const outPath = path.resolve(__dirname, 'dist', urlPath);

    // Remove the built output if it exists
    if (fs.existsSync(outPath)) {
      fs.rmSync(outPath, { recursive: true, force: true });
      deletedSlides.push({ file: filePath, path: urlPath });
    }
  }
}

if (deletedSlides.length > 0) {
  console.log(`🗑️  Cleaning up ${deletedSlides.length} deleted slide(s):`);
  deletedSlides.forEach(slide => {
    console.log(`   • ${slide.path}`);
  });
  console.log('');
}

// Determine which slides need rebuilding
const slidesToBuild = slides.filter(slide => {
  if (forceRebuild) return true;

  const outPath = path.resolve(__dirname, 'dist', slide.path);
  const previousHash = previousHashes[slide.file];
  const hasOutput = fs.existsSync(path.join(outPath, 'index.html'));

  // Rebuild if: no previous hash, hash changed, or output missing
  return !previousHash || previousHash !== slide.hash || !hasOutput;
});

const skippedSlides = slides.filter(slide => !slidesToBuild.includes(slide));

if (skippedSlides.length > 0) {
  console.log(`⏭️  Skipping ${skippedSlides.length} unchanged slides:`);
  skippedSlides.forEach(slide => {
    console.log(`   • ${slide.name} (${slide.category})`);
    newHashes[slide.file] = slide.hash; // Preserve hash for unchanged slides
  });
  console.log('');
}

if (slidesToBuild.length === 0) {
  console.log('✨ No slides need rebuilding!\n');
} else {
  console.log(`🔨 Building ${slidesToBuild.length} slide(s):\n`);

  // Build each slide deck that needs rebuilding
  slidesToBuild.forEach((slide, index) => {
    console.log(`[${index + 1}/${slidesToBuild.length}] Building ${slide.name} (${slide.category})...`);

    try {
      const outPath = path.resolve(__dirname, 'dist', slide.path);
      const cmd = `npx slidev build ${slide.file} --base ${base}${slide.path}/ --out "${outPath}"`;
      execSync(cmd, { stdio: 'inherit' });
      console.log(`✅ ${slide.name} built successfully\n`);
      newHashes[slide.file] = slide.hash; // Save new hash after successful build
    } catch (error) {
      console.error(`❌ Failed to build ${slide.name}:`, error.message);
      process.exit(1);
    }
  });
}

// Save updated build cache
saveBuildCache(newHashes);

// Generate index.html with metadata (always regenerate for accurate data)
console.log('📝 Generating index.html...');

const slidesWithDates = slides.map(slide => {
  const filePath = path.join(__dirname, slide.file);
  const stats = fs.statSync(filePath);
  return {
    ...slide,
    lastModified: stats.mtime.toISOString().split('T')[0]
  };
});

const indexTemplate = fs.readFileSync('index-template.html', 'utf8');
const indexContent = indexTemplate
  .replace('const baseUrl = \'\';', `const baseUrl = '${base}';`)
  .replace('const slides = [];', `const slides = ${JSON.stringify(slidesWithDates, null, 2)};`);

fs.writeFileSync('dist/index.html', indexContent);

console.log('✅ Index page generated successfully');

// Summary
const builtCount = slidesToBuild.length;
const skippedCount = skippedSlides.length;
const deletedCount = deletedSlides.length;
console.log(`\n🎉 Build complete!`);
console.log(`   📦 Built: ${builtCount} | ⏭️  Skipped: ${skippedCount} | 🗑️  Deleted: ${deletedCount} | 📊 Total: ${slides.length}`);
console.log(`📍 Index page: dist/index.html`);

console.log('\n📋 All slides:');
slidesWithDates.forEach(slide => {
  const status = slidesToBuild.find(s => s.file === slide.file) ? '🔨' : '⏭️';
  console.log(`   ${status} ${slide.title} (${slide.category}) -> ${slide.path}`);
});
