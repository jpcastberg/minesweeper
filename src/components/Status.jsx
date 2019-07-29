import React, { Component } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  grid-area: status;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const zeroPaddedNumber = (number) => {
  let toString = String(number);
  while (toString.length < 3) {
    toString = `0${toString}`;
  }
  return toString;
};


const Status = ({ timeElapsedSinceGameStart, flagsToBePlaced, gameIsOver, playerWon }) => {
  let emoji = (<span role="img" aria-label="Face">🙂</span>);
  if (gameIsOver) {
    emoji = playerWon
      ? (<span role="img" aria-label="Face">😎</span>)
      : (<span role="img" aria-label="Coffin">⚰️</span>);
  }
  return (
    <StatusContainer>
      <div>{zeroPaddedNumber(flagsToBePlaced)}</div>
      {emoji}
      <div>{zeroPaddedNumber(timeElapsedSinceGameStart)}</div>
    </StatusContainer>
  );
};

export default Status;
