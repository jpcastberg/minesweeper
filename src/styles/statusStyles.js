/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

const StatusContainer = styled.div`
  grid-area: status;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(181, 181, 181, 0.2);
`;

const EmojiContainer = styled.div`
  font-size: 32px;
  text-align: center;
  vertical-align: center;
  cursor: pointer;
`;

export { StatusContainer, EmojiContainer };
