---
theme: default
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
fonts:
  sans: Inter
  mono: Fira Code
highlighter: shiki
lineNumbers: false
colorSchema: dark
---

<style>
.slidev-layout {
  background: linear-gradient(-45deg,rgb(7, 58, 7), #323232);
  background-size: 400% 400%;
}
</style>

# Slide Starter Template

Code Examples & Highlighting Demo
<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space to continue <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-tl m-6">
  <a href="https://tomlord.fyi" target="_blank" title="Visit my website">
    <img src="/Avatar.png" class="w-16 h-16 rounded-full" alt="Avatar" />
  </a>
</div>

<div class="abs-br m-6 flex gap-2 items-center">
  <a href="https://github.com/Tomlord1122" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---
transition: fade-out
layout: default
---

# What You'll Learn

<div class="grid grid-cols-2 gap-x-8 gap-y-4 mt-8">

<div v-click>
<div class="text-4xl mb-2">💻</div>

### Code Highlighting
Syntax highlighting with line numbers and focus
</div>

<div v-click>
<div class="text-4xl mb-2">✨</div>

### Magic Move
Smooth code transitions between states
</div>

<div v-click>
<div class="text-4xl mb-2">🎨</div>

### Annotations
Beautiful hand-drawn style marks
</div>

<div v-click>
<div class="text-4xl mb-2">🖼️</div>

### Images
Various layouts and styling options
</div>

</div>

<div v-click class="mt-8 text-sm opacity-75">

Press <kbd>Space</kbd> or <kbd>→</kbd> to navigate

</div>

---
transition: slide-up
---

# Code Highlighting

<div class="text-sm opacity-75 mb-4">
Progressive line highlighting with <code>{lines}</code> syntax
</div>

```typescript {2,3|5-7|all}
interface User {
  id: string;
  name: string;

  // Optional fields
  email?: string;
  avatar?: string;
}
```

<v-clicks depth="2">

- Step 1: Highlight required fields
- Step 2: Show optional fields
- Step 3: Reveal everything

</v-clicks>

---
transition: slide-left
---

# Magic Move

<div class="text-sm opacity-75 mb-4">
Smooth code transitions as your implementation evolves
</div>

````md magic-move
```go
// Basic function
func main(){
  // Let's go!!
}
```

```go

import "fmt"
function greet(){
  fmt.Println("Hello World!")
}
```

```typescript
import "fmt"
function greet(name string){
  
  fmt.Printf("Hello World! %s", name)
}
```

```typescript
// Add error handling
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

# Annotations

<div class="text-sm opacity-75 mb-4">
Hand-drawn style marks using <code>v-mark</code>
</div>

<div class="mt-8 space-y-4">

<div v-click="1">

## Important concepts

- APIs should be <span v-mark.underline.orange="2">type-safe</span>
- Handle <span v-mark.circle.red="3">errors</span> gracefully
- Keep code <span v-mark.highlight.yellow="4">simple</span>

</div>

<div v-click="5" class="mt-8 text-sm">

**Available marks:** `underline`, `box`, `circle`, `highlight`, `crossed-off`

**Colors:** `red`, `orange`, `yellow`, `green`, `blue`, `purple`

</div>

</div>

---

# Code with **Context**

<div class="text-sm opacity-75 mb-4">
Add filenames for better clarity
</div>

```typescript {filename: 'src/utils/api.ts'}
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

# Diffs

<div class="text-sm opacity-75 mb-4">
Show code changes clearly
</div>

```diff
- const oldWay = function(x) {
-   return x * 2;
- };
+ const newWay = (x: number): number => x * 2;
```

---

# Images

<div class="text-sm opacity-75 mb-4">
Multiple ways to add visuals
</div>

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

**Inline**

```markdown
![Alt](/path/to/image.png)
```

```html
<img src="/logo.png" class="w-40" />
```

</div>

<div>

**As Background**

```yaml
---
background: https://source.unsplash.com/...
---
```

</div>

</div>

---
layout: image-right
image: https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800
backgroundSize: cover
---

# Image Layouts

Content on the left, image on the right

Available layouts:
- `image-left`
- `image-right`
- `cover` (full background)

---

# Local Images

<div class="text-sm opacity-75 mb-4">
Store images alongside your slides
</div>

```
slides/
├── your-category/
│   ├── your-slide.md
│   └── images/
│       ├── logo.png
│       └── diagram.svg
```

```markdown
![Logo](./images/logo.png)
```

```html
<img src="./images/logo.png" class="h-40" />
```

---

# Styling with UnoCSS

<div class="text-sm opacity-75 mb-4">
Use utility classes for styling
</div>

```html
<img src="./logo.png"
     class="w-32 h-32 rounded-full shadow-xl m-auto" />
```

<v-click>

<img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=128&h=128&fit=crop"
     class="w-32 h-32 rounded-full shadow-xl m-auto mt-4" />

</v-click>

<v-click>

Common utilities: `w-*`, `h-*`, `rounded`, `shadow`, `m-auto`, `opacity-*`

</v-click>

---
layout: center
class: text-center
---

# Start Building

<div class="mt-8">

```bash
cp slides/templates/starter.md slides/your-category/your-slide.md
pnpm dev your-slide
```

</div>

<div class="mt-12 text-sm opacity-75">

Learn more at [sli.dev](https://sli.dev)

</div>
