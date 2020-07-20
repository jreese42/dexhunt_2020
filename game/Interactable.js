//Nouns
//Verbs
//Description

const Messaging = require('./Messaging.js');
const Globals = require('./Globals.js');

class Interactable {
    constructor(adjectivesList, nounsList) {
        this._objectId = Globals.getNextObjectId();
        this._shortDescription = "";
        this._longDescription = "";
        this._nouns = nounsList;
        this._adjectives = adjectivesList;
        this._verbs = {}; //Map of verb => func(Player). Should return a command output string.
        this._interactables = [];

        if (!this._adjectives) {
            console.warn("Warning!  Interactable was defined without an adjectives list.  Did you mean to do that?");
        }
        if (!this._nouns) {
            console.warn("Warning!  Interactable was defined without a nouns list.  Did you mean to do that?");
        }
        
        this.addAction(["look", "examine"], (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.longDescription);
            return response;
        });
    }

    scorePlayerAction(playerAction) {
        var score = 0;
        var verbsFound = 0;
        playerAction.getTokens().forEach(token => {
            if (this._nouns && this._nouns.includes(token))
                score += 1;
            if (this._adjectives && this._adjectives.includes(token))
                score += 1;
            if (this._verbs && token in this._verbs) {
                score += 1;  
                verbsFound += 1;          
            }    
        });

        //We must find at least one verb to be able to process input
        if (verbsFound <= 0)
            score = 0;

        //This part is kinda weird but it makes the code easier.
        //Set the score on the playerAction object and then recurse downward
        //After all objects are checked, the playerAction contains the objectId of the best object
        //I do this instead of returning the best object because it allows for dealing with ties more gracefully
        playerAction.setParserObjectIfBetter(score, this._objectId);

        //The order of checking this object first and sub-objects second is important
        //This means that in the case of a tie, the higher tier object wins
        for (var i = 0; i < this._interactables.length; i++) {
            var interactable = this._interactables[i];
            interactable.scorePlayerAction(playerAction);
        }
    }

    get objectId() {
        return this._objectId;
    }

    findObjectById(idToFind) {
        if (this._objectId == idToFind)
            return this;
        for (var i = 0; i < this._interactables.length; i++) {
            var interactable = this._interactables[i];
            if (interactable.findObjectById(idToFind))
                return interactable;
        }
        return null;
    }

    get shortDescription() {
        return this._shortDescription;
    }

    set shortDescription(description) {
        this._shortDescription = description;
    }
    
    setShortDescription(description) {
        this._shortDescription = description;
    }

    get longDescription() {
        return this._longDescription;
    }
    
    get longDescriptionWithObjects() {
        var descriptions = ""
        descriptions += this.longDescription;

        for (var i = 0; i < this._interactables.length; i++) {
            var interactable = this._interactables[i];
            if (interactable.shortDescription) {
                descriptions += "<br><br>"
                descriptions += interactable.shortDescription;
            }
        }
        return descriptions;
    }

    set longDescription(description) {
        this._longDescription = description;
    }

    setLongDescription(description) {
        this._longDescription = description;
    }

    addInteractable(interactable) {
        this._interactables.push(interactable);
    }
    
    addNoun(newNoun) {
        this._nouns.push(newNoun);
    }

    testNoun(noun) {
        return (this._nouns.includes(noun));
    }

    addAction(verbs, func) {
        verbs.forEach((verb) => {
            this._verbs[verb] = func;
        })
    }
    
    testVerb(verb) {
        return (this._verbs.hasOwnProperty(verb));
    }

    executeVerb(verb, playerObj) {
        if (this.testVerb(verb))
            return this._verbs[verb](playerObj)
        return null;
    }

    process_playerAction(playerAction, playerObj) {
        console.log("Object " + this._objectId + " is processing the input")
        //Process playerAction tokens and try to map 
        var response = null;
        var tokens = playerAction.getTokens();
        //Pull one verb out of the player input.  This is first because verb is usually the first word.
        var verb = null;
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i] in this._verbs) {
                verb = tokens[i];
                tokens.splice(i, 1);
            }
        }
        //Must match a verb to be able to process it
        if (!verb) {
            response = new Messaging.ConsoleOutput();
            response.setResponseText("What are you trying to do?");
            return response;
        }

        //Pull all matching nouns out of the player input.
        var nouns = [];
        for (var i = 0; i < tokens.length; i++) {
            if (this._nouns.includes(tokens[i])) {
                nouns.push(tokens[i]);
                tokens.splice(i, 1);
            }
        } 

        //Pull all matching adjectives out of the player input.
        var adjectives = [];
        for (var i = 0; i < tokens.length; i++) {
            if (this._adjectives.includes(tokens[i])) {
                adjectives.push(tokens[i]);
                tokens.splice(i, 1);
            }
        }

        console.log("Object Processing:")
        console.log("Verb:")
        console.log(verb);
        console.log("Nouns:")
        console.log(nouns);
        console.log("Adjectives:")
        console.log(adjectives);
        console.log("Unprocessed:")
        console.log(tokens);

        response = this.executeVerb(verb, playerObj);
        
        if (!response) {
            //nothing responded
            response = new Messaging.ConsoleOutput();
            response.setResponseText("What are you trying to do?");
        }
        if (!response instanceof Messaging.ConsoleOutput) {
            //unexpected response type
            response = new Messaging.ConsoleOutput();
            response.setResponseText("What are you trying to do?");
        }
        return response;
    }
}

module.exports = Interactable;