# Playwright Test Automation Portfolio

## Overview

This project demonstrates my practical skills in web test automation using Playwright and TypeScript.

The goal is to build a maintainable test suite that validates key user-facing behaviors through automated browser testing.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- GitHub Actions

## Current Test Coverage

- Homepage title validation
- Link visibility verification
- Navigation to the Getting Started page
- Cross-browser test execution with Chromium, Firefox, and WebKit

## Running the Tests

Install dependencies:

```bash
npm install
```

Run all tests:

```bash
npx playwright test
```

Run the portfolio homepage tests:

```bash
npx playwright test tests/portfolio-homepage.spec.ts
```

View the HTML test report:

```bash
npx playwright show-report
```

## Project Status

This portfolio is a work in progress. Additional test scenarios and improvements will be added as the project evolves.
