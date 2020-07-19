//Nouns
//Verbs
//Description

class Interactable {
    constructor(adjectivesList, nounsList) {
        this.objectId = 0;
        this.shortDescription = "Object Description";
        this.longDescription = "Long Object Description";
        this.nouns = nounsList;
        this.adjectives = adjectivesList;
        this.verbs = {}; //Map of verb => func(Player). Should return a command output string.
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