<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook Client

Frontend for BookNook: a Next.js 16 App Router app in TypeScript, styled with Tailwind CSS v4 and a shadcn (`base-nova` style) component library built on Base UI primitives. The only route today is the `create-next-app` starter page (`src/app/page.tsx`), so most work is greenfield feature work.

## Commands

Use npm (`package-lock.json` is committed).

```bash
npm run dev      # next dev (Turbopack, default in Next 16)
npm run build    # next build (Turbopack)
npm run start    # serve the production build
npm run lint     # eslint (flat config; `next lint` no longer exists)
npx tsc --noEmit # type check; no separate script
```

There is no test runner or CI configuration. Do not add one unless asked.

Known baseline: `npm run lint` currently fails on two generated files (`src/components/ui/carousel.tsx:98`, `src/hooks/use-mobile.ts:14`, rule `react-hooks/set-state-in-effect`). These predate feature work; don't count them as regressions, and don't "fix" generated code unless the task calls for it.

## Layout

- `src/app/` — App Router routes, `layout.tsx`, `page.tsx`, `globals.css`.
- `src/components/ui/` — generated shadcn components (~70 files). Prefer composing these over writing new primitives.
- `src/hooks/` — `use-mobile`, `use-highlighted-code`.
- `src/lib/` — `utils.ts` (re-exports `cn`), `highlighter.tsx` (lazy Shiki highlighter).
- `@/*` maps to `src/*` (`tsconfig.json`); `components.json` defines the shadcn aliases.
- No `tailwind.config.*` — Tailwind v4 is configured entirely in `src/app/globals.css`.

## Next.js 16 specifics

- Request APIs are async only: `await params`, `await searchParams`, `await cookies()`, `await headers()`. Do not use the Next 15 sync compatibility.
- Use the generated global types (`PageProps<'/route'>`, `LayoutProps<'/'>`, `RouteContext<...>`) instead of hand-written prop types, as `src/app/layout.tsx` does. Run `npx next typegen` if they're missing.
- Middleware is `proxy.ts` with an exported `proxy` function (Node runtime only). Do not create `middleware.ts`.
- Every parallel route slot needs an explicit `default.tsx` or the build fails.
- `next.config.ts` enables `reactCompiler: true`, so don't add `useMemo`/`useCallback` just for memoization, and keep components compiler-friendly (no mutation of props/state).
- Turbopack is the default bundler for dev and build. CSS goes through the `@tailwindcss/turbopack` loader configured in `next.config.ts`.
- `experimental.agentFeedback` is enabled. `next dev` may add a managed `nextjs-agent-feedback` block to this file; commit it rather than deleting it, same as the rules block above.

## UI and styling conventions

- Components are shadcn `base-nova` built on **Base UI** (`@base-ui/react`), not Radix. There is no `asChild`; pass `render={<Component />}` instead, and use Base UI state attributes (`data-open`, `data-closed`, `data-starting-style`, `data-ending-style`) for animations.
- Import the class merger directly: `import { cn } from "cn"`. `@/lib/utils` only re-exports it; new code should follow the generated components and import from `"cn"`.
- Keep the generated shape: `"use client"` only where hooks/events require it, `data-slot="..."` on exported parts, function declarations, and `Component.Props` types from the primitive.
- Add new shadcn components with `npx shadcn@latest add <name>` rather than hand-writing equivalents. `@shadcn/react` supplies the newer unstyled pieces used by `message-scroller.tsx` and `questionnaire.tsx`.
- Style with semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`), never raw palette classes like `bg-zinc-50`. Tokens are defined as CSS variables in `globals.css` under `:root`/`.dark` and exposed via `@theme inline`; add new tokens in both places.
- Dark mode is the `.dark` class on `<html>` plus the `dark:` variant. No theme provider is installed yet; don't assume `next-themes`.
- Icons come from `lucide-react`; variants use `class-variance-authority`.

## Code style

- TypeScript `strict` is on; keep it passing. Path alias is `@/`.
- Generated shadcn files use double quotes and no semicolons; the starter app files use semicolons. Match the file you're editing.
- Prefer server components by default and push `"use client"` to the smallest leaf that needs interactivity.
- Keep imports ordered the way the existing files do: external packages, then `cn`, then `@/` modules, then icons.

## Environment

- Node.js 20.9+ (Next 16 minimum), npm, Windows development environment.
- `.env*` is gitignored; no environment variables are required by the current scaffold.
