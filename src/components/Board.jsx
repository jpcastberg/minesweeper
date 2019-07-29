import React, { Component } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';

import Tile from './Tile';

const BoardContainer = styled.div`
  grid-area: board;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

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

  getMineIds() {
    const { state: { tileData }, props: { boardHeight, boardWidth } } = this;
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

  generateTileElements() {
    const {
      props: { boardHeight, boardWidth }, state: { tileData }, handleTileClick, toggleFlagAt,
    } = this;
    const tiles = [];
    for (let rowIdx = 0; rowIdx < boardHeight; rowIdx += 1) {
      const tileIds = [];
      const tileRow = [];
      for (let colIdx = 0; colIdx < boardWidth; colIdx += 1) {
        const id = `${rowIdx},${colIdx}`;
        tileIds.push(id);
        const currentTile = tileData[id];
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
      tiles.push(<RowContainer key={tileIds.toString()}>{tileRow}</RowContainer>);
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
      countOfUnrevealedSafeTiles,
      mineWasTriggered: false,
      tileData,
    };
  }

  isValidId(id) {
    const { props: { boardHeight, boardWidth } } = this;
    const rowIdx = Number(id.split(',')[0]);
    const colIdx = Number(id.split(',')[1]);
    return (rowIdx >= 0 && rowIdx < boardHeight && colIdx >= 0 && colIdx < boardWidth);
  }

  populateMinesAround(clickedId) {
    const { state: { tileData }, props: { boardHeight, boardWidth, numberOfMines } } = this;
    const offLimitsToMines = { [clickedId]: true };
    const getRandomId = () => {
      const getRandomInt = max => (Math.floor(Math.random() * max));
      return `${getRandomInt(boardHeight)},${getRandomInt(boardWidth)}`;
    };
    if ((boardHeight * boardWidth) - numberOfMines >= 9) {
      this.forEachTileAround(clickedId, (surroundingTile) => {
        offLimitsToMines[surroundingTile.id] = true;
      });
    }
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
        mineWasTriggered: false,
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

  toggleFlagAt(id) {
    this.setState((state) => {
      const { tileData, tileData: { [id]: { isFlagged } } } = state;
      return ({
        tileData: {
          ...tileData,
          [id]: {
            ...tileData[id],
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
              mineWasTriggered: true,
            },
          },
        });
      }, () => res());
    });
  }

  render() {
    return (
      <BoardContainer>
        {this.generateTileElements()}
      </BoardContainer>
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
