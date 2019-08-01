import styled from 'styled-components';

const generateTileStyling = (props) => {
  let styling = '';
  if (props.isTriggeredMine) {
    styling += 'background-color: #de1414;';
    return styling;
  }
  if (props.isRevealed) {
    styling += 'background-color: #b5b5b5;';
    return styling;
  }
  return 'background-color: #737373;';
};

const TileStyle = styled.div`
  display: flex;
  width: 28px;
  height: 28px;
  border: 1px solid #000000;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: default;
  ${props => generateTileStyling(props)}
`;

export default TileStyle;
