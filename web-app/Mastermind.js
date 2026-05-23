

const Mastermind = Object.create(null); // creates object to hold exported functions


/**
 * Creates and returns a new Mastermind game state object.
 *
 * @returns {object} A new game state object with default values.
 */
Mastermind.createGame = () => { // initialises game state
    return {
        gColours: ["red", "green", "blue", "yellow", "white", "black"],
        codeLength: 4,
        attemptsMade: 0,
        attemptsRemaining: 10,
        secretCode: [],
        guesses: [],
        winner: null, //True if guesser wins, false if guesser loses, null if game is ongoing
    };

};

/**
 * Validates that a code is in a valid form.
 *
 * @param {object} game The current game state.
 * @param {string[]} code The code to validate.
 * @throws {Error} If the code is not an array.
 * @throws {Error} If the code is not the correct length.
 * @throws {Error} If the code contains invalid colours.
 */
Mastermind.validateCode = (game, code) => { //throws error if code is invalid in form
    if (!Array.isArray(code)) {
        throw new Error(`Secret code must be an array.`);
    }

    if (code.length !== game.codeLength) {
        throw new Error(`Secret code must contain exactly ${game.codeLength} colours (repetition is allowed)`);
    }

    for (let i = 0; i < code.length; i += 1) {
        if (!game.gColours.includes(code[i])) { // checks if each term in secret code is in the list of valid colours, throws an error if not
            throw new Error(`Invalid colour in secret code.`);
        }
    }
};

/**
 * Validates and stores the secret code for the game.
 *
 * @param {object} game The current game state.
 * @param {string[]} code The secret code to store.
 * @throws {Error} If the secret code is invalid.
 */
Mastermind.setSecretCode = (game, code) => { // sets the secret code for the game, throws error if code is invalid
    Mastermind.validateCode(game, code); // validates proposed code
    game.secretCode = code;// stores code in game

};

/**
 * validates a player's guess is in a valid form
 * @param {string[]} guess The player's guess.
 * @param {object} game The current game state.
 * @throws {Error} If guess is not an array
 * @throws {Error} If guess isn't the correct length
 * @throws {Error} If guess doesn't only contain valid colours
 */
Mastermind.validateGuess = (game, guess) => { //throws error if guess is invalid in form
    Mastermind.validateCode(game, guess);
};

/**
 * Scores a player's guess against the secret code.
 *
 * @param {string[]} secretCode The hidden code.
 * @param {string[]} guess The player's guess.
 * @returns {{blackPegs: number, whitePegs: number}} An object containing the number of black and white pegs.
 */
Mastermind.scoreGuess = (
    secretCode,
    guess
) => {

    let numberBlackPegs = 0;
    let numberWhitePegs = 0;

    const remainingSecretCode = [];
    const remainingGuess = [];

    // First pass: Count and remove black pegs
    for (let i = 0; i < secretCode.length; i += 1) {
        if (guess[i] === secretCode[i]) {
            numberBlackPegs += 1;
        } else {
            remainingSecretCode.push(secretCode[i]); //only non-black part of secret code remains
            remainingGuess.push(guess[i]); //only non-black part of guess remains
        }
    }

    // Second pass: Count white pegs
    for (let i = 0; i < remainingGuess.length; i += 1) {
        const colourIndex = remainingSecretCode.indexOf(remainingGuess[i]); //compares each term in remaining guesses to remaining secret code, setting value to -1 if not found

        if (colourIndex !== -1) { // if a match is found at position i of remaining guess
            numberWhitePegs += 1; // number of white pegs increases by 1
            remainingSecretCode.splice(colourIndex, 1); // removes first matched colour from remaining secret code (to prevent double counting)
        }
    }

    return {
        blackPegs: numberBlackPegs,
        whitePegs: numberWhitePegs
    };

};

/**
 * Determines whether the guesser's guess wins the game.
 * Guess is winning if number of black pegs == code length
 *
 * @param {object} game The current game state.
 * @param {string[]} guess The player's guess.
 * @returns {boolean} True if the guess is winning, false otherwise.
 */
Mastermind.isWinningGuess = (game, guess) => { // checks if guess is winning
    const score = Mastermind.scoreGuess(game.secretCode, guess);

    return score.blackPegs === game.codeLength;
};

/**
 * Determines whether the game has ended.
 *
 * The game is over if the codebreaker has guessed the
 * secret code or if no attempts remain.
 *
 * @param {object} game The current game state.
 * @returns {boolean} True if the game is over, false otherwise.
 */
Mastermind.isGameOver = (game) => { // checks if game is over
    return game.winner === true || game.attemptsRemaining <= 0; // if codebreaker has won or there are no attempts left the game is over
};

/**
 * Processes a player's guess and updates the game state.
 *
 * Validates the guess, scores it against the secret code,
 * stores the guess history, updates the remaining attempts,
 * and determines whether the game has ended.
 *
 * @param {object} game The current game state.
 * @param {string[]} guess The player's guess.
 * @returns {{blackPegs: number, whitePegs: number}}
 * An object containing the score for the guess.
 * @throws {Error} If the game is already over.
 * @throws {Error} If the guess is invalid.
 */
Mastermind.makeGuess = (game, guess) => { // main function to make a guess, calls other functions to validate, score and check if game is over

    // stop guesses after game has ended
    if (Mastermind.isGameOver(game)) {
        throw new Error(`Game is already over.`);
    }

    // validate guess, throws error if invalid
    Mastermind.validateGuess(game, guess);

    // score guess
    const score = Mastermind.scoreGuess(game.secretCode, guess);

    // store guess history
    game.guesses.push({
        guess,
        score
    });

    // update attempts
    game.attemptsMade += 1;
    game.attemptsRemaining -= 1;

    // update winner state
    if (Mastermind.isWinningGuess(game, guess)) {
        game.winner = true;
    }

    // check if game is over
    if (Mastermind.isGameOver(game)) {
        game.gameOver = true;
    }

    // if game is over and codebreaker hasn't won, they have lost
    if (game.gameOver && game.winner !== true) {
        game.winner = false;
    }



    return score;
};

export default Object.freeze(Mastermind);