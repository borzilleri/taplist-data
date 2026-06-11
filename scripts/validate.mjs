/**
 * Validates the data files against their JSON schemas:
 *   - data/catalog.json       → schema/catalog.schema.json
 *   - data/*.json (the rest)  → schema/dataset.schema.json
 *
 * Exits non-zero if anything fails, so CI blocks the PR.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const DATA_DIR = 'data';
const CATALOG_FILE = 'catalog.json';

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const compile = (path) => ajv.compile(JSON.parse(readFileSync(path, 'utf8')));
const validateCatalog = compile('schema/catalog.schema.json');
const validateDataset = compile('schema/dataset.schema.json');

let failed = false;

function check(file, validate, summary) {
  const data = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8'));
  if (validate(data)) {
    console.log(`✓ ${file} (${summary(data)})`);
    return;
  }
  failed = true;
  console.error(`✗ ${file}`);
  for (const e of validate.errors ?? []) {
    console.error(`    ${e.instancePath || '(root)'} ${e.message}`);
  }
}

const jsonFiles = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
if (!jsonFiles.includes(CATALOG_FILE)) {
  console.error(`Missing ${join(DATA_DIR, CATALOG_FILE)}`);
  process.exit(1);
}
const datasets = jsonFiles.filter((f) => f !== CATALOG_FILE);
if (datasets.length === 0) {
  console.error(`No dataset files found in ${DATA_DIR}/`);
  process.exit(1);
}

check(CATALOG_FILE, validateCatalog, (d) => `${d.datasets?.length ?? 0} datasets`);
for (const file of datasets) {
  check(file, validateDataset, (d) => `${d.beers?.length ?? 0} beers`);
}

process.exit(failed ? 1 : 0);
