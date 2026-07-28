let workspace;

function initializeBlockly(){

    workspace = Blockly.inject("blocklyDiv", {
        toolbox: Toolbox,
        grid: {
            spacing: 20,
            length: 3,
            colour: "#333333",
            snap: true
        },
        trashcan: true
    });

}
