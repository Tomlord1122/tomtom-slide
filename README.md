# Slidev Multi-Deck Repository

A beautiful, organized collection of Slidev presentations with an elegant explorer interface. This repository supports building and deploying multiple Slidev decks from a single repo with automatic GitHub Pages deployment.

## Features

- 🎨 **Multiple Slide Decks** - Manage multiple presentations in one repository
- 🔍 **Beautiful Explorer** - Vintage-styled index page with search and categorization
- 🚀 **Auto Deployment** - GitHub Actions automatically builds and deploys on push
- 📦 **Organized Structure** - Group slides by categories for better organization
- ⚡ **Individual Dev Servers** - Develop each deck independently

## Repository Structure

```
.
├── intro.md                 # First slide deck
├── workshop.md              # Second slide deck
├── deepdive.md              # Third slide deck
├── slides-metadata.json     # Metadata for all decks
├── build.js                 # Multi-deck build script
├── index-template.html      # Explorer page template
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml       # GitHub Pages deployment
```

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Develop a specific deck:**
   ```bash
   npm run dev:intro      # Open intro.md
   npm run dev:workshop   # Open workshop.md
   npm run dev:deepdive   # Open deepdive.md
   ```

3. **Or open the default deck:**
   ```bash
   npm run dev
   ```

### Build All Decks

Build all slide decks at once:

```bash
npm run build
```

This will:
- Read `slides-metadata.json` to find all decks
- Build each deck to `dist/<deck-name>/`
- Generate the explorer index page at `dist/index.html`
- Add last modified dates automatically

### Preview Built Decks

After building, preview locally:

```bash
npx vite preview --outDir dist
```

Visit `http://localhost:4173` to see the explorer page.

## Adding New Slide Decks

1. **Create a new Slidev markdown file:**
   ```bash
   touch my-new-deck.md
   ```

2. **Add frontmatter to your deck:**
   ```markdown
   ---
   theme: default
   title: My New Deck
   ---

   # My New Deck

   Start creating your slides...
   ```

3. **Update `slides-metadata.json`:**
   ```json
   {
     "slides": [
       {
         "name": "my-new-deck",
         "title": "My New Deck",
         "description": "Description of your new deck",
         "category": "Tutorials",
         "path": "my-new-deck",
         "file": "my-new-deck.md"
       }
     ]
   }
   ```

4. **Add dev script to `package.json` (optional):**
   ```json
   {
     "scripts": {
       "dev:my-new-deck": "slidev my-new-deck.md --open"
     }
   }
   ```

5. **Build and test:**
   ```bash
   npm run dev:my-new-deck  # Develop
   npm run build            # Build all decks
   ```

## Metadata Configuration

The `slides-metadata.json` file defines all your slide decks:

```json
{
  "slides": [
    {
      "name": "deck-name",           // Unique identifier
      "title": "Display Title",       // Shown in explorer
      "description": "Short desc",    // Card description
      "category": "Category Name",    // Groups decks together
      "path": "url-path",            // URL path (e.g., /repo/path/)
      "file": "source-file.md"       // Source markdown file
    }
  ]
}
```

### Categories

Decks are automatically grouped by category in the explorer:
- **Getting Started** - Introductory content
- **Tutorials** - Hands-on guides
- **Advanced** - Deep-dive topics
- **General** - Uncategorized (default)

You can create your own categories!

## GitHub Pages Deployment

### Setup

1. **Enable GitHub Pages:**
   - Go to Settings > Pages
   - Source: **GitHub Actions**

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Add new slide deck"
   git push origin main
   ```

3. **GitHub Actions will automatically:**
   - Install dependencies
   - Build all slide decks
   - Generate the explorer page
   - Deploy to GitHub Pages

### Access Your Decks

After deployment, your decks will be available at:

- **Explorer:** `https://<username>.github.io/<repo-name>/`
- **Individual decks:** `https://<username>.github.io/<repo-name>/<deck-path>/`

Example:
- Explorer: `https://tom-liu.github.io/tomtom-slide/`
- Intro deck: `https://tom-liu.github.io/tomtom-slide/intro/`
- Workshop: `https://tom-liu.github.io/tomtom-slide/workshop/`

## Explorer Features

The index page includes:

- 🎨 **Vintage Design** - Beautiful earth-tone color palette with serif fonts
- 🔍 **Real-time Search** - Filter decks by name, title, description, or category
- 📊 **Smart Grouping** - Automatic categorization
- 📅 **Last Modified** - Shows when each deck was last updated
- 📱 **Responsive** - Works on all screen sizes

## Build Script Details

The `build.js` script:

1. Reads `slides-metadata.json`
2. Builds each deck with correct base path
3. Outputs to `dist/<deck-path>/`
4. Generates `dist/index.html` with:
   - Injected slide metadata
   - Automatic last modified dates
   - Configured base URL

## Advanced Usage

### Custom Base Path

For deployment to a subdirectory:

```bash
node build.js --base=/custom-path/
```

### Build Single Deck

To build just one deck manually:

```bash
npx slidev build intro.md --base /tomtom-slide/intro/ --out dist/intro
```

### Export to PDF

Export a specific deck to PDF:

```bash
npx slidev export intro.md --output intro-slides.pdf
```

### Without Speaker Notes

Build decks without speaker notes for public sharing:

Edit `build.js` and add `--without-notes`:

```javascript
const cmd = `npx slidev build ${slide.file} --base ${base}${slide.path}/ --out dist/${slide.path} --without-notes`;
```

## Customization

### Modify Explorer Theme

Edit `index-template.html` to customize:
- Colors (Tailwind config)
- Fonts (Google Fonts links)
- Layout and styling
- Search behavior

### Change Default Slidev Theme

In your slide deck frontmatter:

```yaml
---
theme: default  # or seriph, apple-basic, etc.
---
```

Install additional themes:

```bash
npm install @slidev/theme-NAME
```

## Troubleshooting

### Build fails with "Cannot find module"

Make sure all dependencies are installed:
```bash
npm install
```

### Slides don't load on GitHub Pages

Check that:
1. Base path matches your repo name
2. GitHub Pages is enabled
3. Workflow has proper permissions

### Explorer shows no decks

Verify:
1. `slides-metadata.json` is valid JSON
2. All file paths in metadata exist
3. Build script completed successfully

## Resources

- [Slidev Documentation](https://sli.dev)
- [Slidev Themes](https://sli.dev/themes/gallery.html)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## License

MIT

---

Made with ❤️ using [Slidev](https://sli.dev)
