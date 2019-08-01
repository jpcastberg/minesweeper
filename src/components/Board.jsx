import React from 'react';
import propTypes from 'prop-types';

import Tile from './Tile';

import { BoardContainer, RowContainer } from '../styles/boardStyles';

const Board = ({
  boardHeight,
  boardWidth,
  tileData,
  handleTileClickAt,
  toggleFlagAt,
}) => {
  const generateTileElements = () => {
    const tiles = [];
    for (let rowIdx = 0; rowIdx < boardHeight; rowIdx += 1) {
      const tileIds = [];
      const tileRow = [];
      for (let colIdx = 0; colIdx < boardWidth; colIdx += 1) {
        const id = `${rowIdx},${colIdx}`;
        tileIds.push(id);
        const currentTile = tileData[id];
        const {
          isRevealed, isMine, isFlagged, adjacentMineCount, isTriggeredMine,
        } = currentTile;
        tileRow.push((
          <Tile
            key={id}
            isRevealed={isRevealed}
            isMine={isMine}
            isTriggeredMine={isTriggeredMine || false}
            isFlagged={isFlagged}
            adjacentMineCount={adjacentMineCount}
            handleTileClick={() => handleTileClickAt(id)}
            toggleFlag={() => toggleFlagAt(id)}
          />
        ));
      }
      tiles.push(<RowContainer key={tileIds.toString()}>{tileRow}</RowContainer>);
    }
    return tiles;
  };
  return (
    <BoardContainer>
      {generateTileElements()}
    </BoardContainer>
  );
};

Board.propTypes = {
  boardHeight: propTypes.number.isRequired,
  boardWidth: propTypes.number.isRequired,
  tileData: propTypes.objectOf(
    propTypes.shape({
      id: propTypes.string,
      isRevealed: propTypes.bool,
      isMine: propTypes.bool,
      isTriggeredMine: propTypes.bool,
      isFlagged: propTypes.bool,
      adjacentMineCount: propTypes.number,
    }),
  ).isRequired,
  handleTileClickAt: propTypes.func.isRequired,
  toggleFlagAt: propTypes.func.isRequired,
};

export default Board;
