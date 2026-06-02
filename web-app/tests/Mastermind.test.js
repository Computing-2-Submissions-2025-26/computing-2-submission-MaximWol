import assert from "assert";
import Mastermind from "../Mastermind.js";

describe("Mastermind", () => {
    
    describe("createGame", () => {
        it("creates a game with 10 attempts remaining", () => {
            const game = Mastermind.createGame();
            assert.strictEqual(game.attemptsRemaining, 10);
        });
        it("creates a game with the correct list of valid colours", () => {
            const game = Mastermind.createGame();
            assert.deepStrictEqual(game.gColours, ["red", "green", "blue", "yellow", "white", "black"]);
        });
        it("creates a game with an empty secret code", () => {
            const game = Mastermind.createGame();
            assert.deepStrictEqual(game.secretCode, []);
        });
        it ("creates a game with an empty list of guesses", () => {
            const game = Mastermind.createGame();
            assert.deepStrictEqual(game.guesses, []);
        });
        it("creates a game with the correct code length", () => {
            const game = Mastermind.createGame();
            assert.strictEqual(game.codeLength, 4);
        });
        it("creates a game with 0 attempts made", () => {
            const game = Mastermind.createGame();
            assert.strictEqual(game.attemptsMade, 0);
        });
        it("creates a game with a null winner", () => {
            const game = Mastermind.createGame();
            assert.strictEqual(game.winner, null);
        });
        it("throws an error if a guess is made after the game is over", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            for (let i = 0; i < 10; i += 1) {
                Mastermind.makeGuess(
                    game,
                    ["white", "white", "white", "white"]
                );
            }
            assert.throws(() => {
                Mastermind.makeGuess(
                    game,
                    ["red", "green", "blue", "yellow"]
                );
            }, Error);

});
    });
    describe("validateCode", () => {
        it("throws an error if the code is not an array", () => {
            const game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateCode(game, "not an array"), Error);
        });
        it("throws an error if the code is not the correct length", () => {
            const game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateCode(game, ["red", "green"]), Error);
        });
        it("throws an error if the code contains invalid colours", () => {
            const game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateCode(game, ["red", "green", "blue", "invalid colour"]), Error);
        });
    });
    describe("setSecretCode", () => {
        it("sets the secret code if it is valid", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            assert.deepStrictEqual(game.secretCode, code);
        });
        it("throws an error if the code is not valid", () => {
            const game = Mastermind.createGame();
            assert.throws(() => Mastermind.setSecretCode(game, "not an array"), Error);
        });
    });
    describe("validateGuess", () => {
        it("throws an error if the guess is not valid", () => {
            const game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateGuess(game, "not an array"), Error);
        });
    });
    describe ("scoreGuess", () => {
        it("scores a guess with 4 correct colours in the correct place", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 4, whitePegs: 0});
        });
        it("scores a guess with 4 correct colours in the wrong place", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["green", "blue", "yellow", "red"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 0, whitePegs: 4});
        });
        it("scores a guess with 2 correct colours in the correct place and 2 correct colours in the wrong place", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 2, whitePegs: 2});
        });
        it("scores a guess with no correct colours", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["white", "white", "white", "white"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 0, whitePegs: 0});
        });
        it("scores a guess with repeated colours in the code and guess", () => {
            const game = Mastermind.createGame();
            const code = ["red", "red", "green", "green"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "red", "green"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 2, whitePegs: 2});
        });
        it("scores a guess with repeated colours in the code and guess where some of the repeated colours are correct", () => {
            const game = Mastermind.createGame();
            const code = ["red", "red", "green", "green"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "red", "red", "green"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 3, whitePegs: 0});
        });
        it("scores a guess with repeated colours in the code and guess where some of the repeated colours are correct and some are in the wrong place", () => {
            const game = Mastermind.createGame();
            const code = ["red", "red", "green", "green"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "red", "red"];
            const score = Mastermind.scoreGuess(code, guess);
            assert.deepStrictEqual(score, {blackPegs: 1, whitePegs: 2});
        });
    });
    describe("makeGuess", () => {
        it("makes a guess and updates the game state correctly", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            const score = Mastermind.makeGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 2, whitePegs: 2});
            assert.strictEqual(game.attemptsMade, 1);
            assert.strictEqual(game.attemptsRemaining, 9);
            assert.deepStrictEqual(game.guesses, [{guess: guess, score: score}]);
            assert.strictEqual(game.winner, null);
        });
        it("makes a winning guess and updates the game state correctly", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            const score = Mastermind.makeGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 4, whitePegs: 0});
            assert.strictEqual(game.attemptsMade, 1);
            assert.strictEqual(game.attemptsRemaining, 9);
            assert.deepStrictEqual(game.guesses, [{guess: guess, score: score}]);
            assert.strictEqual(game.winner, true);
        });
        it("makes a losing guess and updates the game state correctly", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            for (let i = 0; i < 9; i += 1) {
                Mastermind.makeGuess(game, ["white", "white", "white", "white"]);
            }
            const guess = ["white", "white", "white", "white"];
            const score = Mastermind.makeGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 0, whitePegs: 0});
            assert.strictEqual(game.attemptsMade, 10);
            assert.strictEqual(game.attemptsRemaining, 0);
            assert.deepStrictEqual(game.guesses, [
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}},
            ]);
            assert.strictEqual(game.winner, false);
        });
    });
    describe("isGameOver", () => {
        it("returns false if the game is not over", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            Mastermind.makeGuess(game, guess);
            assert.strictEqual(Mastermind.isGameOver(game), false);
        });
        it("returns true if game is won", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            Mastermind.makeGuess(game, guess);
            assert.strictEqual(Mastermind.isGameOver(game), true);
        });
        it("returns true if game is lost", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            for (let i = 0; i < 10; i += 1) {
                Mastermind.makeGuess(game, ["white", "white", "white", "white"]);
            }
            assert.strictEqual(Mastermind.isGameOver(game), true);
        });
    });
    describe("isWinningGuess", () => {
        it("returns true if the guess is a winning guess", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            assert.strictEqual(Mastermind.isWinningGuess(game, guess), true);
        }
        );
        it("returns false if the guess is not a winning guess", () => {
            const game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            assert.strictEqual(Mastermind.isWinningGuess(game, guess), false);
        });
    });
});