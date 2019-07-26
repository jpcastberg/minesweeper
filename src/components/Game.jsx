import React, { Component } from 'react';

import Board from './Board';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      boardHeight: 10,
      boardWidth: 10,
      numberOfMines: 10,
      gameInProgress: false,
      gameIsOver: false,
      playerWon: false,
    };
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  endGame(context) {
    const newState = {
      gameInProgress: false,
      gameIsOver: true,
    };
    if (context.playerDidWin) {
      newState.playerWon = true;
    }
    this.setState(newState);
  }

  startGame() {
    this.setState({ gameInProgress: true });
  }

  render() {
    const {
      state: {
        boardHeight, boardWidth, numberOfMines, gameInProgress, gameIsOver,
      },
      startGame,
      endGame,
    } = this;
    return (
      <Board
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        numberOfMines={numberOfMines}
        gameInProgress={gameInProgress}
        gameIsOver={gameIsOver}
        startGame={startGame}
        endGame={endGame}
      />
    );
  }
}

export default Game;
