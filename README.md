# irs_refund_checker


## Just tired of entering my information again and again

### What it does

This prompts on the first run for your SSN, the tax year you are filing for, the filing status and the refund amount expected.
A file is created in your homedir `~/.irs_refund`, so that on the next run you do not have to enter anything.

Puppeteer will run in headless mode and will do the work for you.
The result will be shown when done.

### install

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
