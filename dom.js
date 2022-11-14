




const battleship=(function app() {
    let showHint=true;
    let player1Board;
    let player2Board;
    let currentGame;
    let name1;
    let name2;
    name1 ? name1 : name1='Player 1';
    name2='Xan';
    let playerTurn=1;
    
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
        name1Input.placeholder='Player 1';
        
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
        battleButton.addEventListener('click', launch);
        //Mount
        inputWrapper.appendChild(inputDiv);
        inputDiv.appendChild(name1Label);
        inputDiv.appendChild(name1Input);
        inputDiv.appendChild(name2Label);
        inputDiv.appendChild(name2Input);
        inputDiv.appendChild(battleButton);
    
        document.body.appendChild(inputWrapper);
    }
    function makeBoards() {
        this.name1=document.querySelector('.name1Input').value;
        this.name2=document.querySelector('.name2Input').value;
        const inputWrapper = document.querySelector('.inputWrapper');
        inputWrapper.remove();
        //Initialize boards
        currentGame = Game(name1, name2);
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
        const inner = document.createElement('div');
        inner.classList.add('inner');

        //Next step, init ships
        initShips(currentGame);
        if(showHint)placeShips();
    }

    function initShips(obj) {
        currentGame=obj
        const shipsToPlaceWrapper = document.createElement('div');
        const shipsToPlaceWrapperAI = document.createElement('div');
        shipsToPlaceWrapper.classList.add('shipsToPlaceWrapper');
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
            shipsToPlaceWrapper.appendChild(placeShip);
            placeShip.addEventListener('dragstart', dragStart);
            placeShip.addEventListener('click', rotate);
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
        document.body.appendChild(shipsToPlaceWrapper);
        document.body.appendChild(shipsToPlaceWrapperAI);        
    }
    
    let elementDragged=undefined;

    function dragStart(e) {
        elementDragged = e.currentTarget;     
    }
    

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
            displayReadyToAttack(name1);
            battle();
        }
        
    }
    function battle() {
        const board2 = document.querySelector('.board2');
        const boardAI=currentGame.p2board;
        const currentTurn = document.querySelector('.currentTurn');
        for(let x=0;x<10;x++) {
            for(let y=0;y<10;y++) {
                const cell=boardAI[y][x];
                if(cell!=='') {
                    const cellToPaint = document.querySelector(`[data-aiX="${x+1}"][data-aiY="${y+1}"]`);
                    cellToPaint.classList.add('hint');
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
            currentTurn.textContent=`Turn: ${name2}`;
            
            if(shot==='missed') {
                // target.style.backgroundImage="url('./assets/splash.png')";
                addSprite(target, 'missed');
                target.classList.add('missed');
                setTimeout(()=> {
                    aiAttack();
                },1000);
            }
            if(shot==='hit') {
                // target.style.backgroundImage="url('./assets/boom.png')";
                addSprite(target, 'hit');
                target.classList.add('hit');
                updateState('You have hit an enemy ship!');
                setTimeout(()=> {
                    aiAttack();
                },2000);
            }
            if(shot.state==='sunk') {
                // target.style.backgroundImage="url('./assets/boom.png')";
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
                //Check if game is over
                if(shot==='Game over') {
                    gameOver(name1);
                    return;
                }
                updateState('Well done! You have sunk a ship!');
                aiShipToPlace.firstElementChild.classList.add('shipsunk');
                setTimeout(()=> {
                    aiShipToPlace.firstElementChild.classList.remove('shipsunk'); 
                },1500);
                setTimeout(()=> {
                    aiAttack();
                },2500);
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
                    updateState('The enemy has hit one of your ships...');
                }
                if(enemyAttack.attempt==='sunk') {
                    updateState('Bad News... You just lost a ship...');
                }
                playerTurn=1;
                const currentTurn = document.querySelector('.currentTurn');
                currentTurn.textContent=`Turn: ${name1}`;
            };
            
        }
    }
    function gameOver(n) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const inner = document.createElement('div');
        inner.classList.add('inner');
        const text = document.createElement('div');
        text.classList.add('text');
        text.textContent="GAME OVER";
        const attribution = document.createElement('div');
        attribution.classList.add('attribution');
        attribution.textContent=`{n} wins the game!`;
        const okbutton = document.createElement('div');
        okbutton.classList.add('okbutton');
        okbutton.addEventListener('click', ()=> {
            wrapper.remove();
            document.body.innerHTML='';
            introStart();
        });
        wrapper.appendChild(inner);
        inner.appendChild(text);
        inner.appendChild(attribution);
        inner.appendChild(okbutton);
        document.body.appendChild(wrapper);
    }
    function updateState(t) {
        const stateText = document.querySelector('.stateText');
        // stateText.textContent='';
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
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const placeDiv = document.createElement('div');
        placeDiv.classList.add('placeDiv');
        const explanation = document.createElement('div');
        explanation.classList.add('explanation');
        explanation.innerHTML='Place your ships by dragging & dropping them on your board.<br><br>';
        explanation.innerHTML+='You can click a ship to rotate it.';
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
        document.body.appendChild(wrapper);
        okbutton.addEventListener('click', ()=> {
            if(checkbox.checked)showHint=false;
            wrapper.remove();
        });
    }
    function displayReadyToAttack(name1) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        const readyDiv = document.createElement('div');
        readyDiv.classList.add('readyDiv');
        const explanation = document.createElement('div');
        explanation.classList.add('explanation');
        explanation.innerHTML=`All ships have been placed.<br><br> ${name1} can start attacking.`;
        const okbutton = document.createElement('div');
        okbutton.classList.add('okbutton');
        okbutton.textContent='OK';
        readyDiv.appendChild(explanation);
        readyDiv.appendChild(okbutton);
        wrapper.appendChild(readyDiv);
        document.body.appendChild(wrapper);
        okbutton.addEventListener('click', ()=> {
            wrapper.remove();
            const currentTurn = document.querySelector('.currentTurn');
            currentTurn.textContent=`Turn: ${name1}`;
        });
    }
    //----
    return {introStart, makeBoards, currentGame, gameOver};
})();
function launch() {
    battleship.makeBoards();
}
battleship.introStart();




  

