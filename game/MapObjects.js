module.exports.Door = class Door {
    //TODO
    constructor(primaryNoun) {
        this.shortDescription = "Object Description";
        this.longDescription = "Long Object Description";
        this.nouns = [primaryNoun];
        this.verbs = {}; //Map of verb => func(Player). Must return a ServerResponse object.

        this.addAction(["use", "open"], )
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