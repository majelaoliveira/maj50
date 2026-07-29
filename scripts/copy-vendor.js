const fs = require('fs');
const path = require('path');

const origemJs = path.join(__dirname, '..', 'node_modules', 'blockly', 'blockly.min.js');
const origemMedia = path.join(__dirname, '..', 'node_modules', 'blockly', 'media');

const destinoDir = path.join(__dirname, '..', 'assets', 'vendor');
const destinoJs = path.join(destinoDir, 'blockly.min.js');
const destinoMedia = path.join(destinoDir, 'media');

fs.mkdirSync(destinoDir, { recursive: true });

fs.copyFileSync(origemJs, destinoJs);
fs.cpSync(origemMedia, destinoMedia, { recursive: true });

console.log('[postinstall] assets/vendor/ recriado a partir de node_modules/blockly');