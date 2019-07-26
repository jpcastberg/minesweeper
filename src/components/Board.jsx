import React, { Component } from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';

import Tile from './Tile';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeBoard();
    this.revealTile = this.revealTile.bind(this);
  }

  getRandomId() {
    const { props: { boardHeight, boardWidth } } = this;
    const getRandomInt = max => (Math.floor(Math.random() * max));
    return `${getRandomInt(boardHeight)},${getRandomInt(boardWidth)}`;
  }

  getTileIdsToRevealAround(id) {
    const { state: tileData } = this;
    const tileIds = [];
    const seen = { [id]: { hasBeenProcessed: true } };
    const queue = [];
    this.forEachTileAround(id, (surroundingTileId) => {
      if (!tileData[surroundingTileId].isRevealed) {
        queue.push(surroundingTileId);
        seen[surroundingTileId] = { hasBeenProcessed: false };
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
          this.forEachTileAround(currentId, (surroundingTileId) => {
            if (!seen[surroundingTileId]) {
              queue.push(surroundingTileId);
              seen[surroundingTileId] = { hasBeenProcessed: false };
            }
          });
        }
        seen[currentId].hasBeenProcessed = true;
      }
    }
    return tileIds;
  }

  forEachTileAround(id, cb) {
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    const validSurroundingTiles = [];
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if ((i !== 0 || j !== 0) && this.isValidId(`${rowIdx + i},${colIdx + j}`)) {
          validSurroundingTiles.push(`${rowIdx + i},${colIdx + j}`);
        }
      }
    }
    validSurroundingTiles.forEach(cb);
  }

  generateTiles() {
    const { props: { boardHeight, boardWidth }, state: tileData, revealTile } = this;
    const tiles = [];
    for (let rowIdx = 0; rowIdx < boardHeight; rowIdx += 1) {
      const tileIds = [];
      const tileRow = [];
      for (let colIdx = 0; colIdx < boardWidth; colIdx += 1) {
        const id = `${rowIdx},${colIdx}`;
        tileIds.push(id);
        const currentTile = tileData[id];
        const {
          isRevealed, isMine, isFlagged, adjacentMineCount,
        } = currentTile;
        tileRow.push((
          <Tile
            key={id}
            isRevealed={isRevealed}
            isMine={isMine}
            isFlagged={isFlagged}
            adjacentMineCount={adjacentMineCount}
            revealTile={() => (revealTile(id))}
          />
        ));
      }
      tiles.push(<tr key={tileIds.toString()}>{tileRow}</tr>);
    }
    return tiles;
  }

  handleFirstClick(clickedId) {
    const { state: tileData, props: { boardHeight, boardWidth, numberOfMines } } = this;
    const offLimitsToMines = { [clickedId]: true };
    if ((boardHeight * boardWidth) - numberOfMines >= 9) {
      this.forEachTileAround(clickedId, (surroundingTileId) => {
        offLimitsToMines[surroundingTileId] = true;
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
        ...updatedMineData[idAtWhichToPlaceMine] || tileData[idAtWhichToPlaceMine],
        isMine: true,
      };
      this.forEachTileAround(idAtWhichToPlaceMine, (surroundingTileId) => {
        const existingTileData = updatedMineData[surroundingTileId] || tileData[surroundingTileId];
        updatedMineData[surroundingTileId] = {
          ...existingTileData,
          adjacentMineCount: existingTileData.adjacentMineCount + 1,
        };
      });
    }
    return new Promise((res) => {
      this.setState({ ...updatedMineData }, () => {
        res();
      });
    });
  }

  initializeBoard() {
    const { props: { boardHeight, boardWidth } } = this;
    const tileData = {};
    for (let i = 0; i < boardHeight; i += 1) {
      for (let j = 0; j < boardWidth; j += 1) {
        tileData[`${i},${j}`] = {
          isRevealed: false,
          isMine: false,
          isFlagged: false,
          adjacentMineCount: 0,
        };
      }
    }
    return tileData;
  }

  isValidId(id) {
    const { props: { boardHeight, boardWidth } } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    return (rowIdx >= 0 && rowIdx < boardHeight && colIdx >= 0 && colIdx < boardWidth);
  }

  async revealTile(id) {
    const { props: { gameInProgress, toggleGameInProgress } } = this;
    if (!gameInProgress) {
      toggleGameInProgress();
      await this.handleFirstClick(id);
    }
    const { state: tileData } = this;
    const updatedState = { [id]: { ...tileData[id], isRevealed: true } };
    if (!tileData[id].isMine && !tileData[id].isFlagged && tileData[id].adjacentMineCount === 0) {
      const tileIdsToReveal = this.getTileIdsToRevealAround(id);
      tileIdsToReveal.forEach((tileId) => {
        updatedState[tileId] = {
          ...tileData[tileId],
          isRevealed: true,
        };
      });
    }
    this.setState({
      ...updatedState,
    });
  }

  render() {
    return (
      <table>
        <tbody>
          {this.generateTiles()}
        </tbody>
      </table>
    );
  }
}

Board.propTypes = {
  boardHeight: propTypes.number.isRequired,
  boardWidth: propTypes.number.isRequired,
  numberOfMines: propTypes.number.isRequired,
  gameInProgress: propTypes.bool.isRequired,
  toggleGameInProgress: propTypes.func.isRequired,
};

export default Board;
