var express = require('express');
var path = require('path');
// Create a new Express application
var app = express();
app.use(express.static(path.join(__dirname,'..', 'client')));
// Create an http server with Node's HTTP module.
// Pass it the Express application, and listen on port 8080.
var server = require('http').createServer(app).listen(8080);
// Instantiate Socket.IO hand have it listen on the Express/HTTP server
var io = require('socket.io').listen(server);
username = {};
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname,'..', 'client')});
});
var playersturn = 0;

io.on('connection', function (socket) {
  console.log('User Connected');
  socket.on('hostCreateNewGame', function (data) {
    console.log('User wants to create game');
    // Create a unique Socket.IO Room
   var thisGameId = Math.floor(Math.random() * 90000) + 10000;
   // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
   this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});
   // Join the Room and wait for the players
   this.join(thisGameId.toString());
  });
  socket.on('playerJoinGame', function (data) {
    if (io.sockets.adapter.rooms[data.s_gamePIN] === undefined) {
      console.log('Room: ' + data.s_gamePIN + 'does not exist');
    }
    else {
      console.log('Player: ' + data.s_username + " joined game: " + data.s_gamePIN);
      username[this.id] = data.s_username;
      data.mySocketId = this.id;
      this.join(data.s_gamePIN.toString());
      io.to(data.s_gamePIN.toString()).emit('playerJoinedRoom', data);
    }
  });
  socket.on("playerStartGame", function(data) {
    io.to(data.s_gamePIN.toString()).emit('gameStarted', playersturn);
  });
});
