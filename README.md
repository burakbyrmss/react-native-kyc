# React Native KYC

React Native New Architecture SDK for the Turkish electronic national identity card. The first integration slice exposes a front-facing camera capability check through Kotlin on Android and Swift on iOS. The check does not open the camera or request permission.

## Validate TD1 text

`parseTd1Mrz(text)` accepts one three-line MRZ, with LF or CRLF line breaks and an optional final newline. A valid result contains parsed fields. An invalid result contains issue codes without the original text. Dates retain their printed `YYMMDD` values and birth-date fillers.

```ts
import {parseTd1Mrz} from '@burakbyrmss/react-native-kyc';

const result = parseTd1Mrz(mrzText);
```

Validation covers TD1 field syntax and check digits. OCR, Turkish card-specific field mapping, and document authenticity require separate checks. Run the parser tests with `npm test` on Node 22.18 or later.

## Verify with Expo

The `example` app uses Expo SDK 58 and a development build. It installs the SDK tarball and calls the public API when you tap **Check front camera**.

From the repository root, run:

```sh
npm run pack:example
cd example
npm install --package-lock-only ./burakbyrmss-react-native-kyc-0.1.0.tgz
npm ci
```

For Android with local tooling, run `npm run android` in `example`. For a cloud build, run the following from `example`:

```sh
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest device:create
npx eas-cli@latest build --platform ios --profile development
```

Register your iPhone with the device command before building for iOS. For a cloud Android build, use `--platform android` and skip device registration. If your Apple team already owns a different identifier for this app, update `ios.bundleIdentifier` in `example/app.json` before building.

Install the build on your phone and run `npm start -- --tunnel` from `example`, or run `npm start` when the phone can reach Metro over the local network. Tap **Check front camera**. Expect `true` on a phone with a front camera and no permission prompt.

After changing files included in the SDK tarball, run `npm run pack:example` again from the repository root. Refresh the local tarball dependency and lockfile from `example` with `npm install ./burakbyrmss-react-native-kyc-0.1.0.tgz`. Rebuild the development client after native changes.

See the [Expo example guide](example/README.md) for the CI checks and EAS credentials.

## Verify with React Native Community CLI

1. Run `npm ci`, `npm run typecheck`, and `npm run codegen` in this repository.
2. Run `npm pack`. Install the resulting tarball in an app created from the React Native 0.88 Community CLI template.
3. On iOS, run `bundle exec pod install` from the app's `ios` directory.
4. Rebuild the app and invoke the exported function.

```ts
import {isFrontCameraAvailable} from '@burakbyrmss/react-native-kyc';

const hasFrontCamera = await isFrontCameraAvailable();
```

Compare the result with the device's hardware. Run the check on both Android and iOS.

See the [roadmap](https://github.com/burakbyrmss/react-native-kyc/blob/master/docs/planning/roadmap.md) for the planned OCR, MRZ, face, and conditional NFC work.
