'use strict';

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Checker{
  constructor(color){
    if(color == "white"){
      this.symbol = String.fromCharCode(0x125CB)
    }
    else{
      this.symbol = String.fromCharCode(0x125CF)
    }
  }
} 

// class board
class Board {
  constructor() {
    this.grid = [];
    this.checkers = [];
  }

  // method that creates an 8x8 array, filled with null values
  createGrid() {
    // loop to create the 8 rows
    for (let row = 0; row < 8; row++) {
      this.grid[row] = [];
      // push in 8 columns of nulls
      for (let column = 0; column < 8; column++) {
        this.grid[row].push(null);
      }
    }
  }
  viewGrid() {
    // add our column numbers
    let string = "  0 1 2 3 4 5 6 7\n";
    for (let row = 0; row < 8; row++) {
      // we start with our row number in our array
      const rowOfCheckers = [row];
      // a loop within a loop
      for (let column = 0; column < 8; column++) {
        // if the location is "truthy" (contains a checker piece, in this case)
        if (this.grid[row][column]) {
          // push the symbol of the check in that location into the array
          rowOfCheckers.push(this.grid[row][column].symbol);
        } else {
          // just push in a blank space
          rowOfCheckers.push(' ');
        }
      }
      // join the rowOfCheckers array to a string, separated by a space
      string += rowOfCheckers.join(' ');
      // add a 'new line'
      string += "\n";
    }
    console.log(string);
  }

  //creating checkers
  createWhitePiece(){
    let whitePositions = [[0, 1], [0, 3], [0, 5], [0, 7],
    [1, 0], [1, 2], [1, 4], [1, 6],
    [2, 1], [2, 3], [2, 5], [2, 7]];
    let whiteChecker = new Checker("white");
    for(let i=0; i <whitePositions.length; i++){
      this.grid[whitePositions[i][0]][whitePositions[i][1]] = whiteChecker;
      this.checkers.push(whiteChecker);
    }
  }
  createBlackPiece(){
    let blackPositions = [[5, 0], [5, 2], [5, 4], [5, 6],
    [6, 1], [6, 3], [6, 5], [6, 7],
    [7, 0], [7, 2], [7, 4], [7, 6]];
    let blackChecker = new Checker("black");
    for(let i=0; i <blackPositions.length; i++){
      this.grid[blackPositions[i][0]][blackPositions[i][1]] = blackChecker;
      this.checkers.push(blackChecker);
    }
  }
  selectChecker(row, column){
    return this.grid[row][column];
  }
}

class Game {
  constructor() {
    this.board = new Board;
    this.turn = "O";
  }

  start() {
    this.board.createGrid();
    this.board.createWhitePiece();
    this.board.createBlackPiece();
  }

  moveChecker(whichPiece, toWhere){
    const whichPieceRow = parseInt(whichPiece[0]);
    const whichPieceCol = parseInt(whichPiece[1]);
    const wherePieceRow = parseInt(toWhere[0]);
    const wherePieceCol = parseInt(toWhere[1]);

    const checker = this.board.selectChecker(whichPieceRow,whichPieceCol);
    const direction = this.getDirection(whichPiece, toWhere);
    const action = this.getAction(whichPiece, toWhere, direction);
    console.log("[log] checker: " + checker);
    console.log("[log] turn: " + this.turn);
    console.log("[log] direction: ");
    console.log(direction);
    console.log("[log] action: " + action);
    let pieceFound = false;
   
    if (action == "move") {
      const canMove = this.canMove(whichPiece, toWhere, direction);
      if (canMove) {
        pieceFound = true;
        this.board.grid[whichPieceRow][whichPieceCol] = null; // remove current position
        console.log("[log] which: row " + whichPieceRow + ", col " + whichPieceCol);
        this.board.grid[wherePieceRow][wherePieceCol] = checker; // move to new position
        console.log("[log] where: row " + wherePieceRow + ", col " + wherePieceCol);
      } else {
        return;
      }
    } else if (action == "jump") {
      const middlePiece = this.getMiddlePiece(toWhere, direction);
      const middlePieceRow = parseInt(middlePiece[0]);
      const middlePieceCol = parseInt(middlePiece[1]);
      console.log("[log] middlePiece: ");
      console.log(middlePiece);
      const canJump = this.canJump(whichPiece, middlePiece, toWhere, direction);
      if (canJump) {
        pieceFound = true;
        this.board.grid[whichPieceRow][whichPieceCol] = null; // remove current position
        console.log("[log] which: row " + whichPieceRow + ", col " + whichPieceCol);
        this.board.grid[middlePieceRow][middlePieceCol] = null; // remove oponents piece
        console.log("[log] middle: row " + middlePieceRow + ", col " + middlePieceCol);
        this.board.grid[wherePieceRow][wherePieceCol] = checker; // move to new position
        console.log("[log] where: row " + wherePieceRow + ", col " + wherePieceCol);
      } else {
        return;
      }
    }
   
    if (pieceFound && this.turn == "O") {
      this.turn = "X";
    } else if (pieceFound && this.turn == "X") {
      this.turn = "O";
    }
    return;
  }

  getDirection(whichPiece, wherePiece) {
    // return direction array i.e. [up, left] [down, rigth]
    let direction = [];
    if (whichPiece[0] < wherePiece[0]) {
      direction.push("down");
    } else {
      direction.push("up");
    }

    if (whichPiece[1] < wherePiece[1]) {
      direction.push("rigth");
    } else {
      direction.push("left");
    }

    return direction;
  }

  getAction(whichPiece, wherePiece, direction) {
    // return move or jump
    if (direction[0] == "up") {
      let diff = parseInt(whichPiece[0]) - parseInt(wherePiece[0]);
      if (diff == 2) {
        return "jump"
      } else {
        return "move"
      }
    } else {
      let diff = parseInt(wherePiece[0]) - parseInt(whichPiece[0]);
      if (diff == 2) {
        return "jump"
      } else {
        return "move"
      }
    }
  }

  getMiddlePiece(wherePiece, direction) {
    // return middle piece if action is jump
    let middlePiece = [];
    if (direction[0] == "up" && direction[1] == "left") {
      let row = parseInt(wherePiece[0]) + 1;
      let col = parseInt(wherePiece[1]) + 1;
      middlePiece.push(row);
      middlePiece.push(col);
     
    } else if (direction[0] == "up" && direction[1] == "rigth") {
      let row = parseInt(wherePiece[0]) + 1;
      let col = parseInt(wherePiece[1]) - 1;
      middlePiece.push(row);
      middlePiece.push(col);
    } else if (direction[0] == "down" && direction[1] == "left") {
      let row = parseInt(wherePiece[0]) - 1;
      let col = parseInt(wherePiece[1]) + 1;
      middlePiece.push(row);
      middlePiece.push(col);
    } else if (direction[0] == "down" && direction[1] == "rigth") {
      let row = parseInt(wherePiece[0]) - 1;
      let col = parseInt(wherePiece[1]) - 1;
      middlePiece.push(row);
      middlePiece.push(col);
    }
    return middlePiece;
  }

  canMove(whichPiece, wherePiece, direction) {
    // return false if not a valid where move depending on direction
    if (direction[0] == "up" && direction[1] == "left") {
      // whichPiece row - 1 == wherePiece row
      // whichPiece col - 1 == wherePiece col
      let testRow = parseInt(whichPiece[0]) - 1;
      let testCol = parseInt(whichPiece[1]) - 1;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    } else if (direction[0] == "up" && direction[1] == "rigth") {
      // whichPiece row - 1 == wherePiece row
      // whichPiece col + 1 == wherePiece col
      let testRow = parseInt(whichPiece[0]) - 1;
      let testCol = parseInt(whichPiece[1]) + 1;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    } else if (direction[0] == "down" && direction[1] == "left") {
      // whichPiece row + 1 == wherePiece row
      // whichPiece col - 1 == wherePiece col
      let testRow = parseInt(whichPiece[0]) + 1;
      let testCol = parseInt(whichPiece[1]) - 1;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    } else if (direction[0] == "down" && direction[1] == "rigth") {
      // whichPiece row + 1 == wherePiece row
      // whichPiece col + 1 == wherePiece col
      let testRow = parseInt(whichPiece[0]) + 1;
      let testCol = parseInt(whichPiece[1]) + 1;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    }

    // return true if where piece is empty else return false
    if (this.board.grid[wherePiece[0]][wherePiece[1]] == null) {
      return true;
    } else {
      return false;
    }
  }

  canJump(whichPiece, middlePiece, wherePiece, direction) {
    // return false if not a valid where move depending on direction
    if (direction[0] == "up" && direction[1] == "left") {
      // whichPiece row - 2 == wherePiece row
      // whichPiece col - 2 == wherePiece col
      let testRow = parseInt(whichPiece[0]) - 2;
      let testCol = parseInt(whichPiece[1]) - 2;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    } else if (direction[0] == "up" && direction[1] == "rigth") {
      // whichPiece row - 2 == wherePiece row
      // whichPiece col + 2 == wherePiece col
      let testRow = parseInt(whichPiece[0]) - 2;
      let testCol = parseInt(whichPiece[1]) + 2;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    } else if (direction[0] == "down" && direction[1] == "left") {
      // whichPiece row + 2 == wherePiece row
      // whichPiece col - 2 == wherePiece col
      let testRow = parseInt(whichPiece[0]) + 2;
      let testCol = parseInt(whichPiece[1]) - 2;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    } else if (direction[0] == "down" && direction[1] == "rigth") {
      // whichPiece row + 2 == wherePiece row
      // whichPiece col + 2 == wherePiece col
      let testRow = parseInt(whichPiece[0]) + 2;
      let testCol = parseInt(whichPiece[1]) + 2;
      if (wherePiece[0] != testRow && wherePiece[1] != testCol) {
        return false;
      }
    }

    // return true if middle piece is not empty and where piece is empty else return false
    if (this.board.grid[middlePiece[0]][middlePiece[1]] != null && this.board.grid[wherePiece[0]][wherePiece[1]] == null) {
      return true;
    } else {
      return false;
    }
  }
}

function getPrompt() {
  console.log("[Game] " + game.turn + " pieces turn!");
  game.board.viewGrid();
  rl.question('which piece?: ', (whichPiece) => {
    rl.question('to where?: ', (toWhere) => {
      game.moveChecker(whichPiece, toWhere);
      getPrompt();
    });
  });
}

const game = new Game();
game.start();


// Tests
if (typeof describe === 'function') {
  describe('Game', () => {
    it('should have a board', () => {
      assert.equal(game.board.constructor.name, 'Board');
    });
    it('board should have 24 checkers', () => {
      assert.equal(game.board.checkers.length, 24);
    });
  });

  describe('Game.moveChecker()', () => {
    it('should move a checker', () => {
      assert(!game.board.grid[4][1]);
      game.moveChecker('50', '41');
      assert(game.board.grid[4][1]);
      game.moveChecker('21', '30');
      assert(game.board.grid[3][0]);
      game.moveChecker('52', '43');
      assert(game.board.grid[4][3]);
    });
    it('should be able to jump over and kill another checker', () => {
      game.moveChecker('30', '52');
      assert(game.board.grid[5][2]);
      assert(!game.board.grid[4][1]);
      assert.equal(game.board.checkers.length, 23);
    });
  });
} else {
  getPrompt();
}
