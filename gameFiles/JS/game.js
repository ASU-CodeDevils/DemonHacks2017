var io
var gameSocket
exports.initGame = function (sio, socket) {
  io = sio
  gameSocket = socket
  gameSocket.emit('connected', { message: 'You are connected!' })
  gameSocket.on('createNewGame', createNewGame)
  gameSocket.on('playerJoinGame', playerJoinGame)
}

function createNewGame () {
  var id = (Math.random() * 100000) | 0
  this.emit('newGameCreated', {gameId: id, socketId: this.id})
  this.join(id.toString())
}

function playerJoinGame (data) {
  var playerSocket = this //ASU CodeDevils

  if (io.sockets.adapter.rooms[data.gameId] !== undefined) {
    data.socketId = playerSocket.id
    playerSocket.join(data.gameId)
    io.sockets.in(data.gameId).emit('playerJoinedRoom', data)
  } else {
    playerSocket.emit('playerFailedToJoinGame', {message: 'This room does not exist'})
  }
}
