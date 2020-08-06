const socket = io('http://localhost:8000');

// Client Event Handlers
$('#btn-friend').on('click', () => {
  const inputAlias = $('#input-alias').val();

  if (!inputAlias || inputAlias.length < 3 || inputAlias.length > 14) {
    return $('.name-error-message').text('Stop! Name must be 3-14 characters in length')
  }
  socket.emit('name', inputAlias);
  makeFullscreen()
});

$('#btn-computer').on('click',() => {
  makeFullscreen();
});

// Server Event Handlers
socket.on('player joined', data => {
  updatePlayerName(data);
  createBoard(data);
  createShips(data);
  colorCurrentShip(data);
});

socket.on('load-hover-effects', data => {
  addBoardHoverEffects(data);
});

socket.on('click cell', data => {
  colorCurrentShip(data);
  unColorPlacedShip(data);
  addBoardHoverEffects(data);
});

socket.on('player disconnected', data => {
  updatePlayerName(data);
});
