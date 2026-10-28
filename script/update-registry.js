/* Checks a newer SWIFT IBAN registry saved over script/registry.txt and rebuilds script/iban_spec.js from it.
 *
 * SWIFT blocks scripted downloads, so download the registry as text in a browser from
 * https://www.swift.com/standards/data-standards/iban-international-bank-account-number
 * (currently https://www.swift.com/sites/default/files/files/iban-registry_2.txt), save it as script/registry.txt,
 * then run `npm run update-registry` and `git diff script/` to see changes. */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { REGISTRY, ROW_FIELDS, readRows, extract, buildSpec } from './builder.js';

// The fields iban_spec.js is built from, so a change in any of them is worth reviewing.
const COMPARED_FIELDS = [
  'length',
  'bban_regexp',
  'sepa',
  'bank_identifier',
  'branch_indentifier',
  'account_indentifier',
];

const file = fileURLToPath(REGISTRY);
if (!existsSync(file)) fail('No script/registry.txt. Download the SWIFT IBAN registry and save it there.');

const text = readFileSync(file, 'latin1');
checkRegistry(text);
const committed = committedRegistry();
if (committed) summariseChanges(extract(committed), extract(text));
buildSpec();
console.log('Updated script/iban_spec.js from script/registry.txt.');
console.log('Review them with `git diff script/`, then run `npm run update-src` to carry them into src/ibantools.ts.');

// The file is replaced in place, so the version to compare against is the committed one.
function committedRegistry() {
  try {
    return execFileSync('git', ['show', 'HEAD:script/registry.txt'], { encoding: 'latin1', stdio: 'pipe' });
  } catch {
    console.log('No committed script/registry.txt to compare with.');
    return undefined;
  }
}

// A blocked download is an HTML page, and a cut-off one ends in a short row; neither is a usable registry.
function checkRegistry(text) {
  const rows = readRows(text);
  const labels = new Set(rows.map(([label]) => label));
  const missing = Object.keys(ROW_FIELDS).filter((label) => !labels.has(label));
  if (missing.length)
    fail(
      `${file} does not look like the SWIFT IBAN registry. Missing rows: ${missing.join(', ')}. Restore it with git checkout script/registry.txt`,
    );
  const width = rows.find(([label]) => label === 'IBAN prefix country code (ISO 3166)').length;
  const uneven = rows.filter((row) => row.length !== width).map(([label]) => label || '(no label)');
  if (uneven.length)
    fail(
      `${file} looks cut off or damaged. Rows not ${width} cells wide: ${uneven.join(', ')}. Restore it with git checkout script/registry.txt`,
    );
}

function summariseChanges(before, after) {
  const beforeByCode = new Map(before.map((spec) => [spec.code, spec]));
  const afterCodes = new Set(after.map((spec) => spec.code));
  const added = after.filter((spec) => !beforeByCode.has(spec.code)).map((spec) => spec.code);
  const removed = before.filter((spec) => !afterCodes.has(spec.code)).map((spec) => spec.code);
  const changed = after
    .filter((spec) => beforeByCode.has(spec.code))
    .filter((spec) => COMPARED_FIELDS.some((field) => spec[field] !== beforeByCode.get(spec.code)[field]))
    .map((spec) => spec.code);
  console.log(`Countries: ${before.length} -> ${after.length}`);
  console.log(`Added: ${added.join(', ') || 'none'}`);
  console.log(`Removed: ${removed.join(', ') || 'none'}`);
  console.log(`Changed: ${changed.join(', ') || 'none'}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
