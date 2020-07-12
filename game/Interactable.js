//Nouns
//Verbs
//Description

class Interactable {
    constructor(primaryNoun) {
        this.shortDescription = "Object Description";
        this.longDescription = "Long Object Description";
        this.nouns = [primaryNoun];
        this.verbs = {}; //Map of verb => func(Player). Should return a command output string.
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
        return (noun in this.nouns);
    }

    addVerb(verb, func) {
        this.verbs[verb] = func;
    }
    
    testVerb(verb) {
        return (verb in this.verbs);
    }

    executeVerb(verb) {
        if (this.testVerb(verb))
            return this.verbs[verb]()
        return null;
    }
}

module.exports = Interactable;