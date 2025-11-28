import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base path from command line args
const baseArg = process.argv.find(arg => arg.startsWith('--base='));
const base = baseArg ? baseArg.split('=')[1] : '/';

console.log('🚀 Starting multi-slide build...');
console.log(`📦 Base path: ${base}`);

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
      // Save previous key-value
      if (currentKey) {
        frontmatter[currentKey] = currentValue.trim();
      }

      // Parse new key-value
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      currentValue = valueParts.join(':').trim();

      // Handle multiline values starting with |
      if (currentValue === '|') {
        currentValue = '';
      }
    } else if (currentKey && line.trim()) {
      // Continuation of multiline value
      currentValue += (currentValue ? '\n' : '') + line.trim();
    }
  }

  // Save last key-value
  if (currentKey) {
    frontmatter[currentKey] = currentValue.trim();
  }

  return frontmatter;
}

// Parse each slide file
const slides = slideFiles.map(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = extractFrontmatter(content);

  // Extract category from directory structure (e.g., slides/tutorials/demo.md -> tutorials)
  const pathParts = filePath.split(path.sep);
  const category = pathParts.length > 2
    ? pathParts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'General';

  // Get filename without extension
  const filename = path.basename(filePath, '.md');

  // Create URL path: tutorials/demo -> tutorials-demo
  const urlPath = pathParts.slice(1, -1).concat(filename).join('-');

  return {
    name: filename,
    title: frontmatter.title || filename.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: frontmatter.info ? frontmatter.info.split('\n')[0].replace(/^#+\s*/, '') : '',
    category: category,
    path: urlPath,
    file: filePath
  };
});

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build each slide deck
slides.forEach((slide, index) => {
  console.log(`[${index + 1}/${slides.length}] Building ${slide.name} (${slide.category})...`);

  try {
    const cmd = `npx slidev build ${slide.file} --base ${base}${slide.path}/ --out dist/${slide.path}`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${slide.name} built successfully\n`);
  } catch (error) {
    console.error(`❌ Failed to build ${slide.name}:`, error.message);
    process.exit(1);
  }
});

// Generate index.html with metadata
console.log('📝 Generating index.html...');

// Add lastModified dates based on file modification time
const slidesWithDates = slides.map(slide => {
  const filePath = path.join(__dirname, slide.file);
  const stats = fs.statSync(filePath);
  return {
    ...slide,
    lastModified: stats.mtime.toISOString().split('T')[0]
  };
});

// Read the index template
const indexTemplate = fs.readFileSync('index-template.html', 'utf8');

// Inject the slides data and base URL
const indexContent = indexTemplate
  .replace('const baseUrl = \'\';', `const baseUrl = '${base}';`)
  .replace('const slides = [];', `const slides = ${JSON.stringify(slidesWithDates, null, 2)};`);

// Write index.html to dist
fs.writeFileSync('dist/index.html', indexContent);

console.log('✅ Index page generated successfully');
console.log(`\n🎉 Build complete! All ${slides.length} slide decks are ready.`);
console.log(`📍 Index page: dist/index.html`);

// Output summary
console.log('\n📋 Slides summary:');
slidesWithDates.forEach(slide => {
  console.log(`   • ${slide.title} (${slide.category}) -> ${slide.path}`);
});
