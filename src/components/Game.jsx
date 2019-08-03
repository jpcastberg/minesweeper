import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';

import Status from './Status';
import Board from './Board';
import Settings from './Settings';

import { GlobalStyle, AppContainer, GameContainer } from '../styles/gameStyles';

import generateNewGameState from '../lib/generateNewGameState';

class Game extends Component {
  constructor() {
    super();
    this.state = generateNewGameState();
    this.handleTileClickAt = this.handleTileClickAt.bind(this);
    this.toggleFlagAt = this.toggleFlagAt.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { timeElapsedSinceGameStart } = prevState;
    const {
      state: {
        countOfUnrevealedSafeTiles,
        mineWasTriggered,
        gameIsOver,
        timeElapsedInterval,
      },
    } = this;
    if (timeElapsedSinceGameStart === 998) {
      clearInterval(timeElapsedInterval);
    }
    if (!gameIsOver && countOfUnrevealedSafeTiles === 0) {
      this.endGame({ playerDidWin: true });
    } else if (!gameIsOver && mineWasTriggered) {
      this.endGame({ playerDidWin: false });
    }
  }

  getMineIds() {
    const { state: { tileData, boardHeight, boardWidth } } = this;
    const mineIds = [];
    for (let i = 0; i < boardHeight; i += 1) {
      for (let j = 0; j < boardWidth; j += 1) {
        const currentId = `${i},${j}`;
        if (tileData[currentId].isMine) mineIds.push(currentId);
      }
    }
    return mineIds;
  }

  getTileIdsToRevealAround(id) {
    const { state: { tileData } } = this;
    const tileIds = [];
    const seen = { [id]: { hasBeenProcessed: true } };
    const queue = [];
    this.forEachTileAround(id, (surroundingTile) => {
      if (!tileData[surroundingTile.id].isRevealed) {
        queue.push(surroundingTile.id);
        seen[surroundingTile.id] = { hasBeenProcessed: false };
      }
    });
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!seen[currentId].hasBeenProcessed) {
        if (
          !tileData[currentId].isMine
          && !tileData[currentId].isFlagged
          && !tileData[currentId].isRevealed
        ) {
          tileIds.push(currentId);
        }
        if (tileData[currentId].adjacentMineCount === 0) {
          this.forEachTileAround(currentId, (surroundingTile) => {
            if (!seen[surroundingTile.id]) {
              queue.push(surroundingTile.id);
              seen[surroundingTile.id] = { hasBeenProcessed: false };
            }
          });
        }
        seen[currentId].hasBeenProcessed = true;
      }
    }
    return tileIds;
  }

  forEachTileAround(id, cb) {
    const { state: { tileData } } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    const validSurroundingTiles = [];
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const currentId = `${rowIdx + i},${colIdx + j}`;
        if ((i !== 0 || j !== 0) && this.isValidId(currentId)) {
          validSurroundingTiles.push(tileData[currentId]);
        }
      }
    }
    validSurroundingTiles.forEach(cb);
  }

  async handleTileClickAt(clickedId) {
    const { state: { gameIsInProgress, gameIsOver } } = this;
    if (!gameIsInProgress && gameIsOver) return;
    if (!gameIsInProgress) {
      this.startGame();
      await this.populateMinesAround(clickedId);
    }
    const { state: { tileData } } = this;
    const clickedTile = tileData[clickedId];
    if (clickedTile.isRevealed || clickedTile.isFlagged) return;
    const tileIdsToReveal = [clickedId];
    if (clickedTile.isMine) {
      await this.triggerMineAt(clickedId);
      const mineIds = this.getMineIds();
      mineIds.forEach((mineId) => {
        const currentMine = tileData[mineId];
        if (mineId === clickedId || currentMine.isFlagged) return;
        tileIdsToReveal.push(mineId);
      });
    } else if (clickedTile.adjacentMineCount === 0) {
      const surroundingTileIdsToReveal = this.getTileIdsToRevealAround(clickedId);
      surroundingTileIdsToReveal.forEach((tileId) => {
        tileIdsToReveal.push(tileId);
      });
    }
    this.revealTiles(tileIdsToReveal);
  }

  isValidId(id) {
    const { state: { boardHeight, boardWidth } } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    return (rowIdx >= 0 && rowIdx < boardHeight && colIdx >= 0 && colIdx < boardWidth);
  }

  populateMinesAround(clickedId) {
    const {
      state: {
        tileData, boardHeight, boardWidth, numberOfMines,
      },
    } = this;
    const offLimitsToMines = { [clickedId]: true };
    if ((boardHeight * boardWidth) - numberOfMines >= 9) {
      this.forEachTileAround(clickedId, (surroundingTile) => {
        offLimitsToMines[surroundingTile.id] = true;
      });
    }
    const getRandomId = () => {
      const getRandomInt = max => (Math.floor(Math.random() * max));
      return `${getRandomInt(boardHeight)},${getRandomInt(boardWidth)}`;
    };
    const updatedTileData = {};
    for (let minesPlaced = 1; minesPlaced <= numberOfMines; minesPlaced += 1) {
      let idAtWhichToPlaceMine;
      // Attempt to place the mine randomly
      for (let attemptCount = 0; attemptCount <= 10 && !idAtWhichToPlaceMine; attemptCount += 1) {
        const randomId = getRandomId();
        if (
          !offLimitsToMines[randomId]
          && (!updatedTileData[randomId]
          || !updatedTileData[randomId].isMine)
        ) {
          idAtWhichToPlaceMine = randomId;
        }
      }
      // If 10 random attempts fail, place mine at first open space on board
      if (!idAtWhichToPlaceMine) {
        for (let i = 0; i < boardHeight && !idAtWhichToPlaceMine; i += 1) {
          for (let j = 0; j < boardWidth && !idAtWhichToPlaceMine; j += 1) {
            const currentId = `${i},${j}`;
            if (
              (!updatedTileData[currentId] || !updatedTileData[currentId].isMine)
              && !offLimitsToMines[currentId]
            ) {
              idAtWhichToPlaceMine = currentId;
            }
          }
        }
      }
      updatedTileData[idAtWhichToPlaceMine] = {
        ...updatedTileData[idAtWhichToPlaceMine] || tileData[idAtWhichToPlaceMine],
        isMine: true,
        isTriggeredMine: false,
      };
      this.forEachTileAround(idAtWhichToPlaceMine, (surroundingTile) => {
        const existingTileData = updatedTileData[surroundingTile.id]
        || tileData[surroundingTile.id];
        updatedTileData[surroundingTile.id] = {
          ...existingTileData,
          adjacentMineCount: existingTileData.adjacentMineCount + 1,
        };
      });
    }
    return new Promise((res) => {
      this.setState({
        tileData: {
          ...tileData,
          ...updatedTileData,
        },
      }, () => res());
    });
  }

  revealTiles(idList) {
    const { state: { countOfUnrevealedSafeTiles, tileData: existingTileData } } = this;
    const newState = {
      countOfUnrevealedSafeTiles,
      tileData: { ...existingTileData },
    };
    let countOfSafeTilesRevealed = 0;
    idList.forEach((id) => {
      const currentTile = existingTileData[id];
      newState.tileData[id] = { ...currentTile, isRevealed: true };
      if (!currentTile.isMine) countOfSafeTilesRevealed += 1;
    });
    newState.countOfUnrevealedSafeTiles = countOfUnrevealedSafeTiles - countOfSafeTilesRevealed;
    this.setState(newState);
  }

  toggleFlagAt(clickedId) {
    const { state: { tileData: { [clickedId]: { isRevealed } } } } = this;
    if (isRevealed) return;
    this.setState((state) => {
      const { tileData, tileData: { [clickedId]: { isFlagged } } } = state;
      if (isFlagged) {
        this.incrementOrDecrementFlagsPlaced({ decrement: true });
      } else {
        this.incrementOrDecrementFlagsPlaced({ increment: true });
      }
      return ({
        tileData: {
          ...tileData,
          [clickedId]: {
            ...tileData[clickedId],
            isFlagged: !isFlagged,
          },
        },
      });
    });
  }

  triggerMineAt(clickedId) {
    return new Promise((res) => {
      this.setState((state) => {
        const { tileData } = state;
        return ({
          mineWasTriggered: true,
          tileData: {
            ...tileData,
            [clickedId]: {
              ...tileData[clickedId],
              isTriggeredMine: true,
            },
          },
        });
      }, () => res());
    });
  }

  endGame(context) {
    const { state: { timeElapsedInterval } } = this;
    const newState = {
      gameIsInProgress: false,
      gameIsOver: true,
    };
    if (context.playerDidWin) {
      newState.playerWon = true;
    }
    clearInterval(timeElapsedInterval);
    this.setState(newState);
  }

  incrementOrDecrementFlagsPlaced(context) {
    if (context.increment) {
      this.setState(state => ({ flagsPlaced: state.flagsPlaced + 1 }));
    } else if (context.decrement) {
      this.setState(state => ({ flagsPlaced: state.flagsPlaced - 1 }));
    }
  }

  startGame() {
    const timeElapsedInterval = setInterval(() => {
      this.setState(state => ({
        timeElapsedSinceGameStart: state.timeElapsedSinceGameStart + 1,
      }));
    }, 1000);
    this.setState({
      timeElapsedInterval,
      gameIsInProgress: true,
    });
  }

  resetGame(newBoardHeight, newBoardWidth, newNumberOfMines) {
    const {
      state: {
        boardHeight: oldBoardHeight,
        boardWidth: oldBoardWidth,
        numberOfMines: oldNumberOfMines,
      },
    } = this;
    const { state: { timeElapsedInterval } } = this;
    clearInterval(timeElapsedInterval);
    const newState = generateNewGameState(
      newBoardHeight || oldBoardHeight,
      newBoardWidth || oldBoardWidth,
      newNumberOfMines || oldNumberOfMines,
    );
    this.setState(newState);
  }

  render() {
    const {
      state: {
        boardHeight,
        boardWidth,
        numberOfMines,
        tileData,
        timeElapsedSinceGameStart,
        gameIsOver,
        playerWon,
        flagsPlaced,
      },
      handleTileClickAt,
      toggleFlagAt,
      resetGame,
    } = this;
    return (
      <>
        <GlobalStyle />
        <AppContainer>
          <GameContainer>
            <Status
              timeElapsedSinceGameStart={timeElapsedSinceGameStart}
              flagsToBePlaced={numberOfMines - flagsPlaced}
              gameIsOver={gameIsOver}
              playerWon={playerWon}
              resetGame={resetGame}
            />
            <Board
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              tileData={tileData}
              handleTileClickAt={handleTileClickAt}
              toggleFlagAt={toggleFlagAt}
            />
            <Settings
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              numberOfMines={numberOfMines}
              resetGame={resetGame}
            />
          </GameContainer>
        </AppContainer>
      </>
    );
  }
}

export default Game;
