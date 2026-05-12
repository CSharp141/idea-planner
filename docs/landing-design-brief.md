# Idea Planner — Marketing Landing Page Design Brief

**Target URL**: https://idea-planner-ruby.vercel.app  
**Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS v3, Framer Motion, React Three Fiber + Drei, lucide-react  
**Date**: 2026-05-12  
**Status**: Implementation-ready design brief

---

## 1. Component Map

All landing page files live under `src/app/(marketing)/` to isolate from the authenticated app shell.

```
src/
├── app/
│   └── (marketing)/
│       ├── page.tsx                    # Landing page root — composes all sections
│       └── layout.tsx                  # Marketing layout (no auth shell, Geist font var)
├── components/
│   └── landing/
│       ├── Nav.tsx                     # Sticky nav with scroll-aware bg
│       ├── Hero.tsx                    # Full-viewport hero with 3D canvas
│       ├── HeroCanvas.tsx              # React Three Fiber scene (icosahedron)
│       ├── Problem.tsx                 # "Sound familiar?" 3-card grid
│       ├── Features.tsx                # Alternating feature rows
│       ├── AiDemo.tsx                  # Mock terminal / chat window
│       ├── Pricing.tsx                 # Pricing cards with billing toggle
│       ├── SocialProof.tsx             # Testimonial cards (placeholder)
│       ├── FooterCta.tsx               # Full-width footer CTA
│       └── motion/
│           ├── motionTokens.ts         # Shared variant factories + token constants
│           └── ReducedMotionWrapper.tsx # prefers-reduced-motion guard
```

### Page composition order in `page.tsx`

```
<Nav />
<main>
  <Hero />          {/* id="hero" */}
  <Problem />       {/* no anchor needed */}
  <Features />      {/* id="features" */}
  <AiDemo />
  <Pricing />       {/* id="pricing" */}
  <SocialProof />
  <FooterCta />
</main>
```

---

## 2. Color & Typography Tokens

All tokens are Tailwind utility classes. No CSS custom properties are introduced — the Tailwind config is not extended beyond what is already present.

### Color Palette

| Role | Tailwind class | Hex approx |
|---|---|---|
| Page background (hero, features, pricing, footer) | `bg-gray-950` | #030712 |
| Section background (problem, AI demo, social proof) | `bg-gray-900/30` or `bg-gray-900/50` | semi-transparent overlay |
| Card background | `bg-gray-800/50` | ~#1f2937 @ 50% |
| Card border default | `border border-white/10` | white 10% alpha |
| Card border hover | `hover:border-indigo-500/50` | indigo 50% alpha |
| Primary accent | `bg-indigo-600`, `text-indigo-500` | #4f46e5 / #6366f1 |
| Accent hover | `hover:bg-indigo-500` | #6366f1 |
| Featured card bg | `bg-indigo-950/30` | deep indigo tint |
| Featured card border | `border-indigo-500` | |
| Body text primary | `text-white` | |
| Body text secondary | `text-gray-400` | #9ca3af |
| Muted / placeholder text | `text-gray-600` | #4b5563 |
| AI message text | `text-indigo-400` | #818cf8 |
| Checkmark icon | `text-green-400` | #4ade80 |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950` | |

### Typography

Font: Geist Sans via CSS variable `--font-geist-sans` applied to `<html>` in the root layout. All text uses `font-sans` which maps to this variable.

| Element | Tailwind classes |
|---|---|
| Hero headline | `text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none text-white` |
| Hero sub-headline | `text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed` |
| Section heading (centered) | `text-3xl md:text-4xl font-bold text-white text-center` |
| Section heading (left-aligned) | `text-3xl md:text-4xl font-bold text-white` |
| Card heading | `text-xl font-semibold text-white` |
| Card body | `text-sm text-gray-400 leading-relaxed` |
| Feature headline | `text-2xl md:text-3xl font-bold text-white` |
| Feature body | `text-base text-gray-400 leading-relaxed` |
| Pill tag | `text-xs font-medium` |
| Nav links | `text-sm font-medium text-gray-400 hover:text-white transition-colors` |
| Price large | `text-4xl font-bold text-white` |
| Price period | `text-sm text-gray-400` |
| Footer headline | `text-4xl md:text-5xl font-bold text-white text-center` |

### Spacing Scale (landmark values)

| Use | Value |
|---|---|
| Section vertical padding (standard) | `py-24 md:py-32` |
| Section vertical padding (hero) | `min-h-screen` (height-driven, not padding-driven) |
| Footer CTA vertical padding | `py-32 md:py-40` |
| Container horizontal padding | `px-4 md:px-6 lg:px-8` |
| Max content width | `max-w-6xl mx-auto` |
| Card padding | `p-8` |
| Card gap in grid | `gap-6 md:gap-8` |
| Feature row gap (text ↔ visual) | `gap-12 lg:gap-20` |
| Between-section margin | None — sections are flush; bg color creates separation |

---

## 3. Motion System

### Token Constants (`motionTokens.ts`)

```ts
export const DURATION = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
} as const;

export const EASE = {
  enter: 'easeOut',
  exit: 'easeIn',
} as const;

export const STAGGER = 0.15; // seconds between siblings

export const VIEWPORT = {
  once: true,
  amount: 0.2, // fire when 20% of element is visible
} as const;
```

### Variant Factories

These factory functions return Framer Motion `Variants` objects. They accept a `reducedMotion: boolean` parameter (obtained from `useReducedMotion()` from Framer Motion).

```ts
// Fade + slide up (used for cards, hero text children)
export function fadeSlideUp(reducedMotion: boolean) {
  return {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : DURATION.normal,
        ease: EASE.enter,
      },
    },
  };
}

// Fade + slide from left (features odd rows, text side)
export function fadeSlideLeft(reducedMotion: boolean) {
  return {
    hidden: { opacity: 0, x: reducedMotion ? 0 : -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reducedMotion ? 0 : DURATION.slow, ease: EASE.enter },
    },
  };
}

// Fade + slide from right (features even rows, visual side)
export function fadeSlideRight(reducedMotion: boolean) {
  return {
    hidden: { opacity: 0, x: reducedMotion ? 0 : 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reducedMotion ? 0 : DURATION.slow, ease: EASE.enter },
    },
  };
}

// Scale up (used for pricing cards)
export function scaleUp(reducedMotion: boolean) {
  return {
    hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reducedMotion ? 0 : DURATION.normal, ease: EASE.enter },
    },
  };
}

// Stagger container (wraps staggered children)
export function staggerContainer(staggerChildren = STAGGER) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren },
    },
  };
}

// Hero above-fold fade (uses initial/animate, no whileInView)
export function heroFadeIn(reducedMotion: boolean, delayIndex: number) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : DURATION.normal,
        ease: EASE.enter,
        delay: reducedMotion ? 0 : delayIndex * 0.1,
      },
    },
  };
}
```

### Reduced Motion Rule

Every animated component calls `const reducedMotion = useReducedMotion()` from `framer-motion`. This boolean is passed into the variant factory. When `true`:
- All `y`/`x`/`scale` transforms are set to their resting values (no movement).
- `duration` is set to `0` (instant state change).
- Only `opacity` transitions remain, which is still acceptable.

The 3D canvas (`HeroCanvas.tsx`) pauses its animation loop when `reducedMotion` is true — the mesh is rendered static.

---

## 4. Section-by-Section Specs

---

### 4.1 Nav

**File**: `src/components/landing/Nav.tsx`  
**Type**: Client component (`'use client'`)

#### Layout

```
<header> (sticky top-0 z-50, transition-aware bg)
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- Logo group -->
    <a href="/" class="flex items-center gap-2 text-white font-semibold text-lg">
      💡  {/* or Lightbulb from lucide-react */}
      <span>Idea Planner</span>
    </a>

    <!-- Desktop nav links (hidden on mobile) -->
    <nav class="hidden md:flex items-center gap-8" aria-label="Main navigation">
      <a href="#features">Features</a>
      <a href="#pricing">Pricing</a>
      <a href="..." class="Sign Up Free button">Sign Up Free</a>
    </nav>

    <!-- Mobile hamburger (visible on mobile only) -->
    <button class="md:hidden" aria-label="Open menu" aria-expanded="...">
      <Menu /> {/* or X when open, from lucide-react */}
    </button>
  </div>

  <!-- Mobile drawer (conditionally rendered below header bar) -->
  <div class="md:hidden" (shown when menu open)>
    <!-- stacked links + CTA -->
  </div>
</header>
```

#### Scroll Behavior

Use a `useEffect` with a `scroll` event listener. Track `scrollY > 10`.

- At top: `bg-transparent border-transparent`
- Scrolled: `bg-gray-950/80 backdrop-blur-md border-b border-white/10`
- Transition: `transition-all duration-300`

Apply these classes to the `<header>` element directly via a `scrolled` boolean state.

#### Sign Up Free CTA Button

```
class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium 
       px-4 py-2 rounded-full transition-colors 
       focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
```

#### Mobile Menu

- State: `const [menuOpen, setMenuOpen] = useState(false)`
- Toggle icon: render `<X />` when open, `<Menu />` when closed (both from lucide-react, size 20)
- Drawer: `bg-gray-950/95 backdrop-blur-md px-4 py-6 flex flex-col gap-6` 
- Close on link click

#### ARIA

- `<header role="banner">`
- `<nav aria-label="Main navigation">`
- Hamburger button: `aria-label="Open navigation menu"` / `aria-label="Close navigation menu"`, `aria-expanded={menuOpen}`
- Mobile nav: `aria-label="Mobile navigation"`

---

### 4.2 Hero

**File**: `src/components/landing/Hero.tsx` + `src/components/landing/HeroCanvas.tsx`  
**Type**: Both client components

#### Outer wrapper

```
<section
  aria-label="Hero"
  class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
>
```

#### 3D Canvas Background (`HeroCanvas.tsx`)

```
<Canvas
  className="absolute inset-0 z-0"
  camera={{ position: [0, 0, 4], fov: 45 }}
  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
>
  <ambientLight intensity={0.3} />
  <pointLight position={[5, 5, 5]} intensity={0.8} color="#6366f1" />
  <pointLight position={[-5, -5, -5]} intensity={0.4} color="#7c3aed" />
  <IcosahedronMesh />
</Canvas>
```

`IcosahedronMesh` is a sub-component within `HeroCanvas.tsx`:

```tsx
function IcosahedronMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion(); // from framer-motion

  useFrame(() => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={meshRef} scale={2.2}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#4f46e5"
        wireframe
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}
```

Notes:
- `args={[1, 1]}` gives a 1-subdivision icosahedron — enough edges to look interesting, not so many it becomes a sphere.
- `wireframe + transparent + opacity={0.25}` keeps it dark and non-distracting.
- The purple-indigo color (`#4f46e5`) matches the indigo-600 accent.
- A radial gradient overlay (CSS `::after` pseudo or `<div>` child) fades the bottom of the canvas into `bg-gray-950` so it blends into the next section: `class="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-gray-950 pointer-events-none"`

#### Text Overlay

```
<div class="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
```

Each child is individually animated with `heroFadeIn(reducedMotion, index)` at `delayIndex` 0–4.

| Child | delayIndex | Content |
|---|---|---|
| Badge chip | 0 | "Now in Beta" |
| H1 headline | 1 | e.g. "Turn half-baked ideas into real projects" |
| Sub-headline `<p>` | 2 | e.g. "Capture, organise, and develop your side-project ideas with AI-powered structure." |
| CTA button row `<div>` | 3 | "Try Free" + "View on GitHub" |
| Scroll indicator | 4 | Animated chevron |

**Badge chip**:
```
class="inline-flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-500/30 
       text-indigo-300 text-xs font-medium px-3 py-1 rounded-full"
```

**H1** (max 8 words — "Turn half-baked ideas into real projects"):
```
class="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none text-white"
```

**Sub-headline** (max 20 words):
```
class="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
```

**CTA buttons row**:
```
class="flex flex-col sm:flex-row items-center gap-4"
```

Primary CTA "Try Free":
```
class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold 
       px-8 py-4 rounded-xl text-base transition-colors
       focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
```

Secondary CTA "View on GitHub":
```
class="border border-white/20 hover:border-white/40 text-white font-semibold 
       px-8 py-4 rounded-xl text-base transition-colors bg-transparent
       focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
```

**Scroll indicator**:
```
<div class="flex flex-col items-center gap-1 text-gray-600">
  <span class="text-xs">Scroll</span>
  <ChevronDown class="animate-bounce w-5 h-5" />
</div>
```

---

### 4.3 Problem

**File**: `src/components/landing/Problem.tsx`  
**Type**: Client component

#### Outer wrapper

```
<section
  aria-labelledby="problem-heading"
  class="bg-gray-900/50 py-24 md:py-32"
>
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
```

#### Section heading

```
<h2 id="problem-heading"
    class="text-3xl md:text-4xl font-bold text-white text-center mb-16">
  Sound familiar?
</h2>
```

#### Card grid

```
<motion.div
  variants={staggerContainer()}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
  class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
>
  {cards.map(card => (
    <motion.article
      key={card.id}
      variants={fadeSlideUp(reducedMotion)}
      class="bg-gray-800/50 border border-white/10 rounded-2xl p-8
             hover:border-indigo-500/50 transition-colors duration-300
             flex flex-col gap-4"
    >
      <card.Icon class="w-8 h-8 text-indigo-400" />
      <h3 class="text-xl font-semibold text-white">{card.title}</h3>
      <p class="text-sm text-gray-400 leading-relaxed">{card.description}</p>
    </motion.article>
  ))}
</motion.div>
```

#### Card content (3 cards)

**Card 1 — Ideas lost in the void**
- Icon: `Brain` (lucide-react)
- Title: "Ideas get lost the moment life gets busy"
- Body: "You had a great idea in the shower. By the time you opened a notes app, half of it was gone. Sound familiar?"

**Card 2 — No structure to develop**
- Icon: `Layers` (lucide-react)
- Title: "A list of ideas isn't the same as a plan"
- Body: "Notion pages and sticky notes don't ask the right questions. Your ideas stay shallow because nothing pushes them deeper."

**Card 3 — Hard to prioritise**
- Icon: `BarChart2` (lucide-react)
- Title: "You don't know which idea to pursue first"
- Body: "With no scoring, no structure, and no comparison — you default to whichever idea excited you most recently."

#### Animation

The `<motion.div>` grid wrapper uses `staggerContainer()` (stagger 0.15s).  
Each `<motion.article>` uses `fadeSlideUp(reducedMotion)` (y: 40→0, opacity: 0→1, duration: 0.4s, easeOut).  
`whileInView="visible"` with `viewport={{ once: true, amount: 0.2 }}`.

---

### 4.4 Features

**File**: `src/components/landing/Features.tsx`  
**Type**: Client component

#### Outer wrapper

```
<section
  id="features"
  aria-labelledby="features-heading"
  class="bg-gray-950 py-24 md:py-32"
>
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
```

#### Section heading (left-aligned)

```
<h2 id="features-heading"
    class="text-3xl md:text-4xl font-bold text-white mb-20">
  Built for the way developers think
</h2>
```

#### Feature rows

Three rows. Rows 1 and 3: text left, visual right. Row 2: visual left, text right. On mobile all rows stack to single column, text always above visual.

Row wrapper:
```
<div class="flex flex-col md:flex-row items-center gap-12 lg:gap-20 [odd row: md:flex-row-reverse for row 2]">
```

**Text side** (motion — slides from its starting side):
```
<motion.div
  variants={fadeSlideLeft(reducedMotion)}  {/* or Right for even rows */}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
  class="flex-1 flex flex-col gap-4"
>
  <span class="inline-flex w-fit items-center gap-1 bg-indigo-950/60 border border-indigo-500/30
               text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
    {feature.tag}
  </span>
  <h3 class="text-2xl md:text-3xl font-bold text-white">{feature.headline}</h3>
  <p class="text-base text-gray-400 leading-relaxed">{feature.body}</p>
</motion.div>
```

**Visual side** (motion — slides from opposite side):
```
<motion.div
  variants={fadeSlideRight(reducedMotion)}  {/* or Left for even rows */}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
  class="flex-1"
>
  <div class="aspect-video rounded-2xl bg-gradient-to-br {gradient} 
              border border-white/10 flex items-center justify-center">
    <feature.Icon class="w-16 h-16 text-white/30" />
  </div>
</motion.div>
```

Row separation: `mb-24 md:mb-32` on each row except the last.

#### Feature content

**Feature 1 — AI Interview**
- Tag: "AI-Powered"
- Headline: "An AI that interrogates your idea, not just stores it"
- Body: "Our AI asks targeted questions — problem validation, market fit, technical scope. You leave with a structured brief, not a raw dump of thoughts."
- Icon: `MessageSquare` (lucide-react)
- Visual gradient: `from-indigo-950 via-purple-950 to-gray-900`

**Feature 2 — Idea Dashboard**
- Tag: "Organisation"
- Headline: "Every idea in one place, sorted by momentum"
- Body: "View all your ideas at a glance. Filter by status, sort by score, and instantly see which ones deserve your next sprint."
- Icon: `LayoutDashboard` (lucide-react)
- Visual gradient: `from-gray-900 via-indigo-950 to-gray-900`

**Feature 3 — GitHub Integration**
- Tag: "Developer-Native"
- Headline: "From idea to repo in one click"
- Body: "When an idea graduates to a real project, kick off a GitHub repo directly from the dashboard — no context switching required."
- Icon: `GitBranch` (lucide-react)
- Visual gradient: `from-gray-900 via-purple-950 to-indigo-950`

---

### 4.5 AI Demo

**File**: `src/components/landing/AiDemo.tsx`  
**Type**: Client component

#### Outer wrapper

```
<section
  aria-labelledby="demo-heading"
  class="bg-gray-900/30 py-24 md:py-32"
>
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-12">
```

#### Section heading

```
<h2 id="demo-heading"
    class="text-3xl md:text-4xl font-bold text-white text-center">
  See the AI in action
</h2>
```

#### Chat window card

```
<motion.div
  variants={fadeSlideUp(reducedMotion)}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
  class="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
>
```

**Window chrome bar** (fake terminal dots):
```
<div class="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-gray-950/50">
  <div class="w-3 h-3 rounded-full bg-red-500/70" />
  <div class="w-3 h-3 rounded-full bg-yellow-500/70" />
  <div class="w-3 h-3 rounded-full bg-green-500/70" />
  <span class="ml-3 text-xs text-gray-600 font-mono">idea-planner — AI interview</span>
</div>
```

**Message area**:
```
<div class="p-6 flex flex-col gap-4 min-h-[240px]">
```

AI message bubble:
```
<div class="flex flex-col gap-1">
  <span class="text-xs font-medium text-indigo-400 font-mono">AI</span>
  <p class="text-sm text-indigo-300 leading-relaxed">{currentQA.question}</p>
</div>
```

User message bubble (typewriter):
```
<div class="flex flex-col gap-1">
  <span class="text-xs font-medium text-gray-500 font-mono">You</span>
  <p class="text-sm text-white leading-relaxed font-mono">
    {displayedAnswer}<span class="animate-pulse">|</span>
  </p>
</div>
```

**Timing logic (useEffect)**:

State: `const [currentIndex, setCurrentIndex] = useState(0)` and `const [displayedAnswer, setDisplayedAnswer] = useState('')`.

Cycle:
1. On mount / index change: start typing `displayedAnswer` char by char, `setInterval` at 50ms per character.
2. When answer is fully typed: `setTimeout(2000)` then `setCurrentIndex((i) => (i + 1) % QA_PAIRS.length)` and reset `displayedAnswer`.
3. Clear all intervals/timeouts on cleanup.

The AI question fades in with a simple `key`-based re-mount opacity animation (`transition-opacity duration-300`).

**Q&A pairs** (3 pairs):

```ts
const QA_PAIRS = [
  {
    question: "What problem does this idea actually solve — and who has that problem today?",
    answer: "Developers who have too many ideas and no structure to prioritise them.",
  },
  {
    question: "What would make someone pay for this instead of using a free alternative?",
    answer: "The AI interview — nothing else asks the hard questions automatically.",
  },
  {
    question: "What's the smallest version of this you could ship in a weekend?",
    answer: "A single-page form that captures an idea and outputs a structured brief.",
  },
];
```

---

### 4.6 Pricing

**File**: `src/components/landing/Pricing.tsx`  
**Type**: Client component

#### Outer wrapper

```
<section
  id="pricing"
  aria-labelledby="pricing-heading"
  class="bg-gray-950 py-24 md:py-32"
>
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-12">
```

#### Section heading

```
<h2 id="pricing-heading"
    class="text-3xl md:text-4xl font-bold text-white text-center">
  Simple, transparent pricing
</h2>
```

#### Billing toggle

State: `const [annual, setAnnual] = useState(false)`

```
<div
  role="group"
  aria-label="Billing period"
  class="flex items-center bg-gray-900 border border-white/10 rounded-full p-1"
>
  <button
    onClick={() => setAnnual(false)}
    aria-pressed={!annual}
    class={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${!annual ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
  >
    Monthly
  </button>
  <button
    onClick={() => setAnnual(true)}
    aria-pressed={annual}
    class={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${annual ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
  >
    Annual
    <span class="ml-1.5 text-xs text-green-400 font-medium">−20%</span>
  </button>
</div>
```

#### Pricing cards grid

```
<motion.div
  variants={staggerContainer(0.1)}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
  class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
>
```

Each card:
```
<motion.div
  variants={scaleUp(reducedMotion)}
  class="... (see per-card classes below)"
>
```

**Card: Free**
```
class="bg-gray-900/50 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
```
- Plan name: `<p class="text-sm font-medium text-gray-400">Free</p>`
- Price: `<span class="text-4xl font-bold text-white">$0</span><span class="text-sm text-gray-400"> /forever</span>`
- Features: unlimited idea capture, basic AI prompts (3/month), public dashboard

**Card: Pro** (highlighted)
```
class="bg-indigo-950/30 border border-indigo-500 rounded-2xl p-8 flex flex-col gap-6 relative"
```
- "Most Popular" badge (absolute positioned, top edge):
  ```
  class="absolute -top-3 left-1/2 -translate-x-1/2 
         bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full"
  ```
- Price: `$9/mo` (monthly) or `$7/mo` (annual)
- Features: unlimited ideas, unlimited AI interviews, GitHub integration, priority support
- CTA button: indigo solid (`bg-indigo-600 hover:bg-indigo-500`)

**Card: Team**
```
class="bg-gray-900/50 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
```
- Price: `$29/mo` (monthly) or `$24/mo` (annual), shown as team price not per-seat
- Features: everything in Pro, 5 team members, shared idea library, admin controls, priority onboarding

#### Card anatomy (each)

```
<div class="flex flex-col gap-6">
  <!-- Plan name -->
  <!-- Price block -->
  <hr class="border-white/10" />
  <!-- Feature list -->
  <ul class="flex flex-col gap-3 flex-1">
    {features.map(f => (
      <li class="flex items-start gap-2 text-sm text-gray-300">
        <Check class="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
        {f}
      </li>
    ))}
  </ul>
  <!-- CTA button -->
  <button class="w-full py-3 rounded-xl font-semibold text-sm transition-colors
                 {plan === 'pro' ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                 : 'bg-white/10 hover:bg-white/15 text-white'}
                 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950">
    {plan === 'free' ? 'Get Started Free' : plan === 'pro' ? 'Start Free Trial' : 'Contact Sales'}
  </button>
</div>
```

---

### 4.7 Social Proof

**File**: `src/components/landing/SocialProof.tsx`  
**Type**: Client component

#### Placeholder banner

```
<p class="text-center text-xs text-gray-600 font-mono mb-8">
  [ Placeholder — replace before launch ]
</p>
```

#### Outer wrapper

```
<section
  aria-labelledby="social-heading"
  class="bg-gray-900/30 py-24 md:py-32"
>
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-12">
```

#### Section heading

```
<h2 id="social-heading"
    class="text-3xl md:text-4xl font-bold text-white text-center">
  What people are saying
</h2>
```

#### Testimonial cards grid

```
<motion.div
  variants={staggerContainer()}
  initial="hidden"
  whileInView="visible"
  viewport={VIEWPORT}
  class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
>
```

Each card:
```
<motion.article
  variants={fadeSlideUp(reducedMotion)}
  class="bg-gray-800/50 border border-white/10 rounded-2xl p-8 flex flex-col gap-6"
>
  <blockquote class="text-sm text-gray-300 leading-relaxed flex-1">
    "{quote}"
  </blockquote>
  <div class="flex items-center gap-3">
    <!-- Avatar -->
    <div class="w-10 h-10 rounded-full bg-gradient-to-br {avatarGradient}
                flex items-center justify-center text-sm font-bold text-white shrink-0">
      {initials}
    </div>
    <div>
      <p class="text-sm font-semibold text-white">{name}</p>
      <p class="text-xs text-gray-500">{role}</p>
    </div>
  </div>
</motion.article>
```

#### Placeholder testimonials (3)

**Testimonial 1**
- Quote: "Finally an app that forces me to think properly about an idea before I waste a weekend building the wrong thing."
- Name: "Alex M."
- Role: "Indie hacker"
- Initials: "AM"
- Avatar gradient: `from-indigo-600 to-purple-600`

**Testimonial 2**
- Quote: "The AI interview is genuinely uncomfortable in the best way. It asks questions I'd been avoiding."
- Name: "Sam K."
- Role: "Fullstack developer"
- Initials: "SK"
- Avatar gradient: `from-purple-600 to-pink-600`

**Testimonial 3**
- Quote: "I went from 30 half-formed ideas to 5 properly scoped ones in an afternoon. My Friday nights thank me."
- Name: "Jordan T."
- Role: "Solo founder"
- Initials: "JT"
- Avatar gradient: `from-cyan-600 to-indigo-600`

---

### 4.8 Footer CTA

**File**: `src/components/landing/FooterCta.tsx`  
**Type**: Client component (star count could be a server component or RSC if fetched at build time)

#### Outer wrapper

```
<section
  aria-labelledby="footer-cta-heading"
  class="bg-gray-950 py-32 md:py-40"
>
  <div class="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col items-center gap-8 text-center">
```

#### Content

**Headline**:
```
<h2 id="footer-cta-heading"
    class="text-4xl md:text-5xl font-bold text-white">
  Your next big idea is waiting
</h2>
```

**Sub-line**:
```
<p class="text-lg text-gray-400 max-w-md">
  Join developers and makers who stopped losing ideas and started building.
</p>
```

**Primary CTA button**:
```
class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold 
       px-10 py-4 rounded-full text-base transition-colors
       focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
```
Label: "Sign Up Free — it's free forever"

**GitHub star badge**:

Fetched server-side (or via SWR) from `https://api.github.com/repos/{owner}/{repo}`.

```
<a
  href="https://github.com/{owner}/{repo}"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Star Idea Planner on GitHub — {count} stars"
  class="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 
         border border-white/10 text-white text-sm font-medium
         px-4 py-2 rounded-full transition-colors"
>
  <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
  <span>{count} stars on GitHub</span>
</a>
```

If the count is unavailable / in error state: render the badge without a number ("Star on GitHub").

**Minimal footer bar** (separate from the CTA section — sits below):
```
<footer class="border-t border-white/5 bg-gray-950">
  <div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 
              flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-sm text-gray-600">© 2026 Idea Planner. All rights reserved.</p>
    <nav aria-label="Footer links" class="flex items-center gap-6">
      <a href="/privacy" class="text-sm text-gray-600 hover:text-gray-400 transition-colors">Privacy</a>
      <a href="/terms" class="text-sm text-gray-600 hover:text-gray-400 transition-colors">Terms</a>
    </nav>
  </div>
</footer>
```

---

## 5. Responsive Notes

### Breakpoints used

| Breakpoint | Prefix | Value |
|---|---|---|
| Mobile | (none / default) | < 768px |
| Tablet | `md:` | ≥ 768px |
| Desktop | `lg:` | ≥ 1024px |

### Section-by-section responsive behaviour

**Nav**
- Mobile: hamburger only, drawer on toggle, no inline links
- Tablet+: inline horizontal links + CTA button, no hamburger

**Hero**
- Mobile: `text-4xl` headline (override from `text-5xl`), `flex-col` CTA buttons, canvas persists but is less visible with reduced viewport height
- Desktop: `text-7xl` headline, side-by-side CTAs

**Problem cards**
- Mobile: `grid-cols-1`, full-width cards
- Tablet+: `grid-cols-3`

**Features rows**
- Mobile: `flex-col` for all rows, text block first then visual block. Ignore `md:flex-row-reverse` on mobile — stack order is always text-first.
- Tablet+: alternating row direction as specified

**AI Demo**
- Mobile: `max-w-full` (card spans full container width)
- Tablet+: `max-w-2xl` centered

**Pricing cards**
- Mobile: `grid-cols-1`, "Most Popular" Pro card appears in middle of stack
- Tablet+: `grid-cols-3`, Pro card sits in center column

**Social Proof**
- Same responsive pattern as Problem cards: `grid-cols-1` mobile, `grid-cols-3` tablet+

**Footer CTA**
- Mobile: reduced padding `py-24`, headline `text-3xl`
- Desktop: `py-40`, headline `text-5xl`

---

## 6. Accessibility Checklist

### Landmarks
- `<header role="banner">` — Nav
- `<main>` — wraps all sections
- Each section uses `<section aria-labelledby="[id]">` pointing to its `<h2>`
- `<footer role="contentinfo">` — bottom footer bar
- `<nav aria-label="...">` — all nav elements are labelled

### Headings
- Single `<h1>` in Hero (the main headline)
- All section headings are `<h2>`
- All card titles within sections are `<h3>`
- No heading levels are skipped

### Focus management
- All interactive elements receive the standardised focus ring: `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950`
- `focus-visible` only (not `focus:`) — avoids visual noise for mouse users
- Tab order follows DOM order (no `tabindex > 0`)

### Color contrast (WCAG AA — 4.5:1 minimum for normal text)
- White (`#ffffff`) on `bg-gray-950` (`#030712`): ~21:1 — passes
- `text-gray-400` (`#9ca3af`) on `bg-gray-950`: ~7:1 — passes
- `text-indigo-300` (`#a5b4fc`) on `bg-gray-900` (`#111827`): ~7.5:1 — passes
- `text-indigo-400` (`#818cf8`) on `bg-gray-900`: ~5.5:1 — passes AA
- `text-green-400` (`#4ade80`) on `bg-gray-900`: ~9:1 — passes
- `text-gray-600` (`#4b5563`) on `bg-gray-950`: ~3.5:1 — **fails AA**; used only for decorative/placeholder text (terminal dots labels, placeholder banner). Flag for review if this text is ever load-bearing.

### Images and icons
- All lucide-react icons that carry semantic meaning have `aria-label` on their parent button
- Purely decorative icons use `aria-hidden="true"`
- The 3D canvas has `aria-hidden="true"` — it is decorative

### Forms and buttons
- All buttons have descriptive labels (not just "Click here")
- Pricing CTA buttons specify the plan: "Get Started Free", "Start Free Trial", "Contact Sales"
- The billing toggle uses `aria-pressed` for each option
- The theme toggle in Nav uses `role="group"` and `aria-label="Billing period"`

### Motion
- `useReducedMotion()` from Framer Motion is called in all animated components
- When `true`: all transforms removed, durations set to 0, only opacity transitions remain
- 3D canvas rotation stops when reduced motion is preferred
- Typewriter effect in AI Demo uses `setInterval` — when reduced motion preferred, skip the interval and render the full answer immediately

### Keyboard navigation
- Hamburger menu is a `<button>` — activates on Enter/Space
- Mobile menu items are reachable via Tab when menu is open
- Pricing billing toggle buttons are standard `<button>` elements — keyboard operable
- All anchor `<a>` links with `href` are keyboard reachable by default

### Semantic HTML
- Testimonials use `<blockquote>` for the quote text
- Pricing feature lists use `<ul>` + `<li>`
- Feature sections use `<article>` for individual cards
- Footer legal links are within a `<nav aria-label="Footer links">`
