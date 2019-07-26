import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const generateTileStyling = (props) => {
  let styling = '';
  if (props.isRevealed) {
    styling += 'background-color: #b5b5b5';
    return styling;
  }
  return 'background-color: #737373';
};

const TileStyle = styled.td`
  width: 30px;
  height: 30px;
  margin: 2px;
  text-align: center;
  ${props => generateTileStyling(props)}
`;

const Tile = ({
  isRevealed, isMine, isFlagged, adjacentMineCount, handleTileClick, toggleFlag,
}) => {
  let tileContent;
  if (!isRevealed && !isFlagged) {
    tileContent = null;
  } else if (isFlagged) {
    tileContent = (<span role="img" aria-label="Flag">🚩</span>);
  } else if (isMine) {
    tileContent = (<span role="img" aria-label="Mine">💣</span>);
  } else {
    tileContent = adjacentMineCount || null;
  }
  return (
    <TileStyle
      onClick={handleTileClick}
      onContextMenu={(e) => {
        e.preventDefault();
        toggleFlag();
      }}
      isRevealed={isRevealed}
      adjacentMineCount={adjacentMineCount}
    >
      {tileContent}
    </TileStyle>
  );
};

Tile.propTypes = {
  isRevealed: propTypes.bool.isRequired,
  isMine: propTypes.bool.isRequired,
  isFlagged: propTypes.bool.isRequired,
  adjacentMineCount: propTypes.number.isRequired,
  handleTileClick: propTypes.func.isRequired,
  toggleFlag: propTypes.func.isRequired,
};

export default Tile;
