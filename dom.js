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
function gameStart() {
    const name1=document.querySelector('.name1Input').value;
    const name2=document.querySelector('.name2Input').value;
    const inputWrapper = document.querySelector('.inputWrapper');
    inputWrapper.remove();
    //Initialize boards
    player1Board = Gameboard();
    const player2Board = Gameboard();
    //Display boards
    const board1 = document.createElement('div');
    board1.classList.add('board1');
    const board2 = document.createElement('div');
    board2.classList.add('board2');
    for(let i=10;i>=1;i--) {
        for(let j=1;j<=10;j++) {
            const board1Cell = document.createElement('div');
            board1Cell.classList.add('board1Cell', 'boardCell');
            const board2Cell = document.createElement('div');
            board2Cell.classList.add('board2Cell', 'boardCell');
            board1.appendChild(board1Cell);
            board2.appendChild(board2Cell);
            board1Cell.setAttribute('data-posX',`${j}`);
            board1Cell.setAttribute('data-posY',`${i}`);
            board2Cell.setAttribute('data-posX',`${j}`);
            board2Cell.setAttribute('data-posY',`${i}`);
            board1.appendChild(board1Cell);
            board2.appendChild(board2Cell);
            // board1Cell.addEventListener('dragstart', dragStart);
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
        let toPlace=(player1Board.shipsToPlace.length);
        for(i=0;i<toPlace;i++) {
            const placeShip = document.createElement('div');
            placeShip.classList.add('placeShip', `ship${i+1}`);
            placeShip.setAttribute('draggable','true');
            placeShip.id=`id${i+1}`;
            placeShip.setAttribute('data-size',`${i+1}`);
            const shipImg = document.createElement('img');
            shipImg.classList.add(`shipImg`);
            shipImg.src=`./assets/Ship${i+1}.png`;
            placeShip.appendChild(shipImg);
            shipsToPlaceWrapper.appendChild(placeShip);
            placeShip.addEventListener('dragstart', dragStart);
            placeShip.addEventListener('dragend', dragEnd);
            placeShip.addEventListener('click', rotate);
        }
        document.body.appendChild(shipsToPlaceWrapper);
    }

    //Drag option
    board1.addEventListener('dragenter', dragEnter);
    board1.addEventListener('dragover', dragOver);
    board1.addEventListener('dragleave', dragLeave);
    board1.addEventListener('drop', drop);
    let elementDragged=undefined;

    function dragStart(e) {
        // e.dataTransfer.setData('text/plain', e.currentTarget.id);
        elementDragged = e.currentTarget;     
    }
    initShips();

    function rotate(e) {
        const target=e.currentTarget;
        if(target.classList.contains('rotate'))target.classList.remove('rotate');
            else target.classList.add('rotate');

    }
    function dragEnd(e) {
        // e.target.classList.remove('hide');
    }

    function dragEnter(e) {
        e.preventDefault();

        // get the draggable element
        const id = elementDragged.id;
        const draggable = document.getElementById(id);
        if(!draggable)return;
        //Check if size fits
        const curSize = parseInt(draggable.getAttribute('data-size'));
        const attemptX = parseInt(e.target.getAttribute('data-posX'));
        const attemptY = parseInt(e.target.getAttribute('data-posY'));
        const orientation = (draggable.classList.contains('rotate') ? 'v' : 'h');
        if(orientation==='h' && attemptX<=11-curSize)e.target.classList.add('dragoverAccepted');
        else if(orientation==='v' && attemptY>=curSize)e.target.classList.add('dragoverAccepted');
        else e.target.classList.add('dragoverRefused');
    }

    function dragOver(e) {
        e.preventDefault();
        // get the draggable element
        const id = elementDragged.id;
        const draggable = document.getElementById(id);
        if(!draggable)return;
        //Check if size fits
        const curSize = parseInt(draggable.getAttribute('data-size'));
        const attemptX = parseInt(e.target.getAttribute('data-posX'));
        const attemptY = parseInt(e.target.getAttribute('data-posY'));
        const orientation = (draggable.classList.contains('rotate') ? 'v' : 'h');
        if(orientation==='h' && attemptX<=11-curSize)e.target.classList.add('dragoverAccepted');
        else if(orientation==='v' && attemptY>=curSize)e.target.classList.add('dragoverAccepted');
        else e.target.classList.add('dragoverRefused');
    }

    function dragLeave(e) {
        e.target.classList.remove('dragoverRefused');
        e.target.classList.remove('dragoverAccepted');
    }

    function drop(e) {
        e.target.classList.remove('dragoverRefused');
        e.target.classList.remove('dragoverAccepted');
        const curSize = parseInt(elementDragged.getAttribute('data-size'));
        const attemptX = parseInt(e.target.getAttribute('data-posX'));
        const attemptY = parseInt(e.target.getAttribute('data-posY'));
        const orientation = (elementDragged.classList.contains('rotate') ? 'v' : 'h');
        const attempt=player1Board.placeShip(curSize-1,attemptX-1,attemptY-1,orientation);
        if(!attempt) {
            elementDragged.classList.remove('shipAbs');
            return;
        }
        e.target.appendChild(elementDragged);
        elementDragged.removeEventListener('dragstart', dragStart);
        elementDragged.removeEventListener('dragend', dragEnd);
        elementDragged.removeEventListener('click', rotate);
        
        //Check if match can start
        if(player1Board.shipsToPlace<=0) {
            console.log('Game can finally start');
        }
    }
}
