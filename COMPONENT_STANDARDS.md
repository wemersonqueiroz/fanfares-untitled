# Fanfares Component Standards

Reference document for building new components. Read this before writing any code.

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (see `AGENTS.md` — has breaking API changes, read `/node_modules/next/dist/docs/` before using any Next.js API) |
| Language | TypeScript — strict, `"use client"` at the top of every interactive component |
| Styling | Tailwind CSS v4 |
| Icons | `@untitledui/icons` exclusively |
| Utilities | `cx` from `@/utils/cx` for conditional class merging |

---

## 2. Design Tokens

### App surface tokens (globals.css)
These are the Fanfares-specific tokens. Always prefer these over raw colors.

```
bg-app-bg               page / shell background (darkest)
bg-app-surface          nav panels, player bar        → dark: #0c0e12
bg-app-card             raised card surface           → dark: #13161b
bg-app-card-active      card hover / active state     → dark: #1a1e25
bg-app-border           borders & dividers            → dark: #22262f  ← use for border color too
bg-app-border-hover     elevated border / hover       → dark: #373a41
bg-app-surface-raised   quaternary bg layer           → dark: #373a41
bg-app-track            seek / progress track         → dark: #3d4047
bg-overlay-btn          frosted-glass cover art btn   → rgb(91 90 87 / 0.4)
```

### Text tokens (theme.css — use these, never raw hex)
```
text-text-primary       main readable text
text-text-secondary     secondary / subdued text
text-text-tertiary      metadata, timestamps, labels
text-text-quaternary    very subdued (placeholder-level in light mode)
text-text-placeholder   input placeholder
text-text-error-primary error messages
text-text-white         always white regardless of mode
```

### Border tokens
```
border-app-border        standard dividers & card outlines
border-app-border-hover  hover-state borders
```

### Brand tokens
```
bg-brand-600    primary brand button background
bg-brand-700    brand button hover
text-brand-500  brand link / icon color
ring-brand-500  focus ring color
```

### Dark mode rule
**The app uses `.dark-mode` CSS class on `<html>` — NOT Tailwind's `dark:` prefix.**  
Do not write `dark:bg-*` — it will never fire. Write the default as dark-first since the app is primarily dark.

---

## 3. Typography

### Font
Inter — loaded via `--font-inter` Next.js variable, applied globally in `globals.css`.

### Size / line-height scale (theme.css tokens)
```
--text-xs          12px / 18px
--text-sm          14px / 20px
--text-md          16px / 24px
--text-lg          18px / 28px
--text-xl          20px / 30px
--text-display-xs  24px / 32px
--text-display-sm  30px / 38px
--text-display-md  36px / 44px  (letter-spacing: -0.72px)
--text-display-lg  48px / 60px  (letter-spacing: -0.96px)
--text-display-xl  60px / 72px  (letter-spacing: -1.2px)
```

### Role utility classes (type-roles.css)
Prefer these over raw `text-* font-*` combinations — they match the Figma vocabulary.

| Class | Size | Weight | Use for |
|---|---|---|---|
| `text-heading-hero` | 60px | 700 | Hero banners |
| `text-heading-cover` | 48px | 700 | Page cover titles |
| `text-heading-section` | 30px | 600 | Section headings |
| `text-heading-section-strong` | 30px | 700 | Bold section headings |
| `text-heading-list-item` | 20px | 600 | List item / large card titles |
| `text-heading-list-item-strong` | 20px | 700 | Bold list item titles |
| `text-heading-card` | 16px | 600 | Card titles, small headings |
| `text-subhead` | 18px | 700 | Panel labels, sub-headings |
| `text-body-large` | 18px | 400 | Body copy (large) |
| `text-body-emphasis` | 16px | 500 | Emphasised body copy |
| `text-body-default` | 16px | 400 | Default body copy |
| `text-body-small` | 14px | 400 | Secondary copy, captions |
| `text-label-button` | 14px | 600 | Button labels |
| `text-label-badge` | 14px | 500 | Badges, tags |
| `text-eyebrow` | 12px | 700 | Section eyebrow labels (usually `uppercase`) |
| `text-stat` | 18px | 500 | Stat numbers, metrics |

---

## 4. Component Anatomy

### File locations
```
src/components/ComponentName/index.tsx      multi-file component
src/components/ComponentName/SubPart.tsx    sub-file (not exported from index unless needed)
src/components/ComponentName/index.ts       barrel — only when directory has multiple exports
src/components/ComponentName.tsx            single-file component (no directory)
```

### Mandatory file structure
```tsx
"use client"  // always first line for interactive components

// 1. External imports
import { useState } from "react"
import { SomeIcon } from "@untitledui/icons"
import { cx } from "@/utils/cx"
import { Button } from "@/components/Button"

// 2. Public types — EXPORT everything a consumer needs
export type ComponentProps = {
  // required first, optional last
  title: string
  onAction?: () => void
  className?: string
}

// 3. Internal types — do NOT export
type InternalState = { ... }

// 4. Static constants / configs — outside component to avoid re-creation
const CONFIG = { ... }

// 5. Internal sub-components — do NOT export (implementation details)
function SubPiece({ ... }: { ... }) { ... }

// 6. Main exported component — always a named export, never default
export function ComponentName({ title, onAction, className }: ComponentProps) {
  return ( ... )
}
```

### Section comments
Use these dividers inside files:
```ts
// ── Public types ──────────────────────────────────────────────────────────────
// ── Internals ─────────────────────────────────────────────────────────────────
// ── Component ─────────────────────────────────────────────────────────────────
// ── Sub-components ────────────────────────────────────────────────────────────
```

### Export rules
- **Always named exports** — never `export default`
- Export all types a consumer needs (`Props`, `Variant`, `Size` union types)
- Never export internal sub-components or internal types
- Barrel `index.ts`: add it only when the directory has 2+ files that consumers need to import from — not just for convenience

### Mock data location
**Never** put `mock-data.ts` inside a component folder. All demo data lives in `src/mocks/`:

```
src/mocks/
  picsum.ts         # shared Picsum URL helpers (sq, wide, vid, book, av, ...)
  content-page.ts   # ContentPage variant mocks (audiobook, podcast, video, etc.)
  feed.ts
  library.ts
  wishlist.ts
  explore.ts
  profile.ts
  store.ts
```

Components import demo data from `@/mocks/<name>`. Routes too. **Never redefine Picsum helpers inline** — import from `@/mocks/picsum`. New aspect ratios go in `picsum.ts` as a new named export, not as a duplicate local function.

### File splitting policy
A file is a feature module pretending to be a component when **any** of these is true:
- Over ~500 lines
- 6+ `useState` calls in one component
- Holds 3+ visually distinct sub-views that don't share render code

When the threshold is crossed: split into a folder. The `index.tsx` becomes the orchestrator/dispatcher, and each sub-view gets its own file:
```
src/components/Settings/
  index.tsx              # shell + list view + section dispatcher
  AppearanceSection.tsx
  NotificationsSection.tsx
  PlaceholderSection.tsx
  internals/SectionFooter.tsx   # only if shared by 2+ sections
```

### `"use client"` policy
Default to **server component**. Only add `"use client"` when the file actually needs:
- React hooks (`useState`, `useEffect`, `useRef`, `useContext`, custom hooks)
- Browser-only APIs (`window`, `document`, `localStorage`)
- Event handlers as the file's primary concern (interactive primitives)

Display-only components (heading, byline, fade overlay, card markup, icon wrapper) are server components — they import smaller and the boundary cascades only as far as it needs to.

When a server component renders an interactive child, the child carries its own `"use client"`. The parent stays server.

---

## 4½. Route Architecture

Every route follows the same shell. Don't reinvent the column structure per route — compose with the primitives below.

### `<AppPage>` — `@/components/AppShell` (non-content routes)
Standard 3-column shell for Library, Wishlist, Explore, Profile, Store, Settings, Feed.

```tsx
import { AppPage } from "@/components/AppShell"

export default function MyRoute() {
  return (
    <AppPage
      center={<MyPageContent ... />}
      // right defaults to the standard video DemoContentRightAside
      // pass right={null} to suppress
      // pass right={<DemoContentRightAside contentType="audiobook" mock={...} />} to override
    />
  )
}
```

AppPage owns: the full-screen wrapper, `bg-app-bg`, the 3-column `PageColumns`, the `DemoFanfaresMenu` (left), and the `DemoMobileBottomNav` (bottom). Routes only provide the center.

### `<ContentPage>` + variants — `@/components/ContentPage` (content routes)
Audiobook, podcast, video, video-series, article, note routes use `ContentPage` directly (or its `VideoPage` / `ArticlePage` / `NotePage` variants for tweaked top sections). All demo state + 30+ callbacks come from `useContentPageDemo`:

```tsx
import { ContentPage } from "@/components/ContentPage"
import { useContentPageDemo } from "@/components/ContentPage/use-content-page-demo"
import { MOCK_AUDIOBOOK_PAGE } from "@/components/ContentPage/mock-data"

export default function AudiobookPage() {
  const demo = useContentPageDemo({ defaultTab: "chapters" })
  return <ContentPage {...MOCK_AUDIOBOOK_PAGE} {...demo} />
}
```

`useContentPageDemo(opts)` accepts `{ defaultTab, withPlayer, chapterNoun }` and returns activeHref, user, player state, every onPlay/onChapterPlay/onShare/onComment/etc. — fully spreadable into ContentPage.

### `<PageColumns>` — `@/components/PageColumns`
Owns column widths and scroll behavior. Used by `AppPage` and `ContentPage` internally. **Routes should not import this directly.** If a width or padding feels off, fix it in `PageColumns` so every route changes together.

```tsx
<PageColumns
  left={<FanfaresMenu ... />}
  center={...}             // capped at max-w-content-center (971px)
  right={<...Aside />}     // optional 352px right sidebar
/>
```

### `<RoutePageTitle>` — `@/components/RoutePageTitle`
The standardized top-of-page heading used by Library, Wishlist, Explore, Settings, and Settings sub-sections.

```tsx
import { RoutePageTitle } from "@/components/RoutePageTitle"

<RoutePageTitle title="My Library" />
<RoutePageTitle title="Settings" action={<SearchBar />} />
<RoutePageTitle title="Appearance" onBack={() => setActiveSection(null)} />
```

`text-heading-section-strong` (30px / display-sm) is the route-title size. **Don't write `<h1>` for route titles inline** — use `RoutePageTitle`.

### Demo handlers
Routes are demos right now, so callbacks default to `console.log`. The demo handlers live in:
- `useContentPageDemo()` — content routes (audiobook/podcast/video/article/note/video-series)
- `useBrowseDemo()` — list pages (Library/Wishlist/Explore)
- `useFeedDemo()` — Feed route
- `useProfileDemo()` — Profile route (includes `router.back()` wiring)
- `useStoreDemo()` — Store route
- `<DemoFanfaresMenu>`, `<DemoMobileBottomNav>`, `<DemoContentRightAside>` — shell pieces

All demo hooks are re-exported from `@/components/AppShell`. **Never inline `console.log` callbacks in a route file** — add them to (or use) the appropriate `useXxxDemo()` hook so a real-app migration only edits one file. Spread the hook result into the consumer: `<LibraryPage {...useBrowseDemo()} />`.

Real-app integrations replace these by passing real callbacks via the underlying components (`FanfaresMenu`, `MobileBottomNav`, `ContentRightAside`, `LibraryPage`, etc.) — the `Demo*` wrappers and `useXxxDemo` hooks stay opt-in.

---

## 5. Shared Component Catalog

### `Button` — `@/components/Button`
For all CTA / action buttons.

```tsx
import { Button } from "@/components/Button"

// variants
<Button variant="primary">Save</Button>        // brand filled
<Button variant="secondary">Cancel</Button>     // bordered
<Button variant="tertiary">Show all</Button>    // text-only
<Button variant="destructive">Delete</Button>   // red filled

// sizes
<Button size="sm">Small</Button>   // px-3 py-2 text-sm
<Button size="md">Medium</Button>  // px-4 py-[10px] text-base (default)
<Button size="lg">Large</Button>   // px-5 py-3 text-base

// with icons
<Button variant="secondary" iconLeft={FilterLines}>Sort</Button>
<Button variant="secondary" iconRight={ChevronDown}>All</Button>

// full-width (pass className)
<Button variant="primary" size="lg" className="w-full rounded-lg">Post</Button>
```

**Never write a raw `<button>` for standard actions.** Exceptions are documented below.

### `IconButton` — `@/components/IconButton`
For icon-only buttons (no label text).

```tsx
import { IconButton } from "@/components/IconButton"

// variants
<IconButton icon={DotsHorizontal} label="Options" variant="ghost" size="sm" />
// ghost         → text-tertiary, hover text-primary (toolbar / menu icons)
// ghost-primary → text-primary, hover opacity-80 (back arrows, media controls)
// card          → bg-app-card rounded-full, hover bg-app-card-active (circle buttons)

// sizes (container / default icon)
// xs → 20px container / 14px icon
// sm → 24px container / 18px icon  ← most common
// md → 32px container / 20px icon
// lg → 40px container / 20px icon

// custom icon size override
<IconButton icon={Expand01} label="Expand" variant="ghost-primary" iconSize={18} />
```

### `FilterPill` — `@/components/FilterPill`
Active/inactive category toggle pill.

```tsx
import { FilterPill } from "@/components/FilterPill"

<FilterPill label="Music" isActive={active === "music"} onClick={() => setActive("music")} />
```

### `SegmentedControl` — `@/components/SegmentedControl`
Bordered grouped toggle (view filters, time periods).

```tsx
import { SegmentedControl } from "@/components/SegmentedControl"

const OPTIONS = ["Grid", "List"] as const
<SegmentedControl options={OPTIONS} value={view} onChange={setView} />
```

### `Avatar` — `@/components/Avatar`
User avatars — falls back to initials when no `src`.

```tsx
import { Avatar } from "@/components/Avatar"

// sizes: "xs" | "sm" | "md" | "lg" | "xl"
<Avatar src={user.avatarUrl} name={user.name} size="md" className="border border-black/10" />
```

### `Modal` — `@/components/Modal`
Generic modal shell — overlay, card, Escape key, click-outside, X close.

```tsx
import { Modal } from "@/components/Modal"

<Modal isOpen={open} onClose={() => setOpen(false)} ariaLabel="Edit profile">
  {/* children */}
</Modal>

// props
// maxWidth?: string   default "max-w-[760px]"
// showClose?: boolean default true
// className?: string  extra classes on the card div
```

### `CreatorByline` — `@/components/CreatorByline`
Avatar + name + handle (+ optional meta line). Used in ContentPage creator header, ContentCard, comment authors.

```tsx
import { CreatorByline } from "@/components/CreatorByline"

<CreatorByline
  name={creator.name}
  handle={creator.handle}
  meta={creator.publishedAt}   // optional second-line metadata (date, timestamp)
  avatarUrl={creator.avatarUrl}
  size="lg"                    // xs / sm / md / lg / xl
  nameColor="primary"          // "primary" (default) | "secondary"
  inlineMeta                   // render handle · meta on one line (comment rows)
/>
```

**Never inline the avatar + name + handle stack.** Use this.

### `HeroTitle` — `@/components/HeroTitle`
Standardized content-page heading: large title + optional subtitle.

```tsx
import { HeroTitle } from "@/components/HeroTitle"

<HeroTitle title={title} subtitle={creator.name} />
<HeroTitle title={noteTitle} size="sm" />   // size: "sm" | "lg" (default)
```

### `FadingDescription` — `@/components/FadingDescription`
Description text clipped to a max height with a bottom gradient fade — used in ContentPage / VideoPage hero sections.

```tsx
import { FadingDescription } from "@/components/FadingDescription"

<FadingDescription text={description} />
<FadingDescription text={description} maxHeightClass="h-chapter-list" fadeHeightClass="h-14" />
```

### `SearchInput` — `@/components/SearchInput`
App-wide search input with leading magnifying glass and an optional ⌘K shortcut badge. Used in Library, Wishlist, Explore.

```tsx
import { SearchInput } from "@/components/SearchInput"

<SearchInput value={search} onChange={setSearch} ariaLabel="Search library" />
```

### `CategoryPillsRow` — `@/components/CategoryPillsRow`
Horizontal-scrollable row of FilterPills.

```tsx
import { CategoryPillsRow } from "@/components/CategoryPillsRow"

<CategoryPillsRow options={CATEGORIES} value={activeCategory} onChange={setActiveCategory} />
```

### `DEFAULT_BROWSE_SORT_OPTIONS` — `@/components/SortDropdown`
Don't redefine the standard 5-option sort menu (Date Added / Price asc / Price desc / Alphabetical / Recents). Import it.

```tsx
import { SortDropdown, DEFAULT_BROWSE_SORT_OPTIONS } from "@/components/SortDropdown"

<SortDropdown options={DEFAULT_BROWSE_SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
```

---

## 6. Shared Compose Primitives — `@/components/ComposeShared`

All `Compose*` creation flows share a set of building-block components. **Never re-implement these inline** — import from `@/components/Compose`.

### Available primitives

| Component | Import | Use for |
|---|---|---|
| `FieldLabel` | `@/components/Compose` | Every form field label inside a Compose* step |
| `TextInput` | `@/components/Compose` | Standalone text input — replaces the long `"w-full px-3 h-10 rounded-lg…"` className |
| `FieldRow` | `@/components/Compose` | Bordered row wrapping compound inputs (icon + input, select + dropdown, etc.) |
| `RichTextArea` | `@/components/Compose` | Rich-text description fields (bold/italic/underline/list toolbar) |
| `ImageDropzone` | `@/components/Compose` | Any image upload field with drag-and-drop |
| `TagsInput` | `@/components/Compose` | Tag chips + input row |
| `CreatorsField` | `@/components/Compose` | Full creators block — list + add row + npub/role state |
| `RssFeedField` | `@/components/Compose` | Labelled RSS Feed URL input with the Rss01 icon |
| `useTagsField` | `@/components/Compose` | Hook that binds a `TagsInput` to a `string[]` field on the form values — owns trim, strip-`#`, dedupe |
| `AccordionPanel` | `@/components/Compose` | Numbered collapsible section panels |
| `Toggle` | `@/components/Compose` | Boolean on/off switch |
| `TimeSegment` | `@/components/Compose` | HH:MM:SS number inputs (preview length, etc.) |

The shared `Creator` type is also exported from `@/components/Compose` — reuse it instead of defining per-form variants (`PodcastCreator`, `VideoCreator`, etc.).

### Usage examples

```tsx
import {
  FieldLabel,
  RichTextArea,
  ImageDropzone,
  TagsInput,
  AccordionPanel,
  Toggle,
  TimeSegment,
} from "@/components/ComposeShared"

// Field label — wraps any form input
<FieldLabel htmlFor={someId} required>Podcast Title</FieldLabel>

// Rich text — uncontrolled, fires onChange(html) on every keystroke
<RichTextArea
  onChange={html => patch({ description: html })}
  placeholder="Write a description…"
  charLimit={1024}      // optional — shows character counter
  minHeight="100px"     // optional — default is "120px"
/>

// Image dropzone — handles preview, drag-and-drop, and clear
<ImageDropzone
  file={values.artworkFile}
  onFile={f => patch({ artworkFile: f })}
  hint="PNG, JPG, WEBP (1:1 square)"
  label="Upload artwork"
  accept="image/*"   // optional, default "image/*"
/>

// Tags — onAdd receives stripped tag (no leading #); onRemove receives the tag string
<TagsInput
  tags={values.tags}
  onAdd={tag => onChange(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
  onRemove={tag => onChange(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
  placeholder="Add a tag…"
  hint="Add 1–10 keywords."  // optional
/>

// Accordion section
<AccordionPanel number={1} title="Create New Show" open={open} onToggle={() => setOpen(v => !v)}>
  {/* children */}
</AccordionPanel>

// Toggle switch
<Toggle checked={autoPreview} onChange={v => patch({ autoPreview: v })} label="Toggle auto-generate preview" />

// Time segment (use three in a row separated by ":")
<TimeSegment value={hours}   max={23} label="Hours"   onChange={v => patch({ previewHours: v })} />
<TimeSegment value={minutes} max={59} label="Minutes" onChange={v => patch({ previewMinutes: v })} />
<TimeSegment value={seconds} max={59} label="Seconds" onChange={v => patch({ previewSeconds: v })} />
```

### ID generation — `createId`

Use `createId(prefix)` from `@/utils/createId` to generate stable, monotonic IDs for list items (creators, episodes, etc.). **Never define per-file `idCounter` variables.**

```tsx
import { createId } from "@/utils/createId"

const newCreator = { id: createId("creator"), npub, role }
```

### `onChange` type convention

All Compose* `onChange` props **must** use `Dispatch<SetStateAction<T>>` — never `(values: T) => void`. This prevents stale closure bugs when multiple state fields are mutated in the same event.

```tsx
// ✅ correct
export type MyFormProps = {
  onChange: Dispatch<SetStateAction<MyFormValues>>
}

// And inside the component:
function patch(partial: Partial<MyFormValues>) {
  onChange(prev => ({ ...prev, ...partial }))
}

// ❌ wrong — stale closure risk
export type MyFormProps = {
  onChange: (values: MyFormValues) => void
}
```

---

## 7. Styling Rules

### The cx utility
Always use `cx` for conditional / composed class strings. Never template literals.

```tsx
import { cx } from "@/utils/cx"

className={cx(
  "base classes",
  isActive && "active classes",
  variant === "primary" && "primary classes",
  className   // always spread external className last
)}
```

### Focus ring — all interactive elements
```css
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-app-surface
```
Use `focus-visible:ring-red-500/50` for destructive actions.

### Skeumorphic button shadow (primary & secondary buttons)
```css
shadow-[inset_0px_0px_0px_1px_rgba(12,14,18,0.18),inset_0px_-2px_0px_0px_rgba(12,14,18,0.05)]
```
Already applied inside `Button` — do not duplicate outside it.

### Glass overlay buttons (on cover art / media cards)
```tsx
// 22×22 frosted-glass mini button on image overlays
className={cx(
  "flex items-center justify-center size-[22px] rounded-[4px] cursor-pointer shrink-0",
  "bg-overlay-btn backdrop-blur-[8px]",
  "hover:opacity-80 transition-opacity duration-150",
  "focus-visible:outline-none"
)}
// Icon: size={14} color="white"
```

### Scrollable areas
```css
overflow-y-auto scrollbar-hide      /* vertical scroll, hidden bar */
overflow-x-auto scrollbar-hide pb-1 /* horizontal card rows */
```

### Transitions
```css
transition-colors duration-150    /* color / bg changes */
transition-opacity duration-150   /* opacity changes */
```

### Card panels (bg-app-card surface)
```css
flex flex-col gap-4 px-4 py-3 rounded-md overflow-hidden bg-app-card
```

### Borders
Always use `border-app-border`. Raw neutral colors are wrong in dark mode.
```css
border border-app-border rounded-xl   /* main panels / cards */
border border-black/10                /* image overlays, avatars */
```

---

## 8. Icons

### Source
Always import from `@untitledui/icons`. Never use other icon packages or inline SVGs (unless the icon truly doesn't exist — e.g., GIF button).

### TypeScript type
`@untitledui/icons` uses `Booleanish = boolean | "true" | "false"` for `aria-hidden`. When building icon-accepting prop types, use:

```tsx
// ✅ correct
type IconComponent = FC<
  SVGProps<SVGSVGElement> & {
    size?: number
    color?: string
    "aria-hidden"?: boolean | "true" | "false"
  }
>

// ❌ wrong — causes TS error
"aria-hidden"?: string | boolean
```

### Usage pattern
```tsx
<SomeIcon
  size={20}
  color="currentColor"   // use "currentColor" — icon inherits text color
  aria-hidden="true"     // always on decorative icons
  className="shrink-0"   // prevent flex squish
/>
```

### Common size reference
| Context | size |
|---|---|
| Nav links, toolbar icons | 20 |
| IconButton sm | 18 |
| Social / action row | 24 |
| Glass mini button (cover art) | 14 |
| Badge icon | 12 |

---

## 9. Inline `<button>` Exceptions

Two cases where a raw `<button>` is intentionally kept inline (non-standard styling that doesn't fit any variant):

1. **"Share & Earn" button** (`RightSidebar.tsx`) — green `bg-green-700` with unique border treatment
2. **`FollowBtn`** (`RightSidebar.tsx`) — `border-brand-500` outline button, no filled background

Everything else must use `Button` or `IconButton`.

---

## 10. Accessibility

### Every interactive element needs:
- `type="button"` on `<button>` (prevents accidental form submission)
- `aria-label` when there is no visible text (icon buttons, overlays)
- `focus-visible:*` styles (never remove outline without providing a visible alternative)
- Decorative icons: `aria-hidden="true"`
- `role="dialog" aria-modal="true" aria-label="..."` on modal cards

### Keyboard nav
Custom clickable `<div>` containers that need keyboard support:
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick() }}
  onClick={onClick}
>
```

---

## 11. TypeScript Rules

- All component props typed as a named exported interface/type — never inline
- Use `ComponentType<...>` or `FC<...>` for icon prop types, not `ReactNode`
- Prefer `type` over `interface` (consistency with the rest of the codebase)
- `Pick<ParentProps, "a" | "b">` for sub-components that need a subset of parent props
- No `any`. No `// @ts-ignore`.

---

## 12. What NOT to Do

| ❌ Don't | ✅ Do instead |
|---|---|
| `export default function Foo` | `export function Foo` |
| `dark:bg-*` Tailwind prefix | `.dark-mode` CSS class on `<html>` |
| Raw `<button className="flex items-center gap-2 px-4 py-2 bg-brand-600 ...">` | `<Button variant="primary">` |
| `bg-[rgba(91,90,87,0.4)]` | `bg-overlay-btn` |
| `text-xs font-bold` for eyebrow labels | `text-eyebrow` |
| `text-[30px] font-semibold leading-[38px]` | `text-heading-section` |
| Hardcoded hex colors | App tokens (`bg-app-card`, `text-text-primary`, etc.) |
| Exporting internal sub-components | Keep them local to the file |
| Creating a new barrel `index.ts` by habit | Only create if the directory has 2+ externally-imported files |
| `aria-hidden={true}` (boolean) directly on `@untitledui/icons` | `aria-hidden="true"` (string literal) |
| Defining `FieldLabel`, `Toggle`, `TimeSegment`, `RichTextArea`, `ImageDropzone`, `TagsInput`, or `AccordionPanel` inline in a Compose* file | Import from `@/components/ComposeShared` |
| `let idCounter = 0; function uid() { ... }` in a Compose* file | `createId(prefix)` from `@/utils/createId` |
| `onChange: (values: T) => void` on Compose* form props | `onChange: Dispatch<SetStateAction<T>>` |

---

## 13. Figma → Code Workflow

1. **Always check Figma first** using `mcp__figma__get_design_context` + `mcp__figma__get_variable_defs` before implementing a component from design
2. **Rate limiting is common** — if Figma MCP fails, fall back to codebase patterns and ask for the URL again later
3. Extract: `fileKey` from URL path, `nodeId` from `?node-id=` param (convert `-` to `:`)
4. The variable defs call returns exact token values — trust those for colors, sizes, spacing
5. The design context screenshot is the ground truth for layout — match it pixel-close, not pixel-perfect (Tailwind rounding applies)
6. Figma uses `Role/*` typography tokens — map them to the `text-*` role utilities in `type-roles.css`
