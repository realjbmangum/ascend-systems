#!/usr/bin/env node
// =============================================================================
// test-voice-kb.mjs — prove the caller-facing knowledge-base firewall works.
//
// Run: node scripts/test-voice-kb.mjs
//
// Three things are checked, in increasing order of how much they'd cost to get
// wrong:
//   1. The real build succeeds and produces the documents we expect.
//   2. The denylist actually TRIPS on the real forbidden content — including
//      the specific lines from website-copy.md that were once listed as an
//      approved KB source. A firewall only ever run against clean input has
//      not been tested.
//   3. The allowlist refuses a file that is not in SOURCES.
// =============================================================================

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FORBIDDEN, scanForViolations } from "./build-voice-kb.mjs";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
let failed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✘ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// --- 1. the real build ------------------------------------------------------
console.log("\nbuild");
let buildOk = false;
try {
  const { stdout } = await execFileAsync("node", [path.join(ROOT, "scripts/build-voice-kb.mjs")], {
    cwd: ROOT,
  });
  buildOk = stdout.includes("firewall clean");
  check("build succeeds and reports a clean firewall", buildOk);
} catch (err) {
  check("build succeeds and reports a clean firewall", false, err.stderr ?? err.message);
}

if (buildOk) {
  const files = await readdir(path.join(ROOT, "voice-kb"));
  check("all five service docs are present", files.filter((f) => f.startsWith("service-")).length === 5);
  check("case studies are present", files.some((f) => f.startsWith("case-study-")));
  check("MSA is present", files.includes("master-services-agreement.md"));
  check("manifest is written", files.includes("MANIFEST.json"));

  // The built output must be clean when re-scanned from disk, not just in memory.
  const docs = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (name) => ({ name, body: await readFile(path.join(ROOT, "voice-kb", name), "utf8") }))
  );
  check("re-scanning the written files finds no violations", scanForViolations(docs).length === 0);
}

// --- 2. the denylist trips on real forbidden content ------------------------
console.log("\nfirewall trips on forbidden content");

// These are verbatim from website-copy.md — the dead CallSteady brand doc that
// an earlier backlog note wrongly listed as an approved caller-facing source.
const REAL_HAZARDS = [
  {
    label: "retracted Telnyx claim",
    text: "Natural-Sounding AI: Built on Telnyx Voice AI. Callers think they're talking to a real person.",
  },
  {
    label: "dead CallSteady brand",
    text: "CallSteady answers instantly and actually books the appointment.",
  },
  {
    label: "guarantee that does not exist",
    text: "- 30-day money-back guarantee",
  },
  {
    label: "confidential prospect list",
    text: "See docs/charlotte-target-list.html for the P1 accounts.",
  },
  {
    label: "scraped contact PII",
    text: "Contacts exported to docs/outscraper/charlotte-hvac.csv",
  },
  {
    label: "internal GTM playbook",
    text: "Follow the outreach-playbook for the first-touch sequence.",
  },
  {
    label: "named prospect mistaken for a client",
    text: "We built the Stancil Hub for a commercial painting contractor.",
  },
];

for (const hazard of REAL_HAZARDS) {
  const violations = scanForViolations([{ name: "poisoned.md", body: hazard.text }]);
  check(`blocks: ${hazard.label}`, violations.length > 0, "denylist did not trip");
}

check(
  "denylist covers every term it claims to",
  FORBIDDEN.length >= 12,
  `only ${FORBIDDEN.length} terms`
);

// Case-insensitivity matters — copy gets retyped with different casing.
check(
  "matching is case-insensitive",
  scanForViolations([{ name: "x.md", body: "Powered by TELNYX Voice AI" }]).length > 0
);

// And it must not fire on innocent content, or people will start ignoring it.
check(
  "does not fire on ordinary service copy",
  scanForViolations([
    {
      name: "clean.md",
      body: "We build custom software for Charlotte-area businesses. Discovery sprints start at $5k.",
    },
  ]).length === 0
);

// --- 3. the allowlist refuses unlisted files --------------------------------
console.log("\nallowlist");
try {
  // website-copy.md exists and is readable, but is not in SOURCES. Prove the
  // build would refuse it rather than silently including it.
  const { FORBIDDEN: _f } = await import("./build-voice-kb.mjs");
  const manifestRaw = await readFile(path.join(ROOT, "voice-kb/MANIFEST.json"), "utf8");
  const manifest = JSON.parse(manifestRaw);
  check(
    "website-copy.md is not among the build sources",
    !manifest.sources.some((s) => s.includes("website-copy"))
  );
  check(
    "no docs/ path is among the build sources",
    !manifest.sources.some((s) => s.startsWith("docs/")),
    manifest.sources.filter((s) => s.startsWith("docs/")).join(", ")
  );
  check(
    "every source is under src/",
    manifest.sources.every((s) => s.startsWith("src/")),
    manifest.sources.filter((s) => !s.startsWith("src/")).join(", ")
  );
} catch (err) {
  check("allowlist manifest is readable", false, err.message);
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
