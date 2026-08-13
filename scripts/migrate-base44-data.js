#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const sourceDir = process.env.BASE44_EXPORT_DIR || process.argv[2] || './base44-export';
const requiredEntities = ['customers', 'staff', 'services', 'appointments', 'sales', 'payments', 'expenses', 'products'];

async function readJsonIfExists(filePath) {
  try { return JSON.parse(await fs.readFile(filePath, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function main() {
  const summary = { sourceDir: path.resolve(sourceDir), entities: {}, warnings: [] };
  for (const entity of requiredEntities) {
    const records = await readJsonIfExists(path.join(sourceDir, `${entity}.json`));
    if (!records) { summary.warnings.push(`Missing export file: ${entity}.json`); continue; }
    if (!Array.isArray(records)) { summary.warnings.push(`Invalid export file: ${entity}.json must contain an array`); continue; }
    const ids = new Set();
    const duplicateIds = [];
    for (const record of records) {
      if (record?.id && ids.has(record.id)) duplicateIds.push(record.id);
      if (record?.id) ids.add(record.id);
    }
    summary.entities[entity] = { records: records.length, uniqueIds: ids.size, duplicateIds };
  }
  await fs.mkdir('migration-output', { recursive: true });
  await fs.writeFile('migration-output/base44-migration-summary.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
