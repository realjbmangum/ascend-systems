#!/usr/bin/env node
// =============================================================================
// build-voice-kb.mjs — compile the CALLER-FACING knowledge base for the Grok
// Voice receptionist into voice-kb/, ready to upload as an xAI collection.
//
// WHY THIS IS A SCRIPT AND NOT A FOLDER SOMEONE CURATES
//   This repo is PUBLIC and contains material that must never be spoken to a
//   caller: docs/charlotte-target-list.html (62 named real prospects),
//   docs/outscraper/* (scraped contact PII), the outreach playbook, the warm
//   reactivation emails, and the security review. It also contains
//   website-copy.md — dead "CallSteady" copy from Feb 2026 carrying a retracted
//   "Powered by Telnyx Voice AI" claim, placeholder testimonials, and a
//   money-back guarantee that does not exist. An earlier backlog note listed
//   that file as an approved KB source. It is not.
//
//   So the allowlist is code, the denylist is code, and both run on every
//   build. Adding a source means editing SOURCES here — there is no way to
//   drop a file into voice-kb/ and have it survive the next build.
//
// USAGE
//   node scripts/build-voice-kb.mjs                     # ascend, build + verify
//   node scripts/build-voice-kb.mjs --tenant acme       # a client's collection
//   node scripts/build-voice-kb.mjs --check             # verify only, no write
// =============================================================================

import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");

// Collections belong to the tenant they serve, not to the repo root — a client
// should be able to see exactly what their agent knows in their own folder.
const tenantFlag = process.argv.indexOf("--tenant");
const TENANT = tenantFlag !== -1 ? process.argv[tenantFlag + 1] : "ascend";
if (!/^[a-z0-9-]+$/.test(TENANT)) {
  console.error(`\n✘ Bad tenant name "${TENANT}" — lowercase letters, digits and hyphens only.\n`);
  process.exit(1);
}
const OUT_DIR = path.join(ROOT, "voice-tenants", TENANT, "kb");

// -----------------------------------------------------------------------------
// The allowlist. Every source the caller-facing agent is permitted to know.
// A directory entry admits only files matching `ext`, non-recursively.
// -----------------------------------------------------------------------------
// Ascend's knowledge base is EXTRACTED from its own website, so the agent can
// never say something the site does not. Other tenants supply their documents as
// markdown in voice-tenants/<name>/source/ and this script validates and copies
// them — same firewall, different inputs.
const SOURCES_BY_TENANT = {
  ascend: [
    { kind: "services", file: "src/data/services.ts" },
    { kind: "case-studies", dir: "src/content/case-studies", ext: ".md" },
    { kind: "msa", file: "src/pages/msa.astro" },
  ],
};
const SOURCES =
  SOURCES_BY_TENANT[TENANT] ??
  [{ kind: "markdown", dir: `voice-tenants/${TENANT}/source`, ext: ".md" }];

// -----------------------------------------------------------------------------
// The denylist. Substrings that must not appear anywhere in the built output.
// Case-insensitive. If one of these trips, something confidential or retracted
// has found a path into the KB and the build fails rather than shipping it.
// -----------------------------------------------------------------------------
export const FORBIDDEN = [
  // Confidential — prospect lists, scraped PII, internal GTM
  "charlotte-target-list",
  "outscraper",
  "outreach-playbook",
  "warm-reactivation",
  "security-review",
  // Retracted / dead-brand claims that must never be spoken to a caller
  "website-copy",
  "telnyx",
  "callsteady",
  "mintline",
  "money-back",
  "no such project exists",
  // Named prospects that appear in the outreach docs but are NOT clients
  "stancil",
];

function fail(message) {
  console.error(`\n✘ ${message}\n`);
  process.exit(1);
}

/** Reject any path that is not inside the repo and named by SOURCES. */
function assertAllowed(absPath, allowedAbsPaths) {
  const resolved = path.resolve(absPath);
  if (!resolved.startsWith(ROOT + path.sep)) {
    fail(`Refusing to read outside the repo: ${resolved}`);
  }
  if (!allowedAbsPaths.has(resolved)) {
    fail(
      `Refusing to read a file that is not on the allowlist: ${path.relative(ROOT, resolved)}\n` +
        `  If this file really is safe for a caller to hear, add it to SOURCES in scripts/build-voice-kb.mjs.`
    );
  }
}

/** Resolve SOURCES into the concrete set of allowed absolute file paths. */
async function resolveAllowed() {
  const allowed = new Set();
  const manifest = [];
  for (const src of SOURCES) {
    if (src.file) {
      const abs = path.join(ROOT, src.file);
      if (!existsSync(abs)) fail(`Allowlisted source is missing: ${src.file}`);
      allowed.add(abs);
      manifest.push({ kind: src.kind, abs, rel: src.file });
      continue;
    }
    const absDir = path.join(ROOT, src.dir);
    if (!existsSync(absDir)) fail(`Allowlisted directory is missing: ${src.dir}`);
    const entries = (await readdir(absDir)).filter((f) => f.endsWith(src.ext)).sort();
    if (entries.length === 0) fail(`No ${src.ext} files found in ${src.dir}`);
    for (const entry of entries) {
      const abs = path.join(absDir, entry);
      allowed.add(abs);
      manifest.push({ kind: src.kind, abs, rel: path.join(src.dir, entry) });
    }
  }
  return { allowed, manifest };
}

// -----------------------------------------------------------------------------
// Renderers
// -----------------------------------------------------------------------------

/**
 * services.ts is TypeScript with no runtime imports, so bundling it and
 * importing the result gives us the real data structure rather than a regex
 * guess at it. Rendered as one markdown doc per service.
 */
async function renderServices(absPath) {
  const built = await esbuild.build({
    entryPoints: [absPath],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    target: "es2022",
    logLevel: "silent",
  });
  const code = built.outputFiles[0].text;
  const mod = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
  );
  const pages = mod.SERVICE_PAGES;
  if (!Array.isArray(pages) || pages.length === 0) {
    fail("SERVICE_PAGES did not resolve to a non-empty array");
  }

  return pages.map((p) => {
    const lines = [
      `# Service: ${p.shortName}`,
      ``,
      `Slug: ${p.slug}`,
      `Page: https://ascendsystems.ai/services/${p.slug}`,
      ``,
      `## What it is`,
      ``,
      p.hero?.subhead ?? "",
      ``,
      `## The problem it solves`,
      ``,
      ...(p.problem?.body ?? []),
      ``,
      `## How the work runs`,
      ``,
      ...(p.approach ?? []).map((s) => `- **${s.step}** — ${s.detail}`),
      ``,
      `## Pricing`,
      ``,
      p.pricing?.body ?? "",
      ``,
      ...(p.pricing?.anchors ?? []).map((a) => `- ${a.label}: ${a.value}`),
      ``,
      `## Questions callers ask`,
      ``,
      ...(p.faqs ?? []).flatMap((f) => [`**${f.q}**`, ``, f.a, ``]),
      `## Related services`,
      ``,
      (p.relatedServices ?? []).join(", "),
      ``,
    ];
    return { name: `service-${p.slug}.md`, body: lines.join("\n") };
  });
}

/** Case studies: keep the body, flatten the useful frontmatter into a header. */
async function renderCaseStudy(absPath, rel) {
  const raw = await readFile(absPath, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) fail(`Case study has no frontmatter block: ${rel}`);
  const [, frontmatter, body] = match;

  const field = (key) => {
    const m = new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m").exec(frontmatter);
    return m ? m[1].trim() : null;
  };

  const header = [
    `# Case study: ${field("title") ?? path.basename(rel, ".md")}`,
    ``,
    field("client") ? `Client: ${field("client")}` : null,
    field("industry") ? `Industry: ${field("industry")}` : null,
    field("status") ? `Status: ${field("status")}` : null,
    ``,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return {
    name: `case-study-${path.basename(rel, ".md")}.md`,
    body: `${header}\n${body.trim()}\n`,
  };
}

/** MSA: strip the Astro frontmatter fence and the markup, keep the legal text. */
async function renderMsa(absPath) {
  const raw = await readFile(absPath, "utf8");
  const withoutFence = raw.replace(/^---\n[\s\S]*?\n---\n/, "");
  const text = withoutFence
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(h[1-6]|p|li|section|div)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, "") // Astro expressions
    .replace(/&(ldquo|rdquo|quot);/g, '"')
    .replace(/&(lsquo|rsquo|apos);/g, "'")
    .replace(/&(mdash|ndash);/g, "—")
    .replace(/&middot;/g, "·")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&") // last: so &amp;lt; doesn't double-decode
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();

  return {
    name: "master-services-agreement.md",
    body: `# Ascend Systems — Master Services Agreement\n\nThese are the standard engagement terms. Summarise them for a caller; never read them verbatim, and never give legal advice about them.\n\n${text}\n`,
  };
}

// -----------------------------------------------------------------------------
// The firewall. Exported so the test can prove it actually trips on real
// forbidden content — a denylist that has only ever been run against clean
// input has not been tested.
// -----------------------------------------------------------------------------
export function scanForViolations(docs) {
  const violations = [];
  for (const doc of docs) {
    const haystack = `${doc.name}\n${doc.body}`.toLowerCase();
    for (const term of FORBIDDEN) {
      if (haystack.includes(term.toLowerCase())) {
        const line =
          doc.body.split("\n").find((l) => l.toLowerCase().includes(term.toLowerCase())) ?? "";
        violations.push(`${doc.name}: contains "${term}" — ${line.trim().slice(0, 120)}`);
      }
    }
  }
  return violations;
}

// -----------------------------------------------------------------------------
// Build
// -----------------------------------------------------------------------------
async function main() {
  const { allowed, manifest } = await resolveAllowed();

  const docs = [];
  for (const entry of manifest) {
    assertAllowed(entry.abs, allowed);
    if (entry.kind === "services") docs.push(...(await renderServices(entry.abs)));
    else if (entry.kind === "case-studies") docs.push(await renderCaseStudy(entry.abs, entry.rel));
    else if (entry.kind === "msa") docs.push(await renderMsa(entry.abs));
    else if (entry.kind === "markdown") {
      docs.push({ name: path.basename(entry.rel), body: await readFile(entry.abs, "utf8") });
    }
  }

  const violations = scanForViolations(docs);
  if (violations.length > 0) {
    fail(
      `Knowledge-base firewall tripped. The caller-facing agent must not receive this:\n` +
        violations.map((v) => `  • ${v}`).join("\n")
    );
  }

  const totalBytes = docs.reduce((n, d) => n + Buffer.byteLength(d.body), 0);

  if (CHECK_ONLY) {
    console.log(`✓ firewall clean — ${docs.length} docs, ${(totalBytes / 1024).toFixed(1)} KB`);
    return;
  }

  // Refuse to wipe a hand-written collection. A generated one always carries a
  // MANIFEST.json; Imperial's is authored by hand and must survive a stray
  // --tenant imperial.
  if (existsSync(OUT_DIR) && !existsSync(path.join(OUT_DIR, "MANIFEST.json"))) {
    fail(
      `${path.relative(ROOT, OUT_DIR)} exists but was not generated by this script ` +
        `(no MANIFEST.json). It looks hand-written — refusing to overwrite it.`
    );
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  for (const doc of docs) {
    await writeFile(path.join(OUT_DIR, doc.name), doc.body, "utf8");
  }
  await writeFile(
    path.join(OUT_DIR, "MANIFEST.json"),
    JSON.stringify(
      {
        generated_by: "scripts/build-voice-kb.mjs",
        tenant: TENANT,
        audience: "caller-facing voice agent (public)",
        sources: manifest.map((m) => m.rel),
        documents: docs.map((d) => d.name),
        bytes: totalBytes,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    `✓ ${docs.length} docs → ${path.relative(ROOT, OUT_DIR)}/ (${(totalBytes / 1024).toFixed(1)} KB)`
  );
  console.log(`✓ firewall clean — checked ${FORBIDDEN.length} forbidden terms`);
  for (const doc of docs) console.log(`    ${doc.name}`);
}

// Only build when run directly — the test imports FORBIDDEN and
// scanForViolations from this module.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => fail(err?.stack ?? String(err)));
}
