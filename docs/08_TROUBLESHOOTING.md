MFR-KB-001 — npm 12 bloqueia scripts nativos

Sintoma

Could not locate the bindings file

ou

It looks like serialport didn't install properly

Causa

O npm 12 bloqueia scripts node-gyp rebuild por padrão (allowScripts).

Diagnóstico

npm install-scripts ls

Correção

Aprovar os pacotes:

npm install-scripts approve @serialport/bindings
npm install-scripts approve @serialport/bindings-cpp

Depois:

npm rebuild

Isso evita que vocês percam tempo novamente caso clonem o projeto em outra máquina.

Outra boa notícia

Agora temos um ambiente de desenvolvimento completo.

Blockly
      │
Component Loader
      │
Express
      │
Socket.IO
      │
Johnny-Five
      │
Firmata
      │
Arduino Nano