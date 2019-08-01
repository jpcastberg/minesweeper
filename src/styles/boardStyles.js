/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

const BoardContainer = styled.div`
  grid-area: board;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export { BoardContainer, RowContainer };
