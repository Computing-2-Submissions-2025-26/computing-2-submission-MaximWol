import R from "./ramda.js";
/**
 * Mastermind.js is a module to model and play "Mastermind" games.
 * https://en.wikipedia.org/wiki/Mastermind_(board_game)
 *
 * A game is represented by a single immutable state object. Every exported
 * function is pure: it derives information from a state or returns a new
 * state, and never mutates its arguments.
 * @namespace Mastermind
 * @author Student
 * @version 2025/26
 */
const Mastermind = Object.create(null);

/**
 * A Colour is one of the six pegs a code or guess can be made from.
 * @memberof Mastermind
 * @typedef {("red" | "green" | "blue" | "yellow" | "orange" | "purple")} Colour
 */

/**
 * A Score is the feedback given for a guess.
 * @memberof Mastermind
 * @typedef {object} Score
 * @property {number} blackPegs The number of colours that are correct and in
 *     the correct position.
 * @property {number} whitePegs The number of colours that are present in the
 *     code but in the wrong position.
 */

/**
 * A Game is the complete, immutable state of a single Mastermind game.
 * @memberof Mastermind
 * @typedef {object} Game
 * @property {number} attemptsMade How many guesses have been scored.
 * @property {number} attemptsRemaining How many guesses are still allowed.
 * @property {number} codeLength The number of pegs in the code.
 * @property {Mastermind.Colour[]} gColours The colours a code may use.
 * @property {object[]} guesses The history of {guess, score} entries.
 * @property {Mastermind.Colour[]} secretCode The code being guessed.
 * @property {(boolean | null)} winner `true` if the code breaker has won,
 *     `false` if they have lost, or `null` while the game is ongoing.
 */

/**
 * Create a new, empty game with default settings:
 * a four peg code, ten attempts, and six available colours.
 * @memberof Mastermind
 * @function
 * @returns {Mastermind.Game} A new game ready for a secret code to be set.
 */
Mastermind.createGame = function () {
    return {
        attemptsMade: 0,
        attemptsRemaining: 10,
        codeLength: 4,
        gColours: ["red", "green", "blue", "yellow", "orange", "purple"],
        guesses: [],
        secretCode: [],
        winner: null
    };
};

/**
 * Returns whether a code is a valid sequence for the given game,
 * i.e. an array of the correct length containing only allowed colours.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game whose rules the code must satisfy.
 * @param {Mastermind.Colour[]} code The code to check.
 * @returns {boolean} Whether the code is valid.
 */
Mastermind.isValidCode = function (game, code) {
    return (
        Array.isArray(code) &&
        code.length === game.codeLength &&
        R.all((colour) => R.includes(colour, game.gColours), code)
    );
};

/**
 * Validates that a code is well formed, throwing a descriptive error if not.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game whose rules the code must satisfy.
 * @param {Mastermind.Colour[]} code The code to validate.
 * @throws {Error} If the code is not an array.
 * @throws {Error} If the code is not the correct length.
 * @throws {Error} If the code contains invalid colours.
 */
Mastermind.validateCode = function (game, code) {
    if (!Array.isArray(code)) {
        throw new Error("Code must be an array.");
    }
    if (code.length !== game.codeLength) {
        throw new Error(
            "Code must contain exactly " + game.codeLength +
            " colours (repetition is allowed)."
        );
    }
    if (!R.all((colour) => R.includes(colour, game.gColours), code)) {
        throw new Error("Code contains an invalid colour.");
    }
};

/**
 * Validates and stores the secret code, returning a new game.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game to set the code for.
 * @param {Mastermind.Colour[]} code The secret code to store.
 * @returns {Mastermind.Game} A new game with the secret code set.
 * @throws {Error} If the code is invalid.
 */
Mastermind.setSecretCode = function (game, code) {
    Mastermind.validateCode(game, code);
    return R.mergeRight(game, {secretCode: [...code]});
};

/**
 * Validates that a guess is well formed for the given game.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game the guess is being made in.
 * @param {Mastermind.Colour[]} guess The guess to validate.
 * @throws {Error} If the guess is not a valid code.
 */
Mastermind.validateGuess = function (game, guess) {
    Mastermind.validateCode(game, guess);
};

// For two equal length sequences, returns the multiset of colours that remain
// once every exactly matching position has been removed from each.
const non_matching_colours = function (secret, guess) {
    const is_match = R.zipWith(R.equals, secret, guess);
    const keep = (sequence) => sequence.filter(
        (ignore, index) => !is_match[index]
    );
    return [keep(secret), keep(guess)];
};

// Counts, across all colours, how many appear in both multisets, taking the
// smaller of the two tallies for each colour. This is the white peg count.
const count_colour_overlap = function (remaining_secret, remaining_guess) {
    const secret_counts = R.countBy(R.identity, remaining_secret);
    const guess_counts = R.countBy(R.identity, remaining_guess);
    return R.sum(R.values(R.mapObjIndexed(
        (count, colour) => Math.min(count, secret_counts[colour] || 0),
        guess_counts
    )));
};

/**
 * Scores a guess against the game's secret code.
 * Black pegs count colours that are correct and in the correct position;
 * white pegs count remaining colours that are present but misplaced.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game holding the secret code.
 * @param {Mastermind.Colour[]} guess The guess to score.
 * @returns {Mastermind.Score} The black and white peg counts.
 */
Mastermind.scoreGuess = function (game, guess) {
    const secret = game.secretCode;
    const blackPegs = R.count(
        R.equals(true),
        R.zipWith(R.equals, secret, guess)
    );
    const [remaining_secret, remaining_guess] = non_matching_colours(
        secret,
        guess
    );
    return {
        blackPegs,
        whitePegs: count_colour_overlap(remaining_secret, remaining_guess)
    };
};

/**
 * Returns whether a guess wins the game,
 * i.e. every peg is correct and in the correct position.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game holding the secret code.
 * @param {Mastermind.Colour[]} guess The guess to check.
 * @returns {boolean} Whether the guess is a winning guess.
 */
Mastermind.isWinningGuess = function (game, guess) {
    return Mastermind.scoreGuess(game, guess).blackPegs === game.codeLength;
};

/**
 * Returns whether the game has ended,
 * either because the code breaker has won or because no attempts remain.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The game to check.
 * @returns {boolean} Whether the game is over.
 */
Mastermind.isGameOver = function (game) {
    return game.winner !== null || game.attemptsRemaining <= 0;
};

/**
 * Scores a guess and returns the resulting game alongside its score.
 * The guess is appended to the history, the attempt counters are advanced,
 * and the winner is resolved if the game has ended.
 * @memberof Mastermind
 * @function
 * @param {Mastermind.Game} game The current game.
 * @param {Mastermind.Colour[]} guess The guess to play.
 * @returns {{game: Mastermind.Game, score: Mastermind.Score}} The new game and
 *     the score for this guess.
 * @throws {Error} If the game is already over.
 * @throws {Error} If the guess is invalid.
 */
Mastermind.makeGuess = function (game, guess) {
    if (Mastermind.isGameOver(game)) {
        throw new Error("Game is already over.");
    }
    Mastermind.validateGuess(game, guess);

    const score = Mastermind.scoreGuess(game, guess);
    const played = R.mergeRight(game, {
        attemptsMade: game.attemptsMade + 1,
        attemptsRemaining: game.attemptsRemaining - 1,
        guesses: [...game.guesses, {guess: [...guess], score}]
    });
    const winner = (
        score.blackPegs === game.codeLength
        ? true
        : (
            played.attemptsRemaining <= 0
            ? false
            : null
        )
    );
    return {
        game: R.mergeRight(played, {winner}),
        score
    };
};

/**
 * Resets the game to its initial state.
 * @memberof Mastermind
 * @function
 * @returns {Mastermind.Game} A new game state object.
 */
Mastermind.resetGame = function () {
    return Mastermind.createGame();
};

export default Object.freeze(Mastermind);
