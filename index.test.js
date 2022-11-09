const { default: expect } = require('expect');
const index = require('./index');
const Ship = index.Ship;
const Gameboard = index.Gameboard;
const myBoard = index.myBoard;

test('Board size', () => {
    expect(myBoard.board.length).toBe(10);
});

test('Place outside', () => {
    expect(myBoard.placeShip(3,9,9,'h')).toBe(false);
});

test('Place on top', () => {
    myBoard.placeShip(3,2,2,'h');
    expect(myBoard.placeShip(3,2,2,'h')).toBe(false);
});

test('Sunken ship', () => {
    const testShip = Ship(2);
    expect(testShip.isSunk()).toBe(false);
    testShip.hit();
    testShip.hit();    
    expect(testShip.hits).toBe(2);
    expect(testShip.isSunk()).toBe(true);
});

test('Number of Ships', () => {
    myBoard.placeShip(1,2,2);
    myBoard.placeShip(1,5,5);
    expect(myBoard.numberOfShips).toBe(2);
});