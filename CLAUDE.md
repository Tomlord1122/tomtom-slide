# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A multi-deck Slidev presentation repository with auto-discovery. Slides are organized in `slides/` directory with folder-based categorization. Built presentations deploy to Vercel/GitHub Pages.

## Commands

```bash
# Development - interactive slide selector
bun dev                    # Opens hierarchical menu to select slide
bun dev <slide-name>       # Direct search (e.g., bun dev temporal)

# Build all slides with incremental caching
bun build                  # Builds only changed slides
bun build --force          # Force rebuild all slides

# Single slide operations
bun run build:single       # Build single slide (slidev build)
bun run export             # Export to PDF (slidev export)
```

## Architecture

### Key Files
- `dev.js` - Interactive dev server launcher with hierarchical folder navigation using `@inquirer/prompts`
- `build.js` - Multi-slide build script with MD5 hash-based incremental builds, caches to `.slide-cache/`
- `index-template.html` - Explorer page template, generates `dist/index.html`
- `.slideignore` - Directory names to exclude from dev selector (e.g., `static`)

### Slide Organization
```
slides/
├── <category>/           # Folder name becomes category (kebab-case → Title Case)
│   ├── <slide-name>.md   # Slidev markdown with frontmatter
│   └── public/           # Static assets (images) for this category only
```

Each slide's URL path: `<category>-<slide-name>/` (e.g., `sharing-temporal_intro/`)

### Build Process
1. Glob `slides/**/*.md` for auto-discovery
2. Extract frontmatter (title, info) for metadata
3. Skip unchanged files (MD5 hash comparison)
4. Run `slidev build` per deck with proper `--base` path
5. Generate explorer index from `index-template.html`

### Static Assets Limitation
Due to Slidev limitation, each slide category needs its own `public/` folder. Root `public/` is only for the explorer page.
