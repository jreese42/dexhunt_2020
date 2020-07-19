//Interactables
//Doors
//Game Logic

var Messaging = require('./Messaging.js');
const Interactable = require('./Interactable.js');
const UserInput = require('./UserInput.js');

class Room extends Interactable {
    constructor() {
        super([], ["room"]); 
        this.roomContext = {};

        //Room defines some of the most common actions in case the user isn't specific enough
        this.addAction(UserInput.VerbGroup.LOOK, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.longDescriptionWithObjects);
            return response;
        });

        this.addAction(UserInput.VerbGroup.GO, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("I'm not sure where you're trying to go.");
            return response;
        });

        this.addAction(UserInput.VerbGroup.TAKE, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("I'm not sure what you're trying to take.");
            return response;
        });
        
        this.addAction(UserInput.VerbGroup.USE, (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText("I'm not sure what you're trying to use.");
            return response;
        });
    }
            
    setRoomContextValue(key, value) {
        this.roomContext[key] = value;
    }
    
    getRoomContextValue(key) {
        if (key in this.roomContext)
            return this.roomContext[key];
        return null;
    }
}

module.exports = Room;