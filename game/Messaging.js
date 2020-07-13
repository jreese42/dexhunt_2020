module.exports.ServerMessage = class ServerMessage {
    //console
        //Response text
        //Player input
        //Non-player events
        //Image/audio
        //Clear screen
    //playerList
        //currentPlayers
    constructor() {
        this.obj = {
            "console": {
                "playerInput": "",
                "resultOutput": "",
                "clearScreen": false,
            }
        }
    }

    setPlayerInput(playerInput) {
        this.obj.console.playerInput = playerInput;
    }

    appendConsoleOutput(consoleOutput) {
        if (!this.obj.console.clearScreen && consoleOutput.clearScreen)
            this.obj.console.clearScreen = true;

        if (consoleOutput.resultOutput) {
            if (this.obj.console.resultOutput)
                this.obj.console.resultOutput += "<br>"
            this.obj.console.resultOutput += consoleOutput.resultOutput;
        }
    }

    hasConsoleOutput() {
        return (this.obj.console.resultOutput != "")
    }

    toObject() {
        console.log(this.obj)
        return this.obj;
    }
}

//The output response to a player action
module.exports.ConsoleOutput =  class ConsoleOutput {
    constructor() {
        this.resultOutput = "";
        this.clearScreen = false;
    }

    setResponseText(text) {
        this.resultOutput = text;
    }
    
    setClearScreen(bool) {
        this.clearScreen = bool;
    }
}