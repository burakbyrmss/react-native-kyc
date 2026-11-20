import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  isFrontCameraAvailable(): Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('NativeKycFace');
