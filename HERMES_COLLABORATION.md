# ThaiEleHub Hermes + Codex Collaboration

## Purpose

Hermes is the read-only monitoring and planning assistant for ThaiEleHub. Codex
remains the implementation assistant for theme code, Shopify admin changes,
browser verification, and controlled publishing.

Hermes should not publish theme changes, edit Shopify content, or contact
customers without a fresh user instruction.

## Shared Workflow

1. A daily Hermes watchdog runs `scripts/thaielehub-seo-audit.sh`.
2. The watchdog checks the public site without using an LLM or Google Maps API.
3. Hermes delivers the plain-text result to the configured Telegram home chat.
4. A weekly Codex automation performs a deeper SEO/GEO review and reports a
   prioritized backlog.
5. Codex implements approved changes and verifies the live storefront.

## Daily Watchdog Scope

The script checks:

- Homepage availability
- Sitemap availability
- Blog index availability
- FAQ article availability
- Chiang Mai, Bangkok, and Pattaya product page availability
- Common mojibake markers
- Visible legacy brand text: `Living Green` and `Big Boy`
- Visible WhatsApp booking calls to action
- FAQPage and TravelAgency structured data

Run it manually:

```sh
scripts/thaielehub-seo-audit.sh
```

## Telegram Requests For Hermes

Use Hermes for analysis and planning with prompts such as:

```text
Audit thaielehub.myshopify.com as a read-only SEO reviewer. Report broken pages,
visible legacy brand text, missing structured data, and the three highest-value
content improvements. Do not modify Shopify.
```

```text
Review the ThaiEleHub project plan. Create a prioritized Kanban backlog for
homepage UX, product conversion, blog SEO, and AI-search answer quality. Do not
publish or edit the live site.
```

```text
Draft an original FAQ outline for visitors comparing Chiang Mai, Bangkok, and
Pattaya elephant sanctuary tours. Mark factual claims that need human review.
```

## Safety Rules

- Daily jobs remain read-only and use `--no-agent` where possible.
- Google Maps autocomplete is not called by the watchdog.
- Publishing remains a user-confirmed Codex action.
- Customer messages and Telegram test messages require explicit confirmation.
- Hermes Kanban workers should use isolated worktrees for code proposals.
- Any generated SEO article must receive factual review before publication.

## Optional MCP Bridge

Hermes provides `hermes mcp serve`, which can expose Hermes conversations to
another MCP-capable agent. This is optional. The shared watchdog and Kanban flow
work without enabling the MCP bridge or the Hermes API server.

## Mobile Dispatch From Telegram

The dedicated Hermes Kanban board is `thaielehub`. Use it when working from a
phone so ThaiEleHub tasks remain separate from unrelated projects.

Create a read-only review task:

```text
/kanban --board thaielehub create "Audit product booking UX" --body "Review the
current ThaiEleHub product pages. Report verified issues and suggested fixes.
Do not modify Shopify or publish changes." --workspace dir:/Users/ouyowu/Documents/大象营网站项目thaielehub
```

Create a local code proposal in an isolated worktree:

```text
/kanban --board thaielehub create "Prepare SEO cleanup patch" --body "Remove
visible legacy brand text and WhatsApp booking CTA remnants. Modify local theme
files only. Run checks and report changed files. Do not publish Shopify."
--workspace worktree --goal
```

Check progress:

```text
/kanban --board thaielehub list
```

Inspect one task:

```text
/kanban --board thaielehub show TASK_ID
```

Plain Telegram messages can also ask Hermes to analyze, research, or edit local
files. Use Kanban for multi-step work so the task is durable and the gateway can
notify Telegram when the worker completes or blocks.

Hermes cannot resume the currently open Codex desktop conversation. It can work
independently on the same project, prepare patches, run read-only checks, and
leave a backlog for Codex. Publishing Shopify, sending customer messages,
deleting files, and other external side effects still require a fresh explicit
instruction.
