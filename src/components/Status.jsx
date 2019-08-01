import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const StatusContainer = styled.div`
  grid-area: status;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const EmojiContainer = styled.div`
  font-size: 32px;
  text-align: center;
  vertical-align: center;
  cursor: pointer;
`;

const zeroPaddedNumber = (number) => {
  let toString = String(number);
  while (toString.length < 3) {
    toString = `0${toString}`;
  }
  return toString;
};


const Status = ({
  timeElapsedSinceGameStart,
  flagsToBePlaced,
  gameIsOver,
  playerWon,
  resetGame,
}) => {
  let emoji = (<span role="img" aria-label="Face">🙂</span>);
  if (gameIsOver) {
    emoji = playerWon
      ? (<span role="img" aria-label="Face">😎</span>)
      : (<span role="img" aria-label="Coffin">⚰️</span>);
  }
  return (
    <StatusContainer>
      <div>{zeroPaddedNumber(flagsToBePlaced)}</div>
      <EmojiContainer type="button" onClick={() => resetGame()}>
        {emoji}
      </EmojiContainer>
      <div>{zeroPaddedNumber(timeElapsedSinceGameStart)}</div>
    </StatusContainer>
  );
};

Status.propTypes = {
  timeElapsedSinceGameStart: propTypes.number.isRequired,
  flagsToBePlaced: propTypes.number.isRequired,
  gameIsOver: propTypes.bool.isRequired,
  playerWon: propTypes.bool.isRequired,
  resetGame: propTypes.func.isRequired,
};

export default Status;
