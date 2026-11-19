# React Native KYC SDK product requirements

**Status:** Architecture approved. First-release card profiles and acceptance thresholds are open.

## Goal

Build an independently consumable React Native SDK for the Turkish electronic national identity card (T.C. Kimlik Kartı) on Android and iOS. The SDK processes data on the device and requires no application backend. The host app owns the user flow and any verification decision.

## V1 scope

- **Document OCR.** Accept a local image and its card side. Read the back-side MRZ first and extract the agreed front-side fields. Preserve Turkish characters in visual text. Distinguish an unreadable or ambiguous result from a successful read.
- **MRZ parsing and validation.** Validate the approved Turkish layouts, field structure, date syntax, and applicable field and composite check digits. Return structured fields with an explicit validation outcome. A valid MRZ indicates that the input passed these checks. Document authenticity requires separate evidence.
- **Face capture and assessment.** Provide a native still-photo capture flow and assess existing local images. Detect faces and report actionable quality issues such as no face, multiple faces, poor framing, blur, or insufficient light. Biometric matching and liveness are outside V1.
- **NFC, conditional.** Include read-only access only for a documented card profile that a normally signed third-party app can read offline on physical Android and iOS devices. The [architecture rules](../architecture/rules.md#nfc-feasibility-gate) define the gate. OCR and face features can ship if NFC remains unverified.
- **Host integration.** Document setup, permissions, result types, image ownership, cancellation, and retry. The host app can supply its own images and handle an unavailable capability.
- **Privacy.** Keep real personal identity data out of logs, crash metadata, tests, and fixtures. Process images and identity fields locally, limit returned fields to the agreed contract, and document temporary capture cleanup.

## Open decisions

- Which card revisions are supported, and what authoritative specimens define their front and back layouts?
- Which front-side fields are required? What counts as a readable image, and how should the SDK communicate ambiguous candidates?
- Which React Native, Android, and iOS versions and physical devices will the first release support?
- Does offline-first permit dependency diagnostics, or must the SDK make zero network requests?
- What acceptance thresholds apply to exact MRZ reads, per-field OCR accuracy, face quality decisions, and latency? Define the synthetic evaluation set before tuning.
- If NFC is feasible, which fields are useful, and does the product need a separate authenticity result?

## Release acceptance

A clean React Native app installs the packed library, autolinks it, and invokes the shipped capabilities on both platforms. Required flows work on a fresh install with networking disabled. Every shipped card profile meets the agreed OCR and MRZ criteria on both platforms. Face capture and assessment meet the agreed quality criteria and recover from permission denial, interruption, and cancellation. The package documents the supported cards, platforms, data handling, and available capabilities.
