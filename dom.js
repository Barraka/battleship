introStart();

function introStart() {
    let inputWrapper = document.createElement('div');
    inputWrapper.classList.add('inputWrapper');
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('inputDiv');
    //First player
    const name1Label = document.createElement('label');
    name1Label.classList.add('name1Label');
    name1Label.textContent = "Enter player1 name:";
    const name1Input = document.createElement('input');
    name1Input.classList.add('name1Input');
    //Second player
    const name2Label = document.createElement('label');
    name2Label.classList.add('name2Label');
    name2Label.textContent = "Enter player2 name:";
    const name2Input = document.createElement('input');
    name2Input.classList.add('name2Input');
    //Launch button
    const battleButton = document.createElement('button');
    battleButton.classList.add('battleButton');
    battleButton.textContent = "Battle!";
    battleButton.addEventListener('click', gameStart);
    //Mount
    inputWrapper.appendChild(inputDiv);
    inputDiv.appendChild(name1Label);
    inputDiv.appendChild(name1Input);
    inputDiv.appendChild(name2Label);
    inputDiv.appendChild(name2Input);
    inputDiv.appendChild(battleButton);

    document.body.appendChild(inputWrapper);
}
let player1Board;
let player2Board;
function gameStart() {
    const name1=document.querySelector('.name1Input').value;
    const name2=document.querySelector('.name2Input').value;
    const inputWrapper = document.querySelector('.inputWrapper');
    inputWrapper.remove();
    //Initialize boards
    const currentGame = Game(name1, name2);
    // player1Board = Gameboard();
    // player2Board = Gameboard(true);
    player1Board = currentGame.p1board;
    player2Board = currentGame.p2board;
    //Display boards
    const board1 = document.createElement('div');
    board1.classList.add('board1');
    const board2 = document.createElement('div');
    board2.classList.add('board2');
    for(let i=10;i>=1;i--) {
        for(let j=1;j<=10;j++) {
            const board1Cell = document.createElement('div');
            board1Cell.classList.add('board1Cell', 'boardCell', 'boardCellRelative');
            const board2Cell = document.createElement('div');
            board2Cell.classList.add('board2Cell', 'boardCell', 'boardCellRelative');
            board1.appendChild(board1Cell);
            board2.appendChild(board2Cell);
            board1Cell.setAttribute('data-posX',`${j}`);
            board1Cell.setAttribute('data-posY',`${i}`);
            board2Cell.setAttribute('data-aiX',`${j}`);
            board2Cell.setAttribute('data-aiY',`${i}`);
            board1.appendChild(board1Cell);
            board2.appendChild(board2Cell);
        }
    }

    const containerWrapper = document.createElement('div');
    containerWrapper.classList.add('containerWrapper');
    const container = document.createElement('div');
    container.classList.add('container');
    container.appendChild(board1);
    container.appendChild(board2);
    containerWrapper.appendChild(container);
    document.body.appendChild(containerWrapper);

    function initShips() {
        const shipsToPlaceWrapper = document.createElement('div');
        shipsToPlaceWrapper.classList.add('shipsToPlaceWrapper');
        let toPlace=(currentGame.p1shipsToPlace.length);
        for(i=0;i<toPlace;i++) {
            const placeShip = document.createElement('div');
            placeShip.classList.add('placeShip', `ship${currentGame.p1shipsToPlace[i]}`, 'placeShipHover');
            placeShip.setAttribute('draggable','true');
            placeShip.id=`id${i+1}`;
            placeShip.setAttribute('data-size',`${currentGame.p1shipsToPlace[i]}`);
            const shipImg = document.createElement('img');
            shipImg.classList.add(`shipImg`);
            shipImg.src=`./assets/Ship${currentGame.p1shipsToPlace[i]}.png`;
            placeShip.appendChild(shipImg);
            shipsToPlaceWrapper.appendChild(placeShip);
            placeShip.addEventListener('dragstart', dragStart);
            placeShip.addEventListener('click', rotate);
        }
        document.body.appendChild(shipsToPlaceWrapper);
    }

    //Drag option
    board1.addEventListener('dragenter', dragFunction);
    board1.addEventListener('dragover', dragFunction);
    board1.addEventListener('dragleave', dragLeave);
    board1.addEventListener('drop', drop);
    let elementDragged=undefined;

    function dragStart(e) {
        elementDragged = e.currentTarget;     
    }
    initShips();

    function rotate(e) {
        const target=e.currentTarget;
        if(target.classList.contains('rotate'))target.classList.remove('rotate');
            else target.classList.add('rotate');
    }

    function dragFunction(e) {
        e.preventDefault();
        // get the draggable element
        const id = elementDragged.id;
        const draggable = document.getElementById(id);
        if(!draggable)return;

        const curSize = parseInt(elementDragged.getAttribute('data-size'));
        let attemptX = parseInt(e.target.getAttribute('data-posX'));
        let attemptY = parseInt(e.target.getAttribute('data-posY'));
        const orientation = (elementDragged.classList.contains('rotate') ? 'v' : 'h');
        if(isNaN(attemptX)){
            attemptX = parseInt(e.target.parentElement.getAttribute('data-posX'));
            attemptY = parseInt(e.target.parentElement.getAttribute('data-posY'));
        }   
        const attempt=currentGame.p1attemptPlacement(curSize,attemptX-1,attemptY-1,orientation);
        if(attempt)e.target.classList.add('dragoverAccepted');
        else e.target.classList.add('dragoverRefused');
    }

    function dragLeave(e) {
        e.target.classList.remove('dragoverRefused');
        e.target.classList.remove('dragoverAccepted');
    }

    function drop(e) {
        if(elementDragged==='')return;
        e.target.classList.remove('dragoverRefused');
        e.target.classList.remove('dragoverAccepted');
        const curSize = parseInt(elementDragged.getAttribute('data-size'));
        const attemptX = parseInt(e.target.getAttribute('data-posX'));
        const attemptY = parseInt(e.target.getAttribute('data-posY'));
        const orientation = (elementDragged.classList.contains('rotate') ? 'v' : 'h');
        const attempt=currentGame.p1placeShip(curSize,attemptX-1,attemptY-1,orientation);
        if(!attempt) {
            elementDragged.classList.remove('shipAbs');
            console.log('placement not allowed');
            return;
        }
        else {
            console.log('placement accepted, new array: ');
            console.log(currentGame.p1board);
        }
        e.target.appendChild(elementDragged);
        elementDragged.removeEventListener('dragstart', dragStart);
        elementDragged.removeEventListener('click', rotate);
        elementDragged.classList.remove('placeShipHover');
        elementDragged.classList.add('shipLocked');
        elementDragged='';
        //Remove borders of adjacent cells
        if(curSize>1) {
            if(orientation==='h') {
                for(x=0;x<curSize;x++) {
                    const cellToClean = document.querySelector(`[data-posX="${attemptX+x}"][data-posY="${attemptY}"]`);
                    cellToClean.classList.remove('boardCell');
                }
            }
            if(orientation==='v') {
                for(x=0;x<curSize;x++) {
                    const cellToClean = document.querySelector(`[data-posX="${attemptX}"][data-posY="${attemptY-x}"]`);
                    cellToClean.classList.remove('boardCell');
                }
            }
        }
        
        //Check if match can start
        if(currentGame.readyToAttack===1) {
            console.log('Game can finally start');
            const boardAI=currentGame.p2board;
            for(let x=0;x<10;x++) {
                for(let y=0;y<10;y++) {
                    const cell=boardAI[x][y];
                    if(cell!=='') {
                        const cellToPaint = document.querySelector(`[data-aiX="${x+1}"][data-aiY="${y+1}"]`);
                        cellToPaint.style.backgroundColor='red';
                    }
                }
            }
            board2.classList.add('targetCursor');
            board2.childNodes.forEach(x=> {
                x.addEventListener('click',shootEnemy);
            });
        }
        function shootEnemy(e) {
            const target = e.currentTarget;
            console.log(target);
            let aiX=parseInt(target.getAttribute('data-aiY'));
            let aiY=parseInt(target.getAttribute('data-aiX'));
            aiX--;
            aiY--;
            const shot=currentGame.p1attack(aiX, aiY);
            console.log(shot);
            if(shot==='missed') {
                target.style.backgroundImage="url('./assets/splash.png')";
            }
            if(shot==='hit') {
                target.style.backgroundImage="url('./assets/boom.png')";
            }
            const enemyAttack=currentGame.attackAI();
            console.log(enemyAttack.attempt);
            const x=enemyAttack.rand1;
            const y=enemyAttack.rand2;
            const enemyTarget=document.querySelector(`[data-posX="${x+1}"][data-posY="${y+1}"]`);
            if(enemyAttack.attempt==='missed') {                
                enemyTarget.style.backgroundImage="url('./assets/splash.png')";
            }
            if(enemyAttack.attempt==='hit') {          
                const explosionDiv = document.createElement('div');
                explosionDiv.classList.add('explosionDiv');
                const explosionImg = document.createElement('img');
                explosionImg.classList.add('explosionImg'); 
                explosionImg.src='./assets/boom.png';     
                explosionDiv.appendChild(explosionImg);
                enemyTarget.style.backgroundImage="url('./assets/boom.png')";
                enemyTarget.appendChild(explosionDiv);
            }
        }
    }
}
