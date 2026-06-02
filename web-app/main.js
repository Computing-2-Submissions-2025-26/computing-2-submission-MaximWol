import R from "./ramda.js";


import Mastermind from "./Mastermind.js";

const game = Mastermind.createGame();

const gameMessage = document.getElementById(
    "game-message"
);

const attemptsRemaining = document.getElementById(
    "attempts-remaining"
);

const guessHistory = document.getElementById(
    "guess-history"
);

const setSecretButton = document.getElementById(
    "set-secret-button"
);

const submitGuessButton = document.getElementById(
    "submit-guess-button"
);

const renderGuessHistory = () => {

    guessHistory.innerHTML = "";

    game.guesses.forEach((entry, index) => {

        const guessDiv = document.createElement("div");

        guessDiv.textContent =
            `Guess ${index + 1}: ` +
            `${entry.guess.join(", ")} | ` +
            `Black Pegs: ${entry.score.blackPegs}, ` +
            `White Pegs: ${entry.score.whitePegs}`;

        guessHistory.appendChild(guessDiv);

    });

};

setSecretButton.addEventListener("click", () => {

    const secretCode = [
        document.getElementById("secret-1").value,
        document.getElementById("secret-2").value,
        document.getElementById("secret-3").value,
        document.getElementById("secret-4").value
    ];

    try {

        Mastermind.setSecretCode(
            game,
            secretCode
        );

        gameMessage.textContent =
            "Secret code set successfully.";

        document.getElementById(
            "secret-code-inputs"
        ).style.display = "none";

        setSecretButton.style.display = "none";

    } catch (error) {

        gameMessage.textContent = error.message;

    }

});

submitGuessButton.addEventListener("click", () => {

    if (game.secretCode.length === 0) {

        gameMessage.textContent =
            "Set the secret code first.";

        return;

    }

    const guess = [
        document.getElementById("guess-1").value,
        document.getElementById("guess-2").value,
        document.getElementById("guess-3").value,
        document.getElementById("guess-4").value
    ];

    try {

        const score = Mastermind.makeGuess(
            game,
            guess
        );

        attemptsRemaining.textContent =
            game.attemptsRemaining;

        gameMessage.textContent =
            `Black Pegs: ${score.blackPegs}, ` +
            `White Pegs: ${score.whitePegs}`;

        renderGuessHistory();

        if (game.winner === true) {

            gameMessage.textContent =
                "Codebreaker wins!";

        }

        if (game.winner === false) {

            gameMessage.textContent =
                "Codebreaker loses!";

        }

    } catch (error) {

        gameMessage.textContent = error.message;

    }

});