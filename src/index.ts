import NativeKycFace from './specs/NativeKycFace';

export {parseTd1Mrz} from './document/mrz/td1';
export type {Td1MrzFields, Td1MrzIssue, Td1MrzResult} from './document/mrz/td1';

/** Reports whether the device has a front-facing camera. */
export async function isFrontCameraAvailable(): Promise<boolean> {
  if (!NativeKycFace) {
    throw new Error('The React Native KYC native module is missing. Rebuild the app with the SDK installed.');
  }

  return NativeKycFace.isFrontCameraAvailable();
}
