
const battleship=(function app() {
    let showHint=true;
    let player1Board;
    let player2Board;
    let currentGame;
    let name1;
    let name2;
    name1 ? name1 : name1='Player 1';
    name2='Cpt Ramius';
    let playerTurn=1;
    let cheatmode=false;
    
    function introStart() {
        //Title
        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('titleWrapper');
        const titleText = document.createElement('div');
        titleText.classList.add('titleText');
        titleText.textContent='Battleship Mania';
        const titleImg = document.createElement('img');
        titleImg.classList.add('titleImg');
        titleImg.src='./assets/pic.jpg';
        titleWrapper.appendChild(titleImg);
        titleWrapper.appendChild(titleText);
        //Inuput container
        let inputWrapper = document.createElement('div');
        inputWrapper.classList.add('inputWrapper');
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('inputDiv');
        //First player
        const name1Label = document.createElement('label');
        name1Label.classList.add('name1Label');
        name1Label.textContent = "Enter player name:";
        const name1Input = document.createElement('input');
        name1Input.classList.add('name1Input');
        name1Input.placeholder='Player 1';
        
        //Launch button
        const battleButton = document.createElement('button');
        battleButton.classList.add('battleButton');
        battleButton.textContent = "Battle!";
        battleButton.addEventListener('click', launch);
        //Cheat mode
        const cheatWrapper = document.createElement('div');
        cheatWrapper.classList.add('cheatWrapper');
        const checkbox = document.createElement('input');
        checkbox.classList.add('checkbox');
        checkbox.type='checkbox';
        checkbox.id='checkbox';
        const label = document.createElement('label');
        label.classList.add('label', 'cheatlabel');
        label.setAttribute('for','checkbox');
        label.textContent="Enable cheat mode";
        cheatWrapper.appendChild(checkbox);
        cheatWrapper.appendChild(label);
        //Mount
        document.body.appendChild(titleWrapper);
        inputWrapper.appendChild(inputDiv);
        inputDiv.appendChild(name1Label);
        inputDiv.appendChild(name1Input);
        inputDiv.appendChild(battleButton);
        inputDiv.appendChild(cheatWrapper);
    
        document.body.appendChild(inputWrapper);
    }
    function makeBoards() {
        playerTurn=1;
        //Check if cheat mode is enabled
        const checkbox = document.querySelector('.checkbox');
        if(checkbox.checked)cheatmode=true;
        else cheatmode=false;
        this.name1=document.querySelector('.name1Input').value;
        if(this.name1==='')this.name1='Player 1';
        const inputWrapper = document.querySelector('.inputWrapper');
        inputWrapper.remove();
        //Initialize boards
        currentGame = Game(this.name1, this.name2);
        player1Board = currentGame.p1board;
        player2Board = currentGame.p2board;
        //Display names
        const board1Wrapper = document.createElement('div');
        board1Wrapper.classList.add('board1Wrapper');
        const board1Name = document.createElement('div');
        board1Name.classList.add('board1Name');
        const board2Wrapper = document.createElement('div');
        board2Wrapper.classList.add('board2Wrapper');
        const board2Name = document.createElement('div');
        board2Name.classList.add('board2Name');
        board1Name.textContent=this.name1;
        board2Name.textContent=name2;
        board1Wrapper.appendChild(board1Name);
        board2Wrapper.appendChild(board2Name);
        //Boards
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
        board1Wrapper.appendChild(board1);
        board2Wrapper.appendChild(board2);
        const containerWrapper = document.createElement('div');
        containerWrapper.classList.add('containerWrapper');
        const container = document.createElement('div');
        container.classList.add('container');
        container.appendChild(board1Wrapper);
        container.appendChild(board2Wrapper);
        containerWrapper.appendChild(container);
        const additionalInfo = document.createElement('div');
        additionalInfo.classList.add('additionalInfo');
        const stateText = document.createElement('div');
        stateText.classList.add('stateText');
        const currentTurn = document.createElement('div');
        currentTurn.classList.add('currentTurn');
        document.body.appendChild(containerWrapper);
        additionalInfo.appendChild(currentTurn);
        additionalInfo.appendChild(stateText);
        containerWrapper.appendChild(additionalInfo);
        //Drag option
        board1.addEventListener('dragenter', dragFunction);
        board1.addEventListener('dragover', dragFunction);
        board1.addEventListener('dragleave', dragLeave);
        board1.addEventListener('drop', drop);
        board1.addEventListener('click', drop);
        const inner = document.createElement('div');
        inner.classList.add('inner');

        //Next step, init ships
        initShips(currentGame);
        if(showHint)placeShips();
    }

    function initShips(obj) {
        currentGame=obj
        updateState(`Waiting for ${name1} to place all his ships.`, true);
        //Buttons to add ships
        const shipyardWrapper = document.createElement('div');
        shipyardWrapper.classList.add('shipyardWrapper');
        const containerWrapper = document.querySelector('.containerWrapper');
        containerWrapper.prepend(shipyardWrapper);
        const handleMenu = document.createElement('button');
        handleMenu.classList.add('handleMenu');
        handleMenu.textContent='Toggle Shipyard';
        handleMenu.addEventListener('click', togglemenu);
        shipyardWrapper.appendChild(handleMenu);

        function togglemenu() {
            const shipsToPlaceInner = document.querySelector('.shipsToPlaceInner');
            if(shipsToPlaceInner.classList.contains('shipyardhidden')) {
                shipsToPlaceInner.classList.remove('shipyardhidden');
            }
            else shipsToPlaceInner.classList.add('shipyardhidden');
        }

        //Ships to place
        const shipsToPlaceWrapper = document.createElement('div');
        const shipsToPlaceWrapperAI = document.createElement('div');
        const shipsToPlaceInner = document.createElement('div');
        shipsToPlaceInner.classList.add('shipsToPlaceInner');
        shipsToPlaceWrapper.classList.add('shipsToPlaceWrapper', 'shipyardDefault');
        shipsToPlaceWrapperAI.classList.add('shipsToPlaceWrapperAI');
        let toPlace=(currentGame.p1shipsToPlace.length);
        for(i=0;i<toPlace;i++) {
            //Player1 ships
            const placeShip = document.createElement('div');
            placeShip.classList.add('placeShip', `ship${currentGame.p1shipsToPlace[i]}`, 'placeShipHover');
            placeShip.setAttribute('draggable','true');
            placeShip.id=`id${i+1}`;
            placeShip.setAttribute('data-size',`${currentGame.p1shipsToPlace[i]}`);
            const shipImg = document.createElement('img');
            shipImg.classList.add(`shipImg`);
            shipImg.src=`./assets/Ship${currentGame.p1shipsToPlace[i]}.png`;
            placeShip.appendChild(shipImg);
            shipsToPlaceInner.appendChild(placeShip);
            placeShip.addEventListener('dragstart', dragStart);
            placeShip.addEventListener('click', shipSelect);
            //AI ships
            const placeShipAI = document.createElement('div');
            placeShipAI.classList.add('placeShip', 'shipAIHidden', `ship${currentGame.p1shipsToPlace[i]}`);
            placeShipAI.id=`id${i+1}`;
            placeShipAI.setAttribute('data-sizeAI',`${currentGame.p1shipsToPlace[i]}`);
            const shipImgAI = document.createElement('img');
            shipImgAI.classList.add(`shipImg`);
            shipImgAI.src=`./assets/Ship${currentGame.p1shipsToPlace[i]}.png`;
            placeShipAI.appendChild(shipImgAI);
            shipsToPlaceWrapperAI.appendChild(placeShipAI);

        }
        shipsToPlaceWrapper.appendChild(shipsToPlaceInner);
        const board1 = document.querySelector('.board1');
        board1.appendChild(shipsToPlaceWrapper);
        document.body.appendChild(shipsToPlaceWrapperAI);        
    }
    
    let elementDragged=undefined;
    let touchtime=0;
    function shipSelect(e) {
        //Check if double click on mobile
        if (((new Date().getTime()) - touchtime) < 500) {
            rotate(e);
            return;
        }
        touchtime = new Date().getTime();
        //Proceed with single click on desktop
        if(e.currentTarget.classList.contains('shipSelected')) {
            e.currentTarget.classList.remove('shipSelected');
            elementDragged=undefined;
            return;
        }
        const shipsToPlaceWrapper = document.querySelector('.shipsToPlaceWrapper');
        shipsToPlaceWrapper.childNodes.forEach(e=> {
            e.classList.remove('shipSelected');
        });
        e.currentTarget.classList.add('shipSelected');
        elementDragged=e.currentTarget;
        const board1 = document.querySelector('.board1');
        board1.addEventListener('mouseover', hoverFunctionIn);
        board1.addEventListener('mouseout', hoverFunctionOut);
    }
    function dragStart(e) {
        elementDragged = e.currentTarget;     
    }
    function rotate(e) {
        const target=e.currentTarget;
        elementDragged=target;
        target.classList.add('shipSelected');
        if(target.classList.contains('rotate'))target.classList.remove('rotate');
            else target.classList.add('rotate');
    }
    function hoverFunctionIn(e) {
        e.preventDefault();
        if(!elementDragged)return;
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
    function hoverFunctionOut (e) {
        e.target.classList.remove('dragoverRefused');
        e.target.classList.remove('dragoverAccepted');
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
        if(!elementDragged)return;
        const board2 = document.querySelector('.board2');
        e.target.classList.remove('dragoverRefused');
        e.target.classList.remove('dragoverAccepted');
        const curSize = parseInt(elementDragged.getAttribute('data-size'));
        const attemptX = parseInt(e.target.getAttribute('data-posX'));
        const attemptY = parseInt(e.target.getAttribute('data-posY'));
        const orientation = (elementDragged.classList.contains('rotate') ? 'v' : 'h');
        const attempt=currentGame.p1placeShip(curSize,attemptX-1,attemptY-1,orientation);
        if(!attempt) {
            elementDragged.classList.remove('shipAbs');
            return;
        }
        e.target.appendChild(elementDragged);
        elementDragged.removeEventListener('dragstart', dragStart);
        elementDragged.removeEventListener('click', rotate);
        elementDragged.removeEventListener('click', shipSelect);
        elementDragged.classList.remove('placeShipHover');
        elementDragged.classList.remove('shipSelected');
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
            displayReadyToAttack(name1);
            battle();
        }
        
    }
    function battle() {
        //Remove shipyard button
        const shipyardWrapper = document.querySelector('.shipyardWrapper');
        shipyardWrapper.remove();
        const board2 = document.querySelector('.board2');
        const boardAI=currentGame.p2board;
        // const currentTurn = document.querySelector('.currentTurn');
        for(let x=0;x<10;x++) {
            for(let y=0;y<10;y++) {
                const cell=boardAI[y][x];
                if(cell!=='') {
                    const cellToPaint = document.querySelector(`[data-aiX="${x+1}"][data-aiY="${y+1}"]`);
                    if(cheatmode)cellToPaint.classList.add('hint');
                }
            }
        }
        board2.classList.add('targetCursor');
        board2.childNodes.forEach(x=> {
            x.addEventListener('click',shootEnemy);
        });
        function addSprite(target, s) {
            const sprite = document.createElement('div');
            sprite.classList.add('sprite');
            const spriteImg = document.createElement('img');
            spriteImg.classList.add('spriteImg');
            if(s==='hit' || s==='sunk')spriteImg.src='./assets/boom.png';
            if(s==='missed')spriteImg.src='./assets/splash.png';
            sprite.appendChild(spriteImg);
            target.appendChild(sprite);
        }
        function shootEnemy(e) {
            if(playerTurn!==1)return;
            playerTurn=2;
            const currentTurn = document.querySelector('.currentTurn');
            const target = e.currentTarget;
            let aiX=parseInt(target.getAttribute('data-aiY'));
            let aiY=parseInt(target.getAttribute('data-aiX'));
            aiX--;
            aiY--;
            const shot=currentGame.p1attack(aiY, aiX);
            if(!shot)return;
            
            
            if(shot==='missed') {
                addSprite(target, 'missed');
                target.classList.add('missed');
                setTimeout(()=> {
                    currentTurn.textContent=`Turn: ${name2}`;
                },500);
                setTimeout(()=> {
                    aiAttack();
                },1000);
            }
            if(shot==='hit') {
                addSprite(target, 'hit');
                target.classList.add('hit');
                updateState('You have hit an enemy ship!');
                setTimeout(()=> {
                    currentTurn.textContent=`Turn: ${name2}`;
                },500);
                setTimeout(()=> {
                    aiAttack();
                },2000);
            }
            if(shot.state==='sunk') {
                addSprite(target, 'hit');
                target.classList.add('hit');
                const len=shot.shipSunk.length;
                const aiShipToPlace = document.querySelector(`.shipAIHidden[data-sizeAI="${len}"]`);
                const posX=shot.shipSunk.posX;
                const posY=shot.shipSunk.posY;
                const newCell=document.querySelector(`[data-aiX="${posX+1}"][data-aiY="${posY+1}"]`);
                newCell.appendChild(aiShipToPlace);
                aiShipToPlace.classList.remove('shipAIHidden');
                if(shot.shipSunk.orientation==='v')aiShipToPlace.classList.add('rotate');
                updateState('Well done! You have sunk a ship!');
                aiShipToPlace.firstElementChild.classList.add('shipsunk');
                setTimeout(()=> {
                    currentTurn.textContent=`Turn: ${name2}`;
                },500);
                setTimeout(()=> {
                    aiShipToPlace.firstElementChild.classList.remove('shipsunk'); 
                },1500);
                setTimeout(()=> {
                    aiAttack();
                },2500);
            }
            if(shot.state==='Game over') {
                addSprite(target, 'hit');
                target.classList.add('hit');
                const len=shot.shipSunk.length;
                const aiShipToPlace = document.querySelector(`.shipAIHidden[data-sizeAI="${len}"]`);
                const posX=shot.shipSunk.posX;
                const posY=shot.shipSunk.posY;
                const newCell=document.querySelector(`[data-aiX="${posX+1}"][data-aiY="${posY+1}"]`);
                newCell.appendChild(aiShipToPlace);
                aiShipToPlace.classList.remove('shipAIHidden');
                if(shot.shipSunk.orientation==='v')aiShipToPlace.classList.add('rotate');
                updateState('All ship have been destroyed!!');
                aiShipToPlace.firstElementChild.classList.add('shipsunk');
                setTimeout(()=> {
                    aiShipToPlace.firstElementChild.classList.remove('shipsunk'); 
                },1500);
                setTimeout(()=> {
                    gameOver(name1);
                },2500);
                return;
            }
            
            function aiAttack() {
                const enemyAttack=currentGame.attackAI();
                const x=enemyAttack.posX;
                const y=enemyAttack.posY;
                const enemyTarget=document.querySelector(`[data-posX="${x+1}"][data-posY="${y+1}"]`);
                if(enemyAttack.attempt==='Game over') {
                    gameOver(name2);
                    return;
                }
                if(enemyAttack.attempt==='missed') {                
                    addSprite(enemyTarget, 'missed');
                    enemyTarget.classList.add('missed');
                }
                if(enemyAttack.attempt==='hit') {          
                    addSprite(enemyTarget, 'hit');
                    enemyTarget.classList.add('hit');
                    updateState('The enemy has hit one of your ships...');
                }
                if(enemyAttack.attempt==='sunk') {
                    addSprite(enemyTarget, 'hit');
                    enemyTarget.classList.add('hit');
                    updateState('Bad News... You just lost a ship...');
                }
                playerTurn=1;
                const currentTurn = document.querySelector('.currentTurn');
                setTimeout(()=> {
                    currentTurn.textContent=`Turn: ${name1}`;
                },500);
            };
            
        }
    }
    function gameOver(n) {
        const backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const inner = document.createElement('div');
        inner.classList.add('inner');
        const text = document.createElement('div');
        text.classList.add('text');
        text.textContent="GAME OVER";
        const attribution = document.createElement('div');
        attribution.classList.add('attribution');
        attribution.textContent=`${n} wins the game!`;    
        const okbutton = document.createElement('div');
        okbutton.classList.add('okbutton');
        okbutton.textContent='QUIT';
        okbutton.addEventListener('click', ()=> {
            wrapper.remove();
            backdrop.remove();
            document.body.innerHTML='';
            introStart();
        });

        wrapper.appendChild(inner);
        inner.appendChild(text);
        inner.appendChild(attribution);
        inner.appendChild(okbutton);
        document.body.appendChild(backdrop);
        document.body.appendChild(wrapper);
        wrapper.scrollIntoView();
    }
    function updateState(t, static=false) {
        const stateText = document.querySelector('.stateText');
        if(static) {
            stateText.textContent=t; 
            return;
        }
        setTimeout(()=> {
            stateText.classList.remove('applyAnimation');
        },0);       
        setTimeout(()=> {
            stateText.classList.add('applyAnimation');
            stateText.textContent=t; 
        },250);
        setTimeout(()=> {
            stateText.textContent='';
            stateText.classList.remove('applyAnimation');
        },4000);
    } 
    function placeShips() {
        const backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const placeDiv = document.createElement('div');
        placeDiv.classList.add('placeDiv');
        const explanation = document.createElement('div');
        explanation.classList.add('explanation');
        //----First element
        let checkmark = document.createElement('div');
        checkmark.classList.add('checkmark');
        checkmark.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m10.6 16.6 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"/></svg>';
        let explText = document.createElement('div');
        explText.classList.add('explText');
        explText.textContent='Place your ships by dragging & dropping them on your board.';
        let explWrapper = document.createElement('div');
        explWrapper.classList.add('explWrapper');
        explWrapper.appendChild(checkmark);
        explWrapper.appendChild(explText);
        explanation.appendChild(explWrapper);

        //----Second element
        checkmark = document.createElement('div');
        checkmark.classList.add('checkmark');
        checkmark.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m10.6 16.6 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"/></svg>';
        explText = document.createElement('div');
        explText.classList.add('explText');
        explText.textContent='You can click a ship to rotate it.';
        explWrapper = document.createElement('div');
        explWrapper.classList.add('explWrapper');
        explWrapper.appendChild(checkmark);
        explWrapper.appendChild(explText);
        explanation.appendChild(explWrapper);

        //----Third element
        checkmark = document.createElement('div');
        checkmark.classList.add('checkmark');
        checkmark.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m10.6 16.6 7.05-7.05-1.4-1.4-5.65 5.65-2.85-2.85-1.4 1.4ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4 8.65 4 6.325 6.325 4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"/></svg>';
        explText = document.createElement('div');
        explText.classList.add('explText');
        explText.innerHTML='You can hide / show the remaining ships to place by clicking the "Toggle Shipyard" button.<br>';
        explText.innerHTML+='This will give you a better view of the board.';
        explWrapper = document.createElement('div');
        explWrapper.classList.add('explWrapper');
        explWrapper.appendChild(checkmark);
        explWrapper.appendChild(explText);
        explanation.appendChild(explWrapper);

        const okbutton = document.createElement('button');
        okbutton.classList.add('okbutton');
        okbutton.textContent='OK';
        const checkhint = document.createElement('div');
        checkhint.classList.add('checkhint');
        const checkbox = document.createElement('input');
        checkbox.classList.add('checkbox');
        checkbox.type='checkbox';
        checkbox.id='checkbox';
        const label = document.createElement('label');
        label.classList.add('label');
        label.setAttribute('for','checkbox');
        label.textContent="Don't show hint again";
        checkhint.appendChild(checkbox);
        checkhint.appendChild(label);
        placeDiv.appendChild(explanation);
        placeDiv.appendChild(okbutton);
        placeDiv.appendChild(checkhint);
        wrapper.appendChild(placeDiv);
        document.body.appendChild(backdrop);
        document.body.appendChild(wrapper);
        okbutton.addEventListener('click', ()=> {
            if(checkbox.checked)showHint=false;
            wrapper.remove();
            backdrop.remove();
        });
    }
    function displayReadyToAttack(name1) {
        //Remove shipyard from DOM
        const shipsToPlaceWrapper = document.querySelector('.shipsToPlaceWrapper');
        shipsToPlaceWrapper.remove();
        //Build panel
        const backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const readyDiv = document.createElement('div');
        readyDiv.classList.add('readyDiv');
        const explanation = document.createElement('div');
        explanation.classList.add('explanationReady');
        explanation.innerHTML=`All ships have been placed.<br><br> ${name1} can start attacking.`;
        updateState('');
        const handleMenu = document.querySelector('.handleMenu');
        handleMenu.remove();
        const okbutton = document.createElement('div');
        okbutton.classList.add('okbutton');
        okbutton.textContent='OK';
        readyDiv.appendChild(explanation);
        readyDiv.appendChild(okbutton);
        wrapper.appendChild(readyDiv);
        document.body.appendChild(backdrop);
        document.body.appendChild(wrapper);
        okbutton.addEventListener('click', ()=> {
            backdrop.remove();
            wrapper.remove();
            const currentTurn = document.querySelector('.currentTurn');
            currentTurn.textContent=`Turn: ${name1}`;
        });
        wrapper.scrollIntoView();
    }
    //----
    return {introStart, makeBoards, currentGame, gameOver};
})();
function launch() {
    battleship.makeBoards();
}
battleship.introStart();
