import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read metadata
const metadata = JSON.parse(fs.readFileSync('slides-metadata.json', 'utf8'));

// Get base path from command line args or use repo name
const baseArg = process.argv.find(arg => arg.startsWith('--base='));
const base = baseArg ? baseArg.split('=')[1] : '/';

console.log('🚀 Starting multi-slide build...');
console.log(`📦 Base path: ${base}`);
console.log(`📊 Found ${metadata.slides.length} slide decks\n`);

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Build each slide deck
metadata.slides.forEach((slide, index) => {
  console.log(`[${index + 1}/${metadata.slides.length}] Building ${slide.name}...`);

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
const slidesWithDates = metadata.slides.map(slide => {
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
console.log(`\n🎉 Build complete! All ${metadata.slides.length} slide decks are ready.`);
console.log(`📍 Index page: dist/index.html`);
