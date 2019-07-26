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
    };
    this.toggleGameInProgress = this.toggleGameInProgress.bind(this);
  }

  toggleGameInProgress() {
    const { state: { gameInProgress } } = this;
    this.setState({ gameInProgress: !gameInProgress });
  }

  render() {
    const {
      state: {
        boardHeight, boardWidth, numberOfMines, gameInProgress,
      },
      toggleGameInProgress,
    } = this;
    return (
      <Board
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        numberOfMines={numberOfMines}
        gameInProgress={gameInProgress}
        toggleGameInProgress={toggleGameInProgress}
      />
    );
  }
}

export default Game;
