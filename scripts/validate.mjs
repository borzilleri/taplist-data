/**
 * Validates every dataset file in data/ against schema/dataset.schema.json.
 *
 * The catalog (data/catalog.json) has a different shape and no schema yet, so
 * it's skipped. Exits non-zero if any dataset fails, so CI blocks the PR.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const DATA_DIR = 'data';
const SCHEMA_PATH = 'schema/dataset.schema.json';
const SKIP = new Set(['catalog.json']);

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(readFileSync(SCHEMA_PATH, 'utf8')));

const datasets = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json') && !SKIP.has(f));
if (datasets.length === 0) {
  console.error(`No dataset files found in ${DATA_DIR}/`);
  process.exit(1);
}

let failed = false;
for (const file of datasets) {
  const data = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8'));
  if (validate(data)) {
    console.log(`✓ ${file} (${data.beers?.length ?? 0} beers)`);
    continue;
  }
  failed = true;
  console.error(`✗ ${file}`);
  for (const e of validate.errors ?? []) {
    console.error(`    ${e.instancePath || '(root)'} ${e.message}`);
  }
}

process.exit(failed ? 1 : 0);
