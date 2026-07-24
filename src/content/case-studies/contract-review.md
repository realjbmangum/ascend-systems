---
title: "AI Contract Review — From a 2–3 Hour Read to a 15-Minute, Lawyer-Ready Summary"
slug: contract-review
client: "Confidential — regional commercial masonry contractor"
clientType: "Specialty trade contractor (commercial masonry)"
industry: "Construction / specialty trades"
status: "live"
stack: ["Claude API (Anthropic)", "PDF text extraction", "React", "Cloudflare Workers", "Cloudflare D1", "Tailwind CSS"]
metrics:
  - "Contract review time: 2–3 hours → ~15 minutes"
  - "Handles subcontracts up to ~300 pages with exhibits"
  - "Attorney time scoped to flagged clauses, not the whole document"
seoTitle: "AI Contract Review Case Study — Hours to Minutes | Ascend Systems"
seoDescription: "How Ascend Systems built an AI contract-review tool for a commercial masonry contractor — reading 300-page subcontracts, flagging risky clauses, and producing a lawyer-ready summary in about 15 minutes instead of 2–3 hours."
publishDate: "2026-07-23T09:00:00-04:00"
updatedDate: "2026-07-23T09:00:00-04:00"
---

## TL;DR

A regional commercial masonry contractor was signing subcontracts they didn't have time to fully read. Each general-contractor agreement ran anywhere from a few dozen to nearly 300 pages of terms, exhibits, and flow-down clauses — and every one carried real money in its payment terms, retainage, indemnification, and insurance requirements. Reviewing one properly meant 2–3 hours of a principal's time, or several hundred dollars to send it to an attorney, and often both. We built an AI tool that reads the entire agreement, flags the clauses that actually matter, and produces a plain-English summary plus a focused issue list ready to hand to a lawyer — turning a 2–3 hour bottleneck into about 15 minutes.

## The problem

In commercial construction, the subcontractor almost never writes the contract. The general contractor sends a take-it-or-leave-it agreement, and the sub has a narrow window to review it, flag anything unacceptable, and sign — or lose the job. These are not short documents. A single subcontract routinely arrives with the base agreement, a stack of exhibits, insurance and bonding requirements, and "flow-down" clauses that silently bind the sub to terms buried in the prime contract they've never seen.

The client's review process didn't scale with their pipeline:

- **A principal read each contract by hand** — 2–3 hours of the most expensive person in the company, doing it after the workday because there was no time during it.
- **Or it went to an attorney** — several hundred dollars per review, and a multi-day turnaround that could jeopardize a bid deadline.
- **Usually both**, which meant the risky path was skimming: signing agreements without anyone having truly read the indemnification language, the payment timing, the retainage terms, or what the flow-down clauses actually pulled in.

The real cost wasn't just the hours or the legal invoices. It was the exposure — agreements getting signed because reading them properly was too slow, and the occasional job passed on entirely because the review couldn't happen before the deadline.

## What we built

An AI contract-review tool built around one job: read the whole thing, faster and more consistently than a tired human at 9pm, and surface what a decision-maker needs to see.

- **Full-document ingestion.** Upload the subcontract PDF — including the long exhibits most tools choke on — and the system extracts the complete text, not just the first few pages.
- **Clause-level analysis.** The document is analyzed against the terms that carry risk for a trade sub: payment and pay-when-paid timing, retainage, indemnification and "hold harmless" language, termination and default triggers, insurance and additional-insured requirements, liquidated damages, change-order procedures, and flow-down provisions.
- **A plain-English summary.** Instead of 300 pages, the principal gets a readable brief: what this contract says in normal language, and where it departs from what's standard or reasonable.
- **A lawyer-ready issue list.** The output isn't "trust the AI." It's a short, specific list of the clauses worth a second look — so when an attorney *is* worth involving, they're reviewing the three things that matter, not re-reading the whole document at their hourly rate.

The design principle throughout: the tool doesn't replace legal judgment, it *targets* it. A human still makes the call — they just make it in 15 minutes with the risky clauses already in front of them, instead of 3 hours in, hoping they didn't miss something on page 214.

## The results

- **2–3 hours → about 15 minutes** per contract review.
- **Legal spend scoped to the flagged issues** rather than a full-document read — the attorney reviews the short list, not the whole agreement.
- **Faster bid and signing turnaround**, because review stopped being the step that couldn't happen in time.
- **Consistent coverage** — every contract gets read in full, the same way, instead of depending on how much time was left at the end of the day.

## Why it matters

This is the shape of work AI is genuinely good at right now, and it's a useful counter to the hype: it isn't a chatbot bolted onto a website. It's a specific, judgment-heavy, document-heavy task — the kind of thing a small business either does slowly and expensively or quietly skips — handed to a model that reads carefully and reports back, with a human still holding the final decision.

That's the pattern we look for in an AI engagement: a real bottleneck with a clear before-and-after, where the model does the reading and the person keeps the judgment. This one worked well enough that it shaped how we think about contract-review tooling for the trades more broadly.
