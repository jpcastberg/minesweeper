import React, { Component } from 'react';

import Board from './Board';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      boardHeight: 10,
      boardWidth: 10,
      numberOfMines: 10,
      gameStarted: false,
    };
    this.toggleGameStarted = this.toggleGameStarted.bind(this);
  }

  toggleGameStarted() {
    const { state: { gameStarted } } = this;
    this.setState({ gameStarted: !gameStarted });
  }

  render() {
    const {
      state: {
        boardHeight, boardWidth, numberOfMines, gameStarted,
      },
      toggleGameStarted,
    } = this;
    return (
      <Board
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        numberOfMines={numberOfMines}
        gameStarted={gameStarted}
        toggleGameStarted={toggleGameStarted}
      />
    );
  }
}

export default Game;
