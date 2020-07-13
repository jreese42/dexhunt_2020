//Game World

var Room = require('./Room.js');
var Interactable = require('./Interactable.js');
var Messaging = require('./Messaging.js');

var room1 = new Room();
room1.setShortDescription("An old room.");
room1.setLongDescription("The room is old and dusty.");
room1_door1 = new Interactable("door");
room1_door1.setShortDescription("An old wooden door.");
room1_door1.setLongDescription("An old wooden door loosely hangs from it's hinges on the east wall. It seems to be unlocked.");
room1_door1.addAction(["use"], function(player) {
    player.setCurrentRoom(room2);
    
    var response = new Messaging.ConsoleOutput();
    response.setClearScreen(true);
    response.setResponseText("You go through the door. " + player.getCurrentRoom().getShortDescription());
    return response;
});
room1.addInteractable(room1_door1);

var room2 = new Room();
room2.setShortDescription("A new room.");
room2.setLongDescription("The room shines as if recently cleaned.");

class World {
    constructor() {
        this.worldMap = [room1, room2];
    }

    getRoom(index) {
        return this.worldMap[index];
    }

    movePlayerToRoom(player) {
        return
    }
}

module.exports = World;