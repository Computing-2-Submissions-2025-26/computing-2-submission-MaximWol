import assert from "assert";
import Mastermind from "../Mastermind.js";

describe("Mastermind", () => {

    describe("createGame", () => {
        it("creates a game with 10 attempts remaining", () => {
            let game = Mastermind.createGame();
            assert.strictEqual(game.attemptsRemaining, 10);
        });
        it("creates a game with the correct list of valid colours", () => {
            let game = Mastermind.createGame();
            assert.deepStrictEqual(game.gColours, ["red", "green", "blue", "yellow", "white", "black"]);
        });
        it("creates a game with an empty secret code", () => {
            let game = Mastermind.createGame();
            assert.deepStrictEqual(game.secretCode, []);
        });
        it("creates a game with an empty list of guesses", () => {
            let game = Mastermind.createGame();
            assert.deepStrictEqual(game.guesses, []);
        });
        it("creates a game with the correct code length", () => {
            let game = Mastermind.createGame();
            assert.strictEqual(game.codeLength, 4);
        });
        it("creates a game with 0 attempts made", () => {
            let game = Mastermind.createGame();
            assert.strictEqual(game.attemptsMade, 0);
        });
        it("creates a game with a null winner", () => {
            let game = Mastermind.createGame();
            assert.strictEqual(game.winner, null);
        });
        it("throws an error if a guess is made after the game is over", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            for (let i = 0; i < 10; i += 1) {
                const result = Mastermind.makeGuess(
                    game,
                    ["white", "white", "white", "white"]
                );
                game = result.game;
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
            let game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateCode(game, "not an array"), Error);
        });
        it("throws an error if the code is not the correct length", () => {
            let game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateCode(game, ["red", "green"]), Error);
        });
        it("throws an error if the code contains invalid colours", () => {
            let game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateCode(game, ["red", "green", "blue", "invalid colour"]), Error);
        });
    });

    describe("setSecretCode", () => {
        it("sets the secret code if it is valid", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            assert.deepStrictEqual(game.secretCode, code);
        });
        it("throws an error if the code is not valid", () => {
            let game = Mastermind.createGame();
            assert.throws(() => Mastermind.setSecretCode(game, "not an array"), Error);
        });
    });

    describe("validateGuess", () => {
        it("throws an error if the guess is not valid", () => {
            let game = Mastermind.createGame();
            assert.throws(() => Mastermind.validateGuess(game, "not an array"), Error);
        });
    });

    describe("scoreGuess", () => {
        it("scores a guess with 4 correct colours in the correct place", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 4, whitePegs: 0});
        });
        it("scores a guess with 4 correct colours in the wrong place", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["green", "blue", "yellow", "red"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 0, whitePegs: 4});
        });
        it("scores a guess with 2 correct colours in the correct place and 2 correct colours in the wrong place", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 2, whitePegs: 2});
        });
        it("scores a guess with no correct colours", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["white", "white", "white", "white"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 0, whitePegs: 0});
        });
        it("scores a guess with repeated colours in the code and guess", () => {
            let game = Mastermind.createGame();
            const code = ["red", "red", "green", "green"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "red", "green"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 2, whitePegs: 2});
        });
        it("scores a guess with repeated colours in the code and guess where some of the repeated colours are correct", () => {
            let game = Mastermind.createGame();
            const code = ["red", "red", "green", "green"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "red", "red", "green"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 3, whitePegs: 0});
        });
        it("scores a guess with repeated colours in the code and guess where some of the repeated colours are correct and some are in the wrong place", () => {
            let game = Mastermind.createGame();
            const code = ["red", "red", "green", "green"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "red", "red"];
            const score = Mastermind.scoreGuess(game, guess);
            assert.deepStrictEqual(score, {blackPegs: 1, whitePegs: 2});
        });
    });

    describe("makeGuess", () => {
        it("makes a guess and updates the game state correctly", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            const result = Mastermind.makeGuess(game, guess);
            game = result.game;
            const score = result.score;
            assert.deepStrictEqual(score, {blackPegs: 2, whitePegs: 2});
            assert.strictEqual(game.attemptsMade, 1);
            assert.strictEqual(game.attemptsRemaining, 9);
            assert.deepStrictEqual(game.guesses, [{guess: guess, score: score}]);
            assert.strictEqual(game.winner, null);
        });
        it("makes a winning guess and updates the game state correctly", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            const result = Mastermind.makeGuess(game, guess);
            game = result.game;
            const score = result.score;
            assert.deepStrictEqual(score, {blackPegs: 4, whitePegs: 0});
            assert.strictEqual(game.attemptsMade, 1);
            assert.strictEqual(game.attemptsRemaining, 9);
            assert.deepStrictEqual(game.guesses, [{guess: guess, score: score}]);
            assert.strictEqual(game.winner, true);
        });
        it("makes a losing guess and updates the game state correctly", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            let score;
            for (let i = 0; i < 10; i += 1) {
                const result = Mastermind.makeGuess(
                    game,
                    ["white", "white", "white", "white"]
                );
                game = result.game;
                score = result.score;
            }
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
                {guess: ["white", "white", "white", "white"], score: {blackPegs: 0, whitePegs: 0}}
            ]);
            assert.strictEqual(game.winner, false);
        });
    });

    describe("isGameOver", () => {
        it("returns false if the game is not over", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            game = Mastermind.makeGuess(game, guess).game;
            assert.strictEqual(Mastermind.isGameOver(game), false);
        });
        it("returns true if game is won", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            game = Mastermind.makeGuess(game, guess).game;
            assert.strictEqual(Mastermind.isGameOver(game), true);
        });
        it("returns true if game is lost", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            for (let i = 0; i < 10; i += 1) {
                const result = Mastermind.makeGuess(
                    game,
                    ["white", "white", "white", "white"]
                );
                game = result.game;
            }
            assert.strictEqual(Mastermind.isGameOver(game), true);
        });
    });

    describe("isWinningGuess", () => {
        it("returns true if the guess is a winning guess", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "green", "blue", "yellow"];
            assert.strictEqual(Mastermind.isWinningGuess(game, guess), true);
        });
        it("returns false if the guess is not a winning guess", () => {
            let game = Mastermind.createGame();
            const code = ["red", "green", "blue", "yellow"];
            game = Mastermind.setSecretCode(game, code);
            const guess = ["red", "blue", "green", "yellow"];
            assert.strictEqual(Mastermind.isWinningGuess(game, guess), false);
        });
    });

    describe("resetGame", () => {
        it("resets the game state", () => {
            let game = Mastermind.createGame();
            game = Mastermind.setSecretCode(
                game,
                ["red", "blue", "green", "yellow"]
            );
            game = Mastermind.makeGuess(
                game,
                ["red", "red", "red", "red"]
            ).game;
            game = Mastermind.resetGame();
            assert.deepEqual(game.secretCode, []);
            assert.equal(game.attemptsRemaining, 10);
        });
    });
});