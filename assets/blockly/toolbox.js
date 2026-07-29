const Toolbox = {

    "kind": "categoryToolbox",

    "contents": [

        {
            "kind": "category",
            "name": "Lógica",
            "colour": "210",
            "contents": [
                { "kind": "block", "type": "controls_if" },
                { "kind": "block", "type": "logic_compare" },
                { "kind": "block", "type": "logic_operation" },
                { "kind": "block", "type": "logic_boolean" }
            ]
        },
        {
            "kind": "category",
            "name": "Repetição",
            "colour": "120",
            "contents": [
                { "kind": "block", "type": "controls_repeat_ext" },
                { "kind": "block", "type": "controls_whileUntil" }
            ]
        },
        {
            "kind": "category",
            "name": "Matemática",
            "colour": "230",
            "contents": [
                { "kind": "block", "type": "math_number" },
                { "kind": "block", "type": "math_arithmetic" }
            ]
        },
        {
            "kind": "category",
            "name": "Texto",
            "colour": "160",
            "contents": [
                { "kind": "block", "type": "text" }
            ]
        },
        {
            "kind": "category",
            "name": "Variáveis",
            "colour": "330",
            "custom": "VARIABLE"
        },

        {
            "kind": "category",
            "name": "Arduino",
            "colour": "#E67E22",
            "contents": [
                { "kind": "block", "type": "ligar_led" },
                { "kind": "block", "type": "desligar_led" },
                { "kind": "block", "type": "esperar" }
            ]
        },
        {
            "kind": "category",
            "name": "Pinos (Firmata)",
            "colour": "#2E86C1",
            "contents": [
                { "kind": "block", "type": "arduino_pin_mode" },
                { "kind": "block", "type": "arduino_digital_write" },
                { "kind": "block", "type": "arduino_analog_write" },
                { "kind": "block", "type": "arduino_digital_read" },
                { "kind": "block", "type": "arduino_analog_read" },
                { "kind": "block", "type": "arduino_serial_println" }
            ]
        }

    ]

};