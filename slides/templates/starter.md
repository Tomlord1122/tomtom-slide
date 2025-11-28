---
theme: seriph
background: https://images.unsplash.com/photo-1555066931-4365d14bab8c
title: Slide Starter Template
info: |
  ## Starter Template
  A template with code examples, transitions, and v-mark highlights.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# Slide Starter Template

Code Examples & Highlighting Demo

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Get Started <carbon:arrow-right class="inline"/>
  </span>
</div>

---
transition: fade-out
---

# Key Features

This template demonstrates:

- <span v-mark.underline.orange="1">Code syntax highlighting</span> with Shiki
- <span v-mark.underline.blue="2">Code transitions</span> between steps
- <span v-mark.underline.green="3">Line highlighting</span> in code blocks
- <span v-mark.underline.purple="4">v-mark annotations</span> for emphasis

<v-click>

> Press **Space** or **Arrow Keys** to navigate through slides and animations

</v-click>

---
transition: slide-up
---

# Code with Line Highlights

Use `{lines}` syntax to highlight specific lines:

```typescript {2,3|5-7|all}
interface User {
  id: string;
  name: string;

  // Optional fields
  email?: string;
  avatar?: string;
}
```

<v-clicks>

- First click: highlights `id` and `name`
- Second click: highlights optional fields
- Third click: shows all lines

</v-clicks>

---
layout: two-cols
layoutClass: gap-16
transition: slide-left
---

# Code Transitions

Animate code changes between steps:

::right::

````md magic-move {lines: true}
```typescript
// Step 1: Basic function
function greet(name: string) {
  return `Hello, ${name}!`;
}
```

```typescript
// Step 2: Add type annotation
function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

```typescript
// Step 3: Make it async
async function greet(name: string): Promise<string> {
  const greeting = await fetchGreeting();
  return `${greeting}, ${name}!`;
}
```

```typescript
// Step 4: Add error handling
async function greet(name: string): Promise<string> {
  try {
    const greeting = await fetchGreeting();
    return `${greeting}, ${name}!`;
  } catch (error) {
    return `Hello, ${name}!`;
  }
}
```
````

---

# v-mark Highlights

Use <span v-mark.underline.red>v-mark</span> to annotate text with hand-drawn style!

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

### Underline Styles

- <span v-mark.underline.orange="1">Orange underline</span>
- <span v-mark.underline.blue="2">Blue underline</span>
- <span v-mark.underline.green="3">Green underline</span>
- <span v-mark.underline.purple="4">Purple underline</span>

</div>
<div>

### Other Styles

- <span v-mark.box.red="1">Box highlight</span>
- <span v-mark.circle.blue="2">Circle mark</span>
- <span v-mark.highlight.yellow="3">Highlight marker</span>
- <span v-mark.crossed-off.orange="4">Crossed off</span>

</div>
</div>

<v-click at="5">

<div class="mt-8 p-4 bg-gray-800 rounded">

**Tip:** Use `v-mark.type.color="clickNumber"` to control when marks appear!

</div>

</v-click>

---

# Code Block with Filename

Show filename in code blocks:

```typescript {monaco} {filename: 'src/utils/api.ts'}
export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

<v-click>

```typescript {filename: 'src/hooks/useData.ts'}
import { fetchData } from './utils/api';

export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetchData<T>(url).then(setData);
  }, [url]);

  return data;
}
```

</v-click>

---
layout: center
class: text-center
---

# Line Numbers & Diff

```diff
- const oldWay = function(x) {
-   return x * 2;
- };
+ const newWay = (x: number): number => x * 2;
```

<v-click>

With line numbers:

```typescript {1|2-4|5-7|all} {lines: true, startLine: 10}
// Starting from line 10
function processItems(items: string[]) {
  return items
    .filter(item => item.length > 0)
    .map(item => item.trim())
    .sort();
}
```

</v-click>

---

# Working with Images

<div class="grid grid-cols-2 gap-8">
<div>

### Inline Images

Use standard Markdown syntax:

```markdown
![Alt text](/path/to/image.png)
```

Or with sizing:

```html
<img src="/logo.png" class="w-40 m-auto" />
```

</div>
<div>

### Remote Images

```markdown
![Unsplash](https://images.unsplash.com/photo-1...)
```

<v-click>

### Image as Background

```yaml
---
background: https://cover.sli.dev
---
```

</v-click>

</div>
</div>

---
layout: two-cols
layoutClass: gap-8
---

# Image Layouts

### Full Width Image

<img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800" class="rounded shadow-lg" />

<v-click>

Caption: Full-width image with rounded corners and shadow

</v-click>

::right::

### Images with v-click

<v-click>

<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400" class="rounded mb-4" />

Step 1: First image appears

</v-click>

<v-click>

<img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" class="rounded" />

Step 2: Second image appears

</v-click>

---
layout: image-right
image: https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800
backgroundSize: cover
---

# Image Layout: image-right

Content on the left, image fills the right half.

- Perfect for showcasing visuals
- Maintains readable text space
- Background size customizable

<v-click>

**Available layouts:**
- `image-left`
- `image-right`
- `image` (full background)

</v-click>

---
layout: cover
background: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920
class: text-white
---

# Full Background Image

<div class="absolute bottom-10 left-10 right-10">
  <div class="bg-black bg-opacity-50 p-6 rounded">

Use `layout: cover` with `background` for full-page images

Add a semi-transparent overlay for readable text

  </div>
</div>

---

# Local Images

<div class="grid grid-cols-2 gap-8">
<div>

### Project Structure

```
slides/
├── your-category/
│   ├── your-slide.md
│   └── images/
│       ├── logo.png
│       └── diagram.svg
```

</div>
<div>

### Usage

```markdown
![Logo](./images/logo.png)

![Diagram](./images/diagram.svg)
```

<v-click>

**Or with HTML:**

```html
<img src="./images/logo.png"
     class="h-40" />
```

</v-click>

</div>
</div>

---

# Image Styling with UnoCSS

Use utility classes for quick styling:

<div class="grid grid-cols-3 gap-4 mt-8">
<div>

**Size Classes**

- `w-20` - width 5rem
- `h-40` - height 10rem
- `max-w-md` - max-width
- `object-cover` - cover

</div>
<div>

**Position**

- `m-auto` - center
- `float-left` - float
- `absolute` - absolute
- `relative` - relative

</div>
<div>

**Effects**

- `rounded` - rounded corners
- `shadow-lg` - shadow
- `opacity-75` - opacity
- `blur-sm` - blur

</div>
</div>

<v-click>

**Example:**

```html
<img src="./logo.png"
     class="w-32 h-32 rounded-full shadow-xl m-auto" />
```

<img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=128&h=128&fit=crop"
     class="w-32 h-32 rounded-full shadow-xl m-auto mt-4" />

</v-click>

---
layout: center
class: text-center
---

# Ready to Create!

<div class="text-2xl mb-8">

Copy this template and start building your slides

</div>

<div v-mark.box.green="1">

```bash
cp slides/templates/starter.md slides/your-category/your-slide.md
```

</div>

<div class="mt-8">
  <a href="https://sli.dev" target="_blank" class="px-4 py-2 rounded bg-blue-500 text-white">
    Slidev Documentation
  </a>
</div>
