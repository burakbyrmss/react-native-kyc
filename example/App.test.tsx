import {expect, jest, test} from '@jest/globals';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {isFrontCameraAvailable} from '@burakbyrmss/react-native-kyc';

import App from './App';

jest.mock('@burakbyrmss/react-native-kyc', () => ({
  isFrontCameraAvailable: jest.fn(),
}));

const cameraCheck = jest.mocked(isFrontCameraAvailable);

test.each([true, false])(
  'displays a camera availability result of %s',
  async (available) => {
    cameraCheck.mockResolvedValueOnce(available);
    await render(<App />);

    await fireEvent.press(
      screen.getByRole('button', {name: 'Check front camera'}),
    );

    expect(
      await screen.findByText(`Front camera available: ${available}`),
    ).toBeTruthy();
  },
);

test('displays a native error', async () => {
  cameraCheck.mockRejectedValueOnce(new Error('Module unavailable'));
  await render(<App />);

  await fireEvent.press(
    screen.getByRole('button', {name: 'Check front camera'}),
  );

  expect(
    await screen.findByText('Native call failed: Module unavailable'),
  ).toBeTruthy();
});
