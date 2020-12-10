import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };
  constructor(props) {
    super(props);

    this.state = {
      hasWon: false,
      board: this.createBoard()
    };

    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for (let i = 0; i < this.props.nrows; i++) {
      let subArray = [];
      for (let j = 0; j < this.props.ncols; j++) {
        subArray.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(subArray);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [x, y] = coord.split("-").map(Number);

    function flipCell(x, y) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[x][y] = !board[x][y];
      }
    }

    flipCell(x, y);
    flipCell(x + 1, y);
    flipCell(x - 1, y);
    flipCell(x, y + 1);
    flipCell(x, y - 1);

    // win when every cell is turned off
    let hasWon = !board.some(r => {
      return r.some(c => c === true);
    });

    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    let tableBoard = (
      <table className="Board">
        <tbody>
          {this.state.board.map((x, xIndex) => {
            return (
              <tr key={xIndex}>
                {x.map((y, yIndex) => (
                  <Cell
                    isLit={y}
                    flipCellsAroundMe={this.flipCellsAround}
                    key={`${xIndex}-${yIndex}`}
                    value={`${xIndex}-${yIndex}`}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
    return (
      <div>
        <h1>LightsOut</h1>
        {this.state.hasWon ? "Won!" : tableBoard}
      </div>
    );
  }
}

export default Board;
