#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REQUIRED_ENTITIES = [
  'customers',
  'staff',
  'services',
  'appointments',
  'sales',
  'payments',
  'expenses',
  'products',
];

const exportDir = path.resolve(process.env.BASE44_EXPORT_DIR || './base44-export');

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(exportDir, fullPath) || '.';

    if (entry.isDirectory()) {
      results.push(`${relativePath}/`);
      results.push(...listFilesRecursive(fullPath));
    } else {
      results.push(relativePath);
    }
  }

  return results.sort();
}

function readJsonFile(filePath) {
  const contents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(contents);
}

const availableSourceFiles = listFilesRecursive(exportDir);
const existingEntities = {};
const invalidEntities = [];
const missingEntities = [];

for (const entity of REQUIRED_ENTITIES) {
  const filePath = path.join(exportDir, `${entity}.json`);

  if (!fs.existsSync(filePath)) {
    missingEntities.push(entity);
    continue;
  }

  try {
    const data = readJsonFile(filePath);
    existingEntities[entity] = {
      file: path.relative(process.cwd(), filePath),
      records: Array.isArray(data) ? data.length : null,
      validJson: true,
      topLevelType: Array.isArray(data) ? 'array' : typeof data,
    };
  } catch (error) {
    invalidEntities.push({ entity, file: path.relative(process.cwd(), filePath), error: error.message });
  }
}

if (missingEntities.length > 0 || invalidEntities.length > 0) {
  const report = {
    status: 'MIGRATION BLOCKED — BASE44 EXPORT DATA MISSING',
    source: exportDir,
    missingEntities,
    invalidEntities,
    existingEntities,
    expectedSourceLocation: exportDir,
    availableSourceFiles,
    recommendedRecoveryMethod: [
      'Re-export/eject the Salon Management Base44 project from the original Base44 account/project.',
      'Place the real exported entity JSON files in BASE44_EXPORT_DIR without creating empty placeholders or mock data.',
      'Required files are: customers.json, staff.json, services.json, appointments.json, sales.json, payments.json, expenses.json, and products.json.',
      'Commit the unmodified recovered Base44 export before running database migration again.',
    ],
  };

  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

const report = {
  status: 'READY FOR VALIDATION',
  source: exportDir,
  entities: existingEntities,
  availableSourceFiles,
};

console.log(JSON.stringify(report, null, 2));
