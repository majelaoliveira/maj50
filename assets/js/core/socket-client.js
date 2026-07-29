let socket;

function connectSocket(){

    socket = io();

    // ==========================================
    // Status de conexão — reaproveita o .status
    // que o ui.js/dashboard já esperam
    // ==========================================

    socket.on('connect', () => {
        atualizarStatus(true, 'Conectado ao servidor');
    });

    socket.on('disconnect', () => {
        atualizarStatus(false, 'Desconectado do servidor');
    });

    socket.on('connect_error', (err) => {
        atualizarStatus(false, 'Erro de conexão: ' + err.message);
    });

    // Emitido pelo server.js quando a placa Arduino conecta/desconecta
    // (evento novo, não existia no Genesis — adicionado pra status
    // refletir o estado real da placa, não só do socket)
    socket.on('board_status', ({ conectado, erro }) => {
        atualizarStatus(conectado, erro || (conectado ? 'Placa conectada' : 'Placa desconectada'));
    });

    // ==========================================
    // Terminal / Monitor Serial
    // ==========================================

    const btnLimpar = document.getElementById('btnLimparTerminal');
    if (btnLimpar){
        btnLimpar.addEventListener('click', limparMonitorSerial);
    }

}

function atualizarStatus(conectado, texto){

    const status = document.querySelector('.status');
    if (!status) return;

    status.textContent = conectado ? `🟢 ${texto}` : `🔴 ${texto}`;
    status.className = conectado ? 'status connected' : 'status disconnected';

    if (State && State.board){
        State.board.connected = conectado;
    }

}

// Chamada pelo bloco arduino_serial_println (gerador do GPT, categoria Serial)
function serialPrint(valor){

    const monitor = document.getElementById('monitorSerial');
    if (!monitor) return;

    const hora = new Date().toLocaleTimeString();
    const linha = document.createElement('div');
    linha.textContent = `[${hora}] ${valor}`;
    monitor.appendChild(linha);
    monitor.scrollTop = monitor.scrollHeight;

}

function limparMonitorSerial(){
    const monitor = document.getElementById('monitorSerial');
    if (monitor) monitor.innerHTML = '';
}

// Helpers pros blocos de leitura (arduino_digital_read / arduino_analog_read)
// mesma assinatura do Genesis — Promise que resolve no callback do socket
function lerDigital(pino){
    return new Promise((resolve) => {
        socket.emit('digitalRead', { pino }, (valor) => resolve(valor));
    });
}

function lerAnalogico(pino){
    return new Promise((resolve) => {
        socket.emit('analogRead', { pino }, (valor) => resolve(valor));
    });
}

// Helper pro bloco 'esperar' — mesma implementação do Genesis
function esperar(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
