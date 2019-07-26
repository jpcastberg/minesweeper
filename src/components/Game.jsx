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
      gameOver: false,
      playerWon: false,
    };
    this.toggleGameInProgress = this.toggleGameInProgress.bind(this);
    this.endGame = this.endGame.bind(this);
    this.handlePlayerWin = this.handlePlayerWin.bind(this);
  }

  endGame() {
    this.setState({
      gameInProgress: false,
      gameOver: true,
    });
  }

  handlePlayerWin() {
    this.setState({ playerWon: true });
  }

  toggleGameInProgress() {
    const { state: { gameInProgress } } = this;
    this.setState({ gameInProgress: !gameInProgress });
  }

  render() {
    const {
      state: {
        boardHeight, boardWidth, numberOfMines, gameInProgress, gameOver,
      },
      toggleGameInProgress,
      endGame,
      handlePlayerWin,
    } = this;
    return (
      <Board
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        numberOfMines={numberOfMines}
        gameInProgress={gameInProgress}
        gameOver={gameOver}
        toggleGameInProgress={toggleGameInProgress}
        endGame={endGame}
        handlePlayerWin={handlePlayerWin}
      />
    );
  }
}

export default Game;
