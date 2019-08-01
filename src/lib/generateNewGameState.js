const generateNewGameState = (boardHeight = 20, boardWidth = 20, numberOfMines = 10) => {
  const tileData = {};
  const countOfUnrevealedSafeTiles = (boardHeight * boardWidth) - numberOfMines;
  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      const currentId = `${i},${j}`;
      tileData[currentId] = {
        id: currentId,
        isRevealed: false,
        isMine: false,
        isTriggeredMine: false,
        isFlagged: false,
        adjacentMineCount: 0,
      };
    }
  }
  return {
    boardHeight,
    boardWidth,
    numberOfMines,
    tileData,
    countOfUnrevealedSafeTiles,
    flagsPlaced: 0,
    mineWasTriggered: false,
    timeElapsedSinceGameStart: 0,
    timeElapsedInterval: null,
    gameIsInProgress: false,
    gameIsOver: false,
    playerWon: false,
  };
};

export default generateNewGameState;
