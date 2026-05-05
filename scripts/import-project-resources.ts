#!/usr/bin/env node
/**
 * Import project resources from a repo folder into the Ascend CRM as
 * project_resources rows. Walks a known set of file patterns, categorizes
 * by type, and writes a SQL seed you apply via wrangler.
 *
 * Usage:
 *   npx tsx scripts/import-project-resources.ts <folder> "<Project Name>"
 *   npx tsx scripts/import-project-resources.ts ../site-scdmv-alerts "SCDMV Alerts"
 *
 * Output: worker/db/seeds/YYYY-MM-DD-import-<slug>.sql
 * Apply:  wrangler d1 execute ascend-db --remote --file=<that file>
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FoundResource {
  type: 'template' | 'contacts' | 'checklist' | 'brand_asset' | 'link' | 'doc';
  title: string;
  content: string;
  source_path: string; // relative to repo
  sort_order: number;
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: import-project-resources.ts <folder> "<Project Name>"');
  process.exit(1);
}

const folder = path.resolve(args[0]);
const projectName = args[1];

if (!fs.existsSync(folder)) {
  console.error(`Folder not found: ${folder}`);
  process.exit(1);
}

const folderName = path.basename(folder);

// File-pattern → resource categorization rules. Order matters: first match wins.
type Rule = {
  match: (relPath: string, name: string) => boolean;
  type: FoundResource['type'];
  title: (relPath: string, name: string) => string;
  sort: number;
};

const RULES: Rule[] = [
  {
    match: (_p, n) => n === 'PRESS-KIT.md',
    type: 'doc',
    title: () => 'Press Kit',
    sort: 1,
  },
  {
    match: (_p, n) => n === 'LAUNCH-CHECKLIST.md',
    type: 'checklist',
    title: () => 'Launch Checklist',
    sort: 2,
  },
  {
    match: (p) => /^emails\/.*\.txt$/i.test(p),
    type: 'template',
    title: (_p, n) =>
      `Email — ${n
        .replace(/\.txt$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())}`,
    sort: 10,
  },
  {
    match: (p) => /^marketing[-/].+\.md$/i.test(p),
    type: 'doc',
    title: (_p, n) =>
      n
        .replace(/\.md$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    sort: 20,
  },
  {
    match: (_p, n) => n === 'MARKET-RESEARCH.md',
    type: 'doc',
    title: () => 'Market Research',
    sort: 30,
  },
  {
    match: (_p, n) => n === 'DESIGN-BRIEF.md',
    type: 'doc',
    title: () => 'Design Brief',
    sort: 31,
  },
  {
    match: (_p, n) => n === 'TECHNICAL-SPEC.md',
    type: 'doc',
    title: () => 'Technical Spec',
    sort: 32,
  },
  {
    match: (_p, n) => n === 'PRD.md',
    type: 'doc',
    title: () => 'PRD',
    sort: 33,
  },
  {
    match: (_p, n) => /^marketing-plan.*\.md$/i.test(n),
    type: 'doc',
    title: () => 'Marketing Plan',
    sort: 34,
  },
  {
    match: (p, n) => /^tasks\/.*\.md$/.test(p) && !p.includes('_archive'),
    type: 'doc',
    title: (_p, n) =>
      n
        .replace(/\.md$/, '')
        .replace(/^prd-/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    sort: 40,
  },
  {
    match: (_p, n) => n === 'README.md',
    type: 'doc',
    title: () => 'README',
    sort: 90,
  },
];

const found: FoundResource[] = [];
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.astro',
  '.wrangler',
  '.next',
  'dist',
  'build',
  '.obsidian',
  '_archive',
  'tasks/_archive',
]);

function walk(dir: string, rel = ''): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.env.example') continue;
    const fullPath = path.join(dir, e.name);
    const relPath = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(fullPath, relPath);
      continue;
    }
    if (!e.isFile()) continue;
    for (const rule of RULES) {
      if (rule.match(relPath, e.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (!content.trim()) break;
        found.push({
          type: rule.type,
          title: rule.title(relPath, e.name),
          content,
          source_path: `${folderName}/${relPath}`,
          sort_order: rule.sort,
        });
        break;
      }
    }
  }
}

walk(folder);

if (found.length === 0) {
  console.error('No matching files found.');
  process.exit(1);
}

found.sort((a, b) => a.sort_order - b.sort_order);

// Build SQL
const sqlEscape = (s: string) => s.replace(/'/g, "''");
const today = new Date().toISOString().slice(0, 10);
const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const outputPath = path.resolve(
  __dirname,
  `../worker/db/seeds/${today}-import-${slug}.sql`
);

const lines: string[] = [
  '-- =============================================================================',
  `-- Import: project resources from ${folderName} → "${projectName}"`,
  `-- Generated: ${new Date().toISOString()}`,
  `-- Run:  wrangler d1 execute ascend-db --remote --file=worker/db/seeds/${today}-import-${slug}.sql`,
  '--',
  `-- ${found.length} resources found.`,
  '-- =============================================================================',
  '',
];

for (const r of found) {
  lines.push(
    `INSERT INTO project_resources (project_id, type, title, content_markdown, sort_order, source_path)`,
    `SELECT id, '${r.type}', '${sqlEscape(r.title)}', '${sqlEscape(r.content)}', ${r.sort_order}, '${sqlEscape(r.source_path)}'`,
    `FROM projects WHERE name = '${sqlEscape(projectName)}' LIMIT 1;`,
    ''
  );
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join('\n'));

console.log(`✓ Wrote ${found.length} resources to:`);
console.log(`  ${outputPath}`);
console.log('');
console.log('Found:');
for (const r of found) {
  console.log(`  [${r.type.padEnd(12)}] ${r.title}  ←  ${r.source_path}`);
}
console.log('');
console.log('Apply with:');
console.log(
  `  cd ${path.relative(process.cwd(), path.resolve(__dirname, '../worker'))} && wrangler d1 execute ascend-db --remote --file=db/seeds/${today}-import-${slug}.sql`
);
