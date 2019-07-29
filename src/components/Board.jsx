import React, { Component } from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';

import Tile from './Tile';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = this.generateInitialState();
    this.handleTileClick = this.handleTileClick.bind(this);
    this.toggleFlagAt = this.toggleFlagAt.bind(this);
  }

  componentDidUpdate() {
    const {
      state: { countOfUnrevealedSafeTiles, mineWasTriggered },
      props: { gameIsOver, endGame },
    } = this;
    if (!gameIsOver && countOfUnrevealedSafeTiles === 0) {
      endGame({ playerDidWin: true });
    } else if (!gameIsOver && mineWasTriggered) {
      endGame({ playerDidWin: false });
    }
  }

  getRandomId() {
    const { props: { boardHeight, boardWidth } } = this;
    const getRandomInt = max => (Math.floor(Math.random() * max));
    return `${getRandomInt(boardHeight)},${getRandomInt(boardWidth)}`;
  }

  getMineIds() {
    const { state, props: { boardHeight, boardWidth } } = this;
    const mineIds = [];
    for (let i = 0; i < boardHeight; i += 1) {
      for (let j = 0; j < boardWidth; j += 1) {
        const currentId = `${i},${j}`;
        if (state[currentId].isMine) mineIds.push(currentId);
      }
    }
    return mineIds;
  }

  getTileIdsToRevealAround(id) {
    const { state } = this;
    const tileIds = [];
    const seen = { [id]: { hasBeenProcessed: true } };
    const queue = [];
    this.forEachTileAround(id, (surroundingTile) => {
      if (!state[surroundingTile.id].isRevealed) {
        queue.push(surroundingTile.id);
        seen[surroundingTile.id] = { hasBeenProcessed: false };
      }
    });
    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!seen[currentId].hasBeenProcessed) {
        if (
          !state[currentId].isMine
          && !state[currentId].isFlagged
          && !state[currentId].isRevealed
        ) {
          tileIds.push(currentId);
        }
        if (state[currentId].adjacentMineCount === 0) {
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
    const { state } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    const validSurroundingTiles = [];
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const currentId = `${rowIdx + i},${colIdx + j}`;
        if ((i !== 0 || j !== 0) && this.isValidId(currentId)) {
          validSurroundingTiles.push(state[currentId]);
        }
      }
    }
    validSurroundingTiles.forEach(cb);
  }

  generateTileElements() {
    const {
      props: { boardHeight, boardWidth }, state, handleTileClick, toggleFlagAt,
    } = this;
    const tiles = [];
    for (let rowIdx = 0; rowIdx < boardHeight; rowIdx += 1) {
      const tileIds = [];
      const tileRow = [];
      for (let colIdx = 0; colIdx < boardWidth; colIdx += 1) {
        const id = `${rowIdx},${colIdx}`;
        tileIds.push(id);
        const currentTile = state[id];
        const {
          isRevealed, isMine, isFlagged, adjacentMineCount, mineWasTriggered,
        } = currentTile;
        tileRow.push((
          <Tile
            key={id}
            isRevealed={isRevealed}
            isMine={isMine}
            isTriggeredMine={mineWasTriggered || false}
            isFlagged={isFlagged}
            adjacentMineCount={adjacentMineCount}
            handleTileClick={() => handleTileClick(id)}
            toggleFlag={() => toggleFlagAt(id)}
          />
        ));
      }
      tiles.push(<tr key={tileIds.toString()}>{tileRow}</tr>);
    }
    return tiles;
  }

  async handleTileClick(clickedId) {
    const {
      props: {
        gameIsInProgress, startGame, gameIsOver,
      },
    } = this;
    if (!gameIsInProgress && gameIsOver) return;
    if (!gameIsInProgress) {
      startGame();
      await this.populateMinesAround(clickedId);
    }
    const { state } = this;
    const clickedTile = state[clickedId];
    if (clickedTile.isRevealed || clickedTile.isFlagged) return;
    const tileIdsToReveal = [clickedId];
    if (clickedTile.isMine) {
      await this.triggerMineAt(clickedId);
      const mineIds = this.getMineIds();
      mineIds.forEach((mineId) => {
        const currentMine = state[mineId];
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

  generateInitialState() {
    const { props: { boardHeight, boardWidth, numberOfMines } } = this;
    const tileData = {};
    const countOfUnrevealedSafeTiles = (boardHeight * boardWidth) - numberOfMines;
    for (let i = 0; i < boardHeight; i += 1) {
      for (let j = 0; j < boardWidth; j += 1) {
        const currentId = `${i},${j}`;
        tileData[currentId] = {
          id: currentId,
          isRevealed: false,
          isMine: false,
          isFlagged: false,
          adjacentMineCount: 0,
        };
      }
    }
    return {
      ...tileData,
      countOfUnrevealedSafeTiles,
      mineWasTriggered: false,
    };
  }

  isValidId(id) {
    const { props: { boardHeight, boardWidth } } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    return (rowIdx >= 0 && rowIdx < boardHeight && colIdx >= 0 && colIdx < boardWidth);
  }

  populateMinesAround(clickedId) {
    const { state, props: { boardHeight, boardWidth, numberOfMines } } = this;
    const offLimitsToMines = { [clickedId]: true };
    if ((boardHeight * boardWidth) - numberOfMines >= 9) {
      this.forEachTileAround(clickedId, (surroundingTile) => {
        offLimitsToMines[surroundingTile.id] = true;
      });
    }
    const updatedMineData = {};
    for (let minesPlaced = 1; minesPlaced <= numberOfMines; minesPlaced += 1) {
      let idAtWhichToPlaceMine;
      // Attempt to place the mine randomly
      for (let attemptCount = 0; attemptCount <= 10 && !idAtWhichToPlaceMine; attemptCount += 1) {
        const randomId = this.getRandomId();
        if (
          !offLimitsToMines[randomId]
          && (!updatedMineData[randomId]
          || !updatedMineData[randomId].isMine)
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
              (!updatedMineData[currentId] || !updatedMineData[currentId].isMine)
              && !offLimitsToMines[currentId]
            ) {
              idAtWhichToPlaceMine = currentId;
            }
          }
        }
      }
      updatedMineData[idAtWhichToPlaceMine] = {
        ...updatedMineData[idAtWhichToPlaceMine] || state[idAtWhichToPlaceMine],
        isMine: true,
        mineWasTriggered: false,
      };
      this.forEachTileAround(idAtWhichToPlaceMine, (surroundingTile) => {
        const existingTileData = updatedMineData[surroundingTile.id]
        || state[surroundingTile.id];
        updatedMineData[surroundingTile.id] = {
          ...existingTileData,
          adjacentMineCount: existingTileData.adjacentMineCount + 1,
        };
      });
    }
    return new Promise((res) => {
      this.setState({ ...updatedMineData }, () => res());
    });
  }

  revealTiles(idList) {
    const { state, state: { countOfUnrevealedSafeTiles } } = this;
    const newState = {};
    let countOfSafeTilesRevealed = 0;
    idList.forEach((id) => {
      const currentTile = state[id];
      newState[id] = { ...state[id], isRevealed: true };
      if (!currentTile.isMine) countOfSafeTilesRevealed += 1;
    });
    newState.countOfUnrevealedSafeTiles = countOfUnrevealedSafeTiles - countOfSafeTilesRevealed;
    this.setState({ ...newState });
  }

  toggleFlagAt(id) {
    this.setState(state => ({
      [id]: {
        ...state[id],
        isFlagged: !state[id].isFlagged,
      },
    }));
  }

  triggerMineAt(clickedId) {
    return new Promise((res) => {
      this.setState(state => ({
        mineWasTriggered: true,
        [clickedId]: {
          ...state[clickedId],
          mineWasTriggered: true,
        },
      }), () => res());
    });
  }

  render() {
    return (
      <table>
        <tbody>
          {this.generateTileElements()}
        </tbody>
      </table>
    );
  }
}

Board.propTypes = {
  boardHeight: propTypes.number.isRequired,
  boardWidth: propTypes.number.isRequired,
  numberOfMines: propTypes.number.isRequired,
  gameIsInProgress: propTypes.bool.isRequired,
  gameIsOver: propTypes.bool.isRequired,
  startGame: propTypes.func.isRequired,
  endGame: propTypes.func.isRequired,
};

export default Board;
