//Nouns
//Verbs
//Description

var Messaging = require('./Messaging.js');

class Interactable {
    constructor(adjectivesList, nounsList) {
        this.objectId = 0;
        this.shortDescription = "Object Description";
        this.longDescription = "Long Object Description";
        this.nouns = nounsList;
        this.adjectives = adjectivesList;
        this.verbs = {}; //Map of verb => func(Player). Should return a command output string.
        
        this.addAction(["look", "examine"], (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.getLongDescription());
            return response;
        });
    }

    scorePlayerAction(playerAction) {
        var score = 0;
        playerAction.getTokens().forEach(token => {
            if (this.nouns && this.nouns.includes(token))
                score += 1;
            if (this.adjectives && this.adjectives.includes(token))
                score += 1;
            if (this.verbs && this.verbs.includes(token))
                score += 1;                
        });
        return score;
    }


    get shortDescription() {
        return this.shortDescription;
    }

    set shortDescription(description) {
        this.shortDescription = description;
    }

    get longDescription() {
        return this.longDescription;
    }

    set longDescription(description) {
        this.longDescription = description;
    }
    
    addNoun(newNoun) {
        this.nouns.push(newNoun);
    }

    testNoun(noun) {
        return (this.nouns.includes(noun));
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

module.exports = Interactable;