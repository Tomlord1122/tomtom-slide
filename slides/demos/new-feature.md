---
theme: default
title: New Feature Demo
info: |
  ## New Feature Showcase
  Testing automatic slide discovery!
class: text-center
transition: slide-left
mdc: true
---

# New Feature Demo

This slide was auto-discovered!

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---

# How it works

Just create a new `.md` file in `slides/` directory:

- Put it in any subdirectory (e.g., `slides/demos/`)
- Write your markdown with frontmatter
- Push to GitHub
- It automatically appears in the index!

No need to edit any configuration files!

---

# Example Structure

```
slides/
├── getting-started/
│   └── intro.md
├── tutorials/
│   └── workshop.md
├── advanced/
│   └── deepdive.md
└── demos/            ← New category!
    └── new-feature.md ← This file!
```

Category is auto-detected from folder name!
