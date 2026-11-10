# Playwright Test Automation Portfolio

## Overview

This repository showcases practical web test automation skills using Playwright and TypeScript.

It contains automated tests for web application functionality, user workflows, and cross-browser behavior. The project emphasizes maintainable test organization, reusable helpers, and validation of real user-facing scenarios.

## Tech Stack

- Playwright
- TypeScript
- Node.js
- GitHub Actions

## Test Coverage

### Portfolio Homepage

- Homepage title validation
- Link visibility verification
- Navigation to the Getting Started page
- Cross-browser test execution

### Sauce Demo Application

**Login**

- Successful login with valid credentials
- Login validation for locked-out users

**Inventory**

- Product information and sorting validation
- Product details navigation and content verification
- Shopping cart interactions from inventory and product details
- Browser navigation and page refresh behavior
- Inventory state and sorting behavior after navigation and refresh

**Shopping Cart and Checkout**

- Adding and removing products
- Cart item count and product information validation
- Empty cart behavior
- Multiple-product checkout workflows
- Checkout form validation
- Order summary verification
- Checkout cancellation and navigation behavior
- Cart persistence across navigation and refresh

## Cross-Browser Testing

The test suite is configured to run against three browser engines:

- Chromium
- Firefox
- WebKit

## Latest Test Results

**171 passed test executions**

The latest full-suite run completed successfully, covering 57 test scenarios across all three browser projects.

## Running the Tests

Install dependencies:

```bash
npm install
```

Run the complete test suite:

```bash
npx playwright test
```

Run the portfolio homepage tests:

```bash
npx playwright test tests/portfolio-homepage.spec.ts
```

Run the Sauce Demo login tests:

```bash
npx playwright test tests/sauce-demo-login.spec.ts
```

Run the Sauce Demo cart tests:

```bash
npx playwright test tests/sauce-demo-cart.spec.ts
```

Run the Sauce Demo inventory tests:

```bash
npx playwright test tests/sauce-demo-inventory.spec.ts
```

View the HTML test report:

```bash
npx playwright show-report
```

## Project Structure

```text
qa-automation-portfolio/
├── .github/
│   └── workflows/
├── tests/
│   ├── example.spec.ts
│   ├── login-helper.ts
│   ├── portfolio-homepage.spec.ts
│   ├── sauce-demo-cart.spec.ts
│   ├── sauce-demo-inventory.spec.ts
│   └── sauce-demo-login.spec.ts
├── package.json
├── playwright.config.ts
└── README.md
```

## Continuous Integration

GitHub Actions is configured to support automated test execution as part of the project's continuous integration workflow.

## Project Goals

This portfolio demonstrates practical experience in functional testing, end-to-end test automation, cross-browser validation, reusable test design, and continuous integration.
