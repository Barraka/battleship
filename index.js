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

const Gameboard = function(ai=false) {
    const board = [];
    const boardAttacks = [];
    let numberOfShips=0;
    let numberOfSunks=0;
    for(let i=0;i<10;i++) {
        board.push([]);
        boardAttacks.push([]);
        for(let j=0;j<10;j++) {
            board[i].push('');
            boardAttacks[i].push('');
        }
    };
    const shipsToPlace = [1,1,1,2,2,3,3,4];
    function printBoard() {
        console.log(board);
    };
    function attemptPlacement(len, x, y, orientation='h') {
        if(isNaN(x) || isNaN(y))return false;
        //Place horizontally
        if(orientation==='h' || orientation==='H') {
            for(let i=0;i<len;i++) {
                if(x+i>9){console.log('too big');return false;} 
                if(board[y][x+i]!==''){console.log(board[y][x+i]);return false;}
                              
            };
            return true;
        }
        //Place vertically
        else if(orientation==='v' || orientation==='V') {
            for(let i=0;i<len;i++) {
                if(y-i<0)return false;
                
                if(board[y-i][x]!=='')return false;
                                
            }
            return true;
        }
    }
    function placeShip(len, x, y, orientation='h') {
        if(isNaN(x) || isNaN(y))return false;
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
            // this.shipsToPlace--;
            // this.shipsToPlace.splice(n,1);
            return true;
        }
        //Place vertically
        else if(orientation==='v' || orientation==='V') {
            for(let i=0;i<len;i++) {
                if(y-i<0)return false;
                if(board[y-i][x]!=='')return false;              
            }
            //Conditions are met, create ship
            const newShip = Ship(len);
            for(let i=0;i<len;i++) {
                board[y-i][x]= newShip;
            };
            this.numberOfShips++;
            // this.shipsToPlace--;
            // this.shipsToPlace.splice(n,1);
            return true;
        }
        
    };
    function placeAI() {
        if(!ai)return;
        const lengthShips=shipsToPlace.length;
        for(let i=0;i<lengthShips;i++) {
            while(true) {
                const rand1=Math.floor(Math.random()*lengthShips);
                const rand2=Math.floor(Math.random()*lengthShips);
                const orientation=(Math.random()<0.5) ? 'h' : 'v';
                if(placeShip(shipsToPlace[i],rand1,rand2,orientation)) {
                    this.numberOfShips++;
                    break;
                }
            }
        }
        console.log(board);
    }
    function attack(x,y) {
        if(this.numberOfShips<shipsToPlace.length)return false; //Only allow attacks when all ships have been placed
        console.log(x + '   ' + y);
        if(x<0 || x>9 || y<0 || y>9)return false;
        if(boardAttacks[y][x]==='h')return false;
        if(boardAttacks[y][x]==='m')return false;
        if(board[y][x]==='') {
            boardAttacks[y][x]='m';
            return 'missed';
        }
        //The attack has hit
        if(typeof(board[y][x]==='object')) {
            board[y][x].hit();
            boardAttacks[y][x]='h';
            if(board[y][x].sunk) {
                this.numberOfSunks++;
                if(this.numberOfSunks>=this.numberOfShips)return 'Game over';
                return 'sunk';
            }
            return 'hit';
        }
    };
    
    //----
    return {board, printBoard, shipsToPlace, numberOfShips, numberOfSunks, attemptPlacement, placeShip, attack, placeAI};
}

const Game = function(name1, name2) {
    const player1 = name1;
    const player2 = name2;
    const player1Board = Gameboard();
    const player2Board = Gameboard(true);
    let p1ready = false;
    let p2ready = false;
    let readyToAttack=0;
    let gameOver = false;
    const p1board=player1Board.board;
    const p2board=player2Board.board;
    const p1shipsToPlace=player1Board.shipsToPlace;
    const p2shipsToPlace=player2Board.shipsToPlace;
    const p1attemptPlacement = player1Board.attemptPlacement;
    const p2attemptPlacement = player2Board.attemptPlacement;
    const p1placeShip = function(...args){
        const attempt=player1Board.placeShip(...args);
        if(attempt && player1Board.numberOfShips>=player1Board.shipsToPlace.length) {
            this.p1ready=true;
            this.readyToAttack=1;
            player2Board.placeAI();
        }
        return attempt;
    };
    const p1attack = function(...args) {
        const attempt=player2Board.attack(...args);
        if(!attempt)return false;
        this.readyToAttack=2;
        if(attempt==='Game over'){
            this.gameOver=true;
            return attempt;
        }
        return attempt;
    };
    function attackAI() {
        while(true) {
            const rand1=Math.floor(Math.random()*10);
            const rand2=Math.floor(Math.random()*10);
            const attempt=player1Board.attack(rand1, rand2);
            if(attempt)return {attempt, rand1, rand2};
        }
    }

    //----
    return {player1, player2, p1board, p2board, p1shipsToPlace, p2shipsToPlace, p1attemptPlacement, p2attemptPlacement, p1placeShip, p1attack, readyToAttack, p1ready, p2ready, attackAI, gameOver};
}

//const myBoard = Gameboard();
// myBoard.printBoard();
// myBoard.shipsToPlace(3,3,3,"h");
// myBoard.printBoard();

// module.exports = {myBoard, Gameboard, Ship};