/* eslint-disable import/prefer-default-export */
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
    border-spacing: 0;
    border-collapse: collapse;
  }
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
`;

export const GameContainer = styled.div`
  display: grid;
  width: auto;
  grid-template:
    "status" 60px
    "board" auto
    "settings" 60px;
`;
