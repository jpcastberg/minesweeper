import styled from 'styled-components';

const Tile = styled.td`
  width: 30px;
  height: 30px;
  margin: 2px;
  ${props => `
    ${props.isRevealed
    ? 'background-color: blue'
    : 'background-color: red'}
  `}
`;

export default Tile;
