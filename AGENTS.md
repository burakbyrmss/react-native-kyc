# React Native KYC SDK

These instructions apply throughout the repository.

## Current phase

The project is in planning. Keep changes to planning documents and repository setup until the user approves the first release scope and asks to start implementation. Defer SDK scaffolding, dependency installation, native code, and generated bindings until then. Record unresolved product choices in the PRD.

## Read before changing the project

- [Product requirements](docs/product/prd.md) describes scope, open product decisions, and release acceptance.
- [Roadmap](docs/planning/roadmap.md) defines the milestone sequence and exit criteria.
- [Architecture rules](docs/architecture/rules.md) defines module boundaries, runtime behavior, and data handling.

## Implementation and verification

Once implementation starts, keep NFC, OCR, and face processing in independent Android and iOS native modules. Use a React Native Codegen TurboModule spec as the source of truth for each public contract. Update the affected planning docs when an approved decision changes scope, contracts, or release criteria.

Use approved test fixtures. Keep identity images, extracted identity data, and chip access secrets out of the repository and diagnostic output.

Verify module discovery and invocation in a consuming app on both platforms. Verify hardware and lifecycle behavior on physical devices. State which checks ran and which are still pending.
