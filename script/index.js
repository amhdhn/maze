let gameLevels = [
    { name: "easy", rowAndColumnNumber: 10 },
    { name: "hard", rowAndColumnNumber: 25 },
    { name: "difficult", rowAndColumnNumber: 50 }
];
const gameBoardContainer = document.querySelector(".gameBoardContainer");
let gameBoardElem = null;
const gameMobileControllContainer = document.querySelector(".gameMobileControllContainer");
const gameMenuContainer = document.querySelector(".gameMenuContainer");
const newGameButton = document.querySelector(".newGame");
const gameLevelSelect = document.querySelector(".gameLevel");
const upBotton = document.querySelector('.upBotton');
const leftButton = document.querySelector('.leftButton');
const downBotton = document.querySelector('.downBotton');
const rightButton = document.querySelector('.rightButton');
const gameFinishedModalContainer = document.querySelector(".gameFinishedModalContainer");
const playAgainButton = document.querySelector(".playAgain");
const returnHomeButton = document.querySelector(".returnHome");
const homeButton = document.querySelector(".home");

let gameLevelName = "easy";
let rowColumnNumber = 10;

let gameData = [];

let personElem = null;
let currentPostion = null;
let currentPostionStyle = null;
let currentX = 0;
let currentY = 0;


newGameButton.addEventListener("click", startNewGame);
gameLevelSelect.addEventListener("change", (event) => {
    let chiocedLevel = gameLevelSelect.value;
    gameLevels.some(level => {
        if (level.name === chiocedLevel) {
            gameLevelName = level.name;
            rowColumnNumber = level.rowAndColumnNumber;
            return true;
        }
    });
});
gameFinishedModalContainer.addEventListener("click", event => event.stopPropagation());
playAgainButton.addEventListener("click", playAgain);
returnHomeButton.addEventListener("click", goHome);
homeButton.addEventListener("click", goHome);


function startNewGame() {
    gameMenuContainer.style.display = "none";
    homeButton.classList.add("active");
    resetValues();
    generateGameBoard();
    generateGameData();
    generateGamePositions();
    generateGamePath();
    createPresonElement();
    createDoorElement();
    generateMobileButtons();

    currentPostion = document.querySelector(".dot0-0");
    currentPostionStyle = getComputedStyle(currentPostion);
    currentPostion.appendChild(personElem);
    // if a position have border can go to next step
    window.addEventListener("keyup", generateKeyMove);
}

function generateGameBoard() {
    gameBoardElem = document.createElement("div");
    gameBoardElem.className = `gameBoard ${gameLevelName}`;
    gameBoardContainer.appendChild(gameBoardElem);
}

function generateGameData() {
    gameData = [];
    for (let row = 0; row < rowColumnNumber; row++) {
        let columns = [];
        for (let column = 0; column < rowColumnNumber; column++) {
            columns.push(0);
        }
        gameData.push(columns);
    }
}

function generateGamePositions() {
    for (let row = 0; row < rowColumnNumber; row++) {
        for (let column = 0; column < rowColumnNumber; column++) {
            let gameCells = document.createElement("p");
            gameCells.classList.add("gameCell");
            gameCells.classList.add(`dot${row}-${column}`);
            gameCells.style.border = "2px solid #333";
            gameBoardElem.appendChild(gameCells);
        }
    }
}

function generateGamePath() {
    let row = 0;
    let column = 0;
    let reslutPath = [];
    gameData[row][column] = 1;
    reslutPath.push([row, column]);
    let reachEnd = false;
    while (true) {
        let possibelMove = [];

        possibelMove = generatePossibleMove(row, column);

        if (possibelMove.length > 0) {
            let rnd = generateRandomNumber(possibelMove.length);
            let nextStepRow = possibelMove[rnd][0];
            let nextStepColumn = possibelMove[rnd][1];
            // push next step in arrays
            reslutPath.push(possibelMove[rnd]);
            // save step number in gameData
            gameData[nextStepRow][nextStepColumn] = gameData[row][column] + 1;

            // check next step is in bottom/top or left/right
            // if row is eqaul next step is in side of current postion
            if (row === nextStepRow) {
                changeSideBorder(row, column, nextStepColumn);
            } else {
                changeUpDownBorder(row, column, nextStepRow);
            }

            // change row and column to next step
            row = nextStepRow;
            column = nextStepColumn;
        } else {
            // if there is no poosible move backward to before step
            reslutPath.pop();
            let previousRow = reslutPath[reslutPath.length - 1][0];
            let previousColumn = reslutPath[reslutPath.length - 1][1];
            row = previousRow;
            column = previousColumn;
        }

        // check we are in end postion
        if (row === rowColumnNumber - 1 && column === rowColumnNumber - 1) {
            reachEnd = true;
        }
        if (reachEnd) {
            if (row === 0 && column === 0) {
                return;
            }
        }
    }
}

function generatePossibleMove(row, column) {
    let moves = [];

    if (row > 0 && gameData[row - 1][column] === 0) {
        moves.push([row - 1, column])
    }
    if (row < rowColumnNumber - 1 && gameData[row + 1][column] === 0) {
        moves.push([row + 1, column])
    }
    if (column < rowColumnNumber - 1 && gameData[row][column + 1] === 0) {
        moves.push([row, column + 1])
    }
    if (column > 0 && gameData[row][column - 1] === 0) {
        moves.push([row, column - 1])
    }

    return moves;
}

function generateRandomNumber(max) {
    return Math.floor(Math.random() * max)
}

function changeSideBorder(row, column, nextColumn) {
    let currentPostion = document.querySelector(`.dot${row}-${column}`)
    let nextDot = document.querySelector(`.dot${row}-${nextColumn}`)
    if (column > nextColumn) {
        currentPostion.style.borderLeftColor = "transparent";
        nextDot.style.borderRightColor = "transparent";
    } else {
        currentPostion.style.borderRightColor = "transparent";
        nextDot.style.borderLeftColor = "transparent";
    }
}

function changeUpDownBorder(row, column, nextRow) {
    let currentPostion = document.querySelector(`.dot${row}-${column}`);
    let nextDot = document.querySelector(`.dot${nextRow}-${column}`);

    if (row > nextRow) {
        currentPostion.style.borderTopColor = "transparent";
        nextDot.style.borderBottomColor = "transparent";
    } else {
        currentPostion.style.borderBottomColor = "transparent";
        nextDot.style.borderTopColor = "transparent";
    }
}


function calculateZeroNumber() {
    for (let row = 0; row < rowColumnNumber; row++) {
        for (let column = 0; column < rowColumnNumber; column++) {

            if (gameData[row][column] === 0) {
                let possibelMove = [];
                possibelMove = generatePossibleMoveInZeroNumber(row, column);

                if (possibelMove.length > 0) {
                    let rnd = generateRandomNumber(possibelMove.length);
                    let nextStepRow = possibelMove[rnd][0];
                    let nextStepColumn = possibelMove[rnd][1];

                    gameData[row][column] = gameData[nextStepRow][nextStepColumn] + 1;

                    if (row === nextStepRow) {
                        changeSideBorder(row, column, nextStepColumn);
                    } else {
                        changeUpDownBorder(row, column, nextStepRow);
                    }
                }

            }

        }
    }

}

function generatePossibleMoveInZeroNumber(row, column) {
    let moves = [];
    if (row > 0 && gameData[row - 1][column] > 0) {
        moves.push([row - 1, column])
    }
    if (row < rowColumnNumber - 1 && gameData[row + 1][column] > 0) {
        moves.push([row + 1, column])
    }
    if (column < rowColumnNumber - 1 && gameData[row][column + 1] > 0) {
        moves.push([row, column + 1])
    }
    if (column > 0 && gameData[row][column - 1] > 0) {
        moves.push([row, column - 1])
    }
    return moves;
}

function createPresonElement() {
    personElem = document.createElement("img");
    personElem.classList.add("person");
    personElem.src = "./assets/person.svg";

}

function createDoorElement() {
    let doorElem = document.createElement("img");
    doorElem.classList.add("door");
    doorElem.src = "./assets/door.svg";

    let exitPosition = document.querySelector(`.dot${rowColumnNumber-1}-${rowColumnNumber-1}`);
    exitPosition.appendChild(doorElem);
}

function generateMobileButtons() {
    upBotton.addEventListener("click", goUp);
    leftButton.addEventListener("click", goLeft);
    downBotton.addEventListener("click", goDown);
    rightButton.addEventListener("click", goRight);
    gameMobileControllContainer.classList.add("active");
}

function removeMovileButtons() {
    upBotton.removeEventListener("click", goUp);
    leftButton.removeEventListener("click", goLeft);
    downBotton.removeEventListener("click", goDown);
    rightButton.removeEventListener("click", goRight);
    gameMobileControllContainer.classList.remove("active");
}

function goDown() {
    if (currentX === rowColumnNumber - 1 || currentPostionStyle.borderBottomColor != "rgba(0, 0, 0, 0)") {
        return;
    }
    let currentValue = gameData[currentX][currentY];
    let nextValue = gameData[currentX + 1][currentY];

    if (currentValue + 1 === nextValue ||
        currentValue - 1 === nextValue) {
        currentX++;
        changePersonPosition();
    }
}

function goUp() {
    if (currentX === 0 || currentPostionStyle.borderTopColor != "rgba(0, 0, 0, 0)") {
        return;
    }
    let currentValue = gameData[currentX][currentY];
    let nextValue = gameData[currentX - 1][currentY];
    if (currentValue + 1 === nextValue ||
        currentValue - 1 === nextValue) {
        currentX--;
        changePersonPosition();
    }
}

function goRight() {
    if (currentY === rowColumnNumber - 1 || currentPostionStyle.borderRightColor != "rgba(0, 0, 0, 0)") {
        return;
    }
    let currentValue = gameData[currentX][currentY];
    let nextValue = gameData[currentX][currentY + 1];
    if (currentValue + 1 === nextValue ||
        currentValue - 1 === nextValue) {
        currentY++;
        changePersonPosition();
    }
}

function goLeft() {
    if (currentY === 0 || currentPostionStyle.borderLeftColor != "rgba(0, 0, 0, 0)") {
        return;
    }
    let currentValue = gameData[currentX][currentY];
    let nextValue = gameData[currentX][currentY - 1];
    if (currentValue + 1 === nextValue ||
        currentValue - 1 === nextValue) {
        currentY--;
        changePersonPosition();
    }
}

function generateKeyMove(event) {
    let { key } = event;
    if (key === "ArrowRight") {
        goRight()
    } else
    if (key === "ArrowDown") {
        goDown();
    } else if (key === "ArrowUp") {
        goUp();
    } else
    if (key === "ArrowLeft") {
        goLeft();
    }
}

function changePersonPosition() {
    currentPostion.removeChild(currentPostion.lastChild);
    currentPostion = document.querySelector(`.dot${currentX}-${currentY}`);
    currentPostionStyle = getComputedStyle(currentPostion);
    currentPostion.appendChild(personElem);
    isGameFinished();
}

function isGameFinished() {
    if (currentX === rowColumnNumber - 1 && currentY === rowColumnNumber - 1) {
        window.removeEventListener("keyup", generateKeyMove);
        gameFinishedModalContainer.classList.add("active");
    }
}

function playAgain() {
    gameBoardContainer.removeChild(gameBoardElem);
    hideModal();
    startNewGame();
}

function goHome() {
    homeButton.classList.remove("active");
    hideModal();
    gameBoardContainer.removeChild(gameBoardElem);
    gameMenuContainer.style.display = "";
}

function resetValues() {
    personElem = null;
    currentPostion = null;
    currentPostionStyle = null;
    currentX = 0;
    currentY = 0;
}

function hideModal() {
    gameFinishedModalContainer.classList.remove("active");
}