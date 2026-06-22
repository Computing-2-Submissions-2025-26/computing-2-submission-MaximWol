import Mastermind from "./Mastermind.js";

let game = Mastermind.createGame();

let currentSecretSelection = [];
let currentGuessSelection = [];
/* ---------- Win Pop Up ---------- */
const gameOverOverlay =
    document.getElementById(
        "game-over-overlay"
    );

const winnerText =
    document.getElementById(
        "winner-text"
    );

    document.getElementById(
    "close-game-over"
).addEventListener(
    "click",
    () => {

        gameOverOverlay.classList.add(
            "hidden"
        );

    }
);
/* ---------- Elements ---------- */

const codeSetterScreen =
    document.getElementById(
        "code-setter-screen"
    );

const transitionScreen =
    document.getElementById(
        "transition-screen"
    );

const codeBreakerScreen =
    document.getElementById(
        "code-breaker-screen"
    );

const secretPreview =
    document.getElementById(
        "secret-preview"
    );

const guessPreview =
    document.getElementById(
        "guess-preview"
    );

const gameMessage =
    document.getElementById(
        "game-message"
    );

const attemptsRemaining =
    document.getElementById(
        "attempts-remaining"
    );

const guessHistory =
    document.getElementById(
        "guess-history"
    );

/* ---------- Rules ---------- */

const rulesOverlay =
    document.getElementById(
        "rules-overlay"
    );

document.getElementById(
    "rules-toggle"
).addEventListener("click", () => {

    rulesOverlay.classList.remove(
        "hidden"
    );

});

document.getElementById(
    "rules-close-button"
).addEventListener("click", () => {

    rulesOverlay.classList.add(
        "hidden"
    );

});

/* ---------- Colourblind ---------- */

document.getElementById(
    "colourblind-toggle"
).addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "colourblind"
        );

    }
);

/* ---------- Rendering ---------- */

function renderPegs(
    container,
    colours
) {

    container.innerHTML = "";

    colours.forEach(
        (colour) => {

            const peg =
                document.createElement(
                    "div"
                );

            peg.classList.add(
                "peg",
                colour
            );

            const label =
                document.createElement(
                    "span"
                );

            label.classList.add(
                "colour-label"
            );

            label.textContent =
                colour[0].toUpperCase();

            peg.appendChild(
                label
            );

            container.appendChild(
                peg
            );

        }
    );
}

/* ---------- Secret Code ---------- */

function addSecretColour(
    colour
) {

    if (
        currentSecretSelection.length >= 4
    ) {
        return;
    }

    currentSecretSelection.push(
        colour
    );

    renderPegs(
        secretPreview,
        currentSecretSelection
    );

}

/* ---------- Guess ---------- */

function addGuessColour(
    colour
) {

    if (
        currentGuessSelection.length >= 4
    ) {
        return;
    }

    currentGuessSelection.push(
        colour
    );

    renderPegs(
        guessPreview,
        currentGuessSelection
    );

}

/* ---------- Colour Buttons ---------- */

document.querySelectorAll(
    "#code-setter-screen .colour-button"
).forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            addSecretColour(
                button.dataset.colour
            );

        }
    );

});

document.querySelectorAll(
    "#code-breaker-screen .colour-button"
).forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            addGuessColour(
                button.dataset.colour
            );

        }
    );

});

/* ---------- Clear Buttons ---------- */

document.getElementById(
    "secret-clear-button"
).addEventListener(
    "click",
    () => {

        currentSecretSelection = [];

        renderPegs(
            secretPreview,
            []
        );

    }
);

document.getElementById(
    "guess-clear-button"
).addEventListener(
    "click",
    () => {

        currentGuessSelection = [];

        renderPegs(
            guessPreview,
            []
        );

    }
);

/* ---------- Confirm Secret ---------- */

document.getElementById(
    "secret-confirm-button"
).addEventListener(
    "click",
    () => {

        if (
            currentSecretSelection.length !== 4
        ) {

            gameMessage.textContent =
                "Select 4 colours.";

            return;
        }

        try {

            game =
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

            gameMessage.textContent = "";

        } catch (error) {

            gameMessage.textContent =
                error.message;

        }

    }
);

/* ---------- Transition ---------- */

document.getElementById(
    "start-game-button"
).addEventListener(
    "click",
    () => {

        transitionScreen.classList.add(
            "hidden"
        );

        codeBreakerScreen.classList.remove(
            "hidden"
        );

    }
);

/* ---------- Submit Guess ---------- */

document.getElementById(
    "submit-guess-button"
).addEventListener(
    "click",
    () => {

        if (
            currentGuessSelection.length !== 4
        ) {

            gameMessage.textContent =
                "Select 4 colours.";

            return;
        }

        try {

            const result =
                Mastermind.makeGuess(
                    game,
                    currentGuessSelection
                );

            game =
                result.game;

            const score =
                result.score;

            attemptsRemaining.textContent =
                game.attemptsRemaining;

            const row =
                document.createElement(
                    "div"
                );

            row.classList.add(
                "guess-entry"
            );

            const guessRow =
                document.createElement(
                    "div"
                );

            guessRow.classList.add(
                "board-row"
            );

            currentGuessSelection.forEach(
                (colour) => {

                    const peg =
                        document.createElement(
                            "div"
                        );

                    peg.classList.add(
                        "peg",
                        colour
                    );

                    guessRow.appendChild(
                        peg
                    );

                }
            );

            const feedback =
                document.createElement(
                    "div"
                );

            feedback.classList.add(
                "feedback-area"
            );

            for (
                let i = 0;
                i < score.blackPegs;
                i += 1
            ) {

                const peg =
                    document.createElement(
                        "div"
                    );

                peg.classList.add(
                    "feedback-peg",
                    "feedback-black"
                );

                feedback.appendChild(
                    peg
                );

            }

            for (
                let i = 0;
                i < score.whitePegs;
                i += 1
            ) {

                const peg =
                    document.createElement(
                        "div"
                    );

                peg.classList.add(
                    "feedback-peg",
                    "feedback-white"
                );

                feedback.appendChild(
                    peg
                );

            }

            row.appendChild(
                guessRow
            );

            row.appendChild(
                feedback
            );

            guessHistory.prepend(
                row
            );

            currentGuessSelection = [];

            renderPegs(
                guessPreview,
                []
            );

            if (game.winner === true) {

                winnerText.textContent = "CODEBREAKER WINS";

                gameOverOverlay.classList.remove("hidden");

            } else if (game.winner === false) {

                winnerText.textContent = "CODEBREAKER LOSES";

                gameOverOverlay.classList.remove("hidden");

            } else {

                gameMessage.textContent = "";

            }

        } catch (error) {

            gameMessage.textContent =
                error.message;

        }

    }
);

/* ---------- Reset ---------- */

document.getElementById(
    "reset-button"
).addEventListener(
    "click",
    () => {

        game =
            Mastermind.resetGame();

        currentSecretSelection = [];
        currentGuessSelection = [];

        renderPegs(
            secretPreview,
            []
        );

        renderPegs(
            guessPreview,
            []
        );

        guessHistory.innerHTML = "";

        gameMessage.textContent = "";

        attemptsRemaining.textContent =
            "10";

        codeBreakerScreen.classList.add(
            "hidden"
        );

        transitionScreen.classList.add(
            "hidden"
        );

        codeSetterScreen.classList.remove(
            "hidden"
        );

    }
);