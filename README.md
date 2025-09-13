# Playwright + Cucumber BDD Automation

> **Project:** `ploaywright-qa-task1` — Playwright + Cucumber (BDD) automation with HTML reporting and CI pipeline

---

## Table of Contents

* [Introduction](#introduction)
* [About this project & framework](#about-this-project--framework)
* [Tools & technologies used](#tools--technologies-used)
* [Repository structure (suggested)](#repository-structure-suggested)
* [Prerequisites](#prerequisites)
* [Local setup & run instructions](#local-setup--run-instructions)

  * [Linux / macOS (bash)](#linux--macos-bash)
  * [Windows (PowerShell)](#windows-powershell)
* [CI / GitHub Actions pipeline](#ci--github-actions-pipeline)

  * [What the supplied workflow does (step-by-step)](#what-the-supplied-workflow-does-step-by-step)
* [Environment variables & secrets](#environment-variables--secrets)
* [Report generation & artifacts](#report-generation--artifacts)
* [Troubleshooting & common fixes](#troubleshooting--common-fixes)
* [Recommended improvements & notes](#recommended-improvements--notes)
* [Contributing](#contributing)
* [License](#license)

---

## Introduction

This repository contains an automated test framework implemented using Playwright and Cucumber (BDD) in TypeScript. Tests can be executed locally and in CI (GitHub Actions). The pipeline generates an HTML report, zips it, uploads it as an artifact and attempts to email the zipped report.

## About this project & framework

* BDD-style feature files (`.feature`) are used to describe acceptance criteria.
* Step definitions implemented in TypeScript using `@cucumber/cucumber`.
* UI automation powered by Playwright.
* Reports are produced using a custom `reporter.ts` (invoked by `npm run report`), and multiple-cucumber / html reporter packages are included in `devDependencies`.
* CI pipeline runs scheduled tests (cron Mon–Fri) and can be triggered manually via `workflow_dispatch`.

## Tools & technologies used

Versions included in `package.json` (installed as devDependencies / dependencies):

* `@cucumber/cucumber` (BDD runner)
* `@playwright/test` and `playwright` (Playwright test tooling & browsers)
* `typescript`, `ts-node` (TypeScript execution)
* `cucumber-html-reporter`, `multiple-cucumber-html-reporter` (HTML reporters)
* `cross-env` (cross-platform env var handling)
* `dotenv` (load `.env` files)
* `zip` and GitHub Actions (for report artifact and upload)

> **Note:** exact versions are listed in `package.json` — keep those updated as needed. The workflow currently uses Node `14` (see `.github/workflows/*`). Adjust if your framework needs a newer Node version.

## Repository structure (suggested)

```
├─ .github/workflows/            # CI workflow YAML(s)
├─ features/                     # .feature files
├─ src/
│  ├─ steps/                     # cucumber step definitions (.ts)
│  ├─ pages/                     # page objects
│  └─ utils/                     # utilities (logging, world, helpers)
├─ reports/                      # report outputs (json/html)
├─ reporter.ts                   # custom report generator script
├─ cucumber-api.json             # cucumber-js config used in package.json test script
├─ package.json
└─ tsconfig.json
```

## Prerequisites

* Node.js & npm (the workflow uses `node-version: '14'`). Locally: Node 14+ is fine, but if you use newer package releases you might need Node 16/18+. Use the Node version that matches your environment.
* Git
* Chromium/Firefox/WebKit browsers for Playwright (installed by `npx playwright install`)
* (If emailing reports) a valid SMTP username/password (e.g. Gmail app password) stored as a GitHub secret.

## Local setup & run instructions

> The project uses `npm ci` in CI to ensure deterministic installs. Locally you can use `npm install` or `npm ci`.

### Linux / macOS (bash)

1. Clone the repository:

```bash
git clone <repo-url>
cd ploaywright-qa-task1
```

2. Install dependencies:

```bash
npm ci
```

3. Install Playwright browsers (required once):

```bash
npx playwright install
```

4. Set environment variable (temporary for the shell) and run tests:

```bash
# temporary env for current shell only
export ENV=prod
# run cucumber tests (script from package.json)
npm test
```

Or use the package script that runs tests and report together:

```bash
npm run test:report
```

5. Generate the HTML report only (if you want to re-run the reporter):

```bash
npm run report
```

> If `npm run report` uses `ts-node reporter.ts`, ensure `reporter.ts` exists and is runnable. `ts-node` is included in `devDependencies`.

### Windows (PowerShell)

PowerShell sets env vars differently. The `package.json` currently contains a script named `env` with PowerShell syntax (`$env:ENV='prod'`) — but for consistent cross-platform behavior, prefer `cross-env` (see recommended improvements).

Temporary PowerShell env & run:

```powershell
$env:ENV = 'prod'
npm test
```

Or with `cross-env` (preferred, cross-platform):

```powershell
npx cross-env ENV=prod npm test
```

## CI / GitHub Actions pipeline

The repository includes a workflow file that runs scheduled Playwright tests and performs reporting steps. The workflow does the following (high-level):

### What the supplied workflow does (step-by-step)

1. **Trigger**

   * `schedule` with `cron: '30 2 * * 1-5'` — that executes at **02:30 UTC** which is **08:00 IST** (Mon–Fri). There is also `workflow_dispatch` for manual runs.

2. **Runs-on**: `ubuntu-latest` with a 60 minute timeout.

3. **Steps**:

   * Checkout the repo (`actions/checkout@v2`).
   * Setup Node.js (`actions/setup-node@v4`) with `node-version: '14'`.
   * Install npm deps using `npm ci`.
   * Install Playwright browsers via `npx playwright install`.
   * Set `ENV=prod` in the GitHub job environment via `echo "ENV=prod" >> $GITHUB_ENV`.
   * Run Playwright tests: `npx playwright test --with-deps` (this uses your Playwright test command — if this flag is not recognized in your setup, change to `npx playwright test`).
   * Generate the HTML report using `npm run report` (this runs `ts-node reporter.ts` with metadata params per `package.json`).
   * Zip the report folder into `playwright-report.zip`.
   * Upload the zipped artifact with `actions/upload-artifact@v4` (retention 30 days).
   * Send the zipped report via email using `dawidd6/action-send-mail@v3` with SMTP server credentials fetched from secrets.

## Environment variables & secrets

**In CI**:

* The workflow writes `ENV=prod` to `$GITHUB_ENV` (this makes `process.env.ENV === 'prod'` available to Node).
* The mail step expects `PASSWORD` (or in your workflow it uses `${{ secrets.EMAIL_PASSWORD }}`) — ensure you define this secret in the repository settings.

**For Gmail SMTP** (if using Gmail):

1. Enable 2‑factor authentication on the Gmail account.
2. Create an **App Password** in Google Account > Security (select *Mail* app, *Other* device) and copy the generated password.
3. Add the app password to your repo secrets as `EMAIL_PASSWORD`.

> **Security note:** Never commit credentials to source control. Use repo or org secrets.

## Report generation & artifacts

* `npm run report` runs `ts-node reporter.ts ...` (as configured in `package.json`). This should create an HTML report folder (the workflow expects `playwright-report`).
* The workflow zips `playwright-report` to `playwright-report.zip` and uploads it as an artifact.
* Download the artifact from the workflow run UI to view the zipped HTML files locally. Extract and open `index.html` in a browser.

## Troubleshooting & common fixes

**1. Empty / no data in HTML report**

* Ensure your test runner actually emits JSON / results that the `reporter.ts` consumes (e.g., a `cucumber.json` or cucumber-js `--format json:` output).
* Verify the paths: the reporter script expects reports in a specific folder (e.g., `reports/cucumber.json`). Confirm the reporter's input path.
* Make sure `ts-node` can run `reporter.ts` in CI (`ts-node` is installed in `devDependencies`).

**2. Environment variable differences (Windows vs Linux)**

* `package.json` currently has an `env` script using PowerShell syntax. Use `cross-env` for cross-platform compatibility (example below in "Recommended improvements").

**3. Gmail SMTP failures when sending email from CI**

* Use a Gmail App Password (requires 2FA). Plain account password often fails.
* Check that the SMTP username, port, and TLS settings are correct. The action `dawidd6/action-send-mail` uses the SMTP fields you supplied in the workflow.

**4. Playwright browser not found / tests fail**

* Ensure step `npx playwright install` completes successfully. In CI this should run before tests.

**5. `npx playwright test --with-deps` unknown flag**

* If your Playwright version or scripts don’t support `--with-deps`, change the workflow to `npx playwright test` or use your npm test script.

## Recommended improvements & notes

* **Use `cross-env` for cross-platform environment scripts**

  * Current `package.json` has:

```json
"scripts": {
  "env": "$env:ENV='prod'",
  ...
}
```

* Replace with (cross-platform):

```json
"scripts": {
  "env": "cross-env ENV=prod",
  "test": "cucumber-js --config cucumber-api.json",
  "report": "ts-node reporter.ts --reportName 'Playwright BDD Report' --pageTitle 'Automation Results' --metadata.browser.name 'chromium' --metadata.browser.version 'latest' --metadata.platform.name 'ubuntu' --metadata.platform.version '20.04' --metadata.device 'GitHub Actions Runner' --customData '{\"title\": \"Run Info\", \"data\": [{\"label\": \"Environment\", \"value\": \"Production\"}, {\"label\": \"Execution Time\", \"value\": \"$(date +'%T')\"}]}'"
}
```

* **Cache `node_modules` in CI** (use `actions/cache@v4`) to speed up runs if desired.
* **Use `actions/checkout@v4`** and the latest recommended action versions where possible.
* **Pin Node version** in the workflow to the version you develop/test with; if your dependencies need Node 16/18, change `node-version: '14'`.
* **Avoid emailing large artefacts directly** from CI using SMTP — consider storing reports as artifacts (already done) and sending a short notification (email/Slack) linking to the artifact or job run instead.

## Example: Add cucumber json formatter (if you need JSON for reporters)

You can update your cucumber-js execution to output JSON which many reporters read:

```jsonc
// as part of a cucumber-js config (or add to CLI args)
"format": [
  "progress",
  "json:reports/cucumber-report.json"
]
```

Then ensure `reporter.ts` reads `reports/cucumber-report.json`.

## Contributing

Feel free to open issues or PRs. When you add new features or change the CI, update this README with new environment variables and steps.

## Contact / Maintainer

* Maintainer: tech (author listed in package.json)
* For CI mail credentials: add `EMAIL_PASSWORD` to GitHub repository secrets.

## License

This project uses the license defined in `package.json` (`ISC`).

---

*Generated README — modify any paths, file names or scripts as needed to match your project implementation.*
