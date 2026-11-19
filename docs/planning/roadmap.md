# React Native KYC SDK roadmap

**Status:** Approved architecture. Implementation starts after the first-release scope is settled and the user asks to begin.

## 0. Define the first release

Settle the open decisions in the [PRD](../product/prd.md). Obtain authoritative layout references, approved synthetic fixtures, and physical test devices. Agree on thresholds for exact MRZ reads, per-field OCR, face quality, and latency. Start NFC feasibility as a parallel investigation so it does not block OCR or face work.

**Exit criterion:** The card revisions, required fields, platform matrix, offline policy, evaluation inputs, and thresholds are agreed.

## 1. Prove package integration

Set up the library and a minimal consuming example app. Start the integration spike on React Native 0.88. Verify a typed Codegen call through Kotlin on Android and an Objective-C++ adapter into Swift on iOS.

**Exit criterion:** Clean consuming apps install the packed npm tarball, autolink, build in release mode, and invoke the module on both platforms without manual changes to the library sources.

## 2. Deliver MRZ validation and document OCR

Build the shared TypeScript parser first. Test valid and invalid synthetic vectors covering lengths, fillers, each check digit, date edge cases, and ambiguous OCR candidates. Add native OCR for the approved back and front layouts. Use held-out synthetic images with rotation, glare, blur, and cropping.

**Exit criterion:** The parser passes the agreed vectors. Each platform meets the exact MRZ read and per-field OCR thresholds. Report incorrect and unreadable results separately.

## 3. Deliver face capture and assessment

Build native still capture and local-image assessment. Use synthetic images for repeatable quality cases. Use physical devices to exercise permissions, backgrounding, interruption, cancellation, and retry without retaining personal captures in test artifacts.

**Exit criterion:** Both platforms meet the agreed quality thresholds, return a usable capture URI or a typed outcome, and release the camera on every exit path.

## 4. Decide NFC scope and verify the release

Record the NFC go/no-go decision using the [feasibility gate](../architecture/rules.md#nfc-feasibility-gate). Implement and test the documented profile only if it passes. Run the support matrix, fresh-install offline checks, and tarball integration. Inspect logs, errors, caches, and packaged fixtures for identity data. Document platform setup and known limits.

**Exit criterion:** A clean consuming app runs every shipped capability on both platforms. The release states the tested versions, card revisions, offline behavior, and NFC availability.
