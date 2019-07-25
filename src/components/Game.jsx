import React, { Component } from 'react';

import Board from './Board';

class Game extends Component {
  constructor() {
    super();
    this.state = {
      boardHeight: 10,
      boardWidth: 10,
      numberOfMines: 10,
    };
  }

  render() {
    const { state: { boardHeight, boardWidth, numberOfMines } } = this;
    return (
      <Board
        boardHeight={boardHeight}
        boardWidth={boardWidth}
        numberOfMines={numberOfMines}
      />
    );
  }
}

export default Game;
