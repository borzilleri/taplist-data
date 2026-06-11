# taplist-data

Production festival data for [TapList](https://github.com/borzilleri/TapList)
(https://taplist.rampant.io).

This repo is the **source of truth** for the catalog and beer datasets the app loads at
runtime. It's published to GitHub Pages at
<https://borzilleri.net/taplist-data/>, and the app fetches:

- `https://borzilleri.net/taplist-data/data/catalog.json` — the manifest of festivals
- the dataset URL listed in each catalog entry (e.g. `data/wbf-2026.json`)

## Publishing an update

Edit a file under `data/`, commit, and push to `main`. GitHub Pages redeploys in about a
minute and the app picks up the change on next load — **no app rebuild or release needed.**

```
data/catalog.json       manifest: which datasets exist, which is default
data/wbf-2026.json       Washington Brewers Festival 2026 dataset
data/wbf-2026.NOTES.md   notes on the WBF dataset
data/wabf-2026.csv       source CSV the WBF dataset is generated from
```

Dataset shape is validated by the app against
<https://taplist.rampant.io/schema/dataset.schema.json>.

The app keeps a small mock dataset in its own repo for local development; real festival
data lives only here.
