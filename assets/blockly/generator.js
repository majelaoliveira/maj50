/*
 * Geradores de código — migrados da versão Genesis para Blockly v13.
 * Mudanças de API (únicas autorizadas pelo MFR-013/014):
 *   Blockly.JavaScript.forBlock       -> javascript.javascriptGenerator.forBlock
 *   Blockly.JavaScript.ORDER_ATOMIC   -> javascript.Order.ATOMIC
 *   Blockly.JavaScript.valueToCode    -> javascript.javascriptGenerator.valueToCode
 * Protocolo Socket.IO, nomes de evento e payloads: idênticos ao Genesis.
 */

javascript.javascriptGenerator.forBlock['ligar_led'] = function (block, generator) {
    return "socket.emit('ligar_led');\n";
};

javascript.javascriptGenerator.forBlock['desligar_led'] = function (block, generator) {
    return "socket.emit('desligar_led');\n";
};

javascript.javascriptGenerator.forBlock['esperar'] = function (block, generator) {
    const tempo = block.getFieldValue('TEMPO');
    const unidade = block.getFieldValue('UNIDADE');
    const ms = unidade === 'SEGUNDOS' ? tempo * 1000 : tempo;
    return `await esperar(${ms});\n`;
};

javascript.javascriptGenerator.forBlock['arduino_pin_mode'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const mode = block.getFieldValue('MODE');
    return `socket.emit('pinMode', { pino: ${pin}, modo: '${mode}' });\n`;
};

javascript.javascriptGenerator.forBlock['arduino_digital_write'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const state = block.getFieldValue('STATE');
    return `socket.emit('digitalWrite', { pino: ${pin}, valor: '${state}' });\n`;
};

javascript.javascriptGenerator.forBlock['arduino_analog_write'] = function (block) {
    const pin = block.getFieldValue('PIN');
    const value = block.getFieldValue('VALUE');
    return `socket.emit('analogWrite', { pino: ${pin}, valor: ${value} });\n`;
};

javascript.javascriptGenerator.forBlock['arduino_digital_read'] = function (block) {
    const pin = block.getFieldValue('PIN');
    return [`(await lerDigital(${pin}))`, javascript.Order.ATOMIC];
};

javascript.javascriptGenerator.forBlock['arduino_analog_read'] = function (block) {
    const pin = block.getFieldValue('PIN');
    return [`(await lerAnalogico(${pin}))`, javascript.Order.ATOMIC];
};

javascript.javascriptGenerator.forBlock['arduino_serial_println'] = function (block) {
    const valor = javascript.javascriptGenerator.valueToCode(block, 'VALUE', javascript.Order.ATOMIC) || "''";
    return `serialPrint(${valor});\n`;
};
