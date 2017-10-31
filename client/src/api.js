import io from 'socket.io-client'
const socket = io()

function onConnected (cb) {
  socket.on('connected', () => cb(socket.socket.sessionid))
}

function onPlayerJoinedRoom (cb) {
  socket.on('playerJoinedRoom', data => cb(data))
}

function onNewGameCreated (cb) {
  socket.on('newGameCreated', data => cb(data))
}

function onReceiveNewPlayerState (cb) {
  socket.on('newPlayerState', data => cb(data))
}

function createNewGame () {
  socket.emit('createNewGame')
}

function playerJoinGame (gameId) {
  socket.emit('playerJoinGame', {gameId: gameId})
}

function onPlayerFailedToJoinGame (cb) {
  socket.on('playerFailedToJoinGame', data => cb(data.message))
}

function startCountdown (id) {
  socket.emit('startCountdown', {gameId: id})
}

function onCountdownReceived (cb) {
  socket.on('count', data => cb(data.count))
}

function onGameStarted (cb) {
  socket.on('gameStarted', () => cb())
}

function playerStateChanged (gameId, playerId, state) {
  socket.emit('playerStateChanged', {gameId: gameId, playerId: playerId, state: state})
}

function onPlayerStateChanged (cb) {
  socket.on('playerStateChanged', data => cb(data.gameId, data.playerId, data.state))
}

function onCountdownStarted (cb) {
  socket.on('countdownStarted', () => cb())
}

function onGameEnded (cb) {
  socket.on('gameEnded', data => cb(data))
}
export default {
  onConnected,
  onPlayerJoinedRoom,
  onNewGameCreated,
  onReceiveNewPlayerState,
  createNewGame,
  playerJoinGame,
  onPlayerFailedToJoinGame,
  startCountdown,
  onCountdownReceived,
  onGameStarted,
  playerStateChanged,
  onPlayerStateChanged,
  onCountdownStarted,
  onGameEnded
}
