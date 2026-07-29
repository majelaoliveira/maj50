const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { Board, Led } = require('johnny-five');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 8000;

// Serve a estrutura componentizada (index.html, assets/) a partir da raiz do projeto
app.use(express.static(path.join(__dirname)));

console.log('====================================================');
console.log('            🤖 MajFifty Robot IDE 🤖                 ');
console.log('     Edição Comemorativa - Desenvolvido por Majela    ');
console.log('====================================================');

const board = new Board({
  port: '/dev/ttyUSB0', // ajuste para a porta do seu Arduino (ex: 'COM3' no Windows)
  repl: false
});

board.on('ready', () => {
  console.log('[MajFifty Robot] Arduino conectado com sucesso via Johnny-Five!');

  const led = new Led(13);

  const MODOS = {
    OUTPUT: board.io.MODES.OUTPUT,
    INPUT: board.io.MODES.INPUT,
    INPUT_PULLUP: board.io.MODES.PULLUP !== undefined ? board.io.MODES.PULLUP : board.io.MODES.INPUT,
    PWM: board.io.MODES.PWM,
    ANALOG: board.io.MODES.ANALOG
  };

  io.on('connection', (socket) => {
    console.log('[MajFifty Robot] Novo cliente conectado');

    // Notifica o cliente recém-conectado que a placa já está pronta
    // (útil pro dashboard/status mostrar "conectado" mesmo se o
    // navegador abrir depois do evento 'ready' já ter disparado)
    socket.emit('board_status', { conectado: true });

    // ==========================================
    // Comandos legados (mantidos por compatibilidade)
    // ==========================================
    socket.on('ligar_led', () => {
      led.on();
      console.log('LED ligado');
    });

    socket.on('desligar_led', () => {
      led.off();
      console.log('LED desligado');
    });

    // ==========================================
    // Comandos genéricos Firmata (blocos de pino aberto)
    // ==========================================

    socket.on('pinMode', ({ pino, modo }) => {
      const modoFirmata = MODOS[modo] !== undefined ? MODOS[modo] : MODOS.OUTPUT;
      board.io.pinMode(pino, modoFirmata);
      console.log(`pinMode(${pino}, ${modo})`);
    });

    socket.on('digitalWrite', ({ pino, valor }) => {
      const nivel = (valor === 'HIGH' || valor === 1 || valor === true) ? 1 : 0;
      board.io.digitalWrite(pino, nivel);
      console.log(`digitalWrite(${pino}, ${valor})`);
    });

    socket.on('analogWrite', ({ pino, valor }) => {
      board.io.pinMode(pino, MODOS.PWM);
      const v = Math.max(0, Math.min(255, Number(valor)));
      board.io.analogWrite(pino, v);
      console.log(`analogWrite(${pino}, ${v})`);
    });

    socket.on('digitalRead', ({ pino }, callback) => {
      board.io.pinMode(pino, MODOS.INPUT);
      const evento = `digital-read-${pino}`;

      board.io.once(evento, (valor) => {
        callback(valor);
        board.io.reportDigitalPin(pino, 0);
      });

      board.io.digitalRead(pino, () => {});
    });

    socket.on('analogRead', ({ pino }, callback) => {
      const evento = `analog-read-${pino}`;

      board.io.once(evento, (valor) => {
        callback(valor);
        board.io.reportAnalogPin(pino, 0);
      });

      board.io.analogRead(pino, () => {});
    });

    socket.on('disconnect', () => {
      console.log('[MajFifty Robot] Cliente desconectado');
    });
  });
});

board.on('error', (err) => {
  console.error('[MajFifty Robot] Erro na conexão com a placa:', err.message);
  io.emit('board_status', { conectado: false, erro: err.message });
});

server.listen(PORT, () => {
  console.log(`Servidor MajFifty Robot rodando em http://localhost:${PORT}`);
});