//Inventory
//Map
//Help
//Context
    //Current room
    //actionableNoun
//GameState
//sequelize binding
// var Room = require('Room');

const { response } = require("express");

class Player {
    constructor() {
        this.playerContext = {};
        this.currentRoom = null;
    }

    process_playerAction(playerAction) {
        //return an output string or "" if not processed
        var response = ""
        if (this.getCurrentRoom()) {
            response = this.currentRoom.process_playerAction(playerAction);
            if (response)
                return response;
        }
        response = "PlayerAction: verb=" + playerAction.verb + " obj1=" + playerAction.directObject + " obj2=" + playerAction.indirectObject;
        return response;
    }

    getCurrentRoom() {
        return this.currentRoom;
    }

}

module.exports = Player;