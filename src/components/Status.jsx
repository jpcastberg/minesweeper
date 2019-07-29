import React, { Component } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  grid-area: status;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

class Status extends Component {
  render() {
    const { props: { timeElapsedSinceGameStart, flagsToBePlaced } } = this;
    return (
      <StatusContainer>
        <div>{flagsToBePlaced}</div>
        <div>{timeElapsedSinceGameStart}</div>
      </StatusContainer>
    )
  }
}

export default Status;
