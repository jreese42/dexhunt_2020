//Game World

var Room = require('./Room.js');
var Interactable = require('./Interactable.js');
var Messaging = require('./Messaging.js');
const UserInput = require('./UserInput.js');

var room1 = new Room();
room1.setShortDescription("You're in an old room. The walls are damp and a thin layer of dust covers the floor.");
room1.setLongDescription("The room is old and dusty.");
room1_door1 = new Interactable(["west"], ["door"]);
room1_door1.setShortDescription("There is an old wooden door on the western wall.");
room1_door1.setLongDescription("An old wooden door loosely hangs from it's hinges on the western wall. It seems to be unlocked.");
room1_door1.addAction(UserInput.VerbGroup.GO, function(player) {
    player.setCurrentRoom(room2);
    
    var response = new Messaging.ConsoleOutput();
    response.setClearScreen(true);
    response.setResponseText("You push open the old wooden door and head to the west. " + player.getCurrentRoom().shortDescription);
    return response;
});
room1.addInteractable(room1_door1);

var room2 = new Room();
room2.setShortDescription("You enter a surprisingly clean room.");
room2.setLongDescription("The room shines as if recently cleaned.");
room2_door1 = new Interactable(["east"], ["door"]);
room2_door1.setShortDescription("There is an old wooden door on the eastern wall.");
room2_door1.setLongDescription("An old wooden door loosely hangs from it's hinges on the eastern wall. It seems to be unlocked.");
room2_door1.addAction(UserInput.VerbGroup.GO, function(player) {
    player.setCurrentRoom(room1);
    
    var response = new Messaging.ConsoleOutput();
    response.setClearScreen(true);
    response.setResponseText("You push open the old wooden door and head to the east. " + player.getCurrentRoom().shortDescription);
    return response;
});
room2.addInteractable(room2_door1);

room2_walls = new Interactable([], ["wall", "walls"]);
room2_walls.setShortDescription("The walls are made of a dark gray material that looks like stone.");
room2_walls.setLongDescription("You take a step closer and inspect the walls.  Upon closer inspection the texture perfectly smooth like plastic and aren't cool to the touch like you would expect of a stone wall.");
room2.addInteractable(room2_walls);

room2_table = new Interactable(["stone"], ["table"]);
room2_table.setShortDescription("There is a stone table in the center of the room.  Something is on the table.");
room2_table.setLongDescription("A brass key rests on the table.");
room2_table.addAction(UserInput.VerbGroup.LOOK, (playerObj) => {
    var response = new Messaging.ConsoleOutput();
    response.setResponseText(room2_table.longDescription);
    if (!playerObj.playerContext.room2) playerObj.playerContext.room2 = {};
    playerObj.playerContext.room2.hasSeenKey = true;
    return response;
});
room2.addInteractable(room2_table);

room2_key = new Interactable(["old","brass"],["key"]);
room2_key.setShortDescription("");
room2_key.setLongDescription("An old brass key rests on the table.");
room2_key.addAction(UserInput.VerbGroup.LOOK, (playerObj) => {
    var response = new Messaging.ConsoleOutput();
    if (!playerObj.playerContext.room2) playerObj.playerContext.room2 = {};
    if (playerObj.playerContext.room2.hasSeenKey) {
        response.setResponseText(room2_key.longDescription);
    }
    else {
        return null;
    }
    return response;
});
room2_key.addAction(UserInput.VerbGroup.TAKE, (playerObj) => {
    var response = new Messaging.ConsoleOutput();
    if (!playerObj.playerContext.room2) playerObj.playerContext.room2 = {};
    if (playerObj.playerContext.room2.hasSeenKey) {
        playerObj.playerContext.room2.hasTakenKey = true;
        response.setResponseText("You take the key.");
    }
    else {
        return null;
    }
    return response;
});
room2.addInteractable(room2_key);


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

    getObjectById(objectId) {
        for (var i = 0; i < this.worldMap.length; i++) {
            var interactable = this.worldMap[i];
            var obj = interactable.findObjectById(objectId);
            if (obj)
                return obj;
        }
    }
}

module.exports = World;