# Implementation Plan - Robotic Arm | Eserom Demissew

Build a high-end, single-page landing page for an AI-powered robotic arm project. The site will feature a dark-mode-first luxury aesthetic, multiple HTML5 canvas animations, and a responsive design.

## Scope Summary
- **Single-file Architecture**: A standalone `index.html` containing all HTML, CSS (standard CSS variables), and JS.
- **Visual Style**: Deep navy/charcoal, electric blue (#3b82f6) accent, cyan (#06b6d4) secondary. Minimal-luxury, aerospace aesthetic.
- **Key Sections**: Navbar, Hero (with 3D-style arm canvas), Features, Specs (with orbital canvas), Roadmap, App Download (with phone mockup), Tech Stack, About (with node graph canvas), Footer.
- **Interactions**: Theme toggle (dark/light), scroll-reveal animations, 3 continuous canvas loops.
- **App Mockup**: Visual representation of the mobile app UI based on provided screenshots.

## Non-Goals
- Real backend/database connectivity.
- Actual APK hosting (will provide a placeholder link and instructions).
- Real 3D model loading (e.g., Three.js). Animations will be custom 2D Canvas drawings simulating 3D movement as requested.

## Assumptions & Open Questions
- **One File vs Vite**: The user requested a "single HTML file", but the current environment is a Vite/React scaffold. I will provide a plan that satisfies the "Single File" requirement by building a robust `index.html` in the root or a clean React implementation if the user prefers the existing stack. *Decision*: I will stick to the "Single HTML file" request for the final deliverable to ensure portability, but execute it within the sandbox environment.
- **App Download**: The request asks "how can I insert app to be downloadable". I will include a guide in the final response.

## Affected Areas
- `index.html`: Main structure and container for CSS/JS.
- `public/`: For any static assets (though the goal is to keep it self-contained).

## Implementation Phases

### Phase 1: Foundation & Theming (frontend_engineer)
- Set up the HTML5 boilerplate in `index.html`.
- Define CSS custom properties for both light and dark themes.
- Implement the Theme Toggle logic (localStorage persistence).
- Add Poppins font via Google Fonts.
- Implement the Fixed Navbar with the pulsing dot logo.

### Phase 2: Hero Section & Arm Animation (frontend_engineer)
- Build the Hero layout (Grid background, blur orbs, badges).
- Create the first HTML5 Canvas: "3D-style Robotic Arm".
- Implement sine-wave based movement for joints (Base, Shoulder, Elbow, Wrist, Gripper).
- Add labeled joints and dashed wire traces.

### Phase 3: Content Sections (frontend_engineer)
- **Features**: Responsive grid of cards with hover lift and top-border fade-in.
- **Specs**: Two-column layout with the second Canvas: "6-ring orbital diagram".
- **Roadmap**: Vertical timeline with interactive nodes.
- **Tech Stack**: Grid of tech cards with border-highlight on hover.

### Phase 4: App Download & About (frontend_engineer)
- **App Section**: CSS-based phone mockup with floating animation.
- **App UI**: Create a visual replica of the provided screenshots (Connecting page, Permission dialog, Main UI) using CSS/HTML inside the phone frame.
- **About Section**: Third Canvas: "System architecture node graph" with traveling particles.

### Phase 5: Polish & Responsiveness (quick_fix_engineer)
- Implement `IntersectionObserver` for staggered fade-up animations.
- Ensure all canvases resize correctly and respect theme colors dynamically.
- Final responsive check (Mobile hamburger menu, stack layouts for 768px/1024px).
- Add the "How to insert app" instructions in a comment/documentation section.

## Sequencing Constraints
- Phase 1 must be completed first to establish the theme colors used by the Canvases.
- Phase 2, 3, and 4 can technically overlap but are best done sequentially to manage the complexity of the 3 distinct canvas scripts.
