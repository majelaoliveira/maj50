/*
 * Blocos customizados — migrados da versão Genesis para Blockly v13.
 * MFR-013/014 — migração técnica, zero alteração de comportamento/aparência.
 */

Blockly.Blocks['ligar_led'] = {
    init: function () {
        this.appendDummyInput().appendField('Ligar LED');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#E67E22');
        this.setTooltip('Envia o comando para ligar o LED no Arduino');
    }
};

Blockly.Blocks['desligar_led'] = {
    init: function () {
        this.appendDummyInput().appendField('Desligar LED');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#E67E22');
        this.setTooltip('Envia o comando para desligar o LED no Arduino');
    }
};

Blockly.Blocks['esperar'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Esperar')
            .appendField(new Blockly.FieldNumber(1, 0), 'TEMPO')
            .appendField(new Blockly.FieldDropdown([
                ['segundos', 'SEGUNDOS'],
                ['milissegundos', 'MS']
            ]), 'UNIDADE');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#16A085');
        this.setTooltip('Pausa a execução dos blocos');
    }
};

Blockly.Blocks['arduino_pin_mode'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('pinMode( pino')
            .appendField(new Blockly.FieldNumber(13, 0, 19), 'PIN')
            .appendField(',')
            .appendField(new Blockly.FieldDropdown([
                ['OUTPUT', 'OUTPUT'],
                ['INPUT', 'INPUT'],
                ['INPUT_PULLUP', 'INPUT_PULLUP']
            ]), 'MODE')
            .appendField(')');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#2E86C1');
    }
};

Blockly.Blocks['arduino_digital_write'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('digitalWrite( pino')
            .appendField(new Blockly.FieldNumber(13, 0, 19), 'PIN')
            .appendField(',')
            .appendField(new Blockly.FieldDropdown([
                ['HIGH', 'HIGH'],
                ['LOW', 'LOW']
            ]), 'STATE')
            .appendField(')');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#2E86C1');
    }
};

Blockly.Blocks['arduino_analog_write'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('analogWrite( pino')
            .appendField(new Blockly.FieldNumber(9, 0, 13), 'PIN')
            .appendField(', valor')
            .appendField(new Blockly.FieldNumber(0, 0, 255), 'VALUE')
            .appendField(')');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#2E86C1');
    }
};

Blockly.Blocks['arduino_digital_read'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('digitalRead( pino')
            .appendField(new Blockly.FieldNumber(2, 0, 19), 'PIN')
            .appendField(')');
        this.setOutput(true, 'Boolean');
        this.setColour('#2E86C1');
    }
};

Blockly.Blocks['arduino_analog_read'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('analogRead( pino A')
            .appendField(new Blockly.FieldNumber(0, 0, 7), 'PIN')
            .appendField(')');
        this.setOutput(true, 'Number');
        this.setColour('#2E86C1');
    }
};

Blockly.Blocks['arduino_serial_println'] = {
    init: function () {
        this.appendValueInput('VALUE')
            .appendField('Serial.println(');
        this.appendDummyInput().appendField(')');
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#8E44AD');
    }
};
