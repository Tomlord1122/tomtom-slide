# Slidev Multi-Deck Repository

A beautiful, organized collection of Slidev presentations with an elegant explorer interface. This repository supports building and deploying multiple Slidev decks from a single repo with **automatic slide discovery** and GitHub Pages deployment.

## Features

- 🎨 **Multiple Slide Decks** - Manage multiple presentations in one repository
- 🔍 **Beautiful Explorer** - Vintage-styled index page with search and categorization
- 🚀 **Auto Deployment** - GitHub Actions automatically builds and deploys on push
- 📦 **Auto Discovery** - Just add `.md` files, no configuration needed!
- 🗂️ **Folder-based Categories** - Organize slides with subdirectories
- ⚡ **Individual Dev Servers** - Develop each deck independently

## Repository Structure

```
.
├── slides/
│   ├── getting-started/
│   │   └── intro.md         # Auto-discovered slide
│   ├── tutorials/
│   │   └── workshop.md      # Auto-discovered slide
│   ├── advanced/
│   │   └── deepdive.md      # Auto-discovered slide
│   └── demos/
│       └── new-feature.md   # Auto-discovered slide
├── build.js                 # Auto-discovery build script
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
   pnpm install
   # or npm install
   ```

2. **Develop a specific deck:**
   ```bash
   pnpm dev:intro      # Open intro.md
   pnpm dev:workshop   # Open workshop.md
   pnpm dev:deepdive   # Open deepdive.md
   ```

3. **Or open with file path:**
   ```bash
   npx slidev slides/getting-started/intro.md
   ```

### Build All Decks

Build all slide decks at once:

```bash
pnpm build
```

This will:
- **Auto-scan** `slides/` directory for all `.md` files
- Extract metadata from frontmatter (title, description)
- Build each deck to `dist/<category-name>/`
- Generate the explorer index page at `dist/index.html`
- Add last modified dates automatically

### Preview Built Decks

After building, preview locally:

```bash
npx vite preview --outDir dist
```

Visit `http://localhost:4173` to see the explorer page.

## Adding New Slide Decks

### Super Simple Workflow ✨

1. **Create a new markdown file in `slides/` directory:**
   ```bash
   # Create in a category folder (recommended)
   touch slides/tutorials/my-tutorial.md

   # Or create a new category
   mkdir slides/projects
   touch slides/projects/my-project.md
   ```

2. **Add frontmatter and content:**
   ```markdown
   ---
   theme: default
   title: My Tutorial
   info: |
     ## My Awesome Tutorial
     Learn something amazing!
   ---

   # My Tutorial

   Start creating your slides...
   ```

3. **That's it! Just commit and push:**
   ```bash
   git add slides/tutorials/my-tutorial.md
   git commit -m "Add my tutorial slides"
   git push
   ```

4. **Your slide will automatically:**
   - ✅ Be discovered during build
   - ✅ Get its category from folder name (`tutorials` → `Tutorials`)
   - ✅ Extract title from frontmatter
   - ✅ Extract description from `info` field
   - ✅ Appear in the explorer index page

**No configuration files to edit!** 🎉

## How Auto-Discovery Works

The build script automatically:

1. **Scans** `slides/**/*.md` for all markdown files
2. **Extracts** metadata from frontmatter:
   - `title` → Display title
   - `info` → Description (first line)
3. **Infers** category from folder structure:
   - `slides/getting-started/intro.md` → Category: "Getting Started"
   - `slides/tutorials/demo.md` → Category: "Tutorials"
   - `slides/my-slide.md` → Category: "General"
4. **Builds** each slide with proper base path
5. **Generates** index.html with all slides

## Folder Structure Best Practices

Organize your slides by category using folders:

```
slides/
├── getting-started/    # Beginner content
│   ├── intro.md
│   └── setup.md
├── tutorials/          # Step-by-step guides
│   ├── workshop.md
│   └── advanced-workshop.md
├── advanced/           # Deep dives
│   └── deepdive.md
├── demos/             # Feature showcases
│   └── new-feature.md
└── projects/          # Project presentations
    └── quarterly-review.md
```

**Folder names become categories:**
- `getting-started` → "Getting Started"
- `tutorials` → "Tutorials"
- `my-awesome-category` → "My Awesome Category"

## Static Assets (Images, etc.)

Due to a [Slidev limitation](https://github.com/slidevjs/slidev/issues/2161), static assets like images need special handling when your slide files are in subdirectories.

### Rules for Using Images in Slides

1. **Each slide directory needs its own `public/` folder:**
   ```
   slides/
   ├── templates/
   │   ├── starter.md
   │   └── public/           # <-- Put images here
   │       └── Avatar.png
   ├── tutorials/
   │   ├── workshop.md
   │   └── public/           # <-- Each category needs its own
   │       └── diagram.png
   ```

2. **Use absolute paths in your slides:**
   ```html
   <img src="/Avatar.png" class="w-16 h-16 rounded-full" />
   ```

3. **Why not a shared `public/` folder?**
   - Slidev expects `public/` to be in the same directory as the entry `.md` file
   - When slides are in subdirectories (e.g., `slides/templates/starter.md`), Slidev cannot find a root-level `public/` folder
   - This is a known bug in Slidev (#2161)

### Root `public/` Folder (for index.html only)

The root `public/` folder is used **only for the explorer page** (`index-template.html`), not for slides:

```
.
├── public/
│   └── app_icon.png        # Used by index.html
├── slides/
│   └── templates/
│       ├── starter.md
│       └── public/
│           └── Avatar.png  # Used by starter.md
```

The build script automatically copies `public/` to `dist/` for the explorer page.

## Frontmatter Configuration

### Minimal Example

```yaml
---
theme: default
title: My Presentation
---
```

### Full Example

```yaml
---
theme: seriph
title: Advanced Web Development
info: |
  ## Deep Dive into Performance
  Learn optimization techniques and best practices.
background: https://images.unsplash.com/photo-1234567890
class: text-center
transition: slide-left
mdc: true
---
```

### Frontmatter Fields

- `title` - **Required**. Display title (used in explorer)
- `info` - **Recommended**. Description (first line shown in explorer)
- `theme` - Slidev theme (`default`, `seriph`, etc.)
- `background` - Background image URL
- `class` - CSS classes for first slide
- `transition` - Slide transition animation
- `mdc` - Enable MDC syntax

## GitHub Pages Deployment

### Setup

1. **Enable GitHub Pages:**
   - Go to Settings > Pages
   - Source: **GitHub Actions**

2. **Push to main branch:**
   ```bash
   git add slides/my-category/my-slide.md
   git commit -m "Add new presentation"
   git push origin main
   ```

3. **GitHub Actions will automatically:**
   - Install dependencies
   - Scan `slides/` directory
   - Build all slide decks
   - Generate the explorer page
   - Deploy to GitHub Pages

### Access Your Decks

After deployment, your decks will be available at:

- **Explorer:** `https://<username>.github.io/<repo-name>/`
- **Individual decks:** `https://<username>.github.io/<repo-name>/<category>-<slide-name>/`

Example:
- Explorer: `https://tom-liu.github.io/tomtom-slide/`
- Tutorial: `https://tom-liu.github.io/tomtom-slide/tutorials-workshop/`
- Demo: `https://tom-liu.github.io/tomtom-slide/demos-new-feature/`

## Explorer Features

The index page includes:

- 🎨 **Vintage Design** - Beautiful earth-tone color palette with serif fonts
- 🔍 **Real-time Search** - Filter decks by name, title, description, or category
- 📊 **Smart Grouping** - Automatic categorization from folder structure
- 📅 **Last Modified** - Shows when each deck was last updated
- 📱 **Responsive** - Works on all screen sizes

## Advanced Usage

### Custom Base Path

For deployment to a subdirectory:

```bash
node build.js --base=/custom-path/
```

### Build Single Deck

To build just one deck manually:

```bash
npx slidev build slides/tutorials/workshop.md --base /repo/tutorials-workshop/ --out dist/tutorials-workshop
```

### Export to PDF

Export a specific deck to PDF:

```bash
npx slidev export slides/tutorials/workshop.md --output workshop-slides.pdf
```

### Development Server for Any Deck

```bash
npx slidev slides/path/to/your-deck.md --open
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
pnpm add @slidev/theme-NAME
```

## Troubleshooting

### Build fails with "No slide files found"

Make sure:
- Slides are in `slides/` directory
- Files have `.md` extension
- Files contain valid frontmatter

### Slides don't load on GitHub Pages

Check that:
1. Base path matches your repo name
2. GitHub Pages is enabled
3. Workflow has proper permissions

### Category not showing correctly

- Category is auto-detected from folder name
- Use kebab-case for folders: `my-category` → "My Category"
- Slides in root `slides/` folder go to "General" category

## Resources

- [Slidev Documentation](https://sli.dev)
- [Slidev Themes](https://sli.dev/themes/gallery.html)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## License

MIT

---

Made with ❤️ using [Slidev](https://sli.dev)
