import R from "./ramda.js";

const game = Mastermind.createGame();
game.secretCode = [ //sets secret code for testing purposes
    "red",
    "green",
    "blue",
    "blue"
];
const guess = [ //sets guess for testing purposes
    "red",
    "white",
    "red",
    "blue"
];
Mastermind.makeGuess(game, guess);

console.log(game.guesses);
console.log(Mastermind.scoreGuess(game.secretCode, guess));