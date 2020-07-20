//Game World

const Room = require('./Room.js');
const Interactable = require('./Interactable.js');
const MapObjects = require('./MapObjects.js');
const Messaging = require('./Messaging.js');
const UserInput = require('./UserInput.js');
const Globals = require('./Globals.js');


/* This file is gonna get messy, so there's some naming conventions to keep organized. */
/* Room: "r#_NNNN" where # is the room number and NNNN is a short name
 * Door: "r#_d%_NNNN" where # is the room number, % is the door number, and NNNN is a short description like "north"
 * Other object: Start with "r#_o%_NNNN" where # is the room number, % is the object number, and NNNN is a short description like "key"
 * 
 * Organize all objects with tabs to indicate what object or room contains them.
 */
var r0_entry = new Room();
r0_entry.shortDescription = "You're in a small, dark entryway.  You aren't sure how you got here.  The only light comes from four small candles attached to sconces on the walls.  There is a door to the north."; //TODO: This is weird. We should only describe this door once on entry.
r0_entry.longDescription = "Its a big, empty entryway.  You should explore a bit.";

    var r0_d0 = new MapObjects.Door(["north", "northern"], ["door"], Globals.roomNumbers.simonSays);
    r0_d0.shortDescription = "There is an old wooden door on the northern wall.";
    r0_d0.longDescription = "The old wooden door loosely hangs from its hinges on the northern wall. It seems to be unlocked.";
    r0_d0.onUseDescription = "You push open the old wooden door and head to the north."
    r0_entry.addInteractable(r0_d0);


var r1_simonSays = require("./rooms/SimonSays.room.js");


var r2_treasure = new Room();
r2_treasure.shortDescription = "You enter a room with bright golden walls. Shining piles of treasure lay before you.  Congratulations!";
r2_treasure.longDescription = "";

    var r2_d0 = new MapObjects.Door(["south", "southern"], ["door"], Globals.roomNumbers.simonSays);
    r2_d0.shortDescription = "There is an gilded door on the southern wall.";
    r2_d0.longDescription = "The southern door leads back to the room with Simon the gnome.  Why wouldn you go back there when all the treasure is in here?";
    r2_d0.onUseDescription = "You pull open the door and head back to the room with the gnome."
    r2_treasure.addInteractable(r2_d0);

    var r2_o0_treasure = new Interactable(["golden"], ["treasure", "gems", "coins"]);
    r2_o0_treasure.shortDescription = "Golden treasure piles high along the walls.";
    r2_o0_treasure.longDescription = "Golden coins, gems, and other treasures fill the room.  What a prize!";
    r2_o0_treasure.addAction(UserInput.VerbGroup.TAKE, (playerObj) => {
        var response = new Messaging.ConsoleOutput();
        response.setResponseText("You pocket handfuls of the treasure.  What a prize!");
        return response;
    });
    r2_treasure.addInteractable(r2_o0_treasure);

class World {
    constructor() {
        //Be sure to update Globals.roomNumbers if you change anything here.
        this.worldMap = [r0_entry, r1_simonSays, r2_treasure];
    }

    getObjectById(objectId) {
        for (var i = 0; i < this.worldMap.length; i++) {
            var interactable = this.worldMap[i];
            var obj = interactable.findObjectById(objectId);
            if (obj)
                return obj;
        }
    }

    getRoomByRoomNumber(roomIndex) {
        if (roomIndex >= 0 && roomIndex < this.worldMap.length) {
            return this.worldMap[roomIndex];
        }
        console.log("Room " + roomIndex + " doesnt exist")
        return null;
    }
}

module.exports = World;