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
        return tokens;
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
            'Obama': ['NNP'],
            'Hug': ['VB'],
        }
        this.tagger.extendLexicon(lexiconExtension);
    }
}

class PlayerAction {
    constructor() {
        this.verb = ""
        this.nounPrimary
    }
}

class ActionProcessor {
    constructor() {
    }

    processActions() {

    }
}

class UserInput {
    constructor(rawString) {
        this.setRawString(rawString)
        this.setTokens(this._getTokenizer().tokenize(this.getRawString())) //Break string into tokens and make some substitutions
        this.setPartsOfSpeech(this._getLexer().lex(this.getTokens())) //Process parts of speech
        this._processActions() //Convert parts of speech into actions
    }

    /** Get access to static class member */
    _getTokenizer() {
        return this.constructor.tokenizer;
    }

    /** Get access to static class member */
    _getLexer() {
        return this.constructor.lexer;
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
        console.log(partsOfSpeech)
        this.partsOfSpeech = partsOfSpeech;
    }

    getActions() {
        return this.actionList;
    }

    _processActions() {

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