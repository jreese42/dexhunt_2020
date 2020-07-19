//Inventory
//Map
//Help
//Context
    //Current room
    //actionableNoun
//GameState
//sequelize binding

var Messaging = require('./Messaging.js');

const helpText = "This is the help text.";
const tempInventoryPlaceholderText = "Inventory: Pocket Lint";

class Player {
    constructor() {
        /* The player context is a "scratchpad" for any data storage.  Any Interactable or Room can access, modify, or delete this data.
         * This data is not stored in the database.  Objects may use this structure to share game state but must not rely on the data being avaiable. */
        this.playerContext = {};
        //TODO: Add Team context too
        this.currentRoom = null;
    }

    process_playerAction(playerAction) {
        //return an output string or "" if not processed
        var response = null;
        if (this.getCurrentRoom()) {
            this.currentRoom.scorePlayerAction(playerAction) //Sets objectId in playerAction
            if (playerAction.getCurrentParserScore() == 0) {
                //No world object was found that can process this input
                return null;
            }
            if (playerAction.getCurrentParserObjectId() != 0) {
                var interactableObject = this.currentRoom.findObjectById(playerAction.getCurrentParserObjectId());
                response = interactableObject.process_playerAction(playerAction, this);
            }
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

    setPlayerContextValue(key, value) {
        this.playerContext[key] = value;
    }
    
    getPlayerContextValue(key) {
        if (key in this.playerContext)
            return this.playerContext[key];
        return null;
    }

}

module.exports = Player;