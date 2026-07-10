# Lighthouse audit note

## Local environment result

The app was exercised successfully in Playwright Chromium against its production build, but Lighthouse 13.4.0 could not record a first paint in this WSL desktop environment. Every CLI attempt ended with:

```text
Runtime error encountered: The page did not paint any content. (NO_FCP)
```

This was reproduced with:

- Playwright's verified Chromium binary in headless mode;
- `/usr/bin/google-chrome` in new headless mode;
- software-rendering flags (`swiftshader`, `--disable-gpu`);
- headed system Chrome under Xvfb.

A direct system-Chrome screenshot was also a uniform background and logged `ContextResult::kTransientFailure: Failed to send GpuControl.CreateCommandBuffer`. In contrast, Playwright Chromium rendered every page, captured the committed screenshots, and completed all real user journeys. This isolates the limitation to Chrome/Lighthouse paint instrumentation in this environment rather than the application.

After deployment, an external PageSpeed Insights API audit was also attempted against the public HTTPS URL, but the Google endpoint returned HTTP 429 (rate limited) before producing a report.

## Reproduce in a standard Chrome environment

With the production preview running:

```bash
npm run build
npm run preview
npm run lighthouse
```

The production bundle is intentionally compact, routes include unique titles/descriptions, controls are labeled, focus states are visible, motion respects `prefers-reduced-motion`, images have dimensions constrained by their containers and lazy loading, and all shipped pages pass the Chromium interaction/a11y locator suite. A hosted audit should still be recorded when a Chrome environment with working GPU/software paint instrumentation is available.
