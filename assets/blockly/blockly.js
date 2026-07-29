let workspace;

const baseTheme = (Blockly.Themes && Blockly.Themes.Classic) ? Blockly.Themes.Classic : undefined;

const TemaMajFifty = Blockly.Theme.defineTheme('majfifty', {
    base: baseTheme,
    componentStyles: {
        toolboxForegroundColour: '#1E1E1E'
    }
});

function initializeBlockly(){

    workspace = Blockly.inject("blocklyDiv", {
        toolbox: Toolbox,
        theme: TemaMajFifty,
        trashcan: true
    });

}