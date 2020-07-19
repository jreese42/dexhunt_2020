/*
 * userInput.js
 * Contains data about a line of input from a user.
 */

var posTagger = require( 'wink-pos-tagger' );

//For "pos" package, from https://www.npmjs.com/package/parts-of-speech
const PartOfSpeech = {
    COORD_CUNJUNCTION: "CC", //and,but,or
    CARDINAL_NUM: "CD", //one,two
    DETERMINER: "DT", //the,some
    PREDETERMINER: "PDT", //all, both
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
    PRONOUN_POSESSIVE: "PRP$", //my,one�s
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
    VERB_PRESENT_THIRD: "VBZ", //eats
    WH_DETERMINER: "WDT", //which,that
    WH_PRONOUN: "WP", //who,what
    WH_POSSESIVE: "WP$", //whose
    WH_ADV: "WRB", //how,where
    COMMA: ",", //,
    PUNCT_SENTENCE_FINAL: ".", //. ! ?
    PUNCT_MID_SENTENCE: ":", //: ; �
    DOLLAR: "$", //$, €, £, ¥
    POUND: "#", //#
    QUOTE: "\"", //"
    LEFT_PAREN: "(", //(
    RIGHT_PAREN: ")", //)
    EXPLETIVE_THERE: "EX", //there
    EMOJI: "EM", //:), <emoji>
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
        if (!rawString) {
            return [];
        }
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
        this.tagger = posTagger();  //TODO: Either need a better tagger or a big custom lexicon
        
        //Some lemmas are not properly tagged in short sentences as seen in a Text based adventure
        //Override the tagger on these specific tokens.
        //This means that these lemmas are forced into a specific context and cannot be used in any other english usage.
        this._forcedTags = {
            "use": PartOfSpeech.VERB,
        }
    }

    lex(tokens) {
        var taggedWords = this.tagger.tagRawTokens(tokens);
        taggedWords = this._forceTags(taggedWords);

        return taggedWords;
    }

    _initLexicon() {
        /* See tags here: https://www.npmjs.com/package/parts-of-speech */
        var lexiconExtension = {
            'Obama': [PartOfSpeech.NOUN_PROPER_SINGLE],
            'Use': [PartOfSpeech.VERB],
            'Open': [PartOfSpeech.VERB],
            'key': [PartOfSpeech.NOUN],
        }
        this.tagger.updateLexicon(lexiconExtension);
    }

    _forceTags(taggedWords) {

        taggedWords.forEach((posEntry) => {
            if (posEntry.lemma in this._forcedTags) {
                posEntry.pos = this._forcedTags[posEntry.lemma];
            }
        });
        return taggedWords;
    }
}

class PlayerAction {
    constructor() {
        this.tokens = [];

        this.currentParserScore = 0;
        this.bestParserObjectId = -1;
    }

    pushToken(token) {
        this.tokens.push(token);
    }

    getTokens() {
        return this.tokens;
    }

    getCurrentParserScore() {
        return this.currentParserScore;
    }

    getCurrentParserObjectId() {
        return this.bestParserObjectId;
    }
    
    setParserObjectIfBetter(score, objId) {
        if (score > this.getCurrentParserScore()) {
            this.currentParserScore = score;
            this.bestParserObjectId = objId;
        }
    }
}

class ActionProcessor {
    constructor() {
        this._conjunctiveTokens = ["and", "then"]; 
    }

    processActions(tokens) {
        var contextNoun = "";
        //split on Coordinating conjunctions or Conjunctive adverbs (and, then)
        //split the tokens into distinct actions that will be processed in order
        var actionList = [new PlayerAction()]
        tokens.forEach(token => {
            if (this._conjunctiveTokens.includes(token)) {
                if (actionList[actionList.length-1].tokens.length > 0) {
                    actionList.push(new PlayerAction());
                }
            }
            else {
                actionList[actionList.length-1].pushToken(token);
            }
        });

        return actionList;
    }
}

class UserInput {
    constructor(rawString) {
        this.setRawString(rawString)
        this.setTokens(this._getTokenizer().tokenize(this.getRawString())) //Break string into tokens and make some substitutions
        // this.setPartsOfSpeech(this._getLexer().lex(this.getTokens())) //Process parts of speech
        // this.setActions(this._getActionProcessor().processActions(this.getPartsOfSpeech())) //Convert parts of speech into actions
        this.setActions(this._getActionProcessor().processActions(this.getTokens())) //Convert tokens into actions
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

/* Verb Groups are utilities for handling similar verbs within actions */
UserInput.VerbGroup = {}
UserInput.VerbGroup.USE = ['use', 'open']
UserInput.VerbGroup.LOOK = ['look', 'examine', 'inspect']
UserInput.VerbGroup.TAKE = ['take', 'get']
UserInput.VerbGroup.GO = ['go', 'enter', 'use']

//Tenses to check
//"Give Hug to Orc" => Verb Give, Hug is nounPrimary, Orc is nounSecondary assumed by "TO"
//"Hug the Orc" => No verb so assume Give. Hug is nounPrimary, Orc is nounSecondary assumed by "DT"
//Two actions conjoined with Corridinating Conjunction "CC"

module.exports = UserInput

