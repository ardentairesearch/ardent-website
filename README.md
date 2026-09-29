# Ardent AI Research Website

The company website for [Ardent AI Research](https://ardentresearch.xyz).

This repository contains the static site served at `ardentresearch.xyz`. The Testnet API lives in [agent-execution-platform](https://github.com/ardentairesearch/agent-execution-platform), and its [documentation](https://docs.ardentresearch.xyz) is maintained in [ardent-testnet-docs](https://github.com/ardentairesearch/ardent-testnet-docs).

## Deployment

Deploy the repository root as a static site on Vercel. No build command, framework preset, or output directory is required. The site calls `https://api.ardentresearch.xyz` for its public activity feed and links to the separate documentation site.

For local preview, serve this directory with any static HTTP server, for example `python3 -m http.server 4173`, then open `http://localhost:4173`. The backend does not need to be built.

## Site structure

- `index.html`: company, Jusso on Arc, public Testnet, team, and Beta interest content.
- `styles.css`: responsive layouts, light and dark themes, and reduced-motion support.
- `site.js`: navigation, product walkthrough, public activity feed, API-key registration, and Beta form.
- `assets/`: brand marks, protocol marks, optimized hero artwork, and locally hosted Lucide icons (license included).

The local preview defaults to same-origin API requests. To test against an API that permits your local origin, set `window.ARDENT_API_BASE` before `site.js` loads or use the `ARDENT_API_BASE` local-storage setting. When the feed is unavailable, examples are clearly labeled Demo. Registration and Beta interest remain separate flows.

## License

AGPL-3.0-only. See [LICENSE](LICENSE).
