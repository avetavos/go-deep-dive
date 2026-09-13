# Go Deep Dive

A bilingual (EN / TH), interactive course that teaches the Go language in depth — on its own terms, using CSP and Go's own idioms. Runnable examples compile on go.dev with the current Go release and fall back to an in-browser interpreter when that is unreachable, so no local Go installation is required for reading the course.

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Site framework | [Astro 6](https://astro.build) + [Starlight 0.40](https://starlight.astro.build) |
| UI islands | [Preact](https://preactjs.com) (via `@astrojs/preact`) |
| Primary Go runner | go.dev compile service (current Go release) via a Cloudflare Pages Function proxy |
| Offline fallback runner | [yaegi](https://github.com/traefik/yaegi) compiled to WebAssembly (`public/go-runner.wasm`), Go 1.26 APIs only |
| Unit tests | [Vitest](https://vitest.dev) + `@testing-library/preact` |
| Styling | Starlight default + custom CSS (`src/styles/custom.css`) |
| i18n | Starlight built-in, `defaultLocale: 'en'`, locales: `en` + `th` |

## Commands

Run all commands from the project root.

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Build production site to ./dist/
npm run preview    # Preview the production build locally
npm test           # Run Vitest unit tests

# Regenerate the WASM Go runner from source (requires Go installed locally).
# The prebuilt artifact (public/go-runner.wasm + public/wasm_exec.js) is committed
# to the repo so normal builds and readers do NOT need Go installed.
npm run build:wasm
```

## Content Structure

Lessons live at:

```
src/content/docs/
  en/                        # English content — served at /en/...
    index.mdx                # EN landing page (splash template)
    basics/
    types-data/
    methods-interfaces/
    concurrency/             # Complete — 7 lessons
    errors-generics/
    stdlib/
    testing-tooling/
  th/                        # Thai content — served at /th/...
    index.mdx                # TH landing page (splash template)
    (same module directories)
```

### The 7 Modules

| Directory | Module | Topics | Status |
| --------- | ------ | ------ | ------ |
| `basics` | Basics & Syntax | Variables, constants, types, control flow, functions, packages | Coming soon |
| `types-data` | Types & Data | Arrays, slices, maps, structs, pointers | Coming soon |
| `methods-interfaces` | Methods & Interfaces | Methods, interface design, composition, embedding | Coming soon |
| `concurrency` | Concurrency | Goroutines, channels, select, sync primitives, context, patterns | **Complete** |
| `errors-generics` | Errors & Generics | Error wrapping, custom errors, errors.Is/As, generics | Coming soon |
| `stdlib` | Standard Library | fmt, strings, io, net/http, encoding/json, time | Coming soon |
| `testing-tooling` | Testing & Tooling | go test, table-driven tests, benchmarks, race detector, go vet | Coming soon |

### Lesson File IDs

Content IDs follow the `<module>/<slug>` convention, e.g. `concurrency/goroutines`. The Starlight sidebar uses `autogenerate: { directory }` per locale root, so new `.mdx` files are picked up automatically. Set `sidebar: order: N` in each lesson's frontmatter to control the ordering within a module (Starlight defaults to alphabetical otherwise).

### Lesson Template

Each lesson MDX file follows this structure (see any file in `src/content/docs/en/concurrency/` as the golden template):

1. **Frontmatter** — `title`, `description`, `sidebar: order: N`
2. **Imports** — `Playground`, `Callout`, `Quiz`, `ProgressTracker` (relative, four levels up)
3. **Concept intro** — one-paragraph framing
4. **Concept prose** — explanation with inline code spans and tables
5. **Hoisted `export const ...Code`** + `<Playground client:visible code={...} />` — complete runnable Go program
6. **`<Callout title="...">`** — key point or gotcha
7. **Hoisted `export const quiz...`** + `<Quiz client:visible id="module/slug" questions={...} />`
8. **`<ProgressTracker client:visible id="module/slug" />`** — always last

Code snippets are hoisted into `export const` template literals and passed to components by reference:

```mdx
export const myCode = `package main
...`;

<Playground client:visible code={myCode} />
```

> **Escaping inside template literals:** Go `\n` and `\t` inside string literals
> must be written as `\\n` and `\\t` — a single backslash is consumed by the JS
> template literal parser before the code reaches the renderer. Real newlines
> between Go statements are fine as-is.

### Bilingual Parity

EN and TH lesson files must share identical: `export const` variable names, component `id=` props, code block content, and quiz `answer` indices (0-based). Only frontmatter `title`/`description` and prose are translated. This makes cross-language content audits trivial.

## How Runnable Code Works

When a reader clicks "Run" in a `<Playground>`:

1. The snippet is POSTed to the site's own compile proxy, which forwards it to the go.dev compile service and returns its output. This is the current Go release, so snippets using the newest language and stdlib features work.
2. If that request fails (offline, blocked), the browser falls back to `public/go-runner.wasm` — a build of [yaegi](https://github.com/traefik/yaegi), a pure-Go interpreter, compiled to WebAssembly and loaded once via `public/wasm_exec.js` (~8 MB gzip, cached after first load).
3. Output is captured and displayed inline either way.

**Fallback coverage:** the interpreter targets Go 1.26 APIs and covers most of the standard library including `fmt`, `sync`, `sync/atomic`, `context`, and `time`. Snippets that need a newer release, real file I/O, OS signals, or network connections only run through go.dev — those lessons say so, and the "Open in Playground" button copies the snippet so the reader can paste it there.

## Components

| Component | Props | Purpose |
| --------- | ----- | ------- |
| `Playground.tsx` | `{ code: string }` | Runs a complete Go program in WASM and shows output |
| `Callout.astro` | `{ title?: string }` | Highlighted key-point aside (slot content) |
| `Quiz.tsx` | `{ id, questions: {q, options, answer}[] }` | Multiple-choice quiz; `answer` is 0-based index |
| `ProgressTracker.tsx` | `{ id: string }` | Marks a lesson complete; state persisted in localStorage |

Progress and quiz scores are stored in `localStorage` under the key `godd:v1`.

## Deployment

The site is fully static (`output: 'static'` in `astro.config.mjs`). Build output lands in `dist/`. Deploy to any static host.

> **Note on hosts:** `public/go-runner.wasm` is ~38 MB uncompressed (~8 MB gzip).
> **Cloudflare Pages will not work** — its 25 MiB per-file upload limit rejects the wasm.
> Use GitHub Pages, Netlify, or Vercel.

### GitHub Pages (configured)

This repo deploys to GitHub Pages via `.github/workflows/deploy.yml` (build with `withastro/action@v3`, publish with `actions/deploy-pages@v4`). The prebuilt wasm is committed, so CI needs **no Go toolchain**.

One-time setup:

1. Create a GitHub repo named `go-deep-dive` under your account and push (`main` branch).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Confirm the base path in `astro.config.mjs` matches your setup:
   - **Project site** (`https://USER.github.io/go-deep-dive/`): `site: 'https://USER.github.io'`, `base: '/go-deep-dive'` (current default).
   - **User/org site** (`USER.github.io` repo) or **custom domain**: set `site` to your domain and **remove `base`** (served at root). Also update the hardcoded `/go-deep-dive/en/concurrency/` link in `src/content/docs/en/index.mdx`.

### Other static hosts (served at root)

If deploying to Netlify, Vercel static, or a custom domain, **remove the `base` option** from `astro.config.mjs` and update the landing-page link in `src/content/docs/en/index.mdx`:

- **Netlify** — build command `npm run build`, publish dir `dist`
- **Vercel** — static preset, no serverless functions needed
