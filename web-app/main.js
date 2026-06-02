import Mastermind from "./Mastermind.js";

let game = Mastermind.createGame();

let currentSecretSelection = [];

let currentGuessSelection = [];

const codeSetterScreen = document.getElementById(
    "code-setter-screen"
);

const transitionScreen = document.getElementById(
    "transition-screen"
);

const codeBreakerScreen = document.getElementById(
    "code-breaker-screen"
);

const secretPreview = document.getElementById(
    "secret-preview"
);

const guessPreview = document.getElementById(
    "guess-preview"
);

const gameMessage = document.getElementById(
    "game-message"
);

const attemptsRemaining = document.getElementById(
    "attempts-remaining"
);

const guessHistory = document.getElementById(
    "guess-history"
);

const renderPegs = (container, colours) => {

    container.innerHTML = "";

    colours.forEach((colour) => {

        const peg = document.createElement("div");

        peg.classList.add("peg");

        peg.classList.add(colour);

        container.appendChild(peg);

    });

};

const addSecretColour = (colour) => {

    if (currentSecretSelection.length >= 4) {
        return;
    }

    currentSecretSelection.push(colour);

    renderPegs(
        secretPreview,
        currentSecretSelection
    );

};

const addGuessColour = (colour) => {

    if (currentGuessSelection.length >= 4) {
        return;
    }

    currentGuessSelection.push(colour);

    renderPegs(
        guessPreview,
        currentGuessSelection
    );

};

document.querySelectorAll(
    "#code-setter-screen .colour-button"
).forEach((button) => {

    button.addEventListener("click", () => {

        addSecretColour(
            button.dataset.colour
        );

    });

});

document.querySelectorAll(
    "#code-breaker-screen .colour-button"
).forEach((button) => {

    button.addEventListener("click", () => {

        addGuessColour(
            button.dataset.colour
        );

    });

});

document.getElementById(
    "secret-clear-button"
).addEventListener("click", () => {

    currentSecretSelection = [];

    renderPegs(
        secretPreview,
        currentSecretSelection
    );

});

document.getElementById(
    "guess-clear-button"
).addEventListener("click", () => {

    currentGuessSelection = [];

    renderPegs(
        guessPreview,
        currentGuessSelection
    );

});

document.getElementById(
    "secret-confirm-button"
).addEventListener("click", () => {

    if (currentSecretSelection.length !== 4) {

        gameMessage.textContent =
            "Secret code must contain 4 colours.";

        return;

    }

    try {

        Mastermind.setSecretCode(
            game,
            currentSecretSelection
        );

        codeSetterScreen.classList.add(
            "hidden"
        );

        transitionScreen.classList.remove(
            "hidden"
        );

    } catch (error) {

        gameMessage.textContent =
            error.message;

    }

});

document.getElementById(
    "start-game-button"
).addEventListener("click", () => {

    transitionScreen.classList.add(
        "hidden"
    );

    codeBreakerScreen.classList.remove(
        "hidden"
    );

});

document.getElementById(
    "submit-guess-button"
).addEventListener("click", () => {

    if (currentGuessSelection.length !== 4) {

        gameMessage.textContent =
            "Guess must contain 4 colours.";

        return;

    }

    try {

        const score = Mastermind.makeGuess(
            game,
            currentGuessSelection
        );

        attemptsRemaining.textContent =
            game.attemptsRemaining;

        const guessEntry =
            document.createElement("div");

        guessEntry.classList.add(
            "guess-entry"
        );

        guessEntry.textContent =
            `Guess: ${currentGuessSelection.join(", ")} | ` +
            `Black Pegs: ${score.blackPegs} | ` +
            `White Pegs: ${score.whitePegs}`;

        guessHistory.prepend(
            guessEntry
        );

        currentGuessSelection = [];

        renderPegs(
            guessPreview,
            currentGuessSelection
        );

        if (game.winner === true) {

            gameMessage.textContent =
                "CODEBREAKER WINS";

        } else if (game.winner === false) {

            gameMessage.textContent =
                `CODEBREAKER LOSES - Secret code was: ${game.secretCode.join(", ")}`;

        } else {

            gameMessage.textContent =
                `Black Pegs: ${score.blackPegs}, ` +
                `White Pegs: ${score.whitePegs}`;

        }

    } catch (error) {

        gameMessage.textContent =
            error.message;

    }
});
document.getElementById("reset-button").addEventListener("click", () => {

    game = Mastermind.resetGame();

    currentSecretSelection = [];
    currentGuessSelection = [];

    renderPegs(secretPreview, []);
    renderPegs(guessPreview, []);

    guessHistory.innerHTML = "";

    gameMessage.textContent = "";

    attemptsRemaining.textContent = "10";

    codeBreakerScreen.classList.add("hidden");
    transitionScreen.classList.add("hidden");
    codeSetterScreen.classList.remove("hidden");

});