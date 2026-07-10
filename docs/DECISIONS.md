# Technical decisions

## Pinned foundations

- **SvelteKit + Svelte 5 runes:** compact reactive UI with file-based routing and static output.
- **adapter-static SPA fallback:** GitHub Pages has no rewrite engine; `404.html` lets SvelteKit resolve deep detail links client-side.
- **Tailwind CSS v4 + authored CSS:** Tailwind supplies reset/tokens/utilities while scoped CSS carries the tactile art direction and motion.
- **`lucide-svelte` alias:** the deprecated package name specified by the brief publishes a broken ESM artifact. npm aliases that exact import name to the maintained official `@lucide/svelte` package.
- **Native fetch + Map cache:** keeps the network layer observable and small while preventing repeated PokeAPI detail calls.
- **Zod:** untrusted public API payloads are checked at the boundary, including nested sprite/evolution/berry shapes.
- **Svelte stores + localStorage:** theme and favorites are the only cross-route persistent state; a larger state library would add cost without value.
- **Vitest + Playwright:** helpers and cache behavior are tested quickly in-process; complete user journeys run in Chromium against the production build.
- **Ultracite with Oxlint/Oxfmt:** Rust-based quality checks stay fast enough for hooks and CI.
- **Lefthook:** consistent local pre-commit type/lint/format checks and a pre-push full test gate.

## Product choices

- Substring search intentionally includes named forms (for example Pikachu cap variants) returned by PokéAPI.
- Multi-type filtering uses intersection semantics: every selected type must match.
- Official artwork is preferred; classic sprites are a validated fallback.
- Filters fetch detail records only for the visible page, except base-stat sorting, which needs totals before ordering.
- Motion is progressive enhancement and globally neutralized by `prefers-reduced-motion`.
