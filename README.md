# Indonesia in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/silver-wren-74/national-statistics-site-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/silver-wren-74/national-statistics-site-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

A national statistics site for **Indonesia** — population, economy, health, education and trade, with real figures, each with its source and year. Built for the [make.fun bounty “Make the best national statistics site”](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

## The site

Six pages under `app/`, all static files with no build step and no network request:

- **Overview** (`index.html`) — headline figures, country facts, population and GDP charts
- **Demographics** — population 283.5M (2024), age structure, ten largest provinces
- **Economy** — GDP $1.40T, 5.03% growth, 1.57% inflation, 4.91% unemployment
- **Health** — life expectancy 71.3 years, mortality, near-universal JKN coverage
- **Education** — 96.0% literacy, 9.2 mean years of schooling, HDI 0.728
- **Trade** — $264.7B of exports, top products and partners, five-year balance

Charts are hand-built SVG drawn from `app/data.js`; every figure carries its source and year in the page and in the footer. The site works on desktop and on a phone, offline, from static files alone.

## Run it

Serve `app/` with any static server and open it in a browser:

```sh
python3 -m http.server --directory app
# open http://localhost:8000
```

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data sources

World Bank World Development Indicators · UN World Population Prospects 2024 · BPS — Statistics Indonesia · Bank Indonesia · UNDP Human Development Report · WHO · BPJS Kesehatan. Full list in the footer of every page.
