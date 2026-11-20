# KYC Smoke Test

An Expo SDK 58 app that checks whether the installed KYC SDK can call the native front-camera capability on Android and iOS.

## Local checks

```sh
npm ci
npm run typegen
npm run typecheck
npm run lint
npm run format:check
npm test -- --ci
npx --no-install expo-doctor
npm audit --audit-level=high
```

The UI tests exercise the front-camera result and error display with a mocked native call. Install a development build on each platform to verify the real module.

## GitHub Actions and EAS

Add `EXPO_TOKEN` as an Actions secret in the SDK repository. The token must have access to the linked EAS project. EAS must already have valid Android and iOS signing credentials for the `development` profile.

The [root workflow](../.github/workflows/ci.yml) tests a fresh SDK tarball on pull requests and pushes to `main` or `master`. A passing push or manual run on either branch queues internal development builds for both platforms using the checked tarball. The job summary links to the EAS builds, where you can follow native compilation and download the finished binaries.

## Update the SDK

From the SDK repository root, run `npm run pack:example`. Then run the following from `example/`. Use the new archive filename if the SDK version changes.

```sh
npm install ./burakbyrmss-react-native-kyc-0.1.0.tgz
```
