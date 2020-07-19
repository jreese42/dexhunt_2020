//Inventory
//Map
//Help
//Context
    //Current room
    //actionableNoun
//GameState
//sequelize binding
// var Room = require('Room');

var Messaging = require('./Messaging.js');

const helpText = "This is the help text.";
const tempInventoryPlaceholderText = "Inventory: Pocket Lint";

class Player {
    constructor() {
        /* The player context is a "scratchpad" for any data storage.  Any Interactable or Room can access, modify, or delete this data.
         * This data is not stored in the database.  Objects may use this structure to share game state but must not rely on the data being avaiable. */
        this.playerContext = {};
        this.currentRoom = null;
    }

    process_playerAction(playerAction) {
        //return an output string or "" if not processed
        var response = null;
        if (playerAction.verb == 'help' && playerAction.directObject == "") {
            response = new Messaging.ConsoleOutput();
            response.setResponseText(helpText);
            return response;
        }
        if ((playerAction.verb == 'look' || playerAction.verb == "use" || playerAction.verb == "") && playerAction.directObject == "inventory") {
            response = new Messaging.ConsoleOutput();
            response.setResponseText(tempInventoryPlaceholderText);
            return response;
        }
        if (this.getCurrentRoom()) {
            response = this.currentRoom.process_playerAction(playerAction, this);
        }
        if (!response) {
            //nothing responded
            return null;
        }
        if (!response instanceof Messaging.ConsoleOutput) {
            //unexpected response type
            console.log("Unexpected response type to PlayerAction");
            return null;
        }
        return response;
    }

    setCurrentRoom(roomObj) {
        this.currentRoom = roomObj;
    }

    getCurrentRoom() {
        return this.currentRoom;
    }

}

module.exports = Player;