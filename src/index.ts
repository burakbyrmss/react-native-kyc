import NativeKycFace from './specs/NativeKycFace';

/** Reports whether the device has a front-facing camera. */
export async function isFrontCameraAvailable(): Promise<boolean> {
  if (!NativeKycFace) {
    throw new Error('The React Native KYC native module is missing. Rebuild the app with the SDK installed.');
  }

  return NativeKycFace.isFrontCameraAvailable();
}
