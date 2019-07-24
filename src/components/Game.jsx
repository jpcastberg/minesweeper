import React, { useReducer, Component } from 'react'
import PropTypes from 'prop-types'


class Game extends Component {
  constructor() {
    super();
    this.state = {
      boardHeight: 10,
      boardWidth: 10,
      numberOfMines: 10,
      tileData: null
    }
  }

  componentDidMount() {
    this.initializeBoard();
  }

  forEachTileAround(id, cb) {
    const rowIdx = Number(id.split(',')[0])
    const colIdx = Number(id.split(',')[1])
    const validSurroundingTiles = [];
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (i === 0 && j === 0 || !this.isValidId(`${rowIdx + i},${colIdx + j}`)) continue;
        validSurroundingTiles.push(`${rowIdx + i},${colIdx + j}`);
      }
    }
    validSurroundingTiles.forEach(cb);
  }

  getRandomId() {
    const { state: { boardHeight, boardWidth } } = this;
    const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
    }
    return `${getRandomInt(boardHeight)},${getRandomInt(boardWidth)}`
  }

  initializeBoard() {
    const { state: { boardHeight, boardWidth, numberOfMines }, state } = this;
    const tileData = {};
    for (let i = 0; i < boardHeight; i += 1) {
      for (let j = 0; j < boardWidth; j += 1) {
        tileData[`${i},${j}`] = {
          isRevealed: false,
          isMine: false,
          isFlagged: false,
          adjacentMineCount: 0,
        }
      }
    }
  
    let countOfMinesToPlace = numberOfMines;
    while (countOfMinesToPlace > 0) {
      let randomAttempts = 0;
      let idAtWhichToPlaceMine;
      while (!idAtWhichToPlaceMine && randomAttempts < 10) {
        const randomId = this.getRandomId();
        if (tileData[randomId].isMine) {
          randomAttempts += 1;
        } else {
          idAtWhichToPlaceMine = randomId;
        }
      }
      if (!idAtWhichToPlaceMine) {
        for (let i = 0; i < boardHeight; i += 1) {
          for (let j = 0; j < boardWidth; j += 1) {
            if (tileData[`${i},${j}`].isMine) continue;
            idAtWhichToPlaceMine = `${i},${j}`;
            break;
          }
          if (idAtWhichToPlaceMine) break;
        }
      }
      tileData[idAtWhichToPlaceMine].isMine = true;
      this.forEachTileAround(idAtWhichToPlaceMine, (id) => {
        tileData[id].adjacentMineCount += 1;
      })
      countOfMinesToPlace -= 1;
    }
    this.setState({ tileData });
  }

  isValidId(id) {
    const { boardHeight, boardWidth } = this.state;
    const rowIdx = Number(id.split(',')[0])
    const colIdx = Number(id.split(',')[1])
    return (rowIdx >= 0 && rowIdx < boardHeight && colIdx >= 0 && colIdx < boardWidth);
  }

  generateTiles() {
    const { state: { tileData, boardHeight, boardWidth } } = this;
    const tiles = [];
    for (let rowIdx = 0; rowIdx < boardHeight; rowIdx += 1) {
      const tileRow = [];
      for (let colIdx = 0; colIdx < boardWidth; colIdx += 1) {
        const currentTile = tileData[`${rowIdx},${colIdx}`];
        tileRow.push((<td>{` ${currentTile.isMine ? 'M' : currentTile.adjacentMineCount} `}</td>))
      }
      tiles.push(<tr>{tileRow}</tr>)
    }
    return tiles;
  }

  render() {
    const { state: { tileData } } = this;
    if (tileData) {
      return (
        <table>
          {this.generateTiles()}
        </table>
      );
    } else {
      return (
        <div>Loading</div>
      );
    }
  }
}

export default Game;
