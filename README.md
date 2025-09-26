# Epic Writer Agent

Generate consistent, testable epics from just an **idea** and a **high-level overview**.

## Quick start (Web UI)

```bash
npm install
cp .env.example .env  # add your OPENAI_API_KEY
npm run dev
```

Then open http://localhost:3000 in your browser.

## Quick start (CLI)

```bash
npm install
cp .env.example .env  # add your OPENAI_API_KEY
npm run build

# Text-only epic
./dist/index.js "AI-driven release notes" "Automate release notes from merged PRs; start with GitHub; integrate with Jira."

# Text + JSON output (validated)
./dist/index.js "Unified status page for payroll" "Single place customers check payroll service health across regions…" --json
```

## Options (CLI)
- `--model` (default: `gpt-4.1-mini`)
- `--temperature` (default: `0.2`)
- `--json` to include validated JSON output.

## Notes
- The system prompt enforces your required section order and style.
- JSON guardrail uses Zod for validation; you can pipe it into Jira/Confluence exporters.
