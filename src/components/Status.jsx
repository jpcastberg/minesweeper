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


class Status extends Component {
  render() {
    const { props: { timeElapsedSinceGameStart, flagsToBePlaced } } = this;
    return (
      <StatusContainer>
        <div>{zeroPaddedNumber(flagsToBePlaced)}</div>
        <div>{zeroPaddedNumber(timeElapsedSinceGameStart)}</div>
      </StatusContainer>
    )
  }
}

export default Status;
