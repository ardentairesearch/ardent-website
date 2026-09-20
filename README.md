# Ardent AI Research Website

The company website for [Ardent AI Research](https://ardentresearch.xyz).

This repository contains the static site served at `ardentresearch.xyz`. The Testnet API lives in [agent-execution-platform](https://github.com/ardentairesearch/agent-execution-platform), and its [documentation](https://docs.ardentresearch.xyz) is maintained in [ardent-testnet-docs](https://github.com/ardentairesearch/ardent-testnet-docs).

## Deployment

Deploy the repository root as a static site on Vercel. No build command, framework preset, or output directory is required. The site calls `https://api.ardentresearch.xyz` for its public activity feed and links to the separate documentation site.

For local preview, serve this directory with any static HTTP server. Editing `index.html` and `assets/` is sufficient; the backend does not need to be built.

## License

AGPL-3.0-only. See [LICENSE](LICENSE).
