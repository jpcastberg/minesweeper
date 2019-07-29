import React, { Component } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  grid-area: status;
`;

class Status extends Component {
  render() {
    return (
      <StatusContainer>
        Status
      </StatusContainer>
    )
  }
}

export default Status;
