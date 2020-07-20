const Interactable = require("./Interactable");
const UserInput = require("./UserInput.js");
const Messaging = require("./Messaging.js");
const Globals = require("./Globals.js");

module.exports.Door = class Door extends Interactable {
    constructor(adjectivesList, nounsList, destRoomId) {
        super(adjectivesList, nounsList);
        this.shortDescription = "Door Description";
        this.longDescription = "Long Door Description";
        this._destRoomId = destRoomId;
        this._useDoorDescription = "";

        this.addAction(UserInput.VerbGroup.GO, this.onUseDoor.bind(this));
    }

    get onUseDescription() {
        return this._useDoorDescription;
    }

    set onUseDescription(description) {
        this._useDoorDescription = description;
    }

    onUseDoor(playerObj) {
        var response = new Messaging.ConsoleOutput();
        var newRoom = Globals.getWorld().getRoomByRoomNumber(this._destRoomId);
        if (!newRoom) {
            response.setResponseText("You open the door, but there's just a wall behind it.  That doesn't seem right...");
            return response;
        }

        playerObj.getCurrentRoom().leaveRoom(playerObj);
        newRoom.enterRoom(playerObj);
        playerObj.setCurrentRoom(newRoom);

        response.setClearScreen(true);
        response.setResponseText(this._useDoorDescription + " " + playerObj.getCurrentRoom().shortDescription);
        return response;
    }
}