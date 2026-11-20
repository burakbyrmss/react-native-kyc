import {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {isFrontCameraAvailable} from '@burakbyrmss/react-native-kyc';

type CheckResult =
  | {kind: 'idle'}
  | {kind: 'running'}
  | {kind: 'complete'; available: boolean}
  | {kind: 'error'; message: string};

export default function App() {
  const [result, setResult] = useState<CheckResult>({kind: 'idle'});

  async function checkCamera() {
    setResult({kind: 'running'});
    try {
      const available = await isFrontCameraAvailable();
      setResult({kind: 'complete', available});
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The native call failed.';
      setResult({kind: 'error', message});
    }
  }

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.heading}>
        KYC SDK smoke test
      </Text>
      <Button
        title="Check front camera"
        onPress={checkCamera}
        disabled={result.kind === 'running'}
      />
      <View accessibilityLiveRegion="polite">
        {result.kind === 'running' && <Text>Checking the camera…</Text>}
        {result.kind === 'complete' && (
          <Text>Front camera available: {String(result.available)}</Text>
        )}
        {result.kind === 'error' && (
          <Text>Native call failed: {result.message}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
  },
});
