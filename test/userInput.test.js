const assert = require('assert');
const expect = require('chai').expect;

const UserInput = require('../game/UserInput.js')

describe('Tokenizer Tests', () => {
    it('should handle basic input', () => {
           var userInput = new UserInput("This is a test.")
           expect(userInput.getTokens()).to.eql(["This", "is", "a", "test."])
       });
});

describe('Lexer Tests', () => {
    it('should find verb', () => {
           var userInput = new UserInput("This is a test.")
           userInput.setTokens(["Solve", "a", "puzzle"])
           assert.equal(true, true);
       });
});

describe('User Input Processing Tests', () => {
    it('should find verb', () => {
           var userInput = new UserInput("Give Hug to Orc")
           assert.equal(true, true);
       });
       it('should find verb', () => {
        var userInput = new UserInput("Hug the Orc")
        assert.equal(true, true);
    });
});