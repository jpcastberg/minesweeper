import React, { Component } from 'react';
import propTypes from 'prop-types';

import Tile from './Tile';

class Board extends Component {
  constructor(props) {
    super(props);
    this.forEachTileAround = this.forEachTileAround.bind(this);
    this.generateTiles = this.generateTiles.bind(this);
    this.getRandomId = this.getRandomId.bind(this);
    this.revealTile = this.revealTile.bind(this);
    this.setState = this.setState.bind(this);
    this.state = this.initializeBoard();
  }

  getRandomId() {
    const { props: { boardHeight, boardWidth } } = this;
    const getRandomInt = max => (Math.floor(Math.random() * max));
    return `${getRandomInt(boardHeight)},${getRandomInt(boardWidth)}`;
  }

  forEachTileAround(id, cb) {
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    const validSurroundingTiles = [];
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (i !== 0 && j !== 0 && this.isValidId(`${rowIdx + i},${colIdx + j}`)) {
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
      const tileRow = [];
      for (let colIdx = 0; colIdx < boardWidth; colIdx += 1) {
        const id = `${rowIdx},${colIdx}`;
        const currentTile = tileData[id];
        const { isRevealed } = currentTile;
        tileRow.push((<Tile isRevealed={isRevealed} onClick={() => (revealTile(id))} />));
      }
      tiles.push(<tr>{tileRow}</tr>);
    }
    return tiles;
  }

  initializeBoard() {
    const {
      props: { boardHeight, boardWidth, numberOfMines },
      forEachTileAround, getRandomId,
    } = this;
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
    let countOfMinesToPlace = numberOfMines;
    while (countOfMinesToPlace > 0) {
      let randomAttempts = 0;
      let idAtWhichToPlaceMine;
      // Attempt to place the mine randomly
      while (!idAtWhichToPlaceMine && randomAttempts < 10) {
        const randomId = getRandomId();
        if (tileData[randomId].isMine) {
          randomAttempts += 1;
        } else {
          idAtWhichToPlaceMine = randomId;
        }
      }
      // If 10 random attempts fail, place mine at first open space on board
      if (!idAtWhichToPlaceMine) {
        for (let i = 0; i < boardHeight; i += 1) {
          for (let j = 0; j < boardWidth; j += 1) {
            if (!tileData[`${i},${j}`].isMine) {
              idAtWhichToPlaceMine = `${i},${j}`;
            }
            break;
          }
          if (idAtWhichToPlaceMine) break;
        }
      }
      tileData[idAtWhichToPlaceMine].isMine = true;
      forEachTileAround(idAtWhichToPlaceMine, (id) => {
        tileData[id].adjacentMineCount += 1;
      });
      countOfMinesToPlace -= 1;
    }
    return tileData;
  }

  isValidId(id) {
    const { props: { boardHeight, boardWidth } } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    return (rowIdx >= 0 && rowIdx < boardHeight && colIdx >= 0 && colIdx < boardWidth);
  }

  revealTile(id) {
    const { state: tileData, setState } = this;
    const tileToReveal = tileData[id];
    const updatedTileData = { ...tileData, [id]: { ...tileToReveal, isRevealed: true } };
    setState({ ...updatedTileData });
  }

  render() {
    const { generateTiles } = this;
    return (
      <table>
        <tbody>
          {generateTiles()}
        </tbody>
      </table>
    );
  }
}

Board.propTypes = {
  boardHeight: propTypes.number.isRequired,
  boardWidth: propTypes.number.isRequired,
  numberOfMines: propTypes.number.isRequired,
};

export default Board;
