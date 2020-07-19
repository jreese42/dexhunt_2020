//Interactables
//Doors
//Game Logic

var Messaging = require('./Messaging.js');
const Interactable = require('./Interactable.js');

class Room extends Interactable {
    constructor() {
        super([], ["room"]); 
        this.addAction(["look", "examine"], (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.longDescriptionWithObjects);
            return response;
        });
    }
}

module.exports = Room;