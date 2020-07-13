//Nouns
//Verbs
//Description

var Messaging = require('./Messaging.js');

class Interactable {
    constructor(nouns) {
        this.shortDescription = "Object Description";
        this.longDescription = "Long Object Description";
        this.nouns = nouns;
        this.verbs = {}; //Map of verb => func(Player). Must return a Messaging.ConsoleOutput object.

        this.addAction(["look", "examine"], (playerObj) => {
            var response = new Messaging.ConsoleOutput();
            response.setResponseText(this.getLongDescription());
            return response;
        });
    }

    getShortDescription() {
        return this.shortDescription;
    }

    setShortDescription(description) {
        this.shortDescription = description;
    }

    getLongDescription() {
        return this.longDescription;
    }

    setLongDescription(description) {
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