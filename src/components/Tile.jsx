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
  ${props => generateTileStyling(props)}
`;

const Tile = ({
  isRevealed, isMine, isFlagged, adjacentMineCount, revealTile,
}) => {
  const handleTileClick = () => {
    if (isRevealed || isFlagged) return;
    revealTile();
  };
  let tileContent;
  if (!isRevealed) {
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
  revealTile: propTypes.func.isRequired,
};

export default Tile;
