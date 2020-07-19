//Interactables
//Doors
//Game Logic

var Messaging = require('./Messaging.js');

class Room {
    constructor() {
        this.interactables = [];
        this.shortDescription = "Room Description.";
        this.longDescription = "Long Room Description."
        this.verbs = {};

        this.addAction(["look", "examine"], (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.getLongDescriptionWithObjects());
            return response;
        });
    }

    addInteractable(interactable) {
        this.interactables.push(interactable);
    }

    process_playerAction(playerAction, playerObj) {
        //check for noun in list of interactables and run verb there if possible
        //TODO handle multiple object with same name but a specifier like "east door"/"west door"
        for (var i = 0; i < this.interactables.length; i++) {
            var interactable = this.interactables[i];
            if (interactable.testNoun(playerAction.directObject)) { //TODO: Handle indirect object and qualifiers "stone table, western door"
                var result = interactable.executeVerb(playerAction.verb, playerObj);
                if (result)
                    return result;
            }
        }

        //Attempt to run as room verb if no noun was found
        if (this.verbs.hasOwnProperty(playerAction.verb)) {
            var result = this.executeVerb(playerAction.verb, playerObj);
            if (result)
                return result;
        }
        return "Room Action";
    }

    setShortDescription(description) {
        this.shortDescription = description;
    }

    getShortDescription() {
        var descriptions = ""
        descriptions += this.shortDescription;

        for (var i = 0; i < this.interactables.length; i++) {
            var interactable = this.interactables[i];
            descriptions += "<br><br>"
            descriptions += interactable.getShortDescription();
        }
        return descriptions;
    }

    setLongDescription(description) {
        this.longDescription = description;
    }

    getLongDescription() {
        return this.longDescription;
    }

    getLongDescriptionWithObjects() {
        var descriptions = ""
        descriptions += this.longDescription;

        for (var i = 0; i < this.interactables.length; i++) {
            var interactable = this.interactables[i];
            descriptions += "<br><br>"
            descriptions += interactable.getShortDescription();
        }
        return descriptions;
    }

    addAction(verbs, func) {
        verbs.forEach((verb) => {
            this.verbs[verb] = func;
        })
    }
    
    testVerb(verb) {
        return (this.verbs.hasOwnProperty(verb));
    }

    executeVerb(verb, playerObj) {
        if (this.testVerb(verb))
            return this.verbs[verb](playerObj)
        return null;
    }
}

module.exports = Room;