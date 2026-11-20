const fs = require('node:fs');

fs.writeFileSync('expo-env.d.ts', '/// <reference types="expo/types" />\n');
