//Interactables
//Doors
//Game Logic

var Messaging = require('./Messaging.js');
const Interactable = require('./Interactable.js');
const UserInput = require('./UserInput.js');

class Room extends Interactable {
    constructor() {
        super([], ["room"]); 
        this._roomContext = {};
        this._currentPlayers = [];

        //Room defines some of the most common actions in case the user isn't specific enough
        this.addAction(UserInput.VerbGroup.LOOK, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.longDescriptionWithObjects);
            return response;
        });

        this.addAction(UserInput.VerbGroup.GO, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("I'm not sure where you're trying to go.");
            return response;
        });

        this.addAction(UserInput.VerbGroup.TAKE, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("I'm not sure what you're trying to take.");
            return response;
        });
        
        this.addAction(UserInput.VerbGroup.USE, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("I'm not sure what you're trying to use.");
            return response;
        });
    }
            
    setRoomContextValue(key, value) {
        this._roomContext[key] = value;
    }
    
    getRoomContextValue(key) {
        if (key in this._roomContext)
            return this._roomContext[key];
        return null;
    }

    enterRoom(playerObj) {
        if (!this._currentPlayers.includes(playerObj)) {
            this._currentPlayers.push(playerObj);
            console.log("player entered room")
        }
    }
    
    leaveRoom(playerObj) {
        if (this._currentPlayers.includes(playerObj)) {
            this._currentPlayers.splice(this._currentPlayers.indexOf(playerObj), 1);
            console.log("player left room")
        }
        //TODO call an injectable function which can be used to clear variables
    }

    sendLineToRoomPlayers(consoleLine) {
        this._currentPlayers.forEach(player => {
            player.sendConsoleLine(consoleLine);
        });
    }

    forEachPlayerInRoom(func) {
        this._currentPlayers.forEach(func);
    }
}

module.exports = Room;