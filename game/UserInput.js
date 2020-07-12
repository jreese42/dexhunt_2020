/*
 * userInput.js
 * Contains data about a line of input from a user.
 */

//string
//tokens
//parts of speech
//verb
//noun primary
//noun secondary

var pos = require('pos');

//For "pos" package, from https://www.npmjs.com/package/parts-of-speech
const PartOfSpeech = {
    COORD_CUNJUNCTION: "CC", //and,but,or
    CARDINAL_NUM: "CD", //one,two
    DETERMINER: "DT", //the,some
    EXISTENTIAL_THERE: "EX", //there
    FOREIGN_WORD: "FW", //mon dieu
    PREOPSITION: "IN", //of,in,by
    ADJ: "JJ", //big
    ADJ_COMPARATIVE: "JJR", //bigger
    ADJ_SUPERLATIVE: "JJS", //biggest
    LIST_MARKER: "LS", //1,One
    MODAL: "MD", //can,should
    NOUN: "NN", //dog
    NOUN_PROPER_SINGLE: "NNP", //Edinburgh
    NOUN_PROPER_PLURAL: "NNPS", //Smiths
    NOUN_PLURAL: "NNS", //dogs
    POSSESSIVE_END: "POS", //�s
    PREDETERMINER: "PDT", //all, both
    PRONOUN_POSESSIVE: "PP", //my,one�s
    PRONOUN_PERSONAL: "PRP", //I,you,she
    ADV: "RB", //quickly
    ADV_COMPARATIVE: "RBR", //faster
    ADV_SUPERLATIVE: "RBS", //fastest
    PARTICLE: "RP", //up,off
    SYMBOL: "SYM", //+,%,&
    TO: "TO", //to
    INTERJECTION: "UH", //oh, oops
    VERB: "VB", //eat
    VERB_PAST: "VBD", //ate
    VERB_GERUND: "VBG", //eating
    VERB_PAST_PARTICIPLE: "VBN", //eaten
    VERB_PRESENT: "VBP", //eat
    VERB_PRESENT_P: "VBZ", //eats
    WH_DETERMINER: "WDT", //which,that
    WH_PRONOUN: "WP", //who,what
    WH_POSSESIVE: "WP", //whose
    WH_ADV: "WRB", //how,where
    COMMA: ",", //,
    PUNCT_SENTENCE_FINAL: ".", //. ! ?
    PUNCT_MID_SENTENCE: ":", //: ; �
    DOLLAR: "$", //$
    POUND: "#", //#
    QUOTE: "\"", //"
    LEFT_PAREN: "(", //(
    RIGHT_PAREN: ")", //)
}


/*
 * Tokenizer
 * Takes in a UserInput object and processes the string into tokens.
 * Tokens may be replaced by synonyms.
 */
class Tokenizer {
    constructor() {
        this._substitutions = {
            "n": "north",
            "e": "east",
            "s": "south",
            "w": "west",
            "open": "use",
        }
        this._conjunctivePairs = {
            "and then": "and", //simplify conjuctive phrasing
        }
    }

    _trim(array) {
        while (array[array.length - 1] == '')
            array.pop();
        
        while (array[0] == '')
            array.shift();
        
        return array;
    }

    _substitute(tokens) {
        tokens = tokens.map(x => x in this._substitutions ? this._substitutions[x] : x);
        for(var i=0; i < tokens.length - 1; i++){
            var pair = tokens[i] + ' ' + tokens[i+1];
            if (pair in this._conjunctivePairs) {
                tokens[i] = this._conjunctivePairs[pair];
                tokens[i+1] = ''
                i += 1;
            }
        }
        return tokens.filter(x => x);
    }

    tokenize(rawString) {
        rawString = rawString.replace(/[.,\/#!$?%\^&\*;:{}=\-_`~()]/g,""); //Remove punctuation
        var tokens = rawString.split(' ')
        if (!tokens) {
            return [rawString];
        }
        tokens = tokens.map(Function.prototype.call, String.prototype.trim);
        tokens = tokens.map(x => x.toLowerCase()); //Make lowercase
        return this._substitute(this._trim(tokens));
    }
}

/*
 * Lexer
 * Takes in a UserInput object and processes the tokens into parts of speech
 * Tokens may be replaced by synonyms.
 */
class Lexer {
    constructor() {
        this.lexer = new pos.Lexer()
        this.tagger = new pos.Tagger()
        this._initLexicon()
    }

    lex(tokens) {
        var input = tokens.join(' ')
        var words = this.lexer.lex(input);
        var taggedWords = this.tagger.tag(words);

        return taggedWords;
    }

    _initLexicon() {
        /* See tags here: https://www.npmjs.com/package/parts-of-speech */
        var lexiconExtension = {
            'Obama': [PartOfSpeech.NOUN_PROPER_SINGLE],
            'Hug': [PartOfSpeech.VERB],
        }
        this.tagger.extendLexicon(lexiconExtension);
    }
}

class PlayerAction {
    constructor() {
        this.verb = ""
        this.directObject = ""
        this.indirectObject = ""
        this.valid = true;
    }

    setValid(valid) {
        this.valid = valid;
    }

    isValid() {
        return this.isValid;
    }
}

class ActionProcessor {
    constructor() {
        this._coordAdverbs = ["then"]; 
    }

    processActions(partsOfSpeech) {
        var contextNoun = "";
        //split on Coordinating conjunctions or Conjunctive adverbs (then)
        //replace PRP with reference to direct object
        var actionList = [new PlayerAction()]
        partsOfSpeech.forEach(posEntry => {
            var word = posEntry[0];
            var pos = posEntry[1];
            if (pos == PartOfSpeech.COORD_CUNJUNCTION || (this._coordAdverbs.includes(word))) {
                actionList.push(new PlayerAction())
            }
            else {
                if (pos == PartOfSpeech.VERB || pos == PartOfSpeech.VERB_PRESENT || pos == PartOfSpeech.VERB_PRESENT_P) {
                    if (actionList[actionList.length-1].verb) {
                        actionList[actionList.length-1].setValid(false); //Can't have 2 verbs
                        console.log("Processing failed because multiple verbs were found.")
                    }
                    else {
                        actionList[actionList.length-1].verb = word;
                    }
                }
                if (pos == PartOfSpeech.NOUN || pos == PartOfSpeech.NOUN_PLURAL || pos == PartOfSpeech.NOUN_PROPER_SINGLE || pos == PartOfSpeech.NOUN_PROPER_PLURAL) {
                    contextNoun = word;
                    if (actionList[actionList.length-1].directObject && actionList[actionList.length-1].indirectObject) {
                        console.log("Dropping noun ", word, " because two nouns were already found.")
                    }
                    else if (actionList[actionList.length-1].directObject) {
                        actionList[actionList.length-1].indirectObject = word;
                    }
                    else {
                        actionList[actionList.length-1].directObject = word;
                    }
                }
                if (pos == PartOfSpeech.PRONOUN_PERSONAL) {
                    //Assume the personal pronoun reference to the direct object of the previous clause
                    if (actionList.length > 1) {
                        if (!contextNoun) {
                            actionList[actionList.length-1].setValid(false);
                        }
                        else {
                            actionList[actionList.length-1].directObject = contextNoun;
                        }
                    }
                    else {
                        //TODO: Try to pull the sentence subject from the client context.
                        //They're probably responding to the previous prompt e.g. "There is a sword on the ground." => "Pick it up."
                        //Not sure what this PRP refers to
                        actionList[actionList.length-1].setValid(false);
                    }
                }
            }
        });
        return actionList;
    }
}

class UserInput {
    constructor(rawString) {
        this.setRawString(rawString)
        this.setTokens(this._getTokenizer().tokenize(this.getRawString())) //Break string into tokens and make some substitutions
        this.setPartsOfSpeech(this._getLexer().lex(this.getTokens())) //Process parts of speech
        this.setActions(this._getActionProcessor().processActions(this.getPartsOfSpeech())) //Convert parts of speech into actions
    }

    /** Get access to static class member */
    _getTokenizer() {
        return this.constructor.tokenizer;
    }

    /** Get access to static class member */
    _getLexer() {
        return this.constructor.lexer;
    }

    /** Get access to static class member */
    _getActionProcessor() {
        return this.constructor.actionProcessor;
    }

    setRawString(string) {
        console.log(string)
        this.rawString = string;
    }

    getRawString() {
        return this.rawString;
    }

    setTokens(tokens) {
        console.log(tokens)
        this.tokens = tokens;
    }

    getTokens() {
        return this.tokens;
    }

    setPartsOfSpeech(partsOfSpeech) {
        console.log(partsOfSpeech)
        this.partsOfSpeech = partsOfSpeech;
    }

    getPartsOfSpeech() {
        return this.partsOfSpeech;
    }

    setActions(actionList) {
        console.log(actionList)
        this.actionList = actionList;
    }

    countActions() {
        return this.actionList.length;
    }

    getAction(index) {
        return this.actionList[index];
    }

    getActions() {
        return this.actionList;
    }
}

UserInput.tokenizer = new Tokenizer();
UserInput.lexer = new Lexer();
UserInput.actionProcessor = new ActionProcessor();

//Tenses to check
//"Give Hug to Orc" => Verb Give, Hug is nounPrimary, Orc is nounSecondary assumed by "TO"
//"Hug the Orc" => No verb so assume Give. Hug is nounPrimary, Orc is nounSecondary assumed by "DT"
//Two actions conjoined with Corridinating Conjunction "CC"

module.exports = UserInput