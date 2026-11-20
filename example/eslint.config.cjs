const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  {ignores: ['.expo/**', 'expo-env.d.ts', 'dist/**', 'android/**', 'ios/**']},
  ...expoConfig,
];
