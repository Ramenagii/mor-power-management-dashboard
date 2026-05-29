# Loadwise Motion Wireframe Handoff

This folder contains the import-ready wireframe for the updated Loadwise dashboard motion:

- `loadwise-motion-wireframe.svg`

## Motion States Represented

1. Loading screen
   - Large Loadwise mark
   - Wordmark and progress bar
   - Existing logo intro animation remains the entry point

2. Shared logo handoff
   - The loading logo transitions into the compact dashboard logo
   - App implementation uses `layoutId="loadwise-logo-mark"`
   - Final destination is the top-left dashboard identity area

3. Dashboard shell
   - Compact Loadwise mark sits beside the page title
   - Hamburger menu remains on the menu row
   - Route content changes below the menu

4. Shared route transition
   - Dashboard, Policies, and Hardware Components share one animated route surface
   - App implementation uses `layoutId="loadwise-route-surface"`
   - Menu active state uses `layoutId="loadwise-active-menu-pill"`

## App Source Mapping

- `src/components/LoadwiseBrand.tsx`
  - Reusable intro/header logo component.

- `src/components/LoadingScreen.tsx`
  - Intro loading screen with Framer Motion exit animation.

- `src/App.tsx`
  - Shared logo handoff, app shell reveal, and route surface animation.

- `src/components/ViewMenu.tsx`
  - Animated hamburger menu panel and shared active menu indicator.

- `src/styles.css`
  - Logo sizing, responsive header layout, and route/menu visual states.

## Figma Use

The SVG is designed as a single editable import board. It documents the updated motion without needing the live app or Figma automation access.

Recommended Figma frame name:

`Loadwise Dashboard Motion Wireframe`

Recommended placement:

Add it near the existing dashboard wireframe or prototype notes page so the defense/demo motion is documented beside the interface design.
