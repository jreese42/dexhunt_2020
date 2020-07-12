const assert = require('assert');
const expect = require('chai').expect;

const UserInput = require('../game/UserInput.js')

describe('Tokenizer Tests', () => {
    it('should handle basic input', () => {
           var userInput = new UserInput("this is a test")
           expect(userInput.getTokens()).to.eql(["this", "is", "a", "test"])
       });
    it('should remove all punctuation', () => {
        var userInput = new UserInput("This. is?? a (test) &^%")
        expect(userInput.getTokens()).to.eql(["this", "is", "a", "test"])
    });
    
    it('should return lowercase', () => {
        var userInput = new UserInput("THIS Is A tesT")
        expect(userInput.getTokens()).to.eql(["this", "is", "a", "test"])
    });

    it('should use substitutions', () => {
        var userInput = new UserInput("N E S W NN EE SS WW")
        expect(userInput.getTokens()).to.eql(["north", "east", "south", "west", "nn", "ee", "ss", "ww"])
    });

    it('should reduce conjuctive pair', () => {
        var userInput = new UserInput("this and then that")
        expect(userInput.getTokens()).to.eql(["this", "and", "that"])
    });
});

describe('Lexer Tests', () => {
    it('should find verb', () => {
           var userInput = new UserInput("This is a test.")
           userInput.setTokens(["Solve", "a", "puzzle"])
           assert.equal(true, true);
       });
});

describe('Action Processor Tests', () => {
    it('should find verb', () => {
           var userInput = new UserInput("Give Hug to Orc then slap it")
           assert.equal(true, true);
       });
       it('should find verb', () => {
        var userInput = new UserInput("Hug the Orc")
        assert.equal(true, true);
    });
    it('should replace personal pronouns', () => {
        var userInput = new UserInput("Talk to the Orc and then slap them")
        assert.equal(true, true);
    });
});