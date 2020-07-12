//Game World

var Room = require('./Room.js');
var Interactable = require('./Interactable.js');

var room1 = new Room();
var room2 = new Room();

door1 = new Interactable("door");
door1.addVerb("use", function(player) {
    return "Use Door 1";
});

// room1.addInteractable(door1)

class World {
    constructor() {
        this.worldMap = [room1, room2];
    }

    getRoom(index) {
        return this.worldMap[index];
    }
}

module.exports = World;