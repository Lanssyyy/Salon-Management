# Salon Management Desktop User Guide

## Current state

This repository currently provides the Windows desktop shell for Salon Management. The original Base44 application source was not present in the repository, so the shell displays migration status until the exported app is added.

## Running in development

```bash
npm install
npm run electron:dev
```

## Building the Windows installer

```bash
npm run electron:build
```

Expected output after a successful Windows packaging run:

```text
release/Salon Management Setup.exe
```

## Desktop capabilities in this foundation

- Native application window.
- Secure preload bridge.
- Native file picker IPC endpoint.
- Native print dialog IPC endpoint.
- Windows installer metadata.
