# React Native KYC SDK architecture rules

**Status:** Approved design. Tooling choices are subject to the integration and offline checks.

## Module boundaries

1. Distribute one npm package with independent document, face, and conditional NFC capabilities. The host app owns the order of operations and verification decisions.
2. Define one typed React Native Codegen TurboModule spec per native capability. Implement the generated Android interfaces in Kotlin. Use Objective-C++ only for the iOS Codegen adapter and registration. Keep iOS services in Swift. [React Native Swift adapter](https://reactnative.dev/docs/the-new-architecture/turbo-modules-with-swift)
3. Keep the public TypeScript API separate from the generated interfaces. Use small native contracts, explicit expected outcomes, and stable operational errors. Keep framework types and hardware handles inside native code.
4. Share one pure TypeScript MRZ parser across platforms. Apply ICAO TD1 rules after confirming the supported layouts against authoritative specimens. Keep OCR candidate selection, formatting validation, and authenticity claims distinct. Preserve Turkish diacritics in visual fields and MRZ fillers in the MRZ path. [ICAO Doc 9303](https://www.icao.int/publications/doc-series/doc-9303)

## Platform tooling

- **Android.** Evaluate bundled ML Kit for OCR and face detection, and CameraX for still capture. Confirm dependency disclosures against the agreed network policy. On-device inference and zero network activity are separate requirements. [ML Kit model installation](https://developers.google.com/ml-kit/tips/installation-paths) · [ML Kit terms and privacy](https://developers.google.com/ml-kit/terms)
- **iOS.** Evaluate Vision for OCR and face detection, and AVFoundation for still capture. Verify Turkish recognition on the chosen OS floor. [Apple Vision](https://developer.apple.com/documentation/vision/) · [AVFoundation](https://developer.apple.com/documentation/avfoundation/)
- **Packaging.** Use a library-level Gradle build and CocoaPods podspec. Declare React and React Native as peer dependencies and ship native sources and Codegen specs. Use the packed tarball in a clean consumer to verify autolinking and release builds. Start with the 0.88 integration baseline and expand the declared range only after testing it.

## Runtime and data

1. Use promises for one-shot calls. Give each camera or NFC session one owner. Define concurrent calls, interruption, timeout, cancellation, and cleanup. Settle each operation once and release hardware on every exit path.
2. Validate inputs at the SDK boundary. Decode bounded local images and process them off the UI thread. Use platform-required queues for UI and session operations. Document normalized face coordinates and mirroring.
3. Pass local image URIs across the bridge. Document ownership, lifetime, and cleanup for SDK-created files. Keep captures in app-private temporary storage and return only the requested data.
4. Keep real identity data and chip access secrets out of logs, crash metadata, tests, and fixtures. Verify the full feature flow on a fresh install without networking. Check dependency network activity separately against the approved policy.

## NFC feasibility gate

- Obtain an authoritative profile and authorized non-personal test media. Verify card revisions, contactless transport, the application identifier, access controls and inputs, and the minimum useful read-only fields. Treat passport BAC and PACE as unverified for the Turkish card profile.
- Evaluate Android `IsoDep` and iOS Core NFC as transports. Demonstrate that the supported application can be read from a normally signed iOS consumer with the required entitlement, usage description, and application identifiers. Demonstrate the equivalent offline read on Android. [Android IsoDep](https://developer.android.com/reference/android/nfc/tech/IsoDep) · [Apple Core NFC](https://developer.apple.com/documentation/corenfc/nfctagreadersession)
- Check whether the selected access path requires EKDS infrastructure, terminal credentials, or any online service. A dependency on those services or unavailable credentials fails the offline V1 gate. [TÜBİTAK EKDS overview](https://oktem.bilgem.tubitak.gov.tr/hizmetler/elektronik-kimlik-dogrulama-sistemi/)
- Before exposing a public NFC spec, record the supported profile, permitted results, and repeatable device evidence for successful reads, removal, cancellation, and retry. If the product requires authenticity, define the signed data, trust anchors, and offline update policy. Expose authenticity separately from read success.

## Repository layout

```text
docs/
  product/
  planning/
  architecture/
    decisions/
src/
  index.ts
  specs/
  document/
    mrz/
  face/
android/              # Kotlin services, Codegen implementations, Gradle
ios/                  # Swift services, Objective-C++ adapters
example/              # Consuming React Native app
tests/
  fixtures/           # Synthetic documents, MRZ vectors, and faces
.github/workflows/    # Android and macOS build checks
```

Keep `package.json` and the library podspec at the root. Add NFC code and specs after the feasibility gate passes. Record material decisions under `docs/architecture/decisions/` when they are made.
