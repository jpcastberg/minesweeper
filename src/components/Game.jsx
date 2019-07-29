import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Status from './Status';
import Board from './Board';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    border-spacing: 0;
    border-collapse: collapse;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
`;

const GameContainer = styled.div`
  display: grid;
  width: auto;
  grid-template:
    "status" 60px
    "board" auto
    "settings" 60px;
`;

class Game extends Component {
  constructor() {
    super();
    this.state = {
      boardHeight: 10,
      boardWidth: 10,
      numberOfMines: 10,
      timeElapsedSinceGameStart: 0,
      timeElapsedInterval: null,
      gameIsInProgress: false,
      gameIsOver: false,
      playerWon: false,
    };
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  endGame(context) {
    const { state: { timeElapsedInterval } } = this;
    const newState = {
      gameIsInProgress: false,
      gameIsOver: true,
    };
    if (context.playerDidWin) {
      newState.playerWon = true;
    }
    clearInterval(timeElapsedInterval);
    this.setState(newState);
  }

  startGame() {
    const timeElapsedInterval = setInterval(() => {
      this.setState(state => ({ timeElapsedSinceGameStart: state.timeElapsedSinceGameStart + 1 }));
    }, 1000);
    this.setState({
      timeElapsedInterval,
      gameIsInProgress: true,
    });
  }

  render() {
    const {
      state: {
        boardHeight,
        boardWidth,
        numberOfMines,
        timeElapsedSinceGameStart,
        gameIsInProgress,
        gameIsOver,
      },
      startGame,
      endGame,
    } = this;
    return (
      <>
        <GlobalStyle />
        <AppContainer>
          <GameContainer>
            <Status
              timeElapsedSinceGameStart={timeElapsedSinceGameStart}
            />
            <Board
              boardHeight={boardHeight}
              boardWidth={boardWidth}
              numberOfMines={numberOfMines}
              gameIsInProgress={gameIsInProgress}
              gameIsOver={gameIsOver}
              startGame={startGame}
              endGame={endGame}
            />
          </GameContainer>
        </AppContainer>
      </>
    );
  }
}

export default Game;
