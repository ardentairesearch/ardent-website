# Ardent AI Research Website

The company website for [Ardent AI Research](https://ardentresearch.xyz).

This repository contains the static company site served at `ardentresearch.xyz`. Jusso is our upcoming stablecoin payment workflow product on Arc. The product section illustrates an example recurring payment plan; it does not initiate payments or connect to a live wallet.

## Deployment

Deploy the repository root as a static site on Vercel. No build command, framework preset, output directory, API credentials, or backend connection is required. Demo bookings link to https://cal.com/ardentresearch/15min. Documentation is marked coming soon.

For local preview, serve this directory with any static HTTP server, for example `python3 -m http.server 4173`, then open `http://localhost:4173`. The backend does not need to be built.

## Site structure

- `index.html`: our approach, Jusso payments on Arc, and a combined About section introducing the lab and team.
- `styles.css`: a light-only theme, responsive layouts, and reduced-motion support.
- `site.js`: navigation and progressive scroll-led payment illustrations.
- `assets/`: brand and provider marks, optimized hero artwork, and locally hosted Lucide icons (license included).

The payment illustration advances with ordinary page scrolling, without click controls or scroll interception. All three steps remain in the document for assistive technology. Reduced motion, short viewports, and disabled JavaScript show the steps in a static sequence. Provider logos are sourced from the official Circle and Turnkey websites; see `assets/providers/SOURCES.md`. They identify the infrastructure used, not sponsorship or endorsement.

The website does not collect registrations or poll the legacy Testnet activity feed.

## License

AGPL-3.0-only. See [LICENSE](LICENSE).
