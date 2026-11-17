# TIC-TAC-TOE
Simple Game Project

## Deploy to GitHub Pages

The `Deploy to GitHub Pages` workflow builds the app and deploys it whenever
changes are pushed to `main`. In the repository settings, open **Pages** and
select **GitHub Actions** as the build and deployment source.

The Vite base path is derived from the repository name in GitHub Actions, so
project pages load assets from the correct URL. Local development and previews
use the root path.
