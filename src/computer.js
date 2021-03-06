const letters = [
  'A', 'B', 'C', 'D', 
  'E', 'F', 'G', 'H', 
  'I', 'J', 'K', 'L', 
  'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X',
  'Y', 'Z'
];

const genCoordinate = (boardSize, ship, orientation, shipCoordinates) => {
  const result = {};
  let randX, randY;
  let shipLength;

  if (ship === 'carrier') {
    shipLength = 5;
  } else if (ship === 'battleship') {
    shipLength = 4;
  } else if (ship === 'cruiser') {
    shipLength = 3;
  } else if (ship === 'submarine') {
    shipLength = 3;
  } else if (ship === 'destroyer') {
    shipLength = 2;
  }
  
  if (orientation === 0) {
    randX = Math.ceil(Math.random() * (boardSize - shipLength));
    randY = Math.floor(Math.random() * boardSize);
  } else if (orientation === 1) {
    randX = Math.ceil(Math.random() * boardSize);
    randY = Math.floor(Math.random() * (boardSize - shipLength + 1));
  } else {
    randX = Math.ceil(Math.random() * boardSize);
    randY = Math.floor(Math.random() * boardSize);
  }

  // makes sure ships don't get placed on top of previously placed ships
  for (let i  = 0; i < shipLength; i++) {
    if (orientation === 0) {
      if (shipCoordinates[`p2-${letters[randY]}${randX + i}`]) {
        return genCoordinate(boardSize, ship, orientation, shipCoordinates);
      }
    } else if (orientation === 1) {
      if (shipCoordinates[`p2-${letters[randY + i]}${randX}`]) {
        return genCoordinate(boardSize, ship, orientation, shipCoordinates);
      }
    }
  }

  return { randX, randY };
};

const storeCoordinates = (shipCoordinates, shipLength, randX, randY, orientation, currentShip) => {
  for (let i = 0; i < shipLength; i++) {
    if (orientation === 0) {
      shipCoordinates[`p2-${letters[randY]}${randX + i}`] = `p2-ship-${currentShip}-${i + 1}`;
    } else if (orientation === 1) {
      shipCoordinates[`p2-${letters[randY + i]}${randX}`] = `p2-ship-${currentShip}-${i + 1}`;
    }
  }
}

const setUpComputerBoard = (io, { name, shipsNotPlaced, boardSize }) => {
  const shipCoordinates = {};
  let currentShip = 0;

  for (let ship of shipsNotPlaced) {
    if (ship === 'carrier') {
      const orientation = Math.round(Math.random());
      const { randX, randY } = genCoordinate(boardSize, ship, orientation, shipCoordinates)

      storeCoordinates(shipCoordinates, 5, randX, randY, orientation, currentShip);
    } else if (ship === 'battleship') {
      const orientation = Math.round(Math.random());
      const { randX, randY } = genCoordinate(boardSize, ship, orientation, shipCoordinates)

      storeCoordinates(shipCoordinates, 4, randX, randY, orientation, currentShip);
    } else if (ship === 'cruiser') {
      const orientation = Math.round(Math.random());
      const { randX, randY } = genCoordinate(boardSize, ship, orientation, shipCoordinates)

      storeCoordinates(shipCoordinates, 3, randX, randY, orientation, currentShip);
    } else if (ship === 'submarine') {
      const orientation = Math.round(Math.random());
      const { randX, randY } = genCoordinate(boardSize, ship, orientation, shipCoordinates)

      storeCoordinates(shipCoordinates, 3, randX, randY, orientation, currentShip);
    } else if (ship === 'destroyer') {
      const orientation = Math.round(Math.random());
      const { randX, randY } = genCoordinate(boardSize, ship, orientation, shipCoordinates)

      storeCoordinates(shipCoordinates, 2, randX, randY, orientation, currentShip);
    }
    currentShip++;
  }

  io.emit('log move', {
    player: 'game',
    name,
    message: 'hurry up silly human, I have computer things to do!'
  });
  return shipCoordinates;
};

const computerAttack = ({boardSize, cellsAttacked, difficulty }, shipCoordinates, cheat) => {
  const { randX, randY } = genCoordinate(boardSize);
  const shot = `p1-${letters[randY]}${randX}`;
  const cheapShot = Math.round(Math.random() * 120);
  
  if (difficulty === 'hard') {
    if (cheapShot < 20 || cheat) {
      const keys = Object.keys(shipCoordinates);
      const randKey = keys[Math.floor(Math.random() * keys.length)];

      if (cellsAttacked.hasOwnProperty(randKey)) {
        return computerAttack({boardSize, cellsAttacked, difficulty}, shipCoordinates, true);
      }
      cellsAttacked[randKey] = true;
      return randKey;
    }
  }
  if (difficulty === 'medium') {
    if (cheapShot < 10 || cheat) {
      const keys = Object.keys(shipCoordinates);
      const randKey = keys[Math.floor(Math.random() * keys.length)];

      if (cellsAttacked.hasOwnProperty(randKey)) {
        return computerAttack({boardSize, cellsAttacked, difficulty}, shipCoordinates, true);
      }
      cellsAttacked[randKey] = true;
      return randKey;
    }
  }
  if (difficulty === 'easy') {
    if (cheapShot < 5 || cheat) {
      const keys = Object.keys(shipCoordinates);
      const randKey = keys[Math.floor(Math.random() * keys.length)];

      if (cellsAttacked.hasOwnProperty(randKey)) {
        return computerAttack({boardSize, cellsAttacked, difficulty}, shipCoordinates, true);
      }
      cellsAttacked[randKey] = true;
      return randKey;
    }
  }

  if (cellsAttacked.hasOwnProperty(shot)) {
    return computerAttack({boardSize, cellsAttacked, difficulty}, shipCoordinates);
  }
  cellsAttacked[shot] = true;
  return `p1-${letters[randY]}${randX}`;
};

module.exports = {
  setUpComputerBoard,
  computerAttack,
}