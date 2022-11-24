const Ship = function(len, orientation='h', posX, posY) {
    const length = len;
    let hits = 0;
    let sunk = false;
    this.posX=posX;
    this.posY=posY;
    function hit() {
        this.hits++;
        if(this.hits>=length)this.sunk=true;
    };
    function isSunk() {return(this.hits >= length ? true : false);}
    //----
    return {length, hits, sunk, hit, isSunk, orientation, posX, posY};
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
    // const shipsToPlace = [3];
    function printBoard() {
    };
    function attemptPlacement(len, x, y, orientation='h') {
        if(isNaN(x) || isNaN(y))return false;
        //Place horizontally
        if(orientation==='h' || orientation==='H') {
            for(let i=0;i<len;i++) {
                if(x+i>9){console.log('too big');return false;} 
                if(board[y][x+i]!==''){return false;}
                              
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
        if(orientation==='h') {
            for(let i=0;i<len;i++) {
                if(board[y][x+i]!==''){return false;}
                if(x+i>9){console.log('too big');return false;}               
            };
            //Conditions are met, create ship
            const newShip = Ship(len, orientation, x, y);
            for(let i=0;i<len;i++) {
                board[y][x+i] = newShip;
            };
            this.numberOfShips++;
            return true;
        }
        //Place vertically
        else if(orientation==='v') {
            for(let i=0;i<len;i++) {
                if(y-i<0)return false;
                if(board[y-i][x]!=='')return false;              
            }
            //Conditions are met, create ship
            const newShip = Ship(len,orientation, x, y);
            for(let i=0;i<len;i++) {
                board[y-i][x]= newShip;
            };
            this.numberOfShips++;
            return true;
        }
        
    };
    function placeAI() {
        if(!ai)return;
        const lengthShips=shipsToPlace.length;
        for(let i=0;i<lengthShips;i++) {
            while(true) {
                const rand1=Math.floor(Math.random()*10);
                const rand2=Math.floor(Math.random()*10);
                const orientation=(Math.random()<0.5) ? 'h' : 'v';
                if(placeShip(shipsToPlace[i],rand1,rand2,orientation)) {
                    this.numberOfShips++;
                    break;
                }
            }
        }
    }
    function attack(x,y) {
        if(this.numberOfShips<shipsToPlace.length)return false; //Only allow attacks when all ships have been placed
        if(x<0 || x>9 || y<0 || y>9)return false;
        if(boardAttacks[y][x]==='h')return false;
        if(boardAttacks[y][x]==='m')return false;
        if(board[y][x]==='') {
            boardAttacks[y][x]='m';
            return 'missed';
        }
        //The attack has hit
        if(typeof(board[y][x]==='object')) {
            const shipSunk=board[y][x];
            board[y][x].hit();
            boardAttacks[y][x]='h';
            if(board[y][x].sunk) {
                this.numberOfSunks++;
                if(this.numberOfSunks>=this.numberOfShips)return {state:'Game over', shipSunk};
                return {state:'sunk', shipSunk};
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
    //Create array of possible attempts for AI to choose from
    let possibleAttacks=[];
    for(let i=0;i<10;i++) {        
        for(let j=0;j<10;j++) {
            possibleAttacks.push([i,j]);
        }
    }
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
        const attackLength=possibleAttacks.length;
        const randAttack=Math.floor(Math.random()*attackLength);
        const attackCoords=possibleAttacks.splice(randAttack,1)[0];
        const posX=attackCoords[0];
        const posY=attackCoords[1];
        const attempt=player1Board.attack(posX,posY);
        if(attempt==='Game over'){
            this.gameOver=true;
            return {attempt, posX, posY};
        }
        return {attempt, posX, posY};
    }

    //----
    return {player1, player2, p1board, p2board, p1shipsToPlace, p2shipsToPlace, p1attemptPlacement, p2attemptPlacement, p1placeShip, p1attack, readyToAttack, p1ready, p2ready, attackAI, gameOver};
}
