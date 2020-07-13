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

class Player {
    constructor() {
        this.playerContext = {};
        this.currentRoom = null;
    }

    process_playerAction(playerAction) {
        //return an output string or "" if not processed
        var response = null;
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