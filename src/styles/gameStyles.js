/* eslint-disable import/prefer-default-export */
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
  * {
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
    border-spacing: 0;
    border-collapse: collapse;
  }
  html {
    background: url('https://i.imgur.com/8wqEp5z.png');
    background-size: 100%;
    background-attachment: fixed;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  min-width: 900px;
`;

const GameContainer = styled.div`
  display: grid;
  grid-template:
    "status" 60px
    "board" auto
    "settings" 60px;
`;

export { GlobalStyle, AppContainer, GameContainer };
