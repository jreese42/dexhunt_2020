//Interactables
//Doors
//Game Logic

class Room {
    constructor() {
        this.interactables = [];
        this.shortDescription = "Room Description.";
        this.longDescription = "Long Room Description."
    }

    addInteractable(interactable) {
        this.interactables.push(interactable);
    }

    process_playerAction(userInput) {
        //Search for interactables for noun
        for (interactable in this.interactables) {
            if (interactable.testNoun(userInput.directObject)) {
                var result = interactable.executeVerb(userInput.verb);
                if (result)
                    return result;
            }
        }
        return "Room Action"
    }

    getShortDescription() {
        var descriptions = ""
        descriptions += this.description;
        for (interactable in this.interactables) {
            descriptions += "\n"
            descriptions += interactable.getShortDescription();
        }
        return descriptions;
    }

    getLongDescription() {
        return this.longDescription;
    }
}

module.exports = Room;