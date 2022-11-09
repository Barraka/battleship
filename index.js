const Ship = function(len) {
    const length = len;
    let hits = 0;
    let sunk = false;
    function hit() {
        this.hits++;
        if(this.hits>=length)this.sunk=true;
    };
    function isSunk() {
        return (this.hits >= length ? true : false);
    }
    //----
    return {length, hits, sunk, hit, isSunk};
}

const Gameboard = function() {
    const board = [];
    for(let i=0;i<10;i++) {
        board.push([]);
        for(let j=0;j<10;j++) {
            board[i].push('');
        }
    };
    const shipsToPlace = [1,2,3,4];
    function printBoard() {
        console.log(board);
    };
    function placeShip(n, x, y, orientation='h') {
        // if(n>=shipsToPlace.length)return false;
        const len=shipsToPlace[n];
        
        //Place horizontally
        if(orientation==='h' || orientation==='H') {
            for(let i=0;i<len;i++) {
                if(board[y][x+i]!==''){console.log(board[y][x+i]);return false;}
                if(x+i>9){console.log('too big');return false;}               
            };
            //Conditions are met, create ship
            const newShip = Ship(len);
            for(let i=0;i<len;i++) {
                board[y][x+i] = newShip;
            };
            this.numberOfShips++;
            this.shipsToPlace.splice(n,1);
            return true;
        }
        //Place vertically
        else if(orientation==='v' || orientation==='V') {
            for(let i=0;i<len;i++) {
                if(board[y+i][x]!=='')return false;
                if(y+i>9)return false;                
            }
            //Conditions are met, create ship
            const newShip = Ship(len);
            for(let i=0;i<len;i++) {
                board[y+i][x]= newShip;
            };
            this.numberOfShips++;
            this.shipsToPlace.splice(n,1);
            return true;
        }
        
    };
    function attack(x,y) {
        if(this.shipsToPlace.length)return false; //Only allow attacks when all ships have been placed
        if(x<0 || x>9 || y<0 || y>9)return false;
        if(board[y][x]==='') {
            board[y][x]='m';
            return false;
        }
        if(board[y][x]==='m') {
            return false;
        }
        //The attack has hit
        if(typeof(board[y][x]==='object')) {
            board[y][x].hit();
            if(board[y][x].sunk) {
                this.numberOfShips--;
                if(this.numberOfShips<=0)return 'Game won';
                return 'sunk';
            }
            return 'hit';
        }
    };
    //----
    return {board, printBoard, shipsToPlace, placeShip, attack};
}

const Game = function(name1, name2, ai=false) {
    const player1 = name1;
    const player2 = name2;
    const player1Board = Gameboard();
    const player2Board = Gameboard();
}

const myBoard = Gameboard();
// myBoard.printBoard();
// myBoard.shipsToPlace(3,3,3,"h");
// myBoard.printBoard();

// module.exports = {myBoard, Gameboard, Ship};