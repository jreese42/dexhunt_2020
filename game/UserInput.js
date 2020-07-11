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
    }

    tokenize(rawString) {
        var tokens = rawString.split(' ')
        return tokens
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
        }
        this.tagger.extendLexicon(lexiconExtension);
    }
}

class UserInput {
    constructor(rawString) {
        this.setRawString(rawString)
        this.setTokens(this.getTokenizer().tokenize(this.getRawString()))
        this.setPartsOfSpeech(this.getLexer().lex(this.getTokens()))
    }

    /** Get access to static class member */
    getTokenizer() {
        return this.constructor.tokenizer;
    }

    /** Get access to static class member */
    getLexer() {
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
}

UserInput.tokenizer = new Tokenizer();
UserInput.lexer = new Lexer();

//Tenses to check
//"Give Hug to Orc" => Verb Give, Hug is nounPrimary, Orc is nounSecondary assumed by "TO"
//"Hug the Orc" => No verb so assume Give. Hug is nounPrimary, Orc is nounSecondary assumed by "DT"

module.exports = UserInput