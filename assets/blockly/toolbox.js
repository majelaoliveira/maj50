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
        }

        /* Categoria "Robô" com blocos customizados (Arduino/ESP)
           entra aqui assim que blocks.js/generator.js tiverem conteúdo */

    ]

};