//Game World

var Room = require('./Room.js');
var Interactable = require('./Interactable.js');
const MapObjects = require('./MapObjects.js');
var Messaging = require('./Messaging.js');
const UserInput = require('./UserInput.js');
const Globals = require('./Globals.js');


//Utility names for the rooms as they're ordered in World.worldMap[].
const roomNumbers = {
    "entry": 0,
    "simonSays": 1,
    "treasure": 2
};


/* This file is gonna get messy, so there's some naming conventions to keep organized. */
/* Room: "r#_NNNN" where # is the room number and NNNN is a short name
 * Door: "r#_d%_NNNN" where # is the room number, % is the door number, and NNNN is a short description like "north"
 * Other object: Start with "r#_o%_NNNN" where # is the room number, % is the object number, and NNNN is a short description like "key"
 * 
 * Organize all objects with tabs to indicate what object or room contains them.
 */
var r0_entry = new Room();
r0_entry.shortDescription = "You're in the entryway.";
r0_entry.longDescription = "Its a big entryway.";

    var r0_d0 = new MapObjects.Door(["north", "northern"], ["door"], roomNumbers.simonSays);
    r0_d0.shortDescription = "There is an old wooden door on the northern wall.";
    r0_d0.longDescription = "The old wooden door loosely hangs from its hinges on the northern wall. It seems to be unlocked.";
    r0_d0.onUseDescription = "You push open the old wooden door and head to the north."
    r0_entry.addInteractable(r0_d0);

//TODO: make each room a subclass of Room, keep them in separate files
var r1_simonSays = new Room();
r1_simonSays.shortDescription = "You enter a room bathed in green light.  A gnome stands on the northern side of the room near a gilded door.  You begin to take a step toward the gnome, but as you do he raises his arm with his palm extended toward you and says \"Simon says STOP.\"  The light in the room changes to red.";
r1_simonSays.longDescription = "The gnome eyes you menacingly.  You wouldn't dare disobey him.  How are you going to get past him?";

    var r1_d0 = new MapObjects.Door(["north", "northern", "gilded"], ["door"], roomNumbers.entry);
    r1_d0.shortDescription = "There is a gleaming, gilded door on the northern wall.";
    r1_d0.longDescription = "The golden door shines and sparkles.  The gnome sees you looking at the door and growls at you.";
    r1_d0.onUseDescription = "You push open the door and head north."
    r1_simonSays.addInteractable(r1_d0);

    var r1_d1 = new MapObjects.Door(["south", "southern"], ["door"], roomNumbers.entry);
    r1_d1.shortDescription = "There is an old wooden door on the southern wall.";
    r1_d1.longDescription = "The old wooden door loosely hangs from its hinges on the southern wall.";
    r1_d1.onUseDescription = "You pull open the old wooden door and head to the south."
    r1_simonSays.addInteractable(r1_d1);

    const r1_f1_simon = () => {
        //Swap simon says state
        var min = 0;
        var max = 4;
        var rand = Math.floor(Math.random() * (max - min + 1) + min);
        if (rand == 0 || rand == 1) {
            r1_d1.setRoomContextValue("simonSays", "stop");
        }
        else if (rand == 2 || rand == 3) {
            r1_d1.setRoomContextValue("simonSays", "stepforward");
        }
        else {
            r1_d1.setRoomContextValue("simonSays", "stepback");
        }

        //check all players moved, punish for breaking the rules
        //reset didMove for all players


        min = 2;
        max = 10;
        rand = Math.floor(Math.random() * (max - min + 1) + min);
        setInterval(rq_f1_simon, rand*1000);
    };
    setInterval(r1_f1_simon, 5000);


var r2_treasure = new Room();
r2_treasure.shortDescription = "You enter a room with bright golden walls.  ";
r2_treasure.longDescription = "";

    var r0_d0 = new MapObjects.Door(["south", "southern"], ["door"], roomNumbers.simonSays);
    r0_d0.shortDescription = "There is an gilded door on the southern wall.";
    r0_d0.longDescription = "The southern door leads back to the room with Simon the gnome.  Why wouldn you go back there when all the treasure is in here?";
    r0_d0.onUseDescription = "You pull open the door and head back to the room with the gnome."
    r2_treasure.addInteractable(r0_d0);

    var r0_o0_treasure = new Interactable(["golden"], ["treasure", "gems", "coins"]);
    r0_o0_treasure.shortDescription = "Golden treasure piles high along the walls.";
    r0_o0_treasure.longDescription = "Golden coins, gems, and other treasure fill the room.  What a prize!";
    r0_o0_treasure.addAction(UserInput.VerbGroup.TAKE, (playerObj) => {
        var response = new Messaging.ConsoleOutput();
        response.setResponseText("You pocket handfuls of the treasure.  What a prize!");
        return response;
    });
    r2_treasure.addInteractable(r0_o0_treasure);

class World {
    constructor() {
        //Be sure to update const roomNumbers if you change anything here.
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
        return null;
    }
}

module.exports = World;