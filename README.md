# taplist-data

Production festival data for [TapList](https://github.com/borzilleri/TapList)
(https://taplist.rampant.io).

This repo is the **source of truth** for the catalog and beer datasets the app loads at
runtime. It's published to GitHub Pages at
<https://borzilleri.net/taplist-data/>, and the app fetches:

- `https://borzilleri.net/taplist-data/data/catalog.json` — the manifest of festivals
- the dataset URL listed in each catalog entry (e.g. `data/wbf-2026.json`)

## Publishing an update

Open a PR with your edits under `data/`. CI validates the datasets against the schema
(see below); once merged to `main`, GitHub Pages redeploys in about a minute and the app
picks up the change on next load — **no app rebuild or release needed.**

```
data/catalog.json            manifest: which datasets exist, which is default
data/wbf-2026.json            Washington Brewers Festival 2026 dataset
data/wbf-2026.NOTES.md        notes on the WBF dataset
data/wabf-2026.csv            source CSV the WBF dataset is generated from
schema/dataset.schema.json   the dataset contract (published + used to validate PRs)
```

## Schema & validation

`schema/dataset.schema.json` is the canonical dataset contract (JSON Schema draft 2020-12),
published at <https://borzilleri.net/taplist-data/schema/dataset.schema.json>. Each dataset
references it via a top-level `"$schema"` for editor autocomplete and inline validation.

Every PR runs the schema check (`.github/workflows/validate.yml`); run it locally with:

```
npm install
npm run validate
```

This validates the dataset files (everything in `data/` except `catalog.json`, which has a
different shape). Note the schema is the strict authoring contract — the app's runtime
parser is intentionally more lenient (see TapList `docs/data-model.md`).

The app keeps a small mock dataset in its own repo for local development; real festival
data lives only here.
